import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationState } from './types';

export const initialState: ApplicationState = {
  isDark: true,
};

const appSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setIsDarkMode(state, action: PayloadAction<boolean>) {
      state.isDark = action.payload;
    },
  },
});

export const { setIsDarkMode } = appSlice.actions;
export default appSlice.reducer;
