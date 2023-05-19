import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  width: 100% !important;

  .input-container {
    display: flex;
    width: 100%;
    position: relative;
    flex-direction: column;
    align-items: center;

    width: 100% !important;
    max-width: ${px2rem(780)};

    .wrap-title {
      display: flex;
      align-self: flex-start;
    }
  }
`;

export { Content };
