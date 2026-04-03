import path from 'node:path';

const getDefaultRootDir = () =>
  (typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.');

export const getKitArtifactPaths = (kitSlug, rootDir = getDefaultRootDir()) => {
  const resolvedRootDir = path.resolve(rootDir);
  const commercialArtifactsRootDir = path.join(resolvedRootDir, 'data', 'curation', 'commercial');
  const generatedArtifactsRootDir = path.join(commercialArtifactsRootDir, 'generated-kit-artifacts');
  const generatedKitArtifactsDir = path.join(generatedArtifactsRootDir, kitSlug);
  const deliveryPacksDir = path.join(commercialArtifactsRootDir, 'delivery-packs');

  return {
    rootDir: resolvedRootDir,
    kitSlug,
    generatedArtifactsRootDir,
    generatedKitArtifactsDir,
    deliveryPacksDir,
    deliveryPackPath: path.join(deliveryPacksDir, `${kitSlug}.json`),
  };
};
