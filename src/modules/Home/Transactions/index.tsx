import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { capitalizeFirstLetter, formatLongAddress } from '@/utils';
import { formatUnixDateTime } from '@/utils/time';
import React, { useContext } from 'react';
import { HashWrapper, StyledTransaction } from './styled';
import network from '@/lib/network.helpers';
import { TransactorContext } from '@/contexts/transactor.context';
import CopyIcon from '@/components/icons/Copy';
import { IStatusCode, StatusMesg } from '@/interfaces/history';
import { TransactionContext } from '@/contexts/transaction.context';
import { Row } from '@/components/Row';
import SpeedUpModal from '@/components/Transactor/SpeedUp.modal';
import { ISpeedUpTx } from '@/interfaces/transaction';
import { EMPTY_LINK } from '@/modules/Home/constant';

const TABLE_HEADINGS = ['Event', 'Transaction ID', 'To', 'Time', 'Status'];

const Transactions = React.memo(() => {
  const { onOpenResumeModal } = useContext(TransactorContext);
  const { history, isLoading, uninscribed } = useContext(TransactionContext);
  const [speedUpTx, setSpeedUpTx] = React.useState<ISpeedUpTx | undefined>(undefined);

  const numbPending = React.useMemo(() => {
    return uninscribed.length;
  }, [uninscribed]);

  const handleSpeedUp = (btcHash: string) => {
    const tcTxs = history.filter(trans => trans.btcHash && trans.btcHash.toLowerCase() === btcHash.toLowerCase());
    const tx = tcTxs.find(tx => !!tx.currentSat);
    setSpeedUpTx({
      btcHash,
      tcTxs,
      currentRate: tx?.currentSat || 0,
      minRate: tx?.minSat || 0,
    });
  };

  const transactionsData = (history || []).map(trans => {
    const localDateString = trans?.time
      ? formatUnixDateTime({
          dateTime: Number(trans.time) / 1000,
        })
      : '-';
    let status = StatusMesg.PROCESSING;
    switch (trans.status) {
      case IStatusCode.FAILED:
        status = StatusMesg.FAILED;
        break;
      case IStatusCode.PENDING:
        status = StatusMesg.PENDING;
        break;
      case IStatusCode.SUCCESS:
        status = StatusMesg.SUCCESS;
        break;
      case IStatusCode.PROCESSING:
        status = trans.btcHash ? StatusMesg.WAITING : StatusMesg.PROCESSING;
        break;
    }
    const transactionType = capitalizeFirstLetter(trans.type || '-');
    const btcExplorer = `${network.current.BTCExplorer}/tx/${trans.btcHash}`;
    return {
      id: trans.tcHash,
      render: {
        type: (
          <Text size="h6" fontWeight="medium" color="text-primary">
            {transactionType}
          </Text>
        ),
        tx_id: (
          <HashWrapper>
            <div className="row">
              <span className="title">TC:</span>
              <a className="tx-id" href={`${network.current.Explorer}/tx/${trans.tcHash}`} target="_blank">
                {formatLongAddress(trans.tcHash)}
              </a>
              <div className="ic-copy">
                <CopyIcon className="ic-copy" icon="ic-copy-alt-dark.svg" maxWidth="44px" content={trans.tcHash} />
              </div>
            </div>
            <div className="row mt-8">
              <span className="title">BTC:</span>
              <a className="tx-id" target="_blank" href={`${btcExplorer}`}>
                {formatLongAddress(trans.btcHash) || '--'}
              </a>
              {!!trans.btcHash && (
                <div className="ic-copy">
                  <CopyIcon className="ic-copy" icon="ic-copy-alt-dark.svg" maxWidth="44px" content={trans.btcHash} />
                </div>
              )}
            </div>
          </HashWrapper>
        ),
        receiver: (
          <div>
            {trans.to ? (
              <Row align="center" gap="12px">
                <Text size="body-large">
                  <a href={`${network.current.Explorer}/address/${trans.to}`} target="_blank">
                    {formatLongAddress(trans.to)}
                  </a>
                </Text>
              </Row>
            ) : (
              '-'
            )}
          </div>
        ),
        time: (
          <div>
            <Text size="body-large">{localDateString}</Text>
            <Text size="body-large" className="mt-8">
              Nonce: {trans.nonce}
            </Text>
          </div>
        ),
        status: (
          <div className="status-wrapper">
            <Text
              size="h6"
              className={status.toLowerCase().split(' ')[0]}
              onClick={() => {
                if (status === StatusMesg.WAITING) {
                  window.open(btcExplorer, '_blank');
                }
              }}
            >
              {status}
            </Text>
            {!!trans.isRBFable && !!trans.btcHash && (
              <Button
                variants="outline"
                onClick={() => {
                  handleSpeedUp(trans.btcHash || '');
                }}
              >
                Speed up
              </Button>
            )}
          </div>
        ),
      },
    };
  });

  return (
    <StyledTransaction>
      {!!numbPending && (
        <div className="header-wrapper">
          <Text size="h5" color="text-highlight">{`You have ${numbPending} incomplete ${
            numbPending === 1 ? 'transaction' : 'transactions'
          }`}</Text>
          <Button className="process-btn" type="button" onClick={onOpenResumeModal}>
            Process them now
          </Button>
        </div>
      )}
      {isLoading && (
        <div className="spinner">
          <Spinner />
        </div>
      )}
      <Table
        tableHead={TABLE_HEADINGS}
        data={transactionsData}
        className="transaction-table"
        emptyLabel={EMPTY_LINK.TRANSACTIONS.label}
        emptyLink={EMPTY_LINK.TRANSACTIONS.link}
      />
      {!!speedUpTx && (
        <SpeedUpModal
          show={!!speedUpTx}
          onClose={() => {
            setSpeedUpTx(undefined);
          }}
          speedUpTx={speedUpTx}
        />
      )}
    </StyledTransaction>
  );
});

export default Transactions;
