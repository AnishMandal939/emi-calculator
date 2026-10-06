import 'dotenv/config';

export type TestEnvironment = 'local' | 'staging' | 'production';

const DEFAULT_BASE_URL = 'https://emicalculator.net';
const VALID_ENVIRONMENTS: readonly TestEnvironment[] = ['local', 'staging', 'production'];

function parseBaseUrl(value: string | undefined): string {
  const baseUrl = value ?? DEFAULT_BASE_URL;

  try {
    const parsed = new URL(baseUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error();
    }
  } catch {
    throw new Error(`Invalid BASE_URL "${baseUrl}". Expected an absolute HTTP(S) URL.`);
  }

  return baseUrl.replace(/\/+$/, '');
}

function parseTestEnvironment(value: string | undefined): TestEnvironment {
  const environment = value ?? 'production';

  if (!VALID_ENVIRONMENTS.includes(environment as TestEnvironment)) {
    throw new Error(
      `Invalid TEST_ENV "${environment}". Expected local, staging, or production.`,
    );
  }

  return environment as TestEnvironment;
}

export const BASE_URL = parseBaseUrl(process.env.BASE_URL);
export const TEST_ENV = parseTestEnvironment(process.env.TEST_ENV);
