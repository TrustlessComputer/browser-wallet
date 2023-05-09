import React, { PropsWithChildren, useMemo } from 'react';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import useContractOperation from '@/hooks/useContractOperation';
import useNativeBalance from '@/hooks/contracts-operation.ts/useNativeBalance';
import { debounce } from 'lodash';
import useAsyncEffect from 'use-async-effect';

export interface IAssetsContext {
  tcBalance: string;
}

const initialValue: IAssetsContext = {
  tcBalance: '0',
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const userInfo = useCurrentUserInfo();
  const [tcBalance, setTCBalance] = React.useState<string>('0');

  const { run: onGetTCBalance } = useContractOperation({
    operation: useNativeBalance,
  });

  const _onGetTCBalance = async () => {
    try {
      const amount = await onGetTCBalance(undefined);
      setTCBalance(amount);
    } catch (e) {
      setTCBalance('0');
    }
  };

  const debounceGetTCBalance = React.useCallback(debounce(_onGetTCBalance, 300), [userInfo?.address]);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      tcBalance,
    };
  }, [tcBalance]);

  // load balance
  useAsyncEffect(async () => {
    if (!userInfo?.address) return;
    await debounceGetTCBalance();
    const interval = setInterval(() => {
      debounceGetTCBalance();
    }, 10000);
    return () => clearInterval(interval);
  }, [userInfo?.address]);

  return <AssetsContext.Provider value={contextValues}>{children}</AssetsContext.Provider>;
};
