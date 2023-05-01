import React, { CSSProperties, PropsWithChildren, useRef } from 'react';
import cs from 'classnames';
import { BaseText } from '@/components/Text/styled';
import { ColorsTheme } from '@/theme/colors';

type TText = {
  fontWeight?: 'bold' | 'semibold' | 'medium' | 'regular' | 'light';
  style?: CSSProperties;
  size?: 'tini' | 'note' | 'body' | 'body-large' | 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1' | 'd3' | 'd2' | 'd1';
  align?: 'center' | 'left' | 'right' | 'unset';
  color?: keyof ColorsTheme;
  className?: string;
  maxWidth?: CSSProperties['maxWidth'];
  onClick?: () => void;
};

const Text = ({
  children,
  fontWeight = 'regular',
  size = 'body',
  align = 'unset',
  style,
  color,
  className,
  maxWidth = 'none',
  onClick,
  ...props
}: PropsWithChildren<TText>) => {
  const comp = useRef<any>(null);
  return (
    <BaseText
      {...props}
      ref={comp}
      className={cs(`size-${size}`, `weight-${fontWeight}`, className)}
      color={color}
      align={align}
      maxWidth={maxWidth}
      style={{ ...style }}
      onClick={onClick}
    >
      {children}
    </BaseText>
  );
};

export default Text;
