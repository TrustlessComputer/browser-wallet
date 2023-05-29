import React from 'react';
import Text from '@/components/Text';
import { Container, ContentBox, DropDownContainer, DropdownList } from './styled';
import { useCurrentUserInfo, useUserSecretKey } from '@/state/wallet/hooks';
import { ArrowDownIcon } from '@/components/icons';
import Dropdown, { IDropdownRef } from '@/components/Popover';
import { compareString } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector, masterWalletSelector, passwordSelector } from '@/state/wallet/selector';
import { SelectAccountAction } from '@/components/SelectAccount/SelectAccount.actions';
import { IAccountItem } from '@/state/wallet/types';
import AccountItem from '@/components/AccountItem';

interface IProps {
  className?: string;
}

const SelectAccount = React.memo((props: IProps) => {
  const { className = '' } = props;
  const userSecretKey = useUserSecretKey();
  const userInfo = useCurrentUserInfo();
  const accounts = useAppSelector(listAccountsSelector);
  const password = useAppSelector(passwordSelector);
  const masterIns = useAppSelector(masterWalletSelector);
  const dropdownRef = React.useRef<IDropdownRef>({
    onToggle: () => undefined,
  });

  const dispatch = useAppDispatch();

  const selectAccountActions = new SelectAccountAction({
    component: {
      accounts: accounts,
      password,
      masterIns,
    },
    dispatch: dispatch,
  });

  const onSelectAccount = (address: string) => {
    return selectAccountActions.switchAccount(address);
  };

  const renderItem = (account: IAccountItem) => {
    const isChecked = compareString({
      str1: account.address,
      str2: userSecretKey?.address,
      method: 'equal',
    });
    return (
      <AccountItem
        key={`${account.address}-${isChecked}`}
        account={account}
        isChecked={isChecked}
        onSwitchAccount={async () => {
          if (isChecked) return dropdownRef.current.onToggle();
          onSelectAccount(account.address);
          dropdownRef.current.onToggle();
        }}
        MoreList={[]}
      />
    );
  };

  return (
    <Container className={className}>
      <Text size="note" color="text-secondary" className="title">
        {userInfo?.name || ''}
      </Text>
      {!!userSecretKey && (
        <Dropdown
          unwrapElement={
            <ContentBox className="item">
              <Text size="body" color="text-primary">
                {userSecretKey.address}
              </Text>
              <ArrowDownIcon />
            </ContentBox>
          }
          ref={dropdownRef}
          width={500}
        >
          <DropDownContainer>
            <DropdownList>
              {accounts && accounts.length > 0 && accounts.map(account => renderItem(account))}
            </DropdownList>
          </DropDownContainer>
        </Dropdown>
      )}
    </Container>
  );
});

export default SelectAccount;
