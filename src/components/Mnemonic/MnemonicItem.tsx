import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Text from '@/components/Text';
import px2rem from '@/utils/px2rem';

const Container = styled.button`
  box-sizing: border-box;

  min-width: ${px2rem(160)};
  height: ${px2rem(40)};

  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${px2rem(11)} ${px2rem(16)} ${px2rem(10)} ${px2rem(12)};
  gap: ${px2rem(8)};

  border: 1px solid ${({ theme }) => theme['border-primary']};
  border-radius: ${px2rem(8)};

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
