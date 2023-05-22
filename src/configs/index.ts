import network from '@/lib/network.helpers';

const ENVS = import.meta.env;

// App configs
export const APP_ENV: string = ENVS.VITE_MODE;
export const API_URL: string = network.getSelectedNetwork().BE_API;
export const API_BLOCKSTREAM: string = ENVS.VITE_BLOCKSTREAM;
export const CDN_URL: string = ENVS.VITE_CDN_URL;
export const MOCKUP_PASSWORD: string = ENVS.VITE_MOCKUP_PASSWORD || '';
export const MOCKUP_MNEMONIC: string = ENVS.VITE_MOCKUP_MNEMONIC || '';
export const isKeepSign: boolean = ENVS.VITE_KEEP_SIGNIN === 'true';
export const TC_ADDRESS_TEST: string = ENVS.VITE_TC_ADDRESS_TEST || '';
export const BTC_ADDRESS_TEST: string = ENVS.VITE_BTC_ADDRESS_TEST || '';

export const CDN_URL_ICONS: string = CDN_URL + '/wallet-icons';

// Contract configs
export const ARTIFACT_CONTRACT: string = ENVS.VITE_ARTIFACT_CONTRACT;
export const BNS_CONTRACT: string = ENVS.VITE_BNS_CONTRACT;
export const BFS_ADDRESS: string = ENVS.VITE_BFS_CONTRACT;

export const TRANSFER_TX_SIZE = 1100;
export const DEPLOY_CONTRACT_TX_SIZE = 24000;
export const COEFFICIENT_GAS_LIMIT = 1.2;
export const GAS_LIMIT_TRANSFER = 21000;
