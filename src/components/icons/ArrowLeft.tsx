import * as React from 'react';

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M15 7H4.667a.167.167 0 0 1-.167-.166v-2a.667.667 0 0 0-1.14-.474L.193 7.527a.667.667 0 0 0 0 .947l3.187 3.18a.668.668 0 0 0 .473.2.667.667 0 0 0 .667-.667v-2A.167.167 0 0 1 4.667 9H15a1 1 0 0 0 0-2Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default ArrowLeftIcon;
