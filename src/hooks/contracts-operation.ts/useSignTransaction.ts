import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse, TransactionRequest } from '@ethersproject/abstract-provider';
import WError, { ERROR_CODE } from '@/utils/error';
import { getWalletSigner } from '@/utils/contract.signer';

export interface ISignTransaction {
  encodedData: string;
  receiver: string;
}

const useSignTransaction: ContractOperationHook<ISignTransaction, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();

  const estimateGas = useCallback(
    async (params: ISignTransaction) => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      let payload: TransactionRequest = {
        data: params.encodedData,
        from: userSecretKey.address,
      };
      if (params.receiver) {
        payload = {
          ...payload,
          to: params.receiver,
        };
      }
      const gasLimit = await provider.estimateGas(payload);
      return gasLimit.toNumber();
    },
    [userSecretKey, provider],
  );

  const call = useCallback(
    async (params: ISignTransaction): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);
      const tx: TransactionResponse = await walletSigner.sendTransaction({
        from: userSecretKey.address,
        to: params.receiver,
      });
      return tx;
    },
    [userSecretKey, provider],
  );

  return {
    call: call,
    estimateGas,
    transactionType: TransactionType.NONE,
    eventType: EventType.NONE,
  };
};

export default useSignTransaction;
