import styled from 'styled-components';
import px2rem from '@/utils/px2rem';
import { BREAKPOINTS } from '@/theme';

const PADDING = {
  SMALL: '16px',
  MEDIUM: '32px',
  LARGE: '60px',
};

const LayoutPadding = styled.div`
  padding-left: ${PADDING.SMALL};
  padding-right: ${PADDING.SMALL};
  @media screen and (min-width: ${BREAKPOINTS.md}) {
    padding-left: ${PADDING.MEDIUM};
    padding-right: ${PADDING.MEDIUM};
  }
  @media screen and (min-width: ${BREAKPOINTS.lg}) {
    padding-left: ${PADDING.LARGE};
    padding-right: ${PADDING.LARGE};
  }
`;

const Container = styled(LayoutPadding)`
  min-height: 100vh;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  padding-top: ${px2rem(32)};
  padding-bottom: ${px2rem(32)};
`;

const ContentWrapper = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-self: center;
  width: 100%;
`;

export { Container, ContentWrapper, LayoutPadding };
