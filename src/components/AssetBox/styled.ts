import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  border: 1px solid ${({ theme }) => theme['border-primary']};
  padding: ${px2rem(8)} ${px2rem(12)};
  border-radius: 8px;
  .box-center {
    gap: 4px;
    margin-left: ${px2rem(12)};
    .text {
      text-transform: uppercase;
    }
  }
  .box-end {
    display: flex;
    gap: 12px;
    margin-left: ${px2rem(32)};
    cursor: pointer;
    align-items: center;
    height: fit-content;
    padding-top: ${px2rem(4)};

    :hover {
      opacity: 0.8;
    }
  }
`;

export default Container;
