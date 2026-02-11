import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

/** Estilos de layout disponibles: apollo, poseidon, hermes, ares, zeus, ikaros */
export type LayoutStyleName = 'apollo' | 'poseidon' | 'hermes' | 'ares' | 'zeus' | 'ikaros';

/** Tema de colores (primary, logos). Opcional. */
export interface ThemeConfig {
  /** Color principal (botones, enlaces, acentos). Hex, ej: "#0284c7" */
  primaryColor?: string;
  /** Color aplicado a los logos SVG (mejor con iconos monocromáticos). Hex, ej: "#ffffff" */
  logoColor?: string;
}

/** Colores del menú lateral (fondo, iconos, textos, subheadings) */
export interface MenuColorsConfig {
  /** Color de fondo del menú (sidenav completo) */
  backgroundColor?: string;
  /** Color de los iconos del menú */
  iconColor?: string;
  /** Color del texto de las opciones del menú */
  textColor?: string;
  /** Color al pasar el mouse sobre una opción */
  textColorHover?: string;
  /** Color de la opción activa/seleccionada */
  textColorActive?: string;
  /** Color de los iconos al pasar el mouse */
  iconColorHover?: string;
  /** Color de los iconos en opción activa */
  iconColorActive?: string;
  /** Color de los títulos de módulos (subheadings) */
  subheadingColor?: string;
}

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
  /** Favicon de la pestaña del navegador (ej: assets/.../favicon.ico) */
  favicon?: string;
  /** Texto visible en el footer (si no se define, se usa clientName) */
  footerText?: string;
  footerLink: string;
  /** Colores del menú lateral (iconos, textos, subheadings). Si no se define, se usan los del tema. */
  menuColors?: MenuColorsConfig;
  /** Tema de colores (primary, color de logos). Opcional. */
  theme?: ThemeConfig;
}

const DEFAULT_BRANDING: BrandingConfig = {
  clientName: 'Nexus Q Tech',
  appTitle: 'Nexus Q Tech',
  pageTitle: 'NexFile by Nexus Q Tech',
  layoutStyle: 'poseidon',
  logoLogin: 'assets/img/icons/logos/nexus/login.svg',
  logoApp: 'assets/img/icons/logos/nexusQtech.svg',
  logoFooter: 'assets/img/icons/logos/nexusQtech.svg',
  logoLoading: 'assets/img/icons/logos/logo_loading_blue.svg',
  favicon: 'assets/img/icons/logos/logo_loading_blue.svg',
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
            this.applyBrandingTheme(merged);
            this.applyFavicon(merged.favicon);
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
        this.applyFavicon(c.favicon);
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

  /**
   * Actualiza el favicon del documento con la URL del branding.
   */
  private applyFavicon(faviconUrl?: string): void {
    if (typeof document === 'undefined' || !faviconUrl?.trim()) return;
    const ext = faviconUrl.toLowerCase().split('.').pop() ?? '';
    const type = ext === 'png' ? 'image/png' : (ext === 'svg' ? 'image/svg+xml' : 'image/x-icon');
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      link.setAttribute('type', type);
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
    link.type = type;
  }

  /**
   * Aplica tema completo desde branding: menú, primary y color de logos.
   */
  private applyBrandingTheme(config: BrandingConfig): void {
    if (typeof document === 'undefined') return;

    const vars: string[] = [];

    // Menú
    const menuColors = config.menuColors;
    if (menuColors) {
      if (menuColors.backgroundColor) {
        vars.push(`--vex-sidenav-background: ${menuColors.backgroundColor}`);
        vars.push(`--vex-sidenav-toolbar-background: ${menuColors.backgroundColor}`);
      }
      if (menuColors.iconColor) vars.push(`--vex-sidenav-item-icon-color: ${menuColors.iconColor}`);
      if (menuColors.textColor) vars.push(`--vex-sidenav-item-color: ${menuColors.textColor}`);
      if (menuColors.textColorHover) vars.push(`--vex-sidenav-item-color-hover: ${menuColors.textColorHover}`);
      if (menuColors.textColorActive) vars.push(`--vex-sidenav-item-color-active: ${menuColors.textColorActive}`);
      if (menuColors.iconColorHover) vars.push(`--vex-sidenav-item-icon-color-hover: ${menuColors.iconColorHover}`);
      if (menuColors.iconColorActive) vars.push(`--vex-sidenav-item-icon-color-active: ${menuColors.iconColorActive}`);
      if (menuColors.subheadingColor) vars.push(`--vex-sidenav-subheading-color: ${menuColors.subheadingColor}`);
    }

    // Color principal (Vex usa rgb(var(--vex-color-primary-500)) con formato "r, g, b")
    const theme = config.theme;
    if (theme?.primaryColor) {
      const rgb = this.hexToRgbValues(theme.primaryColor);
      if (rgb) {
        vars.push(`--vex-color-primary-500: ${rgb}`);
        vars.push(`--vex-color-primary-600: ${rgb}`);
        vars.push(`--vex-color-primary-700: ${rgb}`);
      }
    }

    // Regla para color de logos (filtro CSS)
    let logoFilterRule = '';
    if (theme?.logoColor) {
      const filter = this.hexToCssFilter(theme.logoColor);
      if (filter) logoFilterRule = ` .branding-logo-tint { filter: ${filter}; }`;
    }

    const styleId = 'branding-theme-styles';
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = vars.length > 0 ? `body { ${vars.join('; ')} }${logoFilterRule}` : (logoFilterRule || '');
  }

  /** Convierte hex a "r, g, b" para variables CSS rgb(). */
  private hexToRgbValues(hex: string): string | null {
    const m = hex.replace(/^#/, '').match(/^(?:[0-9a-f]{3}){1,2}$/i);
    if (!m) return null;
    const n = parseInt(m[0], 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `${r}, ${g}, ${b}`;
  }

  /**
   * Convierte hex a filtro CSS para tintar una imagen oscura/monocromática a ese color.
   * Funciona bien con SVGs de un solo color o en escala de grises.
   */
  private hexToCssFilter(hex: string): string | null {
    const h = hex.replace(/^#/, '').toLowerCase();
    const len = h.length;
    let r = 0, g = 0, b = 0;
    if (len === 6 && /^[0-9a-f]{6}$/.test(h)) {
      r = parseInt(h.slice(0, 2), 16) / 255;
      g = parseInt(h.slice(2, 4), 16) / 255;
      b = parseInt(h.slice(4, 6), 16) / 255;
    } else if (len === 3 && /^[0-9a-f]{3}$/.test(h)) {
      r = parseInt(h[0] + h[0], 16) / 255;
      g = parseInt(h[1] + h[1], 16) / 255;
      b = parseInt(h[2] + h[2], 16) / 255;
    } else return null;
    if (r <= 0.02 && g <= 0.02 && b <= 0.02) return 'brightness(0)';
    if (r >= 0.98 && g >= 0.98 && b >= 0.98) return 'brightness(0) invert(1)';
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let H = 0, S = 0, L = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) H = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      else if (max === g) H = ((b - r) / d + 2) / 6;
      else H = ((r - g) / d + 4) / 6;
    }
    const hueRotate = Math.round(H * 360);
    const saturate = Math.round(S * 150);
    const brightness = Math.round((L * 2) * 100);
    return `brightness(0) saturate(100%) invert(1) sepia(100%) saturate(${Math.max(saturate, 50)}%) hue-rotate(${hueRotate}deg) brightness(${Math.max(brightness, 40)}%) contrast(100%)`;
  }
}
