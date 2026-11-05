import { Injectable, computed, signal } from '@angular/core';

/* Client-side demo auth: no backend, so accounts live in localStorage (passwords hashed). */

const SESSION_KEY = 'staff-portal.session';
const ACCOUNTS_KEY = 'staff-portal.accounts';

export const DEMO_CREDENTIALS = { username: 'admin', password: 'admin123' } as const;

interface SessionUser {
  name: string;
  login: string;
}

interface StoredAccount {
  name: string;
  email: string;
  salt: string;
  hash: string;
}

/** Q6: authentication state. Signals drive the guard, the shell and the login page. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<SessionUser | null>(readSession());

  readonly currentUser = computed(() => this.session()?.name ?? null);
  readonly loggedIn = computed(() => this.session() !== null);

  readonly justRegistered = signal<string | null>(null);

  async createAccount(name: string, email: string, password: string): Promise<void> {
    const salt = crypto.randomUUID();
    const account: StoredAccount = {
      name: name.trim(),
      email: normalise(email),
      salt,
      hash: await hashPassword(password, salt),
    };
    writeAccounts([...readAccounts().filter((a) => a.email !== account.email), account]);
    this.justRegistered.set(account.email);
  }

  async login(identifier: string, password: string): Promise<boolean> {
    const id = identifier.trim();
    if (id === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      this.startSession({ name: id, login: id });
      return true;
    }

    const account = readAccounts().find((a) => a.email === normalise(id));
    if (!account || (await hashPassword(password, account.salt)) !== account.hash) {
      return false;
    }
    this.startSession({ name: account.name, login: account.email });
    return true;
  }

  logout(): void {
    this.session.set(null);
    localStorage.removeItem(SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  removeAccount(email: string): void {
    const target = normalise(email);
    writeAccounts(readAccounts().filter((a) => a.email !== target));
    if (this.session()?.login === target) {
      this.logout();
    }
  }

  clearAccounts(): void {
    writeAccounts([]);
    if (this.session()?.login !== DEMO_CREDENTIALS.username) {
      this.logout();
    }
  }

  private startSession(user: SessionUser): void {
    this.session.set(user);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.justRegistered.set(null);
  }
}

function normalise(email: string): string {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + password));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

function readSession(): SessionUser | null {
  try {
    const user = JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null');
    return typeof user?.name === 'string' ? user : null;
  } catch {
    return null;
  }
}

function readAccounts(): StoredAccount[] {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) ?? '[]');
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}
