import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL } from '@/configs';
import { Modal } from 'react-bootstrap';
import { StyledModal, Title } from './BaseModal.styled';

type Props = {
  title?: string;
  children: React.ReactElement;
  show: boolean;
  handleClose: () => void;
  width?: number;
};

const BaseModal = (props: Props) => {
  const { title, children, show = false, handleClose, width } = props;

  return (
    <StyledModal show={show} onHide={handleClose} centered width={width}>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close-dark.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        {title && <Title>{title}</Title>}
        {children}
      </Modal.Body>
    </StyledModal>
  );
};

export default BaseModal;
