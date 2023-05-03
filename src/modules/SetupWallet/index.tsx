import React from 'react';
import Home from '@/modules/SetupWallet/Home';
import Import from '@/modules/SetupWallet/Import';
import Create from '@/modules/SetupWallet/Create';
import { IAuthStep } from '@/modules/SetupWallet/types';
import { LayoutContent } from '@/pages/layout';

const AuthWallet = React.memo(() => {
  const [step, setStep] = React.useState<IAuthStep>('auth');

  const Component = React.useMemo(() => {
    if (step === 'import') {
      return <Import setStep={setStep} />;
    }
    if (step === 'create') {
      return <Create setStep={setStep} />;
    }
    return <Home setStep={setStep} />;
  }, [step, setStep]);

  return <LayoutContent>{Component}</LayoutContent>;
});

export default AuthWallet;
