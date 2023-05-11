import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';

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
