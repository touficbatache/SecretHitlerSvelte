# Secret Hitler - SvelteKit Frontend

This project is the frontend for the Secret Hitler game, intended to be deployed to Firebase Hosting. It is written in SvelteKit and is designed to work with the backend, deployed to Firebase Functions.

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

To configure the project, you need to set up the Firebase Functions and Firebase Hosting.

I - First, you will need to install the Firebase CLI using the following command:

```shell
npm install -g firebase-tools
```

**Note:** The `-g` flag installs a package (here Firebase CLI) globally, which allows you
to call it from any command line on your local computer.

II - Then, you'll have to create a Firebase project with the following features turned on:

- Authentication
- Functions
- Realtime Database
- Hosting

and login:

```shell
firebase login
```

III - Link the project you just created by running the following command:

```shell
npm run link --project=[PROJECTNAME]
```

This will create a `.firebaserc` file in the root directory of the project, which will contain the project name you just linked.

It will also create 3 `.env` files alongside the `.firebaserc` file:

- `.env.local` for the local environment
- `.env.dev` for the remote development environment
- `.env.production` for the remote production environment

Make sure to fill in the correct values for the environment variables in these files.

## Run locally

To run the project locally, you need to set the correct environment variable values for development in `.env.local`.

Then execute the following command:

```shell
npm run dev
```

## Deploy to dev/production

To deploy the project to Firebase Hosting, you need to set the correct environment variable values for the development or production environment in `.env.dev` or `.env.production` respectively.

Then execute the following command to deploy to the development environment:

```shell
npm run deploy:dev
```

or the following command to deploy to the production environment:

```shell
npm run deploy:prod
```
