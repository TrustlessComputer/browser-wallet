import styled from 'styled-components/macro';
import px2rem from '@/utils/px2rem';
import { AlertMessageType } from './AlertMessage';

export const Container = styled.div<{ type: AlertMessageType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  border: 1px solid
    ${({ theme, type }) => {
      switch (type) {
        case AlertMessageType.error:
          return theme.red.A;
        case AlertMessageType.success:
          return theme.green.A;
        default:
          return theme.yellow.B;
      }
    }} !important;

  border-radius: ${px2rem(8)};
  padding: ${px2rem(8)} ${px2rem(16)};
  gap: ${px2rem(8)};

  .text-warning {
    color: ${({ theme, type }) => {
      switch (type) {
        case AlertMessageType.error:
          return theme.red.A;
        case AlertMessageType.success:
          return theme.green.A;
        default:
          return theme.yellow.B;
      }
    }} !important;
  }
`;
