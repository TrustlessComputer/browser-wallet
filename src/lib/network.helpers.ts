import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { compareString } from '@/utils';
import * as TC_CONNECT from 'tc-connect';

export interface INetwork extends TC_CONNECT.INetwork {}
export type IBTCNetwork = TC_CONNECT.IBTCNetwork;

const ENVS = import.meta.env;
const DEFAULT_NETWORK_KEY: string = ENVS.VITE_DEFAULT_NETWORK_KEY;

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
    ConnectURL: 'https://wadary.regtest.trustless.computer/relayer',
    ARTIFACT_CONTRACT: '0x16EfDc6D3F977E39DAc0Eb0E123FefFeD4320Bc0',
    BNS_CONTRACT: '0x8b46F89BBA2B1c1f9eE196F43939476E79579798',
    BFS_CONTRACT: '0x8BAA6365028894153DEC048E4F4e5e6D2cE99C58',
  },
];

class Network {
  current: INetwork;
  constructor() {
    this.current = this.getSelectedNetwork();
  }

  getSelectedNetwork(): INetwork {
    const key = LocalStorageKey.SELECTED_NETWORK_KEY;
    const networks = this.getListNetworks();
    const defaultKey = DEFAULT_NETWORK_KEY || networks[0].Key;
    let selectedKey = storageLocal.get(key) || defaultKey;
    const isExist = networks.some(network =>
      compareString({
        str1: network.Key,
        str2: selectedKey,
        method: 'equal',
      }),
    );

    if (!isExist) {
      selectedKey = networks[0].Key;
    }

    const network = networks.find(network => network.Key.toLowerCase() === selectedKey.toLowerCase()) as INetwork;
    this.current = network;
    storageLocal.set(key, network.Key);
    return network;
  }

  getListNetworks(): INetwork[] {
    const advanceNetworks = storageLocal.get(LocalStorageKey.ADVANCE_USER) ? ADVANCE_NETWORKS : [];
    return [...TC_CONNECT.NETWORKS, ...advanceNetworks];
  }

  switchNetwork(network: INetwork) {
    const key = LocalStorageKey.SELECTED_NETWORK_KEY;
    storageLocal.set(key, network.Key);
  }
}

const network = new Network();

export default network;
