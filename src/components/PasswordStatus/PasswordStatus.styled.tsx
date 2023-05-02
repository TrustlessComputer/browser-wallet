import styled from 'styled-components/macro';

import { PasswordStatusType } from './PasswordStatus';

export const Container = styled.div<{ type?: PasswordStatusType }>`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 80%;

  .text {
    font-weight: 400;
    font-size: 12px;
    line-height: 148%;
  }

  .text-status {
    font-weight: 700;

    color: ${({ theme, type }) => {
      switch (type) {
        case PasswordStatusType.veryWeak:
          return theme.red.A;
        case PasswordStatusType.strong:
          return theme.green.B;
        default:
          return theme.yellow.B;
      }
    }};
  }
`;
