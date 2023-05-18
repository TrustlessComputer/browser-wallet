import * as TC_SDK from 'trustless-computer-sdk';
import { IListAccounts, IUserSecretKey } from '@/state/wallet/types';
import WError, { ERROR_CODE } from '@/utils/error';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { compareString } from '@/utils';
import isArray from 'lodash/isArray';

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

const getUserSecretKey = (masterIns: TC_SDK.MasterWallet): IUserSecretKey => {
  const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
  const nodes: TC_SDK.IDeriveKey[] | undefined = hdWallet.nodes;

  // check storage current TC account
  let { address } = WalletStorage.getCurrentTCAccount() || {};
  if (!address && isArray(nodes)) {
    const node0 = nodes[0];
    WalletStorage.setCurrentTCAddress({
      name: node0.name,
      address: node0.address,
    });
    address = node0.address;
  }
  const btcPrivateKey = hdWallet.btcPrivateKey;
  if (address && nodes && nodes.length && btcPrivateKey) {
    const account = nodes.find(node => compareString({ str1: node.address, str2: address, method: 'equal' }));
    if (account) {
      const btcPrivateKeyBuffer = TC_SDK.convertPrivateKeyFromStr(btcPrivateKey);
      const { address: btcAddress } = TC_SDK.generateP2WPKHKeyPair(btcPrivateKeyBuffer);
      return {
        ...account,
        btcPrivateKey: btcPrivateKey,
        btcPrivateKeyBuffer,
        btcAddress,
      };
    }
  }
  throw new WError(ERROR_CODE.FIND_CURRENT_ACCOUNT);
};

const getListAccounts = (masterIns: TC_SDK.MasterWallet): IListAccounts[] => {
  const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
  const nodes: TC_SDK.IDeriveKey[] | undefined = hdWallet.nodes;
  if (!nodes) return [];
  return nodes.map(node => ({
    name: node.name,
    index: node.index,
    address: node.address,
    isImport: false,
  }));
};

export { randomMnemonic, saveNewHDWallet, restoreMasterWallet, getUserSecretKey, getListAccounts };
