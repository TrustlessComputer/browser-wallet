import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Element = styled.div``;

export const DropDownContainer = styled.div`
  .actions {
    display: flex;

    border-top: ${px2rem(1)} solid ${({ theme }) => theme['text-four']};

    padding: ${px2rem(16)};
    padding-bottom: ${px2rem(4)};
    gap: ${px2rem(12)};
    margin-top: ${px2rem(12)};
    width: 100%;
  }

  .create-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }

    .text-remove {
      color: ${({ theme }) => theme.red.A};
    }
  }
`;

export const DropdownList = styled.div`
  display: grid;
  gap: ${px2rem(24)} !important;
  max-height: ${px2rem(400)};
  overflow: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;

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
  gap: ${px2rem(12)} !important;
`;
