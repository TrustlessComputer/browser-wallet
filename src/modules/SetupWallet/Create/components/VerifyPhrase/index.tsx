import Text from '@/components/Text';
import { Content, MnemonicItemWrapper } from '@/modules/SetupWallet/Create/components/VerifyPhrase/styled';
import React from 'react';
import shuffle from 'lodash/shuffle';
import MnemonicItem from '@/components/Mnemonic';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';
import Button from '@/components/Button';

interface VerifyPhraseProps {
  phrase: string;
  onVerifySuccess: () => void;
}

const VerifyPhrase = (props: VerifyPhraseProps) => {
  const phraseList = React.useMemo(() => {
    return props.phrase.split(' ') as string[];
  }, [props.phrase]);
  const [phraseListSelected, setPhraseListSelected] = React.useState<string[]>([]);

  const mnemonicCorrect = React.useMemo(() => phraseList.join(' '), []);
  const phraseListShuffle = React.useMemo(() => shuffle(phraseList), [phraseList]);

  const [isPhraseCorrect, phraseSelectedString, isAbleVerify] = React.useMemo(() => {
    const phraseSelectedJoin = phraseListSelected.join(' ');
    return [
      phraseSelectedJoin === mnemonicCorrect,
      phraseSelectedJoin,
      phraseListSelected.length === phraseList.length,
    ];
  }, [phraseListSelected]) as [boolean, string, boolean];

  const mnemonicItemChoose = (title: string) => {
    const newPhraseListSelected = [...phraseListSelected];
    const findIndex = newPhraseListSelected.findIndex(item => item === title);
    if (findIndex !== -1) {
      newPhraseListSelected.splice(findIndex, 1);
    } else {
      newPhraseListSelected.push(title || '');
    }
    setPhraseListSelected(newPhraseListSelected);
  };

  return (
    <Content>
      <Text className="mt-48" size="h4" fontWeight="medium">
        Confirm your secret backup phrase
      </Text>
      <Text color="text-secondary" size="h6" align="center" fontWeight="regular" className="mt-16">
        Please select each phrase in order to make sure it is correct.
      </Text>
      <div className="mnemonic-box mt-60">
        {phraseListShuffle.map((item, index) => (
          <MnemonicItemWrapper key={item}>
            <MnemonicItem
              key={item}
              index={index}
              title={item}
              disabled={false}
              onClick={() => mnemonicItemChoose(item)}
            />
          </MnemonicItemWrapper>
        ))}
      </div>
      <div className="box mt-32 mb-16">
        <Text size="h6" fontWeight="medium" align="center">
          {phraseSelectedString}
        </Text>
      </div>
      {!isPhraseCorrect && isAbleVerify && (
        <AlertMessage type={AlertMessageType.error} message="That's not quite right" />
      )}

      <Button sizes="stretch" disabled={!isPhraseCorrect} className="submit-btn mt-32" onClick={props.onVerifySuccess}>
        Verify
      </Button>
    </Content>
  );
};

export default VerifyPhrase;
