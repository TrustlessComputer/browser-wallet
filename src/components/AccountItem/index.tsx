import { IAccountItem } from '@/state/wallet/types';
import { DropdownItem, MoreDropdownItem, MoreDropdownList } from './styled';
import useProvider from '@/hooks/useProvider';
import React from 'react';
import throttle from 'lodash/throttle';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import Text from '@/components/Text';
import ToolTip from '@/components/Tooltip';
import Dropdown from '@/components/Popover';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { ellipsisCenter } from '@/utils';
import { IMoreItem } from '@/components/AccountItem/types';
import { Row } from '@/components/Row';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { getBalanceByAddressSelector } from '@/state/wallet/selector';
import { setAddressBalance } from '@/state/wallet/reducer';
import Spinner from '@/components/Spinner';

interface IProps {
  account: IAccountItem;
  isChecked: boolean;
  onSwitchAccount: (address: string) => void;
  MoreList: IMoreItem[];
}

const AccountItem = (props: IProps) => {
  const { account, onSwitchAccount, MoreList, isChecked } = props;
  const provider = useProvider();
  const dispatch = useAppDispatch();
  const balance = useAppSelector(getBalanceByAddressSelector)(account.address);

  const onCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  const formatAddress = React.useMemo(() => {
    return `${ellipsisCenter({
      str: account.address,
      limit: 4,
    })}`;
  }, [account.address]);

  const formatTcBalance = format.shorterAmount({ originalAmount: balance || '0', decimals: Token.TRUSTLESS.decimal });

  const getAccountBalance = async (address: string) => {
    if (!provider) return;
    try {
      const balance = await provider.getBalance(address);
      dispatch(
        setAddressBalance({
          address: address,
          balance: balance.toString(),
        }),
      );
    } catch (error) {
      setAddressBalance({
        address: address,
        balance: '0',
      });
    }
  };

  const throttleGetAccountBalance = React.useCallback(throttle(getAccountBalance, 2000), [provider, account.address]);

  React.useEffect(() => {
    if (!account.address) return;
    throttleGetAccountBalance(account.address);
    const interval = setInterval(throttleGetAccountBalance, 10000);
    return () => clearInterval(interval);
  }, [account.address]);

  return (
    <DropdownItem>
      <div
        className="item"
        onClick={() => {
          if (isChecked) return;
          onSwitchAccount(account.address);
        }}
      >
        <IconSVG className="icon" src={isChecked ? `${CDN_URL_ICONS}/ic-check-dark.svg` : ''} maxWidth="24" />
        <div>
          <Row align="center" gap="4px">
            <Text color="text-primary" fontWeight="semibold" size="body">
              {account.name}
            </Text>
            <Text color="text-secondary" fontWeight="medium" size="note">
              ({formatAddress})
            </Text>
          </Row>
          <Row align="center" gap="12px">
            <Text color="text-highlight" fontWeight="medium" size="body" className="balance">
              {formatTcBalance} TC
            </Text>
            {!balance && <Spinner size={20} />}
          </Row>
        </div>
      </div>
      <div className="item-actions">
        <ToolTip
          unwrapElement={
            <div className="action" onClick={() => onCopy(account.address)}>
              <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />
            </div>
          }
          width={300}
        >
          <Text size="tini">Copy TC address</Text>
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
            {MoreList.map(item => {
              if (!account.isImport && item.title === 'Remove Account') {
                return undefined;
              }
              return (
                <MoreDropdownItem
                  key={item.title}
                  onClick={() => {
                    item.onClick({
                      name: account.name,
                      address: account.address,
                    });
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
};

export default AccountItem;
