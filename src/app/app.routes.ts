import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

/**
 * Every question page is lazy loaded (loadComponent), so each one is its own chunk.
 * Q9's three feature areas use loadChildren with standalone route files, which is
 * Angular's current replacement for lazy-loaded NgModules.
 */
export const routes: Routes = [
  {
    path: '',
    title: 'Staff Portal',
    loadComponent: () => import('./layout/home/home').then((m) => m.Home),
  },
  {
    path: 'employee-search',
    title: 'Q1 · Employee Search',
    loadComponent: () =>
      import('./features/q1-employee-search/employee-search').then((m) => m.EmployeeSearch),
  },
  {
    path: 'users',
    title: 'Q2 · Users',
    loadComponent: () => import('./features/q2-users/user-list').then((m) => m.UserList),
  },
  {
    path: 'employees',
    title: 'Q3 · Employee Management',
    loadComponent: () =>
      import('./features/q3-employee-crud/employee-management').then((m) => m.EmployeeManagement),
  },
  {
    path: 'register',
    title: 'Q4 · Registration',
    loadComponent: () =>
      import('./features/q4-registration/registration-form').then((m) => m.RegistrationForm),
  },
  {
    path: 'short-text',
    title: 'Q5 · shortText Pipe',
    loadComponent: () =>
      import('./features/q5-short-text/short-text-demo').then((m) => m.ShortTextDemo),
  },
  {
    path: 'login',
    title: 'Q6 · Login',
    loadComponent: () => import('./features/q6-auth/login/login').then((m) => m.Login),
  },
  {
    path: 'dashboard',
    title: 'Q6 · Dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/q6-auth/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'rxjs-search',
    title: 'Q7 · RxJS Search',
    loadComponent: () => import('./features/q7-rxjs-search/rxjs-search').then((m) => m.RxjsSearch),
  },
  {
    path: 'parent-child',
    title: 'Q8 · Parent–Child',
    loadComponent: () =>
      import('./features/q8-parent-child/employee-parent').then((m) => m.EmployeeParent),
  },
  {
    path: 'lazy-modules',
    title: 'Q9 · Lazy Modules',
    loadComponent: () =>
      import('./features/q9-lazy/overview/lazy-overview').then((m) => m.LazyOverview),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/q9-lazy/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/q9-lazy/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./features/q9-lazy/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
  },
  {
    path: 'analytics',
    title: 'Q10 · Analytics Dashboard',
    loadComponent: () =>
      import('./features/q10-dashboard/analytics-dashboard').then((m) => m.AnalyticsDashboard),
  },
  { path: '**', redirectTo: '' },
];
