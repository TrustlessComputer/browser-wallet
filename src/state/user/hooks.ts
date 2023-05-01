import { selectedUserSelector } from './selector';
import { useSelector } from 'react-redux';
import { ISelectedUser } from '@/state/user/types';

const useCurrentUser = (): ISelectedUser | undefined => {
  // selected user
  return useSelector(selectedUserSelector);
};

export { useCurrentUser };
