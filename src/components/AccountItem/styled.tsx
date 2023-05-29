import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const DropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${px2rem(32)};

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
    :hover {
      opacity: 0.8;
    }

    .icon {
      width: ${px2rem(24)};
    }

    span {
      font-weight: 400;
      color: ${({ theme }) => theme['text-secondary']};
      font-size: ${px2rem(14)};
    }
    .balance {
      margin-top: 4px;
    }
  }

  .item-actions {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${px2rem(12)};

    .action {
      display: flex;
      align-items: center;
      justify-content: center;

      width: ${px2rem(28)};
      height: ${px2rem(28)};

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

export const MoreDropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(12)};

  :hover {
    opacity: 0.8;
    * {
      text-decoration: underline;
    }
  }

  .icon-remove {
    padding: ${px2rem(4)};
    background-color: ${({ theme }) => theme.red.C};
    border-radius: ${px2rem(4)};
  }

  .text-remove {
    color: ${({ theme }) => theme.red.C};
  }

  .icon-normal {
    padding: ${px2rem(4)};
    background-color: ${({ theme }) => theme.bg.third};
    border-radius: ${px2rem(4)};
  }

  .text-normal {
  }
`;

export const MoreDropdownList = styled.div`
  display: grid;
  gap: ${px2rem(16)} !important;
`;
