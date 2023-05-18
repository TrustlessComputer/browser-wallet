import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: ${px2rem(24)};
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(24)};
`;
export { Container, ButtonGroup };
