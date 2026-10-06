# Bug reports

## BUG-001 — Exported rounded monthly principal does not sum to the loan amount

- **Status:** Reproduced by the automated export test, which is marked as an expected failure until the external source application resolves it.
- **Environment:** Chromium against `https://emicalculator.net/`.
- **Reproduction:** Open the home-loan calculator, set the amount, interest, and tenure sliders to ratio 0.5, then download the Excel schedule.
- **Expected:** The sum of the exported `Principal (A)` monthly values equals the displayed loan principal within ₹1.
- **Actual:** The displayed loan principal is ₹1,00,00,000; exported monthly principal values sum to ₹99,99,995 (₹5 short).
- **Evidence:** The automated assertion in `tests/export/excel-export.spec.ts` fails with a difference of ₹5. Monthly export values appear rounded to whole rupees before aggregation.

No other application defects are reported. This is a finding from the tested external site, not a code change made by this repository.
