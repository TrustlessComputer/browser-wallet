import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div<{ size: number }>`
  width: ${({ size }) => px2rem(size)};
  height: ${({ size }) => px2rem(size)};
  color: ${({ theme }) => theme['button-primary']};
  position: relative;
  display: inline-block;
  border: 5px solid;
  border-radius: 50%;
  border-right-color: #5a5a5a;
  animation: rotate 1.2s linear infinite; }

  @keyframes rotate {
    0% {
      transform: rotate(0); 
    }
    100% {
      transform: rotate(360deg); 
    } 
  }
`;

export { Container };
