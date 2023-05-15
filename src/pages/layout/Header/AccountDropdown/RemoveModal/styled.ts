import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;

  .form-container {
    width: 100%;
    margin-top: ${px2rem(32)};

    .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${px2rem(12)};
      margin-top: ${px2rem(24)};
    }
  }
`;

export default Container;
