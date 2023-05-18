import SignerModal from '@/components/SignerModal';
import React from 'react';
import * as TC_CONNECT from 'tc-connect';
import { useUserSecretKey } from '@/state/wallet/hooks';

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const SignTransactionModal = ({ requestID }: IProps) => {
  const userSecretKey = useUserSecretKey();

  const onRejectRequest = () => {
    if (!requestID || !userSecretKey) return;
  };

  return <SignerModal show={!!requestID} onClose={onRejectRequest} title="" />;
};

export default SignTransactionModal;
