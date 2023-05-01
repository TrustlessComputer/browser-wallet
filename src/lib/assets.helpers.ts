import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { IInscriptionByOutput } from '@/interfaces/api/bitcoin';

const formatUTXOs = (txrefs: TC_SDK.UTXO[]) => {
  const utxos: TC_SDK.UTXO[] = (txrefs || []).map(utxo => ({
    tx_hash: utxo.tx_hash,
    tx_output_n: new BigNumber(utxo.tx_output_n).toNumber(),
    value: new BigNumber(utxo.value),
  }));
  return utxos;
};

const formatInscriptions = (inscriptions: IInscriptionByOutput) => {
  const _inscriptions: IInscriptionByOutput = {};
  Object.keys(inscriptions).forEach(key => {
    const utxos = inscriptions[key];
    if (!!utxos && !!utxos.length) {
      _inscriptions[key] = utxos?.map(utxo => ({
        ...utxo,
        offset: new BigNumber(utxo.offset),
      }));
    }
  });
  return _inscriptions;
};

export { formatUTXOs, formatInscriptions };
