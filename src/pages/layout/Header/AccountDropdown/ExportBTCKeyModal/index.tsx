import SignerModal from '@/components/SignerModal';
import React, { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { useAppSelector } from '@/state/hooks';
import { masterWalletSelector } from '@/state/wallet/selector';
import Text from '@/components/Text';
import { Row } from '@/components/Row';
import format from '@/utils/amount';
import Token from '@/constants/token';
import * as TC_SDK from 'trustless-computer-sdk';
import copy from 'copy-to-clipboard';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';
import { AssetsContext } from '@/contexts/assets.context';

interface Props {
  show: boolean;
  handleClose: () => void;
}

const ExportBTCKey = React.memo((props: Props) => {
  const { show, handleClose } = props;
  const [privateKey, setPrivateKey] = React.useState<string>('');
  const [address, setAddress] = React.useState<string>('');
  const masterIns = useAppSelector(masterWalletSelector);

  const { getAssetsCreateTx, btcBalance } = useContext(AssetsContext);

  const formatBTCBalance = format.shorterAmount({ originalAmount: btcBalance, decimals: Token.BITCOIN.decimal });

  const getAccountPrivateKey = () => {
    if (!masterIns) return;
    const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
    if (hdWallet && hdWallet.btcPrivateKey) {
      const btcPrivateKey = hdWallet.btcPrivateKey;
      const btcPrivateKeyBuffer = TC_SDK.convertPrivateKeyFromStr(btcPrivateKey);
      const { address: btcAddress } = TC_SDK.generateP2WPKHKeyPair(btcPrivateKeyBuffer);
      setPrivateKey(btcPrivateKey);
      setAddress(btcAddress);
    }
  };

  const onClose = () => {
    setPrivateKey('');
    handleClose();
  };

  React.useEffect(getAccountPrivateKey, [masterIns]);

  useEffect(() => {
    getAssetsCreateTx();
  }, []);

  return (
    <SignerModal show={show} onClose={onClose} title="Show BTC Private Key" width={600}>
      <Container className="mt-24">
        <div className="form-container">
          <div className="account">
            <Row justify="space-between">
              <Text size="body" fontWeight="medium" color="button-primary">
                {formatBTCBalance} BTC
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
            message="Never disclose this key. Anyone with your private key can steal any assets held in your account."
          />
        </div>
      </Container>
    </SignerModal>
  );
});

export default ExportBTCKey;
