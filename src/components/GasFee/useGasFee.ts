import { getGasPrice } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import React, { useContext } from 'react';
import useAsyncEffect from 'use-async-effect';
import BigNumber from 'bignumber.js';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';

const useGasFee = () => {
  const { tcBalance } = useContext(AssetsContext);
  const [gasLimit, setGasLimit] = React.useState<number | undefined>(undefined);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [gasPrice, setGasPrice] = React.useState<number | undefined>(0);
  const provider = useProvider();

  const onGetGasPrice = async () => {
    try {
      setLoading(true);
      if (!provider) return;
      const gasPrice = await getGasPrice(provider);
      setGasPrice(Number(gasPrice));
      setLoading(false);
    } catch (e) {
      throw new Error('Get gas price error.');
    }
  };

  useAsyncEffect(onGetGasPrice, [provider]);

  const maxFee = React.useMemo(() => {
    const feeOriginal = new BigNumber(gasPrice || 0).multipliedBy(gasLimit || 0);
    const feeText = format.formatAmount({
      originalAmount: feeOriginal.toNumber(),
      decimals: Token.TRUSTLESS.decimal,
      isCeil: true,
      maxDigits: 6,
    });
    return {
      feeOriginal,
      feeText,
    };
  }, [gasLimit, gasPrice]);

  const customError = React.useMemo(() => {
    if (!maxFee.feeOriginal.toNumber()) return '';
    if (maxFee.feeOriginal.gt(tcBalance)) {
      return 'You do not have enough TC in your account to pay for transaction fees on Trustless Computer network.';
    }
    if (error) return error;
    return '';
  }, [maxFee.feeOriginal, tcBalance, error]);

  return {
    loading,
    gasPrice,
    gasLimit,
    maxFee,
    setGasLimit,
    error: customError,
    setError,
  };
};

export default useGasFee;
