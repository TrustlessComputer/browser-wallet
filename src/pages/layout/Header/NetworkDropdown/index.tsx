import IconSVG from '@/components/IconSVG';
import Dropdown from '@/components/Popover';
import Text from '@/components/Text';
import { CDN_URL_ICONS } from '@/configs';
import React from 'react';
import { DropdownItem, DropdownList, Element } from './styled';
import network from '@/lib/network.helpers';

const NetworkDropdown = React.memo(() => {
  const networks = network.getListNetworks();
  const selectNetwork = network.getSelectedNetwork();

  return (
    <Dropdown
      element={
        <Element>
          <IconSVG src={`${CDN_URL_ICONS}/${selectNetwork.Icon}`} maxWidth="32" />
          <Text color="text-primary" fontWeight="medium" size="body">
            {selectNetwork.Name}
          </Text>
          <IconSVG src={`${CDN_URL_ICONS}/ic-arrow-down-dark.svg`} maxWidth="14" />
        </Element>
      }
    >
      <DropdownList>
        {networks &&
          networks.length > 0 &&
          networks.map((item, index) => (
            <DropdownItem key={index.toString()}>
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
