import { describe, expect, it } from 'vitest';
import { buildCommercialKitPrompt, buildStitchPrompt } from '../lib/stitchPromptBuilder.mjs';

describe('buildStitchPrompt', () => {
  it('assembles deterministic sections from the kit context', () => {
    const prompt = buildCommercialKitPrompt({
      appName: 'Monzo',
      flow: {
        id: 'onboarding',
        title: 'Onboarding Flow',
        objective: 'Reduce time-to-value in the first session.',
        steps: ['Welcome', 'Permissions', 'Activation'],
      },
      screenshots: [
        '/assets/apps/monzo/screen-1.png',
        '/assets/apps/monzo/screen-2.png',
      ],
      renameRules: [
        'Replace brand-specific nouns with generalized product language.',
        'Use placeholder but realistic content across all frames.',
      ],
      components: ['Welcome hero', 'Preference picker', 'Primary CTA footer'],
      tokens: ['Neutral finance palette', 'Data-heavy typography scale', 'Tight 8pt spacing grid'],
    });

    expect(prompt).toContain('# App');
    expect(prompt).toContain('Name: Monzo');
    expect(prompt).toContain('# Flow');
    expect(prompt).toContain('Objective: Reduce time-to-value in the first session.');
    expect(prompt).toContain('Steps:\n1. Welcome\n2. Permissions\n3. Activation');
    expect(prompt).toContain('# Reference Screenshots');
    expect(prompt).toContain('- /assets/apps/monzo/screen-1.png');
    expect(prompt).toContain('# Rename Rules');
    expect(prompt).toContain('# Components To Reconstruct');
    expect(prompt).toContain('# Design Tokens');
    expect(prompt).toContain('Do not mirror source branding, icons, copy, or exact layouts.');
    expect(prompt).toContain('Produce an original commercial-kit output that is safe to sell as a transformed kit.');
    expect(prompt).toContain('Required output structure:');
    expect(prompt).toContain('- Cover');
    expect(prompt).toContain('- 6-8 transformed flow screens');
    expect(prompt).toContain('- Shared component patterns');
    expect(prompt).toContain('- Token direction');
    expect(prompt).toMatchInlineSnapshot(`
      "# App
      Name: Monzo
      
      # Flow
      ID: onboarding
      Title: Onboarding Flow
      Objective: Reduce time-to-value in the first session.
      Steps:
      1. Welcome
      2. Permissions
      3. Activation
      
      # Reference Screenshots
      - /assets/apps/monzo/screen-1.png
      - /assets/apps/monzo/screen-2.png
      
      # Rename Rules
      - Replace brand-specific nouns with generalized product language.
      - Use placeholder but realistic content across all frames.
      - Do not mirror source branding, icons, copy, or exact layouts.
      
      # Components To Reconstruct
      - Welcome hero
      - Preference picker
      - Primary CTA footer
      
      # Design Tokens
      - Neutral finance palette
      - Data-heavy typography scale
      - Tight 8pt spacing grid
      
      # Required Output
      Produce an original commercial-kit output that is safe to sell as a transformed kit.
      Required output structure:
      - Cover
      - 6-8 transformed flow screens
      - Shared component patterns
      - Token direction"
    `);
  });

  it('keeps buildStitchPrompt as a backward-compatible alias', () => {
    const input = {
      appName: 'Monzo',
      flow: {
        id: 'onboarding',
        title: 'Onboarding Flow',
        objective: 'Reduce time-to-value in the first session.',
        steps: ['Welcome'],
      },
      screenshots: ['/assets/apps/monzo/screen-1.png'],
      renameRules: ['Replace brand-specific nouns with generalized product language.'],
      components: ['Welcome hero'],
      tokens: ['Neutral finance palette'],
    };

    expect(buildStitchPrompt(input)).toBe(buildCommercialKitPrompt(input));
  });
});
