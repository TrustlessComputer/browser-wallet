import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';
import { Modal } from 'react-bootstrap';

export const StyledTransferModal = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg.third};
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  * {
    font-family: 'Bandeins Strange Variable' !important;
  }

  .label {
    font-size: ${px2rem(12)};
    font-weight: 500;
    margin-bottom: ${px2rem(6)};
    color: ${({ theme }) => theme.primary['5b']};
  }

  .divider {
    margin-top: ${px2rem(16)};
    margin-bottom: ${px2rem(16)};
    height: 1px;
    width: 100%;
    background: ${({ theme }) => theme.dark['5']};
  }

  .est-fee {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${px2rem(24)};
  }

  .est-fee-value {
    display: flex;
    align-items: center;
    gap: ${px2rem(14)};
  }

  .transfer-btn {
    width: 100%;
    margin-top: ${px2rem(8)};

    .transfer-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
    }
  }
`;

export const WrapInput = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${px2rem(16)};

  .title-input {
    font-weight: 500;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
    text-transform: uppercase;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.primary['5b']};
    margin-bottom: ${px2rem(4)};
  }

  .input {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: ${px2rem(12)};
    gap: ${px2rem(16)};
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};

    border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme['border-four']};

    :hover {
      border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.primary.brand};
    }
  }

  .error {
    font-weight: 400;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(24)};
    color: ${({ theme }: { theme: DefaultTheme }) => theme.red.A};
  }
`;
