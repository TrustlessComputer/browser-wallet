const ENVS = import.meta.env;

// App configs
export const APP_ENV: string = ENVS.VITE_MODE;
export const API_URL: string = ENVS.VITE_API_URL;
export const TC_NETWORK_RPC: string = ENVS.VITE_TC_NETWORK_RPC;
export const API_BLOCKSTREAM: string = ENVS.VITE_BLOCKSTREAM;
export const CDN_URL: string = ENVS.VITE_CDN_URL;
export const MOCKUP_PASSWORD: string = ENVS.VITE_MOCKUP_PASSWORD || '';
export const MOCKUP_MNEMONIC: string = ENVS.VITE_MOCKUP_MNEMONIC || '';
export const isKeepSign: boolean = ENVS.VITE_KEEP_SIGNIN === 'true';
export const DEFAULT_NETWORK_NAME: string = ENVS.VITE_NETWORK_NAME;

export const CDN_URL_ICONS: string = CDN_URL + '/wallet-icons';

// Contract configs
export const ARTIFACT_CONTRACT: string = ENVS.VITE_ARTIFACT_CONTRACT;
export const BNS_CONTRACT: string = ENVS.VITE_BNS_CONTRACT;
export const BFS_ADDRESS: string = ENVS.VITE_BFS_CONTRACT;
