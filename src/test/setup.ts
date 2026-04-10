import { afterEach, vi } from 'vitest';

class CompatibleTextEncoder {
  encode(value = '') {
    return new Uint8Array(Buffer.from(value));
  }
}

Object.defineProperties(globalThis, {
  TextEncoder: { value: CompatibleTextEncoder },
  IS_REACT_ACT_ENVIRONMENT: { value: true, configurable: true, writable: true },
});

afterEach(() => {
  vi.restoreAllMocks();
});
