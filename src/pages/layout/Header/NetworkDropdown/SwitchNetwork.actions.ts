import networkIns, { INetwork } from '@/lib/network.helpers';
import sleep from '@/utils/sleep';
import toast from 'react-hot-toast';
// import { setIsLockedWallet } from '@/state/wallet/reducer';

interface IComponent {
  onPreloader: () => void;
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
      networkIns.switchNetwork(network);
      await sleep(0.2);
      // this.component.onPreloader();
      // await sleep(0.2);
      // this.dispatch(setIsLockedWallet(true));
      window.location.reload();
    } catch (e) {
      toast.error('Can not switch network.');
    }
  };
}
