import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
`;

const Dash = styled.div`
  border: 1px dashed ${({ theme }) => theme['border-primary']};
  flex: 1;
`;

export { Container, Dash };
