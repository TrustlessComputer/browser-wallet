import SignerModal from '@/components/SignerModal';
import React, { useContext, useEffect } from 'react';
import * as TC_CONNECT from 'tc-connect';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import useAsyncEffect from 'use-async-effect';
import { debounce } from 'lodash';
import { getSignatures } from '@/services/signature';
import useGasFee from '@/components/GasFee/useGasFee';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';
import { FunctionItem } from '@/interfaces/api/signature';
import {
  AdvanceWrapper,
  ButtonGroup,
  Container,
  ContentBox,
  Divider,
} from '@/components/Transactor/DappRequest/styled';
import Text from '@/components/Text';
import GasFee from '@/components/GasFee';
import { FeeRate } from '@/components/FeeRate';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import AccordionComponent from '@/components/Accordion';
import Button from '@/components/Button';
import network from '@/lib/network.helpers';
import throttle from 'lodash/throttle';
import useTransaction from '@/hooks/useTransaction';
import Spinner from '@/components/Spinner';
import { TransactionContext } from '@/contexts/transaction.context';
import SelectAccount from '@/components/SelectAccount';
import { getConnector } from '@/lib/connector.helper';
import { handleRequestEnd } from '@/components/Transactor/DappRequest/utils';

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const SignTransactionModal = ({ requestID, request, onClose }: IProps) => {
  const [functionName, setFunctionName] = React.useState<FunctionItem | undefined>(undefined);
  const [submitting, setSubmitting] = React.useState(false);
  const userSecretKey = useUserSecretKey();
  const { estimateGas, createAndSendTransaction } = useSignTransaction();
  const { getTransactions } = useContext(TransactionContext);
  const { debounceGetTransactions, uninscribed, sizeByte } = useTransaction({
    isGetUnInscribedSize: true,
    isSignTransaction: true,
  });

  const {
    feeRate,
    onChangeFee,
    onChangeCustomFee,
    currentRateType,
    currentRate,
    customRate,
    isLoading: isLoadingRate,
    onFetchFee,
  } = useFeeRate({ minFeeRate: undefined });

  const { maxFee, setGasLimit, error, setEstimating, estimating, setError } = useGasFee({
    defaultGasPrice: request.gasPrice || undefined,
    btcFeeRate: request.isInscribe ? currentRate : undefined,
    sizeByte: request.isInscribe ? sizeByte : undefined,
  });

  const signMethod = React.useMemo(() => {
    return functionName?.name ? functionName?.name : request.to ? 'Contract Deployment' : 'Unknow';
  }, [request, functionName?.name]);

  const onEstimateGas = async () => {
    if (!userSecretKey) return;
    try {
      setEstimating(true);
      const gasLimit = request.gasLimit
        ? Number(request.gasLimit)
        : await estimateGas({
            calldata: request.calldata,
            from: userSecretKey.address,
            to: request.to || '',
          });

      if (request.gasLimit) {
        await estimateGas({
          calldata: request.calldata,
          from: userSecretKey.address,
          to: request.to || '',
        });
      }
      setGasLimit(gasLimit);
      setError('');
    } catch (error) {
      const { message } = getErrorMessage(error, 'estimateFee');
      setError(message);
    } finally {
      setEstimating(false);
    }
  };

  const getFunctionCall = async () => {
    if (request.functionName) {
      const method = {
        name: request?.functionType || request.functionName.split('(')[0],
        function: request.functionName,
      };
      setFunctionName(method);
      return;
    }
    const functionName = await getSignatures(request.calldata);
    setFunctionName(functionName);
  };

  const debounceEstimateGas = React.useCallback(debounce(onEstimateGas, 300), [userSecretKey]);

  const onHide = async () => {
    if (!requestID || !userSecretKey) return;
    const connector = getConnector(requestID);
    await connector.postResultSign({
      tcHash: '',
      btcHash: '',
      nonce: 0,
      method: TC_CONNECT.RequestMethod.sign,
      isReject: true,
    });
    onClose();
  };
  const onRequestEnd = () => {
    handleRequestEnd({
      target: request.target,
      redirectURL: request.redirectURL || '',
    });
  };
  const onRejectRequest = async () => {
    await onHide();
    onRequestEnd();
  };

  const onSignRequest = throttle(async () => {
    if (!requestID || !userSecretKey) return;
    setSubmitting(true);
    const connector = getConnector(requestID);
    try {
      const transaction = await createAndSendTransaction({
        calldata: request.calldata,
        from: userSecretKey.address,
        to: request.to || '',
        feeRate: currentRate,
        gasLimit: maxFee.gasLimit,
        gasPrice: maxFee.gasPrice,
        inscribeable: request.isInscribe,
        uninscribed: uninscribed,
        method: signMethod,
        site: request.site,
      });
      if (!transaction) {
        throw new WError(ERROR_CODE.INVALID_PARAMS);
      }
      await connector.postResultSign({
        tcHash: transaction.hash,
        btcHash: transaction.btcHash || '',
        nonce: transaction.nonce,
        method: TC_CONNECT.RequestMethod.sign,
      });
      toast.success('Sign transaction successfully');
    } catch (error) {
      const { desc } = getErrorMessage(error, 'onSignRequest');
      toast.error(desc);
      await connector.postResultSign({
        tcHash: '',
        btcHash: '',
        nonce: 0,
        method: TC_CONNECT.RequestMethod.sign,
        errMsg: desc,
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        getTransactions();
      }, 3000);
      onClose();
      onRequestEnd();
    }
  }, 300);

  useEffect(() => {
    debounceEstimateGas();
    debounceGetTransactions();
    const interval = setInterval(() => {
      debounceEstimateGas();
      onFetchFee();
    }, 10000);
    return () => clearInterval(interval);
  }, [userSecretKey]);

  useAsyncEffect(getFunctionCall, []);

  return (
    <SignerModal show={!!requestID} onClose={onHide} title="Sign Transaction">
      <Container>
        <Text color="text-highlight" fontWeight="semibold" size="h5" className="function-name">
          {signMethod}
        </Text>
        <GasFee fee={maxFee.feeText} error={error} />
        <Divider className="mb-24 mt-24" />
        <SelectAccount className="mb-16" />
        {!!request.to && (
          <>
            <Text size="note" color="text-secondary">
              TRANSFER TO
            </Text>
            <ContentBox>
              <Text size="body">
                <a href={`${network.current.Explorer}/address/${request.to}`} target="_blank">
                  {request.to}
                </a>
              </Text>
            </ContentBox>
          </>
        )}
        <Divider className="mt-24 mb-24" />
        <AccordionComponent
          className="mt-24 mb-24"
          header="Advance"
          content={
            <AdvanceWrapper>
              <>
                {!!maxFee.gasPriceText && (
                  <div>
                    <Text size="note" color="text-secondary">
                      Gas Price
                    </Text>
                    <div className="box">
                      <Text size="body">{maxFee.gasPriceText} GWEI</Text>
                    </div>
                  </div>
                )}
                {!!maxFee.gasLimitText && (
                  <>
                    <Text size="note" color="text-secondary" className="mt-16">
                      Gas Limit
                    </Text>
                    <div className="box">
                      <Text size="body">{maxFee.gasLimitText}</Text>
                    </div>
                  </>
                )}
                {!!functionName && (
                  <div className="mt-16">
                    <Text size="note" color="text-secondary">
                      FUNCTION TYPE
                    </Text>
                    <div className="box">
                      <Text size="body">{functionName.function}</Text>
                    </div>
                  </div>
                )}
                {!!request.calldata && (
                  <div className="mt-16">
                    <Text size="note" color="text-secondary">
                      HEX DATA: 36 BYTES
                    </Text>
                    <div className="box">
                      <Text size="body">{request.calldata}</Text>
                    </div>
                  </div>
                )}
              </>
            </AdvanceWrapper>
          }
        />
        {submitting && (
          <div className="loader">
            <Spinner />
          </div>
        )}
        {Boolean(request.isInscribe) && (
          <FeeRate
            allRate={feeRate}
            isCustom={true}
            onChangeFee={onChangeFee}
            onChangeCustomFee={onChangeCustomFee}
            currentRateType={currentRateType}
            currentRate={currentRate}
            customRate={customRate}
            isLoading={isLoadingRate}
            options={{
              type: 'inscribe',
              sizeByte: sizeByte,
            }}
          />
        )}
      </Container>
      <ButtonGroup className="mt-32">
        <Button sizes="stretch" variants="outline" onClick={onRejectRequest}>
          Cancel
        </Button>
        <Button
          sizes="stretch"
          disabled={estimating || submitting || !!error}
          isLoading={estimating || submitting}
          onClick={onSignRequest}
        >
          Sign
        </Button>
      </ButtonGroup>
    </SignerModal>
  );
};

export default SignTransactionModal;
