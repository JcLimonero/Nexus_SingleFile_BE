import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, timeout } from 'rxjs/operators';

const DEFAULT_TIMEOUT_MS = 30_000;
const RETRY_COUNT = 2;
const RETRY_BASE_DELAY_MS = 1_000;

export const TimeoutRetryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const isRetryable = req.method === 'GET' || req.method === 'HEAD';

  return next(req).pipe(
    timeout(DEFAULT_TIMEOUT_MS),
    retry({
      count: isRetryable ? RETRY_COUNT : 0,
      delay: (error, attempt) => {
        if (error instanceof HttpErrorResponse) {
          const status = error.status;
          if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
            return throwError(() => error);
          }
        }
        return timer(RETRY_BASE_DELAY_MS * attempt);
      }
    })
  );
};
