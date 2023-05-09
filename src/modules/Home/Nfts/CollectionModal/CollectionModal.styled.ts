import px2rem from '@/utils/px2rem';
import { Col, Row } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';

export const WrapContainer = styled(Col)``;

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

export const SubTitle = styled.p`
  font-weight: 400;
  font-size: ${px2rem(18)};
  line-height: ${px2rem(28)};
  letter-spacing: -0.03em;

  color: ${({ theme }) => theme['text-four']};

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 6; /* number of lines to show */
  line-clamp: 6;
  -webkit-box-orient: vertical;
`;

export const ItemsContainer = styled.div`
  margin-top: ${px2rem(40)};
  display: flex;
  flex-direction: column;
  justify-content: center;

  .title {
    height: ${px2rem(46)};
    border-bottom: 2px solid ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
    width: 100%;

    p {
      font-weight: 700;
      font-size: ${px2rem(24)};
      line-height: ${px2rem(30)};
      text-align: center;
      color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  justify-items: center;
  margin-top: ${px2rem(32)};
  grid-gap: ${px2rem(24)};
  grid-template-columns: repeat(3, 1fr);

  @media screen and (max-width: 820px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 568px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
