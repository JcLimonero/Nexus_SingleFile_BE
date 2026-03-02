import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface VanguardiaConfig {
  api_url: string;
  orders_api_url: string;
  invoices_api_url: string;
  upload_api_url: string;
}

/**
 * Servicio que obtiene las URLs de Vanguardia/Backblaze desde la BD (tabla config, category group_api_url).
 * Se carga UNA VEZ al iniciar sesión y se mantiene en caché hasta cerrar sesión.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private vanguardia: VanguardiaConfig | null = null;
  private loadPromise: Promise<void> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuración desde el backend UNA VEZ por sesión.
   * Si ya está cargada, devuelve la promesa existente sin hacer nueva petición.
   */
  load(): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    const configUrl = `${environment.apiBaseUrl}/api/config/group_api_url`;
    this.loadPromise = this.http.get<{ success: boolean; data: VanguardiaConfig }>(configUrl)
      .toPromise()
      .then(res => {
        if (res?.success && res.data) {
          this.vanguardia = {
            api_url: (res.data.api_url || '').replace(/\/$/, '') || '/vgd/singlefilecustomer',
            orders_api_url: (res.data.orders_api_url || '').replace(/\/$/, '') || '/vgd/singlefileorderslastest',
            invoices_api_url: (res.data.invoices_api_url || '').replace(/\/$/, '') || '/vgd/singlefileinvoices',
            // Siempre usar environment.apiBaseUrl (localhost en dev) para subidas, no la IP del servidor
            upload_api_url: `${environment.apiBaseUrl.replace(/\/$/, '')}/api/backblaze/direct-upload`,
          };
        } else {
          this.vanguardia = this.getFallbackVanguardia();
        }
      })
      .catch(() => {
        this.vanguardia = this.getFallbackVanguardia();
      });

    return this.loadPromise;
  }

  private getFallbackVanguardia(): VanguardiaConfig {
    const v = environment.vanguardia;
    return {
      api_url: v?.apiUrl || '/vgd/singlefilecustomer',
      orders_api_url: v?.ordersApiUrl || '/vgd/singlefileorderslastest',
      invoices_api_url: v?.invoicesApiUrl || '/vgd/singlefileinvoices',
      upload_api_url: `${environment.apiBaseUrl}/api/backblaze/direct-upload`,
    };
  }

  /** URL base del backend API: siempre relativa (''). Las llamadas usan /api/... */
  getApiBaseUrl(): string {
    return '';
  }

  getApiUrl(): string {
    return this.vanguardia?.api_url ?? this.getFallbackVanguardia().api_url;
  }

  getOrdersApiUrl(): string {
    return this.vanguardia?.orders_api_url ?? this.getFallbackVanguardia().orders_api_url;
  }

  getInvoicesApiUrl(): string {
    return this.vanguardia?.invoices_api_url ?? this.getFallbackVanguardia().invoices_api_url;
  }

  /** Siempre usa environment.apiBaseUrl (localhost en dev) para subidas */
  getUploadApiUrl(): string {
    return `${environment.apiBaseUrl.replace(/\/$/, '')}/api/backblaze/direct-upload`;
  }

  /** URL base para get-private-url y otros endpoints Backblaze (sin /direct-upload ni /upload) */
  getUploadApiBaseUrl(): string {
    return `${environment.apiBaseUrl.replace(/\/$/, '')}/api/backblaze`;
  }

  isLoaded(): boolean {
    return this.vanguardia !== null;
  }

  /**
   * Limpia la caché al cerrar sesión. La próxima vez que se inicie sesión se cargará de nuevo.
   */
  clearCache(): void {
    this.vanguardia = null;
    this.loadPromise = null;
  }
}
