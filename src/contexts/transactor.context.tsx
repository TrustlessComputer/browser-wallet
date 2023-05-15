import React, { PropsWithChildren, useMemo } from 'react';
import SendBTCModal from '@/components/Transactor/SendBTC.modal';
import ResumeModal from '@/components/Transactor/Resume.modal';
import SendTCModal from '@/components/Transactor/SendTC.modal';

export interface ITransactorContext {
  onOpenBTCModal: () => void;
  onOpenResumeModal: () => void;
  onOpenTCModal: () => void;
}

const initialValue: ITransactorContext = {
  onOpenBTCModal: () => undefined,
  onOpenResumeModal: () => undefined,
  onOpenTCModal: () => undefined,
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

  const [showTCModal, setShowTCModal] = React.useState(false);
  const onOpenTCModal = () => setShowTCModal(true);
  const onCloseTCModal = () => setShowTCModal(false);

  const contextValues = useMemo((): ITransactorContext => {
    return {
      onOpenBTCModal,
      onOpenResumeModal,
      onOpenTCModal,
    };
  }, []);

  return (
    <TransactorContext.Provider value={contextValues}>
      {children}
      <SendBTCModal show={showBTCModal} onClose={onCloseBTCModal} />
      <ResumeModal show={showResumeModal} onClose={onCloseResumeModal} />
      <SendTCModal show={showTCModal} onClose={onCloseTCModal} />
    </TransactorContext.Provider>
  );
};
