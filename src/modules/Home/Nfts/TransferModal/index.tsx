import BaseModal from '@/components/BaseModal';
import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { IInscription } from '@/interfaces/api/inscription';
import { Formik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Container, ImageContainer, TransferContainer, Title, BackHeader } from './TransferModal.styled';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { ArrowLeftIcon } from '@/components/icons';

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

  const tokenId = artifact.tokenId;

  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.toAddress) {
      errors.toAddress = 'Receiver wallet address is required.';
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!tokenId || !contractAddress) {
      toast.error('Token information not found');
      setIsProcessing(false);
      return;
    }

    // const { toAddress } = values;
    try {
      setIsProcessing(true);
      // await run({
      //   tokenId: tokenId,
      //   to: toAddress,
      //   contractAddress: contractAddress,
      // });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <BaseModal show={show} handleClose={handleClose} width={1000}>
      <div>
        <BackHeader onClick={onClickBack}>
          <ArrowLeftIcon />
          <p>Back to collection</p>
        </BackHeader>
        <Container>
          <ImageContainer md="6">
            <NFTDisplayBox
              collectionID={contractAddress}
              contentClass="image"
              src={artifact.image}
              tokenID={artifact.tokenId}
              type={artifact.contentType}
            />
          </ImageContainer>
          <TransferContainer md="6">
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

                  <Button disabled={isProcessing} type="submit" className="confirm-btn">
                    {isProcessing ? 'Processing...' : 'Transfer'}
                  </Button>
                </form>
              )}
            </Formik>
          </TransferContainer>
        </Container>
      </div>
    </BaseModal>
  );
};

export default TransferModal;
