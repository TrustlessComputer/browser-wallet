import styled, { css } from 'styled-components';
import px2rem from '@/utils/px2rem';
import { MediaQueryBuilder } from '@/theme';

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  max-width: ${px2rem(1000)};
`;

const Dash = styled.div`
  border: 1px dashed ${({ theme }) => theme['border-primary']};
  flex: 1;
`;

const MediaMD = css`
  padding-top: ${px2rem(48)};
  padding-left: ${px2rem(30)};
  padding-right: ${px2rem(30)};
  flex-direction: column;
  justify-content: flex-start;
  .left-content {
    padding-right: 0;
  }

  .home-image {
    margin-top: 32px;
  }
`;

const HomeContainer = styled.div`
  height: 100vh;
  max-width: ${px2rem(1920)};
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: ${px2rem(100)};
  padding-right: ${px2rem(100)};
  .content {
    align-items: center;
  }
  .left-content {
    padding-right: 60px;
  }

  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(24)};
  }
  .home-image {
    width: 100%;
  }
  ${MediaQueryBuilder('md', MediaMD)}
`;

export { Container, Dash, HomeContainer };
