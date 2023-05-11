import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import SignerModal from '@/components/SignerModal';
import { Formik } from 'formik';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Container from './styled';

type IFormValue = {
  name: string;
};

interface Props {
  show: boolean;
  handleClose: () => void;
}

const CreateAccount = React.memo((props: Props) => {
  const { show, handleClose } = props;

  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name) {
      errors.name = 'Account name is required.';
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setIsProcessing(true);

      toast.success('');
    } catch (err) {
      toast.error((err as Error).message);
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SignerModal show={show} onClose={handleClose} title="Create Account">
      <Container>
        <div className="form-container">
          <Formik
            key="transfer"
            initialValues={{
              name: '',
            }}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
                <Input
                  title="ACCOUNT NAME"
                  id="name"
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  className="input"
                  placeholder={`Account name`}
                  errorMsg={errors.name && touched.name ? errors.name : undefined}
                />
                <div className="actions">
                  <Button disabled={isProcessing} sizes="stretch" type="submit" className="confirm-btn">
                    {isProcessing ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Container>
    </SignerModal>
  );
});

export default CreateAccount;
