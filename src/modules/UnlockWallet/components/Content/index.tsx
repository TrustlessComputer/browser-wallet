import React from 'react';
import { Container } from './styled';
import Logo from '@/components/icons/Logo';
import Text from '@/components/Text';
import { Input } from '@/components/Inputs';
import { REQUIRE_PASSWORD_LENGTH } from '@/modules/SetupWallet/Create/components/SetPassword';
import Button from '@/components/Button';
import AlertMessage, { AlertMessageType } from '@/components/AlertMessage/AlertMessage';
import { UnlockWalletAction } from '@/modules/UnlockWallet/Unlock.actions';
import { useAppDispatch } from '@/state/hooks';
import { ISetMasterCreated } from '@/state/wallet/types';
import LoadingContainer from '@/components/Loader';
import { isKeepSign, MOCKUP_MNEMONIC, MOCKUP_PASSWORD } from '@/configs';
import useAsyncEffect from 'use-async-effect';

interface IProps {
  onSuccess: (data: ISetMasterCreated) => Promise<void>;
}

const UnlockContent = React.memo((props: IProps) => {
  const dispatch = useAppDispatch();
  const [password, setPassword] = React.useState(MOCKUP_PASSWORD);
  const [touched, setTouched] = React.useState(false);
  const [loading, setLoading] = React.useState(isKeepSign || false);
  const [error, setError] = React.useState('');

  const unlockWalletActions = new UnlockWalletAction({
    component: {
      setLoading,
      setErrMess: setError,
    },
    dispatch,
  });

  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const onTouched = () => {
    setTouched(true);
  };

  const isValid = !!password && password.length >= REQUIRE_PASSWORD_LENGTH;

  const isEnableButton = React.useMemo(() => {
    if (!touched) return false;
    return isValid;
  }, [touched, isValid]);

  const onUnlock = async () => {
    try {
      const data = await unlockWalletActions.unlockWallet(password);
      if (data && props.onSuccess) {
        await props.onSuccess(data);
      }
    } catch (e) {
      /* error handled in [unlockWallet] action */
    }
  };

  useAsyncEffect(() => {
    if (isKeepSign && MOCKUP_PASSWORD && MOCKUP_MNEMONIC) {
      onUnlock().then().catch();
    }
  }, []);

  return (
    <Container>
      <Logo className="mt-32" />
      <Text className="mt-16" size="h4" fontWeight="medium">
        Unlock your wallet
      </Text>
      <Text color="text-secondary" size="h5" align="center" className="">
        Enter your password to unlock your wallet.
      </Text>
      <Input
        title="Password"
        classContainer="mt-32"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={onChangePassword}
        onMouseMove={onTouched}
        onKeyDown={(event: any) => {
          if ((event.which == 13 || event.keyCode == 13) && isEnableButton) {
            onUnlock();
          }
        }}
      />
      {((touched && !isValid) || !!error) && (
        <AlertMessage
          type={AlertMessageType.error}
          message={error || `Must be at least ${REQUIRE_PASSWORD_LENGTH} characters.`}
        />
      )}
      <Button sizes="stretch" className="mt-48" disabled={!isEnableButton || loading} onClick={onUnlock}>
        Unlock Wallet
      </Button>
      <LoadingContainer loaded={!loading} opacity={isKeepSign ? 100 : 60} />
    </Container>
  );
});

export default UnlockContent;
