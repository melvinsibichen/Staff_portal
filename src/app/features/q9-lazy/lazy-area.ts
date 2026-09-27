import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { loadedModules } from '../../core/lazy-load-registry';

export interface AreaLink {
  label: string;
  path: string;
}

/** Shared frame for the User, Admin and Reports areas: title, sub-nav and loaded badges. */
@Component({
  selector: 'app-lazy-area',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 9 · lazy loaded</span>
      <h1>{{ title() }}</h1>
      <p>{{ description() }}</p>
    </header>

    <div class="row loaded">
      <span class="muted">Loaded modules:</span>
      @for (name of loaded(); track name) {
        <span class="badge on">{{ name }}</span>
      }
      <a class="back" routerLink="/lazy-modules">Verification Steps:</a>
    </div>

    <nav class="tabs" [attr.aria-label]="title() + ' sections'">
      @for (link of links(); track link.path) {
        <a
          [routerLink]="link.path"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          >{{ link.label }}</a
        >
      }
    </nav>

    <div class="card">
      <router-outlet />
    </div>
  `,
  styles: `
    .loaded {
      margin-bottom: 16px;
      font-size: 13px;
    }
    .back {
      margin-left: auto;
      color: var(--accent);
    }
    .tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--line);
    }
    .tabs a {
      padding: 8px 14px;
      color: var(--muted);
      text-decoration: none;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px;
    }
    .tabs a.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
      font-weight: 600;
    }
  `,
})
export class LazyArea {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly links = input.required<AreaLink[]>();

  protected readonly loaded = loadedModules;
}
