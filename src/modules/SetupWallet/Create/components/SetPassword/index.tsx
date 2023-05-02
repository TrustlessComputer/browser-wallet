import Text from '@/components/Text';
import { Content } from '@/modules/SetupWallet/Create/components/SetPassword/styled';
import React from 'react';
import Spinner from '@/components/Spinner';
import Button from '@/components/Button';

interface SetPasswordProps {
  loading: boolean;
  errorMess?: string;
  onConfirmPassword: (password: string) => void;
}

const SetPassword = (props: SetPasswordProps) => {
  return <Content />;
};

export default SetPassword;
