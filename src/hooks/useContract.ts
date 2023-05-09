import { getContract } from '@/utils';
import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';
import { ethers } from 'ethers';
import network from '@/lib/network.helpers';
import { useCurrentUserInfo } from '@/state/wallet/hooks';

function useContract<T extends Contract = Contract>(
  contractAddress: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const userInfo = useCurrentUserInfo();
  return useMemo(() => {
    if (!contractAddress || !ABI) return null;
    try {
      const rpc: string = network.current.TCNode;
      const customProvider = new ethers.providers.JsonRpcProvider(rpc);
      return getContract(
        contractAddress,
        ABI,
        customProvider,
        withSignerIfPossible && userInfo ? userInfo.address : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [contractAddress, ABI, withSignerIfPossible, network.current.TCNode, userInfo?.address]) as T;
}

export default useContract;
