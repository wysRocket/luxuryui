import { spawn } from 'child_process';
import readline from 'readline';

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const DOMAIN = process.env.HOSTINGER_DOMAIN || 'luxuryuilib.com';
const ARCHIVE_PATH = process.env.ARCHIVE_PATH || './dist.zip';

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN environment variable is missing.');
    process.exit(1);
}

console.log(`Starting deployment for ${DOMAIN} using archive ${ARCHIVE_PATH}...`);

// Start the hostinger-api-mcp server
const server = spawn('npx', ['-y', 'hostinger-api-mcp@latest', '--stdio'], {
    env: {
        ...process.env,
        API_TOKEN: API_TOKEN,
    },
    stdio: ['pipe', 'pipe', 'pipe'],
});

const rl = readline.createInterface({ input: server.stdout });

let messageId = 1;

function sendMessage(msg) {
    const str = JSON.stringify(msg);
    server.stdin.write(str + '\n');
}

async function waitForResponse(id) {
    return new Promise((resolve) => {
        rl.on('line', (line) => {
            try {
                const data = JSON.parse(line);
                if (data.id === id) resolve(data);
            } catch { }
        });
    });
}

function parseToolPayload(result) {
    const text = result?.content?.find((item) => item?.type === 'text')?.text;
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch (error) {
        throw new Error(`Failed to parse Hostinger response payload: ${error.message}`);
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

server.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.trim()) console.error('[stderr]', msg.trim());
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callDeployTool() {
    sendMessage({
        jsonrpc: '2.0',
        id: messageId,
        method: 'tools/call',
        params: {
            name: 'hosting_deployStaticWebsite',
            arguments: {
                domain: DOMAIN,
                archivePath: ARCHIVE_PATH,
                removeArchive: false,
            },
        },
    });
    return waitForResponse(messageId);
}

async function run() {
    let exitCode = 0;

    try {
        // Initialize
        sendMessage({
            jsonrpc: '2.0',
            id: messageId,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'github-actions-deploy', version: '1.0.0' },
            },
        });

        const initResponse = await waitForResponse(messageId);
        console.log('MCP Server Initialized:', initResponse.result?.serverInfo?.name);

        // Send initialized notification
        sendMessage({ jsonrpc: '2.0', method: 'notifications/initialized' });
        messageId++;

        // Call hosting_deployStaticWebsite with retry for transient 500 errors
        const MAX_ATTEMPTS = 3;
        const RETRY_DELAY_MS = 10000;
        let lastError;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            if (attempt > 1) {
                console.log(`Retrying deploy (attempt ${attempt}/${MAX_ATTEMPTS}) after ${RETRY_DELAY_MS / 1000}s delay...`);
                await sleep(RETRY_DELAY_MS);
                messageId++;
            }

            console.log(`Calling hosting_deployStaticWebsite (attempt ${attempt}/${MAX_ATTEMPTS})...`);
            const deployResponse = await callDeployTool();

            if (deployResponse.error) {
                console.error('Deploy error:', JSON.stringify(deployResponse.error, null, 2));
                lastError = new Error(`MCP error: ${JSON.stringify(deployResponse.error)}`);
                continue;
            }

            console.log('Deploy result:', JSON.stringify(deployResponse.result, null, 2));

            const payload = parseToolPayload(deployResponse.result);
            if (!payload) {
                throw new Error('Hostinger tool response did not include a JSON payload.');
            }

            // Upload succeeded — if deploy fails with "Archive not found" (transient), retry
            if (payload.upload?.status === 'success' && payload.deploy?.status !== 'success') {
                const errMsg = typeof payload.deploy?.error === 'string'
                    ? payload.deploy.error
                    : JSON.stringify(payload.deploy?.error ?? payload.deploy);
                const isTransient = errMsg.includes('500') || errMsg.includes('Archive not found');
                if (isTransient && attempt < MAX_ATTEMPTS) {
                    console.log(`Deploy trigger failed (transient): ${errMsg}`);
                    lastError = new Error(`deploy failed: ${errMsg}`);
                    continue;
                }
            }

            assertSuccessfulStep('upload', payload.upload);
            assertSuccessfulStep('deploy', payload.deploy);
            lastError = null;
            break;
        }

        if (lastError) throw lastError;
    } catch (err) {
        console.error('Unexpected error:', err);
        exitCode = 1;
    } finally {
        rl.close();
        server.kill();
        process.exit(exitCode);
    }
}

run();
