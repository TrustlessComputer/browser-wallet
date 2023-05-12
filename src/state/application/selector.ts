import { RootState } from '@/state';
import { createSelector } from '@reduxjs/toolkit';
import { ApplicationState } from './types';

export const getApplicationSelector = (state: RootState): ApplicationState => state.application;

export const isDarkSelector = createSelector(getApplicationSelector, application => application.isDark);
