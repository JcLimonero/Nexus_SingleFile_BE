export const environment = {
  production: true,
  apiBaseUrl: 'http://74.208.78.55:8100',
  maxFileSizeMB: 10,  // Tamaño máximo de archivo en MB (configurable)
  active_debug: false,  // Habilitar logs de actividad de usuarios
  vanguardia: {
    apiUrl: 'http://74.208.78.55:8101/nexfile/customers',
    ordersApiUrl: 'http://74.208.78.55:8101/nexfile/orders',
    invoicesApiUrl: 'http://74.208.78.55:8101/nexfile/invoices'
  }
};
