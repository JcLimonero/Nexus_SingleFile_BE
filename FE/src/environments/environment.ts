export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',  // Debe coincidir con: php spark serve --port=8080
  maxFileSizeMB: 10,  // Tamaño máximo de archivo en MB (configurable)
  active_debug: false,  // Habilitar logs de actividad de usuarios
  // Fallback cuando la BD no está disponible. Las URLs reales se obtienen de config (group_api_url).
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorderslastest',
    invoicesApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileinvoices',
    uploadApiUrl: 'https://apisvanguardia.com:400/backblaze/upload'
  }
};
