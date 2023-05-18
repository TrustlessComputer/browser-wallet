interface FunctionItemResp {
  text_signature: string;
  id: number;
}

interface FunctionItem {
  id: number;
  name: string;
  function: string;
}

export type { FunctionItem, FunctionItemResp };
