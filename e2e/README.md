# E2E Tests

This directory contains Playwright end-to-end tests for the Sentient Finance app.

## Structure

```
e2e/
├── dev/                          # Dev-only: debug, exploration, work-in-progress tests
│   └── example.spec.ts
├── pro/                          # Production tests
│   ├── ui/                       # Shared UI layer
│   │   ├── fixtures.ts          # Test fixtures + wallet injection
│   │   ├── mock-wallet.ts      # Mock EIP-1193 provider
│   │   ├── components/
│   │   │   └── wallet-connect.ts
│   │   └── pages/
│   │       ├── landing-page.ts
│   │       ├── dashboard-page.ts
│   │       ├── vault-page.ts
│   │       ├── ccip-page.ts
│   │       ├── notifications-page.ts
│   │       └── search-page.ts
│   └── features/                 # Test specs organized by feature
│       ├── landing.spec.ts
│       ├── dashboard.spec.ts
│       ├── vault.spec.ts
│       ├── ccip.spec.ts
│       ├── notifications.spec.ts
│       └── search.spec.ts
├── tsconfig.json
└── README.md
```

## Setup

1. Install dependencies (including Playwright):

```bash
bun install
npx playwright install --with-deps chromium
```

## Running Tests

### Run all tests (headless)

```bash
bun run test:e2e
```

### Run tests with UI (visual debugging)

```bash
bun run test:e2e:ui
```

### Run tests in headed mode (see browser)

```bash
bun run test:e2e:headed
```

### Run a specific test file

```bash
bun run test:e2e --grep "landing"
```

### Run tests against a specific project/browser

```bash
bun run test:e2e --project=chromium
```

## Configuration

See `playwright.config.ts` for test configuration including:

- Base URL: `http://localhost:3000`
- Timeout: 30 seconds
- Retries: 1
- Browser: Chromium

## Notes

- Tests are designed to be resilient to wallet connection states
- The dev server is automatically started when running locally
- Set `CI=true` environment variable to run in CI mode
- Page objects are available in `pro/ui/pages/`
- Use `walletPage` fixture in specs that need a mock wallet connection
