# Non-functional requirements

| ID     | Requirement                                                                                 | Automated now                                       |
| ------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| NFR-01 | The calculator layout fits a narrow 360px viewport without horizontal document overflow.    | Yes                                                 |
| NFR-02 | Tests run against Chromium, Firefox, and a Pixel 7 viewport/device profile.                 | Configured; full matrix awaits CI/nightly execution |
| NFR-03 | Interactions have explicit timeouts and retry-on-first-failure traces.                      | Configured                                          |
| NFR-04 | Failure screenshots and video are captured; downloads are enabled.                          | Configured                                          |
| NFR-05 | CI produces HTML/JUnit reports and preserves report/trace artifacts.                        | Configured; CI execution not claimed here           |
| NFR-06 | Performance meets a defined response-time budget.                                           | Not defined or measured                             |
| NFR-07 | Tests are safe for production: read-only calculations, no account or transaction workflows. | Yes by current test design                          |
