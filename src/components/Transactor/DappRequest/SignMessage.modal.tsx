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

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const SignMessageModal = ({ requestID, request, onClose }: IProps) => {
  const [loading, setLoading] = React.useState(false);
  const accounts = useAppSelector(listAccountsSelector);
  const userInfo = useCurrentUserInfo();
  const userSecretKey = useUserSecretKey();
  const provider = useProvider();

  const onRejectRequest = async () => {
    if (!requestID || !userInfo) return;
    setLoading(true);
    const connector = getConnector(requestID);
    try {
      await connector.postResultSignMessage({
        btcAddress: '',
        tcAddress: '',
        isReject: true,
        method: TC_CONNECT.RequestMethod.signMessage,
        accounts: [],
        signature: '',
      });
    } catch (e) {
      setLoading(false);
    }
    onClose();
    setLoading(false);
  };

  const onAcceptRequest = async () => {
    if (!requestID || !userInfo || !userSecretKey || !provider || !request.signMessage) return;
    if (userInfo.address.toLowerCase() !== userSecretKey.address.toLowerCase()) {
      return;
    }
    const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);
    const signature = await walletSigner.signMessage(request.signMessage);
    const connector = getConnector(requestID);
    const listAccounts = accounts.map(account => ({
      tcAddress: account.address,
      btcAddress: userInfo.btcAddress,
    }));
    await connector.postResultAccount({
      btcAddress: userInfo.btcAddress,
      method: TC_CONNECT.RequestMethod.signMessage,
      tcAddress: userInfo.address,
      accounts: listAccounts,
      signature,
    });
    onClose();
  };

  return (
    <SignerModal show={!!requestID} onClose={onRejectRequest} title="Signature request" width={600}>
      <Container>
        <SelectAccount
          title="Account"
          className="mt-16 mb-16"
          setLoading={isLoading => {
            console.log(isLoading);
          }}
        />
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
        <ButtonGroup className="mt-32">
          <Button disabled={loading} variants="outline" sizes="stretch" onClick={onRejectRequest}>
            Reject
          </Button>
          <Button disabled={loading} sizes="stretch" onClick={onAcceptRequest}>
            Sign
          </Button>
        </ButtonGroup>
      </Container>
    </SignerModal>
  );
};

export default SignMessageModal;
