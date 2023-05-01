import styled from 'styled-components/macro';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: fit-content;
`;

export const LeftContainer = styled.div`
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme['border-primary']};
  cursor: pointer;

  :hover {
    border: 1px solid ${({ theme }) => theme.white};
  }
`;

export const CenterContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: fit-content;
`;
