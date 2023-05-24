import BaseModal from '@/components/BaseModal';
import Button from '@/components/Button';
import { Row } from '@/components/Row';
import Text from '@/components/Text';
import sleep from '@/utils/sleep';
import React from 'react';
import Container from './styled';

interface Props {
  show: boolean;
  handleClose: () => void;
}

const ResetWalletModal = React.memo((props: Props) => {
  const { show, handleClose } = props;

  const onResetAccount = async () => {
    localStorage.clear();
    await sleep(0.5);
    window.location.reload();
  };

  return (
    <BaseModal show={show} handleClose={handleClose} title="Reset wallet" width={800}>
      <Container>
        <div className="form-container">
          <div className="account">
            <Row justify="space-between">
              <Text size="body" fontWeight="regular" color="button-primary">
                <p>
                  Trustless Wallet does not save a copy of your password. If you’re having trouble unlocking your
                  account, you’ll need to reset your wallet. You can do this by entering the Secret Recovery Phrase you
                  used to set up your wallet.
                  <br></br>
                  <br></br>
                  This action will delete your current wallet and Secret Recovery Phrase from this device, as well as
                  the list of accounts you’ve curated.
                  <br></br>
                  <br></br>
                  Please double-check that you’re using the correct Secret Recovery Phrase before proceeding. You will
                  be unable to undo this.
                </p>
              </Text>
            </Row>
          </div>
          <div className="actions">
            <Button sizes="stretch" onClick={handleClose} className="confirm-btn">
              Cancel
            </Button>
            <Button variants="outline-negative" sizes="stretch" className="confirm-btn" onClick={onResetAccount}>
              Restore
            </Button>
          </div>
        </div>
      </Container>
    </BaseModal>
  );
});

export default ResetWalletModal;
