import React, { useMemo } from 'react';
import { createGlobalStyle, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { getTheme } from '@/theme/index';
import { ScreenMarginTop } from '@/theme/css/margin.top';
import { ScreenMarginBottom } from '@/theme/css/margin.bottom';
import { ScreenMarginLeft } from '@/theme/css/margin.left';
import { ScreenMarginRight } from '@/theme/css/margin.right';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = true;
  const themeObject = useMemo(() => getTheme(darkMode), [darkMode]);
  return <StyledComponentsThemeProvider theme={themeObject}>{children}</StyledComponentsThemeProvider>;
}

export const ThemedGlobalStyle = createGlobalStyle`
  html{
    font-size: 16px;
    background-color:  ${({ theme }) => theme.bg.primary};
    color: ${({ theme }) => theme['text-primary']};
    letter-spacing: 0.01em;
    
    @media screen and (min-width: 1920px) {
      font-size: 18px;
    }

    @media screen and (min-width: 2048px) {
      font-size: 20px;
    }

    a{
      color: inherit;
      text-decoration: none;

      &:hover{
        color: inherit;
        text-decoration: underline;
      }
    }

    ${ScreenMarginTop}
    ${ScreenMarginBottom}
    ${ScreenMarginLeft}
    ${ScreenMarginRight}
}

  summary::-webkit-details-marker {
    display:none;
  }
`;
