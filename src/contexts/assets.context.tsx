import React, { PropsWithChildren, useMemo } from 'react';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import useContractOperation from '@/hooks/useContractOperation';
import useNativeBalance from '@/hooks/contracts-operation.ts/useNativeBalance';
import { debounce } from 'lodash';
import useAsyncEffect from 'use-async-effect';
import { getCollectedUTXO } from '@/services/bitcoin';
import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { TC_SDK } from '@/lib';

export interface IAssetsContext {
  tcBalance: string;
  btcBalance: string;
  getAssetsCreateTx: () => Promise<ICollectedUTXOResp | undefined>;
}

const initialValue: IAssetsContext = {
  tcBalance: '0',
  btcBalance: '0',
  getAssetsCreateTx: () => new Promise<ICollectedUTXOResp | undefined>(() => null),
};

export const AssetsContext = React.createContext<IAssetsContext>(initialValue);

export const AssetsProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const userInfo = useCurrentUserInfo();
  const [tcBalance, setTCBalance] = React.useState<string>('0');
  const [assets, setAssets] = React.useState<ICollectedUTXOResp | undefined>();

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
    debounce(() => {
      _onGetTCBalance().then().catch();
      _onGetCollectedUTXO().then().catch();
    }, 300),
    [userInfo?.address, userInfo?.btcAddress],
  );

  const btcBalance = React.useMemo(() => {
    const balance = TC_SDK.getBTCBalance({
      utxos: assets?.txrefs || [],
      inscriptions: assets?.inscriptions_by_outputs || {},
    });
    return balance.toString();
  }, [assets]);

  useAsyncEffect(async () => {
    if (!userInfo?.address || !userInfo?.btcAddress) return;
    await debounceFetchAssets();
    const interval = setInterval(() => {
      debounceFetchAssets();
    }, 10000);
    return () => clearInterval(interval);
  }, [userInfo?.address, userInfo?.btcAddress]);

  const contextValues = useMemo((): IAssetsContext => {
    return {
      tcBalance,
      btcBalance,
      getAssetsCreateTx: _onGetCollectedUTXO,
    };
  }, [tcBalance, btcBalance, _onGetCollectedUTXO]);

  return <AssetsContext.Provider value={contextValues}>{children}</AssetsContext.Provider>;
};
