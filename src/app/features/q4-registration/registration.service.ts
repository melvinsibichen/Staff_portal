import { Injectable, effect, signal } from '@angular/core';

/** Profile shown on the Q4 cards. The password is not here: AuthService keeps only its hash. */
export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string; // ISO date
}

const STORAGE_KEY = 'staff-portal.registrations';

/**
 * Q4: keeps the list of registered users, newest first. Provided in root and mirrored to
 * localStorage, so the list survives switching pages and refreshing.
 */
@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private readonly list = signal<RegisteredUser[]>(readStored());

  readonly users = this.list.asReadonly();

  constructor() {
    effect(() => writeStored(this.list()));
  }

  register(details: Pick<RegisteredUser, 'name' | 'email' | 'phone'>): RegisteredUser {
    const user: RegisteredUser = {
      id: crypto.randomUUID(),
      name: details.name.trim(),
      email: details.email.trim(),
      phone: details.phone,
      registeredAt: new Date().toISOString(),
    };
    this.list.update((list) => [user, ...list]);
    return user;
  }

  isEmailTaken(email: string): boolean {
    const normalised = email.trim().toLowerCase();
    return this.list().some((u) => u.email.toLowerCase() === normalised);
  }

  remove(id: string): void {
    this.list.update((list) => list.filter((u) => u.id !== id));
  }

  clear(): void {
    this.list.set([]);
  }
}

function readStored(): RegisteredUser[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isRegisteredUser) : [];
  } catch {
    return [];
  }
}

function writeStored(list: RegisteredUser[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage can be unavailable (private mode); the in-memory list still works.
  }
}

function isRegisteredUser(value: unknown): value is RegisteredUser {
  const u = value as RegisteredUser;
  return (
    !!u &&
    typeof u === 'object' &&
    ['id', 'name', 'email', 'phone', 'registeredAt'].every(
      (key) => typeof (u as unknown as Record<string, unknown>)[key] === 'string',
    )
  );
}
