import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
  });

  it('renders a nav link for each of the 10 questions', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('.sidenav a');
    // "Overview" plus Q1–Q10
    expect(links).toHaveLength(11);
  });

  it('lazy loads every question page and the Q9 areas', () => {
    const lazy = routes.filter((r) => r.loadComponent || r.loadChildren).map((r) => r.path);
    expect(lazy).toEqual(
      expect.arrayContaining([
        'employee-search',
        'users',
        'dashboard',
        'user',
        'admin',
        'reports',
        'analytics',
      ]),
    );
  });

  it('protects the Q6 dashboard with the auth guard', () => {
    const dashboard = routes.find((r) => r.path === 'dashboard');
    expect(dashboard?.canActivate).toHaveLength(1);
  });
});
