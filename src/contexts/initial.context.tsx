import LoadingContainer from '@/components/Loader';
import { TC_SDK } from '@/lib';
import { setupProject } from '@/lib/SDK/configs';
import WalletStorage from '@/lib/wallet/wallet.storage';
import Welcome from '@/modules/Welcome';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { setCurrentTCAccount, setShowSetupWallet } from '@/state/wallet/reducer';
import { isLockedSelector, isShowSetupSelector } from '@/state/wallet/selector';
import sleep from '@/utils/sleep';
import React, { PropsWithChildren, useMemo } from 'react';
import useAsyncEffect from 'use-async-effect';

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
  const isLocked = useAppSelector(isLockedSelector);
  const dispatch = useAppDispatch();

  // preloader
  const setupConfigs = () => {
    setupProject();
  };

  const preload = async () => {
    const cipher = await TC_SDK.getStorageHDWalletCipherText();
    dispatch(setShowSetupWallet(Boolean(!cipher)));
    // dispatch(setIsLockedWallet(Boolean(true)));
  };

  const onPreloader = async () => {
    try {
      setIniting(true);
      setupConfigs();
      await preload();
      await sleep(0.5);
      const currentTCAccount = WalletStorage.getCurrentTCAccount();
      if (currentTCAccount) {
        dispatch(
          setCurrentTCAccount({
            tcAccount: {
              name: currentTCAccount.name,
              address: currentTCAccount.address,
            },
          }),
        );
      }
    } catch (e) {
      // handle error
    } finally {
      setIniting(false);
    }
  };

  const renderContent = () => {
    // empty
    if (initing) return <></>;
    if (isLocked || isShowSetup) {
      return <Welcome />;
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
