import { StorageService } from '@/lib/storage.local';
import { IHistory, INormaTxBuilderPayload, IStatusCode, IUnInscribedTxBuilderPayload } from '@/interfaces/history';
import { compareString } from '@/utils';
import { orderBy } from 'lodash';

export class HistoryStorage extends StorageService {
  private getTxsHistoryKey = (tcAddress: string) => {
    return `transactions-history-${tcAddress.toLowerCase()}`;
  };
  getTransactions = (tcAddress: string): IHistory[] => {
    const key = this.getTxsHistoryKey(tcAddress);
    return this.get(key) || [];
  };
  setTransaction = (tcAddress: string, history: IHistory) => {
    const key = this.getTxsHistoryKey(tcAddress);
    const transactions = this.getTransactions(tcAddress);
    transactions.unshift(history);
    this.set(key, transactions);
  };

  // transaction inside wallet
  // send ERC20, ERC721, TC
  static NormalTransactionBuilder = (payload: INormaTxBuilderPayload): IHistory => {
    const { transaction, btcHash, type } = payload;
    return {
      tcHash: transaction.hash,
      btcHash: btcHash,
      from: transaction.from,
      to: transaction.to || '',
      status: btcHash ? IStatusCode.PROCESSING : IStatusCode.PENDING,
      type: type,
      dappURL: window.location.origin,
      isRBFable: false,
      nonce: transaction.nonce,
      time: new Date().getTime(),
      currentSat: 0,
      minSat: 0,
    };
  };
  // transaction inside wallet
  // send ERC20, ERC721, TC
  static UnInscribedTransactionBuilder = (payload: IUnInscribedTxBuilderPayload): IHistory[] => {
    const { transactions } = payload;
    const storageTransactions = historyStorage.getTransactions(payload.tcAddress);
    const pendingTransactions = orderBy(transactions, item => Number(item.Nonce), 'desc').reduce(
      (prev: IHistory[], curr) => {
        const { Hash, From, To, Nonce } = curr;
        const storageTx = storageTransactions.find(tx =>
          compareString({ str1: tx.tcHash, str2: Hash, method: 'equal' }),
        );
        const transaction: IHistory = {
          from: From,
          nonce: Nonce,
          status: IStatusCode.PENDING,
          tcHash: Hash,
          to: To,
          time: storageTx?.time || 0,
          dappURL: storageTx?.dappURL || '',
          type: storageTx?.type || '',
          btcHash: storageTx?.btcHash || '',
        };
        prev.push(transaction);
        return prev;
      },
      [],
    );
    return pendingTransactions;
  };
}

const historyStorage = new HistoryStorage();

export default historyStorage;
