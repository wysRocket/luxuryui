import { describe, expect, it } from 'vitest';
import { buildCommercialKitPrompt, buildStitchPrompt } from '../lib/stitchPromptBuilder.mjs';

const BASE_INPUT = {
  appName: 'Monzo',
  flow: {
    id: 'onboarding',
    title: 'Onboarding Flow',
    objective: 'Reduce time-to-value in the first session.',
    steps: ['Welcome', 'Permissions', 'Activation'],
  },
  components: ['Welcome hero', 'Preference picker', 'Primary CTA footer'],
  tokens: ['Neutral finance palette', 'Data-heavy typography scale', 'Tight 8pt spacing grid'],
  bundleIds: ['flow-onboarding', 'category-finance'],
};

describe('buildStitchPrompt', () => {
  it('assembles deterministic sections from the kit context', () => {
    const prompt = buildCommercialKitPrompt(BASE_INPUT);

    // Aesthetic direction must be present
    expect(prompt).toContain('Monzo');
    expect(prompt).toContain('finance');
    expect(prompt).toContain('Onboarding Flow');

    // Must name the components
    expect(prompt).toContain('Welcome hero');
    expect(prompt).toContain('Preference picker');

    // Must use natural language structure (not spec headings)
    expect(prompt).not.toContain('# App');
    expect(prompt).not.toContain('# Reference Screenshots');
    expect(prompt).not.toContain('# Required Output');

    // Must include screen count and flow-specific blueprint
    expect(prompt).toContain('6 distinct mobile screens');

    // Must be safe — no raw brand name as product
    expect(prompt).toContain('Monzo-style');
    expect(prompt).toContain('fully transformed');
  });

  it('applies Finance-specific colour and mood direction', () => {
    const prompt = buildCommercialKitPrompt(BASE_INPUT);
    // Should reference finance aesthetic, not generic blue/dark
    expect(prompt).toMatch(/trustworthy|data-confident|navy|slate/i);
    expect(prompt).toMatch(/bloomberg|authoritative|data density/i);
  });

  it('applies Crypto-specific colour direction when category is Crypto', () => {
    const prompt = buildCommercialKitPrompt({
      ...BASE_INPUT,
      bundleIds: ['flow-onboarding', 'category-crypto'],
    });
    expect(prompt).toMatch(/teal|violet|near-black|dark/i);
    expect(prompt).toMatch(/trading terminal|high-contrast/i);
  });

  it('generates onboarding-flow screen blueprints in numbered order', () => {
    const prompt = buildCommercialKitPrompt(BASE_INPUT);
    expect(prompt).toContain('1.');
    expect(prompt).toContain('2.');
    expect(prompt).toMatch(/hero|welcome|value-proposition/i);
    expect(prompt).toMatch(/personalisation|interest|chip/i);
  });

  it('generates checkout-flow screen blueprints when flow is checkout', () => {
    const prompt = buildCommercialKitPrompt({
      ...BASE_INPUT,
      flow: { id: 'checkout', title: 'Checkout Flow', objective: '', steps: [] },
      bundleIds: ['flow-checkout', 'category-shopping'],
    });
    expect(prompt).toMatch(/cart|checkout/i);
    expect(prompt).toMatch(/payment|billing/i);
    expect(prompt).toMatch(/warm|terracotta|amber/i); // Shopping palette
  });

  it('keeps buildStitchPrompt as a backward-compatible alias', () => {
    expect(buildStitchPrompt(BASE_INPUT)).toBe(buildCommercialKitPrompt(BASE_INPUT));
  });
});
