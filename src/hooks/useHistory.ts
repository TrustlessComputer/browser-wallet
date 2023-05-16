import { useCurrentUserInfo } from '@/state/wallet/hooks';
import React, { useState } from 'react';
import { IHistory } from '@/interfaces/history';
import { ITCTxDetail } from '@/interfaces/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import historyStorage, { HistoryStorage } from '@/modules/Home/Transactions/storage';
import { debounce, uniqBy } from 'lodash';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';

const useHistory = () => {
  const user = useCurrentUserInfo();
  const [transactions, setTransactions] = useState<IHistory[]>([]);
  const [uninscribed, setUnInscribed] = useState<ITCTxDetail[]>([]);
  const { getUnInscribedTransactionDetails } = useBitcoin();
  const [isLoading, setIsLoading] = React.useState(false);

  const getTransactions = async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const storageTransactions = historyStorage.getTransactions(user?.address);
      const uninscribedTransactions = await getUnInscribedTransactionDetails(user.address);

      const pendingTxs = HistoryStorage.UnInscribedTransactionBuilder({
        transactions: uninscribedTransactions,
        tcAddress: user.address,
      });
      const transactions = uniqBy([...pendingTxs, ...storageTransactions], item => item.tcHash.toLowerCase());

      setTransactions(transactions);
      setUnInscribed(uninscribedTransactions);
    } catch (error) {
      const { message } = getErrorMessage(error, 'getUnInscribed');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetTransactions = React.useCallback(debounce(getTransactions, 300), [user?.address]);

  React.useEffect(() => {
    debounceGetTransactions();
    let interval = setInterval(() => {
      debounceGetTransactions();
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [user?.address]);

  return {
    loading: isLoading,
    transactions,
    uninscribed,
    getTransactions,
  };
};

export default useHistory;
