import { gsap, Power3 } from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownList, Wrapper } from './Header.styled';
import { ROUTE_PATH } from '@/constants/route-path';
import { DisconnectIcon, ExchangeIcon, LogoIcon, MoreVerticalIcon, PenguinIcon } from '@/components/icons';
import { HEADER_ID } from '@/pages/layout';
import { Row } from '@/components/Row';
import AssetBox from '@/components/AssetBox';
import BitcoinIcon from '@/components/icons/Bitcoin';
import { useCurrentUser } from '@/state/wallet/hooks';
import Button from '@/components/Button';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';

const Header = () => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu] = useState<boolean>(false);
  const user = useCurrentUser();

  const MoreList = [
    {
      title: 'Send BTC',
      titleClass: 'text-normal',
      icon: <ExchangeIcon />,
      iconClass: 'icon-normal',
    },
    {
      title: 'Disconnect',
      titleClass: 'text-disconnect',
      icon: <DisconnectIcon />,
      iconClass: 'icon-disconnect',
    },
  ];

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
            <Dropdown icon={<MoreVerticalIcon />}>
              <DropdownList>
                {MoreList.map(item => (
                  <DropdownItem>
                    <div className={item.iconClass}>{item.icon}</div>
                    <Text className={item.titleClass}>{item.title}</Text>
                  </DropdownItem>
                ))}
              </DropdownList>
            </Dropdown>
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
