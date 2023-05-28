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
  CANCELING: 'Canceling',
  CANCELED: 'Canceled',
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
  site?: string;
}

interface IUnInscribedTxBuilderPayload {
  transactions: ITCTxDetail[];
  tcAddress: string;
}

interface ICreateTxBuilderPayload {
  tx: TransactionResponse;
  btcHash?: string;
  methodType?: string;
  site?: string;
}

interface IUpdatedStatusPayload {
  tcHash: string;
  status: IStatusCode;
}

interface IUpdatedBTCHashPayload {
  status: IStatusCode;
  btcHash: string;
  tcHashs: string[];
  uninscribed: ITCTxDetail[];
}

export type {
  IHistory,
  INormaTxBuilderPayload,
  IUnInscribedTxBuilderPayload,
  ICreateTxBuilderPayload,
  IUpdatedStatusPayload,
  IUpdatedBTCHashPayload,
};
