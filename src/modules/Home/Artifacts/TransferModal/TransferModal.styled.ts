import px2rem from '@/utils/px2rem';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

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
`;

export const TransferContainer = styled(Col)`
  margin-top: ${px2rem(16)};

  .form {
    display: flex;
    flex-direction: column;
    gap: ${px2rem(16)};
    margin-top: ${px2rem(28)};
  }

  .confirm-btn {
    width: 100%;
    margin-top: ${px2rem(16)};

    .confirm-text {
      padding-top: ${px2rem(11)};
      padding-bottom: ${px2rem(11)};
    }
  }
`;

export const Title = styled.p`
  font-weight: 600;
  font-size: ${px2rem(28)};
  line-height: ${px2rem(38)};
  color: ${({ theme }) => theme['text-primary']};
`;
