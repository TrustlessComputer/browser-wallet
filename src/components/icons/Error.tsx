import * as React from 'react';

const ErrorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={17} height={16} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clipPath="url(#a)">
      <path
        d="M16 15.487a.5.5 0 0 0 .44-.733l-7.5-14a.52.52 0 0 0-.88 0l-7.5 14a.487.487 0 0 0 .427.733H16Zm-7.5-1.833a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm0-8.167a.667.667 0 0 1 .667.667V9.8a.667.667 0 1 1-1.333 0V6.154a.667.667 0 0 1 .666-.667Z"
        fill="#CF304A"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M.5 0h16v16H.5z" />
      </clipPath>
    </defs>
  </svg>
);

export default ErrorIcon;
