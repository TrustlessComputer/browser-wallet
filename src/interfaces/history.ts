import { TransactionResponse } from '@ethersproject/abstract-provider';

export enum IStatusCode {
  PENDING,
  PROCESSING,
  SUCCESS,
  FAILED,
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

export type { IHistory, INormaTxBuilderPayload };
