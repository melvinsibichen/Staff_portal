import { Injectable, computed, inject, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DashboardEmployee } from '../../core/models/employee.model';
import { EmployeeApiService } from './employee-api.service';

export type StatusFilter = 'all' | 'active' | 'inactive';

export type LoadState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: DashboardEmployee[] };

export interface DepartmentCount {
  department: string;
  count: number;
}

/**
 * Q10 state management: a small signal-based store.
 *
 *  - rxResource wraps the RxJS fetch (with retry and friendly errors) and exposes it as
 *    signals: status, value, error, reload.
 *  - Filters are writable signals; everything derived is computed(), so it recalculates
 *    only when its inputs change.
 *  - page is a linkedSignal: it resets to 1 by itself whenever a filter or page size changes.
 *
 * Provided in root, so the data is fetched once and reused when you come back.
 */
@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api = inject(EmployeeApiService);

  private readonly resource = rxResource({ stream: () => this.api.getEmployees() });

  readonly loadState = computed<LoadState>(() => {
    if (this.resource.hasValue()) {
      return { status: 'success', data: this.resource.value() };
    }
    if (this.resource.status() === 'error') {
      const err = this.resource.error();
      return { status: 'error', error: err?.message ?? 'Could not load employees.' };
    }
    return { status: 'loading' };
  });

  // Filters and paging (writable state)
  readonly search = signal('');
  readonly department = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly pageSize = signal(10);

  /** Back to page 1 whenever the search, a filter or the page size changes. */
  readonly page = linkedSignal({
    source: () => [this.search(), this.department(), this.statusFilter(), this.pageSize()],
    computation: () => 1,
  });

  // Derived state
  readonly employees = computed(() => {
    const state = this.loadState();
    return state.status === 'success' ? state.data : [];
  });

  readonly error = computed(() => {
    const state = this.loadState();
    return state.status === 'error' ? state.error : null;
  });

  readonly departments = computed(() =>
    [...new Set(this.employees().map((e) => e.department))].sort(),
  );

  readonly filtered = computed(() =>
    filterEmployees(this.employees(), this.search(), this.department(), this.statusFilter()),
  );

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / this.pageSize())),
  );

  /** Current page, clamped in case filtering shrank the result set. */
  readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));

  readonly paged = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly kpis = computed(() => {
    const list = this.filtered();
    return {
      total: list.length,
      active: list.filter((e) => e.active).length,
      departments: new Set(list.map((e) => e.department)).size,
    };
  });

  readonly byDepartment = computed<DepartmentCount[]>(() => {
    const counts = new Map<string, number>();
    for (const e of this.filtered()) {
      counts.set(e.department, (counts.get(e.department) ?? 0) + 1);
    }
    return [...counts]
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);
  });

  readonly hasFilters = computed(
    () => !!this.search() || !!this.department() || this.statusFilter() !== 'all',
  );

  // Actions
  setSearch(term: string): void {
    this.search.set(term);
  }

  setDepartment(department: string): void {
    this.department.set(department);
  }

  setStatus(status: StatusFilter): void {
    this.statusFilter.set(status);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
  }

  goToPage(page: number): void {
    this.page.set(Math.min(Math.max(1, page), this.totalPages()));
  }

  resetFilters(): void {
    this.search.set('');
    this.department.set('');
    this.statusFilter.set('all');
    this.page.set(1);
  }

  reload(): void {
    this.resource.reload();
  }
}

/** Pure filter used by the store (and unit tests). */
export function filterEmployees(
  employees: readonly DashboardEmployee[],
  search: string,
  department: string,
  status: StatusFilter,
): DashboardEmployee[] {
  const term = search.trim().toLowerCase();
  return employees.filter(
    (e) =>
      (!term || e.name.toLowerCase().includes(term) || e.email.toLowerCase().includes(term)) &&
      (!department || e.department === department) &&
      (status === 'all' || (status === 'active') === e.active),
  );
}
