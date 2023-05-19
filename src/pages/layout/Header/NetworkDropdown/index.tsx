import IconSVG from '@/components/IconSVG';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import React, { useContext } from 'react';
import { DropdownItem, DropdownList } from './styled';
import network, { INetwork } from '@/lib/network.helpers';
import { SwitchNetworkAction } from '@/pages/layout/Header/NetworkDropdown/SwitchNetwork.actions';
import { useAppDispatch } from '@/state/hooks';
import { InitialContext } from '@/contexts/initial.context';

const NetworkDropdown = React.memo(() => {
  const networks = network.getListNetworks();
  const selectNetwork = network.getSelectedNetwork();
  const dispatch = useAppDispatch();
  const { onPreloader } = useContext(InitialContext);

  const switchNetworkActions = new SwitchNetworkAction({
    component: {
      onPreloader,
    },
    dispatch,
  });

  const onSwitchNetwork = async (network: INetwork) => {
    await switchNetworkActions.switchNetwork(network);
  };

  return (
    <Dropdown
      element={
        <Text color="text-primary" fontWeight="medium" size="body">
          {selectNetwork.Name}
        </Text>
      }
      icon={<IconSVG src={`${CDN_URL_ICONS}/${selectNetwork.Icon}`} maxWidth="32" />}
    >
      <DropdownList>
        {networks &&
          networks.length > 0 &&
          networks.map((item, index) => (
            <DropdownItem
              key={index.toString()}
              onClick={() => {
                if (item.Name === selectNetwork.Name) return;
                return onSwitchNetwork(item);
              }}
            >
              <div className="item">
                <IconSVG src={`${CDN_URL_ICONS}/${item.Icon}`} maxWidth="32" />
                <div>
                  <Text color="text-primary" fontWeight="medium" size="note">
                    {item.Name}
                  </Text>
                </div>
              </div>
            </DropdownItem>
          ))}
      </DropdownList>
    </Dropdown>
  );
});

export default NetworkDropdown;
