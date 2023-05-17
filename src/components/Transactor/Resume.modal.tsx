import React from 'react';
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

  const { uninscribed, sizeByte, debounceGetTransactions, isLoaded } = useTransaction({ isGetUnInscribedSize: true });
  const { createBatchInscribeTxs } = useBitcoin();

  const [submitting, setSubmitting] = React.useState(false);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await createBatchInscribeTxs({
        tcTxDetails: uninscribed,
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

  React.useEffect(() => {
    if (show) {
      debounceGetTransactions();
      onFetchFee();
    }
  }, [show, user?.address]);

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
