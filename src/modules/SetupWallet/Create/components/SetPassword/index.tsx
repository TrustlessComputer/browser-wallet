import { Content } from '@/modules/SetupWallet/Create/components/SetPassword/styled';
import React, { useEffect } from 'react';
import { Input } from '@/components/Inputs';
import Text from '@/components/Text';
import Button from '@/components/Button';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';
import PasswordStatus from '@/components/PasswordStatus';
import { MOCKUP_PASSWORD } from '@/configs';

interface SetPasswordProps {
  loading: boolean;
  errorMess?: string;
  onConfirmPassword: (password: string) => void;
}

export const REQUIRE_PASSWORD_LENGTH = 4;

const SetPassword = (props: SetPasswordProps) => {
  const [password, setPassword] = React.useState(MOCKUP_PASSWORD);
  const [confirmPassword, setConfirmPassword] = React.useState(MOCKUP_PASSWORD);
  const [isMissMatch, setMisMatch] = React.useState(false);
  const isStrongPassRef = React.useRef(false);

  const onChangePassword = (event: any) => {
    const input = event.target.value;
    setPassword(input);
    setMisMatch(false);
    isStrongPassRef.current = false;
  };

  const onChangeConfirmPassword = (event: any) => {
    const input = event.target.value;
    setMisMatch(false);
    setConfirmPassword(input);
  };

  const onPasswordStrong = () => {
    isStrongPassRef.current = true;
  };

  const continueOnClick = () => {
    if (password.length !== confirmPassword.length || password !== confirmPassword) {
      setMisMatch(true);
    } else {
      if (isStrongPassRef.current) {
        props.onConfirmPassword(password);
      }
    }
  };

  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void }) => {
      if (event.key === 'Enter' && isStrongPassRef.current) {
        event.preventDefault();
        continueOnClick();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [isStrongPassRef, password, confirmPassword]);

  return (
    <Content>
      <Text className="mt-48" size="h4" fontWeight="medium" align="center">
        Create password
      </Text>
      <Text color="text-secondary" size="h6" align="center" fontWeight="regular" className="mt-16">
        This password will unlock your wallet only on this device.
      </Text>

      <div className="input-container mt-60">
        <div className="wrap-title">
          <Text color="text-secondary" size="body-large">
            Must be at least {REQUIRE_PASSWORD_LENGTH} characters.
          </Text>
        </div>
        <Input
          title="Password"
          classContainer="mt-24 mb-8"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={onChangePassword}
        />
        <PasswordStatus value={password} onPasswordStrong={onPasswordStrong} requireLength={REQUIRE_PASSWORD_LENGTH} />
        <Input
          title="Confirm password"
          classContainer="mt-16 mb-24"
          type="password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />

        {(isMissMatch || props.errorMess) && (
          <AlertMessage
            type={AlertMessageType.error}
            message={props.errorMess || 'Password and Confirm Password does not match!'}
          />
        )}
        <Button className="mt-32" sizes="stretch" onClick={continueOnClick}>
          Continue
        </Button>
      </div>
    </Content>
  );
};

export default SetPassword;
