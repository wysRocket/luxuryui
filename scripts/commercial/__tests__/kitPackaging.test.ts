import { describe, expect, it } from 'vitest';
import { getGeneratedArtifactsForKit } from '../../../data/figmaKits';
import { getKitArtifactPaths } from '../lib/commercialArtifactPaths.mjs';

describe('commercial artifact paths', () => {
  it('builds stable generated artifact base and kit paths from the kit slug', () => {
    const paths = getKitArtifactPaths('monzo-figma-kit', '/workspace');

    expect(paths.rootDir).toBe('/workspace');
    expect(paths.generatedArtifactsRootDir).toBe('/workspace/generated-kit-artifacts');
    expect(paths.generatedKitArtifactsDir).toBe('/workspace/generated-kit-artifacts/monzo-figma-kit');
    expect(paths.deliveryPacksDir).toBe('/workspace/delivery-packs');
    expect(paths.deliveryPackPath).toBe('/workspace/delivery-packs/monzo-figma-kit.json');
  });

  it('keeps rootDir slash roots absolute', () => {
    const paths = getKitArtifactPaths('monzo-figma-kit', '/');

    expect(paths.rootDir).toBe('/');
    expect(paths.generatedArtifactsRootDir).toBe('/generated-kit-artifacts');
    expect(paths.generatedKitArtifactsDir).toBe('/generated-kit-artifacts/monzo-figma-kit');
    expect(paths.deliveryPacksDir).toBe('/delivery-packs');
    expect(paths.deliveryPackPath).toBe('/delivery-packs/monzo-figma-kit.json');
  });

  it('wires generated artifact metadata onto the figma manifest', () => {
    const artifacts = getGeneratedArtifactsForKit('figma-kit:monzo');

    expect(artifacts?.kitSlug).toBe('monzo-figma-kit');
    expect(artifacts?.generatedAt).toBe('2026-03-31T09:17:12.858Z');
    expect(artifacts?.stage).toBe('ready');
    expect(artifacts?.commercialReady).toBe(true);
    expect(artifacts?.exportPackageFileName).toBe('monzo-figma-kit.fig');
    expect(artifacts?.previewCount).toBe(3);
    expect(artifacts?.paths.generatedArtifactsRootDir).toBe('generated-kit-artifacts');
    expect(artifacts?.paths.generatedKitArtifactsDir).toBe('generated-kit-artifacts/monzo-figma-kit');
    expect(artifacts?.paths.deliveryPacksDir).toBe('delivery-packs');
    expect(artifacts?.paths.deliveryPackPath).toBe('delivery-packs/monzo-figma-kit.json');
  });
});
