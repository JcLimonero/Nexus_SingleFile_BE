import { Injectable } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  MatIconRegistry,
  SafeResourceUrlWithIconOptions
} from '@angular/material/icon';

/**
 * Lista de íconos del namespace `mat` que aparecen en el navbar/sidenav.
 * Se pre-fetchean al boot para evitar el "lag" perceptible al abrir un
 * dropdown por primera vez (cada `<mat-icon svgIcon>` dispara una request
 * HTTP la primera vez que se renderiza; con 7+ items se sentía mucho).
 *
 * Mantener sincronizado con navigation-loader.service.ts.
 */
const NAV_PRELOAD_ICONS = [
  // Top-level navigation
  'dashboard', 'business', 'settings', 'people', 'history', 'category',
  // Catálogos children
  'assignment', 'swap_horiz', 'person_outline', 'description',
  'block', 'warning',
  // Comunes en pantallas (validacion, procesos)
  'search', 'refresh', 'close', 'check', 'edit', 'delete',
  'menu', 'expand_more', 'arrow_drop_down', 'arrow_back',
  'visibility', 'visibility_off', 'more_vert', 'filter_list',
  'cancel', 'clear', 'clear_all', 'info', 'error_outline'
];

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  constructor(
    private readonly domSanitizer: DomSanitizer,
    private readonly iconRegistry: MatIconRegistry
  ) {
    this.iconRegistry.addSvgIconResolver(
      (
        name: string,
        namespace: string
      ): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
        switch (namespace) {
          case 'mat':
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/material-design-icons/two-tone/${name}.svg`
            );

          case 'logo':
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/logos/${name}.svg`
            );

          case 'flag':
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `assets/img/icons/flags/${name}.svg`
            );

          default:
            return null;
        }
      }
    );

    // Precachear íconos del navbar — el browser los descarga al boot y los
    // pone en HTTP cache. La primera vez que MatIcon los pida (al abrir el
    // menú Catálogos) ya están en cache → 0 latencia de red.
    // Usamos requestIdleCallback para no competir con el initial paint.
    this.preloadNavIcons();
  }

  private preloadNavIcons(): void {
    if (typeof window === 'undefined') return; // SSR safe

    const preload = () => {
      for (const name of NAV_PRELOAD_ICONS) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = `assets/img/icons/material-design-icons/two-tone/${name}.svg`;
        document.head.appendChild(link);
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preload, { timeout: 2000 });
    } else {
      setTimeout(preload, 500);
    }
  }
}
