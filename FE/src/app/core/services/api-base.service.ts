import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {

  constructor() { }

  /**
   * Obtiene la URL base de la API desde el environment
   */
  getApiBaseUrl(): string {
    const baseUrl = environment.apiBaseUrl;
    console.log('🔍 ApiBaseService - URL desde environment:', baseUrl);
    
    if (!baseUrl || !baseUrl.startsWith('http')) {
      console.error('❌ ERROR: Environment apiBaseUrl no es válido:', baseUrl);
      throw new Error(`Environment apiBaseUrl no es válido: ${baseUrl}`);
    }
    
    return baseUrl;
  }

  /**
   * Construye la URL completa para un endpoint específico
   * @param endpoint - El endpoint de la API (ej: 'agency', 'user')
   * @returns URL completa
   */
  buildApiUrl(endpoint: string): string {
    // Asegurar que el endpoint comience con /
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    
    // Obtener la URL base desde el environment
    const baseUrl = this.getApiBaseUrl();
    
    // Construir URL absoluta completa
    const fullUrl = baseUrl + '/api' + endpoint;
    
    // Debug: verificar que la URL sea absoluta
    console.log(`🔗 Construyendo URL: ${endpoint} -> ${fullUrl}`);
    console.log(`🔍 URL es absoluta: ${fullUrl.startsWith('http')}`);
    console.log(`🔍 Base URL: ${baseUrl}`);
    
    // Forzar URL absoluta - verificar que no haya problemas de construcción
    if (!fullUrl.startsWith('http')) {
      console.error('❌ ERROR: URL no es absoluta:', fullUrl);
      throw new Error(`URL construida no es absoluta: ${fullUrl}`);
    }
    
    return fullUrl;
  }

  /**
   * Construye la URL para endpoints de autenticación
   * @param endpoint - El endpoint de autenticación
   * @returns URL completa
   */
  buildAuthUrl(endpoint: string): string {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    const baseUrl = this.getApiBaseUrl();
    return baseUrl + '/api/auth' + endpoint;
  }

  /**
   * Construye la URL para endpoints de WebSocket
   * @param endpoint - El endpoint de WebSocket
   * @returns URL completa
   */
  buildWsUrl(endpoint: string): string {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    const baseUrl = this.getApiBaseUrl();
    return baseUrl.replace('http', 'ws') + endpoint;
  }
}