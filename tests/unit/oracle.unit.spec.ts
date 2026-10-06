import { test, expect } from '@playwright/test';
import { amortizeByCalendarYear, calculateEmi } from '@oracle/emi';

test('golden loan case produces expected EMI and total interest @accuracy', () => {
  const input = {
    principal: 5_000_000,
    annualRatePercent: 9,
    tenureMonths: 240,
  };
  const emi = calculateEmi(input);
  const schedule = amortizeByCalendarYear(input);
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0);

  expect(Math.round(emi)).toBe(44_986);
  expect(Math.round(totalInterest)).toBe(5_796_711);
  expect(schedule.at(-1)?.balance).toBe(0);
});

test('zero-rate loan divides principal evenly and rejects invalid inputs', () => {
  expect(
    calculateEmi({
      principal: 120_000,
      annualRatePercent: 0,
      tenureMonths: 12,
    }),
  ).toBe(10_000);
  expect(() =>
    calculateEmi({
      principal: 0,
      annualRatePercent: 9,
      tenureMonths: 12,
    }),
  ).toThrow();
});
