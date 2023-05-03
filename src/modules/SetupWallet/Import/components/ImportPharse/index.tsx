import Text from '@/components/Text';
import { Content } from '@/modules/SetupWallet/Import/components/ImportPharse/styled';
import React, { useMemo } from 'react';
import { utils } from 'ethers';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';
import Button from '@/components/Button';
import { TC_SDK } from '@/lib';
import { isLocalhost } from '@/utils/services';

interface ImportPhraseProps {
  onImportPhrase: (phrase: string) => void;
}

const MOCKUP_PHRASE = isLocalhost
  ? 'silent copper cradle modify spend knock task order gadget myself another ripple'
  : '';

const ImportPhrase = (props: ImportPhraseProps) => {
  const [phrase, setPhrase] = React.useState(MOCKUP_PHRASE);
  const [isInValidPhrase, setInValidPhrase] = React.useState(false);

  const ableClick = phrase.split(' ').length === 12;

  const disabledContinue = useMemo(() => {
    if (isInValidPhrase) return true;
    return !ableClick;
  }, [ableClick, isInValidPhrase]);

  const onChangePhrase = (event: any) => {
    const input = event.target.value;
    setPhrase(input.trim());
    setInValidPhrase(false);
  };

  const onBlurTextArea = () => {
    try {
      const isEtherValid = utils.isValidMnemonic(phrase);
      const isBTCValid = TC_SDK.validateMnemonicBTC(phrase);
      setInValidPhrase(!isBTCValid || !isEtherValid);
    } catch (e) {
      setInValidPhrase(true);
    }
  };

  const onContinue = () => {
    props.onImportPhrase(phrase);
  };

  return (
    <Content>
      <Text className="mt-60" size="h4" fontWeight="medium">
        Import wallet
      </Text>
      <Text color="text-secondary" size="h5" align="center" className="mt-24">
        Recovery your phrase 12 words
      </Text>
      <div className="box mt-60">
        <textarea
          className="input-phrase"
          placeholder="Your phrase (required)"
          value={phrase}
          onChange={onChangePhrase}
          onBlur={onBlurTextArea}
        />
      </div>
      {isInValidPhrase && <AlertMessage type={AlertMessageType.error} message="Your phrase is invalid." />}
      <Button sizes="stretch" className="mt-60" disabled={disabledContinue} onClick={onContinue}>
        Import
      </Button>
    </Content>
  );
};

export default ImportPhrase;
