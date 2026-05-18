import { createStitchClient } from './commercial/lib/stitchClient.mjs';

const apiKey = process.env.STITCH_API_KEY;

async function run() {
  try {
    if (!apiKey) {
      throw new Error('STITCH_API_KEY is required.');
    }

    const stitch = await createStitchClient({ apiKey });
    console.log("Listing Stitch projects...");
    const projects = await stitch.projects();
    console.log(JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error("Error listing projects:", error.message);
    if (error.stack) console.error(error.stack);
  }
}

run();
