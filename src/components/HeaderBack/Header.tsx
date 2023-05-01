import React from 'react';
import { CenterContainer, Container, LeftContainer } from './Header.styled';
import { ArrowLeftIcon } from '@/components/icons';

interface HeaderProps {
  onClickGoBack: () => void;
  centerComponent?: () => React.ReactElement;
}

const HeaderBack = (props: HeaderProps) => {
  return (
    <Container>
      <LeftContainer onClick={props.onClickGoBack}>
        <ArrowLeftIcon />
      </LeftContainer>
      <CenterContainer>{props.centerComponent && props.centerComponent()}</CenterContainer>
      <LeftContainer style={{ border: 'none' }} />
    </Container>
  );
};

export default React.memo(HeaderBack);
