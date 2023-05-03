import { useEffect, useState } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { FOOTER_ID, HEADER_ID } from '@/pages/layout';

const isClient = typeof window === 'object';

function getSize() {
  const viewHeight = isClient ? window.innerHeight : 0;
  const viewWidth = isClient ? window.innerWidth : 0;

  const header = document.getElementById(HEADER_ID);
  const footer = document.getElementById(FOOTER_ID);

  return {
    width: viewWidth,
    height: viewHeight - (header?.clientHeight || 0) - (footer?.clientHeight || 0),
  };
}

export function useContentSize() {
  const { height, width } = useWindowSize();
  const [contentSize, setContentSize] = useState({
    width,
    height,
  });

  useEffect(() => {
    function handleResize() {
      setContentSize(getSize());
    }

    if (isClient) {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
    return undefined;
  }, []);

  return contentSize;
}
