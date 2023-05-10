import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Container = styled.div`
  margin-top: ${px2rem(24)};

  .name-detail {
    font-size: ${px2rem(20)};
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme['text-primary']};
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: ${px2rem(16)};
    margin-top: ${px2rem(12)};
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
