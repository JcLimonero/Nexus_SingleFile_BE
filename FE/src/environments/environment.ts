export const environment = {
  production: false,
  
  // URLs de las APIs
  apiUrl: 'http://localhost:3500/api',
  authUrl: 'http://localhost:3500/auth',
  wsUrl: 'ws://localhost:3500',
  
  // URLs específicas por módulo
  expedienteApi: 'http://localhost:3500/api/expediente',
  configuracionApi: 'http://localhost:3500/api/configuracion',
  catalogosApi: 'http://localhost:3500/api/catalogos',
  usuariosApi: 'http://localhost:3500/api/user',
  
  // Configuración de la aplicación
  appName: 'SingleFile',
  appVersion: '1.0.0',
  
  // Configuración de paginación
  defaultPageSize: 10,
  pageSizeOptions: [10, 25, 50, 100],
  
  // Configuración de timeouts
  requestTimeout: 30000,
  retryAttempts: 3,
  
  // Configuración de logging
  enableLogging: true,
  logLevel: 'info'
};
