import BaseModal from '@/components/BaseModal';
import AuthUnlock from '@/modules/UnlockWallet/components/AuthUnlock';
import { useUserSecretKey } from '@/state/wallet/hooks';
import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  show: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  width?: number;
}

enum SignerStep {
  unlock = 'unlock',
  sign = 'sign',
}

const SignerModal = ({ show, onClose, children, title, subTitle, width = 800 }: Props) => {
  const userSecretKey = useUserSecretKey();
  const [step, setStep] = React.useState<SignerStep>(SignerStep.unlock);

  const _onUnlocked = () => {
    setStep(SignerStep.sign);
  };
  const isLocked = React.useMemo(() => {
    return step === SignerStep.unlock || !userSecretKey?.address;
  }, [step, userSecretKey?.address]);

  const renderContent = () => {
    if (isLocked && show) {
      return <AuthUnlock onSuccess={_onUnlocked} />;
    }
    return children;
  };

  React.useEffect(() => {
    if (!show) {
      setStep(SignerStep.unlock);
    }
  }, [show]);

  return (
    <BaseModal
      show={show}
      handleClose={onClose}
      title={isLocked ? '' : title}
      subTitle={isLocked ? '' : subTitle}
      width={isLocked ? 800 : width}
    >
      <>{renderContent()}</>
    </BaseModal>
  );
};

export default SignerModal;
