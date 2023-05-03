import styled from 'styled-components';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import px2rem from '@/utils/px2rem';

const PopoverWrapper = styled(Popover)<{ width?: number }>`
  background-color: ${({ theme }) => theme.bg.secondary};
  border: 1px solid ${({ theme }) => theme['border-primary']};
  width: ${({ width }) => width || 200}px;
  border-radius: 8px;
  padding: ${px2rem(12)} ${px2rem(16)};

  &.popover {
    .popover-arrow {
      width: 100%;
      transform: translate(0px, 0px) !important;
      background: transparent !important;
    }

    .popover-arrow::after {
      width: 100%;
      border-bottom-color: transparent !important;
      background: transparent !important;
    }
    .popover-arrow::before {
      width: 100%;
      border-bottom-color: transparent !important;
      background: transparent !important;
    }
  }
`;

const OverlayWrapper = styled(OverlayTrigger)``;

const IconWrapper = styled.div`
  background: ${({ theme }) => theme.bg.third};
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
`;

export { PopoverWrapper, OverlayWrapper, IconWrapper };
