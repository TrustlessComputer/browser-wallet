import { getWalletSelector, selectedUserSelector } from './selector';
import { useSelector } from 'react-redux';
import { ISelectedUser } from '@/state/wallet/types';

const useCurrentUser = (): ISelectedUser | undefined => {
  // selected user
  return useSelector(selectedUserSelector);
};

const useCurrentWallet = () => {
  return useSelector(getWalletSelector);
};

export { useCurrentUser, useCurrentWallet };
