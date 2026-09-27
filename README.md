# Staff Portal Overview

**Developer:** Melvin Sibichen

An Angular 22 app that answers all ten questions of the Angular coding assessment. Each question
has its own page, opened from the side navigation. It uses standalone components, signals and
lazy-loaded routes.

For convenience, all ten questions are built into this one project instead of ten separate apps,
so everything can be run and reviewed in one place with a single `npm start`.

## Run it

Requires Node.js 22 or newer.

```bash
npm install
npm start      # opens on http://localhost:4200


| #   | Question            | Page               | What it does                                                                                     |
| --- | ------------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| Q1  | Employee Search     | `/employee-search` | Lists employees and filters them by name as you type (`ngModel`, `@for`).                        |
| Q2  | API Integration     | `/users`           | `UserService` loads users from JSONPlaceholder with `HttpClient`, with loading and error states. |
| Q3  | Employee CRUD       | `/employees`       | Add, edit, delete and list employees stored in a local array.                                    |
| Q4  | Registration Form   | `/register`        | Reactive form with `FormBuilder`, built-in validators and a custom password-match validator.     |
| Q5  | shortText Pipe      | `/short-text`      | Custom pipe: `'Angular is a powerful front-end framework.' \| shortText:12` → `Angular is a...`  |
| Q6  | Route Guard         | `/dashboard`       | Dashboard protected by a `CanActivate` guard; redirects to Login. Demo login: admin / admin123.  |
| Q7  | RxJS Search         | `/rxjs-search`     | Searches an API as you type using `debounceTime`, `distinctUntilChanged` and `switchMap`.        |
| Q8  | Parent–Child        | `/parent-child`    | Parent passes employees to the child; the child emits the selected employee back.                |
| Q9  | Lazy Loaded Modules | `/lazy-modules`    | User, Admin and Reports areas that load only when opened.                                        |
| Q10 | Analytics Dashboard | `/analytics`       | Employee KPIs, search, filters, Chart.js charts and pagination from an API.                      |


