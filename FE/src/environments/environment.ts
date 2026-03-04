export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',  // Debe coincidir con: php spark serve --port=8080
  maxFileSizeMB: 10,  // Tamaño máximo de archivo en MB (configurable)
  active_debug: false,  // Habilitar logs de actividad de usuarios
  // DWH local (puerto 8082). Fallback cuando la BD no está disponible.
  vanguardia: {
    apiUrl: 'http://localhost:8082/nexfile/customers',
    ordersApiUrl: 'http://localhost:8082/nexfile/orders',
    invoicesApiUrl: 'http://localhost:8082/nexfile/invoices',
    uploadApiUrl: 'https://apisvanguardia.com:400/backblaze/upload'
  }
};
