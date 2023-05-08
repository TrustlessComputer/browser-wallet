import { Modal } from 'react-bootstrap';
import { StyledTransferModal, WrapInput } from './TransferModal.styled';
import IconSVG from '@/components/IconSVG';
import { Formik } from 'formik';
import Text from '@/components/Text';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/components/Button';
import { CDN_URL } from '@/configs';

type Props = {
  show: boolean;
  handleClose: () => void;
  name: string;
};

type IFormValue = {
  address: string;
};

const BNSTransferModal = (props: Props) => {
  const { show, handleClose } = props;
  const [isProcessing, setIsProcessing] = useState(false);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.name = 'TC address is required.';
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    // const { address } = values;
    try {
      setIsProcessing(true);
      // await run({
      //   to: address,
      //   name: name,
      // });
      toast.success('Transaction has been created. Please wait for few minutes.');
      handleClose();
    } catch (err) {
      toast.error((err as Error).message);
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledTransferModal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close.svg`}
          maxWidth="22px"
        />
      </Modal.Header>
      <Modal.Body>
        <h5 className="font-medium mb-24">Transfer Name</h5>
        <Formik
          key="transfer"
          initialValues={{
            address: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <label htmlFor="address" className="label">
                  TRANSFER NAME TO
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  className="input"
                  placeholder={`Paste TC wallet address here`}
                />
                {errors.address && touched.address && <p className="error">{errors.address}</p>}
              </WrapInput>
              <Button disabled={isProcessing} type="submit" className="transfer-btn">
                <Text fontWeight="medium" className="transfer-text">
                  {isProcessing ? 'Processing...' : 'Transfer'}
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledTransferModal>
  );
};

export default BNSTransferModal;
