import React, { useEffect, useState } from 'react';
import SignerModal from '@/components/SignerModal';
import { Container } from '@/components/Transactor/styled';
import { Input } from '@/components/Inputs';
import { FeeRate } from '@/components/FeeRate';
import Button from '@/components/Button';
import { Formik } from 'formik';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { validateBTCAddress } from '@/utils';
import isNumber from 'lodash/isNumber';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/error';
import useBitcoin from '@/hooks/useBitcoin';

interface IProps {
  show: boolean;
  onClose: () => void;
}

interface IFormValue {
  toAddress: string;
  amount: string;
}

const SendBTCModal = React.memo(({ show, onClose }: IProps) => {
  const [submitting, setSubmitting] = useState(false);

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
  const { onSendBTC } = useBitcoin();

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
    } else if (!validateBTCAddress(values.toAddress)) {
      errors.toAddress = 'Invalid receiver wallet address.';
    }

    if (!values.amount) {
      errors.amount = 'Amount is required.';
    } else if (!isNumber(values.amount)) {
      errors.amount = 'Invalid amount. Amount must be a number.';
    } else if (parseFloat(values.amount) <= 0) {
      errors.amount = 'Invalid amount. Amount must be greater than 0.';
    }

    return errors;
  };

  const handleSubmit = async (payload: IFormValue): Promise<void> => {
    try {
      setSubmitting(true);
      await onSendBTC({
        receiver: payload.toAddress,
        amount: payload.amount,
        feeRate: currentRate,
      });
      toast.success('Transferred successfully');
      onClose();
    } catch (err) {
      const { desc } = getErrorMessage(err, 'transferBTC');
      toast.error(desc);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      onFetchFee();
    }
  }, [show]);

  return (
    <SignerModal show={show} onClose={onClose} title="Transfer BTC">
      <Container>
        <Formik
          key="create"
          initialValues={{
            toAddress: '',
            amount: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form className="form" onSubmit={handleSubmit}>
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
              <Input
                title="TRANSFER BTC TO"
                id="toAddress"
                type="text"
                name="toAddress"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.toAddress}
                className="input"
                placeholder={`Paste BTC wallet address here`}
                errorMsg={errors.toAddress && touched.toAddress ? errors.toAddress : undefined}
              />
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
              <Button disabled={submitting} type="submit" className="confirm-btn" isLoading={submitting}>
                {submitting ? 'Processing...' : 'Transfer'}
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </SignerModal>
  );
});

export default SendBTCModal;
