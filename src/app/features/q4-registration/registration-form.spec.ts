import { TestBed } from '@angular/core/testing';
import { RegistrationForm } from './registration-form';

describe('RegistrationForm', () => {
  beforeEach(() => localStorage.clear());

  const create = () => TestBed.createComponent(RegistrationForm).componentInstance.form;

  const valid = {
    name: 'Jane Smith',
    email: 'jane@company.com',
    password: 'password1',
    confirmPassword: 'password1',
    phone: '5551234567',
  };

  it('is valid when every rule passes', () => {
    const form = create();
    form.setValue(valid);
    expect(form.valid).toBe(true);
  });

  it('requires a name', () => {
    const form = create();
    form.setValue({ ...valid, name: '' });
    expect(form.controls.name.hasError('required')).toBe(true);
  });

  it('checks the email format', () => {
    const form = create();
    form.setValue({ ...valid, email: 'not-an-email' });
    expect(form.controls.email.hasError('email')).toBe(true);
  });

  it('requires a domain ending such as .com in the email', () => {
    const form = create();
    form.setValue({ ...valid, email: 'jane@company' });
    expect(form.controls.email.invalid).toBe(true);
    form.controls.email.setValue('jane@company.co.uk');
    expect(form.controls.email.valid).toBe(true);
  });

  it('shows every error and focuses the first bad field when Register is clicked on an empty form', async () => {
    const fixture = TestBed.createComponent(RegistrationForm);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    document.body.appendChild(el); // needed for focus() to take effect

    const button = el.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    button.click();
    await fixture.whenStable();

    const errors = [...el.querySelectorAll('.field .error')].map((e) => e.textContent?.trim());
    expect(errors).toEqual([
      'Name is required.',
      'Email is required.',
      'Password is required.',
      'Please confirm your password.',
      'Phone number is required.',
    ]);
    expect(el.textContent).toContain('Please fix the highlighted fields above.');
    expect(document.activeElement?.id).toBe('reg-name');
    el.remove();
  });

  it('needs at least 8 characters for the password', () => {
    const form = create();
    form.setValue({ ...valid, password: 'short', confirmPassword: 'short' });
    expect(form.controls.password.hasError('minlength')).toBe(true);
  });

  it('flags mismatched passwords on the group', () => {
    const form = create();
    form.setValue({ ...valid, confirmPassword: 'different1' });
    expect(form.hasError('passwordMismatch')).toBe(true);
  });

  it('allows digits only in the phone number', () => {
    const form = create();
    form.setValue({ ...valid, phone: '555-123' });
    expect(form.controls.phone.hasError('pattern')).toBe(true);
  });

  describe('registered users', () => {
    const submit = async (values = valid) => {
      const fixture = TestBed.createComponent(RegistrationForm);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;
      fixture.componentInstance.form.setValue(values);
      await fixture.whenStable();
      (el.querySelector('button[type="submit"]') as HTMLButtonElement).click();
      await fixture.whenStable();
      return { fixture, el };
    };

    it('starts with an empty state', async () => {
      const fixture = TestBed.createComponent(RegistrationForm);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.empty')?.textContent).toContain('No one has registered yet');
    });

    it('shows a profile card for each successful registration, without the password', async () => {
      const { el } = await submit();
      const cards = el.querySelectorAll('.user-card');
      expect(cards).toHaveLength(1);
      expect(cards[0].textContent).toContain('Jane Smith');
      expect(cards[0].textContent).toContain('jane@company.com');
      expect(cards[0].querySelector('.avatar')?.textContent?.trim()).toBe('JS');
      expect(localStorage.getItem('staff-portal.registrations')).not.toContain('password1');
    });

    it('rejects an email that is already registered', async () => {
      const { fixture, el } = await submit();
      fixture.componentInstance.form.setValue(valid);
      await fixture.whenStable();
      (el.querySelector('button[type="submit"]') as HTMLButtonElement).click();
      await fixture.whenStable();

      expect(el.querySelectorAll('.user-card')).toHaveLength(1);
      expect(el.textContent).toContain('This email is already registered.');
    });

    it('removes a user from the list', async () => {
      const { fixture, el } = await submit();
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      (el.querySelector('.user-card .remove') as HTMLButtonElement).click();
      await fixture.whenStable();
      expect(el.querySelectorAll('.user-card')).toHaveLength(0);
    });
  });
});
