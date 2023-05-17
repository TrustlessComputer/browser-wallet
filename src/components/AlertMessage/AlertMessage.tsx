import React from 'react';

import { Container } from './AlertMessage.styled';
import Text from '@/components/Text';
import { ErrorIcon, VerifyIcon, WarningIcon } from '@/components/icons';

export enum AlertMessageType {
  error,
  warning,
  success,
}

interface AlertMessageProps {
  type: AlertMessageType;
  message?: string;
  className?: string;
}

const AlertMessage = (props: AlertMessageProps) => {
  if (!props.message) {
    return <div />;
  }
  let ic = <WarningIcon width="28px" />;
  switch (props.type) {
    case AlertMessageType.error:
      ic = <ErrorIcon width="28px" />;
      break;
    case AlertMessageType.success:
      ic = <VerifyIcon width="28px" />;
      break;
  }
  return (
    <Container className={props.className} type={props.type}>
      {ic}
      <Text size="note" fontWeight="medium" className="text-warning">
        {props.message}
      </Text>
    </Container>
  );
};

export default React.memo(AlertMessage);
