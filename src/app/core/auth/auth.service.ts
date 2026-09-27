import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'staff-portal.session';

/** Demo credentials, shown on the login page. There is no real backend. */
export const DEMO_CREDENTIALS = { username: 'admin', password: 'admin123' } as const;

/** Q6: minimal authentication state, persisted so a page refresh keeps you logged in. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly user = signal<string | null>(readSession());

  readonly currentUser = this.user.asReadonly();
  readonly loggedIn = computed(() => this.user() !== null);

  login(username: string, password: string): boolean {
    const valid =
      username.trim() === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password;
    if (valid) {
      this.user.set(username.trim());
      writeSession(username.trim());
    }
    return valid;
  }

  logout(): void {
    this.user.set(null);
    writeSession(null);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }
}

function readSession(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeSession(user: string | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, user);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode); the in-memory signal still works.
  }
}
