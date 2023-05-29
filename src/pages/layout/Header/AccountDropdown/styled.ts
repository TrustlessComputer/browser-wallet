import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Element = styled.div``;

export const DropDownContainer = styled.div`
  .actions {
    display: flex;

    padding: ${px2rem(16)};
    padding-bottom: ${px2rem(4)};
    gap: ${px2rem(12)};
    margin-top: ${px2rem(12)};
    width: 100%;
  }

  .actions-border-top {
    border-top: ${px2rem(1)} solid ${({ theme }) => theme['text-four']};
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
  margin-top: ${px2rem(8)};
  margin-bottom: ${px2rem(16)};

  ::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;
