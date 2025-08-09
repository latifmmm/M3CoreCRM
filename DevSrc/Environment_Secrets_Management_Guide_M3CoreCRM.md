# M3CoreCRM — Environment & Secrets Management Guide (v1)

> Scope: Local Dev, Staging, Production. Covers environment topology, `.env` structure, secret naming, storage locations, rotation, auditing, and provider touchpoints (Brevo, Infobip, Stripe, DO Spaces).

---

## 1) Environment Topology

| Env | Branch | Host | Purpose |
| --- | --- | --- | --- |
| **Local** | feature/* | localhost | Developer workstation, mocked providers |
| **Staging** | develop | `staging.api.m3corecrm.com` | UAT, nightly seeds, full test matrix |
| **Production** | main | `api.m3corecrm.com` | Live tenants |

- Multi‑tenant routing: subdomain or `X‑Tenant‑Id` header.
- Feature flags default **ON** in Local, **ON (safe subset)** in Staging, **OFF (gradual rollout)** in Prod.

---

## 2) Secret Ownership & Vaults

| Type | Store | Scope |
| --- | --- | --- |
| Backend API secrets | **DigitalOcean App Platform** env vars | Staging/Prod runtime |
| Frontend public keys | **Vercel Project Env** (`NEXT_PUBLIC_*`) | Per project (CRM, Marketing) |
| CI/CD deploy tokens | **GitHub Actions → Secrets & Variables** | Build & deploy jobs |
| Local dev secrets | `.env.local` (uncommitted) | Individual devs |
| Object storage keys | DO Spaces (Access Keys) | Bucket‑scoped |
| Encryption/Webhook keys | GitHub Secrets + DO App Vars | Rotated by Ops |

> Never commit real secrets. Keep `.env.example` in each app/package.

---

## 3) Secret Naming Convention

- Upper snake case, provider prefix when applicable:  
  - `BREVO_API_KEY`, `INFOBIP_API_KEY`, `STRIPE_API_KEY`, `SPACES_KEY`, `SPACES_SECRET`, `SPACES_BUCKET`, `JWT_SECRET`, `DB_URL` or `DATABASE_URL`.
- Frontend public keys: `NEXT_PUBLIC_*` only (exposed to browser).

---

## 4) Local Development — `.env.local` Templates

Create files from these templates and **do not commit**.

### 4.1 Backend (`apps/backend/.env.local`)
```env
# Server
NODE_ENV=development
PORT=8080
API_BASE=http://localhost:8080
JWT_SECRET=dev_jwt_secret_change_me

# DB
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/m3corecrm?schema=public

# Email (Brevo)
BREVO_API_KEY=dev_brevo_key

# SMS/WhatsApp (Infobip - optional)
INFOBIP_API_KEY=dev_infobip_key
INFOBIP_BASE_URL=https://api.infobip.com

# Billing (Stripe - optional)
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Storage
SPACES_KEY=DEV_SPACES_KEY
SPACES_SECRET=DEV_SPACES_SECRET
SPACES_REGION=fra1
SPACES_BUCKET=m3corecrm-dev

# Observability
SENTRY_DSN=
DATADOG_API_KEY=

# Feature Flags
FEATURE_STRIPE=false
FEATURE_INFOBIP=false
FEATURE_VOIP=false
```

### 4.2 CRM Frontend (`apps/crm-dashboard/.env.local`)
```env
VITE_API_BASE=http://localhost:8080
VITE_SENTRY_DSN=
VITE_FEATURE_STRIPE=false
VITE_FEATURE_INFOBIP=false
```

### 4.3 Marketing Site (`apps/marketing-site/.env.local`)
```env
NEXT_PUBLIC_API_BASE=http://localhost:8080
SENTRY_DSN=
```

---

## 5) Staging & Production Variables

### 5.1 Backend (DO App Platform)
Required (non‑optional unless noted):
- `NODE_ENV=production`
- `PORT=8080`
- `DATABASE_URL`
- `JWT_SECRET` (rotate; use KID strategy if supporting multiple keys)
- `BREVO_API_KEY`
- `SPACES_KEY`, `SPACES_SECRET`, `SPACES_REGION`, `SPACES_BUCKET`
- `SENTRY_DSN` (optional but recommended), `DATADOG_API_KEY` (optional)

Optional (enable when integrations go live):
- `INFOBIP_API_KEY`, `INFOBIP_BASE_URL`
- `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`
- Feature flags: `FEATURE_STRIPE`, `FEATURE_INFOBIP`, `FEATURE_VOIP`

### 5.2 Frontend (Vercel)
- `NEXT_PUBLIC_API_BASE`
- `NEXT_PUBLIC_SENTRY_DSN` (optional)
- Optional flags: `NEXT_PUBLIC_FEATURE_STRIPE`, `NEXT_PUBLIC_FEATURE_INFOBIP`

### 5.3 GitHub Actions (CI/CD)
- `DO_API_TOKEN` — deploy to DigitalOcean
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — deploy Frontend
- Provider keys used for **tests only** (if needed): add to **Actions Variables**, never to repo.

---

## 6) Database & Migrations

- Migrations run via Prisma on deploy; staging first, then prod.
- Pre‑deploy: `prisma migrate diff` to review destructive changes.
- Backups: provider PITR enabled; snapshot before prod deploy.
- Secrets: only `DATABASE_URL` is required; do not expose other DB credentials.

---

## 7) Key Rotation Policy

- **JWT_SECRET**: rotate every 180 days or on incident. If multiple keys, sign with active KID, accept previous for 7–14 days.
- **Webhook secrets** (Stripe, Infobip, Brevo): rotate annually or on incident; version your endpoints.
- **DO Spaces keys**: rotate every 180 days; use per‑env IAM key pairs.
- **CI/CD tokens**: rotate every 90 days when possible.
- Maintain a rotation log (date, owner, scope, rollback notes).

---

## 8) Access Control & Auditing

- Principle of Least Privilege for DO/Vercel/GitHub teams.
- Restrict prod DB credentials; prefer read-only bastion or replica for ad‑hoc queries.
- Audit trails:
  - Secret changes (GitHub, DO, Vercel change logs)
  - App config changes (feature flags, notification templates)
- Alert on missing or invalid secrets at boot (fail fast).

---

## 9) Provider Touchpoints (Optional Integrations)

### 9.1 Brevo (Email)
- Secret: `BREVO_API_KEY`
- Webhooks: signed (if enabled) → set signature secret; handle bounce/unsubscribe.

### 9.2 Infobip (SMS/WhatsApp) — optional
- Secrets: `INFOBIP_API_KEY`, `INFOBIP_BASE_URL`
- Webhooks: verify signature; store minimal delivery metadata
- Mirror each SMS/WhatsApp to **In‑App Notification** and **Email** (as per spec).

### 9.3 Stripe — optional
- Secrets: `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`
- Map tenant ↔ Stripe customer/subscription IDs
- Idempotency keys on create/update requests

### 9.4 VOIP/PBX — optional
- Provide per‑provider API credentials via feature‑scoped envs (e.g., `VOIP_XXX_*`)
- If storing recordings: put in Spaces with expiring signed URLs

---

## 10) Secrets Validation at Boot

Implement a startup check that validates presence & format of required secrets per environment:
- Local: warn for missing optional keys.
- Staging/Prod: **fail** if required keys missing; emit structured error with which variables failed.

---

## 11) .env.example Files

Each app must include a curated `.env.example` that lists keys with safe defaults or blanks. CI gate checks that `.env.example` stays in sync with runtime reads (simple script parses `process.env.X`).

---

## 12) Incident Playbook (Secrets)

1. **Contain**: revoke compromised key/token immediately.  
2. **Rotate**: generate new secret; update vault(s); redeploy.  
3. **Invalidate**: for JWT, set active KID to new key; optionally expire tokens.  
4. **Audit**: search logs for usage; notify impacted tenants if applicable.  
5. **RCA**: document cause and prevention (automation, scope, alerts).

---

## 13) Quick Checklists

**New Developer**
- [ ] Copy `.env.example` → `.env.local` and fill values  
- [ ] Start local DB or Docker compose  
- [ ] `npm run dev` for backend & frontend

**New Provider Integration (optional)**
- [ ] Add `FEATURE_*` flag(s)  
- [ ] Add secrets to **GitHub**, **DO**, **Vercel**  
- [ ] Add webhook secret + handler + tests  
- [ ] Update `.env.example` & boot validator

---

**End — Environment & Secrets Management Guide**
