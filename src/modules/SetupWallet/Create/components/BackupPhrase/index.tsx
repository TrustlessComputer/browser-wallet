import Text from '@/components/Text';
import { Content } from '@/modules/SetupWallet/Create/components/BackupPhrase/styled';
import React from 'react';
import copy from 'copy-to-clipboard';
import throttle from 'lodash/throttle';
import Spinner from '@/components/Spinner';
import Button from '@/components/Button';
import AlertMessage from '@/components/AlertMessage';
import { AlertMessageType } from '@/components/AlertMessage/AlertMessage';

interface BackupPhraseProps {
  phrase: string;
  onContinue: () => void;
}

const BackupPhrase = (props: BackupPhraseProps) => {
  const [hidePhrase, setHidePhrase] = React.useState(true);

  const onClick = React.useCallback(
    throttle(
      () => {
        if (hidePhrase) {
          setHidePhrase(false);
        } else {
          copy(props.phrase);
          // toast.success('Copied');
        }
      },
      1500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [hidePhrase],
  );

  return (
    <Content>
      <Text className="mt-60" size="h4" fontWeight="medium">
        Secret backup phrase
      </Text>
      <Text color="text-secondary" size="h5" align="center" className="mt-24">
        Your secret backup phrase makes it easy to back up and restore your account.
      </Text>

      {props.phrase ? (
        <div className="box button-hover mt-60" onClick={onClick} onMouseLeave={() => setHidePhrase(true)}>
          <Text size="h5" fontWeight="semibold" align="center">
            {props.phrase}
          </Text>
          {hidePhrase && (
            <div className="overlay">
              <Text size="h6" fontWeight="medium" color="text-secondary">
                Click here to reveal your phrase
              </Text>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-32">
          <Spinner />
        </div>
      )}
      <AlertMessage
        className="mt-24 alert-wrapper"
        type={AlertMessageType.warning}
        message="Never disclose your backup phrase. Write it down and store in a secure location."
      />
      <Button className="mt-60" sizes="stretch" onClick={props.onContinue} disabled={!props.phrase}>
        Continue
      </Button>
    </Content>
  );
};

export default BackupPhrase;
