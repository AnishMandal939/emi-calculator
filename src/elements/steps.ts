import type { Locator } from '@playwright/test';

export type ElementConfig =
  | { type: 'click' }
  | { type: 'type'; value: string }
  | { type: 'clear' }
  | { type: 'press'; key: string }
  | { type: 'select'; value: string }
  | { type: 'drag'; x: number; y: number }
  | { type: 'visible' }
  | { type: 'text'; value: string }
  | { type: 'value'; value: string }
  | { type: 'containText'; value: string }
  | { type: 'attribute'; name: string; value: string }
  | { type: 'setByRatio'; ratio: number }
  | { type: 'keyboardNudge'; key: 'ArrowLeft' | 'ArrowRight'; count?: number }
  | { type: 'validateEmi'; expected: number; tolerance: number }
  | { type: 'validateYearTable'; validate: (locator: Locator) => Promise<void> };

export type Step<K extends string = string> = {
  sName: K;
  configs: ElementConfig[];
};

export type ElementActionConfig = Extract<
  ElementConfig,
  {
    type:
      | 'click'
      | 'type'
      | 'clear'
      | 'press'
      | 'select'
      | 'drag'
      | 'setByRatio'
      | 'keyboardNudge';
  }
>;

export type ElementValidationConfig = Extract<
  ElementConfig,
  { type: 'visible' | 'text' | 'value' | 'containText' | 'attribute' }
>;

export type CustomCheckConfig = Extract<
  ElementConfig,
  { type: 'validateEmi' | 'validateYearTable' }
>;
