import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { compareString } from '@/utils';

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
  BTCExplorer: string;
  Key: string;
}

const NETWORKS: Array<INetwork> = [
  {
    Name: 'Mainnet',
    BTCNetwork: 'mainnet',
    ChainID: 22213,
    TCNode: 'https://tc-node.trustless.computer',
    Explorer: 'https://explorer.trustless.computer',
    BE_API: 'https://dapp.trustless.computer/dapp/api',
    Icon: 'ic-penguin-currency-dark.svg',
    BTCExplorer: 'https://mempool.space',
    Key: 'Mainnet',
  },
  {
    Name: 'Regtest manual',
    ChainID: 22213,
    TCNode: 'https://tc-node-manual.regtest.trustless.computer',
    BTCNetwork: 'regtest',
    Explorer: 'https://explorer.regtest.trustless.computer',
    BE_API: 'https://dapp.dev.trustless.computer/dapp/api',
    Icon: 'ic-penguin-regtest-dark.svg',
    BTCExplorer: 'https://blockstream.regtest.trustless.computer/regtest',
    Key: 'Regtest manual',
  },
];

const ADVANCE_NETWORKS: Array<INetwork> = [
  {
    Name: 'Regtest auto',
    ChainID: 22213,
    TCNode: 'https://tc-node-auto.regtest.trustless.computer',
    BTCNetwork: 'regtest',
    Explorer: 'https://explorer.regtest.trustless.computer',
    BE_API: 'https://dapp.dev.trustless.computer/dapp/api',
    Icon: 'ic-penguin-regtest-dark.svg',
    BTCExplorer: 'https://blockstream.regtest.trustless.computer/regtest',
    Key: 'Regtest auto',
  },
];

class Network {
  current: INetwork;
  constructor() {
    this.current = this.getSelectedNetwork();
  }

  getSelectedNetwork(): INetwork {
    const key = LocalStorageKey.SELECTED_NETWORK_NAME;
    const networks = this.getListNetworks();
    const defaultName = DEFAULT_NETWORK_NAME || networks[0].Name;
    let selectedName = storageLocal.get(key) || defaultName;
    const isExist = networks.some(network =>
      compareString({
        str1: network.Name,
        str2: selectedName,
        method: 'equal',
      }),
    );

    if (!isExist) {
      selectedName = networks[0].Name;
    }

    const network = networks.find(network => network.Name.toLowerCase() === selectedName.toLowerCase()) as INetwork;
    this.current = network;
    storageLocal.set(key, network.Name);
    return network;
  }

  getListNetworks(): INetwork[] {
    const advanceNetworks = storageLocal.get(LocalStorageKey.ADVANCE_NETWORK) ? ADVANCE_NETWORKS : [];
    return [...NETWORKS, ...advanceNetworks];
  }

  switchNetwork(network: INetwork) {
    const key = LocalStorageKey.SELECTED_NETWORK_NAME;
    storageLocal.set(key, network.Name);
  }
}

const network = new Network();

export default network;
