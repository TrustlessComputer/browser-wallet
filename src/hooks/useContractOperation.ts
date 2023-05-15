import { ContractOperationHook } from '@/interfaces/contract-operation';
import useBitcoin from '@/hooks/useBitcoin';
import { TC_SDK } from '@/lib';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';
import BigNumber from 'bignumber.js';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { useContext } from 'react';
import { AssetsContext } from '@/contexts/assets.context';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
  feeRate?: number;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
  estimateGas?: (p: P) => Promise<number>;
}

const useContractOperation = <P, R>(args: IParams<P, R>): IContractOperationReturn<P, R> => {
  const { inscribeable, operation, feeRate } = args;
  const userSecretKey = useUserSecretKey();
  const { btcBalance } = useContext(AssetsContext);
  const { createInscribeTx, getUnInscribedTransactions } = useBitcoin();
  const { call, estimateGas, txSize } = operation();
  const run = async (params: P): Promise<R> => {
    if (!inscribeable) {
      const tx: R = await call({
        ...params,
      });
      return tx;
    }

    if (!userSecretKey) {
      throw new WError(ERROR_CODE.EMPTY_USER);
    }

    new TC_SDK.Validator('contract-operation', feeRate).number().required();

    const [unInscribedTxIDs] = await Promise.all([await getUnInscribedTransactions(userSecretKey.address)]);

    if (unInscribedTxIDs.length > 0) {
      throw new WError(ERROR_CODE.HAVE_UN_INSCRIBE_TX);
    }

    if (!feeRate) {
      throw new WError(ERROR_CODE.FEE_RATE_INVALID);
    }

    if (!txSize) {
      throw new WError(ERROR_CODE.TX_SIZE);
    }

    const estimatedFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: txSize,
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

    const tx: R = await call({
      ...params,
    });

    const btcTx = await createInscribeTx({
      assets: undefined,
      feeRate: feeRate,
      tcTxIDs: [Object(tx).hash],
    });

    console.info('BTC transaction: ', btcTx);

    return tx;
  };

  const onEstimateGas = async (params: P): Promise<number> => {
    if (!estimateGas) {
      throw new Error('estimateGas is not define.');
    }
    const gasLimit: number = await estimateGas({
      ...params,
    });
    return new BigNumber(gasLimit).multipliedBy(1.05).toNumber();
  };

  return {
    run,
    estimateGas: onEstimateGas,
  };
};

export default useContractOperation;
