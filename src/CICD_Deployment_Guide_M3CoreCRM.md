# CI/CD & Deployment Guide — M3CoreCRM

> Target: GitHub Actions → DigitalOcean App Platform (backend) + Vercel (marketing site) + DO Managed PostgreSQL + DO Spaces.  
> Observability: Sentry (errors) + Datadog (APM/metrics).  
> Release flow aligns with **Section 21 — Release Management & Versioning**.

---

## 1) Branching & Environments
- **Branches**
  - `main` → Production
  - `develop` → Staging
  - `feature/*` → Preview builds
- **Environments**
  - Local dev → Staging → Production
- **Feature flags** via `FEATURE_` envs + DB entitlements.

---

## 2) Secrets & Config
- **GitHub → Settings → Secrets and variables → Actions**
  - Shared: `SENTRY_DSN`, `DATADOG_API_KEY`, `DO_API_TOKEN`, `OPENSSL_KEY`, `JWT_SECRET`
  - Backend: `DATABASE_URL`, `BREVO_API_KEY`, `INFOBIP_API_KEY`, `STRIPE_API_KEY`, `SPACES_KEY`, `SPACES_SECRET`, `SPACES_REGION`, `SPACES_BUCKET`
  - Frontend: `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_SENTRY_DSN`
- **DigitalOcean App Platform**
  - App-level envs mirror GitHub secrets; bind DB/Spaces.
- **Vercel**
  - Project envs for `NEXT_PUBLIC_API_BASE`, `SENTRY_DSN`, etc.

> Keep `.env.example` updated; never commit real secrets.

---

## 3) GitHub Actions — Workflows

### 3.1 Backend — Build, Test, Deploy (DO)
`.github/workflows/backend.yml`
```yaml
name: Backend CI/CD
on:
  push:
    branches: [ develop, main ]
    paths: [ "apps/backend/**", "packages/**" ]
  workflow_dispatch:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run -w apps/backend lint
      - name: Test
        run: npm run -w apps/backend test -- --ci
      - name: Build
        run: npm run -w apps/backend build
      - name: Prisma Migrate (Plan)
        run: npm run -w apps/backend prisma:migrate:diff
  deploy:
    needs: ci
    if: github.ref == 'refs/heads/develop' || github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to DigitalOcean
        uses: digitalocean/app_action@v2
        with:
          token: ${{ secrets.DO_API_TOKEN }}
          app_name: m3corecrm-backend
          envs: |
            DATABASE_URL=${{ secrets.DATABASE_URL }}
            JWT_SECRET=${{ secrets.JWT_SECRET }}
            BREVO_API_KEY=${{ secrets.BREVO_API_KEY }}
            INFOBIP_API_KEY=${{ secrets.INFOBIP_API_KEY }}
            STRIPE_API_KEY=${{ secrets.STRIPE_API_KEY }}
            SENTRY_DSN=${{ secrets.SENTRY_DSN }}
            DATADOG_API_KEY=${{ secrets.DATADOG_API_KEY }}
```
> Alternative: build Docker image and push to DO Registry, then deploy.

### 3.2 Frontend CRM — Build & Deploy (DO App or Vercel)
`.github/workflows/frontend.yml`
```yaml
name: Frontend CI/CD
on:
  push:
    branches: [ develop, main ]
    paths: [ "apps/crm-dashboard/**", "packages/**" ]
  workflow_dispatch:

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install
        run: npm ci
      - name: Lint
        run: npm run -w apps/crm-dashboard lint
      - name: Test
        run: npm run -w apps/crm-dashboard test -- --ci
      - name: Build
        run: npm run -w apps/crm-dashboard build
  deploy:
    needs: ci
    runs-on: ubuntu-latest
    steps:
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/crm-dashboard
          github-comment: false
          prod: ${{ github.ref == 'refs/heads/main' }}
```

### 3.3 Marketing Site (Next.js) — Vercel
`.github/workflows/marketing.yml` similar to Frontend CI/CD with `apps/marketing-site`.

### 3.4 Database Migrations — Controlled
`.github/workflows/migrations.yml`
```yaml
name: DB Migrations
on:
  workflow_dispatch:
    inputs:
      env:
        description: "staging|production"
        required: true
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install
        run: npm ci
      - name: Run Migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: npm run -w apps/backend prisma:migrate:deploy
```

### 3.5 Security & SCA
- Add CodeQL or Snyk workflow.
- Secret scanning enabled in repo settings.

### 3.6 Sandbox Health (Appendix B)
`.github/workflows/sandbox.yml` triggers nightly hooks for Brevo/Infobip/Stripe.

---

## 4) DigitalOcean App Platform — App Spec (Backend)
`infra/do/app.yaml` (excerpt):
```yaml
name: m3corecrm-backend
services:
  - name: api
    git:
      repo_clone_url: https://github.com/yourorg/m3corecrm.git
      branch: main
      deploy_on_push: true
    envs:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        scope: RUN_TIME
        value: ${DATABASE_URL}
    build_command: "npm ci && npm run -w apps/backend build"
    run_command: "node apps/backend/dist/server.js"
    http_port: 8080
    instance_size_slug: basic-xxs
    routes:
      - path: /
```

---

## 5) Vercel — Project Settings
- Link `apps/crm-dashboard` and `apps/marketing-site` as separate projects.  
- Env vars:
  - `NEXT_PUBLIC_API_BASE`
  - `NEXT_PUBLIC_SENTRY_DSN`

---

## 6) Database — DO Managed PostgreSQL
- Provision Primary + optional Read Replica.
- Set connection string as `DATABASE_URL` secret.
- Enable **pgBouncer** for connection pooling if needed.
- Backup policy: daily, retain 7–14 days.

---

## 7) Object Storage — DO Spaces
- Bucket for media (unit images, recordings).
- IAM key/secret stored in secrets.
- Public CDN URL for read-only assets; signed URLs for protected.

---

## 8) Release Flow (Summary)
1. Feature branches → PR to `develop` (auto‑deploy to staging).
2. Release branch → code freeze → UAT on staging.
3. Merge to `main` → tag `vx.y.z` → production deploy.
4. Post‑deploy smoke tests + Sentry/Datadog watch (24h).
5. Rollback (redeploy previous artifact) if SLOs breached.

---

## 9) Rollback & DB Strategy
- Keep last **2 artifacts** ready for rollback.
- DB:
  - Use **transactional migrations**.
  - Take snapshot before release.
  - Maintain `rollback.sql` where feasible (for destructive changes).
- Feature flags: disable new features quickly if needed.

---

## 10) Monitoring & Alerts
- **Sentry**: DSN plugged into backend & frontend; source maps uploaded.
- **Datadog**: APM tracing middleware; dashboards:
  - p95 latency, error rate, throughput (RPS)
  - DB connections & slow queries
  - Queue depth (outbox)
- Alerts:
  - Error rate > 2% (5m) → page
  - p95 > 800ms (10m) → warn
  - DB CPU > 80% (15m) → warn

---

## 11) Access Controls
- GitHub: branch protection, code owners, required reviews.
- DO/Vercel: least-privilege teams; audit deploy logs.
- Production DB access restricted; read‑only queries via bastion or read replica.

---

## 12) Makefile Targets (DX)
```
make setup          # install, bootstrap
make dev            # run all apps locally
make db.migrate     # apply migrations
make db.reset       # drop, migrate, seed
make test           # run unit tests
make e2e            # run e2e tests
make release.new    # tag + changelog draft
```

---

## 13) Runbooks (Essentials)
- **Degraded email/SMS**: switch to fallback provider; check outbox DLQ.
- **OTP surge**: enable rate-limit bump via feature flag; monitor `sms.sent` usage counters.
- **Stripe webhook failures**: replay last 24h events; check idempotency keys.
- **High DB load**: enable read replica routing for analytics; review slow query log.

---

## 14) Go-Live Checklist
- [ ] Secrets populated in GitHub, DO, Vercel
- [ ] Staging green (UAT cases passed)
- [ ] DB snapshot taken
- [ ] Feature flags defaulted correctly
- [ ] Sentry & Datadog dashboards show traffic
- [ ] Run rollback drill (non-destructive)
- [ ] Tag & release notes published

---

**End — CI/CD & Deployment Guide**
