import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';

export interface ICreateInscribeParams {
  tcTxIDs: Array<string>;
  feeRate: number;
  assets?: ICollectedUTXOResp;
}
