import { TC_SDK } from '@/lib';
import { CreateWalletSteps } from '../types';
import { saveNewHDWallet, setStoredCurrentAddress } from '@/lib/wallet.helpers';
import { setMasterCreated } from '@/state/user/reducer';

const { MasterWallet } = TC_SDK;

interface IComponent {
  setLoading: (data: boolean) => void;
  setCurrentStep: (data: CreateWalletSteps) => void;
}

export interface ICreateWalletAction {
  createWallet: (wallet: TC_SDK.IHDWallet, password: string) => void;
}

export class CreateWalletAction implements ICreateWalletAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  createWallet = async (wallet: TC_SDK.IHDWallet, password: string) => {
    await saveNewHDWallet(password, wallet);
    const masterIns = new MasterWallet();
    await masterIns.load(password);

    const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
    const nodes: TC_SDK.IDeriveKey[] | undefined = hdWallet.nodes;
    if (nodes && nodes.length) {
      setStoredCurrentAddress(nodes[0].address);
      this.dispatch(
        setMasterCreated({
          master: masterIns,
        }),
      );
    }
  };
}
