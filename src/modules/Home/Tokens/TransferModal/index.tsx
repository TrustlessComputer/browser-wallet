import BaseModal from '@/components/BaseModal';
import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import isNumber from 'lodash/isNumber';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Container } from './TransferModal.styled';

type Props = {
  show: boolean;
  handleClose: () => void;
  erc20TokenAddress?: string;
};

interface IFormValue {
  toAddress: string;
  amount: string;
}

const TransferModal = (props: Props) => {
  const { show = false, handleClose, erc20TokenAddress } = props;

  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
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

  const handleSubmit = async (): Promise<void> => {
    if (!erc20TokenAddress) {
      toast.error('Token information not found');
      setIsProcessing(false);
      return;
    }

    // const { toAddress, amount } = values;
    try {
      setIsProcessing(true);
      // await run({
      //   amount: amount.toString(),
      //   to: toAddress,
      //   erc20TokenAddress: erc20TokenAddress,
      // });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <BaseModal show={show} handleClose={handleClose} title="Transfer Token" width={776}>
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
                title="TRANSFER TOKEN TO"
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

              <Button disabled={isProcessing} type="submit" className="confirm-btn">
                {isProcessing ? 'Processing...' : 'Transfer'}
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </BaseModal>
  );
};

export default TransferModal;
