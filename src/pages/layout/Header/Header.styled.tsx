import styled, { css } from 'styled-components';
import { LayoutPadding } from '@/pages/layout/Layout.styled';
import px2rem from '@/utils/px2rem';
import { MediaQueryBuilder } from '@/theme';

const MediaLarge = css`
  .balance-wrapper {
    display: none;
  }
  .external-wrapper {
    display: none;
  }
`;

const Wrapper = styled(LayoutPadding)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background-color: ${({ theme }) => theme.bg.secondary};
  padding-top: ${px2rem(24)};
  padding-bottom: ${px2rem(24)};

  .ic-logo {
    width: ${px2rem(60)};
    height: ${px2rem(60)};
  }

  .external-wrapper {
    max-width: 30vw;
    display: flex;
    justify-content: end;
  }

  ${MediaQueryBuilder('lg', MediaLarge)}
`;

export { Wrapper };
