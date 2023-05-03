import { gsap, Power3 } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrapper } from './Header.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { LogoIcon } from '@/components/icons';
import { HEADER_ID } from '@/pages/layout';

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu] = useState<boolean>(false);

  useEffect(() => {
    if (refMenu.current) {
      if (isOpenMenu) {
        gsap.to(refMenu.current, { x: 0, duration: 0.6, ease: Power3.easeInOut });
      } else {
        gsap.to(refMenu.current, {
          x: '100%',
          duration: 0.6,
          ease: Power3.easeInOut,
        });
      }
    }
  }, []);

  return (
    <Wrapper id={HEADER_ID}>
      <Link className="logo" to={ROUTE_PATH.HOME}>
        <LogoIcon className="ic-logo" />
      </Link>
    </Wrapper>
  );
};

export default Header;
