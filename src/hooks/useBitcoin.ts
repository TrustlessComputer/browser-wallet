import { TC_SDK } from '@/lib';
import {
  ICreateBatchInscribeParams,
  ICreateInscribeParams,
  ICreateSpeedUpBTCParams,
  IIsSpeedUpBTCParams,
  ISendBTCParams,
  ITCTxByHash,
  ITCTxByHashResp,
} from '@/interfaces/use-bitcoin';
import { useContext } from 'react';
import { AssetsContext } from '@/contexts/assets.context';
import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { ITCTxDetail } from '@/interfaces/transaction';
import WError, { ERROR_CODE } from '@/utils/error';
import Token from '@/constants/token';
import BigNumber from 'bignumber.js';
import convert from '@/utils/convert';
import { IStatusCode } from '@/interfaces/history';
import { convertHexToNumber } from '@/utils';

const useBitcoin = () => {
  const { getAssetsCreateTx } = useContext(AssetsContext);
  const userSecretKey = useUserSecretKey();
  const _getAssetsCreateTx = async (assets?: ICollectedUTXOResp) => {
    let _assets;
    if (assets) {
      _assets = assets;
    } else {
      _assets = await getAssetsCreateTx();
    }
    return _assets;
  };

  const createInscribeTx = async (payload: ICreateInscribeParams) => {
    const assets = await _getAssetsCreateTx(payload.assets);
    if (!assets || !userSecretKey?.btcPrivateKeyBuffer) throw new Error('Can not load assets');
    const tx = await TC_SDK.createInscribeTx({
      senderPrivateKey: userSecretKey.btcPrivateKeyBuffer,
      senderAddress: userSecretKey.btcAddress,
      utxos: assets.availableUTXOs,
      inscriptions: {},
      tcTxIDs: payload.tcTxIDs,
      feeRatePerByte: payload.feeRate,
    });
    return tx;
  };

  const createBatchInscribeTxs = async ({ tcTxDetails, feeRate }: ICreateBatchInscribeParams) => {
    const assets = await _getAssetsCreateTx();
    if (!assets || !userSecretKey?.btcPrivateKeyBuffer) throw new Error('Can not load assets');
    const res = await TC_SDK.createBatchInscribeTxs({
      senderPrivateKey: userSecretKey.btcPrivateKeyBuffer,
      senderAddress: userSecretKey.btcAddress,
      utxos: assets.availableUTXOs,
      inscriptions: {},
      tcTxDetails,
      feeRatePerByte: feeRate,
    });
    return res;
  };

  const getUnInscribedTransactions = async (tcAddress: string): Promise<Array<string>> => {
    if (!tcAddress) throw new WError(ERROR_CODE.HAVE_UN_INSCRIBE_TX);
    const { unInscribedTxIDs } = await window.tcClient.getUnInscribedTransactionByAddress(tcAddress);
    return unInscribedTxIDs;
  };

  const getUnInscribedTransactionDetails = async (tcAddress: string): Promise<ITCTxDetail[]> => {
    if (!tcAddress) throw new WError(ERROR_CODE.HAVE_UN_INSCRIBE_TX);
    const { unInscribedTxDetails: unInscribeTxs } = await window.tcClient.getUnInscribedTransactionDetailByAddress(
      tcAddress,
    );
    return unInscribeTxs.map(item => ({
      ...item,
      statusCode: 0,
    }));
  };

  const createSendBTCTx = async ({ receiver, amount, feeRate }: ISendBTCParams) => {
    const assets = await _getAssetsCreateTx();
    if (!assets || !userSecretKey?.btcPrivateKeyBuffer) throw new Error('Can not load assets');
    const sendAmount = new BigNumber(
      convert.toOriginalAmount({
        humanAmount: amount,
        decimals: Token.BITCOIN.decimal,
      }),
    );

    const { txHex } = await TC_SDK.createTx({
      senderAddress: userSecretKey.btcAddress,
      senderPrivateKey: userSecretKey.btcPrivateKeyBuffer,
      feeRatePerByte: feeRate,
      receiverInsAddress: receiver,
      utxos: assets.availableUTXOs,
      sendAmount: sendAmount,
      sendInscriptionID: '',
      inscriptions: {},
    });

    // broadcast tx
    await TC_SDK.broadcastTx(txHex);
  };

  const createSpeedUpBTCTx = async (payload: ICreateSpeedUpBTCParams): Promise<string> => {
    const assets = await _getAssetsCreateTx();
    if (!assets || !userSecretKey?.btcPrivateKeyBuffer) throw new Error('Can not load assets');
    const { revealTxID } = await TC_SDK.replaceByFeeInscribeTx({
      senderPrivateKey: userSecretKey.btcPrivateKeyBuffer,
      btcAddress: userSecretKey.btcAddress,
      utxos: assets.availableUTXOs,
      inscriptions: {},
      revealTxID: payload.btcHash,
      feeRatePerByte: payload.feeRate,
      tcAddress: payload.tcAddress,
    });
    return revealTxID;
  };

  const getTCTransactionByHash = async (tcTxID: string): Promise<ITCTxByHash> => {
    if (!tcTxID) throw Error('TC Hash not found');
    const resp: ITCTxByHashResp = (await window.tcClient.getTCTxByHash(tcTxID)) as any;
    return {
      hex: resp.Hex,
      hash: resp.hash,
      from: resp.from,
      to: resp.to,
      gas: convertHexToNumber(resp.gas),
      gasPrice: convertHexToNumber(resp.gasPrice),
      gasHex: resp.gas,
      gasPriceHex: resp.gasPrice,
      input: resp.input,
      nonce: convertHexToNumber(resp.nonce),
      value: resp.value,
    };
  };

  const getTCTransactionHex = async (tcTxID: string): Promise<string> => {
    if (!tcTxID) throw Error('TC Hash not found');
    const { Hex } = (await window.tcClient.getTCTxByHash(tcTxID)) as any;
    return Hex;
  };

  const getStatusCode = async (txHash: string, tcAddress: string): Promise<IStatusCode> => {
    if (tcAddress) {
      try {
        const res = await window.tcClient.getTCTxByHash(txHash);
        if (res && res.blockHash) {
          if (res.status === '0x0') {
            return IStatusCode.FAILED;
          }
          return IStatusCode.SUCCESS;
        }
      } catch (e) {
        return IStatusCode.FAILED;
      }
    }
    return IStatusCode.PROCESSING;
  };

  const getIsRBFable = async (payload: IIsSpeedUpBTCParams) => {
    try {
      const { isRBFable, oldFeeRate, minSat } = await TC_SDK.isRBFable({
        revealTxID: payload.btcHash,
        tcAddress: payload.tcAddress,
        btcAddress: payload.btcAddress,
      });
      return {
        isRBFable,
        oldFeeRate: Math.ceil(oldFeeRate),
        minSat: Math.ceil(minSat || 0),
      };
    } catch (e) {
      return {
        isRBFable: false,
        oldFeeRate: 0,
        minSat: 0,
      };
    }
  };

  return {
    getAssetsCreateTx: _getAssetsCreateTx,

    createInscribeTx,
    createBatchInscribeTxs,
    createSpeedUpBTCTx,
    createSendBTCTx,

    getUnInscribedTransactions,
    getUnInscribedTransactionDetails,
    getTCTransactionByHash,
    getTCTransactionHex,
    getStatusCode,
    getIsRBFable,
  };
};

export default useBitcoin;
