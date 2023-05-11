import { ContractOperationHook, TransactionType, EventType } from '@/interfaces/contract-operation';
import { useCallback, useContext } from 'react';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import { getContractSigner } from '@/utils/contract.signer';
import ERC20ABIJson from '@/abis/erc20.json';
import useProvider from '@/hooks/useProvider';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import convert from '@/utils/convert';
import { TC_SDK } from '@/lib';
import { AssetsContext } from '@/contexts/assets.context';
import BigNumber from 'bignumber.js';
import format from '@/utils/amount';
import Token from '@/constants/token';

export interface ITransferERC20 {
  amount: string;
  receiver: string;
  tokenAddress: string;
  nonce?: number;
  gas?: string;
  decimals?: number;
  feeRate: number;
}

const useTransferERC20: ContractOperationHook<ITransferERC20, TransactionResponse> = () => {
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();

  const { btcBalance } = useContext(AssetsContext);

  const call = useCallback(
    async (params: ITransferERC20): Promise<TransactionResponse> => {
      if (!userSecretKey?.privateKey || !provider) {
        throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
      }

      const privateKey = userSecretKey.privateKey;
      const { amount, tokenAddress, receiver, decimals = 18, feeRate } = params;

      const estimatedFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: 1000,
        feeRatePerByte: feeRate,
      });

      const balanceInBN = new BigNumber(btcBalance);
      if (balanceInBN.isLessThan(estimatedFee.totalFee)) {
        throw Error(
          `Your balance is insufficient. Please top up at least ${format.shorterAmount({
            decimals: Token.BITCOIN.decimal,
            originalAmount: estimatedFee.totalFee.toString(),
          })} BTC to pay network fee.`,
        );
      }

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
