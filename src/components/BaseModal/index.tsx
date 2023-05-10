import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL } from '@/configs';
import { Modal } from 'react-bootstrap';
import { StyledModal, Title, SubTitle } from './BaseModal.styled';

type Props = {
  title?: string;
  subTitle?: string;
  children: React.ReactElement;
  show: boolean;
  handleClose: () => void;
  width?: 1200 | 1000 | 800 | 600;
};

const BaseModal = (props: Props) => {
  const { title, subTitle, children, show = false, handleClose, width } = props;

  return (
    <StyledModal show={show} onHide={handleClose} centered width={width}>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer ic-close-anim"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close-dark.svg`}
          maxWidth="32"
        />
      </Modal.Header>
      <Modal.Body>
        {title && <Title>{title}</Title>}
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        {children}
      </Modal.Body>
    </StyledModal>
  );
};

export default BaseModal;
