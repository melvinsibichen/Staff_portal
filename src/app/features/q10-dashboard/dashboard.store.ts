import { Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, map, of, shareReplay, startWith, switchMap } from 'rxjs';
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
 *  - RxJS handles the async part (fetch, retry, error, caching with shareReplay).
 *  - toSignal() hands the result to signals.
 *  - Filters and paging are writable signals; everything derived is computed(),
 *    so it recalculates only when its inputs change.
 *
 * Provided in root, so the data is fetched once and reused when you come back.
 */
@Injectable({ providedIn: 'root' })
export class DashboardStore {
  private readonly api = inject(EmployeeApiService);
  private readonly reload$ = new Subject<void>();

  private readonly load$: Observable<LoadState> = this.reload$.pipe(
    startWith(undefined),
    switchMap(() =>
      this.api.getEmployees().pipe(
        map((data): LoadState => ({ status: 'success', data })),
        catchError((err: Error) => of<LoadState>({ status: 'error', error: err.message })),
        startWith<LoadState>({ status: 'loading' }),
      ),
    ),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  readonly loadState = toSignal(this.load$, { initialValue: { status: 'loading' } as LoadState });

  // Filters and paging (writable state)
  readonly search = signal('');
  readonly department = signal('');
  readonly statusFilter = signal<StatusFilter>('all');
  readonly page = signal(1);
  readonly pageSize = signal(10);

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
    this.page.set(1);
  }

  setDepartment(department: string): void {
    this.department.set(department);
    this.page.set(1);
  }

  setStatus(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.page.set(1);
  }

  setPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
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
    this.reload$.next();
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
