import { TestBed } from '@angular/core/testing';
import { AuthService, DEMO_CREDENTIALS } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());

  const create = () => TestBed.inject(AuthService);

  it('starts logged out', () => {
    expect(create().isLoggedIn()).toBe(false);
  });

  it('logs in with the demo credentials and persists the session', () => {
    const auth = create();
    expect(auth.login(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password)).toBe(true);
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.currentUser()).toBe('admin');
    expect(localStorage.getItem('staff-portal.session')).toBe('admin');
  });

  it('rejects wrong credentials', () => {
    const auth = create();
    expect(auth.login('admin', 'wrong')).toBe(false);
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('logs out and clears storage', () => {
    const auth = create();
    auth.login(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password);
    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
    expect(localStorage.getItem('staff-portal.session')).toBeNull();
  });
});
