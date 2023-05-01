import React, { PropsWithChildren } from 'react';
import Meta from './Meta';
import Footer from './Footer';
import Header from './Header';
import { FO0TER_HEIGHT, Container, ContentWrapper } from '@/pages/layout';

const LayoutContent = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Meta />
      <Header />
      <Container>
        <ContentWrapper>{children}</ContentWrapper>
      </Container>
      <Footer height={FO0TER_HEIGHT} />
    </>
  );
};

export default LayoutContent;
