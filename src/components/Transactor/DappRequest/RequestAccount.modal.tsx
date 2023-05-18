import BaseModal from '@/components/BaseModal';
import React from 'react';
import { Container, ButtonGroup } from './styled';
import * as TC_CONNECT from 'tc-connect';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import Text from '@/components/Text';
import Button from '@/components/Button';

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const RequestAccountModal = ({ requestID, request, onClose }: IProps) => {
  const userInfo = useCurrentUserInfo();
  const [loading, setLoading] = React.useState(false);

  const onRejectRequest = async () => {
    if (!requestID || !userInfo) return;
    setLoading(true);
    const connection = new TC_CONNECT.WalletConnect('', requestID);
    try {
      await connection.postResultAccount({
        btcAddress: '',
        tcAddress: '',
        isCancel: true,
        method: TC_CONNECT.RequestMethod.account,
      });
    } catch (e) {
      setLoading(false);
    }
    onClose();
    setLoading(false);
  };

  const onAcceptRequest = async () => {
    if (!requestID || !userInfo) return;
    const connection = new TC_CONNECT.WalletConnect('', requestID);
    await connection.postResultAccount({
      btcAddress: userInfo.btcAddress,
      method: TC_CONNECT.RequestMethod.account,
      tcAddress: userInfo.address,
    });
    onClose();
  };

  return (
    <BaseModal show={!!requestID} handleClose={onRejectRequest} title="Connect" width={600}>
      <Container>
        <Text size="body-large">
          Approve this request to prove you have access to this wallet and you can start to use{' '}
          <a href={request.site} target="_blank">
            {request.site}
          </a>
          .
        </Text>
        <ButtonGroup className="mt-32">
          <Button disabled={loading} variants="outline" sizes="stretch" onClick={onRejectRequest}>
            Cancel
          </Button>
          <Button disabled={loading} sizes="stretch" onClick={onAcceptRequest}>
            Sure
          </Button>
        </ButtonGroup>
      </Container>
    </BaseModal>
  );
};

export default RequestAccountModal;
