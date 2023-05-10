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

  private static getKeyTransactionCount = (address: string) => {
    return `${LocalStorageKey.TRANSACTION_COUNT}-${address.toLowerCase()}`;
  };

  static getTransactionCount = (address: string): number | undefined => {
    const key = this.getKeyTransactionCount(address);
    const nonce = storageLocal.get(key);
    return nonce ? Number(nonce) : undefined;
  };

  static setTransactionCount = (address: string, nonce: number | string) => {
    const key = this.getKeyTransactionCount(address);
    storageLocal.set(key, nonce);
  };
}

export default WalletStorage;
