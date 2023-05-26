import React, { useContext } from 'react';
import { Container } from './styled';
import { Row } from '@/components/Row';
import Text from '@/components/Text';
import { AssetsContext } from '@/contexts/assets.context';
import format from '@/utils/amount';
import BigNumber from 'bignumber.js';
import Token from '@/constants/token';
import { upperFirst } from 'lodash';

interface IProps {
  fee: string;
  error: string;
}

const GasFee = React.memo((props: IProps) => {
  const { tcBalance, btcBalance } = useContext(AssetsContext);
  return (
    <Container>
      <Row justify="space-between" className="mb-12">
        <Text size="body">TC Balance</Text>
        <Text size="body">
          {format.formatAmount({
            originalAmount: new BigNumber(tcBalance).toNumber(),
            decimals: Token.TRUSTLESS.decimal,
            maxDigits: 7,
          })}{' '}
          TC
        </Text>
      </Row>
      <Row justify="space-between" className="mb-12">
        <Text size="body">
          Gas <span className="sub-text">(estimated)</span>
        </Text>
        <Text size="body">{props.fee} TC</Text>
      </Row>
      <Row justify="space-between">
        <Text size="body">BTC Balance</Text>
        <Text size="body">
          {format.formatAmount({
            originalAmount: new BigNumber(btcBalance).toNumber(),
            decimals: Token.BITCOIN.decimal,
            maxDigits: 7,
          })}{' '}
          BTC
        </Text>
      </Row>
      {!!props.error && (
        <Text className="error-text" size="note">
          {upperFirst(props.error)}
        </Text>
      )}
    </Container>
  );
});

export default GasFee;
