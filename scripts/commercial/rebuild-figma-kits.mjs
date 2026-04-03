import { spawn } from 'node:child_process';

const forwardedArgs = process.argv.slice(2);

const runNpmScript = (scriptName, args = []) =>
  new Promise((resolve, reject) => {
    const child = spawn(
      'npm',
      ['run', scriptName, ...(args.length > 0 ? ['--', ...args] : [])],
      {
        stdio: 'inherit',
        shell: process.platform === 'win32',
      }
    );

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${scriptName} exited with code ${code ?? 1}`));
    });
  });

const main = async () => {
  await runNpmScript('commercial:generate', forwardedArgs);

  let stitchError = null;
  try {
    await runNpmScript('commercial:generate:stitch', forwardedArgs);
  } catch (error) {
    stitchError = error;
  }

  await runNpmScript('commercial:generate', forwardedArgs);
  await runNpmScript('commercial:readiness', forwardedArgs);

  if (stitchError) {
    throw stitchError;
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
