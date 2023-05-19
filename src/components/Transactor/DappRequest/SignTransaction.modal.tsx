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
import { AdvanceWrapper, ButtonGroup, Container } from '@/components/Transactor/DappRequest/styled';
import Text from '@/components/Text';
import GasFee from '@/components/GasFee';
import { FeeRate } from '@/components/FeeRate';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import AccordionComponent from '@/components/Accordion';
import Button from '@/components/Button';
import { Row } from '@/components/Row';
import { ellipsisCenter } from '@/utils';
import network from '@/lib/network.helpers';
import throttle from 'lodash/throttle';
import useTransaction from '@/hooks/useTransaction';
import Spinner from '@/components/Spinner';
import { TransactionContext } from '@/contexts/transaction.context';

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
  const { maxFee, setGasLimit, error, setEstimating, estimating } = useGasFee();
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
  } = useFeeRate({ minFeeRate: undefined });

  const signMethod = React.useMemo(() => {
    return request.to ? functionName?.name || 'Unknow' : 'Deploy Contract';
  }, [request, functionName?.name]);

  const onEstimateGas = async () => {
    if (!userSecretKey) return;
    try {
      setEstimating(true);
      const gasLimit = await estimateGas({
        calldata: request.calldata,
        from: userSecretKey.address,
        to: request.to || '',
      });
      setGasLimit(gasLimit);
    } catch (error) {
      const { message } = getErrorMessage(error, 'estimateFee');
      toast.error(message);
    } finally {
      setEstimating(false);
    }
  };

  const getFunctionCall = async () => {
    if (request.functionName) {
      const method = {
        name: request.functionName.split('(')[0],
        function: request.functionName,
      };
      setFunctionName(method);
      return;
    }
    const functionName = await getSignatures(request.calldata);
    setFunctionName(functionName);
  };

  const debounceEstimateGas = React.useCallback(debounce(onEstimateGas, 300), [userSecretKey]);

  const onRejectRequest = async () => {
    if (!requestID || !userSecretKey) return;
    const connection = new TC_CONNECT.WalletConnect('', requestID);
    await connection.postResultSign({
      hash: '',
      nonce: 0,
      method: TC_CONNECT.RequestMethod.sign,
      isCancel: true,
    });
    onClose();
  };

  const onSignRequest = throttle(async () => {
    if (!requestID || !userSecretKey) return;
    setSubmitting(true);
    const connection = new TC_CONNECT.WalletConnect('', requestID);
    try {
      const transaction = await createAndSendTransaction({
        calldata: request.calldata,
        from: userSecretKey.address,
        to: request.to || '',
        feeRate: currentRate,
        gasLimit: maxFee.gasLimit,
        inscribeable: request.isInscribe,
        uninscribed: uninscribed,
        method: signMethod,
      });
      if (!transaction) {
        throw new WError(ERROR_CODE.INVALID_PARAMS);
      }
      await connection.postResultSign({
        hash: transaction.hash,
        nonce: transaction.nonce,
        method: TC_CONNECT.RequestMethod.sign,
      });
      toast.success('Sign transaction successfully');
    } catch (error) {
      const { message } = getErrorMessage(error, 'onSignRequest');
      toast.error(message);
      await connection.postResultSign({
        hash: '',
        nonce: 0,
        method: TC_CONNECT.RequestMethod.sign,
        errMsg: message,
      });
    } finally {
      setSubmitting(false);
      setTimeout(() => {
        getTransactions();
      }, 3000);
      onClose();
    }
  }, 300);

  useEffect(() => {
    debounceEstimateGas();
    debounceGetTransactions();
    const interval = setInterval(() => {
      debounceEstimateGas();
    }, 10000);
    return () => clearInterval(interval);
  }, [userSecretKey]);

  useAsyncEffect(getFunctionCall, []);

  return (
    <SignerModal
      show={!!requestID}
      onClose={onRejectRequest}
      title={
        <Text color="text-highlight" fontWeight="semibold" size="h4">
          {signMethod}
        </Text>
      }
    >
      <Container>
        <Row justify="space-between" className="mb-12 mt-32">
          <Text size="body-large">TO</Text>
          <Text size="body-large">
            <a href={`${network.current.Explorer}/address/${request.to}`} target="_blank">
              {ellipsisCenter({ str: request.to || '' })}
            </a>
          </Text>
        </Row>
        <GasFee fee={maxFee.feeText} error={error} />
        <AccordionComponent
          className="mt-24 mb-24"
          header="Advance"
          content={
            <AdvanceWrapper>
              <div className="box">
                {maxFee.gasLimitText && (
                  <Row justify="space-between">
                    <Text size="body-large" color="text-highlight">
                      Gas Limit
                    </Text>
                    <Text size="body-large">{maxFee.gasLimitText}</Text>
                  </Row>
                )}
                {!!functionName && (
                  <div className="mt-16">
                    <Text color="text-highlight" fontWeight="semibold">
                      FUNCTION TYPE
                    </Text>
                    <Text className="mt-8">{functionName.function}</Text>
                  </div>
                )}
                <div className="mt-16">
                  <Text color="text-highlight" fontWeight="semibold">
                    HEX DATA: 36 BYTES
                  </Text>
                  <Text className="mt-8">{request.calldata}</Text>
                </div>
              </div>
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
        <Button sizes="stretch" variants="outline">
          Cancel
        </Button>
        <Button
          sizes="stretch"
          disabled={estimating || submitting}
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
