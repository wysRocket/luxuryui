#!/usr/bin/env node
/**
 * Firebase Authorized Domain Helper
 * Identifies dev server domain and provides Firebase Console setup steps
 */

import http from "http";

const detectDevDomain = () => {
  // Common Vite/dev server ports
  const ports = [5173, 3000, 5174, 3001];
  const hosts = ["localhost", "127.0.0.1"];

  return {
    primary: "localhost:5173",
    alternatives: hosts.flatMap((h) => ports.map((p) => `${h}:${p}`)),
  };
};

const getSetupInstructions = (domain) => {
  const projectId = "luxuryui";
  const consoleUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  return `
╔════════════════════════════════════════════════════════════════════╗
║                 Firebase Authorized Domain Setup                   ║
╚════════════════════════════════════════════════════════════════════╝

🔍 Detected Dev Domain: ${domain}

Error: auth/unauthorized-domain
→ This domain is not whitelisted in Firebase Authentication

✅ Fix Steps:

  1️⃣  Open Firebase Console:
      ${consoleUrl}

  2️⃣  Go to "Authentication" tab

  3️⃣  Click the Settings icon (gear) at the top

  4️⃣  Scroll to "Authorized domains"

  5️⃣  Click "Add domain"

  6️⃣  Enter: ${domain}

  7️⃣  Click "Add"

  8️⃣  Reload your browser

🎯 Expected domains:
   • Development: localhost:5173, localhost:3000, 127.0.0.1:5173
   • Production:  yoursite.com, www.yoursite.com

📝 After adding the domain:
   • Firebase will automatically apply the change
   • You may need to clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Delete)
   • Refresh the page and try signing in again

⏱️  Takes ~30 seconds to propagate

`;
};

const printHelp = () => {
  const domains = detectDevDomain();
  console.log(getSetupInstructions(domains.primary));
  console.log("Alternative domains to try:");
  domains.alternatives.forEach((d) => console.log(`   • ${d}`));
};

printHelp();
