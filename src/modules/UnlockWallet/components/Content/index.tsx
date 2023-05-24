import React from 'react';
import { Container } from './styled';
import Logo from '@/components/icons/Logo';
import Text from '@/components/Text';
import { Input } from '@/components/Inputs';
import { REQUIRE_PASSWORD_LENGTH } from '@/modules/SetupWallet/Create/components/SetPassword';
import Button from '@/components/Button';
import { UnlockWalletAction } from '@/modules/UnlockWallet/Unlock.actions';
import { useAppDispatch } from '@/state/hooks';
import { ISetMasterCreated } from '@/state/wallet/types';
import LoadingContainer from '@/components/Loader';
import { MOCKUP_PASSWORD } from '@/configs';
import { Formik } from 'formik';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';

interface IFormValue {
  password: string;
}

interface IProps {
  onSuccess: (data: ISetMasterCreated) => Promise<void>;
}

const UnlockContent = React.memo((props: IProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const unlockWalletActions = new UnlockWalletAction({
    component: {
      setLoading,
      setErrMess: setError,
    },
    dispatch,
  });

  const onSubmit = async (payload: IFormValue) => {
    try {
      const data = await unlockWalletActions.unlockWallet(payload.password);
      if (data && props.onSuccess) {
        await props.onSuccess(data);
      }
    } catch (error) {
      const { message } = getErrorMessage(error, 'password');
      toast.error(message);
    }
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.password) {
      errors.password = 'Please enter password.';
    } else if (values.password.length < REQUIRE_PASSWORD_LENGTH) {
      errors.password = `Must be at least ${REQUIRE_PASSWORD_LENGTH} characters.`;
    }

    return errors;
  };

  return (
    <Container>
      <Logo className="mt-32" />
      <Text className="mt-16" size="h4" fontWeight="medium">
        Unlock your wallet
      </Text>
      <Text color="text-secondary" size="h5" align="center" className="">
        Enter your password to unlock your wallet.
      </Text>
      <Formik
        key="password"
        initialValues={{
          password: MOCKUP_PASSWORD || '',
        }}
        validate={validateForm}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <form className="form mt-32" onSubmit={handleSubmit}>
            <Input
              title="Password"
              id="password"
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              className="mt-32"
              placeholder="Enter the amount"
              errorMsg={error || (errors.password && touched.password) ? errors.password : undefined}
            />
            <Button sizes="stretch" className="mt-48" type="submit">
              Unlock Wallet
            </Button>
          </form>
        )}
      </Formik>
      <LoadingContainer loaded={!loading} opacity={60} />
    </Container>
  );
});

export default UnlockContent;
