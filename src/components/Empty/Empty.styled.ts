import styled from 'styled-components';

export const StyledEmpty = styled.div<{ isTable: boolean }>`
  &.notFound {
    display: grid;
    place-items: center;
    position: relative;
    &_image {
      margin-bottom: rem(32px);
    }

    .link {
      color: ${({ theme }) => theme['text-highlight']};
    }
  }
`;
