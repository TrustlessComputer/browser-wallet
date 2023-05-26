import React, { useContext } from 'react';
import Text from '@/components/Text';
import { Container, ContentBox, DropDownContainer, DropdownItem, DropdownList } from './styled';
import { useCurrentUserInfo, useUserSecretKey } from '@/state/wallet/hooks';
import { ArrowDownIcon } from '@/components/icons';
import Dropdown, { IDropdownRef } from '@/components/Popover';
import { compareString, ellipsisCenter } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import { listAccountsSelector, masterWalletSelector, passwordSelector } from '@/state/wallet/selector';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import format from '@/utils/amount';
import Token from '@/constants/token';
import { AssetsContext } from '@/contexts/assets.context';
import { SelectAccountAction } from '@/components/SelectAccount/SelectAccount.actions';

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
  const { tcBalance } = useContext(AssetsContext);
  const dropdownRef = React.useRef<IDropdownRef>({
    onToggle: () => undefined,
  });
  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });
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

  const renderItem = (isChecked: boolean, name: string, formatAddress: string, balance: string, address: string) => {
    return (
      <DropdownItem key={`${address}-${isChecked}`}>
        <div
          className="item"
          onClick={async () => {
            if (isChecked) return dropdownRef.current.onToggle();
            await onSelectAccount(address);
            dropdownRef.current.onToggle();
          }}
        >
          <IconSVG className="icon" src={isChecked ? `${CDN_URL_ICONS}/ic-check-dark.svg` : ''} maxWidth="24" />
          <div>
            <Text color="text-primary" fontWeight="light" size="body">
              {name}
            </Text>
            <Text color="button-primary" fontWeight="medium" size="note" className="mt-8">
              {formatAddress}
            </Text>
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
          width={400}
        >
          <DropDownContainer>
            <DropdownList>
              {accounts &&
                accounts.length > 0 &&
                accounts.map(account =>
                  renderItem(
                    compareString({
                      str1: account.address,
                      str2: userSecretKey?.address,
                      method: 'equal',
                    }),
                    account.name,
                    `${ellipsisCenter({
                      str: account.address,
                      limit: 5,
                    })}`,
                    `${formatTcBalance} TC`,
                    account.address,
                  ),
                )}
            </DropdownList>
          </DropDownContainer>
        </Dropdown>
      )}
    </Container>
  );
});

export default SelectAccount;
