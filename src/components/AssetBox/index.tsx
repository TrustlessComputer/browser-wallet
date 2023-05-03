import React from 'react';
import Text from '@/components/Text';
import Container from '@/components/AssetBox/styled';
import { ellipsisCenter } from '@/utils';
import CopyIcon from '@/components/icons/Copy';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';

interface IProps {
  icon: React.ReactNode;
  title: string;
  amount: string;
  address: string;
}

const AssetBox = React.memo((props: IProps) => {
  const onCopy = () => {
    if (!props.address) return;
    copy(props.address);
    toast.success('Copied');
  };
  return (
    <Container>
      {props.icon}
      <div className="box-center">
        <Text color="text-secondary" fontWeight="medium" size="body" className="text">
          {props.title}
        </Text>
        <Text color="text-highlight" fontWeight="medium" size="h6" className="text">
          {props.amount}
        </Text>
      </div>
      <div className="box-end" onClick={onCopy}>
        <Text color="text-secondary" fontWeight="medium" size="body" className="text">
          {ellipsisCenter({
            str: props.address,
            limit: 4,
          })}
        </Text>
        <CopyIcon maxWidth="16" className="ic-copy" content={props.address} />
      </div>
    </Container>
  );
});

export default AssetBox;
