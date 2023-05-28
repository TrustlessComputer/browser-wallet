import SignerModal from '@/components/SignerModal';
import useAsyncEffect from 'use-async-effect';
import useBitcoin from '@/hooks/useBitcoin';
import React, { useContext } from 'react';
import { ITCTxByHash } from '@/interfaces/use-bitcoin';
import { Container } from '@/components/Transactor/styled';
import useGasFee from '@/components/GasFee/useGasFee';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/utils/error';
import GasFee from '@/components/GasFee';
import Button from '@/components/Button';
import { getWalletSigner } from '@/utils/contract.signer';
import { useUserSecretKey } from '@/state/wallet/hooks';
import useProvider from '@/hooks/useProvider';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { useAppDispatch } from '@/state/hooks';
import { setTransactionCanceled } from '@/state/transaction/reducer';
import historyStorage from '@/modules/Home/Transactions/storage';
import { TransactionContext } from '@/contexts/transaction.context';

type IProps = {
  tcHash: string;
  onClose: () => void;
};

const COEFFICIENT = 1.1;
const DEFAULT_GAS_PRICE = new BigNumber(1e10).multipliedBy(COEFFICIENT).toNumber();
const DEFAULT_GAS_LIMIT = new BigNumber(21000).multipliedBy(COEFFICIENT).toNumber();

const CancelTCModal = ({ onClose, tcHash }: IProps) => {
  const { getTCTransactionByHash } = useBitcoin();
  const dispatch = useAppDispatch();
  const [cancelTx, setCancelTx] = React.useState<ITCTxByHash | undefined>(undefined);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();
  const { getTransactions } = useContext(TransactionContext);

  const { maxFee, error, setEstimating, estimating, setError, setGasLimit, setGasPrice } = useGasFee({
    defaultGasPrice: DEFAULT_GAS_PRICE,
    defaultGasLimit: DEFAULT_GAS_LIMIT,
  });

  const onSave = async () => {
    if (!userSecretKey || !provider || !cancelTx) return;
    const signer = getWalletSigner(userSecretKey.privateKey, provider);
    try {
      setSubmitting(true);
      const newTx = await signer.sendTransaction({
        nonce: cancelTx.nonce,
        to: cancelTx.to,
        data: cancelTx.hex,
        gasLimit: Web3.utils.toHex(new BigNumber(maxFee.gasLimit || 0).toFixed()),
        gasPrice: Web3.utils.toHex(new BigNumber(maxFee.gasPrice || 0).toFixed()),
        value: cancelTx.value,
      });
      toast.success('Transaction cancel successfully.');
      onClose();
      dispatch(
        setTransactionCanceled({
          tcHashs: [newTx.hash, cancelTx.hash],
        }),
      );
      historyStorage.cancelTransaction(userSecretKey.address, newTx.hash, cancelTx.hash);
      setTimeout(() => {
        getTransactions();
      }, 3000);
    } catch (error) {
      const { message } = getErrorMessage(error, 'onSave');
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const getTransactionInfo = async () => {
    setEstimating(true);
    try {
      const tx = await getTCTransactionByHash(tcHash);
      setCancelTx(tx);
      setGasLimit(Math.ceil(tx.gas * COEFFICIENT));
      setGasPrice(Math.ceil(tx.gasPrice * COEFFICIENT));
    } catch (e) {
      const { message } = getErrorMessage(error, 'transactionHash');
      toast.error(message);
      setError(message);
    } finally {
      setEstimating(false);
    }
  };

  useAsyncEffect(getTransactionInfo, []);

  return (
    <SignerModal show={true} onClose={onClose} title="Cancel transaction" width={600}>
      <Container>
        <GasFee fee={maxFee.feeText} nonce={cancelTx?.nonce} error={error} />
        <Button
          sizes="stretch"
          className="mt-32"
          disabled={!cancelTx || !!error || estimating || submitting}
          onClick={onSave}
          isLoading={submitting}
        >
          Save
        </Button>
      </Container>
    </SignerModal>
  );
};

export default CancelTCModal;
