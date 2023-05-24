import IconSVG from '@/components/IconSVG';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { ellipsisCenter } from '@/utils';
import format from '@/utils/amount';
import copy from 'copy-to-clipboard';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import network from '@/lib/network.helpers';
import { DropdownItem, DropdownList, Element, MoreDropdownItem, MoreDropdownList } from './styled';
import { TransactorContext } from '@/contexts/transactor.context';
import ToolTip from '@/components/Tooltip';
import { ExportIcon } from '@/components/icons';

const AssetDropdown = React.memo(() => {
  const user = useCurrentUserInfo();
  const selectNetwork = network.getSelectedNetwork();

  const { tcBalance, btcBalance } = useContext(AssetsContext);
  const { onOpenBTCModal, onOpenTCModal } = useContext(TransactorContext);

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });
  const formatBtcBalance = format.shorterAmount({ originalAmount: btcBalance, decimals: Token.BITCOIN.decimal });

  const onCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  const assets = [
    {
      src: `${CDN_URL_ICONS}/${selectNetwork.Icon}`,
      address: user ? user.address : '',
      formatAddress: `Trustless (
        ${ellipsisCenter({
          str: user ? user.address : '',
          limit: 4,
        })}
        )`,
      formatBalance: `${formatTcBalance} TC`,
      moreItems: [
        {
          title: 'Transfer TC',
          titleClass: 'text-normal',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-exchange.svg`} maxWidth="18" />,
          iconClass: 'icon-normal',
          onClick: onOpenTCModal,
        },
        {
          title: 'View account in explorer',
          titleClass: 'text-normal',
          icon: <ExportIcon />,
          iconClass: 'icon-normal',
          onClick: () => {
            user && window.open(`${network.current.Explorer}/address/${user.address}`);
          },
        },
      ],
    },
    {
      src: `${CDN_URL_ICONS}/ic-bitcoin.svg`,
      address: user ? user.btcAddress : '',
      formatAddress: `Trustless (
        ${ellipsisCenter({
          str: user ? user.btcAddress : '',
          limit: 4,
        })}
        )`,
      formatBalance: `${formatBtcBalance} BTC`,
      moreItems: [
        {
          title: 'Transfer BTC',
          titleClass: 'text-normal',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-exchange.svg`} maxWidth="18" />,
          iconClass: 'icon-normal',
          onClick: onOpenBTCModal,
        },
        {
          title: 'View account in explorer',
          titleClass: 'text-normal',
          icon: <ExportIcon />,
          iconClass: 'icon-normal',
          onClick: () => {
            user && window.open(`${network.current.BTCExplorer}/address/${user.btcAddress}`);
          },
        },
      ],
    },
  ];

  return (
    <Dropdown
      element={
        <Element>
          <p>{formatTcBalance} TC</p>
          <div className="indicator" />
          <p>{formatBtcBalance} BTC</p>
        </Element>
      }
      width={384}
      type="hover"
    >
      {user && (
        <DropdownList>
          {assets.map((asset, index) => {
            return (
              <DropdownItem key={index.toString()}>
                <div className="item">
                  <IconSVG src={asset.src} maxWidth="32" />
                  <div>
                    <Text color="text-secondary" fontWeight="light" size="note">
                      {asset.formatAddress}
                    </Text>
                    <Text color="button-primary" fontWeight="medium" size="body">
                      {asset.formatBalance}
                    </Text>
                  </div>
                </div>
                <div className="item-actions">
                  <ToolTip
                    unwrapElement={
                      <div className="action" onClick={() => onCopy(asset.address)}>
                        <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />
                      </div>
                    }
                    width={300}
                  >
                    <Text size="tini">Copy to clipboard</Text>
                  </ToolTip>

                  <Dropdown
                    unwrapElement={
                      <ToolTip
                        unwrapElement={
                          <div className="action">
                            <IconSVG src={`${CDN_URL_ICONS}/ic-more-vertical.svg`} maxWidth="18" />
                          </div>
                        }
                        width={300}
                      >
                        <Text size="tini">More</Text>
                      </ToolTip>
                    }
                    width={300}
                  >
                    <MoreDropdownList>
                      {asset.moreItems.map(item => {
                        return (
                          <MoreDropdownItem
                            key={item.title}
                            onClick={() => {
                              item.onClick();
                            }}
                          >
                            <div className={item.iconClass}>{item.icon}</div>
                            <Text className={item.titleClass} size="note">
                              {item.title}
                            </Text>
                          </MoreDropdownItem>
                        );
                      })}
                    </MoreDropdownList>
                  </Dropdown>
                </div>
              </DropdownItem>
            );
          })}
        </DropdownList>
      )}
    </Dropdown>
  );
});

export default AssetDropdown;
