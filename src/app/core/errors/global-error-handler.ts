import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from '../../shared/toast/toast.service';

/** Shows a friendly toast for unexpected errors. HTTP errors are already handled by errorInterceptor. */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly toasts = inject(ToastService);

  handleError(error: unknown): void {
    console.error('[app] Unhandled error', error);
    if (error instanceof HttpErrorResponse) {
      return;
    }
    this.toasts.error('Something went wrong. Please try again, or refresh the page.');
  }
}
