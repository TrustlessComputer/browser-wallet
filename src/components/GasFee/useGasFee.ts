import { getGasPrice } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import React, { useContext, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import BigNumber from 'bignumber.js';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { TC_SDK } from '@/lib';

interface IProps {
  defaultGasPrice?: string;
  sizeByte?: number;
  btcFeeRate?: number;
}

const useGasFee = (props: IProps = { defaultGasPrice: undefined, sizeByte: undefined, btcFeeRate: undefined }) => {
  const { defaultGasPrice, sizeByte, btcFeeRate } = props;
  const { tcBalance, btcBalance } = useContext(AssetsContext);
  const [gasLimit, setGasLimit] = React.useState<number | undefined>(undefined);
  const [error, setError] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [gasPrice, setGasPrice] = React.useState<number | undefined>(0);
  const [estimating, setEstimating] = useState(false);

  const provider = useProvider();

  const onGetGasPrice = async () => {
    try {
      setLoading(true);
      if (!provider) return;
      const gasPrice = defaultGasPrice ? Number(defaultGasPrice) : await getGasPrice(provider);
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

      gasLimit: new BigNumber(gasLimit || 0).toNumber(),
      gasLimitText: gasLimit ? `${format.number(gasLimit)}` : undefined,

      gasPrice: new BigNumber(gasPrice || 0).toNumber(),
      gasPriceText: gasPrice ? `${format.shorterAmount({ originalAmount: gasPrice, decimals: 9 })}` : undefined,
    };
  }, [gasLimit, gasPrice]);

  const customError = React.useMemo(() => {
    if (error) return error;
    if (!maxFee.feeOriginal.toNumber()) return '';
    if (maxFee.feeOriginal.gt(tcBalance)) {
      return `Your TC balance is insufficient. Please top up at least ${format.shorterAmount({
        decimals: Token.TRUSTLESS.decimal,
        originalAmount: maxFee.feeOriginal.toString(),
      })} TC to pay transaction fee.`;
    }
    if (sizeByte && btcFeeRate) {
      const btcFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: sizeByte,
        feeRatePerByte: btcFeeRate,
      });
      const balanceInBN = new BigNumber(btcBalance);
      if (balanceInBN.isLessThan(btcFee.totalFee)) {
        return `Your BTC balance is insufficient. Please top up at least ${format.shorterAmount({
          decimals: Token.BITCOIN.decimal,
          originalAmount: btcFee.totalFee.toString(),
        })} BTC to pay network fee.`;
      }
    }
    return '';
  }, [maxFee.feeOriginal, tcBalance, error, btcFeeRate, btcBalance, sizeByte]);

  return {
    loading,
    maxFee,
    setGasLimit,
    error: customError,
    setError,
    estimating,
    setEstimating,
  };
};

export default useGasFee;
