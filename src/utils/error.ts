export const ERROR_CODE = {
  CONNECT_WALLET: '3000',
  EMPTY_USER: '-3001',
  FIND_CURRENT_ACCOUNT: '-3002',
  ACCOUNT_EMPTY: '-3003',
  HAVE_UN_INSCRIBE_TX: '-3004',
  ADDRESS_NOT_FOUND: '-3005',
  FEE_RATE_INVALID: '-3006',
  INVALID_PARAMS: '-3007',
  TX_SIZE: '-3008',
  SIGN_DIFF_ACCOUNT: '-3009',
};

export const ERROR_MESSAGE = {
  [ERROR_CODE.CONNECT_WALLET]: {
    message: 'Can not connect wallet.',
    desc: 'Can not connect wallet.',
  },
  [ERROR_CODE.EMPTY_USER]: {
    message: 'Please reconnect wallet.',
    desc: 'Please reconnect wallet.',
  },
  [ERROR_CODE.FIND_CURRENT_ACCOUNT]: {
    message: 'Can not find current account by storage.',
    desc: 'Can not find current account by storage.',
  },
  [ERROR_CODE.ACCOUNT_EMPTY]: {
    message: 'Please connect wallet.',
    desc: 'Please connect wallet.',
  },
  [ERROR_CODE.HAVE_UN_INSCRIBE_TX]: {
    message: 'You have some pending transactions. Please complete all of them before moving on.',
    desc: 'You have some pending transactions. Please complete all of them before moving on.',
  },
  [ERROR_CODE.ADDRESS_NOT_FOUND]: {
    message: 'Address not found.',
    desc: 'Address not found.',
  },
  [ERROR_CODE.FEE_RATE_INVALID]: {
    message: 'Fee rate invalid.',
    desc: 'Fee rate invalid.',
  },
  [ERROR_CODE.INVALID_PARAMS]: {
    message: 'Invalid params.',
    desc: 'Invalid params.',
  },
  [ERROR_CODE.TX_SIZE]: {
    message: 'Invalid transaction size params.',
    desc: 'Invalid transaction size params.',
  },
  [ERROR_CODE.SIGN_DIFF_ACCOUNT]: {
    message: 'The account to sign is different from the request account.',
    desc: 'The account to sign is different from the request account.',
  },
};

class WError extends Error {
  message: string;
  code: string;
  desc: string;
  constructor(code: string, desc?: string) {
    super();
    const _error = ERROR_MESSAGE[code];
    this.message = `${_error.message} (${code})` || '';
    this.code = code;
    this.desc = desc || _error?.desc;
  }
  getMessage() {
    return this.message;
  }
}

const parseEtherError = (error: unknown) => {
  let message = '';
  const reason = Object(error)?.reason;
  if (reason && typeof reason === 'string') {
    message = reason;
  }
  // @ts-ignore
  const body = error?.body;
  if (body && typeof body === 'string') {
    const bodyObject = JSON.parse(body);
    if (bodyObject?.error?.message) {
      message = bodyObject?.error?.message;
    }
  }
  return message;
};

export const getErrorMessage = (error: unknown, name: string) => {
  let message = 'Something went wrong. Please try again later.';
  let desc = '';
  if (error instanceof WError) {
    message = error.getMessage();
    desc = error.desc + `(${error.code})`;
  } else if (error instanceof Error && error.message) {
    message = error.message;
    desc = error.message;

    const etherError = parseEtherError(error);
    if (etherError) {
      message = etherError;
      desc = JSON.stringify(error);
    }
  }

  console.error('TC error: ', desc, name);

  return {
    message: `${message} [${name}]`,
    desc: `${desc} [${name}]`,
  };
};

export default WError;
