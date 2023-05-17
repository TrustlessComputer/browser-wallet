import React, { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { getFeeRate } from '@/services/bitcoin';
import { FeeRateName, IFeeRate } from '@/interfaces/api/bitcoin';
import { isNumeric } from '@/utils';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';

interface IProps {
  minFeeRate: number | undefined;
}

const useFeeRate = ({ minFeeRate }: IProps) => {
  const userInfo = useCurrentUserInfo();
  const [selectedRate, setRate] = useState<FeeRateName>(FeeRateName.fastestFee);
  const [customRate, setCustomRate] = useState<string>('');

  const [loading, setLoading] = React.useState(false);
  const [feeRate, setFeeRate] = useState<IFeeRate>({
    fastestFee: 70,
    halfHourFee: 55,
    hourFee: 50,
  });

  const onFetchFee = async () => {
    try {
      setLoading(true);
      const rate = await getFeeRate();
      setFeeRate(rate);
      setLoading(false);
    } catch (error) {
      const { message } = getErrorMessage(error, 'estimateRate');
      toast.error(message);
    }
  };

  const onChangeFee = (fee: FeeRateName): void => {
    setRate(fee);
    setCustomRate('');
  };

  const onChangeCustomFee = (rate: string): void => {
    setCustomRate(rate);
  };

  useAsyncEffect(onFetchFee, [userInfo?.address]);

  const currentRate = React.useMemo(() => {
    return customRate && isNumeric(customRate) ? Number(customRate) : feeRate[selectedRate];
  }, [customRate, selectedRate, feeRate]);

  const error = React.useMemo(() => {
    if (!minFeeRate || (minFeeRate && Number(currentRate || 0) > minFeeRate)) return '';
    return `Sats must be greater than ${minFeeRate}.`;
  }, [minFeeRate, currentRate]);

  return {
    isLoading: loading,
    feeRate,
    currentRate,
    customRate,
    currentRateType: customRate ? undefined : selectedRate,
    error,

    onChangeFee,
    onChangeCustomFee,
    onFetchFee,
  };
};

export default useFeeRate;
