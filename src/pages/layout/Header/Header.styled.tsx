import styled from 'styled-components';
import { LayoutPadding } from '@/pages/layout/Layout.styled';
import px2rem from '@/utils/px2rem';

const Wrapper = styled(LayoutPadding)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  background-color: ${({ theme }) => theme.bg.secondary};
  padding-top: ${px2rem(24)};
  padding-bottom: ${px2rem(24)};
`;

export { Wrapper };
