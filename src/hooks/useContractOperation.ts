import { ContractOperationHook } from '@/interfaces/contract-operation';
import useBitcoin from '@/hooks/useBitcoin';
import { TC_SDK } from '@/lib';
import { useUserSecretKey } from '@/state/wallet/hooks';
import WError, { ERROR_CODE } from '@/utils/error';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
  feeRate?: number;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(args: IParams<P, R>): IContractOperationReturn<P, R> => {
  const { inscribeable, operation, feeRate } = args;
  const userSecretKey = useUserSecretKey();
  const { createInscribeTx, getUnInscribedTransactions } = useBitcoin();
  const { call } = operation();
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

  return {
    run,
  };
};

export default useContractOperation;
