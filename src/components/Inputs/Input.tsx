import React, { HTMLInputTypeAttribute, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';
import { PasswordIcon } from '@/components/icons';
import Text from '@/components/Text';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
  height: 52px;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme['text-primary']};
  border: 1px solid ${({ theme }) => theme['border-primary']};

  :focus {
    border-color: ${({ theme }) => theme['border-secondary']};
  }
  :hover {
    outline: none !important;
    border-color: ${({ theme }) => theme['border-secondary']};
  }

  .input-container-style {
    flex: 1;
    font-weight: 400;
    font-size: 16px;
    line-height: 140%;
    color: ${({ theme }) => theme['text-primary']};
  }

  .icon-container {
    position: relative;
    width: 30px;
    height: 30px;
    margin-left: 20px;
    justify-content: center;
    align-items: center;
    :hover {
      opacity: 0.8;
      cursor: pointer;
    }
  }
`;

interface InputProps {
  value: string;
  type: 'text' | 'password';
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  refInput?: any;
  classContainer?: string | undefined;
  classInputWrapper?: string | undefined;
  classInput?: string | undefined;
  title?: string | undefined;
}

const Input = (props: InputProps) => {
  const {
    type = 'text',
    value = '',
    placeholder = '',
    onChange = () => {},
    onKeyDown = () => {},
    refInput,
    classContainer,
    classInputWrapper,
    classInput,
    title,
  } = props;

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<HTMLInputTypeAttribute | undefined>(type);
  const inputTypeInit = useRef<string>(type);

  useEffect(() => {
    inputTypeInit.current = type;
  }, []);

  const onClick = () => {
    setShowPassword(!showPassword);
    setCurrentType(currentType === 'text' ? 'password' : 'text');
  };

  return (
    <Container className={classContainer}>
      {!!title && (
        <Text style={{ textTransform: 'uppercase' }} fontWeight="medium" color="text-secondary" className="mb-8">
          {title}
        </Text>
      )}
      <InputWrapper className={classInputWrapper}>
        <input
          ref={refInput}
          className={`input-container-style ${classInput}`}
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        {inputTypeInit.current === 'password' && (
          <div className="icon-container" onClick={onClick}>
            <PasswordIcon isShow={showPassword} />
          </div>
        )}
      </InputWrapper>
    </Container>
  );
};

export default Input;
