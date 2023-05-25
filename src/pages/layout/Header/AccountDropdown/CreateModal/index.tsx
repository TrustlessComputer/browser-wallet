import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import SignerModal from '@/components/SignerModal';
import { Formik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { CreateAccountAction } from '@/pages/layout/Header/AccountDropdown/CreateAccount.actions';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector, masterWalletSelector, passwordSelector } from '@/state/wallet/selector';
import { getErrorMessage } from '@/utils/error';
import throttle from 'lodash/throttle';

type IFormValue = {
  name: string;
};

interface Props {
  show: boolean;
  handleClose: () => void;
}

const CreateAccount = React.memo((props: Props) => {
  const { show, handleClose } = props;
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const masterIns = useAppSelector(masterWalletSelector);
  const password = useAppSelector(passwordSelector);
  const accounts = useAppSelector(listAccountsSelector);

  const createAccountActions = new CreateAccountAction({
    component: {
      setLoading,
      password,
      masterIns,
      accounts,
    },
    dispatch: dispatch,
  });

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name) {
      errors.name = 'Account name is required.';
    }

    return errors;
  };

  const handleSubmit = throttle(async (params: IFormValue): Promise<void> => {
    try {
      await createAccountActions.createAccount(params.name);
      toast.success('Create account successfully');
      handleClose();
    } catch (err) {
      const { message } = getErrorMessage(err, 'submitCreateAccount');
      toast.error(message);
    }
  }, 1000);

  return (
    <SignerModal show={show} onClose={handleClose} title="Create Account" width={600}>
      <Container>
        <div className="form-container">
          <Formik
            key="transfer"
            initialValues={{
              name: `Account ${accounts.length + 1}`,
            }}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
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
                  autoFocus={true}
                  placeholder={`Account name`}
                  errorMsg={errors.name && touched.name ? errors.name : undefined}
                />
                <div className="actions">
                  <Button disabled={loading || isSubmitting} sizes="stretch" type="submit" className="confirm-btn">
                    {loading ? 'Creating...' : 'Create'}
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
