import React, { PropsWithChildren } from 'react';
import Meta from './Meta';
import Footer from './Footer';
import Header from './Header';
import { Container, ContentWrapper } from '@/pages/layout';
import { useContentSize } from '@/hooks/useContentSize';

const LayoutContent = ({ children }: PropsWithChildren) => {
  const { height } = useContentSize();
  return (
    <>
      <Meta />
      <Header />
      <Container>
        <ContentWrapper style={{ minHeight: height }}>{children}</ContentWrapper>
      </Container>
      <Footer />
    </>
  );
};

export default LayoutContent;
