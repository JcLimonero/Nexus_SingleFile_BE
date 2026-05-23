import { ActivatedRoute, Router } from '@angular/router';

export type FilterValue = string | number | boolean | null | undefined;
export type FilterMap = Record<string, FilterValue | FilterValue[]>;

export function readFiltersFromUrl<T extends FilterMap>(
  route: ActivatedRoute,
  defaults: T = {} as T
): T {
  const params = route.snapshot.queryParamMap;
  const result: FilterMap = { ...defaults };

  for (const key of params.keys) {
    const all = params.getAll(key);
    if (all.length > 1) {
      result[key] = all;
    } else {
      const v = all[0];
      if (v === 'true' || v === 'false') {
        result[key] = v === 'true';
      } else if (v !== '' && !isNaN(Number(v))) {
        result[key] = Number(v);
      } else {
        result[key] = v;
      }
    }
  }
  return result as T;
}

export function writeFiltersToUrl(
  router: Router,
  route: ActivatedRoute,
  filters: FilterMap,
  options: { replaceUrl?: boolean } = {}
): Promise<boolean> {
  const queryParams: Record<string, string | string[] | null> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === undefined || value === '') {
      queryParams[key] = null;
    } else if (Array.isArray(value)) {
      queryParams[key] = value
        .filter((v) => v !== null && v !== undefined && v !== '')
        .map(String);
    } else {
      queryParams[key] = String(value);
    }
  }
  return router.navigate([], {
    relativeTo: route,
    queryParams,
    queryParamsHandling: 'merge',
    replaceUrl: options.replaceUrl ?? true
  });
}
