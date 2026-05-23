import { FormControl } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { debouncedSearch, withSearchDebounce } from './debounce-search';

describe('debounce-search', () => {
  describe('debouncedSearch', () => {
    it('emite el primer valor inmediatamente (startWith)', fakeAsync(() => {
      const ctrl = new FormControl('inicial');
      const emitted: string[] = [];

      const sub = debouncedSearch(ctrl, 100).subscribe(v => emitted.push(v));
      tick(150);
      sub.unsubscribe();

      expect(emitted[0]).toBe('inicial');
    }));

    it('debounce cuando hay cambios rápidos', fakeAsync(() => {
      const ctrl = new FormControl('');
      const emitted: string[] = [];

      const sub = debouncedSearch(ctrl, 100).subscribe(v => emitted.push(v));
      tick(150); // primer emit ('')

      ctrl.setValue('a');
      tick(50);
      ctrl.setValue('ab');
      tick(50);
      ctrl.setValue('abc');
      tick(150); // ahora sí emite

      sub.unsubscribe();

      // Debe haber emitido '', luego 'abc' (los intermedios se descartan)
      expect(emitted).toEqual(['', 'abc']);
    }));

    it('trim y distinctUntilChanged: ignora cambios que producen mismo valor trimmed', fakeAsync(() => {
      const ctrl = new FormControl('a');
      const emitted: string[] = [];

      const sub = debouncedSearch(ctrl, 50).subscribe(v => emitted.push(v));
      tick(100);

      ctrl.setValue('  a  ');
      tick(100);
      ctrl.setValue('a');
      tick(100);

      sub.unsubscribe();

      // Solo 1 emit porque trim('  a  ') === 'a' (distinctUntilChanged corta).
      expect(emitted).toEqual(['a']);
    }));
  });

  describe('withSearchDebounce', () => {
    it('aplica debounceTime y distinctUntilChanged', fakeAsync(() => {
      const subj = new Subject<number>();
      const emitted: number[] = [];

      subj.pipe(withSearchDebounce<number>(50)).subscribe(v => emitted.push(v));

      subj.next(1); tick(20);
      subj.next(2); tick(20);
      subj.next(2); tick(20);
      subj.next(3); tick(100);

      expect(emitted).toEqual([3]);
    }));
  });
});
