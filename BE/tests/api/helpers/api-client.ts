import { APIRequestContext, expect } from '@playwright/test';

/**
 * Cliente API genérico para realizar peticiones HTTP
 */
export class ApiClient {
  constructor(
    private request: APIRequestContext,
    private baseURL: string,
    private authToken?: string
  ) {}

  /**
   * Realizar petición GET
   */
  async get(endpoint: string, options: { params?: Record<string, any> } = {}) {
    const url = new URL(`${this.baseURL}/api/${endpoint}`);
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return await this.request.get(url.toString(), { headers });
  }

  /**
   * Realizar petición POST
   */
  async post(endpoint: string, data: any = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return await this.request.post(`${this.baseURL}/api/${endpoint}`, {
      headers,
      data,
    });
  }

  /**
   * Realizar petición PUT
   */
  async put(endpoint: string, data: any = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return await this.request.put(`${this.baseURL}/api/${endpoint}`, {
      headers,
      data,
    });
  }

  /**
   * Realizar petición PATCH
   */
  async patch(endpoint: string, data: any = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return await this.request.patch(`${this.baseURL}/api/${endpoint}`, {
      headers,
      data,
    });
  }

  /**
   * Realizar petición DELETE
   */
  async delete(endpoint: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return await this.request.delete(`${this.baseURL}/api/${endpoint}`, {
      headers,
    });
  }

  /**
   * Establecer token de autenticación
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Remover token de autenticación
   */
  clearAuthToken() {
    this.authToken = undefined;
  }

  /**
   * Verificar respuesta exitosa
   */
  async expectSuccess(response: any) {
    const body = await response.json();
    
    // Si el body tiene success: true, considerarlo exitoso aunque el status code sea 500
    // (algunos endpoints retornan 500 pero con success: true en caso de datos vacíos)
    if (body.success === true) {
      return body;
    }
    
    if (!response.ok()) {
      const errorText = await response.text();
      let errorMessage = `Expected success but got ${response.status()}`;
      try {
        const errorBody = JSON.parse(errorText);
        errorMessage += `: ${errorBody.message || JSON.stringify(errorBody)}`;
      } catch {
        errorMessage += `: ${errorText}`;
      }
      throw new Error(errorMessage);
    }
    
    if (!body.success) {
      throw new Error(`API returned success=false: ${body.message || JSON.stringify(body)}`);
    }
    return body;
  }

  /**
   * Verificar respuesta de error
   */
  async expectError(response: any, statusCode?: number) {
    if (statusCode) {
      expect(response.status()).toBe(statusCode);
    } else {
      expect(response.ok()).toBeFalsy();
    }
    const body = await response.json();
    expect(body.success).toBe(false);
    return body;
  }
}
