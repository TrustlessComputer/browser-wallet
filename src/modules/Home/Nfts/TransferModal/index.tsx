import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { IInscription } from '@/interfaces/api/inscription';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Container, ImageContainer, TransferContainer, Title, BackHeader } from './TransferModal.styled';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { ArrowLeftIcon } from '@/components/icons';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { FeeRate } from '@/components/FeeRate';
import useContractOperation from '@/hooks/useContractOperation';
import useTransferERC721, { ITransferERC721 } from '@/hooks/contracts-operation.ts/useTransferERC721';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { debounce } from 'lodash';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import useGasFee from '@/components/GasFee/useGasFee';
import GasFee from '@/components/GasFee';
import SignerModal from '@/components/SignerModal';

type Props = {
  show: boolean;
  handleClose: () => void;
  contractAddress?: string;
  artifact: IInscription;
  onClickBack: () => void;
};

interface IFormValue {
  toAddress: string;
}

const TransferModal = (props: Props) => {
  const { show = false, handleClose, contractAddress, artifact, onClickBack } = props;
  const userSecretKey = useUserSecretKey();

  const tokenId = artifact.tokenId;

  const [isProcessing, setIsProcessing] = useState(false);

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
  const { maxFee, setGasLimit, error, setError, setEstimating, estimating, loading } = useGasFee();

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

  const debounceEstimateGas = React.useCallback(debounce(onEstimateGas, 300), [userSecretKey]);

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
      const { desc } = getErrorMessage(error, 'submitNFT');
      toast.error(desc);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SignerModal title="" show={show} onClose={handleClose} width={1000}>
      <div>
        <BackHeader onClick={onClickBack}>
          <ArrowLeftIcon />
          <p>Back to collection</p>
        </BackHeader>
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
            <Title>{`${artifact.name || ''}${artifact.name.includes('#') ? '' : `#${artifact.tokenId}`}`}</Title>
            <p className="name-detail">Transfer NFT</p>
            <Formik
              key="create"
              initialValues={{
                toAddress: '',
                amount: '',
              }}
              validate={validateForm}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form className="form" onSubmit={handleSubmit}>
                  <Input
                    title="TRANSFER NFT TO"
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
                    isLoading={estimating || isProcessing || loading}
                    disabled={estimating || isProcessing || loading}
                    type="submit"
                    className="confirm-btn"
                  >
                    {isProcessing ? 'Processing...' : 'Transfer'}
                  </Button>
                </form>
              )}
            </Formik>
          </TransferContainer>
        </Container>
      </div>
    </SignerModal>
  );
};

export default TransferModal;
