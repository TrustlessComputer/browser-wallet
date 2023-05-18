import SignerModal from '@/components/SignerModal';
import React from 'react';
import * as TC_CONNECT from 'tc-connect';

interface IProps {
  request: TC_CONNECT.IResultConnectResp;
  show: boolean;
  onClose: () => void;
}

const SignTransactionModal = (props: IProps) => {
  const handleClose = () => {
    props.onClose();
  };

  return <SignerModal show={props.show} onClose={handleClose} title="" />;
};

export default SignTransactionModal;
