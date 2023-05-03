import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISetMasterCreated, WalletState } from '@/state/wallet/types';

export const initialState: WalletState = {
  master: undefined,
  selectedUser: undefined,
  password: undefined,
  showSetup: false,
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setShowSetupWallet(state, action: PayloadAction<boolean>) {
      state.showSetup = action.payload;
    },
    resetUser(state) {
      delete state.master;
      delete state.selectedUser;
      delete state.password;
      state.master = undefined;
      state.selectedUser = undefined;
      state.password = undefined;
    },
    setMasterCreated(state, action: PayloadAction<ISetMasterCreated>) {
      delete state.master;
      delete state.selectedUser;
      state.master = action.payload.master;
      state.selectedUser = action.payload.account;
      state.password = action.payload.password;
      state.showSetup = false;
    },
  },
});

export const { resetUser, setShowSetupWallet, setMasterCreated } = walletSlice.actions;
export default walletSlice.reducer;
