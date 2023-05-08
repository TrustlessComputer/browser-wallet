import NFTDisplayBox from '../NFTDisplayBox';
import { IMAGE_TYPE } from '../NFTDisplayBox/constant';
import { Styled } from './NFTCard.styled';
import React, { useMemo, useState } from 'react';
import TransferModal from './TransferModal';
import { useCurrentUser } from '@/state/wallet/hooks';

export interface INFTCard {
  image?: string;
  thumbnail?: string;
  contract?: string;
  tokenId?: string;
  contentType?: IMAGE_TYPE;
  title1?: string;
  title2?: string;
  title3?: string;
  owner?: string;
  onClickItem?: () => void;
}

const NFTCard = ({
  image,
  thumbnail,
  contract,
  tokenId,
  contentType,
  title1,
  title2,
  title3,
  owner,
  onClickItem,
}: INFTCard) => {
  const user = useCurrentUser();
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleOpenTransferModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setShowTransferModal(true);
  };

  const handleCloseTransferModal = () => {
    setShowTransferModal(false);
  };

  const isOwner = useMemo(() => {
    return user?.address && user?.address?.toLowerCase() === owner?.toLowerCase();
  }, [owner, user]);

  return (
    <>
      <Styled onClick={onClickItem}>
        <div className="card-content">
          <div className="card-image">
            <NFTDisplayBox
              collectionID={contract}
              contentClass="image"
              thumbnail={thumbnail}
              src={image}
              tokenID={tokenId}
              type={contentType}
            />
            <div className="overlay" />
          </div>
          <div className="card-info">
            {title1 && <p className="card-title1">{title1}</p>}
            {title2 && <p className="card-title2">{title2}</p>}
            {title3 && <p className="card-title3">{title3}</p>}
          </div>
          {isOwner && (
            <div className="owner-actions">
              <button onClick={handleOpenTransferModal} className="transfer-button">
                Transfer
              </button>
            </div>
          )}
        </div>
      </Styled>
      <TransferModal
        show={showTransferModal}
        handleClose={handleCloseTransferModal}
        contractAddress={contract}
        tokenId={tokenId}
      />
    </>
  );
};

export default NFTCard;
