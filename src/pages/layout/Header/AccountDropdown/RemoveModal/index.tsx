import Button from '@/components/Button';
import SignerModal from '@/components/SignerModal';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector, masterWalletSelector, passwordSelector } from '@/state/wallet/selector';
import { getErrorMessage } from '@/utils/error';
import { RemoveAccountAction } from '@/pages/layout/Header/AccountDropdown/RemoveAccount.actions';
import Text from '@/components/Text';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { Row } from '@/components/Row';
import useProvider from '@/hooks/useProvider';
import format from '@/utils/amount';
import Token from '@/constants/token';

interface Props {
  show: boolean;
  handleClose: () => void;
  address: string;
  name: string;
}

const RemoveAccount = React.memo((props: Props) => {
  const { show, handleClose, name, address } = props;
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const userInfo = useCurrentUserInfo();
  const masterIns = useAppSelector(masterWalletSelector);
  const accounts = useAppSelector(listAccountsSelector);
  const password = useAppSelector(passwordSelector);

  const [tcBalance, setTcBalance] = React.useState('0');
  const provider = useProvider();

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });

  useEffect(() => {
    getTcBalance();
  }, [provider]);

  const getTcBalance = async () => {
    if (provider) {
      const data = await provider.getBalance(address);
      setTcBalance(data.toString());
    }
  };

  const removeAccountActions = new RemoveAccountAction({
    component: {
      password: password || '',
      currentAccount: userInfo,
      accounts,
      setLoading,
      masterIns,
    },
    dispatch: dispatch,
  });

  const onRemoveAccount = async (): Promise<void> => {
    try {
      await removeAccountActions.removeAccount(address);
      toast.success('Remove account successfully');
      handleClose();
    } catch (err) {
      const { message } = getErrorMessage(err, 'submitRemoveAccount');
      toast.error(message);
    }
  };

  return (
    <SignerModal show={show} onClose={handleClose} title="Remove Account" width={600}>
      <Container>
        <div className="form-container">
          <div className="account">
            <Row justify="space-between">
              <Text size="body-large" fontWeight="semibold">
                {name}
              </Text>
              <Text size="body" fontWeight="medium" color="button-primary">
                {formatTcBalance} TC
              </Text>
            </Row>
            <Text size="body" color="text-secondary" fontWeight="medium">
              {address}
            </Text>
          </div>
          <div className="actions">
            <Button disabled={loading} sizes="stretch" onClick={handleClose} className="confirm-btn">
              Cancel
            </Button>
            <Button
              disabled={loading}
              variants="outline-negative"
              sizes="stretch"
              className="confirm-btn"
              onClick={onRemoveAccount}
            >
              {loading ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </div>
      </Container>
    </SignerModal>
  );
});

export default RemoveAccount;
