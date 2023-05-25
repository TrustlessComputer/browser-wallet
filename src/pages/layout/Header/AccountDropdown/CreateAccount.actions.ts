import sleep from '@/utils/sleep';
import { setCurrentTCAccount, setListAccounts } from '@/state/wallet/reducer';
import { MasterWallet } from 'trustless-computer-sdk';
import WError, { ERROR_CODE } from '@/utils/error';
import { getListAccounts, getUserSecretKey, getInstanceAndNodes } from '@/lib/wallet';
import { batch } from 'react-redux';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { TC_SDK } from '@/lib';
import { IListAccounts } from '@/state/wallet/types';

interface IComponent {
  setLoading: (loading: boolean) => void;
  password: string | undefined;
  masterIns: MasterWallet | undefined;
  accounts: IListAccounts[];
}

export interface ICreateAccountAction {
  createAccount: (name: string) => void;
}

export class CreateAccountAction implements ICreateAccountAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  createAccount = async (name: string) => {
    const { masterIns, password } = this.component;
    if (!masterIns || !password) throw new WError(ERROR_CODE.INVALID_PARAMS);
    const { seedWalletIns, seedNodes, importedNodes } = getInstanceAndNodes(masterIns);
    const nodes = [...seedNodes, ...importedNodes];
    if (seedWalletIns) {
      const newAccount: TC_SDK.IDeriveKey = await seedWalletIns.createNewAccount({
        password,
        name,
        accounts: nodes,
      });
      WalletStorage.setCurrentTCAddress({
        name: newAccount.name,
        address: newAccount.address,
      });
      await sleep(0.2);
      const account = await getUserSecretKey(masterIns);
      const accounts = getListAccounts(masterIns);
      batch(() => {
        this.dispatch(
          setCurrentTCAccount({
            tcAccount: {
              name: account.name,
              address: account.address,
            },
          }),
        );
        this.dispatch(setListAccounts(accounts));
      });
    }
  };
}
