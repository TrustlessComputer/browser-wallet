import { TC_SDK } from '@/lib';

export interface WalletState {
  master: TC_SDK.MasterWallet | undefined;
  userSecretKey: IUserSecretKey | undefined;
  password: string | undefined;

  tcAccount: ITCAccount | undefined;
  btcAddress: string | undefined;

  showSetup: boolean;
  isLocked: boolean;
}

interface IUserSecretKey extends TC_SDK.IDeriveKey {
  // bitcoin taproot
  btcPrivateKey: string;
  btcPrivateKeyBuffer: Buffer;
  btcAddress: string;
}

interface ICreateAccountPayload {
  password: string;
}

interface ITCAccount {
  name: string;
  address: string;
}

interface ISetMasterCreated {
  master: TC_SDK.MasterWallet;
  account: IUserSecretKey;
  password: string;
}

export type { IUserSecretKey, ICreateAccountPayload, ISetMasterCreated, ITCAccount };
