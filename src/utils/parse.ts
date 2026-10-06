export function parseIndianNumber(value: string | number): number {
  if (typeof value === 'number') {
    return value;
  }

  const normalized = value.replace(/[₹,\s]/g, '');
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Unable to parse numeric value: "${value}"`);
  }

  return parsed;
}
