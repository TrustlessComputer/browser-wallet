import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { IInscription } from '@/interfaces/api/inscription';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Container, ImageContainer, TransferContainer, Title } from './TransferModal.styled';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { FeeRate } from '@/components/FeeRate';
import { TC_ADDRESS_TEST } from '@/configs';
import SignerModal from '@/components/SignerModal';
import useGasFee from '@/components/GasFee/useGasFee';
import useContractOperation from '@/hooks/useContractOperation';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useTransferERC721, { ITransferERC721 } from '@/hooks/contracts-operation.ts/useTransferERC721';
import GasFee from '@/components/GasFee';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import { debounce } from 'lodash';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { validateEVMAddress } from '@/utils';

type Props = {
  show: boolean;
  handleClose: () => void;
  contractAddress?: string;
  artifact: IInscription;
};

interface IFormValue {
  toAddress: string;
}

const TransferModal = (props: Props) => {
  const { show = false, handleClose, contractAddress, artifact } = props;
  const tokenId = artifact.tokenId;
  const [isProcessing, setIsProcessing] = useState(false);
  const { maxFee, setGasLimit, error, setError, setEstimating, estimating, loading } = useGasFee();

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

  const userSecretKey = useUserSecretKey();

  const { run: onTransferERC721, estimateGas } = useContractOperation<ITransferERC721, TransactionResponse>({
    operation: useTransferERC721,
    inscribeable: true,
    feeRate: currentRate,
  });

  const onEstimateGas = async (payload: IFormValue) => {
    try {
      if (!estimateGas) {
        throw new WError(ERROR_CODE.INVALID_PARAMS);
      }

      if (!payload.toAddress) {
        setGasLimit(undefined);
        return;
      }
      setEstimating(true);
      const gasLimit = await estimateGas({
        receiver: payload.toAddress,
        tokenID: tokenId,
        tokenAddress: artifact.collectionAddress,
      });
      setGasLimit(gasLimit);
      setError('');
    } catch (error) {
      const { message } = getErrorMessage(error, 'estimateGas');
      setError(message);
    }
    setEstimating(false);
  };

  const debounceEstimateGas = React.useCallback(debounce(onEstimateGas, 300), [
    userSecretKey?.privateKey,
    userSecretKey?.address,
  ]);

  useEffect(() => {
    if (show) {
      onFetchFee();
    }
  }, [show]);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
    }

    if (!validateEVMAddress(values.toAddress)) {
      errors.toAddress = 'Invalid receiver address.';
    }

    if (!errors.toAddress) {
      debounceEstimateGas(values);
    }

    return errors;
  };

  const handleSubmit = async (payload: IFormValue): Promise<void> => {
    if (!tokenId || !contractAddress) {
      toast.error('Token information not found');
      setIsProcessing(false);
      return;
    }
    try {
      setIsProcessing(true);
      await onTransferERC721({
        receiver: payload.toAddress,
        tokenID: tokenId,
        tokenAddress: artifact.collectionAddress,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SignerModal show={show} onClose={handleClose} title="" width={1100}>
      <Container>
        <ImageContainer md="5">
          <NFTDisplayBox
            collectionID={contractAddress}
            contentClass="image"
            src={artifact.image}
            tokenID={artifact.tokenId}
            type={artifact.contentType}
          />
        </ImageContainer>
        <TransferContainer md="7">
          <Title>{`Artifact #${artifact.tokenId}`}</Title>
          <p className="name-detail">Transfer Artifact</p>
          <Formik
            key="create"
            initialValues={{
              toAddress: TC_ADDRESS_TEST || '',
              amount: '',
            }}
            validate={validateForm}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
              <form className="form" onSubmit={handleSubmit}>
                <Input
                  title="TRANSFER ARTIFACT TO"
                  id="toAddress"
                  type="text"
                  name="toAddress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.toAddress}
                  className="input"
                  placeholder={`Paste TC wallet address here`}
                  errorMsg={errors.toAddress && touched.toAddress ? errors.toAddress : undefined}
                />
                <GasFee fee={maxFee.feeText} error={error} />
                <FeeRate
                  allRate={feeRate}
                  isCustom={true}
                  onChangeFee={onChangeFee}
                  onChangeCustomFee={onChangeCustomFee}
                  currentRateType={currentRateType}
                  currentRate={currentRate}
                  customRate={customRate}
                  isLoading={isLoadingRate}
                />
                <Button
                  disabled={estimating || isProcessing || loading || !!error}
                  type="submit"
                  className="confirm-btn"
                  isLoading={estimating || isProcessing || loading}
                >
                  {isProcessing ? 'Processing...' : 'Transfer'}
                </Button>
              </form>
            )}
          </Formik>
        </TransferContainer>
      </Container>
    </SignerModal>
  );
};

export default TransferModal;
