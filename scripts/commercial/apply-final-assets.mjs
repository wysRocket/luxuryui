import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const overridesPath = path.join(projectRoot, 'data/curation/commercial/final-asset-overrides.json');

const main = async () => {
  const overrides = JSON.parse(await readFile(overridesPath, 'utf8'));
  for (const asset of overrides.assets) {
    const packetPath = path.join(projectRoot, 'data/curation/commercial/generated-kit-artifacts', asset.kitSlug, 'figma', 'reconstruction.json');
    try {
      const packet = JSON.parse(await readFile(packetPath, 'utf8'));
      packet.figmaFileKey = asset.figmaFileKey;
      packet.figmaPublishedAt = asset.figmaPublishedAt;
      packet.finalAssetUrl = asset.finalAssetUrl;
      packet.finalAssetVerifiedAt = asset.finalAssetVerifiedAt;
      packet.backupAssetUrl = asset.backupAssetUrl;
      packet.contentBuiltAt = asset.contentBuiltAt;
      packet.nextAction = 'done';
      await writeFile(packetPath, JSON.stringify(packet, null, 2) + '\n');
      console.log(`Applied override for ${asset.kitSlug}`);
    } catch (err) {
      console.log(`Could not process ${asset.kitSlug}: ${err.message}`);
    }
  }
};

main();
