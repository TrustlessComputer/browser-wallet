import { RootState } from '@/state';
import { createSelector } from '@reduxjs/toolkit';
import { WalletState } from '@/state/wallet/types';

export const getWalletSelector = (state: RootState): WalletState | undefined => state.wallet;

export const isShowSetupSelector = createSelector(getWalletSelector, wallet => wallet?.showSetup);

export const selectedUserSelector = createSelector(getWalletSelector, wallet => wallet?.selectedUser);
