import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Container = styled.div`
  margin-top: ${px2rem(24)};
  .form {
    display: flex;
    flex-direction: column;
    gap: ${px2rem(16)};
  }

  .confirm-btn {
    width: 100%;
    margin-top: ${px2rem(16)};

    .confirm-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
    }
  }
`;
