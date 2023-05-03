import styled from 'styled-components';
import Spinner from '@/components/Spinner';
import { opacify } from '@/theme/utils';

const Container = styled.div<{ opacity: number }>`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, opacity }) => opacify(opacity, theme.bg.primary)};
`;

const LoadingContainer = ({ loaded, opacity = 60 }: { loaded: boolean; opacity?: number }) => {
  if (loaded) return null;

  return (
    <Container opacity={opacity}>
      <Spinner />
    </Container>
  );
};

export default LoadingContainer;
