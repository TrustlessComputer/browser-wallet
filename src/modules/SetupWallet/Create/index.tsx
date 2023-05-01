import React from 'react';
import { Container } from '@/modules/SetupWallet/styled';
import Steps, { IStep } from '@/components/Steps/Steps';
import BackupPhrase from './components/BackupPhrase';
import VerifyPhrase from '@/modules/SetupWallet/Create/components/VerifyPhrase';
import SetPassword from '@/modules/SetupWallet/Create/components/SetPassword';
import WalletCreated from '@/modules/SetupWallet/Create/components/WalletCreated';
import { randomMnemonic } from '@/lib/wallet.helpers';
import { TC_SDK } from '@/lib';
import useAsyncEffect from 'use-async-effect';
import { CreateWalletSteps, ISetAuthStepProps } from '@/modules/SetupWallet/types';
import { CreateWalletAction, ICreateWalletAction } from '@/modules/SetupWallet/Create/Create.actions';
import { useAppDispatch } from '@/state/hooks';
import HeaderBack from '@/components/HeaderBack';

interface IProps extends ISetAuthStepProps {}

const Home = React.memo(({ setStep }: IProps) => {
  const dispatch = useAppDispatch();

  const [phrase, setPhrase] = React.useState<TC_SDK.IHDWallet | undefined>(undefined);
  const [currentStep, setCurrentStep] = React.useState(CreateWalletSteps.backup);
  const [loading, setLoading] = React.useState(false);

  const createWalletActions: ICreateWalletAction = new CreateWalletAction({
    component: {
      setLoading,
      setCurrentStep,
    },
    dispatch,
  });

  const onGotoHome = () => {
    setStep('auth');
  };

  const generateMnemonic = async () => {
    const mnemonic = await randomMnemonic();
    setPhrase(mnemonic);
  };

  useAsyncEffect(generateMnemonic, []);

  const steps: IStep[] = [
    {
      title: 'Secret backup phrase',
      content: () => <BackupPhrase />,
    },
    {
      title: 'Verify your phrase',
      content: () => <VerifyPhrase />,
    },
    {
      title: 'Set a password',
      content: () => <SetPassword />,
    },
    {
      title: 'Wallet created',
      content: () => <WalletCreated />,
    },
  ];

  return (
    <Container className="mt-60">
      <HeaderBack
        centerComponent={() => <Steps currentStep={currentStep} steps={steps} />}
        onClickGoBack={onGotoHome}
      />
      {steps[currentStep].content()}
    </Container>
  );
});

export default Home;
