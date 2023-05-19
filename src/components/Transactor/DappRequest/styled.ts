import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: ${px2rem(24)};
  position: relative;
  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(24)};
`;

const AdvanceWrapper = styled.div`
  .box {
    background-color: ${({ theme }) => theme.bg.secondary};
    padding: 12px;
    border-radius: 8px;
    p {
      line-break: anywhere;
    }
  }
`;

export { Container, ButtonGroup, AdvanceWrapper };
