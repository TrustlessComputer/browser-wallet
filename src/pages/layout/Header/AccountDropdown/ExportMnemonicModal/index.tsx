import SignerModal from '@/components/SignerModal';
import React from 'react';
import toast from 'react-hot-toast';
import Container from './styled';
import { useAppSelector } from '@/state/hooks';
import { masterWalletSelector } from '@/state/wallet/selector';
import Text from '@/components/Text';
import * as TC_SDK from 'trustless-computer-sdk';
import copy from 'copy-to-clipboard';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';

interface Props {
  show: boolean;
  handleClose: () => void;
}

const ExportMnemonic = React.memo((props: Props) => {
  const { show, handleClose } = props;
  const [mnemonic, setMnemonic] = React.useState<string>('');
  const masterIns = useAppSelector(masterWalletSelector);

  const getAccountPrivateKey = () => {
    if (!masterIns) return;
    const hdWallet: TC_SDK.HDWallet = masterIns.getHDWallet();
    if (hdWallet && hdWallet.mnemonic) {
      setMnemonic(hdWallet.mnemonic);
    }
  };

  const onClose = () => {
    setMnemonic('');
    handleClose();
  };

  React.useEffect(getAccountPrivateKey, [masterIns]);

  return (
    <SignerModal show={show} onClose={onClose} title="Show Mnemonic" width={600}>
      <Container className="mt-24">
        <div className="form-container">
          <div
            className="box-key"
            onClick={() => {
              copy(mnemonic);
              toast.success('Copied');
            }}
          >
            <Text color="text-secondary" fontWeight="semibold">
              This is your mnemonic (click to copy)
            </Text>
            <Text size="body" color="button-negative" fontWeight="medium" className="key-text">
              {mnemonic}
            </Text>
          </div>

          <AlertMessage
            className="mt-16"
            type={AlertMessageType.warning}
            message="Never disclose this key. Anyone with your mnemonic can steal any assets held in your account."
          />
        </div>
      </Container>
    </SignerModal>
  );
});

export default ExportMnemonic;
