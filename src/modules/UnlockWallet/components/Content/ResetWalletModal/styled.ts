import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;

  .form-container {
    width: 100%;
    margin-top: ${px2rem(32)};

    .account {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${px2rem(12)};
      margin-top: ${px2rem(24)};
    }

    .loader {
      margin: ${px2rem(32)} auto auto;
      left: 0;
      right: 0;
      width: fit-content;
    }
  }
`;

export default Container;
