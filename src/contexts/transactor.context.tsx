import React, { PropsWithChildren, useMemo } from 'react';
import SendBTCModal from '@/components/Transactor/SendBTC.modal';

export interface ITransactorContext {
  showBTCModal: boolean;
  onOpenBTCModal: () => void;
}

const initialValue: ITransactorContext = {
  showBTCModal: false,
  onOpenBTCModal: () => undefined,
};

export const TransactorContext = React.createContext<ITransactorContext>(initialValue);

export const TransactorProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const [showBTCModal, setShowBTCModal] = React.useState(false);
  const onOpenBTCModal = () => setShowBTCModal(true);
  const onCloseBTCModal = () => setShowBTCModal(false);

  const contextValues = useMemo((): ITransactorContext => {
    return {
      showBTCModal,
      onOpenBTCModal,
    };
  }, [showBTCModal]);

  return (
    <TransactorContext.Provider value={contextValues}>
      {children}
      <SendBTCModal show={showBTCModal} onClose={onCloseBTCModal} />
    </TransactorContext.Provider>
  );
};
