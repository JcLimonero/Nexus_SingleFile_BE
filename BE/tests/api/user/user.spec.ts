import { test, expect } from '../helpers/fixtures';

test.describe('API User CRUD', () => {
  test('GET /api/user - Listar usuarios', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('user');
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.users) || Array.isArray(body.data)).toBe(true);
  });

  test('GET /api/user/search - Buscar usuarios', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('user', { params: { search: 'test' } });
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.users) || Array.isArray(body.data)).toBe(true);
  });

  test('POST /api/user - Crear usuario', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const userData = {
      Name: `Test User ${Date.now()}`,
      User: `testuser${Date.now()}`,
      Mail: `test${Date.now()}@example.com`,
      Pass: 'Test123!@#',
      Enabled: 1,
      IdUserRol: 1,
      DefaultAgency: 1,
    };

    const response = await apiClient.post('user', userData);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.Id || body.data.id).toBeTruthy();
  });

  test('GET /api/user/:id - Obtener usuario por ID', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Primero crear un usuario
    const userData = {
      Name: `Test User ${Date.now()}`,
      User: `testuser${Date.now()}`,
      Mail: `test${Date.now()}@example.com`,
      Pass: 'Test123!@#',
      Enabled: 1,
      IdUserRol: 1,
      DefaultAgency: 1,
    };

    const createResponse = await apiClient.post('user', userData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const userId = createBody.data.Id || createBody.data.id;

    // Obtener el usuario
    const response = await apiClient.get(`user/${userId}`);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(String(body.data.Id ?? body.data.id)).toBe(String(userId));
  });

  test('PUT /api/user/:id - Actualizar usuario', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Crear usuario primero
    const userData = {
      Name: `Test User ${Date.now()}`,
      User: `testuser${Date.now()}`,
      Mail: `test${Date.now()}@example.com`,
      Pass: 'Test123!@#',
      Enabled: 1,
      IdUserRol: 1,
      DefaultAgency: 1,
    };

    const createResponse = await apiClient.post('user', userData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const userId = createBody.data.Id || createBody.data.id;

    // Actualizar usuario
    const updateData = {
      Name: `Updated User ${Date.now()}`,
      Enabled: 0,
    };

    const response = await apiClient.put(`user/${userId}`, updateData);
    const body = await apiClient.expectSuccess(response);

    expect(body.success).toBe(true);
    // El API puede o no devolver data; si lo hace, verificar el nombre
    if (body.data) {
      expect(body.data.Name || body.data.name).toBe(updateData.Name);
    }
  });

  test('GET /api/user/check-username - Verificar disponibilidad de username', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('user/check-username', { params: { username: `testuser${Date.now()}` } });
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(typeof body.data.available).toBe('boolean');
  });

  test('GET /api/user/check-email - Verificar disponibilidad de email', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('user/check-email', { params: { email: `test${Date.now()}@example.com` } });
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(typeof body.data.available).toBe('boolean');
  });
});
