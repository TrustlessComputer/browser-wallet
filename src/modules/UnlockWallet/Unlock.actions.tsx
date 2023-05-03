import { TC_SDK } from '@/lib';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/error';
import { ISetMasterCreated } from '@/state/wallet/types';
import { selectCurrentNode } from '@/lib/wallet.helpers';

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
        const account = await selectCurrentNode(masterIns);
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
