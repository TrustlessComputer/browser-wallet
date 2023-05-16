import Button from '@/components/Button';
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
import * as TC_SDK from 'trustless-computer-sdk';
import { compareString } from '@/utils';
import copy from 'copy-to-clipboard';

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
    const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
    const nodes: TC_SDK.IDeriveKey[] = hdWallet.nodes || [];
    const selected = nodes?.find(node => compareString({ str1: node.address, str2: address, method: 'equal' }));
    if (selected) {
      setPrivateKey(selected.privateKey);
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
    <SignerModal show={show} onClose={onClose} title="Show Private Keys" width={600}>
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
          <div
            className="box-key mt-32"
            onClick={() => {
              copy(privateKey);
              toast.success('Copied');
            }}
          >
            <Text>This is your private key (click to copy)</Text>
            <Text size="h5" color="text-highlight" fontWeight="medium" className="key-text mt-8">
              {privateKey}
            </Text>
          </div>
          <div className="actions" onClick={onClose}>
            <Button sizes="stretch" className="confirm-btn">
              Done
            </Button>
          </div>
        </div>
      </Container>
    </SignerModal>
  );
});

export default ExportAccount;
