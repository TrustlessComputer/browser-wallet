import styled, { css } from 'styled-components';
import { LayoutPadding } from '@/pages/layout/Layout.styled';
import px2rem from '@/utils/px2rem';
import { MediaQueryBuilder } from '@/theme';

const MediaLarge = css`
  .balance-wrapper {
    display: none;
  }
`;

const MediaXl = css`
  .external-wrapper {
    display: none;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: ${({ theme }) => theme.bg.secondary};
`;

const Wrapper = styled(LayoutPadding)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding-top: ${px2rem(24)};
  padding-bottom: ${px2rem(24)};
  height: ${px2rem(110)};
  max-width: ${px2rem(2268)};
  width: 100%;

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
  ${MediaQueryBuilder('xxl', MediaXl)}
`;

const DropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;

  :hover {
    opacity: 0.8;
    * {
      text-decoration: underline;
    }
  }

  .icon-disconnect {
    padding: 8px;
    background-color: ${({ theme }) => theme.red.C};
    border-radius: 4px;
  }

  .text-disconnect {
    color: ${({ theme }) => theme.red.C};
  }

  .icon-normal {
    padding: 8px;
    background-color: ${({ theme }) => theme.bg.third};
    border-radius: 4px;
  }

  .text-normal {
  }
`;

const DropdownList = styled.div`
  display: grid;
  gap: 12px !important;
`;

export { Wrapper, DropdownItem, DropdownList, Container };
