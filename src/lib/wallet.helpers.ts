import * as TC_SDK from 'trustless-computer-sdk';
import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { ISelectedUser } from '@/state/user/types';
import WError, { ERROR_CODE } from '@/utils/error';

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

const getStoredCurrentAddress = () => {
  return storageLocal.get(LocalStorageKey.CURRENT_ACCOUNT_ADDRESS);
};

const loadCurrentAccount = (masterIns: TC_SDK.MasterWallet): ISelectedUser => {
  const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
  const nodes: TC_SDK.IDeriveKey[] | undefined = hdWallet.nodes;
  const address: string = getStoredCurrentAddress();

  const btcPrivateKey = hdWallet.btcPrivateKey;

  if (address && nodes && nodes.length && btcPrivateKey) {
    const account = nodes.find(node => node.address === address);
    if (account) {
      return {
        ...account,
        btcPrivateKey: btcPrivateKey,
        // btcAddress: TC_SDK,
        btcAddress: '',
      };
    }
  }
  throw new WError(ERROR_CODE.FIND_CURRENT_ACCOUNT);
};

export {
  randomMnemonic,
  saveNewHDWallet,
  restoreMasterWallet,
  setStoredCurrentAddress,
  getStoredCurrentAddress,
  loadCurrentAccount,
};
