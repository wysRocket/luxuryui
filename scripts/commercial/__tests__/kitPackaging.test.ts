import { describe, expect, it } from 'vitest';
import { getGeneratedArtifactsForKit } from '../../../data/figmaKits';
import { getKitArtifactPaths } from '../lib/commercialArtifactPaths.mjs';

describe('commercial artifact paths', () => {
  it('builds stable generated artifact base and kit paths from the kit slug', () => {
    const paths = getKitArtifactPaths('monzo-figma-kit', '/workspace');

    expect(paths.rootDir).toBe('/workspace');
    expect(paths.generatedArtifactsRootDir).toBe('/workspace/data/curation/commercial/generated-kit-artifacts');
    expect(paths.generatedKitArtifactsDir).toBe('/workspace/data/curation/commercial/generated-kit-artifacts/monzo-figma-kit');
    expect(paths.deliveryPacksDir).toBe('/workspace/data/curation/commercial/delivery-packs');
    expect(paths.deliveryPackPath).toBe('/workspace/data/curation/commercial/delivery-packs/monzo-figma-kit.json');
  });

  it('keeps rootDir slash roots absolute', () => {
    const paths = getKitArtifactPaths('monzo-figma-kit', '/');

    expect(paths.rootDir).toBe('/');
    expect(paths.generatedArtifactsRootDir).toBe('/data/curation/commercial/generated-kit-artifacts');
    expect(paths.generatedKitArtifactsDir).toBe('/data/curation/commercial/generated-kit-artifacts/monzo-figma-kit');
    expect(paths.deliveryPacksDir).toBe('/data/curation/commercial/delivery-packs');
    expect(paths.deliveryPackPath).toBe('/data/curation/commercial/delivery-packs/monzo-figma-kit.json');
  });

  it('wires generated artifact metadata onto the figma manifest', () => {
    const artifacts = getGeneratedArtifactsForKit('figma-kit:monzo');

    expect(artifacts?.kitSlug).toBe('monzo-figma-kit');
    expect(typeof artifacts?.generatedAt).toBe('string');
    expect(artifacts?.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(['pending', 'generated', 'ready', 'packaged', 'failed']).toContain(artifacts?.stage);
    expect(['pending', 'generated', 'packaged', 'failed']).toContain(artifacts?.generationStatus);
    expect(artifacts?.commercialReady).toBe(
      artifacts?.generationStatus === 'generated' || artifacts?.generationStatus === 'packaged',
    );
    expect(artifacts?.exportPackageFileName).toBe('monzo-figma-kit.fig');
    expect(artifacts?.previewCount).toBe(3);
    expect(artifacts?.paths.generatedArtifactsRootDir).toBe('data/curation/commercial/generated-kit-artifacts');
    expect(artifacts?.paths.generatedKitArtifactsDir).toBe('data/curation/commercial/generated-kit-artifacts/monzo-figma-kit');
    expect(artifacts?.paths.deliveryPacksDir).toBe('data/curation/commercial/delivery-packs');
    expect(artifacts?.paths.deliveryPackPath).toBe('data/curation/commercial/delivery-packs/monzo-figma-kit.json');
  });
});
