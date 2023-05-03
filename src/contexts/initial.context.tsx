import React, { PropsWithChildren, useMemo } from 'react';
import { SDK, TC_SDK } from '@/lib';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { setShowSetupWallet } from '@/state/wallet/reducer';
import useAsyncEffect from 'use-async-effect';
import { isShowSetupSelector } from '@/state/wallet/selector';
import { useCurrentUser } from '@/state/wallet/hooks';
import AuthWallet from '@/modules/AuthWallet';
import sleep from '@/utils/sleep';
import LoadingContainer from '@/components/Loader';

export interface IInitialContext {
  onPreloader: () => void;
}

const initialValue: IInitialContext = {
  onPreloader: () => undefined,
};

export const InitialContext = React.createContext<IInitialContext>(initialValue);

export const InitialProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const [initing, setIniting] = React.useState(true);
  const isShowSetup = useAppSelector(isShowSetupSelector);
  const currentUser = useCurrentUser();
  const dispatch = useAppDispatch();

  // preloader
  const setupConfigs = () => {
    SDK.setup();
  };

  const preload = async () => {
    const cipher = await TC_SDK.getStorageHDWalletCipherText();
    dispatch(setShowSetupWallet(Boolean(!cipher)));
  };

  const onPreloader = async () => {
    try {
      setIniting(true);
      setupConfigs();
      await preload();
      await sleep(0.5);
    } catch (e) {
      // handle error
    } finally {
      setIniting(false);
    }
  };

  const renderContent = () => {
    // empty
    if (initing) return <></>;
    if (!currentUser || isShowSetup) {
      return <AuthWallet />;
    }
    return children;
  };

  useAsyncEffect(onPreloader, []);

  const contextValues = useMemo((): IInitialContext => {
    return {
      onPreloader: onPreloader,
    };
  }, [onPreloader]);

  return (
    <InitialContext.Provider value={contextValues}>
      {renderContent()}
      <LoadingContainer loaded={!initing} />
    </InitialContext.Provider>
  );
};
