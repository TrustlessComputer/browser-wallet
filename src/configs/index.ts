import network from '@/lib/network.helpers';

const ENVS = import.meta.env;
const selectedNetwork = network.getSelectedNetwork();
// App configs
export const APP_ENV: string = ENVS.VITE_MODE;
export const API_URL: string = selectedNetwork.BE_API;
export const API_BLOCKSTREAM: string = ENVS.VITE_BLOCKSTREAM;
export const CDN_URL: string = ENVS.VITE_CDN_URL;
export const MOCKUP_PASSWORD: string = ENVS.VITE_MOCKUP_PASSWORD || '';
export const MOCKUP_MNEMONIC: string = ENVS.VITE_MOCKUP_MNEMONIC || '';
export const TC_ADDRESS_TEST: string = ENVS.VITE_TC_ADDRESS_TEST || '';
export const BTC_ADDRESS_TEST: string = ENVS.VITE_BTC_ADDRESS_TEST || '';

export const CDN_URL_ICONS: string = CDN_URL + '/wallet-icons';

// Contract configs
export const ARTIFACT_CONTRACT: string = selectedNetwork.ARTIFACT_CONTRACT;
export const BNS_CONTRACT: string = selectedNetwork.BNS_CONTRACT;
export const BFS_ADDRESS: string = selectedNetwork.BFS_CONTRACT;

export const TRANSFER_TX_SIZE = 1000;
export const DEPLOY_CONTRACT_TX_SIZE = 24000;
export const COEFFICIENT_GAS_LIMIT = 1.2;
export const GAS_LIMIT_TRANSFER = 21000;
