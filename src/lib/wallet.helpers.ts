import * as TC_SDK from 'trustless-computer-sdk';
import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';

const randomMnemonic = async (): Promise<TC_SDK.IHDWallet> => {
  return TC_SDK.randomMnemonic();
};

const saveNewHDWallet = async (password: string, hdWallet: TC_SDK.IHDWallet) => {
  await TC_SDK.setStorageHDWallet(hdWallet, password);
};

const restoreMasterWallet = async (password: string): Promise<TC_SDK.MasterWallet> => {
  const masterWallet = new TC_SDK.MasterWallet();
  await masterWallet.load(password);
  return masterWallet;
};

const setStoredCurrentAddress = (address: string) => {
  storageLocal.set(LocalStorageKey.CURRENT_ACCOUNT_ADDRESS, address);
};

const getStoredCurrentAddress = async () => {
  storageLocal.get(LocalStorageKey.CURRENT_ACCOUNT_ADDRESS);
};

export { randomMnemonic, saveNewHDWallet, restoreMasterWallet, setStoredCurrentAddress, getStoredCurrentAddress };
