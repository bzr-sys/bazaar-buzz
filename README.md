# Bazaar Buzz

A small microblogging app (think a minimal Twitter), built as a [Bazaar](https://bzr.dev) example app. There is no app backend: each user's posts live in their own Bazaar database and are made publicly readable through Bazaar permissions.

**Live app: https://bzr-sys.github.io/bazaar-buzz/**

## Features

- Sign up or log in with a Bazaar account
- Post short updates from your **Profile** ("What's buzzing?")
- Follow other Bazaar users, from the **Following** page or from their profile at `#/u/<handle>`
- Read posts from everyone you follow in your **Feed**, updated live

## How it uses Bazaar

| Bazaar feature                | Used for                                                                                       |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| Collections (`default_blog`)  | Your posts, stored in your own database                                                        |
| Permissions                   | When `default_blog` is first created, the app grants read access to anyone (`GranteeType.ANY`) |
| Collections (`subscriptions`) | The user IDs you follow, private to you                                                        |
| Contexts                      | Reads another user's `default_blog` from their database                                        |
| Subscriptions                 | Live updates for your feed and your own posts                                                  |
| Social API                    | Look up users by handle and pick people to follow with the user search popup                   |

The Bazaar setup is in `src/bazaar.ts`, and the data logic is in `src/stores/defaultBlog.ts` and `src/stores/subscriptions.ts`.

## Tech stack

Vue 3, Vite, Pinia, Vue Router (hash history), Tailwind CSS, and the [`@bzr/bazaar`](https://www.npmjs.com/package/@bzr/bazaar) SDK.

## Run locally

You need Node.js 24 or newer (required by the mock server) and pnpm 9 (`npm install -g pnpm@9`, or `corepack enable`).

In development the app talks to a local Bazaar mock server on `http://localhost:3377` instead of the real service (see `src/bazaar.ts`). The mock is installed as a dev dependency ([`@bzr/bazaar-mock`](https://www.npmjs.com/package/@bzr/bazaar-mock)).

```sh
pnpm install

# Terminal 1: start the mock server and register the app's dev URL
pnpm exec bzr -u http://localhost:5173/bazaar-buzz/

# Terminal 2: start the app against the mock app ID "test"
VITE_APP_ID=test pnpm dev
```

Open http://localhost:5173/bazaar-buzz/ and click **Log in**. In the popup:

1. Enter any email address and click **Log In or Sign Up**. There is no password or code.
2. First time only: pick a handle (at least 4 letters or digits) and a name, then click **Complete Setup**.
3. Click **Authorize**.

To try following, open a second browser profile or a private window, sign up with a different email, and post something. Both users use the same mock server.

Notes:

- The mock keeps its data in memory, so restarting it wipes all users and posts.
- The redirect URL has to match exactly. If Vite starts on a port other than 5173, restart the mock with that URL (`pnpm exec bzr -u http://localhost:<port>/bazaar-buzz/`).
- `pnpm exec bzr -h` lists the other mock options (app ID, port, extra redirect URIs).

### Scripts

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `pnpm dev`        | Start the Vite dev server with hot reload        |
| `pnpm build`      | Type-check and build for production into `dist/` |
| `pnpm preview`    | Serve the production build locally               |
| `pnpm type-check` | Run `vue-tsc`                                    |
| `pnpm lint`       | Run ESLint (with `--fix`)                        |
| `pnpm format`     | Format `src/` with Prettier                      |

## Deployment

Every push to `main` runs `.github/workflows/build_buzz.yml`. It builds the app with the production Bazaar app ID (`VITE_APP_ID`) and publishes `dist/` to GitHub Pages at https://bzr-sys.github.io/bazaar-buzz/.

The Pages path is set by `base` in `vite.config.ts`. If you deploy somewhere else, change `base`, and register the new URL as a redirect URI for the app in the [Bazaar dashboard](https://cloud.bzr.dev).
