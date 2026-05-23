import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { timeout, retry, catchError } from 'rxjs/operators';

/**
 * Interceptor que aplica timeout y retry a peticiones HTTP.
 *
 * - **Timeout**: 30s por defecto. Override por request via header `X-Timeout-Ms`.
 * - **Retry**: solo en GET (idempotente) y solo para errores transitorios
 *   (red / 502 / 503 / 504). Backoff exponencial: 300ms, 900ms.
 * - **Upload/export**: timeout extendido a 5 minutos por path matching.
 * - **NO se aplica retry** a POST/PUT/DELETE/PATCH para evitar duplicados.
 */

const DEFAULT_TIMEOUT_MS = 30_000;
const UPLOAD_TIMEOUT_MS = 5 * 60_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

const LONG_RUNNING_PATTERNS = [
  '/backblaze/upload',
  '/analytics/export',
  '/files/import',
  '/vanguardia/import',
];

const RETRYABLE_STATUS_CODES = new Set([0, 502, 503, 504]);

export const TimeoutRetryInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const timeoutMs = resolveTimeout(request);
  const allowRetry = request.method === 'GET';

  const cleanRequest = stripCustomHeaders(request);

  let stream$ = next(cleanRequest).pipe(timeout(timeoutMs));

  if (allowRetry) {
    stream$ = stream$.pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error, attemptIndex) => {
          if (!isRetryableError(error)) {
            return throwError(() => error);
          }
          // Backoff exponencial: 300ms, 900ms
          const delayMs = RETRY_BASE_DELAY_MS * Math.pow(3, attemptIndex);
          return timer(delayMs);
        },
      })
    );
  }

  return stream$.pipe(
    catchError((error: unknown) => throwError(() => normalizeTimeoutError(error)))
  );
};

function resolveTimeout(request: HttpRequest<unknown>): number {
  const headerOverride = request.headers.get('X-Timeout-Ms');
  if (headerOverride) {
    const parsed = Number(headerOverride);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  if (LONG_RUNNING_PATTERNS.some(pattern => request.url.includes(pattern))) {
    return UPLOAD_TIMEOUT_MS;
  }

  return DEFAULT_TIMEOUT_MS;
}

function stripCustomHeaders(request: HttpRequest<unknown>): HttpRequest<unknown> {
  if (!request.headers.has('X-Timeout-Ms')) {
    return request;
  }
  return request.clone({ headers: request.headers.delete('X-Timeout-Ms') });
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof HttpErrorResponse) {
    return RETRYABLE_STATUS_CODES.has(error.status);
  }
  // TimeoutError u otros: no reintentar para no apilar más latencia
  return false;
}

function normalizeTimeoutError(error: unknown): unknown {
  if (error && (error as { name?: string }).name === 'TimeoutError') {
    return new HttpErrorResponse({
      status: 408,
      statusText: 'Request Timeout',
      error: { message: 'La petición tardó demasiado y fue cancelada.' },
    });
  }
  return error;
}
