# CD Process — RecipeAI

## Overview

RecipeAI uses a **Blue-Green deployment strategy** on **Render.com** with two permanent environments: `staging` and `production`. Every code change is automatically deployed to staging first, smoke-tested, and only then promoted to production.

---

## Architecture

```
GitHub Repository
└── main branch  ──→  Staging  (every push)
                 ──→  Production  (every release tag from release-please)
```

### Full Pipeline Flow

```
Code push to main
  │
  ├─ CI (ci-tests.yml)
  │    Build & Lint → Unit Tests → Integration Tests → API Tests → Coverage
  │
  └─ CD (deploy.yml)
       │
       ├─ push → 🟦 Deploy Staging
       │            ├─ Trigger Render build (Docker image)
       │            ├─ Poll until status = "live" (max 10 min)
       │            ├─ Smoke tests: GET /health, GET /docs
       │            └─ On failure: automatic rollback to previous live deploy
       │
       └─ release published → 🟩 Deploy Production
                                 ├─ Trigger Render build (Docker image)
                                 ├─ Poll until status = "live" (max 10 min)
                                 ├─ Smoke tests: GET /health, GET /docs
                                 └─ On failure: automatic rollback to previous live deploy
```

---

## Environments

| | Staging | Production |
|---|---|---|
| **Branch** | `main` | `main` |
| **Render service** | `recipeai-staging` | `recipeai-production` |
| **Database** | `recipeai-staging-db` | `recipeai-production-db` |
| **DB_SYNCHRONIZE** | `true` (auto-migrate) | `false` (manual migrations) |
| **URL** | Assigned by Render | Assigned by Render |
| **Deploy trigger** | Every push to `main` | Every release tag (release-please) |

---

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** in the GitHub repository and add:

| Secret | How to get it |
|--------|--------------|
| `RENDER_API_KEY` | Render Dashboard → Account Settings → API Keys → Create API Key |
| `RENDER_STAGING_SERVICE_ID` | Render Dashboard → select `recipeai-staging` service → copy the `srv-...` ID from the URL |
| `RENDER_PRODUCTION_SERVICE_ID` | Render Dashboard → select `recipeai-production` service → copy the `srv-...` ID from the URL |

---

## First-Time Setup on Render.com

1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Click **New → Blueprint** and select the repository root — Render will detect `render.yaml` and create all services automatically
4. After services are created, copy the Service IDs and add them to GitHub Secrets (see above)
5. Generate an API Key in Render Account Settings and add it as `RENDER_API_KEY`

---

## How Deployments Work

### Automatic (normal flow)

| Push to | Result |
|---------|--------|
| `develop` | Staging deploys automatically, smoke tests run |
| `main` | Production deploys automatically, smoke tests run |

### Smoke Tests

After every deploy the pipeline runs:

```bash
GET /health   → must return HTTP 200
GET /docs     → must return HTTP 200/301/302
```

If either test fails, the rollback procedure starts automatically.

---

## Rollback Procedure

### Automatic Rollback (on smoke test failure)

When smoke tests fail after a deploy, the CD pipeline automatically:
1. Finds the last deploy with `status = "live"` via Render API
2. Calls `POST /v1/services/{id}/deploys/{deployId}/rollback`
3. Reports the rollback in the GitHub Actions summary

No manual intervention is needed.

### Manual Rollback (emergency)

To manually trigger a rollback at any time:

1. Go to **GitHub → Actions → RecipeAI — CD**
2. Click **Run workflow**
3. Select environment: `staging` or `production`
4. Click **Run workflow**

This triggers the `manual-rollback` job which rolls back to the previous live deploy.

### Rollback via Render Dashboard

As an alternative:
1. Go to Render Dashboard → select the service
2. Click **Deploys** tab
3. Find the last working deploy
4. Click **Rollback to this deploy**

---

## Adding New Environment Variables

### For staging only:
1. Render Dashboard → `recipeai-staging` service → **Environment** tab
2. Add the variable and click **Save Changes**
3. Service will redeploy automatically

### For both environments via `render.yaml`:
Add to the `envVars` section of the respective service in `render.yaml`, then push to trigger a deploy.

### As a GitHub Secret (for use in CI/CD only):
**Settings → Secrets and variables → Actions → New repository secret**

---

## Monitoring

### Render Built-in Metrics
Render Dashboard provides per-service:
- CPU usage
- Memory usage
- Response time
- Request volume
- Deploy history

### Health Endpoint
`GET /health` — available on both environments, checks database connectivity:

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" }
  }
}
```

Returns `503` if the database is unreachable.

### GitHub Actions Summary
After every deploy, the Actions summary shows:
- Deploy status (live / failed)
- Service URL
- Commit SHA
- Smoke test results
- Rollback info (if triggered)

---

## Docker Image

The application is packaged as a Docker image using a multi-stage build:

```
Stage 1 (builder):  node:20-alpine
  - npm ci
  - nest build → dist/

Stage 2 (runtime):  node:20-alpine
  - npm ci --omit=dev
  - COPY dist/
  - COPY UI_prototype/ → public/   ← static frontend served by NestJS
  - USER appuser (non-root)
  - HEALTHCHECK wget /health
  - CMD node dist/main
```

The frontend (`UI_prototype/`) is served as static files by `ServeStaticModule` at the root path `/`. API routes (`/api`, `/auth`, `/health`, `/docs`) take priority.

---

## Conventional Commits → Releases

Semantic versioning is handled automatically by `release-please` (see `release.yml`):

| Commit prefix | Version bump |
|---|---|
| `feat:` | minor (1.x.0) |
| `fix:` | patch (1.0.x) |
| `feat!:` or `BREAKING CHANGE:` | major (x.0.0) |

When commits are merged to `main`, `release-please` opens a Release PR. Merging that PR creates a GitHub Release and tag, which triggers `release.yml`.
