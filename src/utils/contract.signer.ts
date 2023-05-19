import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { Contract } from '@ethersproject/contracts';
import { isAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Deferrable } from '@ethersproject/properties';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';

const getWalletSigner = (privateKey: string, provider: JsonRpcProvider): Wallet => {
  const wallet = new Wallet(privateKey);
  return wallet.connect(provider);
};

const getContractSigner = (address: string, ABI: any, provider: JsonRpcProvider, privateKey: string): Contract => {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const walletSigner = getWalletSigner(privateKey, provider);
  return new Contract(address, ABI, walletSigner);
};

const getTransactionCount = (address: string, provider: JsonRpcProvider): Promise<number> => {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  const nonce = provider.getTransactionCount(address, 'pending');
  return nonce;
};

const estimateGas = (transaction: Deferrable<TransactionRequest>, provider: JsonRpcProvider): Promise<BigNumber> => {
  return provider.estimateGas(transaction);
};

const getGasPrice = async (provider: JsonRpcProvider): Promise<string> => {
  const gasPrice = await provider.getGasPrice();
  return gasPrice.toString();
};

export { getWalletSigner, getContractSigner, getTransactionCount, estimateGas, getGasPrice };
