import { describe, expect, it } from 'vitest';
import viteConfig from '../../../vite.config';

describe('commercial test environment', () => {
  it('exposes the planned Vitest wiring in Vite config', async () => {
    const config = await viteConfig({ mode: 'test', command: 'serve' });

    expect(config.test).toBeDefined();
    expect(config.test?.globals).toBe(true);
    expect(config.test?.environment).toBe('jsdom');
    expect(config.test?.setupFiles).toContain('./src/test/setup.ts');
  });
});
