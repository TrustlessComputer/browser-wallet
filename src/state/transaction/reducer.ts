import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISetTransactionCanceled, TransactionState } from './types';

export const initialState: TransactionState = {
  canceled: {},
};

const appSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionCanceled(state, action: PayloadAction<ISetTransactionCanceled>) {
      const { tcHashs } = action.payload;
      let updated = {};
      for (const tcHash of tcHashs) {
        updated = {
          ...updated,
          [tcHash.toLowerCase()]: true,
        };
      }
      state.canceled = {
        ...state.canceled,
        ...updated,
      };
    },
  },
});

export const { setTransactionCanceled } = appSlice.actions;
export default appSlice.reducer;
