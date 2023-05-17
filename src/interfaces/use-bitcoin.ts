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
