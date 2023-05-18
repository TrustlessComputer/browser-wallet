import { TC_SDK } from '@/lib';

export interface WalletState {
  master: TC_SDK.MasterWallet | undefined;
  userSecretKey: IUserSecretKey | undefined;
  password: string | undefined;

  tcAccount: ITCAccount | undefined;
  btcAddress: string | undefined;
  accounts: IListAccounts[];

  showSetup: boolean;
  isLocked: boolean;
}

interface IUserSecretKey extends TC_SDK.IDeriveKey {
  // bitcoin segwit
  btcPrivateKey: string;
  btcPrivateKeyBuffer: Buffer;
  btcAddress: string;
}

interface IListAccounts {
  name: string;
  index: number;
  address: string;
  isImport: boolean;
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

interface IUserInfo extends ITCAccount {
  btcAddress: string;
}

export type { IUserSecretKey, ICreateAccountPayload, ISetMasterCreated, ITCAccount, IListAccounts, IUserInfo };
