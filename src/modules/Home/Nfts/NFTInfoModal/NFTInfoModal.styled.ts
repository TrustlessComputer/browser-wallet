import px2rem from '@/utils/px2rem';
import { Col, Row } from 'react-bootstrap';
import styled, { DefaultTheme } from 'styled-components';

export const BackHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${px2rem(6)};
  cursor: pointer;
  width: fit-content;

  p {
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: 150%;
    color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
  }

  :hover {
    opacity: 0.8;
  }
`;

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

  .list-container {
    padding-top: ${px2rem(16)};
    padding-bottom: ${px2rem(8)};

    .list-name {
      margin-bottom: ${px2rem(12)};
      font-weight: 400;
      font-size: ${px2rem(16)};
      line-height: ${px2rem(26)};
      letter-spacing: -0.01em;
      color: ${({ theme }: { theme: DefaultTheme }) => theme['text-five']};
    }
  }

  .properties-item {
    background-color: ${({ theme }: { theme: DefaultTheme }) => theme.bg.secondary};
    border-radius: ${px2rem(8)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: ${px2rem(88)};
  }

  .properties-trait-type {
    font-weight: 400;
    font-size: ${px2rem(12)};
    text-transform: uppercase;
    color: ${({ theme }: { theme: DefaultTheme }) => theme['button-primary']};
    text-align: center;
  }

  .properties-trait-value {
    font-weight: 500;
    font-size: ${px2rem(14)};
    line-height: 140%;
    margin-top: ${px2rem(4)};
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    color: ${({ theme }: { theme: DefaultTheme }) => theme['text-primary']};
  }
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: ${px2rem(28)};
  line-height: ${px2rem(38)};
  color: ${({ theme }) => theme['text-primary']};
`;
