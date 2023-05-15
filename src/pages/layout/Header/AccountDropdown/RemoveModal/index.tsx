import Button from '@/components/Button';
import SignerModal from '@/components/SignerModal';
import React from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector, masterWalletSelector, passwordSelector } from '@/state/wallet/selector';
import { getErrorMessage } from '@/utils/error';
import { RemoveAccountAction } from '@/pages/layout/Header/AccountDropdown/RemoveAccount.actions';
import Text from '@/components/Text';
import { useCurrentUserInfo } from '@/state/wallet/hooks';

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
    <SignerModal show={show} onClose={handleClose} title="Remove Account">
      <Container>
        <div className="form-container">
          <Text size="h5" fontWeight="semibold">
            {name}
          </Text>
          <Text size="h5" color="text-secondary" fontWeight="semibold" className="mt-16 mb-32">
            {address}
          </Text>
          <div className="actions">
            <Button disabled={loading} sizes="stretch" onClick={handleClose} className="confirm-btn">
              Cancel
            </Button>
            <Button
              disabled={loading}
              variants="outline"
              sizes="stretch"
              className="confirm-btn"
              onClick={onRemoveAccount}
            >
              {loading ? 'Removing...' : 'Sure'}
            </Button>
          </div>
        </div>
      </Container>
    </SignerModal>
  );
});

export default RemoveAccount;
