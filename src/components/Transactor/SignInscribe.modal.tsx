import Button from '@/components/Button';
import React, { useEffect, useState } from 'react';
import { Container } from '@/components/Transactor/styled';
import SignerModal from '@/components/SignerModal';
import useContractOperation from '@/hooks/useContractOperation';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { FeeRate } from '@/components/FeeRate';
// import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import useGasFee from '@/components/GasFee/useGasFee';
import GasFee from '@/components/GasFee';
import useSignTransaction, { ISignTransaction } from '@/hooks/contracts-operation.ts/useSignTransaction';

type Props = {
  show: boolean;
  onClose: () => void;
};

const SignInscribeModal = (props: Props) => {
  const { show = false, onClose } = props;
  const [submitting] = useState(false);
  const [estimating] = useState(false);
  const { maxFee, error } = useGasFee();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const { estimateGas } = useContractOperation<ISignTransaction, TransactionResponse>({
    operation: useSignTransaction,
    inscribeable: true,
    feeRate: currentRate,
  });

  useEffect(() => {
    if (show) {
      onFetchFee();
    }
  }, [show]);

  // const onEstimateGas = async (payload: IFormValue) => {
  //   try {
  //     if (!estimateGas) {
  //       throw new WError(ERROR_CODE.INVALID_PARAMS);
  //     }
  //
  //     if (!payload.amount || !payload.toAddress) {
  //       setGasLimit(undefined);
  //       return;
  //     }
  //     setEstimating(true);
  //     const gasLimit = await estimateGas({
  //       encodedData: '123',
  //       receiver: payload.toAddress,
  //     });
  //     setGasLimit(gasLimit);
  //     setError('');
  //   } catch (error) {
  //     const { message } = getErrorMessage(error, 'estimateGas');
  //     setError(message);
  //   }
  //   setEstimating(false);
  // };

  return (
    <SignerModal show={show} onClose={onClose} title="Transfer TC">
      <Container>
        <GasFee fee={maxFee.feeText} error={error} />
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
        <Button
          disabled={submitting || estimating}
          type="submit"
          className="confirm-btn"
          isLoading={submitting || estimating}
        >
          {submitting ? 'Processing...' : 'Sign'}
        </Button>
      </Container>
    </SignerModal>
  );
};

export default SignInscribeModal;
