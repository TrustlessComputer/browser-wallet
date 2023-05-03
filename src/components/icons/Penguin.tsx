import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';

const PenguinIcon = React.memo(() => {
  return <IconSVG src={`${CDN_URL_ICONS}/ic-penguin-dark.svg`} maxWidth="32" />;
});

export default PenguinIcon;
