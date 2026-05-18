import { createStitchClient } from './scripts/commercial/lib/stitchClient.mjs';

async function main() {
  try {
    const apiKey = process.env.STITCH_API_KEY;
    console.log('Using API Key:', apiKey ? 'SET' : 'NOT SET');
    
    const client = await createStitchClient({ apiKey });
    
    // Attempt to list projects if we can find a way
    // Since createStitchClient is a wrapper, let's try to access the underlying stitch object
    // Or just try to create a dummy project to test connection
    console.log('Attempting to create a test connection...');
    
    // In stitchClient.mjs:
    // const stitch = new sdk.Stitch(toolClient);
    // return { createProject(title) { ... } }
    
    // Let's try to call createProject (but we won't actually create one if it requires more data)
    // Actually, I'll just check if the client was created successfully.
    console.log('Client created successfully.');
    
    // Let's try to list projects using the MCP tool's logic but via a script
    // I don't have the MCP server code, but I have the SDK.
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
