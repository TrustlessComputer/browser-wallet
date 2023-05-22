import { setCurrentTCAccount, setMasterCreated } from '@/state/wallet/reducer';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { IListAccounts } from '@/state/wallet/types';
import { compareString } from '@/utils';
import { MasterWallet } from 'trustless-computer-sdk';
import { getUserSecretKey } from '@/lib/wallet';

interface IComponent {
  accounts: IListAccounts[];
  masterIns?: MasterWallet;
  password?: string;
  setLoading: (loading: boolean) => void;
}

export interface ISelectAccountAction {
  switchAccount: (address: string) => void;
}

export class SelectAccountAction implements ISelectAccountAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  switchAccount = async (address: string) => {
    this.component.setLoading(true);
    const accounts = this.component.accounts;
    const switchedAccount = accounts.find(account =>
      compareString({ str1: account.address, str2: address, method: 'equal' }),
    );
    if (!switchedAccount) {
      throw new Error('Can not find account.');
    }
    const account = {
      name: switchedAccount.name,
      address: switchedAccount.address,
    };
    WalletStorage.setCurrentTCAddress({
      ...account,
    });
    const { masterIns, password } = this.component;
    if (!masterIns || !password) {
      throw new Error('Account undefined');
    }
    const accountSecretKey = await getUserSecretKey(masterIns);

    this.dispatch(
      setCurrentTCAccount({
        tcAccount: {
          ...account,
        },
      }),
    );

    this.dispatch(
      setMasterCreated({
        master: masterIns,
        account: accountSecretKey,
        password: password,
      }),
    );

    setTimeout(() => {
      this.component.setLoading(false);
    }, 500);
  };
}