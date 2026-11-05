import { Component, input, output } from '@angular/core';
import { ManagedEmployee } from '../../core/models/employee.model';

/** Q3: lists employees and raises edit / remove events for a row. */
@Component({
  selector: 'app-employee-table',
  template: `
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Employee Name</th>
            <th>Department</th>
            <th>Email</th>
            <th class="actions-col"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          @for (emp of employees(); track emp.id) {
            <tr [class.editing]="emp.id === editingId()">
              <td>{{ emp.id }}</td>
              <td>{{ emp.name }}</td>
              <td>
                <span class="badge">{{ emp.department }}</span>
              </td>
              <td>{{ emp.email }}</td>
              <td class="actions">
                <button
                  type="button"
                  class="btn small"
                  [attr.aria-label]="'Edit ' + emp.name"
                  (click)="edit.emit(emp)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="btn small danger"
                  [attr.aria-label]="'Delete ' + emp.name"
                  (click)="remove.emit(emp)"
                >
                  Delete
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <strong>No employees yet</strong>
                  <p>Add one with the form, or restore the sample data.</p>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    .actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
    }
    tr.editing td {
      background: var(--accent-soft);
    }
  `,
})
export class EmployeeTable {
  readonly employees = input.required<ManagedEmployee[]>();
  readonly editingId = input<number | null>(null);

  readonly edit = output<ManagedEmployee>();
  readonly remove = output<ManagedEmployee>();
}
