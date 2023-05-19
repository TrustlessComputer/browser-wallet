import React from 'react';
import IconSVG from '@/components/IconSVG';
import { CDN_URL_ICONS } from '@/configs';
import { Modal } from 'react-bootstrap';
import { StyledModal, Title, SubTitle } from './BaseModal.styled';

type Props = {
  title?: string;
  subTitle?: string;
  children: React.ReactElement;
  show: boolean;
  handleClose: () => void;
  width?: number;
  onScrollBody?: (event: React.UIEvent<HTMLDivElement>) => void;
};

const BaseModal = (props: Props) => {
  const { title, subTitle, children, show = false, handleClose, width, onScrollBody } = props;

  return (
    <StyledModal show={show} onHide={handleClose} centered width={width}>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer ic-close-anim"
          onClick={handleClose}
          src={`${CDN_URL_ICONS}/ic-close-dark.svg`}
          maxWidth="32"
          useDarkmode
        />
      </Modal.Header>
      <Modal.Body onScroll={onScrollBody}>
        {title && <Title className="header-title">{title}</Title>}
        {subTitle && <SubTitle>{subTitle}</SubTitle>}
        {children}
      </Modal.Body>
    </StyledModal>
  );
};

export default BaseModal;
