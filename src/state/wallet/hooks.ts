import { getWalletSelector, userAccountInfo, userSecretKeySelector } from './selector';
import { IUserSecretKey } from '@/state/wallet/types';
import { useAppSelector } from '@/state/hooks';

const useCurrentUserInfo = () => {
  return useAppSelector(userAccountInfo);
};

const useUserSecretKey = (): IUserSecretKey | undefined => {
  return useAppSelector(userSecretKeySelector);
};

const useCurrentWallet = () => {
  return useAppSelector(getWalletSelector);
};

export { useUserSecretKey, useCurrentWallet, useCurrentUserInfo };
