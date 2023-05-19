import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import { getContractSigner, getTransactionCount } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { BNS_CONTRACT, TRANSFER_TX_SIZE } from '@/configs';
import BNSABIJson from '@/abis/bns.json';
import { stringToBuffer } from '@/utils';

export interface ITransferName {
  name: string;
  receiver: string;
}

const useTransferName: ContractOperationHook<ITransferName, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();

  const estimateGas = useCallback(
    async (params: ITransferName) => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const byteCode = stringToBuffer(params.name);
      const contract = getContractSigner(BNS_CONTRACT, BNSABIJson.abi, provider, userSecretKey.privateKey);
      // Map name to token ID
      const tokenID = await contract.registry(byteCode);
      const gasLimit = await contract.estimateGas.transferFrom(userSecretKey.address, params.receiver, tokenID);
      return gasLimit.toNumber();
    },
    [userSecretKey, provider],
  );

  const call = useCallback(
    async (params: ITransferName): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const privateKey = userSecretKey.privateKey;
      const { receiver } = params;
      const contract = getContractSigner(BNS_CONTRACT, BNSABIJson.abi, provider, privateKey);
      const byteCode = stringToBuffer(params.name);
      const nonce = await getTransactionCount(userSecretKey.address, provider);
      // Map name to token ID
      const tokenID = await contract.registry(byteCode);
      const tx: TransactionResponse = await contract.transferFrom(userSecretKey.address, receiver, tokenID, { nonce });
      return tx;
    },
    [userSecretKey, provider],
  );

  return {
    call: call,
    estimateGas,
    transactionType: TransactionType.ERC20,
    eventType: EventType.TRANSFER,
    txSize: TRANSFER_TX_SIZE,
  };
};

export default useTransferName;
