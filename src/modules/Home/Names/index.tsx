import { getBnsByWallet } from '@/services/bns-explorer';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { Container } from './Names.styled';
import Empty from '@/components/Empty';
import { IBNS } from '@/interfaces/bns';
import BNSCard from './Card';
import { useCurrentUserInfo } from '@/state/wallet/hooks';
import BNSTransferModal from './TransferModal';
import BNSInfoModal from './InfoModal';

const LIMIT_PAGE = 12;

const Names = () => {
  const user = useCurrentUserInfo();
  const account = user?.address || '';

  const profileWallet = account;

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectBNS, setSelectBNS] = useState<IBNS | undefined>();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const pageSize = LIMIT_PAGE;
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<IBNS[]>([]);

  const fetchNames = async (page = 1, isFetchMore = false) => {
    if (account && profileWallet) {
      try {
        setIsFetching(true);
        const data = await getBnsByWallet({ limit: pageSize, page: page, walletAddress: profileWallet });
        if (isFetchMore) {
          setCollections((prev: any) => [...prev, ...data]);
        } else {
          setCollections(data);
        }
      } catch (error) {
        // handle error
      } finally {
        setIsFetching(false);
      }
    }
  };

  const onLoadMoreNames = () => {
    if (isFetching || collections?.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections?.length / LIMIT_PAGE) + 1;
    fetchNames(page, true);
  };
  const debounceLoadMore = debounce(onLoadMoreNames, 300);

  useEffect(() => {
    if (account) {
      fetchNames();
    }
  }, [account]);

  if (!collections || collections.length === 0) return <Empty />;

  const onClickBNS = (bns: IBNS) => {
    setSelectBNS(bns);
    setShowInfoModal(true);
  };

  const onClickTransfer = () => {
    setShowInfoModal(false);
    setShowTransferModal(true);
  };

  return (
    <Container>
      <div className="content">
        <InfiniteScroll
          className="list"
          dataLength={collections.length}
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
            <Masonry gutter="16px">
              {collections &&
                collections.length > 0 &&
                collections.map((item: any) => {
                  return <BNSCard key={`name-${item.id}`} item={item} onClick={onClickBNS} />;
                })}
            </Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
        {selectBNS && (
          <BNSInfoModal
            bns={selectBNS}
            show={showInfoModal}
            handleClose={() => setShowInfoModal(false)}
            onClickTransfer={onClickTransfer}
          />
        )}
        {selectBNS && (
          <BNSTransferModal
            name={selectBNS.name}
            show={showTransferModal}
            handleClose={() => setShowTransferModal(false)}
          />
        )}
      </div>
    </Container>
  );
};

export default Names;
