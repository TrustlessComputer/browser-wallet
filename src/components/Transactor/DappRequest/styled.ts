import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const Container = styled.div`
  margin-top: ${px2rem(24)};
  position: relative;
  .function-name {
    text-transform: uppercase;
  }
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

const ContentBox = styled.div`
  padding: 12px;
  background-color: ${({ theme }) => theme.bg.secondary};
  border-radius: 8px;
  margin-top: 6px;
  p {
    line-break: anywhere;
  }
  * {
    color: ${({ theme }) => theme['text-secondary']};
  }
`;

const Divider = styled.div`
  background-color: ${({ theme }) => theme.devider};
  height: 1px;
  width: 100%;
`;

export { Container, ButtonGroup, AdvanceWrapper, ContentBox, Divider };
