import { TransactionResponse } from '@ethersproject/abstract-provider';

export enum DAppType {
  ERC721 = 'NFT', // NFTs
  ERC20 = 'Token', // Tokens
  BFS = 'Artifact', // Artifact
  BNS = 'Name', // Name
}

export type ContractOperationHook<P, R> = (arg?: any) => {
  call: (args: P) => Promise<R>;
  dAppType: DAppType;
};

export type DeployContractResponse = {
  hash: string;
  contractAddress: string;
  deployTransaction: TransactionResponse;
};
