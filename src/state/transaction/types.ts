interface Canceled {
  [tcHash: string]: boolean;
}

interface TransactionState {
  canceled: Canceled;
}

interface ISetTransactionCanceled {
  tcHashs: string[];
}

export type { ISetTransactionCanceled, TransactionState, Canceled };
