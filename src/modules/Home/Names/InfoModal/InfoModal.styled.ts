import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const Container = styled.div`
  margin-top: ${px2rem(28)};

  .name-detail {
    font-size: ${px2rem(20)};
    letter-spacing: -0.03em;
    color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
  }

  .card-transfer-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(6)};
    cursor: pointer;
    margin-top: ${px2rem(24)};

    :hover {
      opacity: 0.8;
    }

    img {
      width: ${px2rem(20)};
      height: ${px2rem(20)};
    }

    p {
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(26)};
      letter-spacing: 0.01em;

      color: ${({ theme }: { theme: DefaultTheme }) => theme['button-primary']};
    }
  }
`;
