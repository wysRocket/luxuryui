import fs from 'node:fs';
import path from 'node:path';

import axios from 'axios';
import * as tus from 'tus-js-client';

const API_TOKEN = process.env.HOSTINGER_API_TOKEN;
const BASE_URL = process.env.HOSTINGER_API_BASE_URL || 'https://developers.hostinger.com/';
const DOMAIN = process.env.HOSTINGER_DOMAIN || 'luxuryuilib.com';
const ARCHIVE_PATH = process.env.ARCHIVE_PATH || './dist.zip';
const INITIAL_DEPLOY_DELAY_MS = Number(process.env.HOSTINGER_INITIAL_DEPLOY_DELAY_MS || 15000);
const DEPLOY_RETRY_DELAY_MS = Number(process.env.HOSTINGER_DEPLOY_RETRY_DELAY_MS || 30000);
const MAX_DEPLOY_ATTEMPTS = Number(process.env.HOSTINGER_DEPLOY_MAX_ATTEMPTS || 10);
const DEPLOY_REQUEST_TIMEOUT_MS = Number(process.env.HOSTINGER_DEPLOY_REQUEST_TIMEOUT_MS || 180000);

if (!API_TOKEN) {
    console.error('Error: HOSTINGER_API_TOKEN environment variable is missing.');
    process.exit(1);
}

console.log(`Starting deployment for ${DOMAIN} using archive ${ARCHIVE_PATH}...`);

const requestHeaders = {
    Accept: 'application/json',
    Authorization: `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'luxuryui-deploy/1.0.0',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function buildApiUrl(resourcePath) {
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
    return new URL(resourcePath, baseUrl).toString();
}

function normalizePath(pathString) {
    return pathString.replace(/\\/g, '/');
}

function validateArchiveFile(archivePath) {
    if (!fs.existsSync(archivePath)) {
        throw new Error(`Archive file not found: ${archivePath}`);
    }

    const archiveStats = fs.statSync(archivePath);
    if (!archiveStats.isFile()) {
        throw new Error(`Archive path is not a file: ${archivePath}`);
    }
}

function formatAxiosError(error) {
    if (!axios.isAxiosError(error)) {
        return error instanceof Error ? error.message : String(error);
    }

    const responseData = error.response?.data;
    const responseText = typeof responseData === 'string'
        ? responseData
        : JSON.stringify(responseData);

    return JSON.stringify({
        status: error.response?.status,
        data: responseText,
        message: error.message,
    });
}

function isArchiveNotFoundError(error) {
    if (!axios.isAxiosError(error)) {
        return false;
    }

    const responseData = error.response?.data;
    const responseText = typeof responseData === 'string'
        ? responseData
        : JSON.stringify(responseData);

    return error.response?.status === 500 && responseText.includes('Archive not found');
}

function isDeployTimeoutError(error) {
    return axios.isAxiosError(error)
        && (error.code === 'ECONNABORTED' || error.message.includes('timeout'));
}

function isTransientDeployError(error) {
    return isArchiveNotFoundError(error) || isDeployTimeoutError(error);
}

async function resolveUsername(domain) {
    const response = await axios({
        method: 'get',
        url: buildApiUrl(`api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`),
        headers: requestHeaders,
        timeout: 60000,
        validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
        throw new Error(`Failed to resolve username: ${JSON.stringify(response.data)}`);
    }

    const websites = response.data?.data;
    if (!Array.isArray(websites) || websites.length === 0 || !websites[0]?.username) {
        throw new Error(`Username not found for domain: ${domain}`);
    }

    return websites[0].username;
}

async function fetchUploadCredentials(username, domain) {
    const response = await axios({
        method: 'post',
        url: buildApiUrl('api/hosting/v1/files/upload-urls'),
        headers: requestHeaders,
        data: { username, domain },
        timeout: 60000,
        validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
        throw new Error(`Failed to fetch upload credentials: ${JSON.stringify(response.data)}`);
    }

    const { url, auth_key: authToken, rest_auth_key: authRestToken } = response.data ?? {};
    if (!url || !authToken || !authRestToken) {
        throw new Error('Invalid upload credentials received from API');
    }

    return { uploadUrl: url, authToken, authRestToken };
}

async function uploadArchive(localArchivePath, remoteArchiveName, uploadUrl, authRestToken, authToken) {
    const archiveStats = fs.statSync(localArchivePath);
    const fileStream = fs.createReadStream(localArchivePath);
    const cleanUploadUrl = uploadUrl.replace(/\/$/, '');
    const normalizedPath = normalizePath(remoteArchiveName);
    const uploadUrlWithFile = `${cleanUploadUrl}/${normalizedPath}?override=true`;
    const uploadHeaders = {
        'X-Auth': authToken,
        'X-Auth-Rest': authRestToken,
        'upload-length': archiveStats.size.toString(),
        'upload-offset': '0',
    };

    const PRE_UPLOAD_RETRIES = 4;
    const PRE_UPLOAD_RETRY_DELAY_MS = 5000;
    let lastPreUploadError;
    for (let attempt = 1; attempt <= PRE_UPLOAD_RETRIES; attempt++) {
        try {
            await axios.post(uploadUrlWithFile, '', {
                headers: uploadHeaders,
                timeout: 60000,
                validateStatus: (status) => status === 200 || status === 201,
            });
            lastPreUploadError = null;
            break;
        } catch (error) {
            const code = error.code ?? 'unknown';
            const status = error.response?.status ?? 'no-response';
            lastPreUploadError = error;
            console.warn(`Pre-upload attempt ${attempt}/${PRE_UPLOAD_RETRIES} failed (code=${code}, status=${status}): ${formatAxiosError(error)}`);
            if (attempt < PRE_UPLOAD_RETRIES) {
                await sleep(PRE_UPLOAD_RETRY_DELAY_MS * attempt);
            }
        }
    }
    if (lastPreUploadError) {
        throw new Error(`Pre-upload request failed after ${PRE_UPLOAD_RETRIES} attempts: ${formatAxiosError(lastPreUploadError)}`);
    }

    await new Promise((resolve, reject) => {
        const upload = new tus.Upload(fileStream, {
            uploadUrl: uploadUrlWithFile,
            retryDelays: [1000, 2000, 4000, 8000, 16000, 20000],
            uploadDataDuringCreation: false,
            parallelUploads: 1,
            chunkSize: 10485760,
            headers: uploadHeaders,
            removeFingerprintOnSuccess: true,
            uploadSize: archiveStats.size,
            metadata: {
                filename: path.basename(remoteArchiveName),
            },
            onError: (error) => {
                reject(new Error(`Upload failed: ${error.message || String(error)}`));
            },
            onSuccess: resolve,
        });

        upload.start();
    });

    return remoteArchiveName;
}

async function triggerDeploy(username, domain, remoteArchiveName, uploadUrl) {
    // If the upload URL already scopes to public_html (ends with /public_html),
    // the archive lands directly inside it — use just the filename.
    // Otherwise the session root is the domain root, so prefix with public_html/.
    const uploadBase = uploadUrl.replace(/\/$/, '').split('/api/tus/')[1] ?? '';
    const archivePath = uploadBase.endsWith('public_html')
        ? path.basename(remoteArchiveName)
        : `public_html/${path.basename(remoteArchiveName)}`;
    console.log(`Using archive_path: "${archivePath}" (upload base: "${uploadBase}")`);

    const response = await axios({
        method: 'post',
        url: buildApiUrl(`api/hosting/v1/accounts/${username}/websites/${domain}/deploy`),
        headers: requestHeaders,
        data: { archive_path: archivePath },
        timeout: DEPLOY_REQUEST_TIMEOUT_MS,
        validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
        throw new Error(`Deploy API returned status ${response.status}: ${JSON.stringify(response.data)}`);
    }

    return response.data;
}

async function triggerDeployWithRetry(username, domain, remoteArchiveName, uploadUrl) {
    console.log(`Waiting ${INITIAL_DEPLOY_DELAY_MS / 1000}s for Hostinger to index ${remoteArchiveName}...`);
    await sleep(INITIAL_DEPLOY_DELAY_MS);

    for (let attempt = 1; attempt <= MAX_DEPLOY_ATTEMPTS; attempt++) {
        try {
            console.log(`Triggering deployment (attempt ${attempt}/${MAX_DEPLOY_ATTEMPTS}) for ${DOMAIN}...`);
            return await triggerDeploy(username, domain, remoteArchiveName, uploadUrl);
        } catch (error) {
            if (!isTransientDeployError(error) || attempt === MAX_DEPLOY_ATTEMPTS) {
                throw error;
            }

            const retryReason = isDeployTimeoutError(error)
                ? `Deploy request timed out after ${DEPLOY_REQUEST_TIMEOUT_MS / 1000}s`
                : 'Archive is not visible to Hostinger yet';
            console.warn(`${retryReason}. Retrying in ${DEPLOY_RETRY_DELAY_MS / 1000}s...`);
            await sleep(DEPLOY_RETRY_DELAY_MS);
        }
    }

    throw new Error('Deployment retries exhausted.');
}

async function run() {
    validateArchiveFile(ARCHIVE_PATH);

    console.log(`Resolving Hostinger username for ${DOMAIN}...`);
    const username = await resolveUsername(DOMAIN);
    console.log(`Resolved username: ${username}`);

    console.log(`Fetching upload credentials for ${DOMAIN}...`);
    const { uploadUrl, authToken, authRestToken } = await fetchUploadCredentials(username, DOMAIN);

    const remoteArchiveName = path.basename(ARCHIVE_PATH);
    console.log(`Uploading archive as ${remoteArchiveName}...`);
    await uploadArchive(ARCHIVE_PATH, remoteArchiveName, uploadUrl, authRestToken, authToken);
    console.log(`Successfully uploaded archive: ${remoteArchiveName}`);

    const deployResult = await triggerDeployWithRetry(username, DOMAIN, remoteArchiveName, uploadUrl);
    console.log('Deployment triggered successfully:', JSON.stringify(deployResult, null, 2));
}

run().catch((error) => {
    console.error('Unexpected error:', formatAxiosError(error));
    process.exit(1);
});
