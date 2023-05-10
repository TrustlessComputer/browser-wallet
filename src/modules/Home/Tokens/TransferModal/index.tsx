import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import isNumber from 'lodash/isNumber';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Container } from './TransferModal.styled';
import SignerModal from '@/components/SignerModal';
import useContractOperation from '@/hooks/useContractOperation';
import useTransferERC20, { ITransferERC20 } from '@/hooks/contracts-operation.ts/useTransferERC20';
import { validateEVMAddress } from '@/utils';
import { TransactionResponse } from '@ethersproject/abstract-provider';

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
  const [submitting, setSubmitting] = useState(false);

  const { run: onTransferERC20 } = useContractOperation<ITransferERC20, TransactionResponse>({
    operation: useTransferERC20,
    inscribeable: true,
  });

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

    return errors;
  };

  const handleSubmit = async (payload: IFormValue): Promise<void> => {
    if (!erc20TokenAddress) {
      toast.error('Token information not found');
      setSubmitting(false);
      return;
    }
    try {
      setSubmitting(true);
      const tx = await onTransferERC20({
        receiver: payload.toAddress,
        amount: payload.amount,
        tokenAddress: erc20TokenAddress,
      });
      if (tx.hash) {
        toast.success('Transaction has been created. Please wait for few minutes.');
      }
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignerModal show={show} onClose={handleClose} title="Transfer Token">
      <Container>
        <Formik
          key="create"
          initialValues={{
            toAddress: '0x2699ff693FA45234595b6a1CaB6650c849380893',
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
              <Button disabled={submitting} type="submit" className="confirm-btn" isLoading={submitting}>
                {submitting ? 'Processing...' : 'Transfer'}
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </SignerModal>
  );
};

export default TransferModal;
