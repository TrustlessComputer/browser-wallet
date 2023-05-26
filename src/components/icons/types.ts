import { ColorsTheme } from '@/theme/colors';

interface IWrapSVGProps {
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  type?: string;
  color?: keyof ColorsTheme;
  onClick?: () => void;
}

export type { IWrapSVGProps };
