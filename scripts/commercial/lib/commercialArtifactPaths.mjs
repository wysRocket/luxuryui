import path from 'node:path';

const getDefaultRootDir = () =>
  (typeof process !== 'undefined' && typeof process.cwd === 'function' ? process.cwd() : '.');

export const getKitArtifactPaths = (kitSlug, rootDir = getDefaultRootDir()) => {
  const resolvedRootDir = path.resolve(rootDir);
  const commercialArtifactsRootDir = path.join(resolvedRootDir, 'data', 'curation', 'commercial');
  const generatedArtifactsRootDir = path.join(commercialArtifactsRootDir, 'generated-kit-artifacts');
  const generatedKitArtifactsDir = path.join(generatedArtifactsRootDir, kitSlug);
  const releaseDir = path.join(generatedKitArtifactsDir, 'release');
  const deliveryPacksDir = path.join(commercialArtifactsRootDir, 'delivery-packs');

  return {
    rootDir: resolvedRootDir,
    kitSlug,
    generatedArtifactsRootDir,
    generatedKitArtifactsDir,
    releaseDir,
    deliveryPacksDir,
    deliveryPackPath: path.join(deliveryPacksDir, `${kitSlug}.json`),
    finalizationPath: path.join(releaseDir, 'finalization.json'),
    finalizationAuditPath: path.join(commercialArtifactsRootDir, 'coverage', 'commercial-finalization-audit.json'),
  };
};
