import { Container, Styled } from './DetailInfoItem.styled';
import { CDN_URL } from '@/configs';
import CopyIcon from '@/components/icons/Copy';
import { useNavigate } from 'react-router-dom';

type Props = {
  type: 'address' | 'link' | 'string';
  title: string;
  content: string;
  link?: string;
  address?: string;
};

const DetailInfoItem = (props: Props) => {
  const { title, type, content, link, address } = props;
  const navigate = useNavigate();

  return (
    <Container>
      <p className="item-title">{title}</p>
      <Styled>
        {type === 'string' && <p>{content}</p>}
        {type === 'address' && address && (
          <>
            <p>{content}</p>
            <CopyIcon className="ic-copy" content={address} />
          </>
        )}
        {type === 'link' && link && (
          <>
            <a href={link} target={'_blank'}>
              {content}
            </a>
            <img className="ic-copy" src={`${CDN_URL}/icons/ic-export.svg`} onClick={() => navigate(link)} />
          </>
        )}
      </Styled>
    </Container>
  );
};

export default DetailInfoItem;
