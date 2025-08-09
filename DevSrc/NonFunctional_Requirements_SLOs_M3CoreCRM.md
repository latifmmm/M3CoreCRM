# M3CoreCRM — Non‑Functional Requirements (NFRs) & SLOs (v1)

> Scope: Backend API (Express/Node), Frontend (React/Next), DB (PostgreSQL), Notifications, Inventory/Maps, Optional Integrations (Stripe, Infobip, VOIP/PBX).  
> Goal: Quantitative targets that gate releases and guide capacity planning.

---

## 1) Availability & Reliability

### 1.1 Service Level Objectives (SLOs)
- **API availability**: **99.9% monthly** (≤ 43m downtime/month).  
- **Login & token endpoints**: **99.95%** (≤ 22m/month).  
- **Notification enqueue (outbox)**: **99.9%**.  
- **PostgreSQL primary**: provider-managed HA.

### 1.2 Error Budget
- Monthly error budget aligned to SLOs; deployments halted if consumed > 50% before month end.

### 1.3 Recovery Targets
- **RTO** (restore from backup): ≤ **30 min**.  
- **RPO** (data loss window): ≤ **5 min** (point-in-time restore enabled).

---

## 2) Performance Targets

### 2.1 Latency (p50 / p95)
- **Auth** `/auth/login`: **150ms / 400ms** (EU/ME region).  
- **Standard CRUD GET** (list 50): **120ms / 350ms**.  
- **Standard POST/PATCH**: **150ms / 450ms**.  
- **Heavy endpoints** (reports/export): **queued job**; API responds ≤ **500ms** with job id.

### 2.2 Throughput & Concurrency
- Baseline: **300 RPS** sustained, **800 RPS** burst for 5 minutes.  
- Concurrency: **1,500** active connections via pgbouncer + Node cluster.

### 2.3 Frontend Performance
- First contentful paint (FCP): **≤ 1.5s** on mid‑tier laptop 4G.  
- Interactive dashboard load: **≤ 2.5s** with cached API.  
- Lighthouse perf score (dashboard): **≥ 85**.

---

## 3) Scalability

- **Horizontal scale**: stateless API; autoscale 1→8 instances based on CPU p95 > 70% for 10 min.  
- **Database**: read replica for analytics; queue heavy reports.  
- **Storage**: DO Spaces with CDN; signed URLs for private assets.  
- **Partitions** (optional): monthly for `audit_logs`, `messages_outbox`, `integration_webhook_logs` when rows > 50M/year.

---

## 4) Capacity Planning (Initial)

- Tenants: **100** (pilot), scaling to **1,000**.  
- Users: **10,000** total; peak concurrent **2,000**.  
- Leads/deals: **50M** rows combined over 3 years.  
- Notifications: **2M/month** (email+sms+whatsapp+inbox).  
- Map overlays: images up to **20MB** each; shapes per project ≤ **5,000**.

---

## 5) Rate Limits & Quotas

- **Per IP**: 100 req/min (burst 200).  
- **Per user**: 600 req/5 min.  
- **Auth/OTP**: 5 attempts per 10 min; temporary lockout on abuse.  
- **Campaign send**: per‑tenant guardrails (configurable) default **50k/day**; SMS/WhatsApp **cost budget** thresholds with hard stops.

---

## 6) Security NFRs (summary)

- JWT rotation & reuse detection; 2FA optional per tenant (TOTP primary, SMS/WhatsApp fallback).  
- HMAC‑signed webhooks (Stripe, Brevo, Infobip) with timestamp tolerance.  
- Secrets in platform key vaults (GitHub/DO/Vercel); semiannual rotation.  
- Encryption in transit (TLS 1.2+), at rest (managed).  
- PII minimization + redaction in logs.  
- See **Security & Privacy Threat Model** for details.

---

## 7) Data Quality & Integrity

- Strong referential integrity; all tenant‑scoped FKs include `tenant_id`.  
- Idempotency keys for create/update on external integrations.  
- Approval workflows produce immutable history; audit logs append‑only.

---

## 8) Observability & Alerts

- **Metrics**: RPS, p95 latency, error rate, DB CPU, queue depth, OTP success rate.  
- **Logs**: structured JSON, request correlation id; PII scrubber.  
- **Tracing**: APM spans for API→DB and API→provider calls.  
- **Alert thresholds**:
  - Error rate > **2%** for 5 min → **page**  
  - p95 latency > **800ms** for 10 min → **warn**  
  - DB CPU > **80%** for 15 min → **warn**

---

## 9) Accessibility, i18n, Browser Support

- **WCAG 2.1 AA** for the dashboard (forms, dialogs, focus management).  
- **RTL** fully supported (Arabic).  
- **Browsers**: last 2 versions of Chrome/Edge/Firefox/Safari; evergreen only.  
- **Localization**: dates/numbers via `Intl`, user/tenant locale persisted.

---

## 10) Compliance & Privacy

- Consent tracking for email/SMS/WhatsApp; suppression list enforced.  
- Right‑to‑erasure workflows with verified requester.  
- Region: data hosted in DO EU/ME; document residency constraints if needed.

---

## 11) Build & Release Quality Gates

- **Pre‑merge CI**: lint, unit tests, type check, API contract validation.  
- **Pre‑deploy** (staging/prod): integration + E2E smoke tests; DB migration dry‑run.  
- **Performance gate**: p95 latency and error rate must meet targets on staging with seeded data.  
- **Rollback**: previous artifact kept; DB snapshot pre‑deploy.

---

## 12) Testing Levels

- **Unit**: ≥ **80%** coverage on services & utils.  
- **Integration**: critical endpoints (auth, CRUD, approvals, outbox).  
- **E2E**: login, leads CRUD, deals Kanban move with approval, send notification.  
- **Load**: 15‑min soak at 300 RPS; spike to 800 RPS for 2 min.  
- **Security**: authz matrix tests per permission; rate‑limit & OTP abuse tests.

---

## 13) Acceptance Checklist

- [ ] Staging meets latency/availability targets in load tests.  
- [ ] Alerts configured and tested (Sentry/Datadog).  
- [ ] Rate limits, quotas, and cost guardrails enforced.  
- [ ] Backups + restore drill completed.  
- [ ] Accessibility checks passed (axe/Storybook a11y).  
- [ ] Documentation updated (OpenAPI, runbooks).

---

## 14) Open Items (v2)

- Multi‑region active/active for API.  
- WebAuthn MFA for admins & finance.  
- Field‑level encryption for selective PII.
