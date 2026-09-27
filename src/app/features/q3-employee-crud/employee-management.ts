import { Component, inject, signal } from '@angular/core';
import { ManagedEmployee } from '../../core/models/employee.model';
import { EmployeeForm } from './employee-form';
import { EmployeeTable } from './employee-table';
import { EmployeeService } from './employee.service';

/**
 * Q3: Employee Management System. Handles the add / update / delete events raised by the
 * form and the table. The array itself lives in EmployeeService, so it survives navigation.
 */
@Component({
  selector: 'app-employee-management',
  imports: [EmployeeForm, EmployeeTable],
  template: `
    <header class="page-header">
      <span class="eyebrow">Question 3</span>
      <h1>Employee Management</h1>
      <p>
        Implementation Note: Add, edit and delete employees. Data is kept in a local array (saved in this browser), so
        your changes stay when you switch pages or refresh.
      </p>
      <button type="button" class="btn small reset" (click)="onReset()">Reset sample data</button>
    </header>

    @if (message()) {
      <div class="alert success" role="status">{{ message() }}</div>
    }

    <div class="layout">
      <app-employee-form
        [employee]="editing()"
        [existingIds]="store.ids()"
        [nextId]="store.nextId()"
        (save)="onSave($event)"
        (cancelEdit)="editing.set(null)"
      />
      <app-employee-table
        [employees]="store.employees()"
        [editingId]="editing()?.id ?? null"
        (edit)="onEdit($event)"
        (remove)="onDelete($event)"
      />
    </div>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(280px, 360px) 1fr;
      gap: 16px;
      align-items: start;
    }
    .alert {
      margin-bottom: 16px;
    }
    .reset {
      align-self: flex-start;
    }
    @media (max-width: 960px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class EmployeeManagement {
  protected readonly store = inject(EmployeeService);
  protected readonly editing = signal<ManagedEmployee | null>(null);
  protected readonly message = signal<string | null>(null);

  onSave(employee: ManagedEmployee): void {
    if (this.editing()) {
      this.store.update(employee);
      this.flash(`Updated ${employee.name}.`);
    } else {
      this.store.add(employee);
      this.flash(`Added ${employee.name}.`);
    }
    this.editing.set(null);
  }

  onEdit(employee: ManagedEmployee): void {
    this.editing.set(employee);
  }

  onDelete(employee: ManagedEmployee): void {
    if (!confirm(`Delete ${employee.name}?`)) {
      return;
    }
    this.store.delete(employee.id);
    if (this.editing()?.id === employee.id) {
      this.editing.set(null);
    }
    this.flash(`Deleted ${employee.name}.`);
  }

  onReset(): void {
    if (!confirm('Restore the original sample employees? Your changes will be lost.')) {
      return;
    }
    this.store.reset();
    this.editing.set(null);
    this.flash('Sample data restored.');
  }

  private flash(text: string): void {
    this.message.set(text);
    setTimeout(() => {
      if (this.message() === text) {
        this.message.set(null);
      }
    }, 2500);
  }
}
