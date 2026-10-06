import { test, expect } from '@playwright/test';
import { parseIndianNumber } from '@utils/parse';

test('parses rupee and Indian comma formatted values', () => {
  expect(parseIndianNumber('₹1,23,45,678')).toBe(12_345_678);
  expect(parseIndianNumber('9.5')).toBe(9.5);
});

test('rejects text that is not numeric', () => {
  expect(() => parseIndianNumber('not a number')).toThrow(/Unable to parse/);
});
