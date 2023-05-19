import SignerModal from '@/components/SignerModal';
import React from 'react';
import * as TC_CONNECT from 'tc-connect';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { useSignTransaction } from '@/hooks/useSignTransaction';
import useAsyncEffect from 'use-async-effect';
import { debounce } from 'lodash';
import { getSignatures } from '@/services/signature';
import useGasFee from '@/components/GasFee/useGasFee';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';
import { FunctionItem } from '@/interfaces/api/signature';
import { Container, ButtonGroup, AdvanceWrapper } from '@/components/Transactor/DappRequest/styled';
import Text from '@/components/Text';
import GasFee from '@/components/GasFee';
import { FeeRate } from '@/components/FeeRate';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import AccordionComponent from '@/components/Accordion';
import Button from '@/components/Button';

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const SignTransactionModal = ({ requestID, request }: IProps) => {
  const [functionName, setFunctionName] = React.useState<FunctionItem | undefined>(undefined);
  const userSecretKey = useUserSecretKey();
  const { estimateGas } = useSignTransaction();
  const { maxFee, setGasLimit, error, setEstimating } = useGasFee();
  const {
    feeRate,
    onChangeFee,
    onChangeCustomFee,
    currentRateType,
    currentRate,
    customRate,
    isLoading: isLoadingRate,
  } = useFeeRate({ minFeeRate: undefined });

  const onRejectRequest = () => {
    if (!requestID || !userSecretKey) return;
  };

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
    const functionName = await getSignatures(request.calldata);
    setFunctionName(functionName);
  };

  const debounceEstimateGas = React.useCallback(debounce(onEstimateGas, 300), [userSecretKey]);

  useAsyncEffect(debounceEstimateGas, [userSecretKey]);
  useAsyncEffect(getFunctionCall, []);

  return (
    <SignerModal show={!!requestID} onClose={onRejectRequest} title="Sign transaction">
      <Container>
        <Text size="h6" color="text-highlight" style={{ textTransform: 'uppercase' }}>
          {functionName?.name || 'unknow'}
        </Text>
        <GasFee fee={maxFee.feeText} error={error} />
        <AccordionComponent
          className="mt-24 mb-24"
          header="Advance"
          content={
            <AdvanceWrapper>
              {!!functionName && (
                <div className="box">
                  <Text color="text-secondary" fontWeight="semibold">
                    Function
                  </Text>
                  <Text className="mt-8">{functionName.function}</Text>
                </div>
              )}
              <div className="box mt-16">
                <Text color="text-secondary" fontWeight="semibold">
                  Call data
                </Text>
                <Text className="mt-8">{request.calldata}</Text>
              </div>
            </AdvanceWrapper>
          }
        />
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
          />
        )}
      </Container>
      <ButtonGroup className="mt-32">
        <Button sizes="stretch" variants="outline">
          Cancel
        </Button>
        <Button sizes="stretch">Sign</Button>
      </ButtonGroup>
    </SignerModal>
  );
};

export default SignTransactionModal;
