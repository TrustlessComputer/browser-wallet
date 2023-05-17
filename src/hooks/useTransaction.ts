import { useCurrentUserInfo } from '@/state/wallet/hooks';
import React, { useState } from 'react';
import { IHistory, IStatusCode, IUpdatedStatusPayload } from '@/interfaces/history';
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

const useTransactions = ({ isGetUnInscribedSize }: IProps) => {
  const user = useCurrentUserInfo();
  const [transactions, setTransactions] = useState<IHistory[]>([]);
  const [uninscribed, setUnInscribed] = useState<ITCTxDetail[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [sizeByte, setSizeByte] = React.useState<number | undefined>(undefined);

  const { getUnInscribedTransactionDetails, getTCTransactionByHash, getStatusCode, getIsRBFable } = useBitcoin();

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

      if (isGetUnInscribedSize) {
        await getTransactionSize(uninscribedTransactions);
      }
      const pendingTxs = HistoryStorage.UnInscribedTransactionBuilder({
        transactions: uninscribedTransactions,
        tcAddress: user.address,
      });

      const transactions: IHistory[] = [];
      const updatedStatusHashs: Array<IUpdatedStatusPayload> = [];
      for (const trans of storageTransactions) {
        const { tcHash, btcHash, status } = trans;
        let statusCode = status;
        let isRBFable = false;
        let currentSat = 0;
        let minSat = 0;
        if (!!btcHash && status === IStatusCode.PROCESSING) {
          // statusCode = await getStatusCode(tcHash, user.address);
          const [txStatus, RBFStatus] = await Promise.all([
            await getStatusCode(tcHash, user.address),
            await getIsRBFable({
              btcHash: btcHash,
              btcAddress: user.btcAddress,
              tcAddress: user.address,
            }),
          ]);
          statusCode = txStatus;
          isRBFable = RBFStatus.isRBFable;
          currentSat = RBFStatus.oldFeeRate;
          minSat = RBFStatus.minSat;

          if ([IStatusCode.SUCCESS, IStatusCode.FAILED].includes(statusCode)) {
            // update local storage
            updatedStatusHashs.push({
              tcHash,
              status: statusCode,
            });
          }
        }

        transactions.push({
          ...trans,
          status: statusCode,
          isRBFable,
          currentSat,
          minSat,
        });

        if (updatedStatusHashs.length) {
          historyStorage.updateStatusCode(user.address, updatedStatusHashs);
        }
      }

      setTransactions(uniqBy([...pendingTxs, ...transactions], item => item.tcHash.toLowerCase()));
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

  return {
    isLoading,
    isLoaded,
    transactions,
    uninscribed,
    sizeByte,

    getTransactions,
    debounceGetTransactions,
  };
};

export default useTransactions;
