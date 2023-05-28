import { RootState } from '@/state';
import { createSelector } from '@reduxjs/toolkit';
import { TransactionState } from './types';

export const getTransactionSelector = (state: RootState): TransactionState => state.transaction;

export const getTransactionCanceled = createSelector(getTransactionSelector, transaction => transaction.canceled);
