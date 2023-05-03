import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';

const BitcoinIcon = React.memo(() => {
  return <IconSVG src={`${CDN_URL_ICONS}/ic-bitcoin.svg`} maxWidth="32" />;
});

export default BitcoinIcon;
