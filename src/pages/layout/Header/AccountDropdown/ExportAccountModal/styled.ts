import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;

  .form-container {
    width: 100%;

    .account {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: ${px2rem(16)} ${px2rem(20)};
      gap: ${px2rem(6)};
      background: ${({ theme }) => theme.bg.secondary};
      border-radius: ${px2rem(8)};
    }

    .box-key {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: ${px2rem(16)} ${px2rem(20)};
      gap: ${px2rem(6)};
      background: ${({ theme }) => theme.bg.secondary};
      border-radius: ${px2rem(8)};
      cursor: pointer;
      .key-text {
        line-break: anywhere;
      }
    }

    .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${px2rem(12)};
      margin-top: ${px2rem(32)};
    }
  }
`;

export default Container;
