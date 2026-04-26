import { existsSync } from 'node:fs';
import path from 'node:path';
import manifestsData from '@/data/curation/commercial/figma-content-manifests.json';
import productsData from '@/data/curation/commercial/figma-kit-products.json';

const projectRoot = path.resolve(__dirname, '../../..');
const manifestById = new Map(manifestsData.manifests.map((manifest) => [manifest.productId, manifest]));

describe('figma kit product assets', () => {
  it('points every published kit thumbnail and gallery image to an existing public asset', () => {
    const missing = productsData.products.flatMap((product) => {
      if (product.status !== 'published') {
        return [];
      }

      return [product.thumbnail, ...(product.gallery ?? [])]
        .filter((image): image is string => Boolean(image))
        .filter((image) => image.startsWith('/'))
        .filter((image) => !existsSync(path.join(projectRoot, 'public', image.replace(/^\//, ''))))
        .map((image) => `${product.slug}: ${image}`);
    });

    expect(missing).toEqual([]);
  });

  it('requires published kits to include finalized asset metadata', () => {
    const missingFinalAssets = productsData.products
      .filter((product) => product.status === 'published')
      .filter((product) => {
        const manifest = manifestById.get(product.id);
        return manifest?.generatedArtifacts?.finalizationStatus !== 'finalized' || !manifest?.generatedArtifacts?.finalAssetUrl;
      })
      .map((product) => product.slug);

    expect(missingFinalAssets).toEqual([]);
  });
});
