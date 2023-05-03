import { gsap, Power3 } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrapper } from './Header.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { LogoIcon, PenguinIcon } from '@/components/icons';
import { HEADER_ID } from '@/pages/layout';
import { Row } from '@/components/Row';
import AssetBox from '@/components/AssetBox';
import BitcoinIcon from '@/components/icons/Bitcoin';
import { useCurrentUser } from '@/state/wallet/hooks';
import Button from '@/components/Button';

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu] = useState<boolean>(false);
  const user = useCurrentUser();

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
      <Row gap="60px">
        <Link className="logo" to={ROUTE_PATH.HOME}>
          <LogoIcon className="ic-logo" />
        </Link>
        {!!user && (
          <Row gap="40px" className="balance-wrapper">
            <AssetBox icon={<PenguinIcon />} title="TRUSTLESS BALANCE" amount="0.001" address={user.address} />
            <AssetBox icon={<BitcoinIcon />} title="BITCOIN BALANCE" amount="0.001" address={user.btcAddress} />
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
  );
};

export default Header;
