export type IAuthStep = 'auth' | 'create' | 'import';

export interface ISetAuthStepProps {
  setStep: (step: IAuthStep) => void;
}

export enum CreateWalletSteps {
  backup,
  verifyPhrase,
  setPassword,
  created,
}
