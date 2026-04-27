import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StitchToolClient, Stitch } from '@google/stitch-sdk';

const apiKey = process.env.STITCH_API_KEY;
if (!apiKey) {
  console.error('STITCH_API_KEY environment variable is required.');
  process.exit(1);
}

const metaUrl = new URL('../../', import.meta.url);
const projectRoot = fileURLToPath(metaUrl).replace(/[/\\]$/, '');
const MANIFEST_PATH = path.join(projectRoot, 'data', 'curation', 'commercial', 'figma-content-manifests.json');

const ENHANCED_PROMPT = `A premium, sophisticated UI for a financial ledger app.

**DESIGN SYSTEM ENFORCEMENT:**
- Reject playful aesthetics; use a "Digital Ledger" editorial style.
- Use intentional asymmetry and generous white space.
- NO 1px solid borders for sectioning. Use background color shifts instead.
- Use surface-container-low for data tables, and surface-container-lowest for floating cards.
- Apply a glassmorphism effect on any sticky navigation bars.
- Use tabular figures (Monospaced numbers) for any numerical displays.
- Precision is key; every element should feel engineered and professional.`;

async function main() {
  const manifestContent = await readFile(MANIFEST_PATH, 'utf8');
  const { manifests } = JSON.parse(manifestContent);

  const toolClient = new StitchToolClient({ apiKey });
  const stitch = new Stitch(toolClient);

  const targets = manifests.filter(m => 
    m.generatedArtifacts?.stitchProjectId && 
    Array.isArray(m.generatedArtifacts?.selectedScreenIds) && 
    m.generatedArtifacts?.selectedScreenIds.length > 0
  );

  console.log(`Found ${targets.length} kits with Stitch projects to upgrade.`);

  for (const manifest of targets) {
    const run = manifest.generatedArtifacts;
    if (run.kitSlug === 'monzo-figma-kit') {
      console.log(`Skipping ${run.kitSlug} (already upgraded).`);
      continue;
    }

    console.log(`Upgrading ${run.kitSlug} (Project: ${run.stitchProjectId})...`);
    try {
      // Call the tool directly since the SDK wrapper might be outdated
      await toolClient.callTool('edit_screens', {
        projectId: run.stitchProjectId,
        selectedScreenIds: run.selectedScreenIds,
        prompt: ENHANCED_PROMPT
      });
      
      console.log(`  Successfully edited ${run.selectedScreenIds.length} screens for ${run.kitSlug}.`);
    } catch (error) {
      console.error(`  Failed to upgrade ${run.kitSlug}:`, error.message);
    }
  }

  await toolClient.close();
  console.log('\nBulk upgrade complete.');
}

main().catch(console.error);
