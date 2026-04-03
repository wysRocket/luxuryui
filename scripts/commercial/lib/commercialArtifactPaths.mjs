import path from 'node:path';

const getDefaultRootDir = () =>
  (typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.');

export const getKitArtifactPaths = (kitSlug, rootDir = getDefaultRootDir()) => {
  const resolvedRootDir = path.resolve(rootDir);
  const generatedArtifactsRootDir = path.join(resolvedRootDir, 'generated-kit-artifacts');
  const generatedKitArtifactsDir = path.join(generatedArtifactsRootDir, kitSlug);
  const deliveryPacksDir = path.join(resolvedRootDir, 'delivery-packs');

  return {
    rootDir: resolvedRootDir,
    kitSlug,
    generatedArtifactsRootDir,
    generatedKitArtifactsDir,
    deliveryPacksDir,
    deliveryPackPath: path.join(deliveryPacksDir, `${kitSlug}.json`),
  };
};
