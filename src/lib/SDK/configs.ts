import * as TC_SDK from 'trustless-computer-sdk';
import network, { IBTCNetwork } from '@/lib/network.helpers';

type BTCNetworkNumbType = {
  [key in IBTCNetwork]: number;
};

export const BTCNetworkNumber: BTCNetworkNumbType = {
  mainnet: 1,
  testnet: 2,
  regtest: 3,
};

const setupProject = () => {
  // get network
  const { BTCNetwork, TCNode } = network.getSelectedNetwork();
  const networkNumber = BTCNetworkNumber[BTCNetwork];

  TC_SDK.setBTCNetwork(networkNumber);

  // setup storage
  const storage = new TC_SDK.StorageService();
  storage.implement({
    namespace: undefined,
    async getMethod(key: string): Promise<string | null> {
      return localStorage.getItem(key);
    },
    async removeMethod(key: string) {
      await localStorage.removeItem(key);
    },
    async setMethod(key: string, data: string) {
      return localStorage.setItem(key, data);
    },
  });

  const tcClient = new TC_SDK.TcClient(BTCNetwork, TCNode);

  TC_SDK.setupConfig({
    storage,
    tcClient,
    netType: networkNumber,
  });
};

export { setupProject };
