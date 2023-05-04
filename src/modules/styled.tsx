import styled from 'styled-components';

const MDContainer = styled.div<{
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
  flex-direction: column;
  align-items: ${({ align }) => align ?? 'center'};
  justify-content: ${({ justify }) => justify ?? 'flex-start'};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  gap: ${({ gap }) => gap};
`;

export { MDContainer };
