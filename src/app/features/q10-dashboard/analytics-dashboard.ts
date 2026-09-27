import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DashboardCharts } from './charts/dashboard-charts';
import { DashboardStore, StatusFilter } from './dashboard.store';

/**
 * Q10: analytics dashboard. The component stays thin: it reads signals from
 * DashboardStore and forwards user actions to it.
 */
@Component({
  selector: 'app-analytics-dashboard',
  imports: [ReactiveFormsModule, DashboardCharts],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics-dashboard.html',
  styleUrl: './analytics-dashboard.scss',
})
export class AnalyticsDashboard {
  protected readonly store = inject(DashboardStore);

  protected readonly searchControl = new FormControl(this.store.search(), { nonNullable: true });
  protected readonly pageSizes = [5, 10, 20, 50];

  /** Up to five page numbers centred on the current page. */
  protected readonly pageNumbers = computed(() => {
    const total = this.store.totalPages();
    const current = this.store.currentPage();
    const start = Math.max(1, Math.min(current - 2, total - 4));
    const end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  protected readonly rangeLabel = computed(() => {
    const count = this.store.filtered().length;
    if (!count) {
      return 'No results';
    }
    const from = (this.store.currentPage() - 1) * this.store.pageSize() + 1;
    const to = Math.min(from + this.store.pageSize() - 1, count);
    return `${from}–${to} of ${count}`;
  });

  constructor() {
    // Debounced search: filter after the user pauses typing, not on every keystroke.
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.store.setSearch(term));
  }

  protected onDepartment(event: Event): void {
    this.store.setDepartment((event.target as HTMLSelectElement).value);
  }

  protected onStatus(event: Event): void {
    this.store.setStatus((event.target as HTMLSelectElement).value as StatusFilter);
  }

  protected onPageSize(event: Event): void {
    this.store.setPageSize(Number((event.target as HTMLSelectElement).value));
  }

  protected reset(): void {
    this.searchControl.setValue('');
    this.store.resetFilters();
  }
}
