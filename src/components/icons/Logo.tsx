import * as React from 'react';

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={60} height={60} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width={60} height={60} rx={8} fill="url(#a)" />
    <path
      d="M16.5 24a6 6 0 0 0-6 6v12a6 6 0 0 0 6 6h27a6 6 0 0 0 6-6V30a6 6 0 0 0-6-6H36a1.5 1.5 0 0 0-1.5 1.5 4.5 4.5 0 0 1-9 0A1.5 1.5 0 0 0 24 24h-7.5Z"
      fill="#fff"
    />
    <path
      d="M10.546 23.25A8.966 8.966 0 0 1 16.5 21h27c2.282 0 4.366.85 5.954 2.25A6 6 0 0 0 43.5 18h-27a6 6 0 0 0-5.954 5.25Z"
      fill="#fff"
      fillOpacity={0.6}
    />
    <path
      d="M10.546 17.25A8.966 8.966 0 0 1 16.5 15h27c2.282 0 4.366.85 5.954 2.25A6 6 0 0 0 43.5 12h-27a6 6 0 0 0-5.954 5.25Z"
      fill="#fff"
      fillOpacity={0.2}
    />
    <defs>
      <linearGradient id="a" x1={60} y1={0} x2={0} y2={60} gradientUnits="userSpaceOnUse">
        <stop stopColor="#B9B8E1" />
        <stop offset={0.359} stopColor="#ADA4F4" />
        <stop offset={0.703} stopColor="#9394F6" />
        <stop offset={1} stopColor="#A9AAF8" />
      </linearGradient>
    </defs>
  </svg>
);

export default LogoIcon;
