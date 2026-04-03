#!/usr/bin/env node
/**
 * Add authorized domain to Firebase project
 * Usage: node scripts/add-firebase-domain.mjs localhost:5173
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Make HTTP request with Bearer token in header
 * Uses environment variable to avoid token exposure in process args
 */
async function fetchWithAuth(url, method = "GET", body = null, token) {
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

const projectId = "luxuryui";
const newDomain = process.argv[2] || "localhost:5173";

async function addAuthorizedDomain() {
  try {
    console.log(`Adding domain "${newDomain}" to Firebase project "${projectId}"...`);

    // Get access token in a separate process to avoid exposing it
    const { stdout: token } = await execAsync(
      "gcloud auth application-default print-access-token"
    );
    const accessToken = token.trim();

    // Token is now stored in a variable, never interpolated into command strings
    const configUrl = `https://identitytoolkit.googleapis.com/admin/v2/projects/${projectId}/config`;
    
    let currentConfig = {};
    try {
      currentConfig = await fetchWithAuth(configUrl, "GET", null, accessToken);
    } catch (e) {
      console.log("Could not fetch current config, will create new one");
    }

    // Prepare authorized domains list
    const authorizedDomains = currentConfig.authorizedDomains || [];
    if (!authorizedDomains.includes(newDomain)) {
      authorizedDomains.push(newDomain);
      console.log(`Added domain to list: ${authorizedDomains.join(", ")}`);
    } else {
      console.log(`Domain "${newDomain}" already in authorized domains`);
      return;
    }

    // Update config - token is passed securely, not interpolated
    const updatePayload = {
      ...currentConfig,
      authorizedDomains,
    };

    const result = await fetchWithAuth(
      configUrl,
      "PATCH",
      updatePayload,
      accessToken
    );

    if (result.authorizedDomains) {
      console.log(`✓ Successfully updated authorized domains:`);
      console.log(`  ${result.authorizedDomains.join("\n  ")}`);
    } else {
      console.log("Response:", result);
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.log("\nAlternative: Update manually in Firebase Console:");
    console.log(`1. Go to https://console.firebase.google.com/project/${projectId}/authentication/settings`);
    console.log(`2. Click "Add Domain" under "Authorized domains"`);
    console.log(`3. Enter: ${newDomain}`);
    process.exit(1);
  }
}

addAuthorizedDomain();
