# EMI Calculator Playwright framework

TypeScript end-to-end and unit-test framework for the Home Loan EMI Calculator at `https://emicalculator.net/`.

## Architecture

```text
.
├── src/
│   ├── elements/       # typed Element wrapper, actions, validations, steps
│   ├── fixtures/       # page object fixture and ad/tracker route blocking
│   ├── oracle/         # independent EMI and amortization model
│   ├── pages/          # BasePage and EMI calculator page object
│   └── utils/          # environment, Indian-number parsing, tolerances
├── tests/
│   ├── unit/
│   ├── functional/
│   ├── accuracy/
│   ├── validation/
│   ├── export/
│   └── non-functional/
├── docs/
│   ├── requirements/   # functional and non-functional requirement matrices
│   ├── TEST_PLAN.md
│   ├── TEST_CASES.md
│   ├── BUG_REPORTS.md
│   └── TEST_SUMMARY_REPORT.md
├── playwright.config.ts
└── tsconfig.json
```

Functional and non-functional requirements are separated in `docs/requirements`; tests are grouped by test concern. UI selectors are centralized in `SEL` within `src/pages/EmiCalculatorPage.ts`. Specs use named page-object steps rather than embedding locators.

## Independent financial oracle

`src/oracle/emi.ts` implements the monthly EMI formula and month-by-month amortization grouped by year. The first year's partial installment count is inferred from the first table total divided by the independently calculated EMI. The golden case is ₹50,00,000 at 9% for 20 years: expected rounded EMI ₹44,986 and total interest ₹57,96,711. Tests use UI-displayed inputs as actual inputs to the oracle, never as expected values.

Named tolerances: EMI ±₹1, schedule rows ±₹15, chart ±₹1, Excel ±₹1.

## Environment

Only `src/utils/env.ts` reads `BASE_URL` and `TEST_ENV`; it loads a local `.env` file through dotenv. `BASE_URL` defaults to `https://emicalculator.net`; `TEST_ENV` defaults to `production`. Both are validated when Playwright loads the config. Accepted environments: `local`, `staging`, `production`. Copy `.env.example` to `.env` to start local configuration.

```sh
BASE_URL=https://staging.example.test TEST_ENV=staging npm run test:smoke
```

## Commands

```sh
npm ci
npx playwright install --with-deps chromium firefox
npm test                 # all configured unit and browser projects
npm run test:unit         # browser-independent tests
npm run test:smoke         # tagged Chromium smoke test
npm run test:ui            # Playwright UI mode
npm run report             # open latest HTML report
npm run lint
npm run typecheck
npm run format:check
```

CI pull requests run lint, typecheck, unit, and Chromium smoke checks. The nightly workflow runs the configured browser projects in shards and merges Playwright blob reports.
Husky's pre-commit hook runs lint and typecheck; this workspace has no Git metadata, so the hook file is present but could not be installed into `.git/hooks` here.

## Status and limitations

See [TEST_PLAN](./docs/TEST_PLAN.md), [TEST_CASES](./docs/TEST_CASES.md), [BUG_REPORTS](./docs/BUG_REPORTS.md), and [TEST_SUMMARY_REPORT](./docs/TEST_SUMMARY_REPORT.md). The reports clearly distinguish checked-in coverage from tests actually executed. The external calculator may change its markup; no transaction or account workflow is exercised.
