export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  vanguardia: {
    apiUrl: '/vgd/singlefilecustomer',  // Usar proxy en desarrollo
    ordersApiUrl: '/vgd/singlefileorders',  // Usar proxy en desarrollo
    uploadApiUrl: '/backblaze/upload'  // Usar proxy en desarrollo
  }
};
