import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  display: flex;
  border-top: ${px2rem(1)} solid ${({ theme }) => theme['text-four']};

  padding: ${px2rem(16)};
  padding-bottom: ${px2rem(4)};
  gap: ${px2rem(12)};
  margin-top: ${px2rem(12)};
  width: 100%;

  .form-container {
    width: 100%;

    .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${px2rem(12)};
      margin-top: ${px2rem(12)};
    }
  }

  .create-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(12)};
    cursor: pointer;

    :hover {
      opacity: 0.8;
    }
  }
`;

export default Container;
