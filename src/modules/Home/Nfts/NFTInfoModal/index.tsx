import BaseModal from '@/components/BaseModal';
import { Container, InfoContainer, ImageContainer, Title, BackHeader } from './NFTInfoModal.styled';
import { shortenAddress } from '@/utils';
import { CDN_URL } from '@/configs';
import DetailInfoItem from '@/components/DetailInfoItem';
import { IInscription } from '@/interfaces/api/inscription';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { formatTimeStamp } from '@/utils/time';
import { useEffect, useState } from 'react';
import { getNFTDetail } from '@/services/nft-explorer';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ArrowLeftIcon } from '@/components/icons';
import network from '@/lib/network.helpers';

type Props = {
  show: boolean;
  handleClose: () => void;
  artifact: IInscription;
  onClickTransfer: () => void;
  onClickBack: () => void;
};

const NFTInfoModal = (props: Props) => {
  const { show = false, handleClose, artifact, onClickTransfer, onClickBack } = props;

  const [artifactDetail, setArtifactDetail] = useState<IInscription>(artifact);

  useEffect(() => {
    fetchInscriptionDetail();
  }, [artifact]);

  const fetchInscriptionDetail = async () => {
    try {
      const data = await getNFTDetail({ contractAddress: artifact.collectionAddress, tokenId: artifact.tokenId });
      setArtifactDetail(data);
    } catch (error) {}
  };

  const renderProperties = (attributes: any[]) => (
    <div className="list-container">
      <p className="list-name">Attributes</p>
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          350: 2,
          750: 2,
          900: 2,
          1240: 3,
          2500: 3,
          3000: 3,
        }}
      >
        <Masonry gutter="16px">
          {attributes.length > 0 &&
            attributes.map((trait, index) => {
              return (
                <div key={index.toString()} className="properties-item">
                  <p className="properties-trait-type">{trait.traitType}</p>
                  <p className="properties-trait-value">{trait.value}</p>
                </div>
              );
            })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );

  return (
    <BaseModal show={show} handleClose={handleClose} width={1000}>
      <div>
        <BackHeader onClick={onClickBack}>
          <ArrowLeftIcon />
          <p>Back to collection</p>
        </BackHeader>
        <Container>
          <ImageContainer md="6">
            <NFTDisplayBox
              collectionID={artifact.collectionAddress}
              contentClass="image"
              src={artifact.image}
              tokenID={artifact.tokenId}
              type={artifact.contentType}
            />
            <div className="card-transfer-btn" onClick={onClickTransfer}>
              <img src={`${CDN_URL}/icons/ic-exchange-horizontal.svg`} />
              <p>Transfer NFT</p>
            </div>
          </ImageContainer>
          <InfoContainer md="6">
            <Title>{`${artifact.name || ''}${artifact.name.includes('#') ? '' : `#${artifact.tokenId}`}`}</Title>
            <p className="name-detail">NFT details</p>
            <div className="item">
              <DetailInfoItem
                title="Owner (You)"
                type="address"
                address={artifact.owner}
                content={shortenAddress(artifact.owner, 4)}
              />
              <DetailInfoItem
                title="Contract"
                type="link"
                link={`${network.current.Explorer}/address/${artifact.collectionAddress}`}
                content={shortenAddress(artifact.collectionAddress.toLowerCase(), 4)}
              />
              <DetailInfoItem title="Content type" type="string" content={artifact.contentType} />
              {artifactDetail.mintedAt && (
                <DetailInfoItem
                  title="Timestamp"
                  type="string"
                  content={formatTimeStamp(artifactDetail.mintedAt * 1000)}
                />
              )}
            </div>
            {artifactDetail &&
              artifactDetail.attributes &&
              artifactDetail.attributes.length > 0 &&
              renderProperties(
                artifactDetail.attributes.sort(function (a, b) {
                  if (a.traitType < b.traitType) {
                    return -1;
                  }
                  if (a.traitType > b.traitType) {
                    return 1;
                  }
                  return 0;
                }),
              )}
          </InfoContainer>
        </Container>
      </div>
    </BaseModal>
  );
};

export default NFTInfoModal;
