import * as React from 'react';

const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M8 .894C3.773.894.333 3.727.333 7.207a5.727 5.727 0 0 0 2.113 4.36L.92 14.627a.327.327 0 0 0 .06.38.334.334 0 0 0 .38.067l4.093-1.907c.827.24 1.685.362 2.547.36 4.226 0 7.666-2.833 7.666-6.32S12.226.894 8 .894Zm0 10a1 1 0 1 1 1-1 1 1 0 0 1-1 1.02v-.02Zm0-7.667a.667.667 0 0 1 .666.667V7.56a.667.667 0 0 1-1.333 0V3.894A.667.667 0 0 1 8 3.227Z"
        fill="#FFC043"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default WarningIcon;
