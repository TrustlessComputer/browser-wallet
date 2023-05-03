import React from 'react';
import { LayoutContent } from '@/pages/layout';
import UnlockContent from './components/Content';
import { setMasterCreated } from '@/state/wallet/reducer';
import { useAppDispatch } from '@/state/hooks';
import { ISetMasterCreated } from '@/state/wallet/types';

const UnlockWallet = React.memo(() => {
  const dispatch = useAppDispatch();
  const onSuccess = async (data: ISetMasterCreated) => {
    dispatch(setMasterCreated(data));
  };
  return (
    <LayoutContent>
      <UnlockContent onSuccess={onSuccess} />
    </LayoutContent>
  );
});

export default UnlockWallet;
