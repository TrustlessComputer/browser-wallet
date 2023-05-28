import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { capitalizeFirstLetter, compareString, formatLongAddress } from '@/utils';
import { formatUnixDateTime } from '@/utils/time';
import React, { useContext } from 'react';
import { HashWrapper, Status, StyledTransaction } from './styled';
import network from '@/lib/network.helpers';
import { TransactorContext } from '@/contexts/transactor.context';
import CopyIcon from '@/components/icons/Copy';
import { IStatusCode, StatusMesg } from '@/interfaces/history';
import { TransactionContext } from '@/contexts/transaction.context';
import { Row } from '@/components/Row';
import SpeedUpModal from '@/components/Transactor/SpeedUp.modal';
import { ISpeedUpTx } from '@/interfaces/transaction';
import { EMPTY_LINK } from '@/modules/Home/constant';
import CancelTCModal from '@/components/Transactor/CancelTC.modal';
import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { useAppSelector } from '@/state/hooks';
import { getTransactionCanceled } from '@/state/transaction/selector';

const TABLE_HEADINGS = ['Event', 'Transaction ID', 'To', 'Time', 'Status'];

const Transactions = React.memo(() => {
  const { onOpenResumeModal } = useContext(TransactorContext);
  const { history, isLoading, uninscribed } = useContext(TransactionContext);
  const [speedUpTx, setSpeedUpTx] = React.useState<ISpeedUpTx | undefined>(undefined);
  const [cancelTx, setCancelTx] = React.useState<string | undefined>(undefined);
  const transactionCanceled = useAppSelector(getTransactionCanceled);

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

    const isCanceled = transactionCanceled[trans.tcHash.toLowerCase()];

    let status = StatusMesg.PROCESSING;
    switch (trans.status) {
      case IStatusCode.FAILED:
        status = isCanceled ? StatusMesg.CANCELED : StatusMesg.FAILED;
        break;
      case IStatusCode.PENDING:
        status = isCanceled ? StatusMesg.CANCELING : StatusMesg.PENDING;
        break;
      case IStatusCode.SUCCESS:
        status = isCanceled ? StatusMesg.CANCELED : StatusMesg.SUCCESS;
        break;
      case IStatusCode.PROCESSING:
        status = trans.btcHash ? StatusMesg.WAITING : StatusMesg.PROCESSING;
        break;
    }
    const transactionType = capitalizeFirstLetter(trans.type || '-');
    const btcExplorer = `${network.current.BTCExplorer}/tx/${trans.btcHash}`;
    const isCancelable =
      uninscribed.some(item => compareString({ str1: item.Hash, str2: trans.tcHash, method: 'equal' })) &&
      storageLocal.get(LocalStorageKey.ADVANCE_USER);

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
          <Status>
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
          </Status>
        ),
        action: (
          <div className="actions">
            {!!trans.isRBFable && !!trans.btcHash && (
              <Button
                onClick={() => {
                  handleSpeedUp(trans.btcHash || '');
                }}
              >
                Speed up
              </Button>
            )}
            {isCancelable && !isCanceled && (
              <Button
                variants="outline"
                onClick={() => {
                  setCancelTx(trans.tcHash || '');
                }}
              >
                Cancel
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
      {!!cancelTx && (
        <CancelTCModal
          tcHash={cancelTx}
          onClose={() => {
            setCancelTx(undefined);
          }}
        />
      )}
    </StyledTransaction>
  );
});

export default Transactions;
