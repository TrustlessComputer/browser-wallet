import { TC_SDK } from '@/lib';
import { ICreateInscribeParams, ISendBTCParams } from '@/interfaces/use-bitcoin';
import { useContext } from 'react';
import { AssetsContext } from '@/contexts/assets.context';
import { ICollectedUTXOResp } from '@/interfaces/api/bitcoin';
import { useUserSecretKey } from '@/state/wallet/hooks';
import { ITCTxDetail } from '@/interfaces/transaction';
import WError, { ERROR_CODE } from '@/utils/error';
import Token from '@/constants/token';
import BigNumber from 'bignumber.js';
import convert from '@/utils/convert';

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
      utxos: assets.txrefs,
      inscriptions: {},
      tcTxIDs: payload.tcTxIDs,
      feeRatePerByte: payload.feeRate,
    });
    return tx;
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
    return unInscribeTxs;
  };

  const onSendBTC = async ({ receiver, amount, feeRate }: ISendBTCParams) => {
    const assets = await _getAssetsCreateTx();
    if (!assets || !userSecretKey?.btcPrivateKeyBuffer) throw new Error('Can not load assets');
    const { txHex } = await TC_SDK.createTx(
      userSecretKey.btcPrivateKeyBuffer,
      assets.txrefs,
      assets.inscriptions_by_outputs,
      '',
      receiver,
      new BigNumber(
        convert.toOriginalAmount({
          humanAmount: amount,
          decimals: Token.BITCOIN.decimal,
        }),
      ),
      feeRate,
      true,
    );

    // broadcast tx
    await TC_SDK.broadcastTx(txHex);
  };

  return {
    getAssetsCreateTx: _getAssetsCreateTx,
    createInscribeTx,
    getUnInscribedTransactions,
    getUnInscribedTransactionDetails,
    onSendBTC,
  };
};

export default useBitcoin;
