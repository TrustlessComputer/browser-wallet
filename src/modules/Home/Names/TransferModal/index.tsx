import BaseModal from '@/components/BaseModal';
import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Container } from './TransferModal.styled';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { FeeRate } from '@/components/FeeRate';
import { IBNS } from '@/interfaces/bns';

type Props = {
  show: boolean;
  handleClose: () => void;
  bns: IBNS;
};

type IFormValue = {
  address: string;
};

const BNSTransferModal = (props: Props) => {
  const { show, handleClose, bns } = props;
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

  useEffect(() => {
    if (show) {
      onFetchFee();
    }
  }, [show]);

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.address) {
      errors.address = 'TC address is required.';
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
    <BaseModal show={show} handleClose={handleClose} title={bns.name} subTitle={`Name #${bns.id}`} width={620}>
      <Container>
        <p className="name-detail">Name details</p>
        <Formik
          key="transfer"
          initialValues={{
            address: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form className="form" onSubmit={handleSubmit}>
              <Input
                title="TRANSFER NAME TO"
                id="address"
                type="text"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
                className="input"
                placeholder={`Paste TC wallet address here`}
                errorMsg={errors.address && touched.address ? errors.address : undefined}
              />
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
              <Button disabled={isProcessing} type="submit" className="confirm-btn">
                {isProcessing ? 'Processing...' : 'Transfer'}
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </BaseModal>
  );
};

export default BNSTransferModal;
