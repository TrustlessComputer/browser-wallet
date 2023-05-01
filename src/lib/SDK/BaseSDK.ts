import * as TC_SDK from 'trustless-computer-sdk';
import network from '@/lib/network.helpers';

class BaseSDK {
  static setup = () => {
    const { BTCNetwork, TCNode } = network.network;
    const networkNumber = BTCNetwork === 'mainnet' ? 1 : BTCNetwork === 'testnet' ? 2 : 3;

    const storage = new TC_SDK.StorageService();
    storage.implement({
      namespace: undefined,
      getMethod(key: string): Promise<string | null> {
        // @ts-ignore
        return localStorage.getItem(key);
      },
      removeMethod(key: string): Promise<any> {
        // @ts-ignore
        return localStorage.removeItem(key);
      },
      setMethod(key: string, data: string): Promise<any> {
        // @ts-ignore
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
}

export default BaseSDK;
