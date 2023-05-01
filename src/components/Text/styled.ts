import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

const BaseText = styled.p<{
  color: string | undefined;
  align: string;
  maxWidth: string | number;
}>`
  color: ${({ color, theme }) => (color ? (theme as any)[color] : theme['text-primary'])};
  text-align: ${({ align }) => align};
  max-width: ${({ maxWidth }) => maxWidth};
  line-height: 140%;

  // FONT-SIZE
  &.size-tini {
    font-size: ${px2rem(12)};
  }
  &.size-note {
    font-size: ${px2rem(14)};
  }
  &.size-body {
    font-size: ${px2rem(16)};
  }
  &.size-body-large {
    font-size: ${px2rem(18)};
  }
  &.size-h6 {
    font-size: ${px2rem(20)};
  }
  &.size-h5 {
    font-size: ${px2rem(24)};
  }
  &.size-h4 {
    font-size: ${px2rem(36)};
  }
  &.size-h3 {
    font-size: ${px2rem(40)};
  }
  &.size-h2 {
    font-size: ${px2rem(48)};
  }
  &.size-h1 {
    font-size: ${px2rem(56)};
  }
  &.size-d3 {
    font-size: ${px2rem(72)};
  }
  &.size-d2 {
    font-size: ${px2rem(96)};
  }
  &.size-d1 {
    font-size: ${px2rem(128)};
  }

  // FONT-WEIGHT
  &.weight-bold {
    font-weight: 700;
  }
  &.weight-semibold {
    font-weight: 600;
  }
  &.weight-medium {
    font-weight: 500;
  }
  &.weight-regular {
    font-weight: 400;
  }
  &.weight-light {
    font-weight: 300;
  }
`;

export { BaseText };
