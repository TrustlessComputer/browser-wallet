import { TC_SDK } from '@/lib';
import { saveNewHDWallet, getUserSecretKey } from '@/lib/wallet';
import { resetSecretStore, setCurrentBTCAddress, setCurrentTCAccount, setMasterCreated } from '@/state/wallet/reducer';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/error';
import sleep from '@/utils/sleep';
import WalletStorage from '@/lib/wallet/wallet.storage';
import { batch } from 'react-redux';

const { MasterWallet } = TC_SDK;

interface IComponent {
  setLoading: (data: boolean) => void;
  setErrMess?: (data: string) => void;
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
    this.component.setLoading(true);
    try {
      await saveNewHDWallet(password, wallet);
      const masterIns = new MasterWallet();
      await masterIns.load(password);

      const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
      const nodes: TC_SDK.IDeriveKey[] | undefined = hdWallet.nodes;
      if (nodes && nodes.length) {
        this.dispatch(resetSecretStore());
        await sleep(0.5);
        const account = await getUserSecretKey(masterIns);
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
          this.dispatch(
            setMasterCreated({
              master: masterIns,
              account: account,
              password,
            }),
          );
        });
      }
    } catch (e) {
      WalletStorage.removeCurrentTCAccount();
      const { message } = getErrorMessage(e, 'createWallet');
      toast.error(message);
      if (this.component.setErrMess) {
        this.component.setErrMess(message);
      }
    } finally {
      this.component.setLoading(false);
    }
  };
}
