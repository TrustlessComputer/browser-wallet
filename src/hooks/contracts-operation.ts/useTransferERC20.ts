import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import { getContractSigner } from '@/utils/contract.signer';
import ERC20ABIJson from '@/abis/erc20.json';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import convert from '@/utils/convert';

export interface ITransferERC20 {
  amount: string;
  receiver: string;
  tokenAddress: string;
  nonce?: number;
  gas?: string;
  decimals?: number;
}

const useTransferERC20: ContractOperationHook<ITransferERC20, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();
  const call = useCallback(
    async (params: ITransferERC20): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const privateKey = userSecretKey.privateKey;
      const { amount, tokenAddress, receiver, decimals = 18 } = params;
      const transferAmount = convert.toOriginalAmount({ humanAmount: amount, decimals: decimals });
      const contract = getContractSigner(tokenAddress, ERC20ABIJson.abi, provider, privateKey);
      const tx: TransactionResponse = await contract.transfer(receiver, transferAmount.toString());
      return tx;
    },
    [userSecretKey?.privateKey, provider],
  );

  return {
    call: call,
    transactionType: TransactionType.ERC20,
    eventType: EventType.TRANSFER,
  };
};

export default useTransferERC20;
