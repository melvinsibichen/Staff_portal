import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-brand',
  template: `
    <div class="brand">
      <span class="name">Staff Portal</span>
      <p class="tagline">Employee records, search and analytics in one place.</p>
    </div>

    <div class="chart" aria-hidden="true">
      @for (h of bars; track $index) {
        <span [style.height.%]="h"></span>
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 32px;
      padding: 32px 28px;
      background: var(--accent);
      color: var(--on-accent);
    }
    .name {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    .tagline {
      margin: 8px 0 0;
      font-size: 14px;
      line-height: 1.5;
      opacity: 0.85;
    }
    .chart {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      height: 96px;
      padding-bottom: 8px;
      border-bottom: 1px solid currentColor;
      opacity: 0.55;
    }
    .chart span {
      flex: 1;
      background: currentColor;
      border-radius: 2px 2px 0 0;
    }
  `,
})
export class AuthBrand {
  protected readonly bars = [38, 52, 46, 64, 58, 76, 70, 88];
}
