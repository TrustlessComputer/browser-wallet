import React from 'react';
import { Outlet } from 'react-router-dom';
import Meta from './Meta';
import Footer from './Footer';
import Header from './Header';
import { FO0TER_HEIGHT, Container, ContentWrapper } from '@/pages/layout';

const LayoutOutlet = () => {
  return (
    <>
      <Meta />
      <Header />
      <Container>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </Container>
      <Footer height={FO0TER_HEIGHT} />
    </>
  );
};

export default LayoutOutlet;
