import { test, type Page } from '@playwright/test';
import { Element } from '@elements';
import type { Step } from '@elements';

export abstract class BasePage<K extends string> {
  protected readonly elements = new Map<K, Element>();

  protected constructor(protected readonly page: Page) {}

  async execute(step: Step<K>): Promise<void> {
    const element = this.elements.get(step.sName);
    if (!element) {
      throw new Error(`Page element "${step.sName}" is not registered.`);
    }

    await test.step(step.sName, async () => {
      for (const config of step.configs) {
        await element.apply(config);
      }
    });
  }
}
