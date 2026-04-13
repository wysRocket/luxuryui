import { spawn } from 'node:child_process';
import readline from 'node:readline';

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const DOMAIN = process.env.HOSTINGER_DOMAIN || 'luxuryuilib.com';
const STATIC_PATH = process.env.HOSTINGER_STATIC_PATH || './dist';

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN environment variable is missing.');
    process.exit(1);
}

console.log(`Starting Hostinger CLI deploy for ${DOMAIN} from ${STATIC_PATH}...`);

const server = spawn('npx', ['-y', 'hostinger-api-mcp@latest', '--stdio'], {
    env: {
        ...process.env,
        API_TOKEN,
        DEBUG: process.env.DEBUG || 'false',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
});

const rl = readline.createInterface({ input: server.stdout });

let messageId = 1;

function sendMessage(message) {
    server.stdin.write(`${JSON.stringify(message)}\n`);
}

async function waitForResponse(id) {
    return new Promise((resolve) => {
        rl.on('line', (line) => {
            try {
                const data = JSON.parse(line);
                if (data.id === id) resolve(data);
            } catch {
                // Ignore non-JSON lines from the CLI transport.
            }
        });
    });
}

function parseToolPayload(result) {
    const text = result?.content?.find((item) => item?.type === 'text')?.text;
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function assertSuccessfulStep(stepName, step) {
    if (!step) {
        throw new Error(`Hostinger response is missing the "${stepName}" section.`);
    }

    if (step.status !== 'success') {
        const details = step.error ?? step.data ?? step.message ?? step;
        throw new Error(
            `${stepName} failed: ${typeof details === 'string' ? details : JSON.stringify(details, null, 2)}`
        );
    }
}

server.stderr.on('data', (chunk) => {
    const output = chunk.toString().trim();
    if (output) console.error('[hostinger-cli]', output);
});

server.on('error', (error) => {
    console.error('Failed to start Hostinger CLI:', error);
});

async function run() {
    let exitCode = 0;

    try {
        sendMessage({
            jsonrpc: '2.0',
            id: messageId,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'luxuryui-hostinger-cli-deploy', version: '1.0.0' },
            },
        });

        const initResponse = await waitForResponse(messageId);
        if (initResponse.error) {
            throw new Error(`Initialize failed: ${JSON.stringify(initResponse.error, null, 2)}`);
        }

        console.log('Hostinger CLI initialized:', initResponse.result?.serverInfo?.name ?? 'unknown');

        sendMessage({ jsonrpc: '2.0', method: 'notifications/initialized' });
        messageId += 1;

        console.log('Calling hosting_deployStaticWebsite...');
        sendMessage({
            jsonrpc: '2.0',
            id: messageId,
            method: 'tools/call',
            params: {
                name: 'hosting_deployStaticWebsite',
                arguments: {
                    domain: DOMAIN,
                    archivePath: STATIC_PATH,
                    removeArchive: true,
                },
            },
        });

        const deployResponse = await waitForResponse(messageId);
        if (deployResponse.error) {
            throw new Error(`Hostinger CLI returned an error: ${JSON.stringify(deployResponse.error, null, 2)}`);
        }

        console.log('Deploy result:', JSON.stringify(deployResponse.result, null, 2));

        const payload = parseToolPayload(deployResponse.result);
        if (payload) {
            if (payload.upload) assertSuccessfulStep('upload', payload.upload);
            if (payload.deploy) assertSuccessfulStep('deploy', payload.deploy);
            if (payload.removeArchive && payload.removeArchive.status === 'error') {
                throw new Error(`removeArchive failed: ${JSON.stringify(payload.removeArchive.error ?? payload.removeArchive, null, 2)}`);
            }
        }
    } catch (error) {
        exitCode = 1;
        console.error('Hostinger CLI deploy failed:', error instanceof Error ? error.message : String(error));
    } finally {
        rl.close();
        server.kill();
        process.exit(exitCode);
    }
}

run();
