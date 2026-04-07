# LuxuryUI - Asset Upscaling & Stitch Generation Pipeline

## 1. Context

- **Goal:** Upscale UI assets, craft tailored Stitch prompts based on new Google guidelines, generate Stitch UI files via the Stitch API mapping to existing Projects, and export them as Figma kits.
- **Why Gemini?** Algorithmic upscaling (e.g., Sharp/Lanczos) didn't work for these UI assets. Only Gemini maintains fidelity.

## 2. Approach: Modular Script Pipeline (Approved)

Separating the upscale process from the Stitch generation ensures we can QA upscaled images before burning credits or time on Stitch generation.

### Step 1: Automated Gemini Upscaling (`scripts/gemini-upscale.mjs`)

- Read images from `dist/assets` or `public/assets/apps/`.
- Call Gemini API (`services/geminiService.ts` / `@google/genai`) to process/upscale the image using a vision prompt designed to reconstruct UI details cleanly.
- Overwrite or output as high-res `.webp` alongside the original.

### Step 2: Stitch Prompt Crafting (`scripts/commercial/lib/stitchPromptBuilder.mjs`)

- Refactor the existing builder.
- Implement the structured prompt format from [Stitch Prompt Guide](https://discuss.ai.google.dev/t/stitch-prompt-guide/83844):
  - Start with UI visual structure (layout, spacing, grid).
  - Add typography scale, colors, component specifics.
  - Omit generic buzzwords; use semantic, highly-specific HTML/CSS descriptors.

### Step 3: Stitch Generation (`scripts/commercial/generate-stitch-kits.mjs`)

- Fetch the upscaled `.webp` images.
- Map the local generation tasks to the **existing** Stitch Projects (so we don't duplicate state).
- Transmit the upscaled image as a reference attachment in the Stitch API call.
- Download the generated Stitch/HTML payload.

### Step 4: Export to Figma Kits

- Execute the existing commercial pipeline (`luxuryui-kit-publish` -> `publish-to-figma.mjs`).
- This converts the newly generated HTML/CSS from Stitch into Figma nodes, packages the kit logic, and syncs `data/figmaKits.ts`.

## 3. Data Flow

`public/assets` -> **[Gemini Upscale]** -> `public/assets/...webp` -> **[Stitch Builder & Gen API (reference image attached)]** -> `.stitch/designs/` -> **[Figma Publish]** -> `data/figmaKits.ts`
