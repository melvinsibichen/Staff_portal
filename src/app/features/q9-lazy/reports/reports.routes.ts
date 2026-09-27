import { Routes } from '@angular/router';
import { registerLazyModule } from '../../../core/lazy-load-registry';
import { LazyArea } from '../lazy-area';
import { ReportsHeadcount, ReportsSummary } from './reports-pages';

// Runs only when the router first imports this file, i.e. when /reports is opened.
registerLazyModule('Reports');

/** Q9: Reports feature area, lazy loaded with loadChildren from app.routes.ts. */
export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: LazyArea,
    title: 'Q9 · Reports Module',
    data: {
      title: 'Reports Module',
      description: 'Company reports. This code was downloaded on demand.',
      links: [
        { label: 'Summary', path: '/reports' },
        { label: 'Headcount', path: '/reports/headcount' },
      ],
    },
    children: [
      { path: '', component: ReportsSummary },
      { path: 'headcount', component: ReportsHeadcount },
    ],
  },
];
