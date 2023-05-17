import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ITCTxDetail } from '@/interfaces/transaction';

export enum IStatusCode {
  PENDING = 0,
  PROCESSING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

export const StatusMesg = {
  SUCCESS: 'Success',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  WAITING: 'Waiting in the mempool',
  FAILED: 'Failed',
};

interface IHistory {
  tcHash: string;
  from: string;
  to: string;
  nonce: number;
  time: number;
  dappURL: string;
  status: IStatusCode;
  type: string;
  btcHash?: string;
  isRBFable?: boolean;
  currentSat?: number;
  minSat?: number;
}

interface INormaTxBuilderPayload {
  transaction: TransactionResponse;
  btcHash?: string;
  type: string;
}

interface IUnInscribedTxBuilderPayload {
  transactions: ITCTxDetail[];
  tcAddress: string;
}

interface IUpdatedStatusPayload {
  tcHash: string;
  status: IStatusCode;
}

export type { IHistory, INormaTxBuilderPayload, IUnInscribedTxBuilderPayload, IUpdatedStatusPayload };
