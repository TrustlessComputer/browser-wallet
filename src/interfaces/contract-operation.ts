export enum TransactionType {
  ERC721 = 'NFT', // NFTs
  ERC20 = 'Token', // Tokens
  BFS = 'Artifact', // Artifact
  BNS = 'Name', // Name
  NONE = 'None', // None
  TC = 'TC', // Tokens
}

export enum EventType {
  CREATE = 'Create',
  TRANSFER = 'Transfer',
  MINT = 'Mint',
  NONE = 'None',
}

export type ContractOperationHook<P, R> = (arg?: any) => {
  call: (args: P) => Promise<R>;
  estimateGas?: (args: P) => Promise<number>;
  transactionType: TransactionType;
  eventType: EventType;
  txSize?: number;
};
