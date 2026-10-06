import { test, expect } from '@fixtures';

test('alpha, negative, blank, and large loan amounts do not break calculator output @validation', async ({
  emiPage,
}) => {
  await emiPage.visit();

  for (const value of ['abc', '-1', '', '100000000000']) {
    await emiPage.setLoanAmountInput(value);
    const loan = await emiPage.readLoanInput();
    const emi = await emiPage.readEmi();

    expect(Number.isFinite(loan.principal)).toBe(true);
    expect(loan.principal).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(emi)).toBe(true);
    expect(emi).toBeGreaterThanOrEqual(0);
  }
});

test('year/month tenure control can switch units and back @validation', async ({
  emiPage,
}) => {
  await emiPage.visit();
  const yearsInput = await emiPage.readLoanInput();
  await emiPage.validateYearMonthToggle();
  const monthsInput = await emiPage.readLoanInput();

  expect(monthsInput.tenureMonths).toBeGreaterThan(0);
  expect(yearsInput.tenureMonths).toBeGreaterThan(0);
});
