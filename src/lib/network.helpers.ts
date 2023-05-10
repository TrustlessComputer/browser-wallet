import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';

const ENVS = import.meta.env;
const DEFAULT_NETWORK_NAME: string = ENVS.VITE_DEFAULT_NETWORK_NAME;

export type IBTCNetwork = 'mainnet' | 'testnet' | 'regtest';

export interface INetwork {
  Name: string;
  ChainID: number | string;
  TCNode: string;
  BTCNetwork: IBTCNetwork;
  Explorer: string;
  BE_API: string;
  Icon: string;
}

const NETWORKS: Array<INetwork> = [
  {
    Name: 'Mainnet',
    BTCNetwork: 'mainnet',
    ChainID: 22213,
    TCNode: 'https://tc-node.trustless.computer',
    Explorer: 'https://explorer.regtest.trustless.computer',
    BE_API: 'https://dapp.trustless.computer/dapp/api',
    Icon: 'ic-penguin-currency-dark.svg',
  },
  {
    Name: 'Regtest manual',
    ChainID: 22213,
    TCNode: 'https://tc-node-manual.regtest.trustless.computer',
    BTCNetwork: 'regtest',
    Explorer: 'https://explorer.regtest.trustless.computer',
    BE_API: 'https://dapp.trustless.computer/dapp/api',
    Icon: 'ic-penguin-regtest-dark.svg',
  },
  {
    Name: 'Regtest auto',
    ChainID: 22213,
    TCNode: 'https://tc-node-auto.regtest.trustless.computer',
    BTCNetwork: 'regtest',
    Explorer: 'https://explorer.regtest.trustless.computer',
    BE_API: 'https://dapp.dev.trustless.computer/dapp/api',
    Icon: 'ic-penguin-regtest-dark.svg',
  },
];

class Network {
  current: INetwork;
  constructor() {
    this.current = this.getSelectedNetwork();
  }

  getSelectedNetwork(): INetwork {
    const key = LocalStorageKey.SELECTED_NETWORK;
    let network = storageLocal.get(key);
    if (!network) {
      const networks = this.getListNetworks();
      const dfNetwork = networks.find(item => item.Name.toLowerCase() === (DEFAULT_NETWORK_NAME || '').toLowerCase());
      network = dfNetwork ? dfNetwork : networks[0];
      storageLocal.set(key, network);
    }
    this.current = network;
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
