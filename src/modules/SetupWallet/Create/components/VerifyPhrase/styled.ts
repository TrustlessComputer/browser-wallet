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
    max-width: ${px2rem(828)};
    gap: ${px2rem(8)};
  }

  .box {
    min-height: 106px;
    border-radius: ${px2rem(8)};
    /* padding: ${px2rem(24)} ${px2rem(32)}; */
    display: flex;
    flex-wrap: wrap;
    position: relative;
    align-items: center;
    justify-content: center;
    background: ${({ theme }) => theme.bg.secondary};
    width: 100%;
    max-width: ${px2rem(780)};
    margin-left: ${px2rem(8)};
    margin-right: ${px2rem(8)};
  }

  .submit-btn {
    width: 100% !important;
    max-width: ${px2rem(780)};
  }

  ${MediaQueryBuilder('md', MediaMedium)}
`;

const MnemonicItemWrapper = styled.div`
  margin-bottom: ${px2rem(8)};
`;

export { Content, MnemonicItemWrapper };
