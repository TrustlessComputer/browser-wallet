import { ExportKeyIcon, ExportIcon, TrashIcon } from '@/components/icons';
import IconSVG from '@/components/IconSVG';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { SwitchAccountAction } from '@/pages/layout/Header/AccountDropdown/SwitchAccount.actions';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { setIsLockedWallet } from '@/state/wallet/reducer';
import { listAccountsSelector } from '@/state/wallet/selector';
import { compareString, ellipsisCenter } from '@/utils';
import format from '@/utils/amount';
import { getErrorMessage } from '@/utils/error';
import copy from 'copy-to-clipboard';
import throttle from 'lodash/throttle';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import CreateModal from './CreateModal';
import RemoveModal from './RemoveModal';
import { DropDownContainer, DropdownItem, DropdownList, MoreDropdownItem, MoreDropdownList } from './styled';
import ExportAccount from '@/pages/layout/Header/AccountDropdown/ExportAccountModal';
import ToolTip from '@/components/Tooltip';
import network from '@/lib/network.helpers';
import ExportMnemonic from '@/pages/layout/Header/AccountDropdown/ExportMnemonicModal';
import ExportBTCKey from '@/pages/layout/Header/AccountDropdown/ExportBTCKeyModal';
import ImportKey from '@/pages/layout/Header/AccountDropdown/ImportKeyModal';
import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';

interface IAccount {
  name: string;
  address: string;
}

const AccountDropdown = React.memo(() => {
  const user = useCurrentUserInfo();
  const accounts = useAppSelector(listAccountsSelector);
  const dispatch = useAppDispatch();
  const switchAccountActions = new SwitchAccountAction({
    component: {
      accounts: accounts,
    },
    dispatch: dispatch,
  });
  const { tcBalance } = useContext(AssetsContext);
  const [showImportKey, setShowImportKey] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [removeAccount, setRemoveAccount] = useState<IAccount | undefined>(undefined);
  const [exportAccount, setExportAccount] = useState<IAccount | undefined>(undefined);
  const [exportMnemonic, setExportMnemonic] = useState<boolean>(false);
  const [exportBTCKey, setExportBTCKey] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  const onSwitchAccount = React.useCallback(
    throttle((address: string) => {
      try {
        switchAccountActions.switchAccount(address, accounts);
      } catch (error) {
        const { message } = getErrorMessage(error, 'switchAccount');
        toast.error(message);
      }
    }, 500),
    [accounts],
  );

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });

  const MoreList = [
    {
      title: 'View account in explorer',
      titleClass: 'text-normal',
      icon: <ExportIcon />,
      iconClass: 'icon-normal',
      onClick: (account: IAccount) => {
        window.open(`${network.current.Explorer}/address/${account.address}`);
      },
    },
    {
      title: 'Export Key',
      titleClass: 'text-normal',
      icon: <ExportKeyIcon />,
      iconClass: 'icon-normal',
      onClick: (account: IAccount) => {
        setExportAccount(account);
      },
    },
    {
      title: 'Remove Account',
      titleClass: 'text-remove',
      icon: <TrashIcon />,
      iconClass: 'icon-remove',
      onClick: (account: IAccount) => {
        setRemoveAccount(account);
      },
    },
  ];

  const onCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

  if (!user) {
    return <></>;
  }

  const renderItem = (
    isChecked: boolean,
    name: string,
    formatAddress: string,
    balance: string,
    address: string,
    isImported: boolean,
  ) => {
    return (
      <DropdownItem key={`${address}-${isChecked}`}>
        <div
          className="item"
          onClick={() => {
            if (isChecked) return;
            onSwitchAccount(address);
          }}
        >
          <IconSVG className="icon" src={isChecked ? `${CDN_URL_ICONS}/ic-check-dark.svg` : ''} maxWidth="24" />
          <div>
            <Text color="text-primary" fontWeight="light" size="body">
              {name}
            </Text>
            <Text color="text-highlight" fontWeight="medium" size="note" className="mt-8">
              {formatAddress}
            </Text>
          </div>
        </div>
        <div className="item-actions">
          <ToolTip
            unwrapElement={
              <div className="action" onClick={() => onCopy(address)}>
                <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />
              </div>
            }
            width={300}
          >
            <Text size="tini">Copy address</Text>
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
                if (!isImported && item.title === 'Remove Account') {
                  return undefined;
                }
                return (
                  <MoreDropdownItem
                    key={item.title}
                    onClick={() => {
                      item.onClick({
                        name,
                        address,
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

  const renderAction = (
    iconName: string,
    title: string,
    onClick: () => void,
    showBorder: boolean = true,
    textClassName?: string,
  ) => {
    return (
      <div className={`actions ${showBorder ? 'actions-border-top' : ''}`}>
        <div className="create-btn" onClick={onClick}>
          <IconSVG src={`${CDN_URL_ICONS}/${iconName}`} maxWidth="20" />
          <Text color="text-primary" fontWeight="medium" size="body" className={textClassName || 'text'}>
            {title}
          </Text>
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    if (storageLocal.get(LocalStorageKey.ADVANCE_USER)) {
      setShowImportKey(true);
    }
  }, []);

  return (
    <>
      <Dropdown
        element={
          <Text color="text-primary" fontWeight="medium" size="body">
            {ellipsisCenter({
              str: user.address,
              limit: 4,
            })}
          </Text>
        }
        width={384}
        closeDropdown={
          !!removeAccount || showCreateModal || !!exportAccount || exportMnemonic || exportBTCKey || showImportModal
        }
      >
        <DropDownContainer>
          <DropdownList>
            {accounts &&
              accounts.length > 0 &&
              accounts.map(account =>
                renderItem(
                  compareString({
                    str1: account.address,
                    str2: user?.address,
                    method: 'equal',
                  }),
                  account.name,
                  `${ellipsisCenter({
                    str: account.address,
                    limit: 4,
                  })}`,
                  `${formatTcBalance} TC`,
                  account.address,
                  account.isImport,
                ),
              )}
          </DropdownList>
          {renderAction('ic-plus-square-dark.svg', 'Create new account', () => setShowCreateModal(true))}
          {showImportKey &&
            renderAction('ic-plus-square-dark.svg', 'Import TC Private Key', () => setShowImportModal(true), false)}
          {renderAction('ic-export-mnemoic-dark.svg', 'Export mnemonic', () => setExportMnemonic(true), false)}
          {renderAction('ic-export-key-dark.svg', 'Export BTC private key', () => setExportBTCKey(true), false)}
          {renderAction('ic-logout-dark.svg', 'Sign out', () => dispatch(setIsLockedWallet(true)), true, 'text-remove')}
        </DropDownContainer>
      </Dropdown>
      <CreateModal show={showCreateModal} handleClose={() => setShowCreateModal(false)} />
      {!!removeAccount && (
        <RemoveModal
          show={!!removeAccount}
          address={removeAccount.address}
          name={removeAccount.name}
          handleClose={() => setRemoveAccount(undefined)}
        />
      )}
      {!!exportAccount && (
        <ExportAccount
          show={!!exportAccount}
          address={exportAccount.address}
          name={exportAccount.name}
          handleClose={() => setExportAccount(undefined)}
        />
      )}
      {exportMnemonic && <ExportMnemonic show={exportMnemonic} handleClose={() => setExportMnemonic(false)} />}
      {exportBTCKey && <ExportBTCKey show={exportBTCKey} handleClose={() => setExportBTCKey(false)} />}
      {showImportModal && <ImportKey show={showImportModal} handleClose={() => setShowImportModal(false)} />}
    </>
  );
});

export default AccountDropdown;
