import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ConfigLoaderService } from './config-loader.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBaseService {

  constructor(private configLoader: ConfigLoaderService) { }

  /**
   * Obtiene la URL base de la API
   */
  getApiBaseUrl(): string {
    // Intentar obtener la URL desde la configuración externa primero
    const externalBaseUrl = this.configLoader.getApiBaseUrl();
    
    // Si la configuración externa está disponible, usarla
    if (externalBaseUrl && externalBaseUrl !== 'http://localhost:402') {
      console.log('🔍 ApiBaseService - Usando configuración externa:', externalBaseUrl);
      return externalBaseUrl;
    }
    
    // Fallback a la configuración del environment
    const baseUrl = environment.apiBaseUrl;
    console.log('🔍 ApiBaseService - Usando configuración de environment:', baseUrl);
    console.log('🔍 ApiBaseService - Environment completo:', environment);
    
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
    
    // Obtener la URL base (desde configuración externa o environment)
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
