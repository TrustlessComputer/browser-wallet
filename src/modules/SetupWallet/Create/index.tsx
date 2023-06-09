import React from 'react';
import { Container } from '@/modules/SetupWallet/styled';
import Steps, { IStep } from '@/components/Steps/Steps';
import BackupPhrase from './components/BackupPhrase';
import VerifyPhrase from '@/modules/SetupWallet/Create/components/VerifyPhrase';
import SetPassword from '@/modules/SetupWallet/Create/components/SetPassword';
import { randomMnemonic } from '@/lib/wallet';
import { TC_SDK } from '@/lib';
import useAsyncEffect from 'use-async-effect';
import { CreateWalletSteps, ISetAuthStepProps } from '@/modules/SetupWallet/types';
import { CreateWalletAction, ICreateWalletAction } from '@/modules/SetupWallet/Create.actions';
import { useAppDispatch } from '@/state/hooks';
import HeaderBack from '@/components/HeaderBack';
import LoadingContainer from '@/components/Loader';

interface IProps extends ISetAuthStepProps {}

const Home = React.memo(({ setStep }: IProps) => {
  const dispatch = useAppDispatch();

  const [phrase, setPhrase] = React.useState<TC_SDK.IHDWallet | undefined>(undefined);
  const [currentStep, setCurrentStep] = React.useState(CreateWalletSteps.backup);
  const [loading, setLoading] = React.useState(false);

  const createWalletActions: ICreateWalletAction = new CreateWalletAction({
    component: {
      setLoading,
    },
    dispatch,
  });

  const onGotoHome = () => {
    setStep('auth');
  };

  const onContinueBackupPhrase = () => {
    setCurrentStep(CreateWalletSteps.verifyPhrase);
  };

  const onVerifyPhraseSuccess = () => {
    setCurrentStep(CreateWalletSteps.setPassword);
  };

  const generateMnemonic = async () => {
    const mnemonic = await randomMnemonic();
    setPhrase(mnemonic);
  };

  const onConfirmPasswordSuccess = (password: string) => {
    if (!phrase) return;
    createWalletActions.createWallet(phrase, password);
  };

  useAsyncEffect(() => {
    setTimeout(generateMnemonic, 100);
  }, []);

  const steps: IStep[] = [
    {
      title: 'Secret backup phrase',
      content: () => <BackupPhrase phrase={phrase?.mnemonic || ''} onContinue={onContinueBackupPhrase} />,
    },
    {
      title: 'Verify your phrase',
      content: () => <VerifyPhrase phrase={phrase?.mnemonic || ''} onVerifySuccess={onVerifyPhraseSuccess} />,
    },
    {
      title: 'Set a password',
      content: () => <SetPassword loading={loading} onConfirmPassword={onConfirmPasswordSuccess} />,
    },
    // {
    //   title: 'Wallet created',
    //   content: () => <WalletCreated />,
    // },
  ];

  return (
    <Container className="mt-32">
      <HeaderBack
        centerComponent={() => <Steps currentStep={currentStep} steps={steps} />}
        onClickGoBack={onGotoHome}
      />
      {steps[currentStep].content()}
      <LoadingContainer loaded={!loading} />
    </Container>
  );
});

export default Home;
