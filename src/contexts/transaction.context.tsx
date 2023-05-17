import React, { PropsWithChildren, useMemo } from 'react';
import useTransactions from '@/hooks/useTransaction';
import { IHistory } from '@/interfaces/history';
import { ITCTxDetail } from '@/interfaces/transaction';
import { useCurrentUserInfo } from '@/state/wallet/hooks';

export interface ITransactionContext {
  isLoading: boolean;
  isLoaded: boolean;
  history: IHistory[];
  getTransactions: () => void;
  uninscribed: ITCTxDetail[];
}

const initialValue: ITransactionContext = {
  isLoading: false,
  isLoaded: false,
  history: [],
  getTransactions: () => undefined,
  uninscribed: [],
};

export const TransactionContext = React.createContext<ITransactionContext>(initialValue);

export const TransactionProvider: React.FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): React.ReactElement => {
  const user = useCurrentUserInfo();
  const { isLoading, isLoaded, debounceGetTransactions, transactions, uninscribed } = useTransactions({
    isGetUnInscribedSize: false,
  });

  React.useEffect(() => {
    debounceGetTransactions();
    let interval = setInterval(() => {
      debounceGetTransactions();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [user?.address]);

  const contextValues = useMemo((): ITransactionContext => {
    return {
      isLoading,
      isLoaded,
      getTransactions: debounceGetTransactions,
      history: transactions,
      uninscribed,
    };
  }, [isLoading, isLoaded, debounceGetTransactions, transactions, uninscribed]);

  return <TransactionContext.Provider value={contextValues}>{children}</TransactionContext.Provider>;
};
