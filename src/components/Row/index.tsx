import styled from 'styled-components';

const Row = styled.div<{
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  gap?: string;
}>`
  width: ${({ width }) => width ?? '100%'};
  display: flex;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  gap: ${({ gap }) => gap};
  padding: 0;
`;

export { Row };
