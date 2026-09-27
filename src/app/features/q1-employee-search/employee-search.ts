import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EMPLOYEES } from '../../core/data/employees';
import { Employee } from '../../core/models/employee.model';

/** Case-insensitive, trimmed "name contains term" filter. Exported for unit tests. */
export function filterByName(employees: readonly Employee[], term: string): Employee[] {
  const query = term.trim().toLowerCase();
  return query ? employees.filter((emp) => emp.name.toLowerCase().includes(query)) : [...employees];
}

/**
 * Q1: lists employees and filters them by name as the user types.
 * The search box is two-way bound with [(ngModel)] straight to a signal, and the
 * filtered list is a computed signal, so it updates on every keystroke with no
 * manual subscriptions.
 */
@Component({
  selector: 'app-employee-search',
  imports: [FormsModule],
  templateUrl: './employee-search.html',
  styleUrl: './employee-search.scss',
})
export class EmployeeSearch {
  protected readonly employees = signal<readonly Employee[]>(EMPLOYEES);
  protected readonly searchTerm = signal('');

  protected readonly filteredEmployees = computed(() =>
    filterByName(this.employees(), this.searchTerm()),
  );

  protected clear(): void {
    this.searchTerm.set('');
  }
}
