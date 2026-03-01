import { test, expect } from '../helpers/fixtures';

test.describe('API Analytics', () => {
  test('GET /api/analytics/dashboard - Obtener datos del dashboard', async ({ apiClient, authTokens }) => {
    apiClient.setAuthToken(authTokens.accessToken);

    const response = await apiClient.get('analytics/dashboard');
    const body = await apiClient.expectSuccess(response);

    expect(body.data).toBeTruthy();
    expect(body.data.userActivity).toBeTruthy();
    expect(body.data.documents).toBeTruthy();
    expect(body.data.processes).toBeTruthy();
    expect(body.data.agencies).toBeTruthy();
    expect(body.data.system).toBeTruthy();
  });
});
