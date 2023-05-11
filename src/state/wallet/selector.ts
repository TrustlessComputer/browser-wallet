import { RootState } from '@/state';
import { createSelector } from '@reduxjs/toolkit';
import { WalletState } from '@/state/wallet/types';

export const getWalletSelector = (state: RootState): WalletState | undefined => state.wallet;

export const isShowSetupSelector = createSelector(getWalletSelector, wallet => wallet?.showSetup);

export const isLockedSelector = createSelector(getWalletSelector, wallet => wallet?.isLocked);

export const userSecretKeySelector = createSelector(getWalletSelector, wallet => wallet?.userSecretKey);

export const userAccountInfoSelector = createSelector(getWalletSelector, wallet => {
  const tcAccount = wallet?.tcAccount;
  const btcAddress = wallet?.btcAddress;
  if (!tcAccount || !btcAddress) return undefined;
  return { ...tcAccount, btcAddress };
});

export const listAccountsSelector = createSelector(getWalletSelector, wallet => wallet?.accounts || []);
