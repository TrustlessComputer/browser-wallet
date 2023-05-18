import useProvider from '@/hooks/useProvider';
import WError, { ERROR_CODE } from '@/utils/error';
import { ethers } from 'ethers';
import { getWalletSigner } from '@/utils/contract.signer';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { compareString } from '@/utils';

export interface ISignTransactionPayload {
  from: string;
  to?: string;
  value?: string;
  calldata: string;
}

const useSignTransaction = () => {
  const provider = useProvider();
  const userSecretKey = useUserSecretKey();

  const estimateGas = async (payload: ISignTransactionPayload) => {
    if (!provider) {
      throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
    }
    const gasLimit = await provider.estimateGas({
      from: payload.from,
      to: payload.to,
      data: payload.calldata,
      value: ethers.BigNumber.from(payload.value || '0'),
    });
    return gasLimit.toNumber();
  };

  const createAndSendTransaction = async (payload: ISignTransactionPayload) => {
    if (!provider || !userSecretKey) {
      throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
    }
    const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);

    if (payload.from && !compareString({ str1: walletSigner.address, str2: payload.from, method: 'equal' })) {
      throw new WError(ERROR_CODE.SIGN_DIFF_ACCOUNT);
    }

    const gasLimit = await provider.estimateGas({
      from: payload.from,
      to: payload.to,
      data: payload.calldata,
      value: ethers.BigNumber.from(payload.value || '0'),
    });
    return gasLimit.toNumber();
  };

  return {
    estimateGas,
    createAndSendTransaction,
  };
};

export { useSignTransaction };
