import px2rem from '@/utils/px2rem';
import { Col, Row } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';

export const Container = styled(Row)``;

export const ImageContainer = styled(Col)`
  margin-top: ${px2rem(16)};

  .image {
    width: 96%;
    min-height: ${px2rem(100)};
    aspect-ratio: 1 / 1;
    height: auto;
    object-fit: cover;
  }

  .card-transfer-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${px2rem(6)};
    cursor: pointer;
    margin-top: ${px2rem(16)};
    width: fit-content;

    :hover {
      opacity: 0.8;
    }

    img {
      width: ${px2rem(20)};
      height: ${px2rem(20)};
    }

    p {
      font-weight: 500;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(26)};
      letter-spacing: 0.01em;

      color: ${({ theme }: { theme: DefaultTheme }) => theme['button-primary']};
    }
  }
`;

export const InfoContainer = styled(Col)`
  margin-top: ${px2rem(16)};

  .name-detail {
    margin-top: ${px2rem(28)};

    font-size: ${px2rem(20)};
    letter-spacing: -0.03em;
    color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
  }
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: ${px2rem(28)};
  line-height: ${px2rem(38)};
  color: ${({ theme }) => theme['text-primary']};
`;
