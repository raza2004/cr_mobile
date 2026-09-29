# Checkroom Client — Mobile

React Native (Expo) version of the Checkroom client app, ported from the `CR_Client` Next.js web app.

```
CR_Mobile/
├── src/app/          Screens (Expo Router, file-based like Next's app/ dir)
├── src/components/   Shared UI
├── src/lib/          API client, auth, socket, image helpers, theme
├── assets/           Icons and images copied from CR_Client/public
└── server/           Express API used by the app (ported from CR_Client/src/app/api)
```

## Why there's a server

CR_Client's API routes live inside Next.js and authenticate with next-auth browser cookies, which a
native app can't use. `server/` has the same routes and Mongoose models, with login returning a
token that the app sends as `Authorization: Bearer <token>`. It connects to the same MongoDB, so
existing accounts and data work.

## Setup

Requires Node 20+.

### 1. API server

```bash
cd server
npm install
cp .env.example .env    # fill in MONGODB_URI, TOKEN_SECRET, email settings (same as CR_Client)
npm run dev             # http://localhost:4000
```

### 2. App

```bash
npm install
cp .env.example .env    # set EXPO_PUBLIC_API_URL to your computer's LAN IP, e.g. http://192.168.1.20:4000
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS), or press `a` for an Android emulator.
On a physical phone, `localhost` points at the phone itself, so use your computer's LAN IP.

## Deep links

The app uses the `crmobile://` scheme:

| Link | Screen |
| --- | --- |
| `crmobile://signup?token=…` | Stylist invitation signup |
| `crmobile://setPassword?token=…` | Password reset (sent by the server) |
| `crmobile://verifyEmail?token=…` | Email verification |

The stylist portal needs to send invitation links in the `crmobile://signup?token=…` form for
mobile signup. Test a link with `npx uri-scheme open "crmobile://setPassword?token=abc" --android`.

## Building

```bash
npx eas-cli@latest build --platform android --profile preview   # installable APK
npx eas-cli@latest build --platform ios
```

## Scripts

| Command | Does |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run server` | Start the API server |
| `npm run typecheck` | TypeScript check |
