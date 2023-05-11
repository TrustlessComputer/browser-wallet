import { setCurrentTCAccount } from '@/state/wallet/reducer';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { IListAccounts } from '@/state/wallet/types';
import { compareString } from '@/utils';

interface IComponent {
  accounts: IListAccounts[];
}

export interface ISwitchAccountAction {
  switchAccount: (address: string) => void;
}

export class SwitchAccountAction implements ISwitchAccountAction {
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
    this.dispatch(
      setCurrentTCAccount({
        tcAccount: {
          ...account,
        },
      }),
    );
  };
}
