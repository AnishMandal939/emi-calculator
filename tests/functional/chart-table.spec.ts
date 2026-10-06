import { test } from '@fixtures';

test('chart series match the year-by-year payment table @regression', async ({
  page,
  emiPage,
}) => {
  if ((page.viewportSize()?.width ?? 0) < 480) {
    test.skip();
  }
  await emiPage.visit();
  await emiPage.setSliderByRatio('amountSlider', 0.5);
  await emiPage.setSliderByRatio('rateSlider', 0.5);
  await emiPage.setSliderByRatio('tenureSlider', 0.5);
  await emiPage.validateChartAgainstTable();
});
