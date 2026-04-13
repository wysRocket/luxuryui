import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const DOMAIN = process.env.HOSTINGER_DOMAIN || 'luxuryuilib.com';
const STATIC_PATH = process.env.HOSTINGER_STATIC_PATH || './dist';
const HOSTINGER_MCP_VERSION = process.env.HOSTINGER_MCP_VERSION || '0.1.36';
const RESPONSE_TIMEOUT_MS = Number(process.env.HOSTINGER_MCP_RESPONSE_TIMEOUT_MS || 60000);

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN environment variable is missing.');
    process.exit(1);
}

if (!fs.existsSync(STATIC_PATH)) {
    console.error(`Error: Hostinger static path does not exist: ${STATIC_PATH}`);
    process.exit(1);
}

console.log(`Starting Hostinger CLI deploy for ${DOMAIN} from ${STATIC_PATH}...`);

const childEnv = {
    PATH: process.env.PATH,
    HOME: process.env.HOME,
    USERPROFILE: process.env.USERPROFILE,
    TMPDIR: process.env.TMPDIR,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP,
    npm_config_cache: process.env.npm_config_cache,
    npm_config_userconfig: process.env.npm_config_userconfig,
    API_TOKEN,
    DEBUG: process.env.DEBUG || 'false',
};

const server = spawn('npx', ['-y', `hostinger-api-mcp@${HOSTINGER_MCP_VERSION}`, '--stdio'], {
    env: {
        ...Object.fromEntries(Object.entries(childEnv).filter(([, value]) => Boolean(value))),
    },
    stdio: ['pipe', 'pipe', 'pipe'],
});

const rl = readline.createInterface({ input: server.stdout });

let messageId = 1;
let childProcessTerminated = false;
let childProcessError = null;
const pendingResponses = new Map();

rl.on('line', (line) => {
    try {
        const data = JSON.parse(line);
        const pending = pendingResponses.get(data.id);
        if (!pending) {
            return;
        }

        pendingResponses.delete(data.id);
        clearTimeout(pending.timeoutId);
        pending.resolve(data);
    } catch {
        // Ignore non-JSON lines from the CLI transport.
    }
});

function rejectPendingResponses(message) {
    for (const [id, pending] of pendingResponses.entries()) {
        clearTimeout(pending.timeoutId);
        pending.reject(new Error(`${message} (pending response id ${id})`));
        pendingResponses.delete(id);
    }
}

function sendMessage(message) {
    if (childProcessError) {
        throw childProcessError;
    }

    if (childProcessTerminated || !server.stdin || server.stdin.destroyed) {
        throw new Error('Hostinger CLI process is not available.');
    }

    server.stdin.write(`${JSON.stringify(message)}\n`);
}

async function waitForResponse(id) {
    return new Promise((resolve, reject) => {
        if (childProcessError) {
            reject(childProcessError);
            return;
        }

        if (childProcessTerminated) {
            reject(new Error('Hostinger CLI process exited before responding.'));
            return;
        }

        const timeoutId = setTimeout(() => {
            pendingResponses.delete(id);
            reject(new Error(`Timeout waiting for response with id ${id}`));
        }, RESPONSE_TIMEOUT_MS);

        pendingResponses.set(id, { resolve, reject, timeoutId });
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
    childProcessError = error instanceof Error ? error : new Error(String(error));
    childProcessTerminated = true;
    rejectPendingResponses(childProcessError.message);
});

server.on('close', (code, signal) => {
    childProcessTerminated = true;
    if (!childProcessError) {
        const reason = signal ? `signal ${signal}` : `exit code ${code ?? 'unknown'}`;
        rejectPendingResponses(`Hostinger CLI process closed with ${reason}`);
    }
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

        const payload = parseToolPayload(deployResponse.result);
        if (!payload) {
            throw new Error('Hostinger CLI returned an unparseable or empty payload.');
        }

        if (deployResponse.result?.isError) {
            throw new Error('Hostinger CLI marked the tool response as an error.');
        }

        if (payload.upload) assertSuccessfulStep('upload', payload.upload);
        if (payload.deploy) assertSuccessfulStep('deploy', payload.deploy);
        if (payload.removeArchive && payload.removeArchive.status === 'error') {
            throw new Error(`removeArchive failed: ${JSON.stringify(payload.removeArchive.error ?? payload.removeArchive, null, 2)}`);
        }

        const deploySummary = {
            domain: payload.deploy?.domain ?? payload.domain ?? DOMAIN,
            status: payload.deploy?.status ?? payload.status ?? 'unknown',
            deploymentId: payload.deploy?.deploymentId ?? payload.deploy?.id ?? payload.id ?? 'unknown',
            archive: path.basename(STATIC_PATH),
        };

        console.log('Deploy result summary:', JSON.stringify(deploySummary, null, 2));
    } catch (error) {
        exitCode = 1;
        console.error('Hostinger CLI deploy failed:', error instanceof Error ? error.message : String(error));
    } finally {
        rl.close();
        if (!childProcessTerminated) {
            server.kill();
        }
        process.exit(exitCode);
    }
}

run();
