import * as TC_CONNECT from 'tc-connect';
import network from '@/lib/network.helpers';

const getConnector = (requestID?: string) => {
  const connector = new TC_CONNECT.WalletConnect(network.current.ConnectURL, requestID);
  return connector;
};

export { getConnector };
