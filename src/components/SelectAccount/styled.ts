import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

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

  * {
    color: ${({ theme }) => theme['text-primary']};
  }

  :hover {
    border-color: ${({ theme }) => theme['border-secondary']};
  }
  display: flex;
  justify-content: space-between;
`;

const DropDownContainer = styled.div`
  width: 350px;
`;

const DropdownList = styled.div`
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

const DropdownItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${px2rem(32)};
  cursor: pointer;

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

export { Container, ContentBox, DropDownContainer, DropdownItem, DropdownList };
