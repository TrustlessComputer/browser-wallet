import React, { PropsWithChildren } from 'react';
import { StyledButton } from './Button.styled';
import { ButtonSizes, ButtonVariants } from '@/components/Button/button.type';
import cs from 'classnames';
import Spinner from '@/components/Spinner';
import ArrowRightIcon from '@/components/icons/ArrowRight';

export type ButtonProps = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  props?: HTMLButtonElement;
  type?: 'submit' | 'reset' | 'button' | undefined;
  variants?: ButtonVariants;
  sizes?: ButtonSizes;
  isLoading?: boolean;
  rightIcon?: React.ReactNode;
  isArrowRight?: boolean;
};

const Button = ({
  type,
  className,
  onClick,
  children,
  variants = 'primary',
  sizes = 'normal',
  isLoading = false,
  rightIcon,
  isArrowRight,
  ...props
}: PropsWithChildren<ButtonProps>) => {
  return (
    <StyledButton type={type} className={cs(className, variants, sizes)} onClick={onClick} {...props}>
      {children}
      {!!rightIcon && rightIcon}
      {isArrowRight && <ArrowRightIcon />}
      {isLoading && <Spinner size={24} className="spinner" />}
    </StyledButton>
  );
};

export default Button;
