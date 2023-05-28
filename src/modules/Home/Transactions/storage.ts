import { StorageService } from '@/lib/storage.local';
import {
  ICreateTxBuilderPayload,
  IHistory,
  INormaTxBuilderPayload,
  IStatusCode,
  IUnInscribedTxBuilderPayload,
  IUpdatedBTCHashPayload,
  IUpdatedStatusPayload,
} from '@/interfaces/history';
import { compareString } from '@/utils';
import { orderBy } from 'lodash';
import network from '@/lib/network.helpers';
import { TransactionResponse } from '@ethersproject/abstract-provider';

export class HistoryStorage extends StorageService {
  private getTxsHistoryKey = (tcAddress: string) => {
    return `history-${network.current.Key}-${tcAddress.toLowerCase()}`;
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
  updateStatusCode = (tcAddress: string, hashs: IUpdatedStatusPayload[]) => {
    const key = this.getTxsHistoryKey(tcAddress);
    const transactions = this.getTransactions(tcAddress);
    const newTransactions = transactions.map(trans => {
      const { tcHash } = trans;
      const { status } = hashs.find(item => compareString({ str1: item.tcHash, str2: tcHash, method: 'equal' })) || {};
      if (!status) return trans;
      return {
        ...trans,
        status,
      };
    });
    this.set(key, newTransactions);
  };
  cancelTransaction = (tcAddress: string, newTCHash: string, oldTCHash: string) => {
    const key = this.getTxsHistoryKey(tcAddress);
    const transactions = this.getTransactions(tcAddress);
    const newTransactions = transactions.map(trans => {
      const { tcHash } = trans;
      const isCanceled = compareString({ str1: oldTCHash, str2: tcHash, method: 'equal' });
      if (!isCanceled) return trans;
      return {
        ...trans,
        tcHash: newTCHash,
      };
    });
    this.set(key, newTransactions);
  };

  createInscribeTransactions = (tcAddress: string, payload: IUpdatedBTCHashPayload) => {
    const { btcHash, status, tcHashs, uninscribed } = payload;
    const key = this.getTxsHistoryKey(tcAddress);
    const transactions = this.getTransactions(tcAddress);
    const unknowTxs = HistoryStorage.UnInscribedTransactionBuilder({
      tcAddress: tcAddress,
      transactions: uninscribed.filter(
        uninscribe =>
          !transactions.some(transaction =>
            compareString({
              str1: uninscribe.Hash,
              str2: transaction.tcHash,
              method: 'equal',
            }),
          ) &&
          payload.tcHashs.some(tcHash =>
            compareString({
              str1: uninscribe.Hash,
              str2: tcHash,
              method: 'equal',
            }),
          ),
      ),
    }).map(unknowTx => ({
      ...unknowTx,
      btcHash: btcHash,
      statusCode: IStatusCode.PROCESSING,
      time: new Date().getTime(),
      type: 'Unknown',
    }));

    const newTransactions = transactions.map(trans => {
      const { tcHash } = trans;
      const isExist = tcHashs.some(hash => compareString({ str1: hash, str2: tcHash, method: 'equal' }));
      if (!isExist) return trans;
      return {
        ...trans,
        status,
        btcHash,
      };
    });

    this.set(key, [...unknowTxs, ...newTransactions]);
  };

  updateSpeedUpBTCHash = (newBTCHash: string, oldBTCHash: string, tcAddress: string) => {
    const key = this.getTxsHistoryKey(tcAddress);
    const transactions = this.getTransactions(tcAddress);
    const newTxs = transactions.map(trans => {
      if (trans.btcHash && trans.btcHash.toLowerCase() === oldBTCHash.toLowerCase()) {
        return {
          ...trans,
          btcHash: newBTCHash,
          statusCode: IStatusCode.PROCESSING,
        };
      }
      return trans;
    });
    this.set(key, newTxs);
  };

  // transaction inside wallet
  // send ERC20, ERC721, TC
  static NormalTransactionBuilder = (payload: INormaTxBuilderPayload): IHistory => {
    const { transaction, btcHash, type, site } = payload;
    return {
      tcHash: transaction.hash,
      btcHash: btcHash,
      from: transaction.from,
      to: transaction.to || '',
      status: btcHash ? IStatusCode.PROCESSING : IStatusCode.PENDING,
      type: type,
      dappURL: site || window.location.origin,
      isRBFable: false,
      nonce: transaction.nonce,
      time: new Date().getTime(),
      currentSat: 0,
      minSat: 0,
    };
  };
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
  static HistoryCreateTransactionBuilder = (payload: ICreateTxBuilderPayload): IHistory | undefined => {
    const { tx, site, btcHash, methodType } = payload;
    if ('hash' in tx && 'nonce' in tx) {
      const history = HistoryStorage.NormalTransactionBuilder({
        transaction: tx as TransactionResponse,
        type: methodType || '',
        btcHash,
        site,
      });
      return history;
    }
    return undefined;
  };
}

const historyStorage = new HistoryStorage();

export default historyStorage;
