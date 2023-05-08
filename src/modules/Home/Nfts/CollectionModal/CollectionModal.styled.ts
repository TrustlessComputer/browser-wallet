import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${px2rem(16)};
`;
