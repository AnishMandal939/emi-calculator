import { expect, type Locator } from '@playwright/test';
import type { ElementValidationConfig } from './steps';

export async function applyValidation(
  locator: Locator,
  config: ElementValidationConfig,
): Promise<void> {
  switch (config.type) {
    case 'visible':
      await expect(locator).toBeVisible();
      return;
    case 'text':
      await expect(locator).toHaveText(config.value);
      return;
    case 'value':
      await expect(locator).toHaveValue(config.value);
      return;
    case 'containText':
      await expect(locator).toContainText(config.value);
      return;
    case 'attribute':
      await expect(locator).toHaveAttribute(config.name, config.value);
      return;
    default:
      return assertNever(config);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported validation: ${JSON.stringify(value)}`);
}
