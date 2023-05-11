import { DisconnectIcon, ExportIcon } from '@/components/icons';
import IconSVG from '@/components/IconSVG';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { setIsLockedWallet } from '@/state/wallet/reducer';
import { listAccountsSelector } from '@/state/wallet/selector';
import { ellipsisCenter } from '@/utils';
import format from '@/utils/amount';
import copy from 'copy-to-clipboard';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import CreateAccount from './CreateAccount';
import { DropdownItem, DropdownList, Element, MoreDropdownList, MoreDropdownItem } from './styled';

const AccountDropdown = React.memo(() => {
  const user = useCurrentUserInfo();
  const accounts = useAppSelector(listAccountsSelector);

  const { tcBalance } = useContext(AssetsContext);

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });

  const dispatch = useAppDispatch();

  const MoreList = [
    {
      title: 'Export Key',
      titleClass: 'text-normal',
      icon: <ExportIcon />,
      iconClass: 'icon-normal',
      onClick: () => {},
    },
    {
      title: 'Disconnect',
      titleClass: 'text-disconnect',
      icon: <DisconnectIcon />,
      iconClass: 'icon-disconnect',
      onClick: () => dispatch(setIsLockedWallet(true)),
    },
  ];

  const onCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  if (!user) {
    return <></>;
  }

  const renderItem = (isChecked: boolean, name: string, formatAddress: string, balance: string, address: string) => {
    return (
      <DropdownItem>
        <div className="item">
          <IconSVG className="icon" src={isChecked ? `${CDN_URL_ICONS}/ic-check-dark.svg` : ''} maxWidth="24" />
          <div>
            <Text color="text-primary" fontWeight="light" size="body">
              {name} <span>{formatAddress}</span>
            </Text>
            <Text color="button-primary" fontWeight="medium" size="note">
              {balance}
            </Text>
          </div>
        </div>
        <div className="item-actions">
          <div className="action" onClick={() => onCopy(address)}>
            <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />
          </div>
          <Dropdown
            unwrapElement={
              <div className="action">
                <IconSVG src={`${CDN_URL_ICONS}/ic-more-vertical.svg`} maxWidth="18" />
              </div>
            }
          >
            <MoreDropdownList>
              {MoreList.map(item => (
                <MoreDropdownItem key={item.title} onClick={item.onClick}>
                  <div className={item.iconClass}>{item.icon}</div>
                  <Text className={item.titleClass} size="note">
                    {item.title}
                  </Text>
                </MoreDropdownItem>
              ))}
            </MoreDropdownList>
          </Dropdown>
        </div>
      </DropdownItem>
    );
  };

  return (
    <Dropdown
      element={
        <Element>
          <Text color="text-primary" fontWeight="medium" size="body">
            {ellipsisCenter({
              str: user.address,
              limit: 4,
            })}
          </Text>
          <IconSVG src={`${CDN_URL_ICONS}/ic-arrow-down-dark.svg`} maxWidth="14" />
        </Element>
      }
      width={384}
    >
      <div>
        <DropdownList>
          {accounts &&
            accounts.length > 0 &&
            accounts.map(account =>
              renderItem(
                true,
                account.name,
                `(${ellipsisCenter({
                  str: account.address,
                  limit: 4,
                })})`,
                `${formatTcBalance} TC`,
                account.address,
              ),
            )}
        </DropdownList>
        <CreateAccount />
      </div>
    </Dropdown>
  );
});

export default AccountDropdown;
