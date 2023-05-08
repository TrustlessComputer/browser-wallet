import { darkTheme, lightTheme } from '@/theme/colors';
import { css } from 'styled-components';

export const BREAKPOINTS = {
  xs: '396px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
  xxxl: '1920px',
};

const fonts = {
  code: 'serif',
};

const fontSizes = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
  h1: '40px',
  h3: '34px',
  h5: '24px',
  h6: '20px',
};

function getSettings() {
  return {
    grids: {
      xs: '4px',
      sm: '8px',
      md: '12px',
      lg: '24px',
      xl: '32px',
    },
    fonts,
    breakpoint: BREAKPOINTS,
    fontSizes,
  };
}

type MediaWidthsType = typeof BREAKPOINTS;
type MediaWidthsKeysType = keyof MediaWidthsType;

export const MediaQueryBuilder = (key: MediaWidthsKeysType, innerCSS?: any) =>
  css`
    @media (max-width: ${BREAKPOINTS[key]}) {
      ${innerCSS};
    }
  `;

export function getTheme(darkMode: boolean) {
  return {
    darkMode,
    ...(darkMode ? darkTheme : lightTheme),
    ...getSettings(),
  };
}
