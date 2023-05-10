import React from 'react';
import BaseModal from '@/components/BaseModal';
import DetailInfoItem from '@/components/DetailInfoItem';
import NFTCard from '@/components/NFTCard';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { ICollection } from '@/interfaces/api/collection';
import { IInscription } from '@/interfaces/api/inscription';
import { getCollectionNfts } from '@/services/nft-explorer';
import { shortenAddress } from '@/utils';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  ImageContainer,
  InfoContainer,
  ItemsContainer,
  SubTitle,
  Title,
  WrapContainer,
} from './CollectionModal.styled';

const LIMIT = 6;

type Props = {
  show: boolean;
  handleClose: () => void;
  collection: ICollection;
  onClickNFT: (nft: IInscription) => void;
};

const CollectionModal = (props: Props) => {
  const { show = false, handleClose, collection, onClickNFT } = props;

  const [isFetching, setIsFetching] = useState(false);
  const [inscriptions, setInscriptions] = useState<IInscription[]>([]);

  useEffect(() => {
    fetchInscriptions();
  }, [collection.contract]);

  const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom) {
      debounceLoadMore();
    }
  };

  const fetchInscriptions = async (page = 1) => {
    try {
      if (page === 1) {
        setInscriptions([]);
      }
      setIsFetching(true);
      const data = await getCollectionNfts({
        contractAddress: collection.contract,
        page,
        limit: LIMIT,
        owner: collection.creator || '',
      });
      if (page > 1) {
        setInscriptions(prev => [...prev, ...data]);
      } else {
        setInscriptions(data);
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreCollections = () => {
    if (isFetching || inscriptions.length % LIMIT !== 0) return;
    const page = Math.floor(inscriptions.length / LIMIT) + 1;
    fetchInscriptions(page);
  };

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  return (
    <BaseModal show={show} handleClose={handleClose} width={1000} onScrollBody={scrollHandler}>
      <WrapContainer>
        <Container>
          <ImageContainer md="6">
            <NFTDisplayBox contentClass="image" thumbnail={collection.thumbnail} />
          </ImageContainer>
          <InfoContainer md="6">
            <Title>{collection.name || shortenAddress(collection.contract, 6)}</Title>
            <SubTitle>{collection.description}</SubTitle>
            <p className="name-detail">Collection details</p>
            <div className="item">
              <DetailInfoItem title="Collection Number" type="string" content={`#${collection.index}`} />
              <DetailInfoItem title="Items" type="string" content={`${collection.totalItems}`} />
              <DetailInfoItem
                title="Owner (You)"
                type="address"
                address={collection.creator}
                content={shortenAddress(collection.creator, 4)}
              />
              <DetailInfoItem
                title="Contract"
                type="string"
                content={shortenAddress(collection.contract.toLowerCase(), 4)}
              />
              <DetailInfoItem title="Block" type="string" content={`${collection.deployedAtBlock}`} />
            </div>
          </InfoContainer>
        </Container>
        <ItemsContainer>
          <div className="title">
            <p>Owned Items</p>
          </div>
          <Grid>
            {inscriptions &&
              inscriptions.length > 0 &&
              inscriptions.map((item, index) => {
                return (
                  <NFTCard
                    key={index.toString()}
                    image={item?.image}
                    contract={collection?.contract}
                    tokenId={item.tokenId}
                    contentType={item.contentType}
                    title1={`${item.name || ''}${item.name.includes('#') ? '' : `#${item.tokenId}`}`}
                    title2={shortenAddress(item.owner, 4)}
                    onClickItem={() => onClickNFT(item)}
                  />
                );
              })}
          </Grid>
        </ItemsContainer>
      </WrapContainer>
    </BaseModal>
  );
};

export default CollectionModal;
