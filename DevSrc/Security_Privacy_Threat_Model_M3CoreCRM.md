# M3CoreCRM — Security & Privacy Threat Model (v1)

> Scope: Backend (Express/Node), Frontend (React/Next), DB (PostgreSQL), Notifications (Brevo, Infobip optional), Billing (Stripe optional), Telemarketing (VOIP optional).  
> Method: STRIDE + Abuse-case driven. Covers tenant isolation, RBAC + approvals, OTP/2FA, webhooks, data protection, and operational security.

---

## 1) System Overview & Trust Boundaries
- **Clients**: Browsers (CRM dashboard, marketing site), mobile browsers.
- **API**: HTTPS REST, JWT bearer; multi-tenant via `X-Tenant-Id` or subdomain.
- **Auth**: In-house JWT, refresh rotation, optional TOTP + SMS/WhatsApp 2FA.
- **Providers**: Brevo (email), Infobip (SMS/WhatsApp, optional), Stripe (billing, optional), VOIP/PBX (optional).
- **Storage**: PostgreSQL (Managed), Spaces (object storage).
- **Observability**: Sentry (errors), Datadog (APM).

**Trust Boundaries**: Browser ↔ API, API ↔ Providers, API ↔ DB, API ↔ Storage, Webhooks inbound.

---

## 2) Assets & Data Classification
- **Critical**: JWT tokens, refresh tokens, password hashes, 2FA secrets/backup codes, phone numbers (E.164), email addresses, approval decisions, invoice data.
- **Sensitive**: Contact/lead PII, unit pricing history, campaign content.
- **Public**: Marketing content, anonymized analytics.
- **Secrets**: API keys (Brevo, Infobip, Stripe), DB creds, signing secrets.

Retention rules defined in Data Lifecycle (§8).

---

## 3) Threats & Mitigations (STRIDE)

### 3.1 Spoofing
- **Stolen JWT / session fixation** → Short access token TTL, refresh rotation & revocation list; IP/user-agent binding on refresh; `SameSite` if cookies used.
- **SIM swap on SMS OTP** → Prefer TOTP; allow SMS as fallback; risk banner; enforce device-bound WebAuthn (phase 2).
- **Webhook sender spoofing** → HMAC signature verification with timestamp tolerance; rotate secrets; require provider IP allowlist where possible.

### 3.2 Tampering
- **Approval bypass (deal stage move)** → Server-side RBAC + approval policy check; immutable approval history; idempotency keys for state transitions.
- **Outbox manipulation** → Write-once append-only outbox with status transitions; audit logs for template & config changes.
- **Map overlay/shape edits** → Versioned shapes; signed URLs; editor role only; store deltas.

### 3.3 Repudiation
- **Dispute on actions** → Audit logs capturing actor, tenant, IP, UA, before/after JSON; clock sync; retention policy; tamper-evident hashing (optional).

### 3.4 Information Disclosure
- **PII leaks in logs** → Structured logging; scrub email/phone; secrets redaction; Sentry PII-scrubber.
- **Cross-tenant data exposure** → Mandatory `tenant_id` in all queries; service-layer guard; optional Postgres RLS; multi-tenant integration keys.
- **Presigned asset URLs** → Short-lived signed URLs; least privilege IAM; Content-Disposition controls.

### 3.5 Denial of Service
- **Credential stuffing / OTP brute force** → IP/device rate limits; user-based lockouts with cooldown; exponential backoff; CAPTCHA after N failures.
- **Bulk send abuse (SMS/Email)** → Per-tenant quota, per-user rate limits; cost guardrails; approval for large campaigns; suppression list.
- **N+1 queries / heavy reports** → Read replicas, timeouts, pagination limits; background jobs for exports.

### 3.6 Elevation of Privilege
- **RBAC gaps** → Central permission registry; `RoleGuard` in UI + server enforcement; periodic permission diff tests.
- **Group to global escalation** → Scope checks on tenant, group, region; deny by default.
- **CI/CD secret sprawl** → Least privilege secrets; environment scoping; secret scanning & rotation.

---

## 4) Authentication & 2FA Controls
- **Passwords**: Argon2id (or bcrypt with cost), global breach password check (optional).
- **JWT**: Access ~15m, Refresh ~30d; rotation with reuse detection → revoke on replay.
- **2FA**: TOTP primary; SMS/WhatsApp optional fallback via Infobip; backup codes (one-time); enforce 2FA on privileged roles.
- **Mobile Verification**: OTP rate limits; verify-on-change; mirror OTP to in-app notice + email (for traceability).

---

## 5) Authorization, Approvals, and Tenancy
- **RBAC**: Role trees + group entitlements; permissions like `module.action`.
- **Approvals**: Multi-level by function/amount; immutable history; SLA timers and escalation.
- **Tenant Isolation**: `tenant_id` on every row & FK; service-level guard; optional RLS policies; integration keys bound to tenant.

---

## 6) Input Validation & Output Encoding
- **Validation**: Zod/Joi schemas aligned with OpenAPI; strict types; phone E.164; email RFC 5322.
- **Outbox templating**: Escape user input; forbid raw HTML injection; allow approved template vars only.
- **XSS/CSRF**: React escapes by default; sanitize rich text; CSRF not required for pure Bearer tokens (if cookies used → CSRF token header).

---

## 7) Secrets, Keys & Config
- Store in **GitHub Actions secrets**, DO App env, Vercel env (no code check-in).
- Rotate semiannually; enforce principle of least privilege.
- **Key material**: webhook HMAC secrets, JWT signing keys (rotate via KID header), Stripe/Infobip/Brevo keys.

---

## 8) Data Lifecycle & Privacy
- **Collection**: Minimize; explicit consent for marketing channels; track consent scope (email/SMS/WhatsApp).
- **Use**: Purpose limitation; suppression lists for opt-out.
- **Retention**: 
  - Audit logs: 1–3 years (configurable)
  - OTP/backup codes: shortest practical (minutes/days)
  - Inactive accounts: review & purge policy
- **Deletion**: Right-to-erasure workflow; soft-delete isn’t enough for PII — perform purge tasks.
- **Encryption**: TLS 1.2+ in transit; at-rest via DO Managed PG & Spaces. Consider app-layer encryption for select fields (e.g., backup codes).

---

## 9) Provider Integrations
- **Email (Brevo)**: Use transactional keys; handle webhooks with HMAC where available; suppress hard-bounces.
- **SMS/WhatsApp (Infobip optional)**: Sign outbound requests; verify inbound callbacks; store minimal metadata; mirror to inbox/email; cost limits.
- **Stripe (optional)**: Verify webhook signatures; idempotency keys for create/update; never store PAN; map customer/sub IDs per tenant.
- **VOIP/PBX (optional)**: If call recordings are stored, handle consent flags; access controls on recordings; pre-signed expiring URLs.

---

## 10) Logging, Monitoring & Incident Response
- **Application logs**: JSON, request IDs, scrub PII.
- **Security events**: auth failures, OTP attempts, permission denials, admin changes.
- **Metrics**: p95 latency, error rate, OTP success rate, outbox queue depth.
- **Alerts**: thresholds defined in CI/CD Guide.
- **IR Playbook**: severity matrix, comms template, rollback steps, evidence preservation.

---

## 11) Testing Security
- **Static**: ESLint security, `npm audit`, Snyk/Dependabot.
- **Dynamic**: Authz tests for each endpoint; approval workflow tests; rate-limit tests; SQLi/XSS injection tests.
- **Pentest**: External audit before production; scope includes RBAC, approvals, webhooks, OTP.
- **Chaos/DR**: Backup restore drills; simulate provider outage and failover.

---

## 12) Open Items (v2)
1. WebAuthn MFA for admins and finance roles.
2. Field-level encryption for backup codes and highly sensitive PII.
3. Token binding or DPoP on mobile clients (if applicable).
4. Fine-grained data residency controls (per-tenant region).

---

## 13) Acceptance Checklist
- [ ] Tenant isolation verified by automated tests.
- [ ] RBAC + approval workflow enforced on server.
- [ ] OTP/2FA rates & lockouts implemented.
- [ ] Webhooks signed & verified.
- [ ] Logs scrub PII; secrets never logged.
- [ ] Data retention & erasure workflows implemented.
- [ ] Backups taken & restore tested.
- [ ] Vulnerability scans clean; dependencies patched.
