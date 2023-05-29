import IconSVG from '@/components/IconSVG';
import Dropdown, { IDropdownRef } from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { ellipsisCenter } from '@/utils';
import format from '@/utils/amount';
import copy from 'copy-to-clipboard';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import network from '@/lib/network.helpers';
import { DropdownItem, DropdownList, Element, MoreDropdownItem, MoreDropdownList } from './styled';
import { TransactorContext } from '@/contexts/transactor.context';
import ToolTip from '@/components/Tooltip';
import { ExportIcon } from '@/components/icons';
import ExportKey from '@/components/icons/ExportKey';
import ExportBTCKey from '@/pages/layout/Header/AccountDropdown/ExportBTCKeyModal';
import ExportAccount from '@/pages/layout/Header/AccountDropdown/ExportAccountModal';
import { IAccount } from '@/pages/layout/Header/AccountDropdown';
import Spinner from '@/components/Spinner';

const AssetDropdown = React.memo(() => {
  const user = useCurrentUserInfo();
  const selectNetwork = network.getSelectedNetwork();
  const [exportBTCKey, setExportBTCKey] = useState<boolean>(false);
  const [exportAccount, setExportAccount] = useState<IAccount | undefined>(undefined);

  const dropdownRef = React.useRef<IDropdownRef>({
    onToggle: () => undefined,
  });

  const { tcBalance, btcBalance, isLoadedAssets } = useContext(AssetsContext);
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
      symbol: Token.TRUSTLESS.symbol,
      formatAddress: `Trustless (
        ${ellipsisCenter({
          str: user ? user.address : '',
          limit: 4,
        })}
        )`,
      formatBalance: `${formatTcBalance} TC`,
      actions: [
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />,
          onClick: () => onCopy(user?.address || ''),
          tooltip: 'Copy TC address',
        },
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-exchange.svg`} maxWidth="18" />,
          onClick: () => {
            onOpenTCModal();
            dropdownRef.current.onToggle();
          },
          tooltip: 'Transfer TC',
        },
      ],
      moreItems: [
        {
          title: 'View account in explorer',
          titleClass: 'text-normal',
          icon: <ExportIcon />,
          iconClass: 'icon-normal',
          onClick: () => {
            user && window.open(`${network.current.Explorer}/address/${user.address}`);
          },
        },
        {
          title: 'Export TC Key',
          titleClass: 'text-normal',
          icon: <ExportKey />,
          iconClass: 'icon-normal',
          onClick: () =>
            setExportAccount({
              name: user?.name || '',
              address: user?.address || '',
            }),
        },
      ],
    },
    {
      src: `${CDN_URL_ICONS}/ic-bitcoin.svg`,
      address: user ? user.btcAddress : '',
      symbol: Token.BITCOIN.symbol,
      formatAddress: `Bitcoin (
        ${ellipsisCenter({
          str: user ? user.btcAddress : '',
          limit: 4,
        })}
        )`,
      formatBalance: `${formatBtcBalance} BTC`,
      actions: [
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />,
          onClick: () => onCopy(user?.btcAddress || ''),
          tooltip: 'Copy BTC address',
        },
        {
          className: 'action',
          icon: <IconSVG src={`${CDN_URL_ICONS}/ic-exchange.svg`} maxWidth="18" />,
          onClick: () => {
            onOpenBTCModal();
            dropdownRef.current.onToggle();
          },
          tooltip: 'Transfer BTC',
        },
      ],
      moreItems: [
        {
          title: 'View account in explorer',
          titleClass: 'text-normal',
          icon: <ExportIcon />,
          iconClass: 'icon-normal',
          onClick: () => {
            user && window.open(`${network.current.BTCExplorer}/address/${user.btcAddress}`);
          },
        },
        {
          title: 'Export BTC Key',
          titleClass: 'text-normal',
          icon: <ExportKey />,
          iconClass: 'icon-normal',
          onClick: () => setExportBTCKey(true),
        },
      ],
    },
  ];

  return (
    <>
      <Dropdown
        element={
          <Element>
            <p>{formatTcBalance} TC</p>
            <div className="indicator" />
            <p>{formatBtcBalance} BTC</p>
            {!isLoadedAssets && <Spinner size={22} />}
          </Element>
        }
        width={384}
        type="hover"
        ref={dropdownRef}
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
                      <Text color="text-highlight" fontWeight="medium" size="body">
                        {asset.formatBalance}
                      </Text>
                    </div>
                  </div>
                  <div className="item-actions">
                    {asset.actions.map(action => {
                      return (
                        <ToolTip
                          unwrapElement={
                            <div className="action" onClick={action.onClick}>
                              {action.icon}
                            </div>
                          }
                          width={300}
                        >
                          <Text size="tini">{action.tooltip}</Text>
                        </ToolTip>
                      );
                    })}
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
                                dropdownRef.current.onToggle();
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
      {exportBTCKey && <ExportBTCKey show={exportBTCKey} handleClose={() => setExportBTCKey(false)} />}
      {!!exportAccount && (
        <ExportAccount
          show={!!exportAccount}
          address={exportAccount.address}
          name={exportAccount.name}
          handleClose={() => setExportAccount(undefined)}
        />
      )}
    </>
  );
});

export default AssetDropdown;
