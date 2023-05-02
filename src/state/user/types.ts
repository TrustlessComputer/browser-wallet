import { TC_SDK } from '@/lib';

export interface WalletState {
  master: TC_SDK.MasterWallet | undefined;
  selectedUser: ISelectedUser | undefined;
  showSetup: boolean;
  isUnlock: boolean;
  password: string;
}

interface ISelectedUser extends TC_SDK.IDeriveKey {
  // bitcoin taproot
  btcAddress: string;
  btcPrivateKey: string;
}

interface ICreateAccountPayload {
  password: string;
}

interface ISetMasterCreated {
  master: TC_SDK.MasterWallet;
}

export type { ISelectedUser, ICreateAccountPayload, ISetMasterCreated };
