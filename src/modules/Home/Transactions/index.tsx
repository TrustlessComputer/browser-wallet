import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { ITCTxDetail } from '@/interfaces/transaction';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { formatLongAddress } from '@/utils';
import { formatUnixDateTime } from '@/utils/time';
import { debounce } from 'lodash';
import React, { useContext, useState } from 'react';
import { StyledTransaction } from './Transactions.styled';
import useBitcoin from '@/hooks/useBitcoin';
import network from '@/lib/network.helpers';
import { TransactorContext } from '@/contexts/transactor.context';
import CopyIcon from '@/components/icons/Copy';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { Row } from '@/components/Row';

const TABLE_HEADINGS = ['Event', 'Transaction ID', 'From', 'To', 'Time', 'Status'];

export enum TransactionStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Confirmed = 'Confirmed',
  Failed = 'Failed',
  Success = 'Success',
}

const Transactions = React.memo(() => {
  const user = useCurrentUserInfo();
  const [transactions, setTransactions] = useState<ITCTxDetail[]>([]);
  const { onOpenResumeModal } = useContext(TransactorContext);
  const { getUnInscribedTransactionDetails } = useBitcoin();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isProcessing] = useState(false);

  const numbPending = React.useMemo(() => {
    return transactions.filter(item => item.statusCode === 0).length;
  }, [transactions]);

  const getTransactions = async () => {
    try {
      if (!user) return;
      setIsLoading(true);
      const uninscribedTransactions = await getUnInscribedTransactionDetails(user.address);
      setTransactions(uninscribedTransactions);
    } catch (e) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetTransactions = React.useCallback(debounce(getTransactions, 300), [user?.address]);

  const transactionsData = transactions?.map(trans => {
    const method = trans.method ? trans.method.charAt(0).toUpperCase() + trans.method.slice(1) : '-';
    const linkToMempool = `https://mempool.space/tx/${trans?.btcHash || ''}`;
    const statusCode = trans.statusCode;

    let status = TransactionStatus.Processing;
    switch (statusCode) {
      case 0:
        status = TransactionStatus.Pending;
        break;
      case 1:
        status = TransactionStatus.Processing;
        break;
      case 2:
        status = TransactionStatus.Confirmed;
        break;
    }
    let statusComp = undefined;
    if (trans.btcHash !== undefined) {
      const mesg = statusCode === 2 ? TransactionStatus.Success : 'Waiting in the mempool';
      statusComp = (
        <a
          className={`status ${status.toLowerCase()}`}
          target="_blank"
          href={
            statusCode === 2
              ? `${network.current.Explorer}/tx/${trans.Hash}`
              : `https://mempool.space/tx/${trans.btcHash}`
          }
        >
          {mesg}
        </a>
      );
    }

    const localDateString = trans?.time
      ? formatUnixDateTime({
          dateTime: Number(trans.time) / 1000,
        })
      : '-';

    return {
      id: trans.Hash,
      render: {
        type: (
          <Text size="body-large" fontWeight="medium" color="text-primary">
            {method}
          </Text>
        ),
        tx_id: (
          <div className="id-wrapper">
            <div className="tx-wrapper">
              <div className={`tx-id`}>{formatLongAddress(trans.Hash)}</div>
              <div className="icCopy">
                <CopyIcon className="ic-copy" icon={'ic-copy-alt-dark.svg'} maxWidth="44px" content={trans.Hash} />
              </div>
            </div>
            <Text color="text-secondary">
              BTC:{' '}
              {trans.btcHash ? (
                <a className="tx-link" target="_blank" href={linkToMempool}>
                  {formatLongAddress(trans?.btcHash)}
                </a>
              ) : (
                '--'
              )}
            </Text>
          </div>
        ),
        fromAddress: (
          <Row align="center" gap="12px">
            <Jazzicon diameter={40} seed={jsNumberForAddress(trans.From)} />
            <Text color="text-primary">{formatLongAddress(trans.From) || '-'}</Text>
          </Row>
        ),
        toAddress: (
          <Row align="center" gap="12px">
            <Jazzicon diameter={40} seed={jsNumberForAddress(trans.To)} />
            <Text color="text-primary">{formatLongAddress(trans.To) || '-'}</Text>
          </Row>
        ),
        time: (
          <>
            {localDateString}
            <Text>Nonce: {trans.Nonce}</Text>
          </>
        ),
        status: (
          <div className="status-container">
            {statusCode === 0 ? (
              <Button className="resume-btn" type="button" onClick={onOpenResumeModal} disabled={isProcessing}>
                Process
              </Button>
            ) : (
              <div className={`status ${status.toLowerCase()}`}>{statusComp ? statusComp : status}</div>
            )}
          </div>
        ),
      },
    };
  });

  React.useEffect(() => {
    debounceGetTransactions();
    let interval = setInterval(() => {
      debounceGetTransactions();
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, [user?.address]);

  return (
    <StyledTransaction>
      {!!numbPending && (
        <div className="header-wrapper">
          <Text size="h5">{`You have ${numbPending} incomplete ${
            numbPending === 1 ? 'transaction' : 'transactions'
          }`}</Text>
          <Button disabled={isProcessing} className="process-btn" type="button" onClick={onOpenResumeModal}>
            {isProcessing ? 'Processing...' : 'Process them now'}
          </Button>
        </div>
      )}
      {isLoading && <Spinner />}
      <Table tableHead={TABLE_HEADINGS} data={transactionsData} className={'transaction-table'} />
    </StyledTransaction>
  );
});

export default Transactions;
