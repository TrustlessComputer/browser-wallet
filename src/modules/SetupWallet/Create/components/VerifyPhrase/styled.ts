import styled, { css } from 'styled-components';
import { MediaQueryBuilder } from '@/theme';
import px2rem from '@/utils/px2rem';

const MediaMedium = css`
  .mnemonic-box {
    width: 100%;
  }
  .box {
    width: 100%;
  }

  .submit-btn {
    width: 100% !important;
  }
`;

const Content = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  margin: auto;

  .mnemonic-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 70%;
    gap: 12px;
  }

  .box {
    min-height: 106px;
    border-radius: 8px;
    padding: ${px2rem(24)} ${px2rem(32)};
    display: flex;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.bg.secondary};
    width: 70%;
  }

  .submit-btn {
    width: 70% !important;
  }

  ${MediaQueryBuilder('md', MediaMedium)}
`;

const MnemonicItemWrapper = styled.div`
  margin-bottom: 8px;
`;

export { Content, MnemonicItemWrapper };
