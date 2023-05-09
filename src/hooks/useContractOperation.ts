import { ContractOperationHook } from '@/interfaces/contract-operation';

interface IParams<P, R> {
  operation: ContractOperationHook<P, R>;
  inscribeable?: boolean;
}

interface IContractOperationReturn<P, R> {
  run: (p: P) => Promise<R>;
}

const useContractOperation = <P, R>(args: IParams<P, R>): IContractOperationReturn<P, R> => {
  const { inscribeable, operation } = args;
  const { call } = operation();
  const run = async (params: P): Promise<R> => {
    if (!inscribeable) {
      const tx: R = await call({
        ...params,
      });
      return tx;
    }
    const tx: R = await call({
      ...params,
    });
    return tx;
  };

  return {
    run,
  };
};

export default useContractOperation;
