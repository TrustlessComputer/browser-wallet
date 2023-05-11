import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import useProvider from '@/hooks/useProvider';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';

const useNativeBalance: ContractOperationHook<unknown, string> = () => {
  const userInfo = useCurrentUserInfo();
  const provider = useProvider();

  const call = useCallback(async (): Promise<string> => {
    let balance = '0';
    try {
      console.log('SANG TEST: 222', userInfo?.address);
      if (userInfo?.address) {
        const resp = await provider?.getBalance(userInfo.address);
        if (resp) {
          balance = resp.toString();
        }
      }
    } catch (error) {
      const { message } = getErrorMessage(error, 'useGetNativeBalance');
      toast.error(message);
    }
    return balance;
  }, [userInfo?.address, provider]);

  return {
    call: call,
    transactionType: TransactionType.NONE,
    eventType: EventType.NONE,
  };
};

export default useNativeBalance;
