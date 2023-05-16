import { StorageService } from '@/lib/storage.local';
import { IHistory, IStatusCode, INormaTxBuilderPayload } from '@/interfaces/history';

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
}

const historyStorage = new HistoryStorage();

export default historyStorage;
