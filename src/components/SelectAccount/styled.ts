import styled, { css } from 'styled-components';
import px2rem from '@/utils/px2rem';
import { MediaQueryBuilder } from '@/theme';

const Container = styled.div`
  .title {
    margin-bottom: 6px;
  }
`;

const ContentBox = styled.div`
  border: 1px solid ${({ theme }) => theme['border-primary']};
  border-radius: 8px;
  cursor: pointer;
  padding: 12px 16px 12px 12px;
  p {
    line-break: anywhere;
  }

  :hover {
    border-color: ${({ theme }) => theme['border-secondary']};
  }
  display: flex;
  justify-content: space-between;
`;

const DropDownContainerXXXL = css`
  width: 350px;
`;

const DropDownContainer = styled.div`
  width: 450px;
  ${MediaQueryBuilder('xxxl', DropDownContainerXXXL)}
`;

const DropdownList = styled.div`
  display: grid;
  gap: ${px2rem(24)} !important;
  max-height: ${px2rem(300)};
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;

export { Container, ContentBox, DropDownContainer, DropdownList };
