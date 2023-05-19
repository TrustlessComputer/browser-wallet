import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  max-width: ${px2rem(1000)};
`;

const Dash = styled.div`
  border: 1px dashed ${({ theme }) => theme['border-primary']};
  flex: 1;
`;

export { Container, Dash };
