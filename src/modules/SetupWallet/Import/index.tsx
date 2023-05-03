import React from 'react';
import { Container } from '@/modules/SetupWallet/styled';
import ImportPhrase from '@/modules/SetupWallet/Import/components/ImportPharse';
import { IStep } from '@/components/Steps';
import SetPassword from '@/modules/SetupWallet/Create/components/SetPassword';
import { ImportWalletSteps, ISetAuthStepProps } from '@/modules/SetupWallet/types';
import { TC_SDK } from '@/lib';
import HeaderBack from '@/components/HeaderBack/Header';
import Steps from '@/components/Steps/Steps';
import { CreateWalletAction, ICreateWalletAction } from '@/modules/SetupWallet/Create.actions';
import { useAppDispatch } from '@/state/hooks';
import LoadingContainer from '@/components/Loader';

interface IProps extends ISetAuthStepProps {}

const Import = React.memo((props: IProps) => {
  const [currentStep, setCurrentStep] = React.useState(ImportWalletSteps.import);
  const [loading, setLoading] = React.useState(false);
  const [errMess, setErrMess] = React.useState<string | undefined>();
  const [mnemonic, setMnemonic] = React.useState<string>('');
  // const [phrase, setPhrase] = React.useState<TC_SDK.IHDWallet | undefined>(undefined);

  const dispatch = useAppDispatch();

  const createWalletActions: ICreateWalletAction = new CreateWalletAction({
    component: {
      setLoading,
      setErrMess,
    },
    dispatch,
  });

  const onGotoHome = () => props.setStep('auth');

  const onImportPhrase = async (mnemonic: string) => {
    setMnemonic(mnemonic);
    setCurrentStep(ImportWalletSteps.setPassword);
  };

  const onConfirmPassword = async (password: string) => {
    try {
      setLoading(true);
      const hdWallet = await TC_SDK.generateHDWalletFromMnemonic(mnemonic);
      await createWalletActions.createWallet(hdWallet, password);
    } catch (e) {
      /* error handled in [createWallet] action */
    }
  };

  const steps: IStep[] = [
    {
      title: 'Import wallet',
      content: () => <ImportPhrase onImportPhrase={onImportPhrase} />,
    },
    {
      title: 'Set a password',
      content: () => <SetPassword loading={loading} errorMess={errMess} onConfirmPassword={onConfirmPassword} />,
    },
  ];

  return (
    <Container className="mt-60">
      <HeaderBack
        centerComponent={() => <Steps currentStep={currentStep} steps={steps} />}
        onClickGoBack={onGotoHome}
      />
      {steps[currentStep].content()}
      <LoadingContainer loaded={!loading} />
    </Container>
  );
});

export default Import;
