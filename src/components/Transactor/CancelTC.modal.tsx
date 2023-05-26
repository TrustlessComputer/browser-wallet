import SignerModal from '@/components/SignerModal';
import useAsyncEffect from 'use-async-effect';
import useBitcoin from '@/hooks/useBitcoin';

type IProps = {
  tcHash: string;
  onClose: () => void;
};

const CancelTCModal = ({ onClose, tcHash }: IProps) => {
  const { getTCTransactionByHash } = useBitcoin();

  const getTransactionInfo = async () => {
    await getTCTransactionByHash(tcHash);
  };

  useAsyncEffect(getTransactionInfo, []);

  return (
    <SignerModal show={true} onClose={onClose} title="Cancel transaction">
      <div />
    </SignerModal>
  );
};

export default CancelTCModal;
