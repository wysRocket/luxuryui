import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Stitch, StitchToolClient } from '@google/stitch-sdk';

const apiKey = process.env.STITCH_API_KEY;

const ENHANCED_PROMPT_TEMPLATE = (designMd, projectTitle) => `A premium, sophisticated UI for ${projectTitle}.

${designMd ? `**EXISTING DESIGN SYSTEM CONTEXT:**\n${designMd}\n\n` : ''}**DESIGN SYSTEM ENFORCEMENT (MANDATORY):**
- Reject playful aesthetics; use a "Digital Ledger" editorial style.
- Use intentional asymmetry and generous white space.
- NO 1px solid borders for sectioning. Use background color shifts instead.
- Use surface-container-low for data tables, and surface-container-lowest for floating cards.
- Apply a glassmorphism effect on any sticky navigation bars.
- Use tabular figures (Monospaced numbers) for any numerical displays.
- Precision is key; every element should feel engineered and professional.
- Preserve the core brand identity (colors/fonts) mentioned in the context, but apply them using the "Digital Ledger" rules.`;

async function main() {
  if (!apiKey) {
    console.error("STITCH_API_KEY environment variable is required.");
    process.exit(1);
  }

  const toolClient = new StitchToolClient({ apiKey });

  console.log("Fetching all projects from Stitch server...");
  const response = await toolClient.callTool('list_projects', { filter: 'view=owned' });
  const projects = response.projects || [];
  
  const kitProjects = projects.filter(p => p.title && p.title.includes("Figma Flow Kit"));
  console.log(`Found ${kitProjects.length} kit projects on the server.`);

  // Sort by name or title to have some order
  kitProjects.sort((a, b) => a.title.localeCompare(b.title));

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const designSystemsDir = path.resolve(__dirname, '../../design-systems');
  const manifestPath = path.resolve(__dirname, '../../data/curation/commercial/figma-content-manifests.json');
  
  let manifest = [];
  try {
    const manifestData = JSON.parse(await readFile(manifestPath, 'utf8'));
    manifest = manifestData.manifests || manifestData.kits || manifestData || [];
  } catch (e) {
    console.error("Failed to read manifest:", e.message);
  }

  for (const project of kitProjects) {
    // Extract ID from "projects/ID"
    const projectId = project.name.split('/')[1];
    console.log(`\nProcessing: ${project.title} (ID: ${projectId})`);

    // Try to find matching Design.md
    let kitDesignMd = '';
    const designFiles = await readdir(designSystemsDir);
    
    // Find the best matching file
    const kitNamePart = project.title.replace('Figma Flow Kit', '').trim().toLowerCase();
    const matchingFile = designFiles.find(f => {
      if (!f.endsWith('.md')) return false;
      const slug = f.replace('.md', '').toLowerCase();
      // Check if kit name part contains the slug (e.g. "Apple Music" contains "apple-music")
      return kitNamePart.includes(slug.replace('-', ' '));
    });

    if (matchingFile) {
      const designFilePath = path.join(designSystemsDir, matchingFile);
      kitDesignMd = await readFile(designFilePath, 'utf8');
      console.log(`  Found matching design system: ${matchingFile}`);
    } else {
       console.log(`  No matching design system found for "${kitNamePart}". Skipping local context.`);
    }

    try {
      console.log(`  Fetching screens...`);
      const screenResponse = await toolClient.callTool('list_screens', { projectId });
      const screens = screenResponse.screens || [];
      const screenIds = screens.map(s => s.name.split('/').pop());

      if (screenIds.length === 0) {
        console.log(`  Project is empty. Attempting to generate screens...`);
        
        // Find screen list from manifest
        const manifestKit = manifest.find(k => {
          const slug = k.productSlug || '';
          const slugBase = slug.replace('-figma-kit', '').replace('-', ' ');
          return kitNamePart.includes(slugBase);
        });

        if (!manifestKit) {
          console.log(`  Could not find screen list in manifest for ${project.title}. Skipping generation.`);
          continue;
        }

        const screenContents = (manifestKit.pageBlueprints || [])
          .find(p => p.name === 'Flow')?.contents || ["Dashboard"];
        
        // Take the first 4 screens to avoid hitting timeouts/limits too hard
        const screensToGenerate = screenContents.slice(0, 4);
        console.log(`  Generating ${screensToGenerate.length} screens from manifest: ${screensToGenerate.join(', ')}`);

        for (const screenName of screensToGenerate) {
          try {
            console.log(`    Generating screen: ${screenName}...`);
            const finalPrompt = `${ENHANCED_PROMPT_TEMPLATE(kitDesignMd, project.title)}\n\n**SCREEN OBJECTIVE:** Generate a high-fidelity ${screenName} screen for this app.`;
            
            await toolClient.callTool('generate_screen_from_text', {
              projectId,
              prompt: finalPrompt,
              deviceType: project.deviceType || 'MOBILE'
            });
            console.log(`    Successfully generated ${screenName}.`);
          } catch (genError) {
            console.error(`    Failed to generate ${screenName}:`, genError.message);
          }
        }
        continue;
      }

      console.log(`  Found ${screenIds.length} screens. Triggering batch edit...`);
      
      const finalPrompt = ENHANCED_PROMPT_TEMPLATE(kitDesignMd, project.title);

      // Execute edit_screens
      await toolClient.callTool('edit_screens', {
        projectId,
        selectedScreenIds: screenIds,
        prompt: finalPrompt
      });
      
      console.log(`  Successfully triggered upgrade for ${project.title}.`);
    } catch (error) {
      console.error(`  Error processing ${project.title}:`, error.message);
    }
  }

  console.log("\nBulk upgrade trigger process complete.");
  await toolClient.close();
}

main().catch(console.error);
