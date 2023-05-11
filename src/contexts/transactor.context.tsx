import React, { PropsWithChildren, useMemo } from 'react';
import SendBTCModal from '@/components/Transactor/SendBTC.modal';
import ResumeModal from '@/components/Transactor/Resume.modal';

export interface ITransactorContext {
  onOpenBTCModal: () => void;
  onOpenResumeModal: () => void;
}

const initialValue: ITransactorContext = {
  onOpenBTCModal: () => undefined,
  onOpenResumeModal: () => undefined,
};

export const TransactorContext = React.createContext<ITransactorContext>(initialValue);

export const TransactorProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [showBTCModal, setShowBTCModal] = React.useState(false);
  const onOpenBTCModal = () => setShowBTCModal(true);
  const onCloseBTCModal = () => setShowBTCModal(false);

  const [showResumeModal, setShowResumeModal] = React.useState(false);
  const onOpenResumeModal = () => setShowResumeModal(true);
  const onCloseResumeModal = () => setShowResumeModal(false);

  const contextValues = useMemo((): ITransactorContext => {
    return {
      onOpenBTCModal,
      onOpenResumeModal,
    };
  }, []);

  return (
    <TransactorContext.Provider value={contextValues}>
      {children}
      <SendBTCModal show={showBTCModal} onClose={onCloseBTCModal} />
      <ResumeModal show={showResumeModal} onClose={onCloseResumeModal} />
    </TransactorContext.Provider>
  );
};
