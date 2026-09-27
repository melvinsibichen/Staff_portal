import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, DEMO_CREDENTIALS } from '../../../core/auth/auth.service';

/** Q6: login page. After a successful login it returns to the page that was requested. */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 6</span>
      <h1>Login</h1>
      <p>The Dashboard is protected by a route guard. Log in to reach it.</p>
    </header>

    @if (auth.loggedIn()) {
      <div class="card stack narrow">
        <p>
          You are logged in as <strong>{{ auth.currentUser() }}</strong
          >.
        </p>
        <div class="row">
          <button type="button" class="btn primary" (click)="goNext()">Go to Dashboard</button>
          <button type="button" class="btn" (click)="auth.logout()">Log out</button>
        </div>
      </div>
    } @else {
      @if (returnUrl()) {
        <div class="alert info narrow" role="status">
          Please log in to open <code>{{ returnUrl() }}</code
          >.
        </div>
      }

      <form class="card stack narrow" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div class="alert info">
          Demo credentials: <strong>{{ demo.username }}</strong> /
          <strong>{{ demo.password }}</strong>
        </div>

        <div class="field">
          <label for="login-username">Username</label>
          <input
            id="login-username"
            class="input"
            formControlName="username"
            autocomplete="username"
          />
        </div>
        <div class="field">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            class="input"
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />
        </div>

        @if (error()) {
          <div class="alert error" role="alert">{{ error() }}</div>
        }

        <button type="submit" class="btn primary" [disabled]="form.invalid">Log in</button>
      </form>
    }
  `,
  styles: `
    .narrow {
      max-width: 420px;
    }
    .alert.narrow {
      margin-bottom: 16px;
    }
  `,
})
export class Login {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** Bound from the `?returnUrl=` query param by withComponentInputBinding(). */
  readonly returnUrl = input<string>();

  protected readonly demo = DEMO_CREDENTIALS;
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected onSubmit(): void {
    const { username, password } = this.form.getRawValue();
    if (this.auth.login(username, password)) {
      this.error.set(null);
      this.goNext();
    } else {
      this.error.set('Invalid username or password.');
    }
  }

  protected goNext(): void {
    const target = this.returnUrl();
    // Only follow in-app paths, never absolute URLs.
    const safe =
      target && target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
    this.router.navigateByUrl(safe);
  }
}
