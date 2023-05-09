import React from 'react';
import NFTDisplayBox from '../NFTDisplayBox';
import { IMAGE_TYPE } from '../NFTDisplayBox/constant';
import { Styled } from './NFTCard.styled';

export interface INFTCard {
  image?: string;
  thumbnail?: string;
  contract?: string;
  tokenId?: string;
  contentType?: IMAGE_TYPE;
  title1?: string;
  title2?: string;
  title3?: string;
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
  onClickItem,
}: INFTCard) => {
  return (
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
      </div>
    </Styled>
  );
};

export default NFTCard;
