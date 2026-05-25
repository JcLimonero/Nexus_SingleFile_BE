import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { ApiBaseService } from './api-base.service';

export interface PhaseRow {
  id: number | null;
  id_client_group: number | null;
  id_file_state: number;
  display_order: number;
  enabled: number;
  phase_name: string;
  phase_enabled: number;
  requires_payment_voucher: number;
}

export interface PhaseActiveResponse {
  success: boolean;
  data?: {
    source: 'group' | 'legacy_all';
    id_client_group: number | null;
    phases: PhaseRow[];
  };
}

/**
 * Fetches and caches the active phases for the current user, driven by the
 * BE endpoint GET /api/phase/active-for-user.
 *
 * The result is cached for the lifetime of the user session — the navigation
 * loader subscribes once and re-emits as the cache settles. Invalidate by
 * calling refresh() (e.g. after the admin changes a group's phase assignment).
 */
@Injectable({ providedIn: 'root' })
export class PhaseService {
  private readonly cache$ = new ReplaySubject<PhaseRow[]>(1);
  private fetched = false;

  constructor(private http: HttpClient, private apiBase: ApiBaseService) {}

  /** Phases for the current user, cached. Subscribers re-fire on refresh(). */
  getActiveForUser$(): Observable<PhaseRow[]> {
    if (!this.fetched) {
      this.fetched = true;
      this.fetchAndCache();
    }
    return this.cache$.asObservable();
  }

  /** Force re-fetch (after admin changes group assignment). */
  refresh(): void {
    this.fetchAndCache();
  }

  private fetchAndCache(): void {
    this.http
      .get<PhaseActiveResponse>(this.apiBase.buildApiUrl('phase/active-for-user'))
      .pipe(
        tap((r) => this.cache$.next(r?.data?.phases ?? [])),
        shareReplay(1),
      )
      .subscribe({
        error: () => this.cache$.next([]),
      });
  }
}

/**
 * Builds a URL-safe slug from a phase name. Phase names are user-defined
 * (Spanish accents, spaces) so we need a deterministic transformation that
 * survives display_order changes without breaking deep links.
 */
export function phaseSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
