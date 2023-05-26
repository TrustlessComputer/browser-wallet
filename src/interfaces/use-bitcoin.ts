import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { ITCTxDetail } from '@/interfaces/transaction';

export interface ICreateInscribeParams {
  tcTxIDs: Array<string>;
  feeRate: number;
  assets?: ICollectedUTXOResp;
}

export interface ISendBTCParams {
  receiver: string;
  feeRate: number;
  amount: string;
}

export interface ICreateBatchInscribeParams {
  tcTxDetails: ITCTxDetail[];
  feeRate: number;
}

export interface IIsSpeedUpBTCParams {
  btcHash: string;
  btcAddress: string;
  tcAddress: string;
}

export interface ICreateSpeedUpBTCParams {
  btcHash: string;
  feeRate: number;
  tcAddress: string;
  btcAddress: string;
}

export interface ITCTxByHashResp {
  Hex: string;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: string;
  value: string;
}

export interface ITCTxByHash {
  hex: string;
  from: string;
  gas: number;
  gasPrice: number;
  hash: string;
  input: string;
  nonce: number;
  value: string;
}
