import { Container, Content, ItemWrapper } from '@/components/FeeRate/styled';
import React, { useRef } from 'react';
import Text from '@/components/Text';
import { FeeRateName, IFeeRate } from '@/interfaces/api/bitcoin';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { formatBTCPrice } from '@/utils/format';

interface IProps {
  isLoading: boolean;
  isCustom: boolean;
  allRate: IFeeRate;
  currentRate: number;
  currentRateType: FeeRateName | undefined;
  customRate: string;
  minRate?: number;

  onChangeFee: (rate: FeeRateName) => void;
  onChangeCustomFee?: (rate: string) => void;
  error?: string;

  options?: {
    type: 'inscribe';
    sizeByte: number | undefined;
  };
}

const FeeRate = React.memo((props: IProps) => {
  const customRef = useRef<HTMLInputElement>(null);

  const onChangeFee = (rate: FeeRateName) => {
    props.onChangeFee(rate);
  };

  const onEditCustomFee = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof props.onChangeCustomFee === 'function') {
      props.onChangeCustomFee(event.target.value);
    }
  };

  const calcAmount = (feeRatePerByte: number | string) => {
    const options = props.options;
    if (options && options.type === 'inscribe' && options.sizeByte) {
      const estimatedFee = TC_SDK.estimateInscribeFee({
        feeRatePerByte: Number(feeRatePerByte),
        tcTxSizeByte: options.sizeByte,
      });
      return {
        amount: formatBTCPrice(estimatedFee.totalFee.integerValue(BigNumber.ROUND_CEIL).toNumber()),
        symbol: 'BTC',
      };
    }
    return {
      amount: undefined,
      symbol: 'BTC',
    };
  };

  const renderItem = (rateName: FeeRateName) => {
    let title = 'Economy';
    switch (rateName) {
      case FeeRateName.hourFee:
        title = 'Economy';
        break;
      case FeeRateName.halfHourFee:
        title = 'Faster';
        break;
      case FeeRateName.fastestFee:
        title = 'Fastest';
        break;
    }
    const isActive = rateName === props.currentRateType && props.currentRateType !== undefined;
    const { amount, symbol } = calcAmount(props.allRate[rateName]);
    return (
      <ItemWrapper onClick={() => onChangeFee(rateName)} isActive={isActive}>
        <Text size="body" align="center">
          {title}
        </Text>
        <Text size="note" color="text-secondary" className="vbyte">
          {`${props.allRate[rateName]}`} <br></br> sats/vByte
        </Text>
        {!!amount && <Text size="body" className="price">{`~${amount} ${symbol}`}</Text>}
      </ItemWrapper>
    );
  };

  const renderCustomRate = () => {
    const { amount, symbol } = calcAmount(props.customRate);
    return (
      <ItemWrapper
        lg="3"
        md="12"
        onClick={() => {
          if (props.onChangeCustomFee && !!customRef && !!customRef.current) {
            props.onChangeCustomFee(
              `${props.minRate ? props.minRate + 1 : Number(props.allRate[FeeRateName.fastestFee] + 5)}`,
            );
            customRef.current.focus();
          }
        }}
        isActive={props.isCustom && props.currentRateType === undefined}
      >
        <Text size="body" align="center">
          Customize Sats
        </Text>
        {/*{!!amount && <Text size="regular" className="vbyte">{`${props.customRate} sats/vByte`}</Text>}*/}
        <input
          ref={customRef}
          id="feeRate"
          type="number"
          name="feeRate"
          placeholder="0"
          value={props.customRate.toString()}
          onChange={onEditCustomFee}
          className="custom-input"
        />
        {!!amount && amount !== '-' && (
          <Text size="body" className="price-custom" color="text-primary">{`~${amount} ${symbol}`}</Text>
        )}
      </ItemWrapper>
    );
  };

  if (props.isLoading) {
    return <></>;
  }

  return (
    <Container>
      <Text
        style={{ textTransform: 'uppercase' }}
        size="tini"
        fontWeight="medium"
        color="text-secondary"
        className="mb-8"
      >
        Select the BTC network fee
      </Text>
      <Content>
        {renderItem(FeeRateName.hourFee)}
        {renderItem(FeeRateName.halfHourFee)}
        {renderItem(FeeRateName.fastestFee)}
        {renderCustomRate()}
      </Content>
      {!!props.error && (
        <Text color="text-error" size="body" className="mt-8">
          {props.error}
        </Text>
      )}
    </Container>
  );
});

export default FeeRate;
