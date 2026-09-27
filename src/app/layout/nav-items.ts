export interface NavItem {
  question: string;
  title: string;
  path: string;
  summary: string;
  level: 'Easy' | 'Medium' | 'Advanced' | 'Expert';
}

/** One entry per assessment question. Drives both the side nav and the home page. */
export const NAV_ITEMS: readonly NavItem[] = [
  {
    question: 'Q1',
    title: 'Employee Search',
    path: '/employee-search',
    summary: 'List employees and filter them by name as you type.',
    level: 'Easy',
  },
  {
    question: 'Q2',
    title: 'API Integration',
    path: '/users',
    summary: 'UserService + HttpClient, a users table, loading and error states.',
    level: 'Easy',
  },
  {
    question: 'Q3',
    title: 'Employee CRUD',
    path: '/employees',
    summary: 'Add, edit, delete and list employees stored in a local array.',
    level: 'Medium',
  },
  {
    question: 'Q4',
    title: 'Registration Form',
    path: '/register',
    summary: 'Reactive form with FormBuilder, built-in and custom validators.',
    level: 'Medium',
  },
  {
    question: 'Q5',
    title: 'shortText Pipe',
    path: '/short-text',
    summary: 'A custom pipe that trims text to a character limit.',
    level: 'Medium',
  },
  {
    question: 'Q6',
    title: 'Route Guard',
    path: '/dashboard',
    summary: 'Login and a Dashboard protected by a CanActivate guard.',
    level: 'Medium',
  },
  {
    question: 'Q7',
    title: 'RxJS Search',
    path: '/rxjs-search',
    summary: 'Type-ahead API search with debounceTime, distinctUntilChanged, switchMap.',
    level: 'Advanced',
  },
  {
    question: 'Q8',
    title: 'Parent–Child',
    path: '/parent-child',
    summary: 'Parent passes employees down; child emits the selected one back up.',
    level: 'Advanced',
  },
  {
    question: 'Q9',
    title: 'Lazy Modules',
    path: '/lazy-modules',
    summary: 'User, Admin and Reports areas that load only when opened.',
    level: 'Advanced',
  },
  {
    question: 'Q10',
    title: 'Analytics Dashboard',
    path: '/analytics',
    summary: 'KPIs, search, filter, Chart.js charts and pagination from an API.',
    level: 'Expert',
  },
];
