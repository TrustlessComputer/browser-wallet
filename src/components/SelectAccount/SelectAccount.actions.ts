import { setCurrentTCAccount, setMasterCreated } from '@/state/wallet/reducer';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { IAccountItem } from '@/state/wallet/types';
import { compareString } from '@/utils';
import { MasterWallet } from 'trustless-computer-sdk';
import { getUserSecretKey } from '@/lib/wallet';

interface IComponent {
  accounts: IAccountItem[];
  masterIns?: MasterWallet;
  password?: string;
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
  };
}
