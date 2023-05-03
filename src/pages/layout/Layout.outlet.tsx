import React from 'react';
import { Outlet } from 'react-router-dom';
import Meta from './Meta';
import Footer from './Footer';
import Header from './Header';
import { Container, ContentWrapper } from '@/pages/layout';
import { useContentSize } from '@/hooks/useContentSize';

const LayoutOutlet = () => {
  const { height } = useContentSize();
  return (
    <>
      <Meta />
      <Header />
      <Container>
        <ContentWrapper style={{ minHeight: height }}>
          <Outlet />
        </ContentWrapper>
      </Container>
      <Footer />
    </>
  );
};

export default LayoutOutlet;
