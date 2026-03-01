import { APIRequestContext, expect } from '@playwright/test';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: any;
}

/**
 * Helper para autenticación en las pruebas
 */
export class AuthHelper {
  constructor(private request: APIRequestContext, private baseURL: string) {}

  /**
   * Realizar login y obtener tokens
   */
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await this.request.post(`${this.baseURL}/api/auth/login`, {
      data: {
        email,
        password,
      },
    });

    if (!response.ok()) {
      const errorBody = await response.text();
      throw new Error(`Login failed: ${response.status()} - ${errorBody}`);
    }

    const body = await response.json();
    
    if (!body.success) {
      throw new Error(`Login failed: ${body.message || 'Unknown error'}`);
    }

    expect(body.access_token).toBeTruthy();
    expect(body.refresh_token).toBeTruthy();

    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      user: body.user,
    };
  }

  /**
   * Verificar token JWT
   */
  async verifyToken(token: string): Promise<boolean> {
    const response = await this.request.post(`${this.baseURL}/api/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const body = await response.json();
    return body.success === true;
  }

  /**
   * Refrescar access token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/api/auth/refresh`, {
      data: {
        refresh_token: refreshToken,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.access_token).toBeTruthy();

    return body.access_token;
  }

  /**
   * Logout
   */
  async logout(accessToken: string): Promise<void> {
    const response = await this.request.post(`${this.baseURL}/api/auth/logout`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.success).toBe(true);
  }

  /**
   * Obtener headers con autenticación
   */
  getAuthHeaders(accessToken: string): Record<string, string> {
    return {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }
}
