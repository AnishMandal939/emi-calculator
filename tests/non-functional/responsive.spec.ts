import { test, expect } from '@fixtures';

test('calculator fits a narrow viewport without horizontal document overflow @validation', async ({
  page,
  emiPage,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await emiPage.visit();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});
