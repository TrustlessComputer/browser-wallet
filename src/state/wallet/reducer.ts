import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAccountItem, ISetMasterCreated, ITCAccount, WalletState } from '@/state/wallet/types';

export const initialState: WalletState = {
  master: undefined,
  userSecretKey: undefined,
  password: undefined,

  showSetup: false,
  isLocked: false,

  // never change
  // change by network mainnet | testnet | regtest
  btcAddress: undefined,
  tcAccount: undefined,
  accounts: [],
  addressBalance: {},
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
    setListAccounts(state, action: PayloadAction<IAccountItem[]>) {
      state.accounts = action.payload;
    },
    setMasterCreated(state, action: PayloadAction<ISetMasterCreated>) {
      state.master = action.payload.master;
      state.userSecretKey = action.payload.account;
      state.password = action.payload.password;
      state.showSetup = false;
      state.isLocked = false;
    },
    setAddressBalance(state, action: PayloadAction<{ address: string; balance: string }>) {
      const { address, balance } = action.payload;
      state.addressBalance = {
        ...state.addressBalance,
        [address]: balance,
      };
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
  setListAccounts,
  setAddressBalance,
} = walletSlice.actions;
export default walletSlice.reducer;
