import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISetMasterCreated, ITCAccount, WalletState } from '@/state/wallet/types';

export const initialState: WalletState = {
  master: undefined,
  userSecretKey: undefined,
  password: undefined,

  // never change
  // change by network mainnet | testnet | regtest
  btcAddress: undefined,
  tcAccount: undefined,

  showSetup: false,
  isLocked: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setShowSetupWallet(state, action: PayloadAction<boolean>) {
      state.showSetup = action.payload;
    },
    setIsLockedWallet(state, action: PayloadAction<boolean>) {
      state.isLocked = action.payload;
    },
    resetSecretStore(state) {
      state.master = undefined;
      state.userSecretKey = undefined;
      state.password = undefined;
    },
    setCurrentTCAccount(state, action: PayloadAction<{ tcAccount: ITCAccount }>) {
      state.tcAccount = action.payload.tcAccount;
    },
    setCurrentBTCAddress(state, action: PayloadAction<string>) {
      state.btcAddress = action.payload;
    },
    setMasterCreated(state, action: PayloadAction<ISetMasterCreated>) {
      state.master = action.payload.master;
      state.userSecretKey = action.payload.account;
      state.password = action.payload.password;
      state.showSetup = false;
      state.isLocked = false;
    },
  },
});

export const {
  resetSecretStore,
  setShowSetupWallet,
  setMasterCreated,
  setIsLockedWallet,
  setCurrentTCAccount,
  setCurrentBTCAddress,
} = walletSlice.actions;
export default walletSlice.reducer;
