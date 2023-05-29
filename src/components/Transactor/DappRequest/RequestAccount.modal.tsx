import React from 'react';
import { Container, ButtonGroup, AdvanceWrapper, Divider } from './styled';
import * as TC_CONNECT from 'tc-connect';
import { useCurrentUserInfo, useUserSecretKey } from '@/state/wallet/hooks';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useAppSelector } from '@/state/hooks';
import { listAccountsSelector } from '@/state/wallet/selector';
import { getConnector } from '@/lib/connector.helper';
import SelectAccount from '@/components/SelectAccount';
import SignerModal from '@/components/SignerModal';
import { getWalletSigner } from '@/utils/contract.signer';
import useProvider from '@/hooks/useProvider';
import { handleRequestEnd } from '@/components/Transactor/DappRequest/utils';
import { getErrorMessage } from '@/utils/error';
import toast from 'react-hot-toast';

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const RequestAccountModal = ({ requestID, request, onClose }: IProps) => {
  const userInfo = useCurrentUserInfo();
  const [loading, setLoading] = React.useState(false);
  const accounts = useAppSelector(listAccountsSelector);
  const provider = useProvider();
  const userSecretKey = useUserSecretKey();

  const onHide = async () => {
    if (!requestID) return;
    setLoading(true);
    const connector = getConnector(requestID);
    try {
      await connector.postResultAccount({
        btcAddress: '',
        tcAddress: '',
        isReject: true,
        method: TC_CONNECT.RequestMethod.account,
        accounts: [],
        signature: undefined,
      });
    } catch (e) {
      setLoading(false);
    }
    onClose();
    setLoading(false);
  };
  const onRequestEnd = () => {
    handleRequestEnd({
      target: request.target,
      redirectURL: request.redirectURL || '',
    });
  };
  const onRejectRequest = async () => {
    await onHide();
    onRequestEnd();
  };

  const onAcceptRequest = async () => {
    try {
      if (!requestID || !userInfo || !userSecretKey || !provider) return;
      if (userInfo.address.toLowerCase() !== userSecretKey.address.toLowerCase()) {
        return;
      }
      const connector = getConnector(requestID);
      const listAccounts = accounts.map(account => ({
        tcAddress: account.address,
        btcAddress: userInfo.btcAddress,
      }));
      let signature = '';
      if (request.signMessage) {
        const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);
        signature = await walletSigner.signMessage(request.signMessage);
      }
      await connector.postResultAccount({
        btcAddress: userInfo.btcAddress,
        tcAddress: userInfo.address,
        method: TC_CONNECT.RequestMethod.account,
        accounts: listAccounts,
        signature,
      });
      onClose();
    } catch (error) {
      const { message } = getErrorMessage(error, 'Connect');
      toast.error(message);
    } finally {
      onRequestEnd();
    }
  };

  return (
    <SignerModal
      show={!!requestID}
      onClose={onHide}
      title={request.signMessage ? 'Connect and Signature request' : 'Connect'}
      width={600}
    >
      <Container>
        <Text size="body-large">
          Approve this request to prove you have access to this wallet and you can start to use{' '}
          <a href={request.site} target="_blank">
            {request.site}
          </a>
          .
        </Text>
        {!!request.signMessage && (
          <>
            <SelectAccount className="mt-16 mb-16" />
            <Divider className="mb-24 mt-24" />
            <AdvanceWrapper className="mt-24">
              <Text size="body" color="text-primary" align="center" className="mb-16 mt-16">
                You only sign this message if you fully understand the content and trust the requesting site.
              </Text>
              <Text size="body" color="text-secondary">
                You are signing:
              </Text>
              <div className="box">
                <Text size="body">{request.signMessage}</Text>
              </div>
            </AdvanceWrapper>
          </>
        )}
        <ButtonGroup className="mt-32">
          <Button disabled={loading} variants="outline" sizes="stretch" onClick={onRejectRequest}>
            Reject
          </Button>
          <Button disabled={loading} sizes="stretch" onClick={onAcceptRequest}>
            Sure
          </Button>
        </ButtonGroup>
      </Container>
    </SignerModal>
  );
};

export default RequestAccountModal;
