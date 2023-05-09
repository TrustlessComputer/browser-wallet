import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import ERC20ABIJson from '@/abis/erc20.json';
import { useCallback } from 'react';
import { getContract } from '@/utils';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import useProvider from '@/hooks/useProvider';

export interface IGetTokenBalance {
  tokenAddress: string;
}

const useGetTokenBalance: ContractOperationHook<IGetTokenBalance, string> = () => {
  const userInfo = useCurrentUserInfo();
  const provider = useProvider();

  const call = useCallback(
    async (params: IGetTokenBalance): Promise<string> => {
      if (userInfo?.address && provider) {
        const { tokenAddress } = params;
        const userAddress = userInfo.address;
        const contract = getContract(tokenAddress, ERC20ABIJson.abi, provider, userAddress);
        const balance = await contract.connect(provider).balanceOf(userAddress);
        return balance.toString();
      }
      return '0';
    },
    [userInfo?.address, provider],
  );

  return {
    call: call,
    transactionType: TransactionType.NONE,
    eventType: EventType.NONE,
  };
};

export default useGetTokenBalance;
