import { FormControl } from '@angular/forms';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

const DEFAULT_DEBOUNCE_MS = 300;

export function debouncedSearch(
  control: FormControl<string | null>,
  debounceMs = DEFAULT_DEBOUNCE_MS
): Observable<string> {
  return control.valueChanges.pipe(
    startWith(control.value ?? ''),
    debounceTime(debounceMs),
    map((value) => (value ?? '').toString().trim()),
    distinctUntilChanged()
  );
}

export function withSearchDebounce<T>(
  debounceMs = DEFAULT_DEBOUNCE_MS
): MonoTypeOperatorFunction<T> {
  return (source) =>
    source.pipe(debounceTime(debounceMs), distinctUntilChanged()) as Observable<T>;
}
