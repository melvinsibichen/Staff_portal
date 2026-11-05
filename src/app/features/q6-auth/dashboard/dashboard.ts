import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

/** Q6: the protected page. Only reachable through `canActivate: [authGuard]`. */
@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 6</span>
      <h1>Dashboard</h1>
      <p>You can only see this page because the route guard let you through.</p>
    </header>

    <section class="card stack narrow">
      <p>
        Welcome, <strong>{{ auth.currentUser() }}</strong
        >! Your session is saved in <code>localStorage</code>, so refreshing the page keeps you
        logged in.
      </p>
      <p class="muted">
        Log out, then try opening <code>/dashboard</code> again: the guard redirects you to Login.
      </p>
      <div class="row">
        <button type="button" class="btn primary" (click)="logout()">Log out</button>
        <a class="btn" routerLink="/overview">Back to overview</a>
      </div>
    </section>
  `,
  styles: `
    .narrow {
      max-width: 560px;
    }
    p {
      margin: 0;
    }
  `,
})
export class Dashboard {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
