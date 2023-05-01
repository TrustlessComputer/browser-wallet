import React from 'react';
import { Container, Dash } from './styled';
import { LayoutContent } from '@/pages/layout';
import Logo from '@/components/icons/Logo';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Row } from '@/components/Row';

const AuthWallet = React.memo(() => {
  return (
    <LayoutContent>
      <Container>
        <Logo className="mt-60" />
        <Text size="h4" className="mt-48">
          Create your wallet
        </Text>
        <Text size="h6" className="mt-16" color="text-secondary" align="center">
          When you create a new wallet, new phrase are generated. Your phrase are the master key of your wallet accounts
          and any value the hold.
        </Text>
        <Button variants="primary" sizes="stretch" className="mt-60">
          Create
        </Button>
        <Row className="mt-60 mb-60">
          <Dash />
          <Text size="h5" className="ml-12 mr-12">
            OR
          </Text>
          <Dash />
        </Row>
        <Text size="h4">Import wallet</Text>
        <Text size="h6" className="mt-16" color="text-secondary" align="center">
          Import your existing wallet using a 12 word seed phrase.
        </Text>
        <Button variants="outline" sizes="stretch" className="mt-60">
          Import
        </Button>
      </Container>
    </LayoutContent>
  );
});

export default AuthWallet;
