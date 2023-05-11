import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  margin-top: ${px2rem(16)};
  margin-bottom: ${px2rem(16)};
  .sub-text {
    color: ${({ theme }) => theme['text-secondary']};
    font-size: ${px2rem(14)};
  }
  .error-text {
    color: ${({ theme }) => theme['red'].A};
    margin-top: ${px2rem(12)};
  }
`;

export { Container };
