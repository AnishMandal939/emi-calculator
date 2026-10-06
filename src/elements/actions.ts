import type { Locator } from '@playwright/test';
import type { ElementActionConfig } from './steps';

export async function applyAction(
  locator: Locator,
  config: ElementActionConfig,
): Promise<void> {
  switch (config.type) {
    case 'click':
      await locator.click();
      return;
    case 'type':
      await locator.fill(config.value);
      return;
    case 'clear':
      await locator.clear();
      return;
    case 'press':
      await locator.press(config.key);
      return;
    case 'select':
      await locator.selectOption(config.value);
      return;
    case 'drag':
      {
        const box = await locator.boundingBox();
        if (!box) {
          throw new Error('Cannot drag element because its bounding box is unavailable.');
        }
        const page = locator.page();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
        await page.mouse.move(config.x, config.y);
        await page.mouse.up();
      }
      return;
    case 'setByRatio': {
      if (config.ratio < 0 || config.ratio > 1) {
        throw new Error('Slider ratio must be between 0 and 1.');
      }
      const track = locator.locator('..');
      const box = await track.boundingBox();
      if (!box) {
        throw new Error(
          'Cannot position slider because its bounding box is unavailable.',
        );
      }
      await locator.hover();
      await locator.page().mouse.down();
      await locator
        .page()
        .mouse.move(box.x + box.width * config.ratio, box.y + box.height / 2);
      await locator.page().mouse.up();
      return;
    }
    case 'keyboardNudge':
      for (let index = 0; index < (config.count ?? 1); index += 1) {
        await locator.press(config.key);
      }
      return;
    default:
      return assertNever(config);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unsupported action: ${JSON.stringify(value)}`);
}
