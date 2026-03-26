# E2E Tests

This directory contains Playwright end-to-end tests for the Sentient Finance app.

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

## Test Structure

- `example.spec.ts` - Basic smoke tests (homepage loads, no console errors)
- `landing.spec.ts` - Landing page tests (hero, CTA, navigation)
- `dashboard.spec.ts` - Dashboard page tests (loading, navigation)
- `vault.spec.ts` - Vault feature tests
- `ccip.spec.ts` - CCIP feature tests
- `notifications.spec.ts` - Notifications feature tests

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
