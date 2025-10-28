export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8081',  // Puerto correcto del backend
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',  // Llamada directa a Vanguardia
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorders',  // Llamada directa a Vanguardia
    uploadApiUrl: '/backblaze/upload'  // Usa proxy de Angular para agregar X-Provider-Token
  }
};
