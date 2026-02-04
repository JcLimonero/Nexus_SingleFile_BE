import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

/** Estilos de layout disponibles: apollo, poseidon, hermes, ares, zeus, ikaros */
export type LayoutStyleName = 'apollo' | 'poseidon' | 'hermes' | 'ares' | 'zeus' | 'ikaros';

export interface BrandingConfig {
  clientName: string;
  /** Título en sidebar/menú (si no se define, se usa clientName) */
  appTitle?: string;
  /** Título de la pestaña del navegador (ej: "Expediente Único by Grupo Vanguardia") */
  pageTitle?: string;
  /** Estilo de layout/template: apollo, poseidon, hermes, ares, zeus, ikaros */
  layoutStyle?: LayoutStyleName;
  logoLogin: string;
  logoApp: string;
  logoFooter: string;
  /** Imagen del splash/loading entre pantallas (antes de que cargue la app) */
  logoLoading?: string;
  /** Texto visible en el footer (si no se define, se usa clientName) */
  footerText?: string;
  footerLink: string;
}

const DEFAULT_BRANDING: BrandingConfig = {
  clientName: 'Grupo Vanguardia',
  appTitle: 'Expediente Único',
  pageTitle: 'Expediente Único by Grupo Vanguardia',
  layoutStyle: 'poseidon',
  logoLogin: 'assets/img/icons/logos/logo_login.svg',
  logoApp: 'assets/img/icons/logos/nexusQtech.svg',
  logoFooter: 'assets/img/icons/logos/nexusQtech.svg',
  logoLoading: 'assets/img/icons/logos/logo_loading_blue.svg',
  footerText: 'Grupo Vanguardia',
  footerLink: 'https://www.grupovanguardia.com'
};

const VALID_LAYOUT_STYLES: LayoutStyleName[] = ['apollo', 'poseidon', 'hermes', 'ares', 'zeus', 'ikaros'];

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  private readonly branding$ = new BehaviorSubject<BrandingConfig>(DEFAULT_BRANDING);
  private loadPromise: Promise<BrandingConfig> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Carga la configuración de branding desde assets/config/branding.json.
   * Para cambiar logos/nombre por cliente, edita ese JSON (o reemplázalo en deploy).
   */
  load(): Promise<BrandingConfig> {
    if (this.loadPromise) {
      return this.loadPromise;
    }
    this.loadPromise = firstValueFrom(
      this.http.get<BrandingConfig>('assets/config/branding.json').pipe(
        tap((config) => {
          const merged = { ...DEFAULT_BRANDING, ...config };
          this.branding$.next(merged);
          if (typeof document !== 'undefined') {
            document.title = merged.pageTitle ?? `${merged.appTitle ?? merged.clientName} by ${merged.clientName}`;
          }
        }),
        catchError(() => {
          this.branding$.next(DEFAULT_BRANDING);
          if (typeof document !== 'undefined') {
            document.title = DEFAULT_BRANDING.pageTitle ?? `${DEFAULT_BRANDING.appTitle} by ${DEFAULT_BRANDING.clientName}`;
          }
          return of(DEFAULT_BRANDING);
        })
      )
    ).then((c) => {
      this.branding$.next(c);
      if (typeof document !== 'undefined') {
        document.title = c.pageTitle ?? `${c.appTitle ?? c.clientName} by ${c.clientName}`;
      }
      return c;
    });
    return this.loadPromise;
  }

  /** Observable con la configuración actual (siempre tiene valor tras load()). */
  getBranding$(): Observable<BrandingConfig> {
    return this.branding$.asObservable();
  }

  /** Configuración actual (valor inmediato). */
  getBranding(): BrandingConfig {
    return this.branding$.value;
  }
}
