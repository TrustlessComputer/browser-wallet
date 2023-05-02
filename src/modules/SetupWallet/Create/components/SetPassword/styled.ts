import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;

  .box {
    display: flex;
    width: 100%;
    min-height: 106px;
    background-color: ${({ theme }) => theme.bg['secondary']};
    border-radius: 8px;
    padding: ${px2rem(32)};
    position: relative;
    align-items: center;
    justify-content: center;
    .overlay {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.98;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(1px);
      background-color: ${({ theme }) => theme.bg['secondary']};
      border-radius: 8px;
    }
  }
`;

export { Content };
