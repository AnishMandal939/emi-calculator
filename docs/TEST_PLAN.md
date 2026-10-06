# Test plan

## Objective

Verify the Home Loan EMI Calculator's financial calculations, input interactions, payment schedule, chart, and export without creating or modifying user data.

## Functional scope

- Slider and keyboard updates for principal, rate, and tenure.
- EMI formula and year-by-year amortization accuracy using an independent oracle.
- Chart/table consistency and Excel export reconciliation.
- Tenure units, input validation, and supported boundaries.

## Non-functional scope

- Responsive layout at narrow viewport widths.
- Chromium, Firefox, and Pixel 7 browser/device profile.
- Deterministic timeouts, trace/video/screenshot capture, and CI reporting.
- Performance is not currently measured because no service-level budget is specified.

See [functional requirements](./requirements/FUNCTIONAL_REQUIREMENTS.md) and [non-functional requirements](./requirements/NON_FUNCTIONAL_REQUIREMENTS.md) for implementation status.

## Test data and oracle

Use deterministic loan input values from the calculator's displayed inputs after interaction. Expected EMI and amortization are independently calculated in `src/oracle/emi.ts`; page output is never used as the oracle. Golden oracle case: principal ₹50,00,000, rate 9%, tenure 20 years; expected rounded EMI ₹44,986 and total interest ₹57,96,711.

Tolerance constants are named in `src/utils/tolerance.ts`: EMI ±₹1, table rows ±₹15, chart ±₹1, and Excel ±₹1.

## Execution

- `npm run test:unit`: independent calculations and parsers; does not use browser fixtures.
- `npm run test:smoke`: Chromium smoke subset.
- `npm test`: configured unit and browser projects.
- `npm run test:ui`: Playwright UI runner.

CI runs quality/unit checks and Chromium smoke on pull requests. Nightly workflow runs browser projects in shards and merges blob reports.

## Limitations

The source site is external and can change independently. The current validation tests do not yet cover all invalid inputs or every boundary. No performance budget has been specified. See the [functional](./requirements/FUNCTIONAL_REQUIREMENTS.md) and [non-functional](./requirements/NON_FUNCTIONAL_REQUIREMENTS.md) requirement matrices for exact status.
