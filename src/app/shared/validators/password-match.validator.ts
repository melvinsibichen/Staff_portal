import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Q4: custom form-group validator. Returns `{ passwordMismatch: true }` when the
 * two controls hold different values. Stays quiet until "confirm" has a value.
 */
export function passwordMatchValidator(
  passwordKey = 'password',
  confirmKey = 'confirmPassword',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;
    if (!confirm) {
      return null;
    }
    return password === confirm ? null : { passwordMismatch: true };
  };
}
