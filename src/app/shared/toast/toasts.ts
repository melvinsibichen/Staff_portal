import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  template: `
    <div class="toasts" aria-live="polite" aria-relevant="additions">
      @for (toast of service.toasts(); track toast.id) {
        <div
          class="toast {{ toast.kind }}"
          [attr.role]="toast.kind === 'error' ? 'alert' : 'status'"
        >
          <span>{{ toast.text }}</span>
          <button
            type="button"
            class="close"
            aria-label="Dismiss notification"
            (click)="service.dismiss(toast.id)"
          >
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toasts {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: min(380px, calc(100vw - 32px));
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 14px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--line);
      border-left-width: 4px;
      background: var(--surface);
      color: var(--ink);
      box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
      font-size: 14px;
      animation: rise 0.18s ease-out;
    }
    .toast.success {
      border-left-color: var(--success);
    }
    .toast.error {
      border-left-color: var(--danger);
    }
    .toast span {
      flex: 1;
    }
    .close {
      border: 0;
      background: none;
      color: var(--muted);
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      padding: 0 2px;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `,
})
export class Toasts {
  protected readonly service = inject(ToastService);
}
