import React, { useMemo } from 'react';
import { createGlobalStyle, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { getTheme } from '@/theme/index';
import px2rem from '@/utils/px2rem';

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

    // margin bottom
    .mb-12 {
      margin-bottom: ${px2rem(12)};
    }
    .mb-16 {
      margin-bottom: ${px2rem(16)};
    }
    .mb-24 {
      margin-bottom: ${px2rem(24)};
    }
    .mb-32 {
      margin-bottom: ${px2rem(32)};
    }
    .mb-48 {
      margin-bottom: ${px2rem(48)};
    }
    .mb-60 {
      margin-bottom: ${px2rem(60)};
    }
    
    // margin top
    .mt-12 {
      margin-top: ${px2rem(12)};
    }
    .mt-16 {
      margin-top: ${px2rem(16)};
    }
    .mt-24 {
      margin-top: ${px2rem(24)};
    }
    .mt-32 {
      margin-top: ${px2rem(32)};
    }
    .mt-48 {
      margin-top: ${px2rem(48)};
    }
    .mt-60 {
      margin-top: ${px2rem(60)};
    }
    
    // margin left
    .ml-12 {
      margin-left: ${px2rem(12)};
    }
    .ml-16 {
      margin-left: ${px2rem(16)};
    }
    .ml-24 {
      margin-left: ${px2rem(24)};
    }
    .ml-32 {
      margin-left: ${px2rem(32)};
    }
    .ml-48 {
      margin-left: ${px2rem(48)};
    }
    .ml-60 {
      margin-left: ${px2rem(60)};
    }
    
    // margin left
    .mr-12 {
      margin-right: ${px2rem(12)};
    }
    .mr-16 {
      margin-right: ${px2rem(16)};
    }
    .mr-24 {
      margin-right: ${px2rem(24)};
    }
    .mr-32 {
      margin-right: ${px2rem(32)};
    }
    .mr-48 {
      margin-right: ${px2rem(48)};
    }
    .mr-60 {
      margin-right: ${px2rem(60)};
    }
}

  summary::-webkit-details-marker {
    display:none;
  }
`;
