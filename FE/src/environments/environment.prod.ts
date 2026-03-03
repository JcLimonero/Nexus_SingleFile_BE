export const environment = {
  production: true,
  apiBaseUrl: 'http://74.208.78.55:8100',
  maxFileSizeMB: 10,  // Tamaño máximo de archivo en MB (configurable)
  active_debug: false,  // Habilitar logs de actividad de usuarios
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorderslastest',
    invoicesApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileinvoices',  // ← agregar esta línea
    uploadApiUrl: 'https://apisvanguardia.com:400/backblaze/upload'
  }
};
