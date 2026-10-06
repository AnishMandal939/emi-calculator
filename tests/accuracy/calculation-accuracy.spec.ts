import { expect, test } from '@fixtures';

test('golden loan inputs show the expected EMI, interest, and payment totals @accuracy @smoke', async ({
  emiPage,
}) => {
  await emiPage.visit();
  const input = await emiPage.readLoanInput();

  expect(input).toEqual({
    principal: 5_000_000,
    annualRatePercent: 9,
    tenureMonths: 240,
  });
  expect(await emiPage.readEmi()).toBe(44_986);
  expect(await emiPage.readTotalInterest()).toBe(5_796_711);
  expect(await emiPage.readTotalPayment()).toBe(10_796_711);
});

test('displayed EMI agrees with the independent financial oracle @accuracy @regression', async ({
  emiPage,
}) => {
  await emiPage.visit();
  await emiPage.setSliderByRatio('amountSlider', 0.5);
  await emiPage.setSliderByRatio('rateSlider', 0.5);
  await emiPage.setSliderByRatio('tenureSlider', 0.5);
  await emiPage.validateEmi();
  await emiPage.validateSummary();
});

test('amortization table agrees with the independent oracle year by year @accuracy', async ({
  emiPage,
}) => {
  await emiPage.visit();
  await emiPage.setSliderByRatio('amountSlider', 0.5);
  await emiPage.setSliderByRatio('rateSlider', 0.5);
  await emiPage.setSliderByRatio('tenureSlider', 0.5);
  await emiPage.validateYearTable();
});
