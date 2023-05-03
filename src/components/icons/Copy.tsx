import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import { IWrapSVGProps } from '@/components/icons/types';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';

interface IProps extends IWrapSVGProps {
  content: string | undefined;
}

const CopyIcon = React.memo((props: IProps) => {
  const onCopy = (e: any) => {
    e.stopPropagation();
    if (!props.content) return;
    copy(props.content);
    toast.success('Copied');
  };
  return <IconSVG src={`${CDN_URL_ICONS}/ic-copy-dark.svg`} maxWidth="32" {...props} onClick={onCopy} />;
});

export default CopyIcon;
