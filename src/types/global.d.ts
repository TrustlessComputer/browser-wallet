import { StorageService, TcClient } from 'trustless-computer-sdk';
import { networks } from 'bitcoinjs-lib';
import { INetwork } from '@/lib/network.helpers';

declare global {
  const tcStorage: StorageService;
  const tcClient: TcClient;
  const tcBTCNetwork: typeof networks.bitcoin | typeof networks.regtest | typeof networks.testnet;
  const network: INetwork;
}
