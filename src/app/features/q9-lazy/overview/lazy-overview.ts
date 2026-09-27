import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { loadedModules } from '../../../core/lazy-load-registry';

/** Q9: entry page that explains the lazy areas and how to verify they load on demand. */
@Component({
  selector: 'app-lazy-overview',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 9</span>
      <h1>Lazy Loaded Modules</h1>
      <p>
        User, Admin and Reports are separate feature areas. Each one is loaded with
        <code>loadChildren</code> only when you first open it.
      </p>
    </header>

    <div class="grid">
      @for (area of areas; track area.path) {
        <a class="card tile" [routerLink]="area.path">
          <div class="row">
            <h2>{{ area.name }} Module</h2>
            @if (isLoaded(area.name)) {
              <span class="badge on">loaded</span>
            } @else {
              <span class="badge">not loaded yet</span>
            }
          </div>
          <code>{{ area.file }}</code>
        </a>
      }
    </div>

    <section class="card stack verify">
      <h2>Verification Steps:</h2>
      <ol>
        <li>Open DevTools and go to the <strong>Network</strong> tab, filtered to JS.</li>
        <li>
          Click one of the modules above. A new <code>chunk-*.js</code> file downloads only then.
        </li>
        <li>
          The <strong>Console</strong> logs <code>[lazy] User module loaded</code> once per area.
        </li>
        <li>Go back and open it again: nothing new downloads, and the badge stays "loaded".</li>
        <li>
          <code>npx ng build --verbose</code> lists each area as its own entry under "Lazy chunk
          files".
        </li>
      </ol>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      gap: 10px;
      color: inherit;
      text-decoration: none;
    }
    .tile:hover {
      border-color: var(--accent);
    }
    .tile h2 {
      font-size: 16px;
    }
    .badge {
      margin-left: auto;
    }
    .verify {
      max-width: 720px;
    }
    .verify h2 {
      font-size: 16px;
    }
    ol {
      margin: 0;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  `,
})
export class LazyOverview {
  protected readonly areas = [
    { name: 'User', path: '/user', file: 'user/user.routes.ts' },
    { name: 'Admin', path: '/admin', file: 'admin/admin.routes.ts' },
    { name: 'Reports', path: '/reports', file: 'reports/reports.routes.ts' },
  ];

  private readonly loaded = loadedModules;

  protected isLoaded(name: string): boolean {
    return this.loaded().includes(name);
  }
}
