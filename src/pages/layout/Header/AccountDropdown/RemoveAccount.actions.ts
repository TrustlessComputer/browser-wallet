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
    const unImportAccounts = accounts.filter(account => !account.isImport);
    const masterIns = this.component.masterIns;
    if (unImportAccounts.length === 1 || !masterIns) {
      throw new Error('Can not remove this account.');
    }
    const removedAccount = accounts.find(account =>
      compareString({ str1: account.address, str2: address, method: 'equal' }),
    );
    if (!removedAccount) {
      throw new Error('Can not find account.');
    }
    const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
    await hdWallet.deletedAccount({
      password: this.component.password,
      address: address,
    });
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