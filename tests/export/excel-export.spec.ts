import { test } from '@fixtures';

test('Excel schedule is downloaded and reconciles with the displayed loan @regression', async ({
  emiPage,
}) => {
  test.fail(
    true,
    'BUG-001: rounded monthly principal totals are currently ₹5 below loan principal.',
  );
  await emiPage.visit();
  await emiPage.setSliderByRatio('amountSlider', 0.5);
  await emiPage.setSliderByRatio('rateSlider', 0.5);
  await emiPage.setSliderByRatio('tenureSlider', 0.5);
  await emiPage.validateExcelAgainstTable();
});
