import { TC_SDK } from '@/lib';

export interface WalletState {
  master: TC_SDK.MasterWallet | undefined;
  selectedUser: ISelectedUser | undefined;
  password: string | undefined;
  showSetup: boolean;
}

interface ISelectedUser extends TC_SDK.IDeriveKey {
  // bitcoin taproot
  btcPrivateKey: string;
  btcPrivateKeyBuffer: Buffer;
  btcAddress: string;
}

interface ICreateAccountPayload {
  password: string;
}

interface ISetMasterCreated {
  master: TC_SDK.MasterWallet;
  account: ISelectedUser;
  password: string;
}

export type { ISelectedUser, ICreateAccountPayload, ISetMasterCreated };
