import { test, expect } from '../helpers/fixtures';

test.describe('API DocumentType CRUD', () => {
  test('GET /api/document-type - Listar tipos de documento', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('document-type');
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.document_types) || Array.isArray(body.data)).toBe(true);
  });

  test('GET /api/document-type/search - Buscar tipos de documento', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('document-type', { params: { search: 'test' } });
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(Array.isArray(body.data.document_types) || Array.isArray(body.data)).toBe(true);
  });

  test('POST /api/document-type - Crear tipo de documento', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const documentTypeData = {
      Name: `Test Document Type ${Date.now()}`,
      Enabled: 1,
      Required: 0,
      ReqExpiration: 0,
    };

    const response = await apiClient.post('document-type', documentTypeData);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.Id || body.data.id).toBeTruthy();
  });

  test('GET /api/document-type/:id - Obtener tipo de documento por ID', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Primero crear un tipo de documento
    const documentTypeData = {
      Name: `Test Document Type ${Date.now()}`,
      Enabled: 1,
      Required: 0,
      ReqExpiration: 0,
    };

    const createResponse = await apiClient.post('document-type', documentTypeData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const documentTypeId = createBody.data.Id || createBody.data.id;

    // Obtener el tipo de documento
    const response = await apiClient.get(`document-type/${documentTypeId}`);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.document_type).toBeTruthy();
    const docTypeId = body.data.document_type.id || body.data.document_type.Id;
    expect(Number(docTypeId)).toBe(Number(documentTypeId));
  });

  test('PUT /api/document-type/:id - Actualizar tipo de documento', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Crear tipo de documento primero
    const documentTypeData = {
      Name: `Test Document Type ${Date.now()}`,
      Enabled: 1,
      Required: 0,
      ReqExpiration: 0,
    };

    const createResponse = await apiClient.post('document-type', documentTypeData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const documentTypeId = createBody.data.Id || createBody.data.id;

    // Actualizar tipo de documento
    const updateData = {
      Name: `Updated Document Type ${Date.now()}`,
      Enabled: 0,
    };

    const response = await apiClient.put(`document-type/${documentTypeId}`, updateData);
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.document_type).toBeTruthy();
    expect(body.data.document_type.name || body.data.document_type.Name).toBe(updateData.Name);
  });

  test('PATCH /api/document-type/:id/toggle-status - Cambiar estado', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    // Crear tipo de documento primero
    const documentTypeData = {
      Name: `Test Document Type ${Date.now()}`,
      Enabled: 1,
      Required: 0,
      ReqExpiration: 0,
    };

    const createResponse = await apiClient.post('document-type', documentTypeData);
    const createBody = await apiClient.expectSuccess(createResponse);
    const documentTypeId = createBody.data.Id || createBody.data.id;

    // Cambiar estado
    const response = await apiClient.patch(`document-type/${documentTypeId}/toggle-status`, {});
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
  });
});
