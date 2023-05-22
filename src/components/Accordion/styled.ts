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
    padding: 0 0 8px 0;
    border-radius: 4px;

    :hover {
      opacity: 0.8;
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
    padding-top ${px2rem(6)};
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
