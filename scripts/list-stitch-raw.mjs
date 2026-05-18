import { createStitchClient } from './commercial/lib/stitchClient.mjs';

const apiKey = process.env.STITCH_API_KEY;

async function run() {
  try {
    if (!apiKey) {
      throw new Error('STITCH_API_KEY is required.');
    }

    const sdk = await import('@google/stitch-sdk');
    const toolClient = new sdk.StitchToolClient({ apiKey });
    const stitch = new sdk.Stitch(toolClient);
    
    console.log("Raw Stitch object keys:", Object.keys(stitch));
    console.log("Raw Stitch prototype keys:", Object.keys(Object.getPrototypeOf(stitch)));
    
    if (stitch.projects) {
        console.log("Calling stitch.projects()...");
        const projects = await stitch.projects();
        console.log(JSON.stringify(projects, null, 2));
    } else {
        console.log("stitch.projects is not available on raw object.");
    }
    
    await toolClient.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}

run();
