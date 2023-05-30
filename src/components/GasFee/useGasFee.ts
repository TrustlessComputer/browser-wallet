import { getGasPrice } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import React, { useContext, useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import BigNumber from 'bignumber.js';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { TC_SDK } from '@/lib';
import { compareString, ellipsisCenter } from '@/utils';
import { useCurrentUserInfo, useUserSecretKey } from '@/state/wallet/hooks';
import { useAppSelector } from '@/state/hooks';
import { listAccountsSelector } from '@/state/wallet/selector';

interface IProps {
  defaultGasPrice?: number;
  defaultGasLimit?: number;
  sizeByte?: number;
  btcFeeRate?: number;
  requestAddress?: string;
}

const useGasFee = (
  props: IProps = {
    defaultGasPrice: undefined,
    defaultGasLimit: undefined,
    sizeByte: undefined,
    btcFeeRate: undefined,
    requestAddress: undefined,
  },
) => {
  const { defaultGasPrice, sizeByte, btcFeeRate, defaultGasLimit, requestAddress } = props;
  const { tcBalance, btcBalance } = useContext(AssetsContext);
  const [gasPrice, setGasPrice] = React.useState<number | undefined>(0);
  const [gasLimit, setGasLimit] = React.useState<number | undefined>(defaultGasLimit);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = React.useState<string>('');
  const userInfo = useCurrentUserInfo();
  const userSecretKey = useUserSecretKey();
  const accounts = useAppSelector(listAccountsSelector);

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
    if (!!requestAddress && !compareString({ str1: requestAddress, str2: userInfo?.address, method: 'equal' })) {
      const account = accounts.find(account =>
        compareString({ str1: account.address, str2: requestAddress, method: 'equal' }),
      );
      if (account) {
        return `Please switch to ${account.name} (${ellipsisCenter({
          str: account.address,
        })}) to sign the transaction.`;
      } else {
        return `Could not find this address ${requestAddress}, please try disconnect and reconnect on your dapp.`;
      }
    }
    if (!compareString({ str1: userSecretKey?.address, str2: userInfo?.address, method: 'equal' })) {
      return `Syncing wallet error.`;
    }
    if (error) return error;
    if (!maxFee.feeOriginal.toNumber()) return '';
    if (maxFee.feeOriginal.gt(tcBalance)) {
      return `Your TC balance is insufficient. Please top up at least ${format.formatAmount({
        decimals: Token.TRUSTLESS.decimal,
        originalAmount: maxFee.feeOriginal.toNumber(),
        maxDigits: 6,
        isCeil: true,
      })} TC to pay transaction fee.`;
    }
    if (sizeByte && btcFeeRate) {
      const btcFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: sizeByte,
        feeRatePerByte: btcFeeRate,
      });
      const balanceInBN = new BigNumber(btcBalance);
      if (balanceInBN.isLessThan(btcFee.totalFee)) {
        return `Your BTC balance is insufficient. Please top up at least ${format.formatAmount({
          decimals: Token.BITCOIN.decimal,
          originalAmount: btcFee.totalFee.toNumber(),
          maxDigits: 6,
          isCeil: true,
        })} BTC to pay network fee.`;
      }
    }
    return '';
  }, [
    maxFee.feeOriginal,
    tcBalance,
    error,
    btcFeeRate,
    btcBalance,
    sizeByte,
    requestAddress,
    userInfo?.address,
    userSecretKey?.address,
  ]);

  useAsyncEffect(onGetGasPrice, [provider]);

  return {
    loading,
    maxFee,
    setGasLimit,
    setGasPrice,
    error: customError,
    setError,
    estimating,
    setEstimating,
  };
};

export default useGasFee;
