import { test, expect } from '../helpers/fixtures';

test.describe('API Process CRUD', () => {
  test('GET /api/process - Listar procesos', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('process');
    const body = await apiClient.expectSuccess(response);

    // La respuesta puede tener body.data.processes o body.data directamente como array
    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.processes) || Array.isArray(body.data)).toBe(true);
  });

  test('GET /api/process/search - Buscar procesos', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // El endpoint search espera el parámetro 'q' (no 'search') y requiere al menos 2 caracteres
    const response = await apiClient.get('process/search', { params: { q: 'proceso' } });
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.processes)).toBe(true);
  });

  test('GET /api/process/stats - Obtener estadísticas', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('process/stats');
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(typeof body.data.total).toBe('number');
  });

  test('POST /api/process - Crear proceso', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const processData = {
      Name: `Test Process ${Date.now()}`,
      Enabled: 1,
    };

    const response = await apiClient.post('process', processData);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.Id || body.data.id).toBeTruthy();
  });

  test('GET /api/process/:id - Obtener proceso por ID', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Primero crear un proceso
    const processData = {
      Name: `Test Process ${Date.now()}`,
      Enabled: 1,
    };

    const createResponse = await apiClient.post('process', processData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const processId = createBody.data.Id || createBody.data.id;

    // Obtener el proceso
    const response = await apiClient.get(`process/${processId}`);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.Id || body.data.id).toBe(processId);
  });

  test('PUT /api/process/:id - Actualizar proceso', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Crear proceso primero
    const processData = {
      Name: `Test Process ${Date.now()}`,
      Enabled: 1,
    };

    const createResponse = await apiClient.post('process', processData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const processId = createBody.data.Id || createBody.data.id;

    // Actualizar proceso
    const updateData = {
      Name: `Updated Process ${Date.now()}`,
      Enabled: 0,
    };

    const response = await apiClient.put(`process/${processId}`, updateData);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.Name || body.data.name).toBe(updateData.Name);
  });

  test('PATCH /api/process/:id/estado - Cambiar estado', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Crear proceso primero
    const processData = {
      Name: `Test Process ${Date.now()}`,
      Enabled: 1,
    };

    const createResponse = await apiClient.post('process', processData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const processId = createBody.data.Id || createBody.data.id;

    // Cambiar estado
    const response = await apiClient.patch(`process/${processId}/estado`, {});
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
  });
});
