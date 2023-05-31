import React from 'react';
import { HomeContainer } from '@/modules/SetupWallet/styled';
import Logo from '@/components/icons/Logo';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { ISetAuthStepProps } from '@/modules/SetupWallet/types';
import { Col, Row } from 'react-bootstrap';
import HomePng from '@/images/home.png';

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
    <HomeContainer>
      <Row className="content">
        <Col xl="6" className="left-content">
          <Logo />
          <Text size="h4" fontWeight="semibold" className="mt-16">
            New Bitcoin Wallet
          </Text>
          <Text size="h5" className="mt-16">
            A crypto wallet & gateway to decentralized applications on Bitcoin.
          </Text>
          <div className="actions mt-48">
            <Button variants="primary" sizes="stretch" onClick={setCreate}>
              Create Wallet
            </Button>
            <Button variants="outline" sizes="stretch" onClick={setImport}>
              Import Wallet
            </Button>
          </div>
        </Col>
        <Col xl="6">
          <img src={HomePng} className="home-image" />
        </Col>
      </Row>
    </HomeContainer>
  );
});

export default Home;
