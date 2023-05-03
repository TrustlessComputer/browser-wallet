import styled from 'styled-components';

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;

  .box {
    width: 100%;
    margin-top: 16px;
    min-height: 106px;
    padding: 24px;
    background: ${({ theme }) => theme.bg.secondary};
    border-radius: 8px;
    position: relative;

    .input-phrase {
      font-weight: 600;
      font-size: 18px;
      line-height: 140%;
      text-align: center;
      width: 100%;
      min-height: 86px;
      padding-top: 28px;
      color: ${({ theme }) => theme['text-primary']};
      word-break: break-word;
      background-color: transparent;
      border: none;
      resize: none;
    }
  }
`;

export { Content };
