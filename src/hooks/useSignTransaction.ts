import useProvider from '@/hooks/useProvider';
import WError, { ERROR_CODE } from '@/utils/error';
import { ethers } from 'ethers';
import { getWalletSigner, getTransactionCount } from '@/utils/contract.signer';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { compareString } from '@/utils';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import useBitcoin from '@/hooks/useBitcoin';
import { ITCTxDetail } from '@/interfaces/transaction';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { IStatusCode } from '@/interfaces/history';
import historyStorage, { HistoryStorage } from '@/modules/Home/Transactions/storage';
import sleep from '@/utils/sleep';

export interface IEstimateGasPayload {
  from: string;
  to?: string;
  value?: string;
  calldata: string;
}

export interface ISignTransactionPayload extends IEstimateGasPayload {
  inscribeable: boolean;
  gasLimit: number;
  gasPrice: number;
  uninscribed: ITCTxDetail[];
  feeRate: number;
  method: string;
  site: string;
}

export interface ISignResp extends TransactionResponse {
  btcHash?: string;
}

const useSignTransaction = () => {
  const provider = useProvider();
  const userSecretKey = useUserSecretKey();
  const { createBatchInscribeTxs } = useBitcoin();

  const estimateGas = async (payload: IEstimateGasPayload) => {
    if (!provider) {
      throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
    }
    const gasLimit = await provider.estimateGas({
      from: payload.from,
      to: payload.to || undefined,
      data: payload.calldata,
      value: ethers.BigNumber.from(payload.value || '0'),
    });
    return Math.ceil(gasLimit.toNumber() * 1.2);
  };

  const createInscribeTransaction = async (transaction: TransactionResponse, payload: ISignTransactionPayload) => {
    const newTx: ITCTxDetail = {
      Hash: transaction.hash,
      Nonce: transaction.nonce,
      GasPrice: 0,
      Gas: 0,
      To: transaction.to || '',
      Value: new BigNumber(0).toNumber(),
      Input: '',
      V: 0,
      R: new BigNumber(0),
      S: new BigNumber(0),
      From: transaction.from,
      Type: transaction.type || 0,
    };
    const uninscribedBatchTxs = [...[newTx], ...payload.uninscribed];
    const batchInscribeTxResp = await createBatchInscribeTxs({
      feeRate: payload.feeRate,
      tcTxDetails: uninscribedBatchTxs,
    });
    let inscribeTx: ISignResp | undefined;
    for (const submited of batchInscribeTxResp) {
      historyStorage.createInscribeTransactions(userSecretKey?.address || '', {
        tcHashs: submited.tcTxIDs,
        btcHash: submited.revealTxID,
        status: IStatusCode.PROCESSING,
        // remove sign transaction
        // the sign transaction will be updated by storage latter
        uninscribed: uninscribedBatchTxs.filter(
          item => !compareString({ str1: item.Hash, str2: newTx.Hash, method: 'equal' }),
        ),
      });
      const isExist = submited.tcTxIDs.some(tcTxID =>
        compareString({ str1: tcTxID, str2: transaction.hash, method: 'equal' }),
      );
      if (isExist) {
        inscribeTx = {
          ...Object(transaction),
          btcHash: submited.revealTxID,
        };
      }
    }
    return inscribeTx;
  };

  const createAndSendTransaction = async (payload: ISignTransactionPayload): Promise<ISignResp | undefined> => {
    if (!provider || !userSecretKey) {
      throw new WError(ERROR_CODE.ACCOUNT_EMPTY);
    }
    const walletSigner = getWalletSigner(userSecretKey.privateKey, provider);

    const { inscribeable } = payload;
    if (payload.from && !compareString({ str1: walletSigner.address, str2: payload.from, method: 'equal' })) {
      throw new WError(ERROR_CODE.SIGN_DIFF_ACCOUNT);
    }

    const nonce = await getTransactionCount(userSecretKey.address, provider);
    const transaction: TransactionResponse = await walletSigner.sendTransaction({
      from: payload.from,
      to: payload.to || undefined,
      data: payload.calldata,
      value: ethers.BigNumber.from(payload.value || '0'),
      gasLimit: Web3.utils.toHex(payload.gasLimit || 0),
      gasPrice: Web3.utils.toHex(payload.gasPrice || 0),
      nonce: nonce,
    });

    let history = HistoryStorage.HistoryCreateTransactionBuilder({
      methodType: payload.method,
      site: payload.site,
      tx: transaction,
      btcHash: undefined,
    });

    if (!inscribeable) {
      if (history) {
        historyStorage.setTransaction(userSecretKey.address, history);
      }
      return {
        ...Object(transaction),
        btcHash: undefined,
      };
    }

    // case inscribe
    try {
      await sleep(1);
      const inscribeTx = await createInscribeTransaction(transaction, payload);
      history = HistoryStorage.HistoryCreateTransactionBuilder({
        btcHash: inscribeTx?.btcHash,
        methodType: payload.method,
        site: payload.site,
        tx: transaction,
      });

      if (history) {
        historyStorage.setTransaction(userSecretKey.address, history);
      }
      return inscribeTx;
    } catch (error) {
      if (history) {
        historyStorage.setTransaction(userSecretKey.address, history);
      }
      throw error;
    }
  };

  return {
    estimateGas,
    createAndSendTransaction,
  };
};

export { useSignTransaction };
