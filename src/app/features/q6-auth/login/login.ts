import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, DEMO_CREDENTIALS } from '../../../core/auth/auth.service';
import { AuthBrand } from '../auth-brand';

const HOME_URL = '/analytics';

/** Q6: login page. After login it returns to the requested page, or the dashboard. */
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, AuthBrand],
  template: `
    <section class="auth-panel" aria-labelledby="login-title">
      <app-auth-brand />

      <div class="form-panel">
        <span class="eyebrow">Question 6 · Route guard</span>
        @if (auth.loggedIn()) {
          <h1 id="login-title">You're signed in</h1>
          <p class="muted">
            Signed in as <strong>{{ auth.currentUser() }}</strong
            >.
          </p>
          <div class="row">
            <button type="button" class="btn primary" (click)="goNext()">Go to Dashboard</button>
            <button type="button" class="btn" (click)="auth.logout()">Log out</button>
          </div>
        } @else {
          <h1 id="login-title">Sign in</h1>

          @if (auth.justRegistered()) {
            <p class="notice success" role="status">Account created. Sign in to continue.</p>
          } @else if (returnUrl()) {
            <p class="notice" role="status">
              Sign in to open <code>{{ returnUrl() }}</code
              >.
            </p>
          }

          <form class="stack" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <div class="field">
              <label for="login-username">Email or username</label>
              <input
                id="login-username"
                class="input"
                formControlName="username"
                autocomplete="username"
                maxlength="254"
              />
            </div>
            <div class="field">
              <label for="login-password">Password</label>
              <div class="password">
                <input
                  id="login-password"
                  class="input"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  autocomplete="current-password"
                  maxlength="128"
                />
                <button
                  type="button"
                  class="link-btn"
                  [attr.aria-pressed]="showPassword()"
                  (click)="showPassword.set(!showPassword())"
                >
                  {{ showPassword() ? 'Hide' : 'Show' }}
                </button>
              </div>
            </div>

            @if (error()) {
              <p class="notice error" role="alert">{{ error() }}</p>
            }

            <button type="submit" class="btn primary wide" [disabled]="form.invalid || pending()">
              {{ pending() ? 'Signing in…' : 'Sign in' }}
            </button>
          </form>

          <p class="foot muted">
            New here? <a routerLink="/register">Register</a><br />
            Demo account: <code>{{ demo.username }}</code> / <code>{{ demo.password }}</code>
          </p>
        }
      </div>
    </section>
  `,
  styleUrl: '../auth-panel.scss',
})
export class Login {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** Bound from the `?returnUrl=` query param by withComponentInputBinding(). */
  readonly returnUrl = input<string>();

  protected readonly demo = DEMO_CREDENTIALS;
  protected readonly error = signal<string | null>(null);
  protected readonly pending = signal(false);
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    username: [this.auth.justRegistered() ?? '', Validators.required],
    password: ['', Validators.required],
  });

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid || this.pending()) {
      return;
    }
    const { username, password } = this.form.getRawValue();
    this.pending.set(true);
    const ok = await this.auth.login(username, password);
    this.pending.set(false);
    if (ok) {
      this.error.set(null);
      this.goNext();
    } else {
      // Same message for an unknown user and a wrong password, so neither is revealed.
      this.error.set('Invalid email/username or password.');
      this.form.controls.password.reset();
    }
  }

  protected goNext(): void {
    const target = this.returnUrl();
    // Only follow in-app paths, never absolute or protocol-relative URLs (open redirect).
    const safe = target && target.startsWith('/') && !target.startsWith('//') ? target : HOME_URL;
    this.router.navigateByUrl(safe);
  }
}
