import { Route, Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

const guarded = (route: Route): Route => ({ ...route, canActivate: [authGuard] });

/**
 * Every question page is lazy loaded (loadComponent), so each one is its own chunk.
 * Q9's three feature areas use loadChildren with standalone route files, which is
 * Angular's current replacement for lazy-loaded NgModules.
 *
 * Flow: Register (Q4) → Login (Q6) → the Q10 dashboard, which is the home page.
 * Register and Login are public; every other page is behind authGuard.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'analytics' },
  guarded({
    path: 'overview',
    title: 'Overview',
    loadComponent: () => import('./layout/home/home').then((m) => m.Home),
  }),
  guarded({
    path: 'employee-search',
    title: 'Q1 · Employee Search',
    loadComponent: () =>
      import('./features/q1-employee-search/employee-search').then((m) => m.EmployeeSearch),
  }),
  guarded({
    path: 'users',
    title: 'Q2 · Users',
    loadComponent: () => import('./features/q2-users/user-list').then((m) => m.UserList),
  }),
  guarded({
    path: 'employees',
    title: 'Q3 · Employee Management',
    loadComponent: () =>
      import('./features/q3-employee-crud/employee-management').then((m) => m.EmployeeManagement),
  }),
  {
    path: 'register',
    title: 'Q4 · Registration',
    loadComponent: () =>
      import('./features/q4-registration/registration-form').then((m) => m.RegistrationForm),
  },
  guarded({
    path: 'short-text',
    title: 'Q5 · shortText Pipe',
    loadComponent: () =>
      import('./features/q5-short-text/short-text-demo').then((m) => m.ShortTextDemo),
  }),
  {
    path: 'login',
    title: 'Q6 · Login',
    loadComponent: () => import('./features/q6-auth/login/login').then((m) => m.Login),
  },
  guarded({
    path: 'dashboard',
    title: 'Q6 · Dashboard',
    loadComponent: () => import('./features/q6-auth/dashboard/dashboard').then((m) => m.Dashboard),
  }),
  guarded({
    path: 'rxjs-search',
    title: 'Q7 · RxJS Search',
    loadComponent: () => import('./features/q7-rxjs-search/rxjs-search').then((m) => m.RxjsSearch),
  }),
  guarded({
    path: 'parent-child',
    title: 'Q8 · Parent–Child',
    loadComponent: () =>
      import('./features/q8-parent-child/employee-parent').then((m) => m.EmployeeParent),
  }),
  guarded({
    path: 'lazy-modules',
    title: 'Q9 · Lazy Modules',
    loadComponent: () =>
      import('./features/q9-lazy/overview/lazy-overview').then((m) => m.LazyOverview),
  }),
  guarded({
    path: 'user',
    loadChildren: () => import('./features/q9-lazy/user/user.routes').then((m) => m.USER_ROUTES),
  }),
  guarded({
    path: 'admin',
    loadChildren: () => import('./features/q9-lazy/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  }),
  guarded({
    path: 'reports',
    loadChildren: () =>
      import('./features/q9-lazy/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
  }),
  guarded({
    path: 'analytics',
    title: 'Q10 · Analytics Dashboard',
    loadComponent: () =>
      import('./features/q10-dashboard/analytics-dashboard').then((m) => m.AnalyticsDashboard),
  }),
  { path: '**', redirectTo: '' },
];
