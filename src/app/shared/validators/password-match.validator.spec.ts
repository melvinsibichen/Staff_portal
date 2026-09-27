import { FormControl, FormGroup } from '@angular/forms';
import { passwordMatchValidator } from './password-match.validator';

describe('passwordMatchValidator', () => {
  const build = (password: string, confirmPassword: string) =>
    new FormGroup(
      { password: new FormControl(password), confirmPassword: new FormControl(confirmPassword) },
      { validators: passwordMatchValidator() },
    );

  it('passes when both passwords match', () => {
    expect(build('secret123', 'secret123').errors).toBeNull();
  });

  it('reports passwordMismatch when they differ', () => {
    expect(build('secret123', 'secret124').errors).toEqual({ passwordMismatch: true });
  });

  it('stays quiet until confirm password has a value', () => {
    expect(build('secret123', '').errors).toBeNull();
  });
});
