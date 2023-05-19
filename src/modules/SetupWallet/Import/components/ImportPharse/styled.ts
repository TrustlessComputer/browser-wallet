import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: ${px2rem(800)};

  .box {
    display: flex;
    width: 100%;
    min-height: ${px2rem(106)};
    background-color: ${({ theme }) => theme.bg['secondary']};
    border-radius: ${px2rem(8)};
    padding: ${px2rem(32)};
    position: relative;
    align-items: center;
    justify-content: center;

    .input-phrase {
      font-weight: 50;
      font-size: ${px2rem(20)};
      text-align: center;
      width: 100%;
      min-height: ${px2rem(86)};
      padding-top: ${px2rem(28)};
      color: ${({ theme }) => theme['text-primary']};
      word-break: break-word;
      background-color: transparent;
      border: none;
      resize: none;
    }
  }
`;

export { Content };
