import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import { getTransactionCount, getWalletSigner } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';
import { TRANSFER_TX_SIZE } from '@/configs';

export interface ITransferNativeToken {
  amount: string;
  receiver: string;
}

const useTransferNativeToken: ContractOperationHook<ITransferNativeToken, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();

  const estimateGas = useCallback(
    async (params: ITransferNativeToken) => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);
      const gasLimit = await walletSigner.estimateGas({
        from: userSecretKey.address,
        value: ethers.utils.parseEther(String(params.amount)),
        to: params.receiver,
      });
      return gasLimit.toNumber();
    },
    [userSecretKey, provider],
  );

  const call = useCallback(
    async (params: ITransferNativeToken): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const nonce = await getTransactionCount(userSecretKey.address, provider);
      const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);
      const tx: TransactionResponse = await walletSigner.sendTransaction({
        from: userSecretKey.address,
        value: ethers.utils.parseEther(String(params.amount)),
        to: params.receiver,
        nonce,
      });
      return tx;
    },
    [userSecretKey, provider],
  );

  return {
    call: call,
    estimateGas,
    transactionType: TransactionType.TC,
    eventType: EventType.TRANSFER,
    txSize: TRANSFER_TX_SIZE,
  };
};

export default useTransferNativeToken;
