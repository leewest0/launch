# LaunchPad Dashboard

One place for the church's team to find, favourite, and launch every app it
uses — instant search, category browsing, and favourites/recents that sync
across every device, backed by Upstash Redis.

## Features

- **Instant search** — filters by name, category, description, and URL as you type. Press `/` anywhere to jump into the search box.
- **Category browsing** — apps are grouped and filterable by category pills.
- **Favourites & recents** — synced per person through Redis, so they follow you from your laptop to your phone.
- **Shared catalog** — anyone on the team who's logged in can add an app; everyone sees the same growing list.
- **Dark / light mode** — follows system preference by default, toggle in the top bar.
- **One shared team PIN** — no per-person accounts to manage; enter the PIN once per device, then your name identifies your favourites/recents.

## Getting started

### 1. Create an Upstash Redis database

1. Go to [console.upstash.com](https://console.upstash.com) and create a free Redis database.
2. Open the database's **REST API** tab and copy the **UPSTASH_REDIS_REST_URL** and **UPSTASH_REDIS_REST_TOKEN**.

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

- `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — from step 1.
- `TEAM_PIN` — whatever PIN you want your team to use to get in.
- `SESSION_SECRET` — a long random string, e.g. `openssl rand -base64 32`.

### 3. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), enter the team PIN and your name, and start adding apps.

## Deploying to Vercel

1. Push this repository to GitHub (already done if you're reading this from the repo).
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. In the project's **Environment Variables** settings, add the same four variables from `.env.local`:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `TEAM_PIN`
   - `SESSION_SECRET`
4. Deploy. Vercel will build and host the app; every team member visits the same URL and signs in with the shared PIN.

Upstash Redis is already an HTTP-based, serverless-friendly database, so no extra networking configuration is needed for Vercel to reach it.

## Notes for the apps manager

- Anyone signed in can add an app or remove one from the shared catalog — that's intentional, so the whole team can keep it current.
- Favourites and recents are personal: they're stored per name, so make sure everyone enters their own name consistently when they sign in (case differences count as different people).
- To rotate the team PIN, just change `TEAM_PIN` in your environment variables and redeploy — everyone will need to sign in again with the new PIN, but existing apps, favourites, and recents are untouched (they're keyed by name, not PIN).
