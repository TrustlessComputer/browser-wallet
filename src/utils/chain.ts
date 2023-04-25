import { SupportedChainId } from '@/constants/chains';
// import { IResourceChain } from '@/interfaces/chain';
// import Web3 from 'web3';

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId];
}
