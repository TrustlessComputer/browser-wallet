import { TC_SDK } from '@/lib';

export interface WalletState {
  master: TC_SDK.MasterWallet | undefined;
  selectedUser: ISelectedUser | undefined;
  showSetup: boolean;
  isUnlock: boolean;
  password: string;
}

interface ISelectedUser {
  // trustless
  tcPrivateKey: string;
  tcAddress: string;

  // bitcoin taproot
  tpPrivateKey: string;
  tpAddress: string;
}

interface ICreateAccountPayload {
  password: string;
}

export type { ISelectedUser, ICreateAccountPayload };
