import { test as base, type Page } from '@playwright/test';
import { EmiCalculatorPage } from '@pages/EmiCalculatorPage';

interface EmiFixtures {
  emiPage: EmiCalculatorPage;
}

const blockedHosts = new Set([
  'doubleclick.net',
  'googlesyndication.com',
  'google-analytics.com',
  'googletagmanager.com',
  'facebook.net',
]);

async function blockAdAndTrackerRoutes(page: Page): Promise<void> {
  await page.route('**/*', async (route) => {
    const hostname = new URL(route.request().url()).hostname;
    if (
      [...blockedHosts].some((host) => hostname === host || hostname.endsWith(`.${host}`))
    ) {
      await route.abort();
      return;
    }
    await route.continue();
  });
}

export const test = base.extend<EmiFixtures>({
  page: async ({ page }, use) => {
    await blockAdAndTrackerRoutes(page);
    await use(page);
  },
  emiPage: async ({ page }, use) => {
    await use(new EmiCalculatorPage(page));
  },
});

export { expect } from '@playwright/test';
