import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState } from '@/state/user/types';

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
    },
  },
  extraReducers: builder => {
    builder.addCase(createAccount.fulfilled, (state, action) => {
      // console.log('SANG TEST: ', state, action);
    });
  },
});

export const { resetUser, setShowSetupWallet } = userSlice.actions;
export default userSlice.reducer;
