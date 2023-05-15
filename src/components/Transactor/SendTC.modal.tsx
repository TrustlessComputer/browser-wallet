import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import isNumber from 'lodash/isNumber';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Container } from '@/components/Transactor/styled';
import SignerModal from '@/components/SignerModal';
import useContractOperation from '@/hooks/useContractOperation';
import { validateEVMAddress } from '@/utils';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { FeeRate } from '@/components/FeeRate';
import { debounce } from 'lodash';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import useGasFee from '@/components/GasFee/useGasFee';
import { useUserSecretKey } from '@/state/wallet/hooks';
import GasFee from '@/components/GasFee';
import useTransferNativeToken, { ITransferNativeToken } from '@/hooks/contracts-operation.ts/useTransferNativeToken';
import { TC_ADDRESS_TEST } from '@/configs';

type Props = {
  show: boolean;
  onClose: () => void;
};

interface IFormValue {
  toAddress: string;
  amount: string;
}

const SendTCModal = (props: Props) => {
  const { show = false, onClose } = props;
  const [submitting, setSubmitting] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const userSecretKey = useUserSecretKey();
  const { maxFee, setGasLimit, error, setError } = useGasFee();

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

  const { run: onTransferERC20, estimateGas } = useContractOperation<ITransferNativeToken, TransactionResponse>({
    operation: useTransferNativeToken,
    inscribeable: true,
    feeRate: currentRate,
  });

  useEffect(() => {
    if (show) {
      onFetchFee();
    }
  }, [show]);

  const onEstimateGas = async (payload: IFormValue) => {
    try {
      if (!estimateGas) {
        throw new WError(ERROR_CODE.INVALID_PARAMS);
      }

      if (!payload.amount || !payload.toAddress) {
        setGasLimit(undefined);
        return;
      }
      setEstimating(true);
      const gasLimit = await estimateGas({
        receiver: payload.toAddress,
        amount: payload.amount,
      });
      setGasLimit(gasLimit);
      setError('');
    } catch (error) {
      const { message } = getErrorMessage(error, 'estimateGas');
      setError(message);
    }
    setEstimating(false);
  };

  const debounceEstimateGas = React.useCallback(debounce(onEstimateGas, 300), [
    userSecretKey?.privateKey,
    userSecretKey?.address,
  ]);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
    } else if (!validateEVMAddress(values.toAddress)) {
      errors.toAddress = 'Invalid receiver wallet address.';
    }

    if (!values.amount) {
      errors.amount = 'Amount is required.';
    } else if (!isNumber(values.amount)) {
      errors.amount = 'Invalid amount. Amount must be a number.';
    } else if (parseFloat(values.amount) <= 0) {
      errors.amount = 'Invalid amount. Amount must be greater than 0.';
    }
    debounceEstimateGas(values);
    return errors;
  };

  const handleSubmit = async (payload: IFormValue): Promise<void> => {
    try {
      setSubmitting(true);
      const tx = await onTransferERC20({
        receiver: payload.toAddress,
        amount: payload.amount,
      });
      if (tx.hash) {
        toast.success('Transaction has been created. Please wait for few minutes.');
      }
      onClose();
    } catch (err) {
      toast.error((err as Error).message);
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignerModal show={show} onClose={onClose} title="Transfer TC">
      <Container>
        <Formik
          key="create"
          initialValues={{
            toAddress: TC_ADDRESS_TEST || '',
            amount: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form className="form" onSubmit={handleSubmit}>
              <Input
                title="TRANSFER TC TO"
                id="toAddress"
                type="text"
                name="toAddress"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.toAddress}
                className="input"
                placeholder={`Paste TC wallet address here`}
                errorMsg={errors.toAddress && touched.toAddress ? errors.toAddress : undefined}
              />

              <Input
                title="AMOUNT"
                id="amount"
                type="number"
                name="amount"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.amount}
                className="input"
                placeholder={`Enter the amount`}
                errorMsg={errors.amount && touched.amount ? errors.amount : undefined}
              />
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
                {submitting ? 'Processing...' : 'Transfer'}
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </SignerModal>
  );
};

export default SendTCModal;
