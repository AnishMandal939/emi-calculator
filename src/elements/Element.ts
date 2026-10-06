import { expect, type Locator } from '@playwright/test';
import { parseIndianNumber } from '@utils/parse';
import { applyAction } from './actions';
import { applyValidation } from './validations';
import type {
  CustomCheckConfig,
  ElementActionConfig,
  ElementConfig,
  ElementValidationConfig,
} from './steps';

export class Element {
  constructor(readonly locator: Locator) {}

  async apply(config: ElementConfig): Promise<void> {
    switch (config.type) {
      case 'click':
      case 'type':
      case 'clear':
      case 'press':
      case 'select':
      case 'drag':
      case 'setByRatio':
      case 'keyboardNudge':
        await applyAction(
          this.locator,
          config satisfies ElementActionConfig,
        );
        return;
      case 'visible':
      case 'text':
      case 'value':
      case 'containText':
      case 'attribute':
        await applyValidation(this.locator, config satisfies ElementValidationConfig);
        return;
      case 'validateEmi':
        {
          const text = await this.locator.innerText();
          const amountText = text.match(/[\d,]+(?:\.\d+)?/g)?.at(-1);
          if (!amountText) {
            throw new Error(`EMI element contains no numeric amount: "${text}".`);
          }
          expect(
            Math.abs(parseIndianNumber(amountText) - config.expected),
          ).toBeLessThanOrEqual(config.tolerance);
        }
        return;
      case 'validateYearTable':
        await config.validate(this.locator);
        return;
      default:
        return assertNever(config);
    }
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported element configuration: ${JSON.stringify(value)}`);
}

export type { CustomCheckConfig };
