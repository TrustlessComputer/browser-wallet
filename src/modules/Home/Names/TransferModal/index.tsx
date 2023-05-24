import Button from '@/components/Button';
import { Input } from '@/components/Inputs';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Container } from './TransferModal.styled';
import useFeeRate from '@/components/FeeRate/useFeeRate';
import { FeeRate } from '@/components/FeeRate';
import { IBNS } from '@/interfaces/bns';
import SignerModal from '@/components/SignerModal';
import { validateEVMAddress } from '@/utils';
import useGasFee from '@/components/GasFee/useGasFee';
import WError, { ERROR_CODE, getErrorMessage } from '@/utils/error';
import useContractOperation from '@/hooks/useContractOperation';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useTransferName, { ITransferName } from '@/hooks/contracts-operation.ts/useTransferName';
import { debounce } from 'lodash';
import { useUserSecretKey } from '@/state/wallet/hooks';
import GasFee from '@/components/GasFee';

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
  const userSecretKey = useUserSecretKey();
  const [isProcessing, setIsProcessing] = useState(false);
  const { maxFee, setGasLimit, error, setError, estimating, loading, setEstimating } = useGasFee();

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

  const { run: onTransferName, estimateGas } = useContractOperation<ITransferName, TransactionResponse>({
    operation: useTransferName,
    inscribeable: true,
    feeRate: currentRate,
  });

  const onEstimateGas = async (payload: IFormValue) => {
    try {
      if (!estimateGas) {
        throw new WError(ERROR_CODE.INVALID_PARAMS);
      }

      if (!payload.address) {
        setGasLimit(undefined);
        return;
      }
      setEstimating(true);
      const gasLimit = await estimateGas({
        receiver: payload.address,
        name: props.bns.name,
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

    if (!values.address) {
      errors.address = 'Receiver address is required.';
    }

    if (!validateEVMAddress(values.address)) {
      errors.address = 'Invalid receiver address.';
    }
    if (!errors.address) {
      debounceEstimateGas(values);
    }
    return errors;
  };

  const handleSubmit = async (params: IFormValue): Promise<void> => {
    // const { address } = values;
    try {
      setIsProcessing(true);

      await onTransferName({
        name: props.bns.name,
        receiver: params.address,
      });
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
    <SignerModal show={show} onClose={handleClose} title={bns.name} subTitle={`Name #${bns.id}`}>
      <Container>
        <p className="name-detail">Transfer Name</p>
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
                disabled={estimating || loading || isProcessing}
                type="submit"
                className="confirm-btn"
                isLoading={estimating || loading || isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Transfer'}
              </Button>
            </form>
          )}
        </Formik>
      </Container>
    </SignerModal>
  );
};

export default BNSTransferModal;
