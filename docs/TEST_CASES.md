# Test cases

## Automated cases

| Case      | Suite          | Coverage                                                                                                                 | Tag                        |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| EMI-F-001 | Functional     | Load calculator; adjust amount/rate/tenure sliders and verify displayed values change.                                   | `@smoke`                   |
| EMI-F-002 | Functional     | Use keyboard arrows to change loan amount slider.                                                                        | `@regression`              |
| EMI-F-003 | Functional     | Compare chart series against schedule table.                                                                             | `@regression`              |
| EMI-A-001 | Accuracy       | Compare displayed EMI with the independent oracle.                                                                       | `@accuracy`, `@regression` |
| EMI-A-002 | Accuracy       | Compare schedule rows with amortization oracle.                                                                          | `@accuracy`                |
| EMI-A-003 | Accuracy       | Verify the calculator's golden default case and summary values.                                                          | `@accuracy`, `@smoke`      |
| EMI-F-004 | Functional     | Validate chart series against yearly table values.                                                                       | `@regression`              |
| EMI-U-001 | Unit           | Verify golden EMI and total-interest result.                                                                             | `@accuracy`                |
| EMI-U-002 | Unit           | Verify zero-rate and invalid oracle inputs.                                                                              | —                          |
| EMI-U-003 | Unit           | Parse rupee/Indian-number formats and reject malformed values.                                                           | —                          |
| EMI-V-001 | Validation     | Verify alpha, negative, blank, and large amount input handling does not yield invalid output.                            | `@validation`              |
| EMI-V-002 | Validation     | Verify tenure-unit toggle can switch to months and back.                                                                 | `@validation`              |
| EMI-N-001 | Non-functional | Verify 360px viewport has no horizontal document overflow.                                                               | `@validation`              |
| EMI-E-001 | Export         | Download the workbook, verify summary against the oracle, reconcile monthly principal to input, and compare annual rows. | `@regression`              |

## Planned, not yet automated

- Min/max boundaries for amount, rate, and tenure.
- Exact application-specific max/min clamping expectations because supported bounds have not been agreed.
- Full functional execution on Firefox and mobile; only the configuration is present today.

No additional execution results or defects are implied by this case inventory.
