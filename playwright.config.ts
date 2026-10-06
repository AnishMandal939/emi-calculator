import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from '@utils/env';

const isCI = Boolean(process.env.CI);
const browserProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
  },
  {
    name: 'mobile',
    use: { ...devices['Pixel 7'] },
  },
];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  retries: isCI ? 2 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    acceptDownloads: true,
  },
  projects: [
    {
      name: 'unit',
      testMatch: '**/*.unit.spec.ts',
    },
    ...browserProjects.map((project) => ({
      ...project,
      testIgnore: '**/*.unit.spec.ts',
    })),
  ],
});
