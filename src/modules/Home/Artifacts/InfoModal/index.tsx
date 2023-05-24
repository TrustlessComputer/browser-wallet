import BaseModal from '@/components/BaseModal';
import { Container, InfoContainer, ImageContainer, Title } from './InfoModal.styled';
import { shortenAddress } from '@/utils';
import { ARTIFACT_CONTRACT, CDN_URL } from '@/configs';
import DetailInfoItem from '@/components/DetailInfoItem';
import { IInscription } from '@/interfaces/api/inscription';
import NFTDisplayBox from '@/components/NFTDisplayBox';
import { formatTimeStamp } from '@/utils/time';
import { useEffect, useState } from 'react';
import { getNFTDetail } from '@/services/nft-explorer';
import network from '@/lib/network.helpers';

type Props = {
  show: boolean;
  handleClose: () => void;
  artifact: IInscription;
  onClickTransfer: () => void;
};

const ArtifactInfoModal = (props: Props) => {
  const { show = false, handleClose, artifact, onClickTransfer } = props;

  const [artifactDetail, setArtifactDetail] = useState<IInscription>(artifact);

  useEffect(() => {
    fetchInscriptionDetail();
  }, []);

  const fetchInscriptionDetail = async () => {
    try {
      const data = await getNFTDetail({ contractAddress: ARTIFACT_CONTRACT, tokenId: artifact.tokenId });
      setArtifactDetail(data);
    } catch (error) {}
  };

  return (
    <BaseModal show={show} handleClose={handleClose} width={1000}>
      <Container>
        <ImageContainer md="6">
          <NFTDisplayBox
            collectionID={ARTIFACT_CONTRACT}
            contentClass="image"
            src={artifact.image}
            tokenID={artifact.tokenId}
            type={artifact.contentType}
          />
          <div className="card-transfer-btn" onClick={onClickTransfer}>
            <img src={`${CDN_URL}/icons/ic-exchange-horizontal.svg`} />
            <p>Transfer Artifact</p>
          </div>
        </ImageContainer>
        <InfoContainer md="6">
          <Title>{`Artifact #${artifact.tokenId}`}</Title>
          <p className="name-detail">Artifact details</p>
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
              link={`${network.current.Explorer}/address/${ARTIFACT_CONTRACT}`}
              content={shortenAddress(ARTIFACT_CONTRACT.toLowerCase(), 4)}
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
        </InfoContainer>
      </Container>
    </BaseModal>
  );
};

export default ArtifactInfoModal;
