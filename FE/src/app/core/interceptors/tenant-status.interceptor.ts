import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap, catchError, throwError } from 'rxjs';
import { TenantStatusService } from '../services/tenant-status.service';

/**
 * Reads the multi-tenant license signals from every API response:
 *   - X-Tenant-Grace-Days-Left header → emit to TenantStatusService.graceDaysLeft
 *     (drives the persistent banner in the layout)
 *   - HTTP 423 Locked → mark readonly + snackbar warning, surface as error
 *   - HTTP 402 Payment Required → mark suspended + redirect to /cuenta-suspendida
 *
 * Legacy (single-tenant) responses never carry these signals; the service stays
 * silent and the UI behaves unchanged.
 */
export const tenantStatusInterceptor: HttpInterceptorFn = (req, next) => {
  const status = inject(TenantStatusService);
  const router = inject(Router);
  const snackbar = inject(MatSnackBar);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const grace = event.headers.get('X-Tenant-Grace-Days-Left');
        if (grace !== null) {
          const n = parseInt(grace, 10);
          if (!isNaN(n)) status.setGraceDaysLeft(n);
        }
      }
    }),
    catchError((err) => {
      if (err.status === 423) {
        status.markReadonly();
        snackbar.open(
          'Tu cuenta está en modo solo-lectura. Contacta a soporte.',
          'OK',
          { duration: 6000, panelClass: ['snackbar-warning'] },
        );
      } else if (err.status === 402) {
        status.markSuspended();
        router.navigate(['/cuenta-suspendida']);
      }
      return throwError(() => err);
    }),
  );
};
