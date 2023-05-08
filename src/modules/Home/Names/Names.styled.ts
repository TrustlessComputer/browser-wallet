import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding-bottom: 40px;
  padding-top: 40px;

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
  }

  .list {
    min-height: 60vh;
    width: 100%;

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none;

    ::-webkit-scrollbar {
      display: none; /* for Chrome, Safari, and Opera */
    }
  }

  .loading {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  .item {
    /* padding: 6px 12px !important; */
  }
`;

export { Container };
