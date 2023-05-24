import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  padding: ${px2rem(0)} ${px2rem(0)} ${px2rem(12)};
  gap: ${px2rem(4)};
  margin-top: ${px2rem(12)};

  height: ${px2rem(40)};
  border-bottom: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme['border-primary']};

  .item-title {
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    letter-spacing: -0.01em;
    color: ${({ theme }: { theme: DefaultTheme }) => theme['text-five']};
  }
`;

export const Styled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(6)};

  font-weight: 400;
  font-size: ${px2rem(16)};
  line-height: ${px2rem(26)};
  letter-spacing: -0.01em;
  color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};

  .ic-copy {
    cursor: pointer;
    width: ${px2rem(20)};
    height: ${px2rem(20)};
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    :hover {
      opacity: 0.9;
    }
  }

  a {
    text-decoration: underline !important;
    cursor: pointer;
    :hover {
      opacity: 0.9;
    }
  }
`;
