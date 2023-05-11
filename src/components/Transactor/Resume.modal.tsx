import React from 'react';
import SignerModal from '@/components/SignerModal';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import useAsyncEffect from 'use-async-effect';
import { debounce } from 'lodash';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import useBitcoin from '@/hooks/useBitcoin';
import { ITCTxDetail } from '@/interfaces/transaction';
import Web3 from 'web3';
import toast from 'react-hot-toast';
import { FeeRate } from '@/components/FeeRate';
import { Container } from '@/components/Transactor/styled';
import Button from '@/components/Button';

interface IProps {
  show: boolean;
  onClose: () => void;
}

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

  const { getUnInscribedTransactionDetails, createBatchInscribeTxs, getTCTransactionByHash } = useBitcoin();

  const [isLoading, setIsLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [pendingTxs, setPendingTxs] = React.useState<ITCTxDetail[]>([]);
  const [sizeByte, setSizeByte] = React.useState<number | undefined>(undefined);

  const getPendingTxs = async () => {
    try {
      if (!user) {
        throw new WError(ERROR_CODE.EMPTY_USER);
      }
      setIsLoading(true);
      const pendingTxs = await getUnInscribedTransactionDetails(user.address);
      setPendingTxs(pendingTxs);
      const Hexs = await Promise.all(
        pendingTxs.map(({ Hash }) => {
          return getTCTransactionByHash(Hash);
        }),
      );
      const sizeByte: number = Hexs.reduce((prev, curr) => {
        const currSize = Web3.utils.hexToBytes(curr).length;
        return currSize + prev;
      }, 0);
      setSizeByte(sizeByte);
    } catch (error) {
      const { message } = getErrorMessage(error, 'resumeUnInscribe');
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceGetPendingTxs = React.useCallback(debounce(getPendingTxs, 200), [user?.address]);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await createBatchInscribeTxs({
        tcTxDetails: pendingTxs,
        feeRate: currentRate,
      });
      toast.success('Process transactions successfully.');
      onClose();
    } catch (error) {
      const { message } = getErrorMessage(error, 'submitResume');
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  useAsyncEffect(async () => {
    if (show) {
      debounceGetPendingTxs();
      onFetchFee();
    }
  }, [show]);

  return (
    <SignerModal show={show} onClose={onClose} title="Process Incomplete Transactions">
      <Container>
        <FeeRate
          allRate={feeRate}
          isCustom={true}
          onChangeFee={onChangeFee}
          onChangeCustomFee={onChangeCustomFee}
          currentRateType={currentRateType}
          currentRate={currentRate}
          customRate={customRate}
          isLoading={isLoadingRate || isLoading}
          options={{
            type: 'inscribe',
            sizeByte: sizeByte,
          }}
        />
        <Button
          sizes="stretch"
          className="mt-32"
          onClick={onSubmit}
          disabled={submitting || isLoadingRate || isLoading}
          isLoading={submitting || isLoadingRate || isLoading}
        >
          Sure
        </Button>
      </Container>
    </SignerModal>
  );
});

export default ResumeModal;
