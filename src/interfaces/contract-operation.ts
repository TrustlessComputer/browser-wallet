export enum TransactionType {
  ERC721 = 'NFT', // NFTs
  ERC20 = 'Token', // Tokens
  BFS = 'Artifact', // Artifact
  BNS = 'Name', // Name
  NONE = 'None', // Name
}

export enum EventType {
  CREATE = 'Create',
  TRANSFER = 'Transfer',
  MINT = 'Mint',
  NONE = 'None',
}

export type ContractOperationHook<P, R> = (arg?: any) => {
  call: (args: P) => Promise<R>;
  transactionType: TransactionType;
  eventType: EventType;
};
