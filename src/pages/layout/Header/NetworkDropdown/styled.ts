import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Element = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(12)};
`;

export const DropdownList = styled.div`
  display: grid;
  gap: ${px2rem(24)} !important;
`;

export const DropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${px2rem(24)};
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
  }
`;
