import React from 'react';

interface IAccount {
  name: string;
  address: string;
}

interface IMoreItem {
  title: string;
  titleClass: string;
  icon: React.ReactNode;
  iconClass: string;
  onClick: (account: IAccount) => void;
}

export type { IAccount, IMoreItem };
