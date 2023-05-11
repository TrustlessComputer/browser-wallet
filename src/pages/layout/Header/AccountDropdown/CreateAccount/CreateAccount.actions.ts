import sleep from '@/utils/sleep';
import toast from 'react-hot-toast';
import { setIsLockedWallet } from '@/state/wallet/reducer';

interface IComponent {
  onPreloader: () => void;
}

export interface ICreateAccountAction {
  createAccount: () => void;
}

export class CreateAccountAction implements ICreateAccountAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  createAccount = async () => {
    try {
      this.component.onPreloader();
      await sleep(0.2);
      this.dispatch(setIsLockedWallet(true));
    } catch (e) {
      toast.error('Can not switch network.');
    }
  };
}
