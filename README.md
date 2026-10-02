# Playwright UI Automation

End-to-end UI tests for a web application, written with [Playwright](https://playwright.dev/) Test and TypeScript. The project covers a login, report-download and assignment-viewing journey and is run across Chromium, Google Chrome and Firefox.

The application under test is a private environment. No credentials, URLs or client data are stored in this repository; everything environment-specific is read from environment variables.

> This is a focused test automation project, not a full framework: there is no Page Object layer, shared fixtures or CI pipeline yet.

## What is in the repository

```text
.
├── playwright.config.ts                  # Playwright configuration
├── tests/
│   ├── LoginandDownloadReprt.spec.ts     # Login, team selection, report download, logout
│   └── viewassignemnt.spec.ts            # Login, open a completed assignment, view previous results, logout
├── .env.example                          # Names of the required environment variables (no values)
├── package.json
└── package-lock.json
```

## Test scenarios

| Spec | Scenario |
| --- | --- |
| `LoginandDownloadReprt.spec.ts` | Logs in with email and password, switches to a team from the dashboard, opens the Certification and Users tabs, downloads the report and logs out. Tagged `@sanity`. |
| `viewassignemnt.spec.ts` | Logs in, opens the assignments list, filters to completed assignments, opens an assignment and its previous results, then logs out and checks the redirect to the login page. |

Locators are mostly role-based (`getByRole`, `getByText`), with a few XPath selectors.

## Configuration

`playwright.config.ts` sets:

- Test directory: `./tests`
- Reporter: HTML (`open: 'never'`)
- `ignoreHTTPSErrors: true`
- Trace on first retry, screenshots only on failure, video retained on failure
- Browser projects: `chromium`, `chrome` (installed Google Chrome channel) and `firefox`

The config loads a local `.env` file if one exists (`process.loadEnvFile()`, Node 20.12 or later).

## Setup

```bash
npm ci
npx playwright install
```

Copy `.env.example` to `.env` and fill in your own values. `.env` is git-ignored and must never be committed.

| Variable | Used for |
| --- | --- |
| `BASE_URL` | Base URL of the application under test (no trailing slash) |
| `APP_USER` | Login email |
| `APP_PASSWORD` | Login password |
| `TEAM_NAME` | Team to select (report download test) |
| `ASSIGNMENT_TITLE` | Assignment to open (view assignment test) |
| `RESULT_TIMESTAMP` | Timestamp of the result row to open (view assignment test) |

A test stops with a clear error if a variable it needs is missing.

## Running the tests

```bash
npx playwright test                          # all projects
npx playwright test --project=chromium       # one browser
npx playwright test --grep @sanity           # tagged tests only
npx playwright show-report                   # open the HTML report
```

## Known limitations

- Tests depend on specific data in the target environment (team, assignment, result timestamp).
- `viewassignemnt.spec.ts` still contains a `page.pause()` for debugging and some long XPath selectors.
- No CI configuration.
