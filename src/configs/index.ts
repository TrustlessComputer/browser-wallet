const ENVS = import.meta.env;

// App configs
export const APP_ENV: string = ENVS.VITE_MODE;
export const API_URL: string = ENVS.VITE_API_URL;
export const TC_NETWORK_RPC: string = ENVS.VITE_TC_NETWORK_RPC;
export const CDN_URL: string = ENVS.VITE_CDN_URL;
export const MOCKUP_PASSWORD: string = ENVS.VITE_MOCKUP_PASSWORD || '';
export const MOCKUP_MNEMONIC: string = ENVS.VITE_MOCKUP_MNEMONIC || '';
export const isKeepSign: boolean = ENVS.VITE_KEEP_SIGNIN === 'true';
