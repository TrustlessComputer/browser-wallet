import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  .title {
    font-style: normal;
    font-weight: 500;
    font-size: 34px;
    line-height: 44px;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
    padding: 0px 10px;
  }

  .list {
    min-height: 60vh;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    margin-top: ${px2rem(32)};
  }

  .item {
    padding: ${px2rem(16)} ${px2rem(12)} !important;
  }

  .card {
    width: 100%;
    height: auto;
    text-decoration: none;
    --bs-card-bg: none;
  }
`;

export { Container };
