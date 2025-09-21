import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigLoaderService {
  
  constructor() {}

  /**
   * Obtiene la URL base de la API desde el environment
   */
  getApiBaseUrl(): string {
    const baseUrl = environment.apiBaseUrl;
    console.log('🔧 ConfigLoaderService - getApiBaseUrl desde environment:', baseUrl);
    return baseUrl;
  }

  /**
   * Verifica si estamos en modo producción
   */
  isProduction(): boolean {
    return environment.production;
  }

  /**
   * Obtiene la configuración completa del environment
   */
  getEnvironment() {
    return environment;
  }

  /**
   * Obtiene la configuración de Vanguardia
   */
  getVanguardiaConfig() {
    return environment.vanguardia;
  }

  /**
   * Obtiene la URL de upload de Vanguardia
   */
  getVanguardiaUploadUrl() {
    return environment.vanguardia.uploadApiUrl;
  }
}