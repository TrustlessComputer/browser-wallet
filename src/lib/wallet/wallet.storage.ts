import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { ITCAccount } from '@/state/wallet/types';

class WalletStorage {
  static getCurrentTCAccount = (): ITCAccount | undefined => {
    return storageLocal.get(LocalStorageKey.CURRENT_TC_ACCOUNT);
  };

  static setCurrentTCAddress = (payload: ITCAccount) => {
    storageLocal.set(LocalStorageKey.CURRENT_TC_ACCOUNT, {
      name: payload.name,
      address: payload.address,
    });
  };

  static removeCurrentTCAccount = () => {
    return storageLocal.remove(LocalStorageKey.CURRENT_TC_ACCOUNT);
  };

  static setBTCAddress = () => {
    return storageLocal.remove(LocalStorageKey.CURRENT_TC_ACCOUNT);
  };
}

export default WalletStorage;
