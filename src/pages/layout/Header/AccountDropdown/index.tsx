import { ExportKeyIcon, ExportIcon, TrashIcon } from '@/components/icons';
import IconSVG from '@/components/IconSVG';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import { SwitchAccountAction } from '@/pages/layout/Header/AccountDropdown/SwitchAccount.actions';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { setIsLockedWallet } from '@/state/wallet/reducer';
import { listAccountsSelector } from '@/state/wallet/selector';
import { compareString, ellipsisCenter } from '@/utils';
import { getErrorMessage } from '@/utils/error';
import throttle from 'lodash/throttle';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import CreateModal from './CreateModal';
import RemoveModal from './RemoveModal';
import { DropDownContainer, DropdownList } from './styled';
import ExportAccount from '@/pages/layout/Header/AccountDropdown/ExportAccountModal';
import network from '@/lib/network.helpers';
import ExportMnemonic from '@/pages/layout/Header/AccountDropdown/ExportMnemonicModal';
import ExportBTCKey from '@/pages/layout/Header/AccountDropdown/ExportBTCKeyModal';
import ImportKey from '@/pages/layout/Header/AccountDropdown/ImportKeyModal';
import storageLocal from '@/lib/storage.local';
import { LocalStorageKey } from '@/enums/storage.keys';
import { IAccount } from '@/components/AccountItem/types';
import AccountItem from '@/components/AccountItem';
import { IAccountItem } from '@/state/wallet/types';

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
      title: 'Export TC Key',
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

  if (!user) {
    return <></>;
  }

  const renderItem = (account: IAccountItem) => {
    const isChecked = compareString({
      str1: account.address,
      str2: user?.address,
      method: 'equal',
    });
    return (
      <AccountItem
        key={account.address + isChecked}
        account={account}
        isChecked={isChecked}
        MoreList={MoreList}
        onSwitchAccount={onSwitchAccount}
      />
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
          <DropdownList>{accounts && accounts.length > 0 && accounts.map(account => renderItem(account))}</DropdownList>
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
