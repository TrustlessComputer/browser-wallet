import networkIns, { INetwork } from '@/lib/network.helpers';
import sleep from '@/utils/sleep';
import toast from 'react-hot-toast';
import { setIsLockedWallet } from '@/state/wallet/reducer';
import { ILoadingPayload } from '@/contexts/loader.context';

interface IComponent {
  onPreloader: () => void;
  setLoading: (payload: ILoadingPayload) => void;
}

export interface ISwitchNetworkAction {
  switchNetwork: (network: INetwork) => void;
}

export class SwitchNetworkAction implements ISwitchNetworkAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  switchNetwork = async (network: INetwork) => {
    try {
      this.component.setLoading({ isLoading: true });
      networkIns.switchNetwork(network);
      this.dispatch(setIsLockedWallet(true));
      await sleep(0.5);
      window.location.reload();
    } catch (e) {
      toast.error('Can not switch network.');
    } finally {
      this.component.setLoading({ isLoading: false });
    }
  };
}
