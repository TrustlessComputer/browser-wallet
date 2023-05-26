import { getAddress } from '@ethersproject/address';
import camelCase from 'lodash/camelCase';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export const shortCryptoAddress = (address = '', toLength?: number) => {
  if (toLength) {
    if (address.length <= toLength) return address;
    const x = Math.floor(toLength / 2);
    return `${address?.substr(0, x)}...${address?.substr(address?.length - x)}`;
  }
  if (address.length <= 16) return address;
  return `${address?.substr(0, 8)}...${address?.substr(address?.length - 8)}`;
};

export const camelCaseKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => camelCaseKeys(v));
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelCaseKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export const convertHexToNumber = (value: string): number => {
  if (value.startsWith('0x')) {
    const number = Web3.utils.hexToNumber(value);
    return new BigNumber(number).toNumber();
  }
  return new BigNumber(value || 0).toNumber();
};
