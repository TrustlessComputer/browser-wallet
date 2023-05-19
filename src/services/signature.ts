import { FunctionItem, FunctionItemResp } from '@/interfaces/api/signature';
import { apiClient } from '@/services/index';

// const BASE_URL = 'https://www.cyberscope.io/api/signaturescan';

const getSignatures = async (calldata: string): Promise<FunctionItem | undefined> => {
  const byte = calldata.slice(0, 10);
  const data: FunctionItemResp[] = await apiClient.post('/evm/bytescode', {
    bytescode: byte,
  });
  if (data && !!data.length) {
    const item = data[0];
    return {
      name: item.name.split('(')[0],
      function: item.name,
    };
  }
  return undefined;
};

export { getSignatures };
