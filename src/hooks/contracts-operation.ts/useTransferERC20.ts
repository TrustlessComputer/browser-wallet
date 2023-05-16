import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import { getContractSigner } from '@/utils/contract.signer';
import ERC20ABIJson from '@/abis/erc20.json';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import convert from '@/utils/convert';
import BigNumber from 'bignumber.js';
import { TRANSFER_TX_SIZE } from '@/configs';
import useBitcoin from '@/hooks/useBitcoin';

export interface ITransferERC20 {
  amount: string;
  receiver: string;
  tokenAddress: string;
  nonce?: number;
  gas?: string;
  decimals: number;
}

const useTransferERC20: ContractOperationHook<ITransferERC20, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();
  const { getInscribeableNonce } = useBitcoin();

  const estimateGas = useCallback(
    async (params: ITransferERC20) => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const transferAmount = convert.toOriginalAmount({ humanAmount: params.amount, decimals: params.decimals });
      const contract = getContractSigner(params.tokenAddress, ERC20ABIJson.abi, provider, userSecretKey.privateKey);
      const gasLimit = await contract.estimateGas.transfer(params.receiver, new BigNumber(transferAmount).toFixed());
      return gasLimit.toNumber();
    },
    [userSecretKey, provider],
  );

  const call = useCallback(
    async (params: ITransferERC20): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }
      const privateKey = userSecretKey.privateKey;
      const { amount, tokenAddress, receiver, decimals } = params;
      const nonce = await getInscribeableNonce(userSecretKey.address);
      const transferAmount = convert.toOriginalAmount({ humanAmount: amount, decimals: decimals });
      const contract = getContractSigner(tokenAddress, ERC20ABIJson.abi, provider, privateKey);
      const tx: TransactionResponse = await contract.transfer(receiver, new BigNumber(transferAmount).toFixed(), {
        nonce: nonce,
      });
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

export default useTransferERC20;
