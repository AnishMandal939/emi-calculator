export const TOLERANCE = {
  emi: 1,
  row: 15,
  chart: 1,
  excel: 1,
} as const;

export function expectWithinTolerance(
  actual: number,
  expected: number,
  tolerance: number,
): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`Expected ${actual} to be within ±${tolerance} of ${expected}`);
  }
}
