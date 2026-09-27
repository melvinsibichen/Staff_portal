import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../shared/validators/password-match.validator';
import { RegisteredUsers } from './registered-users';
import { RegisteredUser, RegistrationService } from './registration.service';

/**
 * Validators.email follows the technical email spec, which accepts "jane@company".
 * This extra pattern also requires a domain ending such as ".com".
 */
const EMAIL_WITH_DOMAIN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

type ControlName = keyof RegistrationForm['form']['controls'];

/** Input element IDs, in the order the fields appear on screen. */
const FIELD_IDS: Record<ControlName, string> = {
  name: 'reg-name',
  email: 'reg-email',
  password: 'reg-password',
  confirmPassword: 'reg-confirm',
  phone: 'reg-phone',
};

/**
 * Q4: user registration built with Reactive Forms and FormBuilder.
 *  - Name: required
 *  - Email: valid format
 *  - Password: minimum 8 characters
 *  - Confirm Password: must match Password (custom group validator)
 *  - Phone Number: digits only
 *
 * Successful registrations are listed beside the form as profile cards.
 */
@Component({
  selector: 'app-registration-form',
  imports: [ReactiveFormsModule, RegisteredUsers],
  templateUrl: './registration-form.html',
  styleUrl: './registration-form.scss',
})
export class RegistrationForm {
  private readonly fb = inject(FormBuilder);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly registrations = inject(RegistrationService);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(EMAIL_WITH_DOMAIN)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    },
    { validators: passwordMatchValidator('password', 'confirmPassword') },
  );

  protected readonly showPassword = signal(false);
  protected readonly submittedName = signal<string | null>(null);
  protected readonly lastRegisteredId = signal<string | null>(null);
  /** Set when Register is clicked while something is still wrong. */
  protected readonly showFixHint = signal(false);

  /** True when a control should show its error: invalid and touched. */
  protected showError(name: ControlName): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected get mismatch(): boolean {
    return this.form.hasError('passwordMismatch') && this.form.controls.confirmPassword.touched;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      // Reveal every error at once and take the user to the first field to fix.
      this.form.markAllAsTouched();
      this.showFixHint.set(true);
      this.focusFirstInvalid();
      return;
    }
    this.showFixHint.set(false);
    const { name, email, phone } = this.form.getRawValue();
    if (this.registrations.isEmailTaken(email)) {
      this.form.controls.email.setErrors({ duplicate: true });
      this.form.controls.email.markAsTouched();
      return;
    }
    const user = this.registrations.register({ name, email, phone });
    this.submittedName.set(user.name);
    this.lastRegisteredId.set(user.id);
    this.form.reset();
  }

  private focusFirstInvalid(): void {
    const controls = this.form.controls;
    const first =
      (Object.keys(FIELD_IDS) as ControlName[]).find((name) => controls[name].invalid) ??
      (this.form.hasError('passwordMismatch') ? 'confirmPassword' : undefined);
    if (first) {
      this.host.nativeElement.querySelector<HTMLInputElement>(`#${FIELD_IDS[first]}`)?.focus();
    }
  }

  protected onRemove(user: RegisteredUser): void {
    if (confirm(`Remove ${user.name}?`)) {
      this.registrations.remove(user.id);
    }
  }

  protected onClearAll(): void {
    if (confirm('Remove all registered users?')) {
      this.registrations.clear();
      this.submittedName.set(null);
    }
  }
}
