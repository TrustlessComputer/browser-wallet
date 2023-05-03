import { Content } from '@/modules/SetupWallet/Create/components/SetPassword/styled';
import React from 'react';
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

export const REQUIRE_PASSWORD_LENGTH = 8;

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
      props.onConfirmPassword(password);
    }
  };

  return (
    <Content>
      <Text className="mt-60" size="h4" fontWeight="medium" align="center">
        Create password
      </Text>
      <Text color="text-secondary" size="h5" align="center" className="mt-24">
        This password will unlock your wallet only on this device.
      </Text>
      <Text color="text-secondary" size="h6" className="mt-60">
        Must be at least {REQUIRE_PASSWORD_LENGTH} characters.
      </Text>
      <Input
        title="Password"
        classContainer="mt-32"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={onChangePassword}
      />
      <PasswordStatus value={password} onPasswordStrong={onPasswordStrong} requireLength={REQUIRE_PASSWORD_LENGTH} />
      <Input
        title="Confirm password"
        classContainer="mt-24"
        type="password"
        placeholder="Re-enter password"
        value={confirmPassword}
        onChange={onChangeConfirmPassword}
      />
      {isStrongPassRef.current && (isMissMatch || props.errorMess) && (
        <AlertMessage
          type={AlertMessageType.error}
          message={props.errorMess || 'Password and Confirm Password does not match!'}
        />
      )}
      <Button className="mt-60" sizes="stretch" onClick={continueOnClick} disabled={!isStrongPassRef.current}>
        Continue
      </Button>
    </Content>
  );
};

export default SetPassword;
