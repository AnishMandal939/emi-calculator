# Functional requirements

These are the behaviors this automation framework is intended to verify. "Automated now" refers only to a corresponding test currently present in `tests/`.

| ID    | Requirement                                                                                               | Automated now                                                                                      |
| ----- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| FR-01 | Loan amount, annual interest rate, and tenure sliders update displayed input values.                      | Yes                                                                                                |
| FR-02 | Keyboard arrow keys can change a slider value.                                                            | Yes                                                                                                |
| FR-03 | Displayed EMI agrees with the independent monthly-repayment formula.                                      | Yes                                                                                                |
| FR-04 | The year-wise amortization table agrees with the oracle and ends at zero balance.                         | Yes                                                                                                |
| FR-05 | Chart principal, interest, and balance values agree with the payment table.                               | Yes                                                                                                |
| FR-06 | The years/months tenure control remains operable.                                                         | Smoke assertion only                                                                               |
| FR-07 | Downloaded Excel schedule agrees with the oracle and reconciles principal to loan amount.                 | Implemented as an expected-failure regression guard; currently detects the documented ₹5 shortfall |
| FR-08 | Alpha, negative, blank, and large numeric amount inputs do not produce non-finite or negative EMI output. | Yes; the test does not assert application-specific max/min clamping                                |
| FR-09 | Total interest and total payment agree with the independent oracle.                                       | Yes                                                                                                |

Specs are organized by concern under `tests/functional`, `tests/accuracy`, `tests/validation`, `tests/export`, and `tests/unit`.
