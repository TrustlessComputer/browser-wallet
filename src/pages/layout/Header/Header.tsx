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
import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu] = useState<boolean>(false);
  const user = useCurrentUserInfo();
  const isLocked = useAppSelector(isLockedSelector);
  const [counter, setCounter] = React.useState(0);

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
            <LogoIcon
              className="ic-logo"
              onClick={() => {
                setCounter(counter => ++counter);
                if (counter >= 20) {
                  storageLocal.set(LocalStorageKey.ADVANCE_USER, true);
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }
              }}
            />
          </Link>
          {!!user && !isLocked && (
            <Row gap="36px" className="balance-wrapper">
              <NetworkDropdown />
              <AccountDropdown />
              <AssetDropdown />
            </Row>
          )}
        </Row>
        <Row className="buttons">
          <Button sizes="small" variants="ghost" isArrowRight={true}>
            <a href="https://trustlessfaucet.io/" target="_blank">
              Faucet
            </a>
          </Button>
          <Button sizes="small" variants="ghost" isArrowRight={true}>
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
