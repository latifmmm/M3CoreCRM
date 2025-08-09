# M3CoreCRM — Runbooks (Deploy, Rollback, Incident/On‑call) v1

> These runbooks standardize operations across environments (Staging/Production).  
> Assumes: GitHub Actions CI/CD, DigitalOcean App Platform (API), Vercel (Web), DO Managed Postgres, Spaces, Sentry, Datadog.

---

## 0) Golden Signals (what we watch)
- **Availability**: API 99.9% monthly; Auth 99.95% (see NFRs).
- **Latency**: p95 API < 800ms; p95 Auth < 400ms.
- **Errors**: 5xx rate < 2% (5 min).
- **DB Health**: CPU < 80%, connections < 80% pool, replication healthy.
- **Queues**: Outbox queue depth within 15‑min drain window.

Dashboards: Datadog (API/DB), Sentry alerts, CI/CD deployment history.

---

## 1) Standard Deploy (Staging → Prod)

### 1.1 Staging (auto on merge to `develop`)
1. CI runs: lint, types, unit+integration, OpenAPI validation.
2. Build images/artifacts. Upload Storybook static (optional).
3. **DB migration plan** (non‑destructive check). Apply to *Staging* DB.
4. Deploy API to DO App Platform; deploy Web to Vercel.
5. Seed data (idempotent) if needed.
6. Run **E2E smoke** + quick perf (15 min soak).
7. If pass → tag `vX.Y.Z-rc` and create release notes.

### 1.2 Production (manual approval on `main`)
1. Confirm status page is green; error budget not exhausted.
2. Snapshot DB (PITR + manual snapshot).
3. **Feature flags**: ensure defaults are safe (Stripe/Infobip/VOIP off unless intended).
4. Deploy API (canary 10% → 50% → 100% if using DO’s incremental rollout) and Web.
5. Run **post‑deploy smoke** (login + one CRUD + health + outbox).
6. Announce release in #eng with changelog and rollback plan.

**Smoke script (pseudo):**
```bash
curl -fsS https://api.m3corecrm.com/v1/health
http  POST :/auth/login email:=owner@acme.tld password:=S3cret!
http  GET  :/users "Authorization:Bearer $TOKEN"
```

---

## 2) Rollback Procedure

### 2.1 When to rollback
- p95 latency or 5xx breach > 10 min and user impact confirmed.
- Security/high‑risk bug discovered post‑deploy.
- Failed DB migration (partial apply) or data corruption detected.

### 2.2 How to rollback
1. **Freeze traffic** (if severe): scale down new revision or route to previous stable deploy.
2. **Revert app**: redeploy previous artifact from CI (`vX.Y.Z-prev`). DO App keeps last N images.
3. **Database**:
   - If migration is **backward compatible**: no DB change required.
   - If **destructive change** applied: execute rollback script or restore from snapshot (coordinate RTO/RPO).
4. **Invalidate cache/CDN** if relevant.
5. **Verify**: run smoke tests on rolled‑back version.
6. **Post mortem**: open incident ticket; attach logs, dashboards, timings.

**Notes**
- Prefer **expand/contract** migrations to avoid DB rollbacks.
- Keep feature flags OFF for new code paths until confidence is built.

---

## 3) Incident Response (On‑call)

### 3.1 Severity Levels
- **SEV‑0 (Outage/Security)**: Full outage, data breach, or P0 vulnerability exploited.
- **SEV‑1 (Critical Degradation)**: Core flows failing (login, CRUD), error rate > 10%.
- **SEV‑2 (Major)**: A module down or severe perf regression; workaround exists.
- **SEV‑3 (Minor)**: Non‑critical bug; no immediate customer impact.

### 3.2 Roles
- **Incident Commander (IC)**: owns timeline/comms/decisions.
- **Ops Lead**: toggles infra, rollbacks, DB actions.
- **App Lead**: digs into service/app logs and hotfix scope.
- **Comms**: updates status page and stakeholders.

### 3.3 First 15 minutes (SEV‑0/1)
1. Page on‑call; spin an incident channel `#inc-YYYYMMDD-hhmm`.
2. Assign IC/Ops/App/Comms.
3. Triage via dashboards: identify scope (API, DB, provider, region).
4. Decide: **rollback vs. mitigate** (rate‑limit, feature‑flag off, circuit‑break provider).

### 3.4 Diagnostics checklist
- **API**: 5xx surge? Recent deploy? Error signatures in Sentry?
- **DB**: connection saturation? long‑running queries? locks? storage?
- **Providers**: Brevo/Infobip/Stripe status? webhook backlog?
- **Queues**: outbox depth; consumer lag.
- **Infra**: node restarts, autoscale events, throttling.

### 3.5 Communications
- Update **status page** within 15 minutes for SEV‑0/1.
- Customer‑facing summary every 30–60 minutes until resolution.
- Internal updates in incident channel with timestamps.

### 3.6 Resolution & Aftercare
- Confirm recovery with metrics + smoke tests.
- RCA within **72 hours** for SEV‑0/1: timeline, root cause, contributing factors, action items.
- Add tests/alerts to prevent recurrence; link to Jira ticket(s).

---

## 4) Provider Outage Playbooks (brief)

### 4.1 Email (Brevo)
- Symptoms: increased bounce/timeout; 5xx from API.
- Actions: **switch to in‑app inbox only**; queue emails; reduce send rate; show banner in UI for campaign delays.

### 4.2 SMS/WhatsApp (Infobip) — optional
- Symptoms: OTP failures; send errors.
- Actions: prefer **TOTP**; degrade to email + in‑app notice; enforce longer OTP TTL; set cost guardrails to zero to prevent spend.

### 4.3 Billing (Stripe) — optional
- Symptoms: checkout/portal failure.
- Actions: **grace period** on seat checks; queue billing events; disable plan change UI temporarily.

---

## 5) Routine Maintenance Windows
- Schedule low‑risk updates Tue–Thu 10:00–16:00 Africa/Cairo.
- Major schema changes: maintenance window with customer notice (≥72h).

---

## 6) On‑call Run Sheet (quick ref)
- Pager: alerts configured in Datadog + Sentry.
- Escalation path: On‑call → Ops Lead → CTO.
- Tooling links: dashboards, runbooks, recent deploys pinned in `#oncall`.

---

## 7) Checklists

### 7.1 Pre‑Deploy
- [ ] All checks green (CI) and coverage ≥ targets
- [ ] DB migration reviewed (expand/contract where possible)
- [ ] Secrets validated at boot (no missing keys)
- [ ] Feature flags set correctly
- [ ] Rollback artifact available

### 7.2 Post‑Deploy
- [ ] Smoke tests pass
- [ ] Error rate flat; latency within SLO
- [ ] Outbox consumers healthy
- [ ] Status page updated (if noteworthy)

### 7.3 Post‑Incident
- [ ] RCA drafted and approved
- [ ] Action items created and scheduled
- [ ] Tests/alerts updated
- [ ] Customer comms sent (if applicable)

---

**End of Runbooks v1**
