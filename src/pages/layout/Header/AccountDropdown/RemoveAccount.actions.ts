import { MasterWallet } from 'trustless-computer-sdk';
import { IListAccounts, IUserInfo } from '@/state/wallet/types';
import { compareString } from '@/utils';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { setCurrentTCAccount, setListAccounts } from '@/state/wallet/reducer';
import { TC_SDK } from '@/lib';

interface IComponent {
  password: string;
  currentAccount: IUserInfo | undefined;
  accounts: IListAccounts[];
  setLoading: (loading: boolean) => void;
  masterIns: MasterWallet | undefined;
}

export interface IRemoveAccountAction {
  removeAccount: (address: string) => void;
}

export class RemoveAccountAction implements IRemoveAccountAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }
  removeAccount = async (address: string) => {
    const accounts = this.component.accounts;
    const isImported = accounts.some(
      account =>
        compareString({
          str1: account.address,
          str2: address,
          method: 'equal',
        }) && account.isImport,
    );
    const masterIns = this.component.masterIns;
    if (!masterIns || !isImported) {
      throw new Error('Can not remove this account.');
    }
    const removedAccount = accounts.find(account =>
      compareString({ str1: account.address, str2: address, method: 'equal' }),
    );
    if (!removedAccount) {
      throw new Error('Can not find account.');
    }
    const hdWalletIns: TC_SDK.HDWallet = masterIns.getHDWallet();
    const masterlessIns: TC_SDK.Masterless = masterIns.getMasterless();
    if (removedAccount.isImport) {
      await masterlessIns.deletedMasterless({
        password: this.component.password,
        address: address,
      });
    } else {
      await hdWalletIns.deletedAccount({
        password: this.component.password,
        address: address,
      });
    }

    const newAccounts = accounts.filter(account =>
      compareString({ str1: account.address, str2: address, method: 'diff' }),
    );
    this.dispatch(setListAccounts(newAccounts));
    if (this.component.currentAccount) {
      const isCurrent = compareString({ str1: this.component.currentAccount.address, str2: address, method: 'equal' });
      if (isCurrent) {
        const newAccount = {
          name: newAccounts[0].name,
          address: newAccounts[0].address,
        };
        WalletStorage.setCurrentTCAddress({
          ...newAccount,
        });
        this.dispatch(
          setCurrentTCAccount({
            tcAccount: {
              ...newAccount,
            },
          }),
        );
      }
    }
  };
}
