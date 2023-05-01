import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISetMasterCreated, WalletState } from '@/state/user/types';
import { TC_SDK } from '@/lib';

export const initialState: WalletState = {
  master: undefined,
  selectedUser: undefined,
  password: '',
  showSetup: false,
  isUnlock: false,
};

export const createAccount = createAsyncThunk('create-account', async (password: string, { getState }) => {
  const state = getState();
  console.log(state);
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setShowSetupWallet(state, action: PayloadAction<boolean>) {
      state.showSetup = action.payload;
    },
    resetUser(state) {
      state.master = undefined;
      state.selectedUser = undefined;
      delete state.master;
      delete state.selectedUser;
    },
    setMasterCreated(state, action: PayloadAction<ISetMasterCreated>) {
      state.master = action.payload.master;
    },
  },
});

export const { resetUser, setShowSetupWallet, setMasterCreated } = userSlice.actions;
export default userSlice.reducer;
