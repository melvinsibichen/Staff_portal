# Staff Portal

**Developer:** Melvin Sibichen · **Version:** 1.1.0

An Angular 22 app that answers all ten questions of the Angular coding assessment. Each question
has its own page, opened from the side navigation. It uses standalone components, signals and
lazy-loaded routes.

For convenience, all ten questions are built into this one project instead of ten separate apps,
so everything can be run and reviewed in one place with a single `npm start`.

## Run it

Requires Node.js 22 or newer.

```bash
npm install
npm start        # http://localhost:4200
npm run build
```

Demo login: **admin / admin123** (or register a new account). There is no backend, so accounts
are stored in the browser.

## Enhanced Staff Portal (v1.1.0)

- Register > Login > Dashboard flow, with the dashboard as the home page
- New login design, dark mode and a footer with the version
- HTTP interceptors, a loading bar, toasts and a global error handler
- `httpResource` for Q2 and `rxResource` for Q10
- Security headers and accessibility fixes.
