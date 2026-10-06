# Test summary report

## Current repository state

**Execution date:** 2026-10-05  
**Environment:** Local workspace; browser tests targeted the live `https://emicalculator.net/` site using Chromium. CI was not run.

### Checks executed

| Check                                    | Result                                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `npm run typecheck`                      | Passed                                                                                                |
| `npm run lint`                           | Passed                                                                                                |
| `npm run format:check`                   | Passed                                                                                                |
| `npm run test:unit`                      | 4 passed                                                                                              |
| `npm run test:smoke`                     | 2 passed                                                                                              |
| `npx playwright test --project=chromium` | 11 reported passed; the Excel reconciliation test is deliberately marked expected-failure for BUG-001 |
| `npx playwright test --list`             | 37 tests discovered across unit, Chromium, Firefox, and mobile profiles                               |

The Firefox/mobile projects were discovered but not executed locally. The full matrix is configured for the nightly workflow. No CI result is claimed.

### Known result

The export test reproduces a ₹5 shortfall when summing whole-rupee monthly principal values against a ₹1,00,00,000 loan. It is an expected-failure guard, so the Playwright command succeeds while keeping the discrepancy visible; see [BUG-001](./BUG_REPORTS.md).

### Coverage gaps

Min/max business-boundary rules are not asserted because exact supported limits have not been specified. See the [functional requirements](./requirements/FUNCTIONAL_REQUIREMENTS.md) and [non-functional requirements](./requirements/NON_FUNCTIONAL_REQUIREMENTS.md) for the current scope.
