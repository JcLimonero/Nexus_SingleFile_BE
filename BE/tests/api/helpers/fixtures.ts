import { test as base } from '@playwright/test';
import { ApiClient } from './api-client';
import { AuthHelper, AuthTokens } from './auth';

type TestFixtures = {
  apiClient: ApiClient;
  authHelper: AuthHelper;
  authTokens: AuthTokens;
  request: any; // APIRequestContext from Playwright
};

/**
 * Fixtures personalizados para las pruebas
 * Proporciona acceso a ApiClient y AuthHelper
 */
export const test = base.extend<TestFixtures>({
  apiClient: async ({ request }, use) => {
    const baseURL = process.env.API_BASE_URL || 'http://localhost:8080';
    const client = new ApiClient(request, baseURL);
    await use(client);
  },

  authHelper: async ({ request }, use) => {
    const baseURL = process.env.API_BASE_URL || 'http://localhost:8080';
    const helper = new AuthHelper(request, baseURL);
    await use(helper);
  },

  authTokens: async ({ authHelper }, use) => {
    // Credenciales de prueba - ajustar según tu entorno
    // NOTA: El password debe ser texto plano, NO el hash bcrypt
    const testEmail = process.env.TEST_EMAIL || 'admin@nexusqtech.com';
    const testPassword = process.env.TEST_PASSWORD || 'admin123';

    const tokens = await authHelper.login(testEmail, testPassword);
    await use(tokens);

    // Cleanup: logout después de las pruebas
    try {
      await authHelper.logout(tokens.accessToken);
    } catch (e) {
      // Ignorar errores de logout en cleanup
    }
  },
});

export { expect } from '@playwright/test';
