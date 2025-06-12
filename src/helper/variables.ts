export const CHANEL_WEB = "web" as const;
export const CHANEL_PAYCARD = "paycard" as const;

export type Channel = typeof CHANEL_WEB | typeof CHANEL_PAYCARD;
