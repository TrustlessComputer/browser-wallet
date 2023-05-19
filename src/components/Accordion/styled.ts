import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

const Container = styled.div`
  background-color: transparent;

  .accordion_item {
    border: none;
  }

  .accordion {
    --bs-accordion-bg: transparent;
  }

  .accordion_header {
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.bg.secondary};
    border-radius: 4px;

    :hover {
      opacity: 0.8;
    }

    p {
      font-size: ${px2rem(16)};
    }

    button {
      padding: 0;
      border: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: transparent;
      box-shadow: none;

      &:focus {
        box-shadow: none;
        border-color: rgb(0 0 0 / 12.5%);
      }

      &::after {
        display: none;
      }
    }
  }

  .accordion_body {
    padding-left: 0;
    padding-right: 0;
    padding-top ${px2rem(18)};
    padding-bottom: ${px2rem(12)};
  }
`;

const AccordionIcon = styled.div`
  width: ${px2rem(28)};
  height: ${px2rem(28)};
  display: grid;
  place-items: center;
  border-radius: 50%;
`;

export { Container, AccordionIcon };
