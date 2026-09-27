import { Component, input, output } from '@angular/core';
import { Employee } from '../../core/models/employee.model';

/**
 * Q8 child: receives employees from the parent and emits the one the user selects.
 * input() / output() are the signal-based versions of @Input() and @Output() + EventEmitter.
 */
@Component({
  selector: 'app-employee-list-child',
  template: `
    <div class="card stack">
      <h2>Child component</h2>
      <p class="muted small">
        Receives <code>[employees]</code>, emits <code>(employeeSelected)</code>
      </p>
      <ul role="listbox" aria-label="Employees">
        @for (emp of employees(); track emp.id) {
          <li>
            <button
              type="button"
              role="option"
              [attr.aria-selected]="emp.id === selectedId()"
              [class.selected]="emp.id === selectedId()"
              (click)="select(emp)"
            >
              <span>{{ emp.name }}</span>
              <span class="badge">{{ emp.department }}</span>
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    h2 {
      font-size: 16px;
    }
    .small {
      margin: 0;
      font-size: 13px;
    }
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--surface);
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    button:hover {
      background: var(--hover);
    }
    button.selected {
      border-color: var(--accent);
      background: var(--accent-soft);
      font-weight: 600;
    }
  `,
})
export class EmployeeListChild {
  readonly employees = input.required<readonly Employee[]>();
  readonly selectedId = input<number | null>(null);

  readonly employeeSelected = output<Employee>();

  protected select(employee: Employee): void {
    this.employeeSelected.emit(employee);
  }
}
