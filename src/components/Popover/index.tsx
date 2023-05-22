import React, { PropsWithChildren, useEffect, useImperativeHandle } from 'react';
import { PopoverWrapper, OverlayWrapper, Wrapper } from './styled';
import { CDN_URL_ICONS } from '@/configs';
import IconSVG from '@/components/IconSVG';

interface IProps extends PropsWithChildren {
  icon?: React.ReactNode;
  width?: number;
  element?: React.ReactNode;
  unwrapElement?: React.ReactNode;
  closeDropdown?: boolean;
  type?: 'click' | 'hover';
}

export interface IDropdownRef {
  onToggle: () => void;
}

const Dropdown = React.forwardRef(
  (
    { icon, element, width, children, unwrapElement, closeDropdown, type = 'click' }: IProps,
    forwardedRef: React.ForwardedRef<IDropdownRef>,
  ) => {
    const [show, setShow] = React.useState(false);
    const ref = React.useRef(null);

    const handleOnMouseEnter = () => {
      setShow(true);
    };
    const handleOnMouseLeave = () => {
      setShow(false);
    };

    const onToggle = () => {
      setShow(!show);
    };

    useEffect(() => {
      if (closeDropdown) {
        setShow(false);
      }
    }, [closeDropdown]);

    useImperativeHandle(forwardedRef, () => ({
      onToggle,
    }));

    if (type === 'click') {
      return (
        <OverlayWrapper
          trigger={['click', 'focus']}
          placement="bottom-start"
          overlay={<PopoverWrapper width={width}>{children}</PopoverWrapper>}
          container={ref}
          show={show}
          onToggle={onToggle}
          rootClose
        >
          {unwrapElement ? (
            <div ref={ref}>{unwrapElement}</div>
          ) : (
            <Wrapper ref={ref} show={show}>
              <div className="element">
                {icon && icon}
                {element && element}
                <IconSVG
                  src={`${CDN_URL_ICONS}/ic-arrow-down-${!show ? 'dark' : 'light'}.svg`}
                  color="white"
                  maxWidth="14"
                />
              </div>
            </Wrapper>
          )}
        </OverlayWrapper>
      );
    }

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
            <div className="element">
              {icon && icon}
              {element && element}
            </div>
          </Wrapper>
        )}
      </OverlayWrapper>
    );
  },
);

export default Dropdown;
