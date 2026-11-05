import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error';

export interface Toast {
  id: number;
  kind: ToastKind;
  text: string;
}

const DURATION_MS = 4000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly list = signal<readonly Toast[]>([]);

  readonly toasts = this.list.asReadonly();

  show(text: string, kind: ToastKind): void {
    if (this.list().some((t) => t.text === text && t.kind === kind)) {
      return;
    }
    const toast: Toast = { id: this.nextId++, kind, text };
    this.list.update((list) => [...list.slice(-3), toast]);
    setTimeout(() => this.dismiss(toast.id), DURATION_MS);
  }

  success(text: string): void {
    this.show(text, 'success');
  }

  error(text: string): void {
    this.show(text, 'error');
  }

  dismiss(id: number): void {
    this.list.update((list) => list.filter((t) => t.id !== id));
  }
}
