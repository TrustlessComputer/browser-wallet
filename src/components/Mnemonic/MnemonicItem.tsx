import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Text from '@/components/Text';

const Container = styled.button`
  box-sizing: border-box;

  width: 160px;
  height: 40px;

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 11px 16px 10px 12px;
  gap: 8px;

  border: 1px solid ${({ theme }) => theme['border-primary']};
  border-radius: 8px;

  :hover {
    outline: none !important;
    border: 1px solid ${({ theme }) => theme['button-primary']};
    cursor: pointer;
  }

  :disabled {
    :hover {
      opacity: 1;
      border: 1px solid blue;
      cursor: default;
    }
    :active {
      background: transparent;
    }
  }

  &.selected-color {
    background-color: ${({ theme }) => theme.bg['secondary']};
  }

  &.none-selected-color {
    background-color: transparent;
  }
`;

const TitleText = styled(Text)`
  flex: none;
  order: 1;
  flex-grow: 0;
`;

interface MnemonicItemProps {
  index: number;
  title: string;
  disabled?: boolean;
  onClick?: () => void;
}

const MnemonicItem = (props: MnemonicItemProps) => {
  const { index = 1, title = '', disabled = true, onClick = () => {} } = props;
  const [selected, setSelected] = useState(false);

  const isSelected = selected && !disabled;

  const onClickItem = () => {
    setSelected(!selected);
    onClick && onClick();
  };

  return (
    <Container
      disabled={disabled}
      onClick={onClickItem}
      className={`${isSelected ? 'selected-color' : 'none-selected-color'}`}
    >
      <Text align="left" color="text-secondary">
        #{index + 1}
      </Text>
      <TitleText>{title}</TitleText>
    </Container>
  );
};

export default MnemonicItem;
