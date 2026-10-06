import { test, expect } from '@fixtures';

test.describe('EMI calculator functional behavior', () => {
  test('calculator loads and all loan sliders update displayed inputs @smoke', async ({
    emiPage,
  }) => {
    await emiPage.visit();

    const initial = await emiPage.readLoanInput();
    await emiPage.setSliderByRatio('amountSlider', 0.5);
    await emiPage.setSliderByRatio('rateSlider', 0.5);
    await emiPage.setSliderByRatio('tenureSlider', 0.5);
    const updated = await emiPage.readLoanInput();

    expect(updated.principal).not.toBe(initial.principal);
    expect(updated.annualRatePercent).not.toBe(initial.annualRatePercent);
    expect(updated.tenureMonths).not.toBe(initial.tenureMonths);
  });

  test('keyboard slider controls change the selected loan value @regression', async ({
    emiPage,
  }) => {
    await emiPage.visit();
    const before = await emiPage.readLoanInput();
    await emiPage.nudgeSlider('amountSlider', 'ArrowRight');
    const after = await emiPage.readLoanInput();

    expect(after.principal).toBeGreaterThan(before.principal);
  });

  test('amount slider supports both ends of its range @regression', async ({
    emiPage,
  }) => {
    await emiPage.visit();
    await emiPage.setSliderByRatio('amountSlider', 0);
    const minimum = await emiPage.readLoanInput();
    await emiPage.setSliderByRatio('amountSlider', 1);
    const maximum = await emiPage.readLoanInput();

    expect(minimum.principal).toBeGreaterThanOrEqual(0);
    expect(maximum.principal).toBeGreaterThan(minimum.principal);
  });
});
