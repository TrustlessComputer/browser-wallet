import { ContractOperationHook } from '@/interfaces/contract-operation';
import { capitalizeFirstLetter } from '@/utils';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(args: IParams<P, R>): IContractOperationReturn<P, R> => {
  const { operation } = args;
  const { call } = operation();

  const run = async (params: P): Promise<R> => {
    try {
      const tx: R = await call({
        ...params,
      });
      console.log('tc transaction: ', tx);
      return tx;
    } catch (err) {
      if (Object(err).reason) {
        throw Error(capitalizeFirstLetter(Object(err).reason));
      }
      throw err;
    }
  };

  return {
    run,
  };
};

export default useContractOperation;
