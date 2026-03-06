// Archivo de ejemplo para la configuración de entorno
// Copiar este archivo a environment.ts y ajustar las URLs según el entorno

export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080' // Cambiar según el entorno de desarrollo
};

// Para diferentes entornos, crear archivos específicos:
// - environment.dev.ts (desarrollo)
// - environment.staging.ts (staging)
// - environment.prod.ts (producción)
