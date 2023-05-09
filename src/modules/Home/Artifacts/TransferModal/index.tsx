import BaseModal from '@/components/BaseModal';
import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { IInscription } from '@/interfaces/api/inscription';
import { Formik } from 'formik';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Container, ImageContainer, TransferContainer, Title } from './TransferModal.styled';
import NFTDisplayBox from '@/components/NFTDisplayBox';

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
          <Title>{`Artifact #${artifact.tokenId}`}</Title>
          <p className="name-detail">Transfer Artifact</p>
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

                <Button disabled={isProcessing} type="submit" className="confirm-btn">
                  {isProcessing ? 'Processing...' : 'Transfer'}
                </Button>
              </form>
            )}
          </Formik>
        </TransferContainer>
      </Container>
    </BaseModal>
  );
};

export default TransferModal;
