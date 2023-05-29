import { RootState } from '@/state';
import { createSelector } from '@reduxjs/toolkit';
import { IUserInfo, WalletState } from '@/state/wallet/types';

export const getWalletSelector = (state: RootState): WalletState | undefined => state.wallet;

export const masterWalletSelector = createSelector(getWalletSelector, wallet => wallet?.master);

export const isShowSetupSelector = createSelector(getWalletSelector, wallet => wallet?.showSetup);

export const isLockedSelector = createSelector(getWalletSelector, wallet => wallet?.isLocked);

export const userSecretKeySelector = createSelector(getWalletSelector, wallet => wallet?.userSecretKey);

export const passwordSelector = createSelector(getWalletSelector, wallet => wallet?.password);

export const userAccountInfoSelector = createSelector(getWalletSelector, wallet => {
  const tcAccount = wallet?.tcAccount;
  const btcAddress = wallet?.btcAddress;
  if (!tcAccount || !btcAddress) return undefined;
  return { ...tcAccount, btcAddress } as IUserInfo;
});

export const listAccountsSelector = createSelector(getWalletSelector, wallet => wallet?.accounts || []);

export const getBalanceByAddressSelector = createSelector(
  getWalletSelector,
  wallet => (address: string) => (wallet?.addressBalance || {})[address],
);
