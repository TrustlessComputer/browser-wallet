import React, { PropsWithChildren } from 'react';
import { PopoverWrapper, OverlayWrapper, IconWrapper } from './styled';

interface IProps extends PropsWithChildren {
  icon: React.ReactNode;
}
const Dropdown = React.memo(({ icon, children }: IProps) => {
  const [show, setShow] = React.useState(false);
  const ref = React.useRef(null);

  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };

  return (
    <OverlayWrapper
      trigger={['hover', 'focus']}
      placement="bottom-start"
      overlay={
        <PopoverWrapper onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
          {children}
        </PopoverWrapper>
      }
      container={ref}
      show={show}
    >
      <IconWrapper ref={ref} onClick={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
        {icon}
      </IconWrapper>
    </OverlayWrapper>
  );
});

export default Dropdown;
