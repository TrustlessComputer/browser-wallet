import BaseModal from '@/components/BaseModal';
import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Container } from './TransferModal.styled';

type Props = {
  show: boolean;
  handleClose: () => void;
  name: string;
};

type IFormValue = {
  address: string;
};

const BNSTransferModal = (props: Props) => {
  const { show, handleClose } = props;
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'TC address is required.';
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    // const { address } = values;
    try {
      setIsProcessing(true);
      // await run({
      //   to: address,
      //   name: name,
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
    <BaseModal show={show} handleClose={handleClose} title="Transfer Token" width={600}>
      <Container>
        <Formik
          key="transfer"
          initialValues={{
            address: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Input
                title="TRANSFER NAME TO"
                id="address"
                type="text"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                className="input"
                placeholder={`Paste TC wallet address here`}
                errorMsg={errors.address && touched.address ? errors.address : undefined}
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

export default BNSTransferModal;
