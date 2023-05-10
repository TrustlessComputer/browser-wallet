import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import px2rem from '@/utils/px2rem';

const Container = styled.div``;

const Content = styled(Row)`
  gap: ${px2rem(12)};
  --bs-gutter-x: 0;
`;

const ItemWrapper = styled(Col)<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme['border-secondary'] : theme['border-primary'])};
  border-radius: ${px2rem(8)};
  padding-top: ${px2rem(12)};
  padding-bottom: ${px2rem(12)};
  cursor: pointer;
  position: relative;

  :hover {
    border: 1px solid ${({ theme }) => theme['border-secondary']};
  }

  .price {
    margin-top: ${px2rem(16)};
    font-size: ${px2rem(20)};
    text-align: center;
  }

  .vbyte {
    margin-top: ${px2rem(8)};
    font-weight: 400;
    line-height: 140%;
    text-align: center;
    color: ${({ theme }) => theme['text-secondary']};
  }

  .custom-input {
    margin-top: ${px2rem(16)};
    font-size: ${px2rem(16)};
    color: ${({ theme }) => theme['text-primary']};
    text-align: center;
    align-self: center;

    padding-top: ${px2rem(4)};
    padding-bottom: ${px2rem(4)};

    margin-left: ${px2rem(16)};
    margin-right: ${px2rem(16)};
    margin-bottom: ${px2rem(8)};

    max-width: ${px2rem(68)};

    border: 1px solid ${({ theme }) => theme['border-primary']};
  }
`;

export { Container, Content, ItemWrapper };
