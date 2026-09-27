import { Routes } from '@angular/router';
import { registerLazyModule } from '../../../core/lazy-load-registry';
import { LazyArea } from '../lazy-area';
import { UserPreferences, UserProfile } from './user-pages';

// Runs only when the router first imports this file, i.e. when /user is opened.
registerLazyModule('User');

/** Q9: User feature area, lazy loaded with loadChildren from app.routes.ts. */
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: LazyArea,
    title: 'Q9 · User Module',
    data: {
      title: 'User Module',
      description: 'Self-service pages for a staff member. This code was downloaded on demand.',
      links: [
        { label: 'Profile', path: '/user' },
        { label: 'Preferences', path: '/user/preferences' },
      ],
    },
    children: [
      { path: '', component: UserProfile },
      { path: 'preferences', component: UserPreferences },
    ],
  },
];
