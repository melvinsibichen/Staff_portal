import { Routes } from '@angular/router';
import { registerLazyModule } from '../../../core/lazy-load-registry';
import { LazyArea } from '../lazy-area';
import { AdminRoles, AdminSettings } from './admin-pages';

// Runs only when the router first imports this file, i.e. when /admin is opened.
registerLazyModule('Admin');

/** Q9: Admin feature area, lazy loaded with loadChildren from app.routes.ts. */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: LazyArea,
    title: 'Q9 · Admin Module',
    data: {
      title: 'Admin Module',
      description: 'Administration tools. This code was downloaded on demand.',
      links: [
        { label: 'Roles', path: '/admin' },
        { label: 'Settings', path: '/admin/settings' },
      ],
    },
    children: [
      { path: '', component: AdminRoles },
      { path: 'settings', component: AdminSettings },
    ],
  },
];
