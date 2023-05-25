import Empty from '@/components/Empty';
import { ICollection } from '@/interfaces/api/collection';
import { getCollectionsByItemsOwned } from '@/services/profile';
import { shortenAddress } from '@/utils';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Container } from './Nfts.styled';
import NFTCard from '@/components/NFTCard';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import { BNS_CONTRACT, ARTIFACT_CONTRACT } from '@/configs';
import CollectionModal from './CollectionModal';
import { IInscription } from '@/interfaces/api/inscription';
import NFTInfoModal from './NFTInfoModal';
import NFTTransferModal from './TransferModal';
import { EMPTY_LINK } from '@/modules/Home/constant';

const LIMIT_PAGE = 64;

const NftsProfile = () => {
  const user = useCurrentUserInfo();

  const profileWallet = user?.address || '';

  const pageSize = LIMIT_PAGE;

  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectCollection, setSelectCollection] = useState<ICollection | undefined>();
  const [selectNFT, setSelectNFT] = useState<IInscription | undefined>();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

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

  const handleOpenCollectionModal = (item: ICollection) => {
    setShowCollectionModal(true);
    setSelectCollection(item);
  };

  const handleCloseCollectionModal = () => {
    setShowCollectionModal(false);
  };

  const onClickNFT = (item: IInscription) => {
    setSelectNFT(item);
    setShowInfoModal(true);
    setShowCollectionModal(false);
  };

  const onClickTransfer = () => {
    setShowInfoModal(false);
    setShowTransferModal(true);
  };

  const onClickBackToCollection = () => {
    setShowInfoModal(false);
    setShowTransferModal(false);
    setShowCollectionModal(true);
  };

  useEffect(() => {
    if (profileWallet) fetchCollections();
  }, [profileWallet]);

  if (!collections || collections.length === 0) {
    return (
      <Container>
        <Empty infoText={EMPTY_LINK.NFT.label} link={EMPTY_LINK.NFT.link} />
      </Container>
    );
  }

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
                    thumbnail={item.thumbnail}
                    title1={item.name || shortenAddress(item.contract, 6)}
                    title2={shortenAddress(item.creator, 4)}
                    title3={`Collection #${item.index}`}
                    onClickItem={() => handleOpenCollectionModal(item)}
                  />
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>
      {selectCollection && (
        <CollectionModal
          collection={selectCollection}
          show={showCollectionModal}
          handleClose={handleCloseCollectionModal}
          onClickNFT={onClickNFT}
        />
      )}
      {selectNFT && (
        <NFTInfoModal
          artifact={selectNFT}
          show={showInfoModal}
          handleClose={() => setShowInfoModal(false)}
          onClickTransfer={onClickTransfer}
          onClickBack={onClickBackToCollection}
        />
      )}
      {selectNFT && showTransferModal && (
        <NFTTransferModal
          show={showTransferModal}
          handleClose={() => setShowTransferModal(false)}
          contractAddress={selectNFT.collectionAddress}
          artifact={selectNFT}
          onClickBack={onClickBackToCollection}
        />
      )}
    </Container>
  );
};

export default NftsProfile;
