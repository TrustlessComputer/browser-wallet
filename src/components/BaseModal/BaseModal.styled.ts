import px2rem from '@/utils/px2rem';
import { Modal } from 'react-bootstrap';
import styled from 'styled-components';

export const StyledModal = styled(Modal)<{ width?: number }>`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg.third};
    --bs-modal-width: ${({ width }: { width?: number }) => px2rem(width || 500)};
  }

  .modal-content {
    border-radius: 2px;
    background: #1c1c1c;
    border-radius: ${px2rem(8)};
    padding: ${px2rem(32)};
    padding-top: ${px2rem(8)};
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  .modal-body {
    padding-top: ${px2rem(7)};
  }

  .modal-footer {
    border-top: none;
  }
`;

export const Title = styled.h5`
  margin-bottom: ${px2rem(24)};
  font-weight: 600;
  font-size: ${px2rem(24)};
  line-height: ${px2rem(34)};
  color: ${({ theme }) => theme.white};
`;
