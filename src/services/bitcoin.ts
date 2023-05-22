import { FeeRateName, IBlockStreamTxs, ICollectedUTXOResp, IFeeRate, IPendingUTXO } from '@/interfaces/api/bitcoin';
import * as TC_SDK from 'trustless-computer-sdk';
import { API_BLOCKSTREAM } from '@/configs';

// Collected UTXO
export const getCollectedUTXO = async (
  btcAddress: string,
  tcAddress: string,
): Promise<ICollectedUTXOResp | undefined> => {
  try {
    const collected = await TC_SDK.getUTXOs({
      btcAddress,
      tcAddress,
    });
    return collected;
  } catch (err) {
    console.log(err);
  }
};

export const getPendingUTXOs = async (btcAddress: string): Promise<IPendingUTXO[]> => {
  let pendingUTXOs = [];
  if (!btcAddress) return [];
  try {
    // https://blockstream.regtest.trustless.computer/regtest/api/address/bcrt1p7vs2w9cyeqpc7ktzuqnm9qxmtng5cethgh66ykjz9uhdaz0arpfq93cr3a/txs
    const res = await fetch(`${API_BLOCKSTREAM}/address/${btcAddress}/txs`).then(res => {
      return res.json();
    });
    pendingUTXOs = (res || []).filter((item: IPendingUTXO) => !item.status.confirmed);
  } catch (err) {
    return [];
  }
  return pendingUTXOs;
};

export const getBlockstreamTxs = async (btcAddress: string): Promise<IBlockStreamTxs[]> => {
  let txs = [];
  if (!btcAddress) return [];
  try {
    const res = await fetch(`${API_BLOCKSTREAM}/address/${btcAddress}/txs`).then(res => {
      return res.json();
    });
    txs = res;
  } catch (err) {
    return [];
  }
  return txs;
};

export const getFeeRate = async (): Promise<IFeeRate> => {
  try {
    const res = await fetch('https://mempool.space/api/v1/fees/recommended');
    const fee: IFeeRate = await res.json();
    if (fee[FeeRateName.fastestFee] <= 10) {
      return {
        [FeeRateName.fastestFee]: 15,
        [FeeRateName.halfHourFee]: 10,
        [FeeRateName.hourFee]: 5,
      };
    }
    return fee;
  } catch (err: unknown) {
    console.log(err);
    return {
      [FeeRateName.fastestFee]: 25,
      [FeeRateName.halfHourFee]: 20,
      [FeeRateName.hourFee]: 15,
    };
  }
};
