import styled from 'styled-components/macro';
import { BREAKPOINTS } from '@/theme';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: ${px2rem(32)};
  padding-right: ${px2rem(32)};
`;

export const StepItem = styled.div<{
  isSelected: boolean;
  isVerify: boolean;
  hideIndicatorLeft: boolean;
  hideIndicatorRight: boolean;
}>`
  flex: 1;
  .content {
    display: flex;
    flex-direction: column;
    .indicator-container {
      display: flex;
      flex: 1;
      flex-direction: row;
      align-items: center;
      .indicator-left {
        height: 1px;
        flex: 1;
        background-color: ${({ theme, hideIndicatorLeft, isVerify, isSelected }) =>
          hideIndicatorLeft ? 'transparent' : isVerify || isSelected ? theme['button-primary'] : theme.dark['60']};
      }
      .indicator-right {
        height: 1px;
        flex: 1;
        background-color: ${({ theme, hideIndicatorRight, isVerify }) =>
          isVerify ? theme['button-primary'] : hideIndicatorRight ? 'transparent' : theme.dark['60']};
      }
      .number-container {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        background-color: ${({ theme, isSelected, isVerify }) =>
          isSelected || isVerify ? theme['button-primary'] : theme['bg'].secondary};
        display: flex;
        align-items: center;
        justify-content: center;
        .number {
          font-weight: 600;
          font-size: 16px;
          line-height: 140%;
          text-align: center;
          color: ${({ theme, isSelected, isVerify }) =>
            isSelected || isVerify ? theme['text-parallel'] : theme['text-secondary']};
        }
      }
    }

    .title {
      font-weight: 600;
      font-size: 14px;
      line-height: 140%;
      text-align: center;
      padding-left: 16px;
      padding-right: 16px;
      margin-top: 16px;
      color: ${({ theme, isSelected, isVerify }) =>
        isSelected || isVerify ? theme['text-highlight'] : theme['text-secondary']};
    }
  }

  @media screen and (min-width: ${BREAKPOINTS.md}) {
    .content {
      .title {
        padding-left: 4px;
        padding-right: 4px;
      }
    }
  }
`;
