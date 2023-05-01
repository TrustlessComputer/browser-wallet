import React, { PropsWithChildren, useMemo } from 'react';

export interface IWalletContext {}

const initialValue: IWalletContext = {};

export const WalletContext = React.createContext<IWalletContext>(initialValue);

export const WalletProvider: React.FC<PropsWithChildren> = ({ children }: PropsWithChildren): React.ReactElement => {
  const contextValues = useMemo((): IWalletContext => {
    return {};
  }, []);

  return <WalletContext.Provider value={contextValues}>{children}</WalletContext.Provider>;
};
