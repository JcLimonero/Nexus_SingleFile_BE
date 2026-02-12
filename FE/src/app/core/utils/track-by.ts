import { KeyValue } from '@angular/common';

export function trackByRoute<T extends { route: string | string[] }>(
  _index: number,
  item: T
): string | string[] {
  return item.route;
}

export function trackById<T extends { id: string | number }>(
  _index: number,
  item: T
): string | number {
  return item.id;
}

export function trackByKey(index: number, item: KeyValue<string, unknown>): string {
  return item.key;
}

export function trackByLabel<T extends { label: string }>(_index: number, value: T): string {
  return value.label;
}
