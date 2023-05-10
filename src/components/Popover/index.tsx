import React, { PropsWithChildren } from 'react';
import { PopoverWrapper, OverlayWrapper, Wrapper } from './styled';

interface IProps extends PropsWithChildren {
  icon?: React.ReactNode;
  width?: number;
  element?: React.ReactNode;
  unwrapElement?: React.ReactNode;
}

const Dropdown = React.memo(({ icon, element, width, children, unwrapElement }: IProps) => {
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
        <PopoverWrapper width={width} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
          {children}
        </PopoverWrapper>
      }
      container={ref}
      show={show}
    >
      {unwrapElement ? (
        <div ref={ref} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
          {unwrapElement}
        </div>
      ) : (
        <Wrapper ref={ref} show={show} onMouseEnter={handleOnMouseEnter} onMouseLeave={handleOnMouseLeave}>
          {icon && icon}
          {element && element}
        </Wrapper>
      )}
    </OverlayWrapper>
  );
});

export default Dropdown;
