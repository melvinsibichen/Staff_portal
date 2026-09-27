import { Injectable, computed, effect, signal } from '@angular/core';
import { INITIAL_MANAGED_EMPLOYEES } from '../../core/data/employees';
import { ManagedEmployee } from '../../core/models/employee.model';

const STORAGE_KEY = 'staff-portal.employees';

/**
 * Q3: owns the local employee array.
 *
 * Provided in root, so the data outlives the page component: navigating away and back
 * keeps your changes. The array is also mirrored to localStorage so a refresh keeps them.
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly list = signal<ManagedEmployee[]>(readStored());

  readonly employees = this.list.asReadonly();
  readonly ids = computed(() => this.list().map((e) => e.id));
  readonly nextId = computed(() => Math.max(100, ...this.ids()) + 1);

  constructor() {
    effect(() => writeStored(this.list()));
  }

  add(employee: ManagedEmployee): void {
    this.list.update((list) => [...list, employee]);
  }

  update(employee: ManagedEmployee): void {
    this.list.update((list) => list.map((e) => (e.id === employee.id ? employee : e)));
  }

  delete(id: number): void {
    this.list.update((list) => list.filter((e) => e.id !== id));
  }

  /** Restores the original sample employees. */
  reset(): void {
    this.list.set([...INITIAL_MANAGED_EMPLOYEES]);
  }
}

function readStored(): ManagedEmployee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed)) {
      return parsed as ManagedEmployee[];
    }
  } catch {
    // Unavailable or corrupt storage: fall back to the sample data.
  }
  return [...INITIAL_MANAGED_EMPLOYEES];
}

function writeStored(list: ManagedEmployee[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage can be unavailable (private mode); the in-memory array still works.
  }
}
