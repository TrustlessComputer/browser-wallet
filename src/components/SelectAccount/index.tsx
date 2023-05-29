import React from 'react';
import Text from '@/components/Text';
import { Container, ContentBox, DropDownContainer, DropdownItem, DropdownList } from './styled';
import { useCurrentUserInfo, useUserSecretKey } from '@/state/wallet/hooks';
import { ArrowDownIcon } from '@/components/icons';
import Dropdown, { IDropdownRef } from '@/components/Popover';
import { compareString, ellipsisCenter } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  getBalanceByAddressSelector,
  listAccountsSelector,
  masterWalletSelector,
  passwordSelector,
} from '@/state/wallet/selector';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { SelectAccountAction } from '@/components/SelectAccount/SelectAccount.actions';
import { Row } from '@/components/Row';
import { IAccountItem } from '@/state/wallet/types';
import Spinner from '@/components/Spinner';

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
  const getBalanceSelector = useAppSelector(getBalanceByAddressSelector);

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
    const formatAddress = `${ellipsisCenter({
      str: account.address,
      limit: 4,
    })}`;
    const tcBalance = getBalanceSelector(account.address);
    const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });
    return (
      <DropdownItem key={`${account.address}-${isChecked}`}>
        <div
          className="item"
          onClick={async () => {
            if (isChecked) return dropdownRef.current.onToggle();
            await onSelectAccount(account.address);
            dropdownRef.current.onToggle();
          }}
        >
          <div className="icon-wrapper">
            <IconSVG className="icon" src={isChecked ? `${CDN_URL_ICONS}/ic-check-dark.svg` : ''} maxWidth="24" />
          </div>
          <div>
            <Row align="center" gap="8px">
              <Text color="text-primary" fontWeight="semibold" size="body">
                {account.name}
              </Text>
              <Text color="text-secondary" fontWeight="medium" size="note">
                ({formatAddress})
              </Text>
              {account.isImport && (
                <Text color="text-secondary" fontWeight="light" size="tini" className="imported">
                  Imported
                </Text>
              )}
            </Row>
            <Row align="center" gap="12px">
              <Text color="text-highlight" fontWeight="medium" size="body" className="balance">
                {formatTcBalance} TC
              </Text>
              {!tcBalance && <Spinner size={20} />}
            </Row>
          </div>
        </div>
      </DropdownItem>
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
          width={350}
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
