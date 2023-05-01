import * as TC_SDK from 'trustless-computer-sdk';

const randomMnemonic = async (): Promise<TC_SDK.IHDWallet> => {
  return TC_SDK.randomMnemonic();
};

const saveNewHDWallet = async (password: string, hdWallet: TC_SDK.HDWallet) => {
  await TC_SDK.setStorageHDWallet(hdWallet, password);
};

const restoreMasterWallet = async (password: string): Promise<TC_SDK.MasterWallet> => {
  const masterWallet = new TC_SDK.MasterWallet();
  await masterWallet.load(password);
  return masterWallet;
};

export { randomMnemonic, saveNewHDWallet, restoreMasterWallet };
