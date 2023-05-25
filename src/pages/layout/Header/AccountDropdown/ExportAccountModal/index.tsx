import SignerModal from '@/components/SignerModal';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { useAppSelector } from '@/state/hooks';
import { masterWalletSelector } from '@/state/wallet/selector';
import Text from '@/components/Text';
import { Row } from '@/components/Row';
import useProvider from '@/hooks/useProvider';
import format from '@/utils/amount';
import Token from '@/constants/token';
import copy from 'copy-to-clipboard';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';
import { getPrivateKeyByAddress } from '@/lib/wallet';

interface Props {
  show: boolean;
  handleClose: () => void;
  address: string;
  name: string;
}

const ExportAccount = React.memo((props: Props) => {
  const { show, handleClose, name, address } = props;
  const [privateKey, setPrivateKey] = React.useState<string>('');
  const masterIns = useAppSelector(masterWalletSelector);

  const [tcBalance, setTcBalance] = React.useState('0');
  const provider = useProvider();

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });

  const getTcBalance = async () => {
    if (provider) {
      const data = await provider.getBalance(address);
      setTcBalance(data.toString());
    }
  };

  const getAccountPrivateKey = () => {
    if (!masterIns) return;
    let pvKey = getPrivateKeyByAddress(masterIns, address);
    if (pvKey) {
      if (pvKey.startsWith('0x')) {
        pvKey = pvKey.slice(2);
      }
      setPrivateKey(pvKey);
    } else {
      toast.error('Could not find your account.');
    }
  };

  const onClose = () => {
    setPrivateKey('');
    handleClose();
  };

  React.useEffect(getAccountPrivateKey, [address, masterIns]);

  useEffect(() => {
    getTcBalance();
  }, [provider]);

  return (
    <SignerModal show={show} onClose={onClose} title="Show Private Key" width={600}>
      <Container className="mt-24">
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

          <div
            className="box-key mt-24"
            onClick={() => {
              copy(privateKey);
              toast.success('Copied');
            }}
          >
            <Text color="text-secondary" fontWeight="semibold">
              This is your private key (click to copy)
            </Text>
            <Text size="body" color="button-negative" fontWeight="medium" className="key-text">
              {privateKey}
            </Text>
          </div>

          <AlertMessage
            className="mt-16"
            type={AlertMessageType.warning}
            message="Never disclose this key. Anyone with your private keys can steal any assets held in your account."
          />
        </div>
      </Container>
    </SignerModal>
  );
});

export default ExportAccount;
