import Button from '@/components/Button';
import { LogoIcon } from '@/components/icons';
import { Row } from '@/components/Row';
import { ROUTE_PATH } from '@/constants/route-path';
import { HEADER_ID } from '@/pages/layout';
import { useAppSelector } from '@/state/hooks';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { isLockedSelector } from '@/state/wallet/selector';
import { gsap, Power3 } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountDropdown from './AccountDropdown';
import AssetDropdown from './AssetDropdown';
import { Container, Wrapper } from './Header.styled';
import NetworkDropdown from './NetworkDropdown';

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu] = useState<boolean>(false);
  const user = useCurrentUserInfo();
  const isLocked = useAppSelector(isLockedSelector);

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
    <Container>
      <Wrapper id={HEADER_ID}>
        <Row gap="80px">
          <Link className="logo" to={ROUTE_PATH.HOME}>
            <LogoIcon className="ic-logo" />
          </Link>
          {!!user && !isLocked && (
            <Row gap="36px" className="balance-wrapper">
              <NetworkDropdown />
              <AccountDropdown />
              <AssetDropdown />
            </Row>
          )}
        </Row>
        <Row gap="32px" className="external-wrapper">
          <Button variants="outline">
            <a href="https://trustlessfaucet.io/" target="_blank">
              Faucet
            </a>
          </Button>
          <Button>
            <a href="https://trustless.computer/" target="_blank">
              Explore Dapp Store
            </a>
          </Button>
        </Row>
      </Wrapper>
    </Container>
  );
};

export default Header;
