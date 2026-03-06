import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppLayoutConfig, DEFAULT_LAYOUT_CONFIG } from './layout-config.interface';

@Injectable({
  providedIn: 'root'
})
export class LayoutConfigService {
  private readonly config = DEFAULT_LAYOUT_CONFIG;

  get config$(): Observable<AppLayoutConfig> {
    return of(this.config);
  }

  select<T>(fn: (config: AppLayoutConfig) => T): Observable<T> {
    return of(fn(this.config));
  }
}
