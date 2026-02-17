# Deploy Sabeel to Free Hosting (Cloudflare Pages)

## Overview

Deploy Sabeel — a Vite + React 19 SPA/PWA — to **Cloudflare Pages** for free. Cloudflare Pages is the best fit because:

- **Unlimited bandwidth** (competitors cap at 100GB/month)
- **Native SPA catch-all routing** (no config files needed)
- **500 builds/month** on free tier
- **Custom domains + automatic HTTPS**
- **300+ edge locations** worldwide
- **No commercial-use restriction** (unlike Vercel's free tier)
- Already named as intended platform in project plan (`plans/sabeel-ramadan-companion.md`)

The app builds to a static `dist/` directory via `npm run build`. No server-side runtime needed.

## Acceptance Criteria

- [ ] Site is live at a `*.pages.dev` URL
- [ ] All SPA routes work (direct navigation to `/app/quran`, `/app/adhkar`, etc.)
- [ ] PWA is installable from the live site
- [ ] Service worker caches assets for offline use
- [ ] Builds trigger automatically on push to `main`
- [ ] Optional: Supabase env vars injected at build time

## Implementation Plan

### Phase 1: Cloudflare Pages Setup

#### 1.1 Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create a project
2. Connect GitHub repository (`sabeel`)
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** Set `NODE_VERSION` env var to `20` (or add `.node-version` file)

#### 1.2 Set Environment Variables (Optional)

If using Supabase cloud sync, add in Cloudflare Pages settings:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

These are baked into the JS bundle at build time by Vite. The app works fully offline without them (`src/lib/supabase/client.ts` handles null client gracefully).

#### 1.3 Deploy

Push to `main` → Cloudflare auto-builds and deploys → Live at `sabeel-xxx.pages.dev`.

### Phase 2: Project Config Files

#### 2.1 Add Node version pin

Create `.node-version` in repo root:

```
20
```

This ensures Cloudflare (and other platforms) use the correct Node.js version.

#### 2.2 Add `.env.example`

```env
# Optional: Supabase cloud sync (app works offline without these)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Phase 3: GitHub Actions CI (Optional but Recommended)

Add `.github/workflows/ci.yml` to run checks before Cloudflare deploys:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run test
```

This catches type errors and test failures before code reaches Cloudflare.

### Phase 4: Custom Domain (When Ready)

1. In Cloudflare Pages project → Custom domains → Add domain
2. If domain is already on Cloudflare DNS: automatic CNAME setup
3. If external DNS: add CNAME record pointing to `sabeel-xxx.pages.dev`
4. HTTPS auto-provisions via Cloudflare

## Alternatives Considered

| Platform | Bandwidth | SPA Routing | Commercial OK | Why Not Primary |
|----------|-----------|-------------|---------------|-----------------|
| **Cloudflare Pages** | Unlimited | Native | Yes | **Selected** |
| Vercel | 100GB/mo | Native | No (Hobby) | Commercial restriction |
| Netlify | 100GB/mo | Via `_redirects` | Yes | Lower bandwidth, needs config file |
| GitHub Pages | 100GB/mo | Via `404.html` hack | Yes | Hacky SPA routing, slower deploys |

## Key Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| SPA routes 404 on direct navigation | Cloudflare Pages handles this natively — no config needed |
| Missing env vars → silent Supabase failure | Supabase is optional; app works offline. Document in `.env.example` |
| Old service worker cache after deploy | `registerType: 'autoUpdate'` in vite.config.ts already handles this |
| Build failure not noticed | Add GitHub Actions CI to catch errors before deploy |

## Files Changed

- `.node-version` (new) — Pin Node.js version
- `.env.example` (new) — Document env vars
- `.github/workflows/ci.yml` (new, optional) — CI pipeline

## Quick Start (TL;DR)

```bash
# 1. Go to https://dash.cloudflare.com → Pages → Create project
# 2. Connect your GitHub repo
# 3. Set build command: npm run build
# 4. Set output directory: dist
# 5. Deploy — done!
```

No code changes required for basic deployment. The app builds to static files and Cloudflare Pages serves them with SPA routing out of the box.
