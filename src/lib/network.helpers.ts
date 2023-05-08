import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';

export type IBTCNetwork = 'mainnet' | 'testnet' | 'regtest';

export interface INetwork {
  Name: string;
  ChainID: number | string;
  TCNode: string;
  BTCNetwork: IBTCNetwork;
  Explorer: string;
}

const NETWORKS: Array<INetwork> = [
  {
    Name: 'Mainnet',
    BTCNetwork: 'mainnet',
    ChainID: 22213,
    TCNode: 'https://tc-node.trustless.computer',
    Explorer: 'https://explorer.regtest.trustless.computer',
  },
  {
    Name: 'Regtest manual',
    ChainID: 22213,
    TCNode: 'https://tc-node-manual.regtest.trustless.computer',
    BTCNetwork: 'regtest',
    Explorer: 'https://explorer.regtest.trustless.computer',
  },
  {
    Name: 'Regtest auto',
    ChainID: 22213,
    TCNode: 'https://tc-node-manual.regtest.trustless.computer',
    BTCNetwork: 'regtest',
    Explorer: 'https://explorer.regtest.trustless.computer',
  },
];

class Network {
  network: INetwork;
  constructor() {
    this.network = this.getSelectedNetwork();
  }

  getSelectedNetwork(): INetwork {
    const key = LocalStorageKey.SELECTED_NETWORK;
    let network = storageLocal.get(key);
    if (!network) {
      network = NETWORKS[0];
      storageLocal.set(key, network);
    }
    return network;
  }

  getListNetworks(): INetwork[] {
    const key = LocalStorageKey.NETWORK_LIST;
    const networks: Array<INetwork> | undefined = storageLocal.get(key);
    if (!networks || !networks.length) {
      storageLocal.set(key, NETWORKS);
      return NETWORKS;
    }
    return networks;
  }
}

const network = new Network();

export default network;
