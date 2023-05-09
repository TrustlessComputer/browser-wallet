import type { JsonRpcProvider } from '@ethersproject/providers';
import { useMemo } from 'react';
import { ethers } from 'ethers';
import network from '@/lib/network.helpers';

function useProvider<T extends JsonRpcProvider = JsonRpcProvider>(): T | undefined {
  return useMemo(() => {
    try {
      const rpc: string = network.current.TCNode;
      return new ethers.providers.JsonRpcProvider(rpc);
    } catch (error) {
      return undefined;
    }
  }, [network.current.TCNode]) as T;
}

export default useProvider;
