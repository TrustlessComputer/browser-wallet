import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_STR } from '@/components/Transactor/DappRequest/constants';
import SignTransactionModal from '@/components/Transactor/DappRequest/SignTransaction.modal';
import * as TC_CONNECT from 'tc-connect';
import useAsyncEffect from 'use-async-effect';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { debounce } from 'lodash';
import RequestAccountModal from '@/components/Transactor/DappRequest/RequestAccount.modal';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';

const DappRequest = React.memo(() => {
  const userInfo = useCurrentUserInfo();
  const [searchParams, setSearchParams] = useSearchParams();
  const [request, setRequest] = React.useState<TC_CONNECT.IResultConnectResp | undefined>(undefined);
  const requestID = searchParams.get(SEARCH_STR);

  const onClose = () => {
    setSearchParams('');
  };

  const getRequestData = async () => {
    if (!requestID || !userInfo) return;
    try {
      const connection = new TC_CONNECT.WalletConnect();
      const request = await connection.getRequest(requestID);
      setRequest(request);
    } catch (error) {
      const { message } = getErrorMessage(error, 'requestData');
      toast.error(message);
      onClose();
    }
  };

  const debounceGetRequestData = React.useCallback(debounce(getRequestData, 200), [requestID, userInfo]);

  useAsyncEffect(debounceGetRequestData, [requestID, userInfo]);

  if (!request || !requestID) return <></>;

  if (request.method === TC_CONNECT.RequestMethod.account) {
    return <RequestAccountModal request={request} requestID={requestID} onClose={onClose} />;
  }

  if (request.method === TC_CONNECT.RequestMethod.sign) {
    return <SignTransactionModal request={request} requestID={requestID} onClose={onClose} />;
  }

  return <></>;
});

export default DappRequest;
