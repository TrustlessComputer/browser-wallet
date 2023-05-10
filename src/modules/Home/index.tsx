import IconSVG from '@/components/IconSVG';

import Text from '@/components/Text';
import { DappsTabs } from '@/enums/tabs';
import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import queryString from 'query-string';
import Artifacts from './Artifacts';
import Names from './Names';
import Nfts from './Nfts';
import Tokens from './Tokens';
import Transactions from './Transactions';
import { StyledProfile, TabContainer } from './Home.styled';
import { CDN_URL } from '@/configs';
import { MDContainer } from '@/modules/styled';

const Home = () => {
  const { tab } = queryString.parse(location.search) as { tab: string };

  const [activeTab, setActiveTab] = useState(tab || DappsTabs.TRANSACTION);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const renderTitleTab = (tab: DappsTabs, src: string, text: string) => {
    const isActive = tab === activeTab;
    return (
      <div className="tab-item">
        <IconSVG
          maxWidth="20"
          maxHeight="20"
          src={src}
          color={isActive ? 'text-highlight' : 'text-primary'}
          type="stroke"
        />
        <Text className="tab-text" color={isActive ? 'text-highlight' : 'text-primary'}>
          {text}
        </Text>
      </div>
    );
  };

  return (
    <MDContainer>
      <StyledProfile className="row">
        <TabContainer className="wrapper">
          <Tabs
            defaultActiveKey={activeTab}
            id="uncontrolled-tab"
            onSelect={key => setActiveTab(key || DappsTabs.NFT)}
            activeKey={activeTab}
          >
            <Tab
              mountOnEnter
              eventKey={DappsTabs.NFT}
              title={renderTitleTab(DappsTabs.NFT, `${CDN_URL}/icons/ic-hexagon.svg`, 'NFTs')}
            >
              <Nfts />
            </Tab>
            <Tab
              mountOnEnter
              eventKey={DappsTabs.TOKEN}
              title={renderTitleTab(DappsTabs.TOKEN, `${CDN_URL}/icons/ic-coin-unbroken.svg`, 'Tokens')}
            >
              <Tokens />
            </Tab>
            <Tab
              mountOnEnter
              eventKey={DappsTabs.ARTIFACT}
              title={renderTitleTab(DappsTabs.ARTIFACT, `${CDN_URL}/icons/ic-folder-open.svg`, 'Artifacts')}
            >
              <Artifacts />
            </Tab>
            <Tab
              mountOnEnter
              eventKey={DappsTabs.NAMES}
              title={renderTitleTab(DappsTabs.NAMES, `${CDN_URL}/icons/ic-names.svg`, 'Names')}
            >
              <Names />
            </Tab>
            <Tab
              mountOnEnter
              eventKey={DappsTabs.TRANSACTION}
              title={renderTitleTab(DappsTabs.TRANSACTION, `${CDN_URL}/icons/ic-arrow-switch.svg`, 'Transactions')}
            >
              <Transactions />
            </Tab>
          </Tabs>
        </TabContainer>
      </StyledProfile>
    </MDContainer>
  );
};

export default Home;
