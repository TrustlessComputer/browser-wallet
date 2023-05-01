import { RootState } from '@/state';
import { createSelector } from '@reduxjs/toolkit';
import { WalletState } from '@/state/user/types';

export const getUserSelector = (state: RootState): WalletState | undefined => state.user;

export const isShowSetupSelector = createSelector(getUserSelector, user => user?.showSetup);

export const selectedUserSelector = createSelector(getUserSelector, user => user?.selectedUser);
