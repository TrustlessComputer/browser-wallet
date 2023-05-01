import { DefaultTheme } from 'styled-components';

export const colors = {
  white: '#FFFFFF',
  black: '#000000',

  dark: {
    '120': '#010101',
    '110': '#0F0F0F',
    '100': '#1C1C1C',
    '80': '#2E2E2E',
    '60': '#5B5B5B',
    '40': '#898989',
    '20': '#B6B6B6',
    '10': '#CECECE',
    '5': '#ECECED',
  },

  light: {
    '100': '#FFFFFF',
    '80': '#FAFAFA',
    '60': '#F4F4F4',
    '40': '#EFEFEF',
    '20': '#E9E9E9',
    '10': '#E7E7E7',
    '5': '#E5E5E5',
  },

  blue: {
    A: '#A8C5DA',
    B: '#B1E3FF',
  },

  green: {
    A: '#A1E3CB',
    B: '#BAEDBD',
  },

  yellow: {
    A: '#FFE899',
    B: '#F9D03F',
    C: '#FFAA59',
  },

  red: {
    A: '#FF4747',
    B: '#FF8B8B',
  },
};

export type ColorsTheme = DefaultTheme;

const commonTheme = {
  ...colors,
  white: colors.white,
  black: colors.black,
  // colors system
};

export const darkTheme = {
  ...commonTheme,

  // text
  'text-primary': colors.light['100'],
  'text-secondary': colors.dark['10'],
  'text-highlight': colors.yellow['A'],
  'text-parallel': colors.dark['100'],

  // button
  'button-primary': colors.yellow['A'],

  // border
  'border-primary': colors.dark['60'],
  'border-secondary': colors.yellow['A'],

  bg: {
    primary: colors.dark['110'],
    secondary: colors.dark['80'],
  },

  card: {
    primary: colors.dark['120'],
    secondary: colors.dark['110'],
  },
};

export const lightTheme = {
  ...commonTheme,

  // text
  'text-primary': colors.dark['100'],
  'text-secondary': colors.dark['60'],
  'text-highlight': colors.yellow['A'],
  'text-parallel': colors.dark['100'],

  // button
  'button-primary': colors.yellow['C'],

  // border
  'border-primary': colors.dark['10'],
  'border-secondary': colors.yellow['C'],

  bg: {
    primary: colors.white,
    secondary: colors.light['80'],
  },

  card: {
    primary: colors.dark['120'],
    secondary: colors.light['80'],
  },
};
