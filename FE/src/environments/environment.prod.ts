export const environment = {
  production: true,
  apiBaseUrl: 'https://apisvanguardia.com:401',
  maxFileSizeMB: 10,  // Tamaño máximo de archivo en MB (configurable)
  active_debug: false,  // Habilitar logs de actividad de usuarios
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',  // Llamada directa a Vanguardia
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorderslastest',  // Llamada directa a Vanguardia
    uploadApiUrl: 'https://apisvanguardia.com:400/backblaze/upload',  // Usa proxy backend para agregar X-Provider-Token
    invoicesApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileinvoices',  // Llamada directa a Vanguardia
  }
};
