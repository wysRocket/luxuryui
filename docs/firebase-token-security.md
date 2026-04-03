# Firebase Token Security Improvements

## Summary

Refactored [scripts/add-firebase-domain.mjs](../scripts/add-firebase-domain.mjs) to secure Firebase access tokens by eliminating string interpolation in exec commands.

## Security Issues Fixed

### Before (Vulnerable)

```javascript
// Token exposed in command string
const { stdout: configOutput } = await execAsync(
  `curl -s -X GET "${configUrl}" -H "Authorization: Bearer ${accessToken}"`,
);

const updateCmd = `curl -s -X PATCH "${configUrl}" \\
  -H "Authorization: Bearer ${accessToken}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(updatePayload)}'`;
```

**Risks:**

- Token visible in process listings (`ps aux`)
- Token stored in shell history
- Token exposed to child processes
- Command debugging with `bash -x` exposes token
- Curl subprocess can be intercepted

### After (Secure)

```javascript
async function fetchWithAuth(url, method = "GET", body = null, token) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  // ... uses Node.js native fetch API
}

const result = await fetchWithAuth(
  configUrl,
  "PATCH",
  updatePayload,
  accessToken,
);
```

**Benefits:**

- Token stays in Node.js memory only
- Never exposed in process arguments
- No external curl subprocess
- Native HTTP handling with proper error handling
- Token only visible in Node debugger (not shell)

## Implementation Details

1. **Added `fetchWithAuth()` helper function**
   - Encapsulates secure Bearer token authentication
   - Uses Node.js native `fetch` API (Node.js 18+)
   - Proper error handling with HTTP status checks

2. **Removed curl subprocess calls**
   - Eliminated two vulnerable exec calls
   - Replaced with direct fetch requests

3. **Token Lifecycle**
   - `gcloud auth application-default print-access-token` still retrieves token
   - Token immediately stored in variable and NOT interpolated
   - Token passed as function parameter to fetch helper
   - Token remains in Node.js process memory only

## Backward Compatibility

- Requires Node.js 18+ (for native fetch API support)
- Maintains same functionality and error handling
- Same manual Firebase Console fallback option

## Best Practices Applied

✓ Secrets stored in memory variables, not command strings  
✓ Native HTTP APIs preferred over shell commands  
✓ No token exposure in child processes  
✓ Secure header handling  
✓ Proper status code validation

## Recommendations for Other Scripts

Review other scripts in `scripts/` directory for similar token/secret exposure patterns:

- Avoid `exec()`, `spawn()`, `sh()` with sensitive data
- Pass secrets via function parameters or environment (NODE only)
- Prefer native APIs over shell commands
