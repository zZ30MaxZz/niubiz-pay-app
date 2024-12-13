export type MessageCode = {
    [key: string]: string;
};

export const messageCode: MessageCode = {
    '001': 'Error al generar token de seguridad',
    '002': 'Error al generar sessionKey',
    '003': 'Error al tokenizar tarjeta',
    '004': 'Error al autorizar pago',
    '005': 'Error en request',
};