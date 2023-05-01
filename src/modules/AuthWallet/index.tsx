import React from 'react';
import { useAppSelector } from '@/state/hooks';
import { isShowSetupSelector } from '@/state/user/selector';
import SetupWallet from '@/modules/SetupWallet';
import UnlockWallet from '@/modules/UnlockWallet';

const AuthWallet = React.memo(() => {
  const isShowSetup = useAppSelector(isShowSetupSelector);
  if (isShowSetup) {
    return <SetupWallet />;
  }

  return <UnlockWallet />;
});

export default AuthWallet;
