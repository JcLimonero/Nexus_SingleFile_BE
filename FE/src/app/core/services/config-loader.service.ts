import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ApiConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  environment: {
    production: boolean;
    debug: boolean;
    version: string;
  };
  features: {
    enableLogging: boolean;
    enableErrorReporting: boolean;
    enablePerformanceMonitoring: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConfigLoaderService {
  private configSubject = new BehaviorSubject<ApiConfig | null>(null);
  private configCache: ApiConfig | null = null;
  private configLoaded = false;

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuración desde el archivo JSON externo
   */
  loadConfig(): Observable<ApiConfig> {
    if (this.configCache && this.configLoaded) {
      return of(this.configCache);
    }

    return this.http.get<ApiConfig>('/assets/config/api-config.json').pipe(
      tap(config => {
        this.configCache = config;
        this.configLoaded = true;
        this.configSubject.next(config);
        console.log('🔧 Configuración cargada desde archivo externo:', config);
      }),
      catchError(error => {
        console.warn('⚠️ No se pudo cargar configuración externa, usando configuración por defecto:', error);
        // Retornar configuración por defecto si no se puede cargar el archivo
        const defaultConfig: ApiConfig = {
          api: {
            baseUrl: 'http://192.168.190.140:401',
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000
          },
          environment: {
            production: true,
            debug: false,
            version: '1.0.0'
          },
          features: {
            enableLogging: true,
            enableErrorReporting: true,
            enablePerformanceMonitoring: false
          }
        };
        
        this.configCache = defaultConfig;
        this.configLoaded = true;
        this.configSubject.next(defaultConfig);
        return of(defaultConfig);
      })
    );
  }

  /**
   * Obtiene la configuración actual (síncrono)
   */
  getConfig(): ApiConfig | null {
    // Si no hay configuración cargada, intentar cargarla
    if (!this.configCache && !this.configLoaded) {
      console.log('🔧 ConfigLoaderService - Configuración no cargada, iniciando carga...');
      this.loadConfig().subscribe();
    }
    return this.configCache;
  }

  /**
   * Obtiene la configuración como Observable
   */
  getConfigObservable(): Observable<ApiConfig | null> {
    return this.configSubject.asObservable();
  }

  /**
   * Obtiene la URL base de la API
   */
  getApiBaseUrl(): string {
    const config = this.getConfig();
    const baseUrl = config?.api.baseUrl || 'http://192.168.190.140:401';
    console.log('🔧 ConfigLoaderService - getApiBaseUrl:', baseUrl);
    console.log('🔧 ConfigLoaderService - Config cargada:', !!config);
    return baseUrl;
  }

  /**
   * Obtiene el timeout de las peticiones
   */
  getApiTimeout(): number {
    const config = this.getConfig();
    return config?.api.timeout || 30000;
  }

  /**
   * Obtiene el número de intentos de reintento
   */
  getRetryAttempts(): number {
    const config = this.getConfig();
    return config?.api.retryAttempts || 3;
  }

  /**
   * Obtiene el delay entre reintentos
   */
  getRetryDelay(): number {
    const config = this.getConfig();
    return config?.api.retryDelay || 1000;
  }

  /**
   * Verifica si está en modo producción
   */
  isProduction(): boolean {
    const config = this.getConfig();
    return config?.environment.production || true;
  }

  /**
   * Verifica si el debug está habilitado
   */
  isDebugEnabled(): boolean {
    const config = this.getConfig();
    return config?.environment.debug || false;
  }

  /**
   * Verifica si el logging está habilitado
   */
  isLoggingEnabled(): boolean {
    const config = this.getConfig();
    return config?.features.enableLogging || true;
  }

  /**
   * Verifica si el reporte de errores está habilitado
   */
  isErrorReportingEnabled(): boolean {
    const config = this.getConfig();
    return config?.features.enableErrorReporting || true;
  }

  /**
   * Verifica si el monitoreo de rendimiento está habilitado
   */
  isPerformanceMonitoringEnabled(): boolean {
    const config = this.getConfig();
    return config?.features.enablePerformanceMonitoring || false;
  }

  /**
   * Recarga la configuración desde el archivo
   */
  reloadConfig(): Observable<ApiConfig> {
    this.configCache = null;
    this.configLoaded = false;
    return this.loadConfig();
  }

  /**
   * Limpia la caché de configuración
   */
  clearCache(): void {
    this.configCache = null;
    this.configLoaded = false;
    this.configSubject.next(null);
    console.log('🔧 ConfigLoaderService - Caché limpiado');
  }

  /**
   * Fuerza la recarga de la configuración con timestamp para evitar caché
   */
  forceReloadConfig(): Observable<ApiConfig> {
    this.clearCache();
    const timestamp = new Date().getTime();
    return this.http.get<ApiConfig>(`/assets/config/api-config.json?t=${timestamp}`).pipe(
      tap(config => {
        this.configCache = config;
        this.configLoaded = true;
        this.configSubject.next(config);
        console.log('🔧 Configuración forzada recargada:', config);
      }),
      catchError(error => {
        console.warn('⚠️ No se pudo cargar configuración externa, usando configuración por defecto:', error);
        const defaultConfig: ApiConfig = {
          api: {
            baseUrl: 'http://192.168.190.140:401',
            timeout: 30000,
            retryAttempts: 3,
            retryDelay: 1000
          },
          environment: {
            production: true,
            debug: false,
            version: '1.0.0'
          },
          features: {
            enableLogging: true,
            enableErrorReporting: true,
            enablePerformanceMonitoring: false
          }
        };
        
        this.configCache = defaultConfig;
        this.configLoaded = true;
        this.configSubject.next(defaultConfig);
        return of(defaultConfig);
      })
    );
  }
}
