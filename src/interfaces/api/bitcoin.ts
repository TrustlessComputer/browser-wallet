import * as TC_SDK from 'trustless-computer-sdk';

export interface IInscriptionByOutput {
  [key: string]: TC_SDK.Inscription[];
}

export interface ICollectedUTXOResp {
  address: string;
  inscription_id: string;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  txrefs: TC_SDK.UTXO[];
  inscriptions_by_outputs: IInscriptionByOutput;
}

export enum FeeRateName {
  fastestFee = 'fastestFee',
  halfHourFee = 'halfHourFee',
  hourFee = 'hourFee',
}

export interface IFeeRate {
  [FeeRateName.fastestFee]: number;
  [FeeRateName.halfHourFee]: number;
  [FeeRateName.hourFee]: number;
}

interface Vin {
  txid: string;
  vout: number;
}

interface Vout {
  scriptpubkey_address: string;
  value: string;
  scriptpubkey: string;
}

export interface Status {
  confirmed: boolean;
}

export interface IPendingUTXO {
  vin: Vin[];
  vout: Vout[];
  status: Status;
  txid: string;
}

export type BINANCE_PAIR = 'ETHBTC';

export interface ITokenPriceResp {
  symbol: string;
  price: string;
}
