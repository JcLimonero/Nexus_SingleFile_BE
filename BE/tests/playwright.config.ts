import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas de API
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './api',
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Fallar el build si accidentalmente dejaste test.only en el código */
  forbidOnly: !!process.env.CI,
  /* No ejecutar tests en CI por defecto, usar --ci flag */
  retries: process.env.CI ? 2 : 0,
  /* Limitar workers para evitar sobrecargar el servidor */
  workers: process.env.CI ? 1 : 2,
  /* Reporter a usar */
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  /* Configuración compartida para todos los proyectos */
  use: {
    /* Base URL para las pruebas */
    baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
    /* Headers por defecto */
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    /* Timeout para cada acción */
    actionTimeout: 30000,
    /* Timeout para navegación */
    navigationTimeout: 60000,
  },

  /* Configurar proyectos para diferentes escenarios */
  projects: [
    {
      name: 'api-tests',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Servidor de desarrollo - opcional, descomentar si necesitas iniciar el servidor antes de las pruebas */
  // webServer: {
  //   command: 'cd BE && php spark serve --port=8080',
  //   url: 'http://localhost:8080',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
