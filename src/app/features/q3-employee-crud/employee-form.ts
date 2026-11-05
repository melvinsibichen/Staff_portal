import { Component, computed, input, linkedSignal, output, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DEPARTMENTS } from '../../core/data/employees';
import { ManagedEmployee } from '../../core/models/employee.model';

interface EmployeeDraft {
  id: number | null;
  name: string;
  department: string;
  email: string;
}

/**
 * Q3: one template-driven form for both Add and Edit. When `employee` is set the
 * form is in edit mode; otherwise it adds a new employee.
 */
@Component({
  selector: 'app-employee-form',
  imports: [FormsModule],
  templateUrl: './employee-form.html',
})
export class EmployeeForm {
  readonly employee = input<ManagedEmployee | null>(null);
  readonly existingIds = input<number[]>([]);
  readonly nextId = input<number>(1);

  readonly save = output<ManagedEmployee>();
  readonly cancelEdit = output<void>();

  private readonly form = viewChild.required<NgForm>('employeeForm');

  protected readonly departments = DEPARTMENTS;
  protected readonly isEdit = computed(() => this.employee() !== null);

  /** Editable copy of the employee; resets whenever the input changes. */
  protected readonly draft = linkedSignal<EmployeeDraft>(() => {
    const emp = this.employee();
    return emp ? { ...emp } : this.emptyDraft();
  });

  protected readonly duplicateId = computed(() => {
    const id = this.draft().id;
    return !this.isEdit() && id !== null && this.existingIds().includes(id);
  });

  /** Replace the draft instead of mutating it, so computed signals like duplicateId update. */
  protected patch<K extends keyof EmployeeDraft>(key: K, value: EmployeeDraft[K]): void {
    this.draft.update((d) => ({ ...d, [key]: value }));
  }

  protected onSubmit(): void {
    const form = this.form();
    const { id, name, department, email } = this.draft();
    if (form.invalid || this.duplicateId() || id === null) {
      form.control.markAllAsTouched();
      return;
    }
    this.save.emit({ id, name: name.trim(), department, email: email.trim() });
    this.reset();
  }

  protected onCancel(): void {
    this.cancelEdit.emit();
    this.reset();
  }

  private reset(): void {
    // resetForm clears touched/submitted state (and writes nulls into the old draft),
    // then a fresh draft replaces it.
    this.form().resetForm();
    this.draft.set(this.emptyDraft());
  }

  private emptyDraft(): EmployeeDraft {
    return { id: this.nextId(), name: '', department: '', email: '' };
  }
}
