import { TC_SDK } from '@/lib';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/error';
import { ISetMasterCreated } from '@/state/wallet/types';
import { getListAccounts, getUserSecretKey } from '@/lib/wallet';
import { setCurrentBTCAddress, setCurrentTCAccount, setListAccounts } from '@/state/wallet/reducer';
import { batch } from 'react-redux';

const { MasterWallet, getStorageHDWallet } = TC_SDK;

interface IComponent {
  setLoading: (data: boolean) => void;
  setErrMess?: (data: string) => void;
}

export interface IUnlockWalletAction {
  unlockWallet: (password: string) => void;
}

export class UnlockWalletAction implements IUnlockWalletAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  unlockWallet = async (password: string): Promise<ISetMasterCreated | undefined> => {
    this.component.setLoading(true);
    try {
      const storedWallet = await getStorageHDWallet(password);
      if (storedWallet) {
        const masterIns = new MasterWallet();
        await masterIns.load(password);
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
          this.dispatch(setCurrentBTCAddress(account.btcAddress));
          this.dispatch(setListAccounts(accounts));
        });
        return {
          master: masterIns,
          account,
          password,
        };
      }
    } catch (e) {
      const { message } = getErrorMessage(e, 'restoreWallet');
      toast.error(message);
      if (this.component.setErrMess) {
        this.component.setErrMess(message);
      }
    } finally {
      this.component.setLoading(false);
    }
  };
}
