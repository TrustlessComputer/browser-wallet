import React from 'react';
import { setMasterCreated } from '@/state/wallet/reducer';
import { useAppDispatch } from '@/state/hooks';
import { ISetMasterCreated } from '@/state/wallet/types';
import UnlockContent from '@/modules/UnlockWallet/components/Content';

interface IProps {
  onSuccess?: () => void;
}

const AuthUnlock = React.memo((props: IProps) => {
  const dispatch = useAppDispatch();
  const onSuccess = async (data: ISetMasterCreated) => {
    dispatch(setMasterCreated(data));
    if (props.onSuccess) {
      props.onSuccess();
    }
  };
  return <UnlockContent onSuccess={onSuccess} />;
});

export default AuthUnlock;
