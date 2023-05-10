import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import { IWrapSVGProps } from '@/components/icons/types';

const DisconnectIcon = React.memo((props: IWrapSVGProps) => {
  return <IconSVG src={`${CDN_URL_ICONS}/ic-disconnect.svg`} maxWidth="16" {...props} />;
});

export default DisconnectIcon;
