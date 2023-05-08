import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledTokenProfile = styled.div`
  .table {
    th:nth-child(4),
    td:nth-child(4),
    th:nth-child(5),
    td:nth-child(5),
    th:nth-child(6),
    td:nth-child(6) {
      text-align: right;
    }

    th:nth-child(6),
    td:nth-child(6) {
      max-width: ${px2rem(80)};
    }

    th {
      padding-left: ${px2rem(12)};
      padding-right: ${px2rem(12)};
    }

    td {
      padding-top: ${px2rem(26)};
      padding-bottom: ${px2rem(26)};
      padding-left: ${px2rem(12)};
      padding-right: ${px2rem(12)};
      vertical-align: middle;
    }
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .transfer-button {
    margin-left: auto;
    /* margin-right: auto; */
  }
`;
