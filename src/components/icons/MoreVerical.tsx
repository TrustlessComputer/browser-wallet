import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import { IWrapSVGProps } from '@/components/icons/types';

const MoreVerticalIcon = React.memo((props: IWrapSVGProps) => {
  return <IconSVG src={`${CDN_URL_ICONS}/ic-more-vertical.svg`} maxWidth="20" {...props} />;
});

export default MoreVerticalIcon;
