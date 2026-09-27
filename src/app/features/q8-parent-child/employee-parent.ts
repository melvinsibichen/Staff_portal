import { Component, signal } from '@angular/core';
import { EMPLOYEES } from '../../core/data/employees';
import { Employee } from '../../core/models/employee.model';
import { EmployeeListChild } from './employee-list-child';

/** Q8 parent: passes employee data down and reacts to the child's selection event. */
@Component({
  selector: 'app-employee-parent',
  imports: [EmployeeListChild],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 8</span>
      <h1>Parent–Child Communication</h1>
      <p>
        The parent passes the employee list to the child with an input. When you pick an employee,
        the child emits an event and the parent shows the details.
      </p>
    </header>

    <div class="layout">
      <app-employee-list-child
        [employees]="employees"
        [selectedId]="selected()?.id ?? null"
        (employeeSelected)="onEmployeeSelected($event)"
      />

      <section class="card stack details" aria-live="polite">
        <h2>Parent component</h2>
        @if (selected(); as emp) {
          <p class="muted small">Received from child:</p>
          <dl>
            <dt>ID</dt>
            <dd>{{ emp.id }}</dd>
            <dt>Name</dt>
            <dd>{{ emp.name }}</dd>
            <dt>Department</dt>
            <dd>{{ emp.department }}</dd>
          </dl>
          <p class="muted small">Selections received: {{ selectionCount() }}</p>
        } @else {
          <p class="muted">No employee selected yet. Pick one from the child list.</p>
        }
      </section>
    </div>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      align-items: start;
      max-width: 900px;
    }
    h2 {
      font-size: 16px;
    }
    .small {
      margin: 0;
      font-size: 13px;
    }
    dl {
      display: grid;
      grid-template-columns: 110px 1fr;
      gap: 8px;
      margin: 0;
    }
    dt {
      color: var(--muted);
      font-size: 13px;
    }
    dd {
      margin: 0;
      font-weight: 600;
    }
  `,
})
export class EmployeeParent {
  protected readonly employees: readonly Employee[] = EMPLOYEES;
  protected readonly selected = signal<Employee | null>(null);
  protected readonly selectionCount = signal(0);

  onEmployeeSelected(employee: Employee): void {
    this.selected.set(employee);
    this.selectionCount.update((n) => n + 1);
  }
}
