import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledTransaction = styled.div`
  .spinner {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  .transactions {
    height: 100vh;
  }
  .header-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;

    padding: ${px2rem(24)} ${px2rem(48)};
    background-color: #2e2e2e;
    margin-bottom: ${px2rem(32)};

    gap: ${px2rem(24)};

    .process-btn {
      padding: 12px 32px;
      border-radius: 4px;
      font-size: ${px2rem(16)};
      font-weight: 600;
    }
  }

  .loading {
    min-height: ${px2rem(200)};
    width: 100%;
    display: grid;
    place-items: center;
  }

  .resume-btn {
    padding: 6px 16px;
    border-radius: 4px;
    font-size: ${px2rem(14)};
    font-weight: 500;
  }

  .status-container {
    display: flex;
    justify-content: flex-end;
  }

  .status {
    text-transform: capitalize;

    &.confirmed {
      color: #00aa6c;
      text-decoration: underline;
    }
    &.success {
      color: #00aa6c;
      text-decoration: underline;
    }
    &.processing {
      color: #4185ec;
      text-decoration: underline;
    }
    &.pending {
      color: ${({ theme }: { theme: DefaultTheme }) => theme.yellow.B};
    }
  }

  .tableData_item {
    padding-top: ${px2rem(13)};
    padding-bottom: ${px2rem(13)};
    vertical-align: middle;
    font-weight: 500;
  }

  .tx-wrapper {
    display: flex;
    gap: ${px2rem(6.5)};
    align-items: center;

    .icCopy {
      width: ${px2rem(15)};
      height: ${px2rem(15)};
      cursor: pointer;
      position: relative;

      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }

  .tx-link {
    color: #b1e3ff;
  }

  .table {
    th:nth-child(5),
    td:nth-child(5),
    th:nth-child(6),
    td:nth-child(6) {
      text-align: right;
    }
  }
  .pending {
    color: ${({ theme }) => theme['text-highlight']};
  }
  .success {
    color: ${({ theme }) => theme.green.B};
  }
  .failed {
    color: ${({ theme }) => theme.red.A};
  }
  .waiting {
    color: ${({ theme }) => theme.blue.B};
    text-decoration: underline;
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  }
  .processing {
    color: ${({ theme }) => theme.blue.B};
  }
  a {
    font-weight: 500 !important;
  }
`;

const HashWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${px2rem(18)};
  .row {
    display: flex;
    flex-direction: row;
    align-items: center;
    .title {
      min-width: 35px;
      width: fit-content;
    }
    a {
      width: fit-content;
    }
    .ic-copy {
      width: ${px2rem(20)};
      height: ${px2rem(20)};
      cursor: pointer;
      position: relative;
      justify-content: center;
      display: flex;

      :hover {
        opacity: 0.8;
      }
    }
  }
`;

export { HashWrapper };
