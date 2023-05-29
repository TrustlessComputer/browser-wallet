import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import useContractOperation from '@/hooks/useContractOperation';
import useNativeBalance from '@/hooks/contracts-operation.ts/useNativeBalance';
import { debounce } from 'lodash';
import { getCollectedUTXO } from '@/services/bitcoin';
import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { setAddressBalance } from '@/state/wallet/reducer';
import throttle from 'lodash/throttle';
import useProvider from '@/hooks/useProvider';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector } from '@/state/wallet/selector';

export interface IAssetsContext {
  tcBalance: string;
  btcBalance: string;
  getAssetsCreateTx: () => Promise<ICollectedUTXOResp | undefined>;
  isLoadedAssets: boolean;

  // address dropdown
}

const initialValue: IAssetsContext = {
  tcBalance: '0',
  btcBalance: '0',
  getAssetsCreateTx: () => new Promise<ICollectedUTXOResp | undefined>(() => null),
  isLoadedAssets: false,
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const userInfo = useCurrentUserInfo();
  const [tcBalance, setTCBalance] = React.useState<string>('0');
  const [assets, setAssets] = React.useState<ICollectedUTXOResp | undefined>();
  const [loadedState, setLoadedState] = React.useState<{ [key: string]: boolean }>({});
  const provider = useProvider();
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(listAccountsSelector);

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

  const _onGetCollectedUTXO = async (): Promise<ICollectedUTXOResp | undefined> => {
    if (!userInfo?.address || !userInfo.btcAddress) {
      setAssets(undefined);
      return undefined;
    }
    try {
      const _assets = await getCollectedUTXO(userInfo.btcAddress, userInfo.address);
      setAssets(_assets);
      return _assets;
    } catch (e) {
      setAssets(undefined);
      return undefined;
    }
  };

  const debounceFetchAssets = React.useCallback(
    debounce(async () => {
      if (!userInfo?.address) return;
      await Promise.all([_onGetTCBalance().then().catch(), _onGetCollectedUTXO().then().catch()]);
      setLoadedState({
        [userInfo.address]: true,
      });
    }, 300),
    [userInfo?.address, userInfo?.btcAddress],
  );

  const btcBalance = React.useMemo(() => {
    return assets ? assets?.availableBalance.toString() : '0';
  }, [assets]);

  const isLoadedAssets = React.useMemo(() => {
    if (!userInfo?.address) return false;
    return Boolean(loadedState[userInfo.address]);
  }, [loadedState, userInfo?.address]);

  const getAccountBalance = async (address: string) => {
    if (!provider) return;
    try {
      const balance = await provider.getBalance(address);
      dispatch(
        setAddressBalance({
          address: address,
          balance: balance.toString(),
        }),
      );
    } catch (error) {
      setAddressBalance({
        address: address,
        balance: '0',
      });
    }
  };

  const throttleGetAccountsBalance = React.useCallback(
    throttle(async () => {
      accounts.map(account => getAccountBalance(account.address));
    }, 2000),
    [provider],
  );

  useEffect(() => {
    if (!userInfo?.address || !userInfo?.btcAddress) return;
    debounceFetchAssets();
    const interval = setInterval(() => {
      debounceFetchAssets();
    }, 10000);
    return () => clearInterval(interval);
  }, [userInfo?.address, userInfo?.btcAddress]);

  useEffect(() => {
    throttleGetAccountsBalance();
  }, []);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      tcBalance,
      btcBalance,
      getAssetsCreateTx: _onGetCollectedUTXO,
      isLoadedAssets,
    };
  }, [tcBalance, btcBalance, _onGetCollectedUTXO, isLoadedAssets]);

  return <AssetsContext.Provider value={contextValues}>{children}</AssetsContext.Provider>;
};
