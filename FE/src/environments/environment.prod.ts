export const environment = {
  production: true,
  apiBaseUrl: 'http://192.168.190.140:401',
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',  // Llamada directa a Vanguardia
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorders',  // Llamada directa a Vanguardia
    uploadApiUrl: 'http://192.168.190.140:401/api/backblaze/upload'  // Usa proxy backend para agregar X-Provider-Token
  }
};
