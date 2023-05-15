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
import { DropdownItem, DropdownList, Element } from './styled';
import { TransactorContext } from '@/contexts/transactor.context';

const AssetDropdown = React.memo(() => {
  const user = useCurrentUserInfo();
  const selectNetwork = network.getSelectedNetwork();

  const { tcBalance, btcBalance } = useContext(AssetsContext);
  const { onOpenBTCModal } = useContext(TransactorContext);

  const formatTcBalance = format.shorterAmount({ originalAmount: tcBalance, decimals: Token.TRUSTLESS.decimal });
  const formatBtcBalance = format.shorterAmount({ originalAmount: btcBalance, decimals: Token.BITCOIN.decimal });

  const onCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
  };

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
          <DropdownItem>
            <div className="item">
              <IconSVG src={`${CDN_URL_ICONS}/${selectNetwork.Icon}`} maxWidth="32" />
              <div>
                <Text color="text-secondary" fontWeight="light" size="note">
                  Trustless (
                  {ellipsisCenter({
                    str: user.address,
                    limit: 4,
                  })}
                  )
                </Text>
                <Text color="button-primary" fontWeight="medium" size="body">
                  {formatTcBalance} TC
                </Text>
              </div>
            </div>
            <div className="item-actions">
              <div className="action" onClick={() => onCopy(user.address)}>
                <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />
              </div>
              <div className="action action-hide" />
            </div>
          </DropdownItem>

          <DropdownItem>
            <div className="item">
              <IconSVG src={`${CDN_URL_ICONS}/ic-bitcoin.svg`} maxWidth="32" />
              <div>
                <Text color="text-secondary" fontWeight="light" size="note">
                  Bitcoin (
                  {ellipsisCenter({
                    str: user.btcAddress,
                    limit: 4,
                  })}
                  )
                </Text>
                <Text color="button-primary" fontWeight="medium" size="body">
                  {formatBtcBalance} BTC
                </Text>
              </div>
            </div>
            <div className="item-actions">
              <div className="action" onClick={() => onCopy(user.btcAddress)}>
                <IconSVG src={`${CDN_URL_ICONS}/ic-copy-asset-dark.svg`} maxWidth="18" />
              </div>
              <div className="action" onClick={onOpenBTCModal}>
                <IconSVG src={`${CDN_URL_ICONS}/ic-exchange.svg`} maxWidth="20" />
              </div>
            </div>
          </DropdownItem>
        </DropdownList>
      )}
    </Dropdown>
  );
});

export default AssetDropdown;
