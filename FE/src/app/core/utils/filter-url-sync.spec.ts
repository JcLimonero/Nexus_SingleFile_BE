import { readFiltersFromUrl, writeFiltersToUrl } from './filter-url-sync';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';

describe('filter-url-sync', () => {
  describe('readFiltersFromUrl', () => {
    it('parsea query params, coerciona números y booleans, deja strings', () => {
      const route = {
        snapshot: {
          queryParamMap: convertToParamMap({
            agency: '5',
            active: 'true',
            archived: 'false',
            q: 'hola mundo'
          })
        }
      } as unknown as ActivatedRoute;

      const r = readFiltersFromUrl(route);
      expect(r['agency']).toBe(5);
      expect(r['active']).toBe(true);
      expect(r['archived']).toBe(false);
      expect(r['q']).toBe('hola mundo');
    });

    it('aplica defaults si la URL no trae claves', () => {
      const route = {
        snapshot: { queryParamMap: convertToParamMap({}) }
      } as unknown as ActivatedRoute;

      const r = readFiltersFromUrl(route, { agency: 0, q: '' });
      expect(r['agency']).toBe(0);
      expect(r['q']).toBe('');
    });

    it('arrays cuando el mismo key viene múltiples veces', () => {
      const route = {
        snapshot: {
          queryParamMap: {
            keys: ['tag'],
            getAll: (k: string) => k === 'tag' ? ['a', 'b', 'c'] : [],
            has: () => true,
            get: () => null
          }
        }
      } as unknown as ActivatedRoute;

      const r = readFiltersFromUrl(route);
      expect(r['tag']).toEqual(['a', 'b', 'c']);
    });
  });

  describe('writeFiltersToUrl', () => {
    it('convierte valores a strings y omite null/undefined/empty', async () => {
      const navigated: any = {};
      const router = {
        navigate: (commands: any[], extras: any) => {
          navigated.commands = commands;
          navigated.extras = extras;
          return Promise.resolve(true);
        }
      } as unknown as Router;

      const route = {} as ActivatedRoute;

      await writeFiltersToUrl(router, route, {
        agency: 5,
        flag: true,
        q: 'hola',
        empty: '',
        missing: null
      });

      expect(navigated.extras.queryParams.agency).toBe('5');
      expect(navigated.extras.queryParams.flag).toBe('true');
      expect(navigated.extras.queryParams.q).toBe('hola');
      expect(navigated.extras.queryParams.empty).toBeNull();
      expect(navigated.extras.queryParams.missing).toBeNull();
      expect(navigated.extras.queryParamsHandling).toBe('merge');
      expect(navigated.extras.replaceUrl).toBe(true);
    });

    it('convierte array a array de strings', async () => {
      const navigated: any = {};
      const router = { navigate: (c: any, e: any) => { navigated.extras = e; return Promise.resolve(true); } } as any;

      await writeFiltersToUrl(router, {} as ActivatedRoute, { tags: ['x', 1, true] });
      expect(navigated.extras.queryParams.tags).toEqual(['x', '1', 'true']);
    });
  });
});
