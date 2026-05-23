import { ActivatedRoute, Params, Router } from '@angular/router';

/**
 * Utilidades para sincronizar filtros de pantalla con queryParams de la URL.
 *
 * Por qué: las pantallas (mesa-control/validacion, dashboards, etc.) guardan
 * filtros en propiedades del componente. Al refrescar (F5) se pierde todo
 * y el usuario tiene que volver a aplicar lo mismo. URL como source-of-truth
 * permite refresh, share-link y bookmark.
 *
 * Patrón típico en un componente:
 *
 *   constructor(private route: ActivatedRoute, private router: Router) {}
 *
 *   ngOnInit() {
 *     const p = this.route.snapshot.queryParams;
 *     this.selectedAgency  = readFilter(p, 'agencia',  parseNumber, null);
 *     this.selectedProcess = readFilter(p, 'proceso',  parseNumber, null);
 *     this.searchTerm      = readFilter(p, 'q',        parseString, '');
 *     this.showCancelled   = readFilter(p, 'cancel',   parseBool,   false);
 *   }
 *
 *   private syncUrl(): void {
 *     writeFiltersToUrl(this.router, this.route, {
 *       agencia: this.selectedAgency,
 *       proceso: this.selectedProcess,
 *       q:       this.searchTerm || null,
 *       cancel:  this.showCancelled || null,
 *     });
 *   }
 */

export type FilterValue = string | number | boolean | null | undefined;

/** Parser de string crudo de queryParam a un valor tipado. */
export type FilterParser<T> = (raw: string) => T;

export const parseString: FilterParser<string> = (raw) => raw;

export const parseNumber: FilterParser<number | null> = (raw) => {
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

export const parseBool: FilterParser<boolean> = (raw) =>
  raw === 'true' || raw === '1';

/**
 * Lee un filtro de queryParams aplicando un parser y un valor por defecto.
 * Si el param no existe, está vacío o el parser falla, devuelve el default.
 */
export function readFilter<T>(
  params: Params,
  key: string,
  parser: FilterParser<T>,
  defaultValue: T
): T {
  const raw = params[key];
  if (raw === undefined || raw === null || raw === '') {
    return defaultValue;
  }
  try {
    const parsed = parser(String(raw));
    // Para parseNumber: si raw="abc" devuelve null, usamos default
    if (parsed === null || parsed === undefined) {
      return defaultValue;
    }
    return parsed;
  } catch {
    return defaultValue;
  }
}

/**
 * Escribe filtros a la URL sin recargar el componente. Los valores null,
 * undefined o '' remueven el param de la URL (mantienen la URL limpia).
 *
 * Usa `replaceUrl: true` para no llenar el browser history con un entry
 * por cada cambio de filtro — el usuario no espera que back-button deshaga
 * cada tipeo.
 */
export function writeFiltersToUrl(
  router: Router,
  route: ActivatedRoute,
  filters: Record<string, FilterValue>
): void {
  const queryParams: Params = {};
  for (const [key, value] of Object.entries(filters)) {
    queryParams[key] =
      value === null || value === undefined || value === '' || value === false
        ? null
        : value;
  }
  void router.navigate([], {
    relativeTo: route,
    queryParams,
    queryParamsHandling: 'merge',
    replaceUrl: true,
  });
}
