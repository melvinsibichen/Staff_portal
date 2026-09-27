import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NAV_ITEMS } from '../nav-items';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <h1>Staff Portal</h1>
      <p>
        One Angular app that answers all ten questions. Each question has its own lazy-loaded page.
        Pick one below or use the side navigation.
      </p>
    </header>

    <div class="grid">
      @for (item of items; track item.path) {
        <a class="card tile" [routerLink]="item.path">
          <div class="row">
            <span class="q">{{ item.question }}</span>
            <span class="badge">{{ item.level }}</span>
          </div>
          <h2>{{ item.title }}</h2>
          <p class="muted">{{ item.summary }}</p>
        </a>
      }
    </div>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }
    .tile {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: inherit;
      text-decoration: none;
      transition:
        border-color 0.15s,
        transform 0.15s;
    }
    .tile:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .tile h2 {
      font-size: 17px;
    }
    .tile p {
      margin: 0;
      font-size: 14px;
    }
    .q {
      font-family: var(--mono);
      font-weight: 600;
      color: var(--accent);
    }
    .badge {
      margin-left: auto;
    }
  `,
})
export class Home {
  protected readonly items = NAV_ITEMS;
}
