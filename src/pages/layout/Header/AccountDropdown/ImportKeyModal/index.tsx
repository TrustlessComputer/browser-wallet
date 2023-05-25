import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import SignerModal from '@/components/SignerModal';
import { Formik } from 'formik';
import React from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { ImportKeyAction } from '@/pages/layout/Header/AccountDropdown/ImportKey.actions';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector, masterWalletSelector, passwordSelector } from '@/state/wallet/selector';
import { getErrorMessage } from '@/utils/error';
import { verifyEtherPrivateKey } from '@/utils';

type IFormValue = {
  name: string;
  privateKey: string;
};

interface Props {
  show: boolean;
  handleClose: () => void;
}

const ImportKey = React.memo((props: Props) => {
  const { show, handleClose } = props;
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const masterIns = useAppSelector(masterWalletSelector);
  const password = useAppSelector(passwordSelector);
  const accounts = useAppSelector(listAccountsSelector);

  const importKeyActions = new ImportKeyAction({
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

    if (!values.privateKey) {
      errors.privateKey = 'Private key is required.';
    } else if (!verifyEtherPrivateKey(values.privateKey)) {
      errors.privateKey = 'Invalid private key.';
    }

    return errors;
  };

  const handleSubmit = async (params: IFormValue): Promise<void> => {
    try {
      await importKeyActions.importKey(params.name, params.privateKey);
      toast.success('Import account successfully');
      handleClose();
    } catch (err) {
      const { message } = getErrorMessage(err, 'submitCreateAccount');
      toast.error(message);
    }
  };

  return (
    <SignerModal show={show} onClose={handleClose} title="Import Private Key" width={600}>
      <Container>
        <div className="form-container">
          <Formik
            key="transfer"
            initialValues={{
              name: `Account ${accounts.length + 1}`,
              privateKey: '',
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
                  placeholder={`Account name`}
                  errorMsg={errors.name && touched.name ? errors.name : undefined}
                />
                <Input
                  title="PRIVATE KEY"
                  id="privateKey"
                  type="text"
                  name="privateKey"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.privateKey}
                  classContainer="mt-24"
                  className="input"
                  autoFocus={true}
                  placeholder="Enter private key"
                  errorMsg={errors.privateKey && touched.privateKey ? errors.privateKey : undefined}
                />
                <div className="actions">
                  <Button disabled={loading || isSubmitting} sizes="stretch" type="submit" className="confirm-btn">
                    {loading ? 'Importing...' : 'Import'}
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

export default ImportKey;
