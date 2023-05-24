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
    min-height: ${px2rem(106)};
    background-color: ${({ theme }) => theme.bg['secondary']};
    border-radius: ${px2rem(8)};
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
      border-radius: ${px2rem(8)};
      cursor: pointer;
    }
  }

  .alert-wrapper {
    padding: ${px2rem(6)} ${px2rem(16)};
    border: 1px solid ${({ theme }) => theme['border-secondary']};
    border-radius: ${px2rem(8)};
  }
`;

export { Content };
