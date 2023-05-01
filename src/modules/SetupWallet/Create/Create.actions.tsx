import { CreateWalletSteps } from '../types';

interface IComponent {
  setLoading: (data: boolean) => void;
  setCurrentStep: (data: CreateWalletSteps) => void;
}

export interface ICreateWalletAction {}

export class CreateWalletAction implements ICreateWalletAction {
  protected component: IComponent;
  protected dispatch: any;

  constructor(props: { component: IComponent; dispatch: any }) {
    this.component = props.component;
    this.dispatch = props.dispatch;
  }

  createWallet = async () => {};
}
