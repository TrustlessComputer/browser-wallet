import React, { useContext } from 'react';
import SignerModal from '@/components/SignerModal';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { getErrorMessage } from '@/utils/error';
import useBitcoin from '@/hooks/useBitcoin';
import toast from 'react-hot-toast';
import { FeeRate } from '@/components/FeeRate';
import { Container } from '@/components/Transactor/styled';
import Button from '@/components/Button';
import { TransactionContext } from '@/contexts/transaction.context';
import historyStorage from '@/modules/Home/Transactions/storage';
import { ISpeedUpTx } from '@/interfaces/transaction';
import { ellipsisCenter } from '@/utils';
import Text from '@/components/Text';
import network from '@/lib/network.helpers';
import { Row } from '@/components/Row';

interface IProps {
  show: boolean;
  onClose: () => void;
  speedUpTx: ISpeedUpTx | undefined;
}

const SpeedUpModal = React.memo(({ show, onClose, speedUpTx }: IProps) => {
  const user = useCurrentUserInfo();

  const {
    feeRate,
    onChangeFee,
    onChangeCustomFee,
    currentRateType,
    currentRate,
    customRate,
    isLoading: isLoadingRate,
    onFetchFee,
    error,
  } = useFeeRate({ minFeeRate: speedUpTx?.minRate });

  const { getTransactions } = useContext(TransactionContext);
  const { createSpeedUpBTCTx } = useBitcoin();

  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async () => {
    try {
      if (!speedUpTx || !user) {
        throw new Error('BTC Hash empty.');
      }
      setSubmitting(true);
      const newBTCHash = await createSpeedUpBTCTx({
        feeRate: currentRate,
        btcAddress: user?.btcAddress,
        btcHash: speedUpTx.btcHash,
        tcAddress: user.address,
      });
      historyStorage.updateSpeedUpBTCHash(newBTCHash, speedUpTx.btcHash, user.address);
      onClose();
      toast.success('Speedup transactions successfully.');
      setTimeout(() => {
        getTransactions();
      }, 2000);
    } catch (error) {
      const { message } = getErrorMessage(error, 'submitResume');
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (show) {
      onFetchFee();
    }
  }, [show, user?.address]);

  return (
    <SignerModal show={show} onClose={onClose} title="Process Incomplete Transactions">
      <Container>
        {!!speedUpTx && (
          <div className="mt-32 mb-32">
            <Row justify="space-between">
              <Text size="h6">BTC</Text>
              <Text size="h6">
                <a href={`${network.current.BTCExplorer}/tx/${speedUpTx.btcHash}`} target="_blank">
                  {ellipsisCenter({ str: speedUpTx.btcHash, limit: 6 })}
                </a>
              </Text>
            </Row>
            <Row justify="space-between" className="mt-16">
              <Text size="h6">TC</Text>
              {speedUpTx.tcTxs.map(item => {
                return (
                  <Text size="h6">
                    <a href={`${network.current.Explorer}/tx/${speedUpTx.btcHash}`} target="_blank">
                      {ellipsisCenter({ str: item.tcHash, limit: 6 })}
                    </a>
                  </Text>
                );
              })}
            </Row>
            <Row justify="space-between" className="mt-16">
              <Text size="h6">Current sats:</Text>
              <Text size="h6">{speedUpTx.currentRate}</Text>
            </Row>
            <Row justify="space-between" className="mt-16">
              <Text size="h6">Min sats:</Text>
              <Text size="h6">{speedUpTx.minRate + 1}</Text>
            </Row>
          </div>
        )}
        <FeeRate
          allRate={feeRate}
          isCustom={true}
          onChangeFee={onChangeFee}
          onChangeCustomFee={onChangeCustomFee}
          currentRateType={currentRateType}
          currentRate={currentRate}
          customRate={customRate}
          isLoading={isLoadingRate}
          error={error}
          minRate={speedUpTx?.minRate}
        />
        <Button
          sizes="stretch"
          className="mt-32"
          onClick={onSubmit}
          disabled={submitting || isLoadingRate}
          isLoading={submitting || isLoadingRate}
        >
          Sure
        </Button>
      </Container>
    </SignerModal>
  );
});

export default SpeedUpModal;
