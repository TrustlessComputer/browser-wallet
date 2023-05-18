import { FunctionItem } from '@/interfaces/api/4byte';

// const BASE_URL = 'https://www.cyberscope.io/api/signaturescan';

const getSignatures = async (calldata: string): Promise<FunctionItem | undefined> => {
  // const byte = calldata.slice(0, 10);
  console.log(calldata);
  return undefined;
};

export { getSignatures };
