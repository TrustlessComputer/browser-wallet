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
import useTransaction from '@/hooks/useTransaction';
import { ellipsisCenter } from '@/utils';
import Text from '@/components/Text';
import Table from '@/components/Table';
import network from '@/lib/network.helpers';
import { TransactionContext } from '@/contexts/transaction.context';
import historyStorage from '@/modules/Home/Transactions/storage';
import { IStatusCode } from '@/interfaces/history';

interface IProps {
  show: boolean;
  onClose: () => void;
}
const TABLE_HEADINGS = ['Hash', 'Event type'];

const ResumeModal = React.memo(({ show, onClose }: IProps) => {
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
  } = useFeeRate({ minFeeRate: undefined });

  const { getTransactions } = useContext(TransactionContext);

  const { uninscribed, sizeByte, debounceGetTransactions, isLoaded, transactions } = useTransaction({
    isGetUnInscribedSize: true,
  });

  const { createBatchInscribeTxs } = useBitcoin();

  const [submitting, setSubmitting] = React.useState(false);

  const pendingTransactions = React.useMemo(() => {
    return transactions.filter(trans =>
      uninscribed.some(uninscribe => uninscribe.Hash.toLowerCase() === trans.tcHash.toLowerCase()),
    );
  }, [uninscribed, transactions]);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const batchInscribeTxResp = await createBatchInscribeTxs({
        tcTxDetails: uninscribed,
        feeRate: currentRate,
      });

      for (const submited of batchInscribeTxResp) {
        historyStorage.updateBTCHash(user?.address || '', {
          tcHashs: submited.tcTxIDs,
          btcHash: submited.revealTxID,
          status: IStatusCode.PROCESSING,
        });
      }
      setTimeout(() => {
        getTransactions();
        onClose();
        toast.success('Process transactions successfully.');
      }, 2000);
    } catch (error) {
      const { message } = getErrorMessage(error, 'submitResume');
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };
  const tokenDatas =
    pendingTransactions.map(trans => {
      return {
        id: `transaction-${trans?.tcHash}}`,
        render: {
          hash: (
            <Text size="body-large">
              <a href={`${network.current.Explorer}/tx/${trans.tcHash}`} target="_blank">
                {ellipsisCenter({ str: trans.tcHash, limit: 5 })}
              </a>
            </Text>
          ),
          type: <Text size="body-large">{trans.type || '-'}</Text>,
        },
      };
    }) || [];

  React.useEffect(() => {
    if (show) {
      debounceGetTransactions();
      onFetchFee();
    }
  }, [show, user?.address]);

  return (
    <SignerModal show={show} onClose={onClose} title="Process Incomplete Transactions">
      <Container>
        <Table tableHead={TABLE_HEADINGS} data={tokenDatas} className="token-table" />
        <FeeRate
          allRate={feeRate}
          isCustom={true}
          onChangeFee={onChangeFee}
          onChangeCustomFee={onChangeCustomFee}
          currentRateType={currentRateType}
          currentRate={currentRate}
          customRate={customRate}
          isLoading={isLoadingRate || !isLoaded}
          options={{
            type: 'inscribe',
            sizeByte: sizeByte,
          }}
        />
        <Button
          sizes="stretch"
          className="mt-32"
          onClick={onSubmit}
          disabled={submitting || isLoadingRate || !isLoaded}
          isLoading={submitting || isLoadingRate || !isLoaded}
        >
          Sure
        </Button>
      </Container>
    </SignerModal>
  );
});

export default ResumeModal;
