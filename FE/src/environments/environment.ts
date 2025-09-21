export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
  backblaze: {
    apiUrl: 'https://apisvanguardia.com:400/backblaze', // Usar proxy en desarrollo
    providerToken: 'b26e88c4-ddbe-4adb-a214-4667f454824a'
  },
  vanguardia: {
    apiUrl: 'https://apisvanguardia.com:400/vgd/singlefilecustomer',
    ordersApiUrl: 'https://apisvanguardia.com:400/vgd/singlefileorders'
  }
};
