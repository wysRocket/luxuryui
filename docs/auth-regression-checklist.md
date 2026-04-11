# Auth Regression Checklist

Run this checklist when changing auth, session, account, wallet sync, or unlock flows.

## Environment Readiness

- Firebase mode has all required keys configured.
- Google provider is enabled in Firebase Auth.
- All app domains are present in Firebase Auth authorized domains.
- `VITE_FIREBASE_GOOGLE_AUTH_ENABLED=true` in `.env.local` for Firebase mode.
- `VITE_FIREBASE_AUTHORIZED_DOMAINS` matches deployment hostnames.

## Local Mode Coverage

- Sign up with email/password works.
- Sign in with correct credentials works.
- Sign in with invalid password shows an auth error.
- Sign out clears authenticated state.
- Credits, unlocks, and downloads still work for local sessions.

## Firebase Password Coverage

- Sign up creates Firebase account and enters authenticated state.
- Sign in restores previous wallet, unlocks, transactions, and orders.
- Sign out clears authenticated state and protected routes redirect to login.

## Firebase Google Coverage

- Continue with Google signs in successfully.
- Cancelling popup shows clear guidance without crashing the page.
- Popup blocked scenario surfaces a user-actionable message.
- Existing Google user returns to authenticated state with synchronized data.

## Admin Backoffice Coverage

- `userProfiles/{uid}` is created or refreshed after Firebase sign-in.
- `userRoles/{uid}` exists with the default `user` role for non-admin accounts.
- A seeded admin role can access `/admin` and sees observability data.
- A non-admin authenticated user is redirected away from `/admin`.
- Firestore rules still allow buyers to read only their own wallet subtree.

## Routing And Session

- `redirect` query parameter is honored after login and signup.
- Protected routes display loading state during auth hydration.
- Auth state remains consistent after page refresh.

## Commerce And Delivery

- Top-up updates wallet balance and transaction history.
- Purchasing a kit updates unlock/order state.
- Downloading a kit updates download status.

## Release Gate

- `npm run build` succeeds.
- No new diagnostics in auth-related files.
