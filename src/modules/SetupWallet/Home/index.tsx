import React from 'react';
import { Container, Dash } from '@/modules/SetupWallet/styled';
import Logo from '@/components/icons/Logo';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { Row } from '@/components/Row';
import { ISetAuthStepProps } from '@/modules/SetupWallet/types';

interface IProps extends ISetAuthStepProps {}

const Home = React.memo(({ setStep }: IProps) => {
  const setCreate = () => {
    setStep('create');
    window.scrollTo(0, 0);
  };
  const setImport = () => {
    setStep('import');
    window.scrollTo(0, 0);
  };

  return (
    <Container>
      <Logo className="mt-48" />
      <Text size="h4" className="mt-32">
        Create your wallet
      </Text>
      <Text size="h6" className="mt-16" color="text-secondary" align="center">
        When you create a new wallet, new phrase are generated. Your phrase are the master key of your wallet accounts
        and any value they hold.
      </Text>
      <Button variants="primary" sizes="stretch" className="mt-60" onClick={setCreate}>
        Create
      </Button>
      <Row className="mt-48 mb-48">
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
      <Button variants="outline" sizes="stretch" className="mt-48" onClick={setImport}>
        Import
      </Button>
    </Container>
  );
});

export default Home;
