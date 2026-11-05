import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';
import { LoadingService } from './loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.stop()));
};

/** Shows a toast, then re-throws so the page can still show its own error and Retry. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toasts = inject(ToastService);
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        console.warn(`[http] ${req.method} ${req.urlWithParams} failed (${error.status})`);
        toasts.error(httpErrorMessage(error));
      }
      return throwError(() => error);
    }),
  );
};

export function httpErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Could not reach the server. Check your internet connection and try again.';
  }
  if (error.status >= 500) {
    return `The server had a problem (${error.status}). Please try again later.`;
  }
  return `The request failed (${error.status}).`;
}
