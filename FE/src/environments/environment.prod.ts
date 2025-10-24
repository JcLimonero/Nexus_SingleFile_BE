export const environment = {
  production: true,
  apiBaseUrl: 'http://192.168.190.140:401',
  vanguardia: {
    apiUrl: 'http://192.168.190.140:401/api/vgd/singlefilecustomer',  // Usar proxy backend en producción
    ordersApiUrl: 'http://192.168.190.140:401/api/vgd/singlefileorders',  // Usar proxy backend en producción
    uploadApiUrl: 'http://192.168.190.140:401/api/backblaze/upload'  // Usar proxy backend en producción
  }
};
