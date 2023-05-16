import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import { getContractSigner } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { TRANSFER_TX_SIZE } from '@/configs';
import ERC721ABIJson from '@/abis/erc721.json';
import useBitcoin from '@/hooks/useBitcoin';

export interface ITransferERC721 {
  receiver: string;
  tokenID: string;
  tokenAddress: string;
}

const useTransferERC721: ContractOperationHook<ITransferERC721, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();
  const { getInscribeableNonce } = useBitcoin();

  const estimateGas = useCallback(
    async (params: ITransferERC721) => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const contract = getContractSigner(params.tokenAddress, ERC721ABIJson.abi, provider, userSecretKey.privateKey);
      const gasLimit = await contract.estimateGas.transferFrom(userSecretKey.address, params.receiver, params.tokenID);
      return gasLimit.toNumber();
    },
    [userSecretKey, provider],
  );

  const call = useCallback(
    async (params: ITransferERC721): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const privateKey = userSecretKey.privateKey;
      const { tokenAddress, receiver, tokenID } = params;
      const nonce = await getInscribeableNonce(userSecretKey.address);
      const contract = getContractSigner(tokenAddress, ERC721ABIJson.abi, provider, privateKey);
      const tx: TransactionResponse = await contract.transferFrom(userSecretKey.address, receiver, tokenID, {
        nonce,
      });
      return tx;
    },
    [userSecretKey, provider],
  );

  return {
    call: call,
    estimateGas,
    transactionType: TransactionType.ERC721,
    eventType: EventType.TRANSFER,
    txSize: TRANSFER_TX_SIZE,
  };
};

export default useTransferERC721;
