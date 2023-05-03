import { FC } from 'react';
import SVG from 'react-inlinesvg';
import { StyledIconSVG } from './IconSVG.styled';

export type IconSVGProps = {
  src: string;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
  type?: string;
  color?: string;
  onClick?: (e: any) => void;
};

const IconSVG: FC<IconSVGProps> = ({
  src,
  className = '',
  maxWidth = '',
  maxHeight = '',
  type = '',
  color = '',
  onClick,
}) => {
  return (
    <StyledIconSVG
      className={className}
      maxWidth={maxWidth}
      maxHeight={maxHeight}
      type={type}
      color={color}
      onClick={onClick}
    >
      <SVG src={src} />
    </StyledIconSVG>
  );
};

export default IconSVG;
