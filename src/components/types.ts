export interface TokenReturn {
  tokenSecurity: string;
}

export interface TokenSessionReturn {
  sessionKey: string;
  expirationTime: number;
}

export interface UseNiubizReturn {
  FormComponent: JSX.Element;
  triggerOpenForm: () => void;
}

export interface UseNiubizPayReturn {
  FormComponent: JSX.Element;
  triggerOpenForm: () => void;
  triggerSendForm: () => void;
  triggerResetForm: () => void;
  formResponse: any
}

export interface SessionRequest {
  amount: string
  antifraud: Antifraud
  channel: string
}

export interface Antifraud {
  merchantDefineData: MerchantDefineData
}

export interface MerchantDefineData {
  MDD4: string //email
  MDD32: string //document
  MDD75: string //Registrado
  MDD77: string //Dias registrado
}

export interface TokenizerResponse {
  bin: string
  transactionToken: string
  channel: string
}

export interface ErrorResponse {
  errorCode: number
  errorMessage: string
  data: Data
}

export interface Data { }

