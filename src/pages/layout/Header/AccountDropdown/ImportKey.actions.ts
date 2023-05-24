import sleep from '@/utils/sleep';
import { setCurrentTCAccount, setListAccounts } from '@/state/wallet/reducer';
import { MasterWallet } from 'trustless-computer-sdk';
import WError, { ERROR_CODE } from '@/utils/error';
import { getListAccounts, getUserSecretKey } from '@/lib/wallet';
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

export interface IImportKeyAction {
  importKey: (name: string, privateKey: string) => void;
}

export class ImportKeyAction implements IImportKeyAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  importKey = async (name: string, privateKey: string) => {
    const { masterIns, password } = this.component;
    if (!masterIns || !password) throw new WError(ERROR_CODE.INVALID_PARAMS);
    const masterlessIns: TC_SDK.Masterless = masterIns.getMasterless();
    if (masterlessIns) {
      const newAccount: TC_SDK.IMasterless = await masterlessIns.importNewAccount({
        password,
        name,
        privateKey,
        nodes: this.component.accounts,
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
