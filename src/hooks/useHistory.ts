import { useCurrentUserInfo } from '@/state/wallet/hooks';
import React, { useState } from 'react';
import { IHistory } from '@/interfaces/history';
import { ITCTxDetail } from '@/interfaces/transaction';
import useBitcoin from '@/hooks/useBitcoin';
import historyStorage, { HistoryStorage } from '@/modules/Home/Transactions/storage';
import { debounce, uniqBy } from 'lodash';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';
import Web3 from 'web3';

interface IProps {
  isGetUnInscribedSize: boolean;
}

const useHistory = (props: IProps) => {
  const user = useCurrentUserInfo();
  const [transactions, setTransactions] = useState<IHistory[]>([]);
  const [uninscribed, setUnInscribed] = useState<ITCTxDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [sizeByte, setSizeByte] = React.useState<number | undefined>(undefined);

  const { getUnInscribedTransactionDetails, getTCTransactionByHash } = useBitcoin();

  const getTransactionSize = async (uninscribed: ITCTxDetail[]) => {
    const Hexs = await Promise.all(
      uninscribed.map(({ Hash }) => {
        return getTCTransactionByHash(Hash);
      }),
    );
    const sizeByte: number = Hexs.reduce((prev, curr) => {
      const currSize = Web3.utils.hexToBytes(curr).length;
      return currSize + prev;
    }, 0);
    setSizeByte(sizeByte);
  };

  const getTransactions = async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const storageTransactions = historyStorage.getTransactions(user?.address);
      const uninscribedTransactions = await getUnInscribedTransactionDetails(user.address);
      if (props.isGetUnInscribedSize) {
        await getTransactionSize(uninscribedTransactions);
      }
      const pendingTxs = HistoryStorage.UnInscribedTransactionBuilder({
        transactions: uninscribedTransactions,
        tcAddress: user.address,
      });

      const transactions = uniqBy([...pendingTxs, ...storageTransactions], item => item.tcHash.toLowerCase());

      setTransactions(transactions);
      setUnInscribed(uninscribedTransactions);
      setIsLoaded(true);
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
    isLoaded,
    transactions,
    uninscribed,
    sizeByte,

    getTransactions,
    debounceGetTransactions,
  };
};

export default useHistory;
