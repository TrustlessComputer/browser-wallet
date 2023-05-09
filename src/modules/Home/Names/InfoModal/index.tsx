import BaseModal from '@/components/BaseModal';
import { IBNS } from '@/interfaces/bns';
import { Container } from './InfoModal.styled';
import { shortenAddress } from '@/utils';
import { CDN_URL } from '@/configs';
import DetailInfoItem from '@/components/DetailInfoItem';

type Props = {
  show: boolean;
  handleClose: () => void;
  bns: IBNS;
  onClickTransfer: () => void;
};

const BNSInfoModal = (props: Props) => {
  const { show = false, handleClose, bns, onClickTransfer } = props;

  return (
    <BaseModal show={show} handleClose={handleClose} title={bns.name} subTitle={`Name #${bns.id}`} width={600}>
      <Container>
        <p className="name-detail">Name details</p>

        <div className="item">
          <DetailInfoItem
            title="Owner (You)"
            type="address"
            address={bns.owner}
            content={shortenAddress(bns.owner, 4)}
          />
        </div>

        <div className="card-transfer-btn" onClick={onClickTransfer}>
          <img src={`${CDN_URL}/icons/ic-exchange-horizontal.svg`} />
          <p>Transfer Name</p>
        </div>
      </Container>
    </BaseModal>
  );
};

export default BNSInfoModal;
