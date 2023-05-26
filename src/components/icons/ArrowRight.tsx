import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import { IWrapSVGProps } from '@/components/icons/types';

const ArrowRightIcon = React.memo((props: IWrapSVGProps) => {
  return <IconSVG src={`${CDN_URL_ICONS}/ic-arrow-right-dark.svg`} maxWidth="20" type="stroke" {...props} />;
});

export default ArrowRightIcon;
