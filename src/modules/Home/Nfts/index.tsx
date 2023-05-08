import Empty from '@/components/Empty';
import { ICollection } from '@/interfaces/api/collection';
import { getCollectionsByItemsOwned } from '@/services/profile';
import { shortenAddress } from '@/utils';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Container } from './NftsProfile.styled';
import NFTCard from '@/components/NFTCard';
import { useCurrentUser } from '@/state/wallet/hooks';
import { BNS_CONTRACT, ARTIFACT_CONTRACT } from '@/configs';
import CollectionModal from './CollectionModal';

const LIMIT_PAGE = 64;

const NftsProfile = () => {
  const user = useCurrentUser();

  const profileWallet = user?.address || '';
  const pageSize = LIMIT_PAGE;

  const [showCollectionModal, setShowCollectionModal] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<ICollection[]>([]);

  const fetchCollections = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollectionsByItemsOwned({
        walletAddress: profileWallet,
        limit: pageSize,
        page: page,
      });

      if (isFetchMore) {
        setCollections(prev => [...prev, ...data]);
      } else {
        setCollections(data);
      }
    } catch (error) {
      // handle error
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreCollections = () => {
    if (isFetching || collections.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections.length / LIMIT_PAGE) + 1;
    fetchCollections(page, true);
  };

  const debounceLoadMore = debounce(onLoadMoreCollections, 300);

  const handleOpenCollectionModal = () => {
    setShowCollectionModal(true);
  };

  const handleCloseCollectionModal = () => {
    setShowCollectionModal(false);
  };

  useEffect(() => {
    if (profileWallet) fetchCollections();
  }, [profileWallet]);

  if (!collections || collections.length === 0)
    return (
      <Container>
        <Empty />
      </Container>
    );

  const showCollections = collections.filter(
    item => ![ARTIFACT_CONTRACT.toLowerCase(), BNS_CONTRACT.toLowerCase()].includes(item.contract.toLowerCase()),
  );

  return (
    <Container>
      <InfiniteScroll
        className="list"
        dataLength={showCollections.length}
        hasMore={true}
        loader={
          isFetching && (
            <div className="loading">
              <Spinner animation="border" variant="primary" />
            </div>
          )
        }
        next={debounceLoadMore}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 1,
            750: 2,
            900: 3,
            1240: 4,
            2500: 5,
            3000: 5,
          }}
        >
          <Masonry gutter="24px">
            {showCollections.length > 0 &&
              showCollections.map((item: ICollection, index: number) => {
                return (
                  <NFTCard
                    key={index.toString()}
                    image={item.thumbnail}
                    title1={item.name || shortenAddress(item.contract, 6)}
                    title2={shortenAddress(item.creator, 4)}
                    title3={`Collection #${item.index}`}
                    onClickItem={handleOpenCollectionModal}
                  />
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
      <CollectionModal show={showCollectionModal} handleClose={handleCloseCollectionModal} />
    </Container>
  );
};

export default NftsProfile;
