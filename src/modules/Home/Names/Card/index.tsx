import { IBNS } from '@/interfaces/bns';
import { shortenAddress } from '@/utils';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { StyledBNSCard } from './BNSCard.styled';

type Props = {
  item: IBNS;
  onClick: (bns: IBNS) => void;
};

const BNSCard = ({ item, onClick }: Props) => {
  return (
    <StyledBNSCard className="card" onClick={() => onClick(item)}>
      <div className="card-content">
        <div className="card-info">
          <div className="title-container">
            <p className="card-title">{item.name}</p>
          </div>
          <div className="sub-container">
            <div className="sub-owner">
              <Jazzicon diameter={28} seed={jsNumberForAddress(item.owner)} />
              <p className="sub-address">{shortenAddress(item.owner, 4)}</p>
            </div>
            <p className="card-name">Name #{item.id}</p>
          </div>
        </div>
      </div>
    </StyledBNSCard>
  );
};

export default BNSCard;
