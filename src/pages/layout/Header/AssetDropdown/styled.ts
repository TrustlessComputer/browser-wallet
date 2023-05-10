import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Element = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(12)};

  p {
    font-weight: 500;
    font-size: ${px2rem(18)};
    color: ${({ theme }) => theme.yellow.A};
  }

  .indicator {
    height: ${px2rem(24)};
    width: ${px2rem(1)};
    background-color: ${({ theme }) => theme['border-primary']};
  }
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

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
  }

  .item-actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${px2rem(12)};

    .action {
      padding: ${px2rem(6)};
      display: flex;
      align-items: center;
      justify-content: center;

      width: ${px2rem(24)};
      height: ${px2rem(24)};
      background: ${({ theme }) => theme.bg.third};
      border-radius: ${px2rem(4)};

      :hover {
        opacity: 0.8;
      }
    }

    .action-hide {
      background-color: transparent;
    }
  }
`;
