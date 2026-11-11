# Secret Hitler - SvelteKit Frontend

This project is the frontend for the Secret Hitler game, intended to be deployed to Firebase Hosting. It is written in SvelteKit and is designed to work with the backend, deployed to Firebase Functions.

It's a static single-page app: everything runs in the browser, and Firebase Hosting only serves
files. The browser signs in with Firebase Authentication, reads the game from the Realtime
Database, and plays moves through the backend's API. What protects the data is the database's
security rules and the API, which check the login on every read and request.

Secret Hitler Firebase : https://github.com/touficbatache/SecretHitlerFirebase

## Prerequisites

Before getting started, make sure you have the following installed:

- Node.js
- npm

## Installation

```bash
git clone https://github.com/touficbatache/SecretHitlerSvelte.git
cd SecretHitlerSvelte
npm install
```

### Firebase configuration

To configure the project, you need to set up Firebase Hosting, in the same Firebase project as the backend.

**I - First, you will need to install the Firebase CLI using the following command:**

```shell
npm install -g firebase-tools
```

**Note:** The `-g` flag installs a package (here Firebase CLI) globally, which allows you
to call it from any command line on your local computer.

**II - Then, you'll have to create a Firebase project with the following features turned on:**

- Authentication
- AppCheck
- Realtime Database
- Hosting

and login:

```shell
firebase login
```

**III - Link the project you just created by running the following command:**

```shell
npm run link --project=[PROJECTNAME]
```

This will create a `.firebaserc` file in the root directory of the project, which will contain the project name you just linked.

It will also create 3 `.env` files alongside the `.firebaserc` file:

- 1 `.env` file for the local environment
- 2 `.env.<alias>` files as:
  - `.env.dev` for the remote development environment
  - `.env.prod` for the remote production environment

**IV - Set correct environment variables**

Make sure to fill in the correct values for the environment variables in your `.env.<alias>` (`.env.dev` or `.env.prod`) files.

## Run locally

To run the project locally, you need to set the correct environment variable values for development in `.env`.

Then execute the following command:

```shell
npm run dev
```

## Tests

Unit tests (game helpers, no browser):

```shell
npm test
```

End-to-end tests run the app in Chromium against the Firebase auth and database emulators, with two
players signed in through the real login page. Game states are written straight into the database
emulator, and a small fake replaces the game API (`tests/e2e/fake-api.ts`). They need the Firebase CLI
(`npm install -g firebase-tools`, which needs Java for the emulators) and Playwright's Chromium
(`npx playwright install chromium`):

```shell
npm run test:e2e
```

`tests/e2e/database.rules.json` is a copy of the backend's `database.rules.json`: update it when those
rules change.

GitHub Actions runs the lint (`npm run lint`), the type check (`npm run check`), the build and both
test suites on every pull request and on `master` (`.github/workflows/ci.yml`).

## Deploy

Every merge to `master` deploys itself: once both CI jobs pass, GitHub Actions builds the static
app with the production settings and deploys it to Firebase Hosting
(`.github/workflows/ci.yml`). The game API ([SecretHitlerFirebase](https://github.com/touficbatache/SecretHitlerFirebase))
deploys the same way from its own repository: merge the two halves of a change that needs both
together.

### One-time setup

1. Follow "Continuous deployment: one-time setup" in the
   [SecretHitlerFirebase README](https://github.com/touficbatache/SecretHitlerFirebase#continuous-deployment-one-time-setup).
   It creates the keyless login both repositories use.
2. In this repository on GitHub (Settings, Secrets and variables, Actions):
   - **Variables:** the same `FIREBASE_PROJECT`, `GCP_WORKLOAD_IDENTITY_PROVIDER` and
     `GCP_SERVICE_ACCOUNT` as the API's repository.
   - **Secret** `PROD_ENV_FILE`: the whole content of your `.env.prod` (see `example.env`), with
     `PUBLIC_USE_EMULATORS=false`. The deploy writes it to `.env.prod` and builds with it, as
     `npm run deploy:prod` does. All of these values end up in the public app; it's a secret
     only to keep the settings in one place.

A deploy with a missing setting fails with a message naming it.

### Deploy by hand

Set the values for the development or production environment in `.env.dev` or `.env.prod`. The
build uses them through Vite's modes (`vite build --mode prod` reads `.env.prod`).

Then build and deploy to the development or the production environment:

```shell
npm run deploy:dev
npm run deploy:prod
```
