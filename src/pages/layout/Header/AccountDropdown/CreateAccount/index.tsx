import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import Button from '@/components/Button';

type IFormValue = {
  name: string;
};

const CreateAccount = React.memo(() => {
  const [showForm, setShowForm] = useState(false);
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
    <Container>
      {showForm ? (
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
                  <Button sizes="small" variants="underline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button disabled={isProcessing} sizes="stretch" type="submit" className="confirm-btn">
                    {isProcessing ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="create-btn" onClick={() => setShowForm(true)}>
          <IconSVG src={`${CDN_URL_ICONS}/ic-plus-square-dark.svg`} maxWidth="20" />
          <Text color="text-primary" fontWeight="medium" size="body" className="text">
            Create new account
          </Text>
        </div>
      )}
    </Container>
  );
});

export default CreateAccount;
