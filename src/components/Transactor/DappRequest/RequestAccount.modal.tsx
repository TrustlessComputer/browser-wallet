import BaseModal from '@/components/BaseModal';
import React from 'react';
import { Container, ButtonGroup } from './styled';
import * as TC_CONNECT from 'tc-connect';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useAppSelector } from '@/state/hooks';
import { listAccountsSelector } from '@/state/wallet/selector';
import { getConnector } from '@/lib/connector.helper';

interface IProps {
  requestID: string;
  request: TC_CONNECT.IResultConnectResp;
  onClose: () => void;
}

const RequestAccountModal = ({ requestID, request, onClose }: IProps) => {
  const userInfo = useCurrentUserInfo();
  const [loading, setLoading] = React.useState(false);
  const accounts = useAppSelector(listAccountsSelector);

  const onRejectRequest = async () => {
    if (!requestID || !userInfo) return;
    setLoading(true);
    const connector = getConnector(requestID);
    try {
      await connector.postResultAccount({
        btcAddress: '',
        tcAddress: '',
        isCancel: true,
        method: TC_CONNECT.RequestMethod.account,
        accounts: [],
      });
    } catch (e) {
      setLoading(false);
    }
    onClose();
    setLoading(false);
  };

  const onAcceptRequest = async () => {
    if (!requestID || !userInfo) return;
    const connector = getConnector(requestID);
    const listAccounts = accounts.map(account => ({
      tcAddress: account.address,
      btcAddress: userInfo.btcAddress,
    }));
    await connector.postResultAccount({
      btcAddress: userInfo.btcAddress,
      method: TC_CONNECT.RequestMethod.account,
      tcAddress: userInfo.address,
      accounts: listAccounts,
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
