import BaseModal from '@/components/BaseModal';
import { ICollection } from '@/interfaces/api/collection';
import { Container } from './CollectionModal.styled';

type Props = {
  show: boolean;
  handleClose: () => void;
  collection: ICollection;
};

const CollectionModal = (props: Props) => {
  const { show = false, handleClose } = props;

  return (
    <BaseModal show={show} handleClose={handleClose} width={1000}>
      <Container></Container>
    </BaseModal>
  );
};

export default CollectionModal;
