export const environment = {
  production: true,
  apiBaseUrl: 'https://app-nexusqtech.com:8100',
  maxFileSizeMB: 10,  // Tamaño máximo de archivo en MB (configurable)
  active_debug: false,  // Habilitar logs de actividad de usuarios
  dwh: {
    // Fallback: BE proxy (8100) reenvía al DWH con token; no llamar DWH directo (requiere X-Provider-Token)
    apiUrl: 'https://app-nexusqtech.com:8100/api/vgd/NexFilecustomer',
    ordersApiUrl: 'https://app-nexusqtech.com:8100/api/vgd/NexFileorderslastest',
    invoicesApiUrl: 'https://app-nexusqtech.com:8100/api/vgd/NexFileinvoices'
  }
};
