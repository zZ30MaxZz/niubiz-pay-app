export interface NotificationProps {
  type: "success" | "info" | "warning" | "error";
  message: string;
  onClose: () => void;
  animation?: "fade" | "pop" | "slide";
}

// Define the allowed positions
export type PositionType =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

// Define the properties of a notification
export interface NotificationProps {
  type: "success" | "info" | "warning" | "error";
  message: string;
  duration: number;
  animation?: "fade" | "pop" | "slide";
}

// Define the return type of the hook
export interface UseNotificationReturn {
  NotificationComponent: JSX.Element;
  triggerNotification: (notificationProps: NotificationProps) => void;
}


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


export interface SessionRequest {
  amount: number
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
