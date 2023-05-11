import styled from 'styled-components';
import px2rem from '@/utils/px2rem';

export const StyledButton = styled.button`
  border-width: 1px;
  border-radius: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &.underline {
    background-color: transparent;
    text-decoration: underline;
    border: none;
    color: ${({ theme }) => theme['button-primary']};
  }

  &.primary {
    background-color: ${({ theme }) => theme['button-primary']};
    color: ${({ theme }) => theme['text-parallel']};
  }

  &.outline {
    background-color: transparent;
    color: ${({ theme }) => theme['text-highlight']};
    border: 1px solid ${({ theme }) => theme['button-primary']};
  }

  &.small {
    padding: ${px2rem(11)} ${px2rem(16)};
    font-size: ${px2rem(16)};
  }

  &.normal {
    padding: ${px2rem(11)} ${px2rem(34)};
    font-size: ${px2rem(16)};
  }

  &.stretch {
    padding: ${px2rem(11)} ${px2rem(20)};
    width: 100%;
    font-size: ${px2rem(16)};
  }

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(1.01);
  }

  &:disabled {
    opacity: 0.6;
    transform: scale(1);
  }

  .spinner {
    margin-left: 24px;
  }
`;
