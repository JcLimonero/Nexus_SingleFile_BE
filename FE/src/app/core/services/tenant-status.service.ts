import { Injectable, signal, computed } from '@angular/core';

/**
 * Tracks the tenant license status from response headers and HTTP status codes.
 * Three sources of truth, all wired by the TenantStatusInterceptor:
 *   - 402 response → suspended (terminal block, redirect to /cuenta-suspendida)
 *   - 423 response → readonly (write blocked, banner shown)
 *   - X-Tenant-Grace-Days-Left response header → grace period banner
 */
@Injectable({ providedIn: 'root' })
export class TenantStatusService {
  readonly graceDaysLeft = signal<number | null>(null);
  readonly readonly = signal(false);
  readonly suspended = signal(false);

  readonly hasNotice = computed(() => {
    return this.suspended() || this.readonly() || (this.graceDaysLeft() !== null && this.graceDaysLeft()! >= 0);
  });

  setGraceDaysLeft(days: number | null): void {
    this.graceDaysLeft.set(days);
    // Entering grace clears stale higher-severity flags (admin reactivated tenant)
    if (days !== null) {
      this.readonly.set(false);
      this.suspended.set(false);
    }
  }

  markReadonly(): void {
    this.readonly.set(true);
  }

  markSuspended(): void {
    this.suspended.set(true);
  }

  reset(): void {
    this.graceDaysLeft.set(null);
    this.readonly.set(false);
    this.suspended.set(false);
  }
}
