# M3CoreCRM — Final Table of Contents

---

## Executive Summary
- Scope, Vision & Design Principles
- Key Modules & Technology Stack
- Integration Touchpoints & Development Approach

---

## 1. Introduction & Scope
## 2. Architecture Overview
## 3. Technology Stack
## 4. Multi-Tenancy & Tenant Isolation
## 5. Authentication & Security
## 6. Role-Based Access Control (RBAC) & Approvals
## 7. Leads Management
## 8. Contacts & Companies
## 9. Deals & Pipelines
## 10. Activities & Tasks
## 11. Marketing Campaigns
## 12. Property Inventory Management
## 13. Map Overlay & Unit Mapping
## 14. Reports & Analytics
## 15. Notifications & Communications
## 16. Telemarketing & VoIP Integration (Optional)
## 17. User & Role Management
## 18. Billing & Subscription Management
## 19. Performance, Scalability & Compliance
## 20. QA Strategy & Test Plans
## 21. Release Management & Versioning
## 22. Glossary & Coded Dictionaries
## 23. Appendices
- Integration API Contracts (Brevo, Infobip, Stripe)
- Sandbox Test Hooks
- Data Models & ERDs
- Example Dashboards

---

**Note:**  
- Infobip, Stripe, and other deferred integrations have **touchpoints defined** from the start to allow smooth future enablement.
- All modules follow the **coded dictionary standard** for consistent analytics.

---

# Executive Summary — M3CoreCRM Specification

---

## 1. Vision & Scope
M3CoreCRM is a **multi-tenant, modular real estate CRM** designed for **web and iOS** clients, targeting Egypt and Gulf markets first, with multilingual support (including Arabic RTL).  
The platform manages the full lifecycle from **lead capture to deal closure**, including property inventory, mapping, campaigns, telemarketing, analytics, and billing.  
Architecture ensures **tenant isolation**, **role-based access**, and **scalable integration touchpoints** with external services.

---

## 2. Core Modules
1. **Leads Management** — capture, qualify, and nurture leads from multiple channels.
2. **Contacts & Companies** — unified customer and organization profiles, activity timeline.
3. **Deals & Pipelines** — configurable sales stages, multi-pipeline support.
4. **Activities & Tasks** — calendar integration, follow-ups, reminders.
5. **Marketing Campaigns** — email (Brevo), optional SMS/WhatsApp (Infobip).
6. **Property Inventory Management** — unit details, coded types, dimensions, pricing, status.
7. **Map Overlay & Unit Mapping** — visual project/unit placement, shape-to-unit mapping.
8. **Reports & Analytics** — performance dashboards, exportable insights.
9. **User & Role Management** — RBAC, groups, approval workflows (flat/multi-level).
10. **Billing & Subscription** — Stripe integration, seat limits, plan-based entitlements.
11. **Notifications & Communications** — inbox, email, SMS, WhatsApp; mirroring policy.
12. **Telemarketing & VoIP Integration** (optional) — call logging, dialers, PBX APIs.
13. **Security, Compliance & Audit Logging** — GDPR/local compliance, audit trails.
14. **Performance & Scalability** — optimized for thousands of tenants, horizontal scaling.
15. **QA, Release Management & Versioning** — CI/CD pipelines, sandbox integration tests.

---

## 3. Technology Stack
### **Frontend**
- CRM Dashboard: **React 18 + Vite**, TailwindCSS, Zustand, React Query, Axios, Zod.
- Marketing Site: **Next.js 14+**, TailwindCSS, React Query, Metadata API, Server Actions.
- Testing: Vitest, React Testing Library, Playwright/Cypress.

### **Backend**
- **Node.js + Express**, TypeScript, PostgreSQL (multi-tenant schema), Prisma ORM.
- Multer (file uploads), Stripe SDK, Brevo API, Infobip API (optional), Speakeasy (TOTP), QRCode (2FA setup), Pino logging.

### **Hosting & DevOps**
- DigitalOcean App Platform (backend), Vercel (frontend), DO Managed PostgreSQL & Spaces.
- GitHub Actions CI/CD, Sentry monitoring, Datadog metrics.

---

## 4. Integration Touchpoints
- **Brevo** — transactional & marketing email, SMTP fallback.
- **Infobip** *(optional)* — SMS/WhatsApp for 2FA, notifications, campaigns.
- **Stripe** — subscriptions, seat enforcement, plan-based feature flags.
- **Google Authenticator** — optional TOTP 2FA.
- **Social Logins** — Google, Apple, LinkedIn (phase 3).

Touchpoints are **architected from day one** but some integrations (Infobip, full Stripe billing) are deferred to later phases.

---

## 5. Design Principles
- **Modular Architecture** — each module isolated but integrated through shared services.
- **Multi-Tenancy by Design** — `company_id` enforced at DB and API layers.
- **RBAC + Approvals** — fine-grained role permissions and configurable approval flows.
- **Code Dictionaries** — standardized coded entries for analytics consistency.
- **Mirroring Policy** — any SMS/WhatsApp also generates inbox + email copy.
- **Configurable Dashboards** — per-user widget layout & data preferences.

---

## 6. Development Approach
- Build in **logical sequence**: Core auth & multi-tenancy → CRM foundation (contacts, deals, inventory) → marketing/telemarketing → analytics → optional integrations.
- **CI/CD** pipelines enforce automated testing, sandbox API checks, and staging validation before production.
- **Feature Flags** allow safe rollout of new modules to selected tenants.

---

## 7. Key Benefits
- Scalable, secure, and compliant CRM for real estate businesses.
- Ready for integration with global messaging and payment providers.
- Modular and extensible for future features like AI lead scoring or 3D virtual tours.

---

# Phase 0 — Section 1
# Tenant, Auth, RBAC & Sessions (with Entitlements Core, Phone Verification, and SMS/WhatsApp Touchpoints)

> Status: **Provider‑agnostic (Stripe/Infobip deferred)**. All limits, hooks, and abstractions are in place so providers can be added last without refactors.

---

## 1. Overview & Goals
- **Multi‑tenant isolation** via `tenant_id` across every table and API.
- **Authentication**: Email/password with email verification; optional **TOTP 2FA**; optional **SMS/WhatsApp 2FA** (touchpoints live now).
- **RBAC**: Role‑based permissions with a small default set, extensible per tenant.
- **Entitlements Core**: provider‑agnostic feature flags and limits (**DevFree/DevPro** now; Stripe later).
- **Sessions**: short‑lived access tokens + HTTP‑only refresh tokens with rotation & reuse detection.
- **Auditability**: durable audit log for all sensitive actions.
- **Phone Verification**: E.164 mobile verification flow (DevStub transport now; Infobip later).

---

## 2. Scope
### MVP
- Super Admin signup creates tenant.
- Email verification, password reset (via Brevo).
- Invitations with role assignment.
- JWT access + refresh rotation & reuse detection.
- Optional **TOTP 2FA** (Speakeasy + QRCode).
- Optional **SMS/WhatsApp 2FA** (gated; DevStub transport).
- **Entitlements Core** with Dev plans seeded.
- Basic audit log & session/device listing.
- Mobile number verification (E.164) with OTP via SMS/WhatsApp (DevStub).

### Advanced (later)
- OAuth logins (Google/Apple/LinkedIn), SSO (SAML/OIDC).
- Field‑level & record‑level policies.
- API keys / personal access tokens.
- Session anomaly detection & device fingerprinting.

---

## 3. Data Model & Relationships (ERD slice)

### Key Tables
- `tenants (id, name, status, created_at, …)`
- `users (id, tenant_id, email, password_hash, is_verified, created_at, …)`
- `user_profiles (user_id, phone_e164, phone_verified_at, full_name, avatar_url, …)`
- `roles (id, code, name)`
- `user_roles (user_id, role_id, tenant_id)`
- `permissions (id, code, description)` *(optional if mapping kept in code)*
- `role_permissions (role_id, permission_code)`
- `sessions (id, user_id, tenant_id, refresh_token_hash, user_agent, ip, expires_at, revoked_at, created_at)`
- `twofa_secrets (user_id, secret, enabled, backup_codes[])`
- `invites (id, tenant_id, email, role_id, inviter_id, token_hash, expires_at, accepted_at)`
- `audit_logs (id, tenant_id, user_id?, event, meta JSONB, ip, created_at)`

### Phone Verification
- `phone_verification (id, tenant_id, user_id, e164, channel ENUM['sms','whatsapp'], code_hash, expires_at, attempts, status ENUM['pending','verified','expired','revoked'], created_at)`

### Entitlements Core (Stripe‑neutral)
- `plans (id, code, name, tier, is_active)`
- `plan_features (plan_id, feature, limit_value)`
- `tenant_plan (tenant_id, plan_id, status, billing_provider, external_customer_id?, external_sub_id?, started_at, ends_at)`
- `usage_counters (tenant_id, key, value, period_start, period_end)`

> `billing_provider` starts as `'dev'`; later `'stripe'` when integrated.

### ASCII ERD (simplified)
```
tenants 1─* users 1─1 user_profiles
   │             │
   │             └─* sessions
   │
   └─* invites

roles *─* users (via user_roles)

users 1─1 twofa_secrets

users *─* permissions (via roles→role_permissions)

tenants 1─1 tenant_plan 1─* plan_features (* via plans)
                 │
                 └─* usage_counters

users 1─* phone_verification
```

---

## 4. API Endpoints (v1)

### Auth & Sessions
- `POST /v1/auth/register-super-admin` — creates tenant + super admin; sends verification.
- `POST /v1/auth/login` — returns access token + refresh cookie.
- `POST /v1/auth/refresh` — rotates refresh; detects reuse.
- `POST /v1/auth/logout` — revokes current session.
- `POST /v1/auth/verify-email` — confirm email token.
- `POST /v1/auth/forgot-password` — send reset email.
- `POST /v1/auth/reset-password` — complete reset.
- `GET /v1/auth/sessions` — list user’s sessions.
- `DELETE /v1/auth/sessions/:id` — revoke session.

### 2FA (TOTP + channel toggles)
- `POST /v1/auth/totp/setup` — returns otpauth URI + QR.
- `POST /v1/auth/totp/confirm`
- `POST /v1/auth/totp/disable`
- `POST /v1/auth/twofa/sms/enable|disable` *(gated; phone must be verified)*
- `POST /v1/auth/twofa/whatsapp/enable|disable` *(gated; phone must be verified)*

### Invitations & Users
- `POST /v1/admin/users/invite`
- `POST /v1/admin/users/accept-invite`
- `GET /v1/admin/users`
- `PATCH /v1/admin/users/:id`
- `DELETE /v1/admin/users/:id`

### RBAC
- `GET /v1/admin/roles`
- `GET /v1/admin/roles/:id/permissions`
- `POST /v1/admin/users/:id/roles` (assign/remove)

### Entitlements (provider‑agnostic)
- `GET /v1/admin/plan` — current plan, features, limits, usage.
- `POST /v1/admin/plan/preview` — simulate (dev only).

### Phone Verification (Dev transport now; Infobip later)
- `POST /v1/auth/phone/verify/start` `{ e164, channel: 'sms'|'whatsapp' }`
- `POST /v1/auth/phone/verify/confirm` `{ e164, code }`
- `POST /v1/auth/phone/verify/resend`
- `DELETE /v1/auth/phone/verify/cancel` *(optional)*

---

## 5. Permissions Matrix (baseline)

**Roles (default):** `super_admin`, `admin`, `staff`

**Permission codes (subset):**
- User Admin: `user.invite`, `user.read`, `user.update`, `user.delete`
- RBAC: `role.read`, `role.assign`
- Plan/Entitlements: `plan.view`
- Sessions: `session.read.self`, `session.revoke.self`, `session.revoke.tenant`
- Security: `twofa.manage.self`, `twofa.manage.tenant` (super/admin only)
- Phone: `phone.verify.start`, `phone.verify.confirm`
- Notifications Admin (prep for Section 2): `notify.templates.manage`, `notify.send.test`

> Each API handler checks tenant scope + permission code + entitlement when applicable.

---

## 6. Security & Session Policies
- **Password hashing**: Argon2id (preferred) or bcrypt with strong cost.
- **Email verification** required before privileged actions.
- **Refresh rotation**: revoke family on reuse detection.
- **CSRF**: refresh cookie is HTTP‑only, SameSite `Lax`/`Strict`.
- **Lockouts**: after 5 failed logins → 10 min backoff (configurable).
- **Token lifetimes**: Access 15m; Refresh 30d (configurable env).

---

## 7. Entitlements Integration (touchpoints live now)
- Middleware: `requireFeature('…')`, `requireLimit('users.max')`.
- **Seed plans** (Dev):
  - **DevFree**: features — `twofa.totp`, `plan.view`; limits — `users.max=3`. All SMS/WA off.
  - **DevPro**: features — `twofa.totp`, `twofa.sms`, `twofa.whatsapp`, `plan.view`; limits — `users.max=25`, `sms.monthlyCap=500`, `whatsapp.monthlyCap=500`.
- **Usage counters** increment at write points: user create, invite sent, sms/wa sent.
- **UI guards** hide gated features; server rejects with `402 PLAN_REQUIRED`.

> Stripe will replace the `Dev` provider later without changing these contracts.

---

## 8. Phone Verification & 2FA via SMS/WhatsApp (touchpoints)

### Security & Policy
- Codes: 6‑digit numeric, TTL **10 minutes**. Max **5 attempts** per token.
- Rate limits: `start` ≤ 3/hour, `resend` ≤ 1/min (per user).
- Store **hash of code** (Argon2/bcrypt). Constant‑time compare.
- Normalization: strict **E.164**; country stored; basic line‑type checks later.
- Audit every start/send/success/failure/resend.

### Notifications Integration
- Use **Notifications Core → Outbox** to send OTP now (DevStub); later Infobip.
- Templates: `otp.sms.verify_phone`, `otp.whatsapp.verify_phone`
- Payload: `{ code, expires_min, app_name, tenant_name }`

### UX
- Profile → Phone: enter number, format to E.164, send OTP, verify, show “Verified” with timestamp.
- Enabling SMS/WA 2FA **requires** verified phone.
- Admin policy: “Require verified phone for SMS/WA comms”.

---

## 9. Events & Audit
Emit (and store in `audit_logs`):
- `tenant.created`, `user.invited`, `user.verified`
- `auth.login`, `auth.logout`, `auth.refresh_rotated`
- `user.role.changed`, `twofa.enabled`, `twofa.disabled`
- `phone.verify.started`, `phone.verify.sent`, `phone.verify.succeeded`, `phone.verify.failed`, `phone.verify.resend`
- `tenant.plan.changed`, `tenant.seat.limit_reached`

---

## 10. UI/UX Flows (high level)
- **Super Admin Signup** → email verify → org name → first login → optional 2FA setup.
- **Invite User** → email link → accept → set password → optional 2FA → role assignment.
- **Sessions Page**: list current/other sessions; revoke.
- **Security Page**: enable/disable TOTP; enable SMS/WhatsApp 2FA after phone verify; regenerate backup codes.
- **Admin → Plan (read‑only)**: show plan, features, limits, usage; upgrade CTA (stub).

---

## 11. Acceptance Criteria (MVP)
- Tenant isolation enforced at DB + API.
- Email verification before privileged actions.
- Refresh rotation + reuse detection working; old tokens invalid.
- TOTP 2FA end‑to‑end with QR and backup codes.
- Phone verification flows (start/confirm/resend) with rate limits and hashed codes.
- SMS/WA 2FA toggles gated by entitlements + phone_verified_at.
- RBAC checks guard all admin operations.
- Entitlements checks enforced by middleware; Dev plans seeded.
- Audit logs created for all listed events; exportable as JSONL/CSV.
- Endpoints have integration tests; auth endpoints are rate‑limited.

---

## 12. Dependencies
- **Backend**: Node.js + Express + TypeScript, Prisma ORM, PostgreSQL.
- **Email**: Brevo (transactional).
- **2FA**: Speakeasy, QRCode.
- **Logging/Monitoring**: Pino/Winston; Sentry later.
- **Provider deferrals**: Stripe (billing), Infobip (SMS/WhatsApp).

---

## 13. Open Decisions
- ID formats: keep `U########` / `C########`?
- Baseline roles: `super_admin`, `admin`, `staff` — add more now?
- 2FA policy: per‑user optional; **tenant flag** to enforce for all?
- Password policy: min length & complexity?
- Lockout thresholds: default 5 attempts → 10m?
- Token lifetimes: Access 15m / Refresh 30d?
- Dev plan defaults: keep **DevFree**/**DevPro** values as listed?
- Accept WhatsApp‑only verification in some regions? (proposed: allowed)

---

## 14. Appendix — Middleware & Error Semantics

### Entitlements middleware (concept)
```
requireFeature(feature): 403/402 → { code: 'PLAN_REQUIRED', feature }
requireLimit(key): 422 → { code: 'LIMIT_REACHED', key, limit }
```

### Common auth errors
- `AUTH_INVALID_CREDENTIALS`
- `AUTH_EMAIL_UNVERIFIED`
- `AUTH_2FA_REQUIRED`
- `AUTH_2FA_INVALID_CODE`
- `AUTH_TOKEN_REUSED`
- `PLAN_REQUIRED`
- `LIMIT_REACHED`

---

# Phase 0 — Section 2
# Notifications Core (Email, SMS, WhatsApp, Inbox) — Provider‑Agnostic Base

> Status: **Provider‑agnostic**. Email uses **Brevo** now. **SMS/WhatsApp** use **DevStub** adapters today; **Infobip** added later without changing DB or APIs. **Mirrored sends** are enabled by default: any SMS/WhatsApp also triggers Email + Inbox notifications.

---

## 1. Overview & Goals
- Central messaging hub for **email**, **sms**, **whatsapp**, and **inbox** (push later).
- **Outbox + worker** pipeline with retries, idempotency, and webhook updates.
- **Templates** with variables, locales, previews, and approval status (for WhatsApp).
- **Entitlements & usage caps** enforced uniformly across channels.
- **Consent & compliance**: opt‑in/out (marketing), SMS STOP, WhatsApp opt‑in.
- **Mirrored sends** policy: SMS/WA automatically create equivalent **Email** + **Inbox** messages in one **dispatch group** (configurable).

---

## 2. Scope
### MVP
- Channels: Email (**Brevo real**), SMS (**DevStub**), WhatsApp (**DevStub**), Inbox (**native**).
- Outbox table, worker with exponential retries and idempotency.
- Template store per channel (code, body, variables, locale, is_approved).
- Basic rate limiting + monthly caps per tenant (via Entitlements).
- Opt‑in/opt‑out endpoints and enforcement for **marketing** sends.
- Webhook endpoints (stubs) for Infobip + Brevo.
- Mirrored sends: SMS/WA → Email + Inbox by default (policy + user prefs aware).

### Advanced (later)
- Real **Infobip** adapters for SMS/WA + WA template approval sync.
- Push notifications (APNS/FCM) via `push` channel.
- Journeys/orchestration (multistep flows with delays/branches).
- Quiet hours and time‑zone aware scheduling.

---

## 3. Data Model & Relationships

### Outbox & Templates
- `messages_outbox(id, tenant_id, channel ENUM['email','sms','whatsapp','inbox','push'], to, template_code, payload JSONB, type ENUM['transactional','marketing'], status ENUM['queued','sent','delivered','failed','bounced','expired'], error_code?, provider_message_id?, dispatch_group_id?, attempts INT, scheduled_at, sent_at, delivered_at, failed_at, created_at)`
- `message_templates(id, tenant_id, channel, code, name, family, body, variables JSONB, locale, is_approved BOOL, provider_template_id?, created_at, updated_at)`

### Inbox (in‑app channel)
- `notifications_inbox(id, tenant_id, recipient_user_id, title, body, severity ENUM['info','success','warning','error'], link_url?, meta JSONB, is_read BOOL DEFAULT false, read_at, dispatch_group_id?, created_at)`
- `notification_preferences(user_id, email_on_sms BOOL DEFAULT true, email_on_whatsapp BOOL DEFAULT true, inbox_on_all BOOL DEFAULT true, marketing_email_opt_in BOOL, marketing_sms_opt_in BOOL, marketing_whatsapp_opt_in BOOL, locale)`

### Consent & Opt‑outs
- `channel_opt_ins(id, tenant_id, subject_type ENUM['user','contact'], subject_id, channel, consent_source, consent_text, consent_at)`
- `sms_stop_list(tenant_id, e164_value, opted_out_at)`

### Providers & Entitlements (reuse from Section 1)
- `provider_credentials(id, tenant_id NULLABLE, provider ENUM['brevo','infobip'], data JSONB ENCRYPTED, created_at, updated_at)`
- Reuse `usage_counters`, `tenant_plan` from Section 1.

### Dispatch grouping
- `dispatch_groups(id, tenant_id, correlation_key, root_message_id, created_at)` — groups mirrored multi‑channel sends for idempotency & UX linking.

---

## 4. Provider Abstraction

### Interfaces
- `EmailProvider.send(templateCode, to, payload, options) → { providerMessageId }`
- `SmsProvider.sendText(toE164, body | { templateCode, payload }, options) → { providerMessageId }`
- `WhatsAppProvider.sendTemplate(toE164, templateCode, lang, payload, options) → { providerMessageId }`
- `InboxProvider.create(userId, title, body, severity, linkUrl?, meta?) → { id }`

### Implementations (MVP)
- **EmailProvider**: **Brevo** (real).
- **SmsProvider**: **DevStub** (simulated delivery & webhook).
- **WhatsAppProvider**: **DevStub** (simulated delivery & webhook).
- **InboxProvider**: native DB writer.

> Later: add **Infobip** adapters for SMS/WA and bind credentials from `provider_credentials` (tenant‑level override or global).

---

## 5. Delivery Pipeline
1) **Enqueue**: API writes a `messages_outbox` row with `status='queued'` (and creates a `dispatch_group` when mirroring).
2) **Worker**: pulls due jobs (by `scheduled_at`), resolves adapter, sends, updates to `sent` with `provider_message_id` (email/sms/wa) or writes `notifications_inbox` (inbox channel).
3) **Webhooks**: map provider DLRs to `delivered`/`failed`/`bounced`. Store `error_code` and metadata.
4) **Retries**: exponential backoff (1m, 5m, 15m), `attempts<=3`. Dead‑letter when exhausted.
5) **Idempotency**: dedupe by `(tenant_id, template_code, to, payload_hash, schedule_bucket)` or externally via `correlation_key` / `dispatch_group_id`.

---

## 6. Mirrored Sends Policy (Email + Inbox)
- **Default rule** (configurable per tenant): when `channel ∈ {sms, whatsapp}`
  - Also enqueue **Email** variant (if allowed by user/tenant prefs & consent).
  - Also create **Inbox** entry for the recipient user with a concise summary and link (if applicable).
- **Template families** ensure equivalent content across channels:
  - Example family: `otp.verify_phone`
    - Email: `otp.email.verify_phone`
    - SMS: `otp.sms.verify_phone`
    - WhatsApp: `otp.whatsapp.verify_phone`
    - Inbox: `otp.inbox.verify_phone`
- **Fallbacks**:
  - Inbox: if `*.inbox.*` is missing, auto‑generate a short title/body from the SMS payload (truncate to 140 chars), mark `auto_generated=true` in `meta`.
  - Email: if missing email template, **do not block** the SMS/WA send; log template error, record `failed` for the mirrored email in the same dispatch group.
- **Independence**: Success of SMS/WA is independent of mirrored Email/Inbox success.

---

## 7. API Surface

### Dispatch & Templates
- `POST /v1/notify/dispatch`
  - Body: `{ channel, to, template_code, payload, type: 'transactional'|'marketing', mirror?: boolean | { email?: boolean, inbox?: boolean }, schedule_at?, correlation_key? }`
  - Behavior: Enqueue requested channel; if `channel` is sms/whatsapp and `mirror` is omitted or truthy, also enqueue mirrored Email + create Inbox entry (respecting preferences & consent).
- `GET /v1/notify/messages?status=&channel=&from=&to=` — list outbox.
- `POST /v1/notify/templates` / `PATCH /v1/notify/templates/:id` / `GET /v1/notify/templates?channel=&family=&locale=`
- `POST /v1/notify/opt-in` / `POST /v1/notify/opt-out` (subject_type: user|contact, channel)

### Inbox
- `GET /v1/me/notifications?is_read=&since=` — current user inbox.
- `PATCH /v1/me/notifications/:id/read` — mark read.
- `GET /v1/admin/notifications/:userId` — admin view.

### Webhooks (stubs now; real later)
- `POST /v1/webhooks/brevo`
- `POST /v1/webhooks/infobip`

---

## 8. RBAC & Entitlements
- **Permissions**: `notify.templates.manage`, `notify.send.test`, `notify.outbox.read`, `notify.inbox.read.self`, `notify.inbox.read.tenant`, `notify.preferences.update.self`.
- **Features** (checked on dispatch): `notifications.sms`, `notifications.whatsapp`, `marketing.sms`, `marketing.whatsapp`.
- **Limits** (via `usage_counters`): `sms.monthlyCap`, `whatsapp.monthlyCap`, per‑minute throttles.

---

## 9. Compliance & Consent
- **SMS STOP**: if a number is in `sms_stop_list`, block **marketing** SMS sends; transactional overrides follow tenant policy flag `allow_transactional_over_stop` (default: false).
- **WhatsApp opt‑in**: require `channel_opt_ins` record for **marketing** WA messages.
- **Email**: honor `marketing_email_opt_in` for marketing; transactional always allowed.
- **Transactional vs marketing**: controlled by `type` in dispatch body; drives consent checks and mirrored sends policy.
- **E.164 validation** for SMS/WA destinations; locale selected for template resolution.

---

## 10. Template Rules & Resolution
- Templates grouped by **`family`** (cross‑channel identity). Example: `otp.verify_phone`.
- Resolution flow: pick template by `(tenant_id, channel, family, locale)` → fallback to `(channel, en)` → hard fail for Email, soft fallback for Inbox.
- Variables: schema stored with template; runtime validation rejects missing variables with clear error.
- Preview endpoint can render templates locally with payload.

---

## 11. Rate Limiting & Scheduling
- Per‑tenant throttles: `X per minute` per channel (configurable).
- `scheduled_at` supports delayed sends; worker respects due time.
- Idempotency support via `correlation_key` (client‑supplied) or deterministic `(template_code, to, payload_hash)` key.

---

## 12. Events, Logging & Metrics
- Emit events: `message.queued`, `message.sent`, `message.delivered`, `message.failed`, `message.bounced`, `contact.opted_out`, `dispatch.group.created`.
- Log provider codes and response payloads (sanitize PII).
- Metrics: queue depth, send latency, delivery %, failure codes distribution, sends vs caps, mirrored send coverage.

---

## 13. Acceptance Criteria (MVP)
- **Email/Brevo**: end‑to‑end send with webhook updating status to delivered/failed.
- **SMS/WA (DevStub)**: enqueued → marked sent → simulated webhook sets delivered.
- **Mirrored sends**: any SMS/WA triggers Email + Inbox in the same dispatch group (unless explicitly disabled by `mirror=false`). Inbox entry visible immediately.
- **Consent checks**: marketing sends honor opt‑ins; transactional bypass allowed per policy (default disallowed).
- **Caps/throttles**: enforced with 402/429 responses; usage counters increment correctly.
- **Templates CRUD**: create/update/list works; dispatch validates required variables.
- **Outbox filtering**: list by status/channel/date; shows provider IDs and timestamps.
- **Inbox**: endpoints return unread/read, support mark‑read and pagination.
- **Idempotency**: re‑submitting with same correlation key does not duplicate sends.

---

## 14. Open Decisions
1) Default mirroring: keep **on for transactional**, **off for marketing** unless tenant enables? (Proposed: **on** for both, but marketing email mirroring requires email opt‑in.)  
2) Quiet hours: defer to later?  
3) Global vs per‑tenant provider credentials default (Proposed: start global; allow override).  
4) Fallback behavior for email missing in family (currently: soft‑fail email, proceed with SMS/WA + inbox).  
5) Inbox retention: 90 days by default? Archive vs hard delete?

---

## 15. Appendix — Error Semantics
- `PLAN_REQUIRED` — feature disabled by plan/entitlements.
- `RATE_LIMIT` — throttle exceeded.
- `CONSENT_REQUIRED` — missing opt‑in for marketing channel.
- `TEMPLATE_MISSING` — template or family not found for required channel (email hard‑require).
- `DLR_INVALID` — unrecognized webhook payload.

---

# Phase 1 — Section 3: Contacts & Companies
**Applies to: Customer/Prospect Records — Managed by Tenant Users in the CRM**

---

## 1. Overview & Goals
- Serve as the **single source of truth** for customer/prospect people (**contacts**) and organizations (**companies**) managed by a tenant.
- Support **deduplication/merge**, **custom fields**, and unified **activity timelines**.
- Manage **communication channels** (email, mobile/WhatsApp) with **verification** and **consent** status.
- Link to **Leads**, **Deals/Pipelines**, **Activities/Tasks**, and **Marketing Campaigns**.

---

## 2. Scope
### MVP
- CRUD for Contacts & Companies with ownership and visibility rules.
- Contact–Company relationships (primary + secondary links).
- Activity timeline aggregation (read-only from Activities module).
- Custom fields per tenant for both contacts and companies.
- Channel fields with verification and opt-in flags.
- Basic CSV import with validation.
- Duplicate detection on create/update.
- Segments (saved filters) for use in marketing and reporting.

### Advanced
- Data enrichment from third-party APIs.
- Fuzzy dedupe and merge suggestions.
- Contact lifecycles and health scoring.
- Hierarchical companies (parent/subsidiary, departments).

---

## 3. Data Model
- `companies (id, tenant_id, name, domain, phone, country, city, address, status, created_at, updated_at)`
- `contacts (id, tenant_id, first_name, last_name, job_title, company_id?, owner_user_id?, lifecycle_stage ENUM['lead','prospect','customer','inactive'], created_at, updated_at)`
- `contact_channels (id, tenant_id, contact_id, type ENUM['email','phone','whatsapp'], value, value_e164?, is_primary BOOL, verified_at, opt_in BOOL, opt_in_source, opt_out_at, locale, UNIQUE(tenant_id, type, normalized_value))`
- `contact_links (contact_id, company_id, relation ENUM['employee','stakeholder','other'], is_primary BOOL)`
- `custom_field_defs (id, tenant_id, entity ENUM['contact','company'], code, label, type ENUM['text','number','date','bool','select','multiselect'], options JSONB, required BOOL, unique BOOL, active BOOL)`
- `custom_field_values (id, tenant_id, entity, entity_id, field_code, value JSONB, created_at, updated_at)`
- `contact_duplicates (id, tenant_id, contact_id_a, contact_id_b, reason, score, resolved_at, merged_into_id?)`
- Reuse from Notifications Core:
  - `channel_opt_ins`, `sms_stop_list` for consent and compliance

---

## 4. API Surface (v1)
### Contacts
- `GET /v1/contacts` (filters: owner, company, lifecycle, segment, search)
- `POST /v1/contacts`
- `GET /v1/contacts/:id`
- `PATCH /v1/contacts/:id`
- `DELETE /v1/contacts/:id`
- `POST /v1/contacts/:id/channels` — add/update channels; validate E.164 for phone/WA
- `POST /v1/contacts/:id/channels/:channelId/verify/start|confirm` — reuse verification flow from Sections 1 & 2
- `POST /v1/contacts/:id/opt-in` / `opt-out` (per channel)
- `POST /v1/contacts/dedupe/check` — preview duplicates
- `POST /v1/contacts/merge` — merge duplicates

### Companies
- `GET /v1/companies` (filters: domain, name, city, status, search)
- `POST /v1/companies`
- `GET /v1/companies/:id`
- `PATCH /v1/companies/:id`
- `DELETE /v1/companies/:id`

### Segments & Custom Fields
- `GET/POST/PATCH/DELETE /v1/segments` (entity=contact|company)
- `GET/POST/PATCH/DELETE /v1/custom-fields/definitions?entity=contact|company`

---

## 5. Permissions & Visibility
- Permission codes:
  - Contacts: `contact.read`, `contact.create`, `contact.update`, `contact.delete`
  - Companies: `company.read`, `company.create`, `company.update`, `company.delete`
  - Dedupe/Merge: `contact.merge`
  - Custom fields: `customfields.manage`
  - Channel consent: `contact.consent.manage`
- Visibility rules (MVP):
  - Owner or Admin can edit; all staff can view unless restricted by team scopes.
  - Private contacts (owner-only) optional feature (plan-gated).

---

## 6. Dedupe & Merge
- Blocking checks: same tenant + identical email OR identical phone_e164.
- Soft matches: name + company domain, name + phone partials.
- Merge keeps target ID, tombstones source record with `merged_into_id`.
- Channels merged with union of primaries; preserve verified flags.

---

## 7. Integrations & Touchpoints
- **Activities/Tasks**: timeline shown via `/v1/activities?subject=contact:ID`.
- **Leads Management**: conversion flow creates Contact/Company here.
- **Deals/Pipelines**: deals link to Contact & Company records.
- **Marketing Campaigns**: uses opt-in flags for channel targeting.

---

## 8. UI/UX
- **Contact Profile**: header with name, title, company, channel badges; tabs for Details, Timeline, Deals, Tasks.
- **Company Profile**: name, domain, related contacts, deals, activities.
- **List/Search**: filter chips for owner, lifecycle, verified channels.
- **Create/Edit**: standard fields + custom fields section.
- **Merge UI**: side-by-side compare with field pickers.

---

## 9. Entitlements & Limits
- Features:
  - `contacts.customFields`
  - `contacts.privateRecords`
- Limits:
  - `contacts.max`
  - `companies.max`
- Enforced via UI guards + API middleware from Section 1.

---

## 10. Events & Analytics
- Emit: `contact.created`, `contact.updated`, `contact.deleted`, `contact.merged`, `company.created`, `company.updated`, `company.deleted`, `contact.opted_in`, `contact.opted_out`, `contact.channel.verified`.
- Analytics hooks: contact counts by lifecycle, opt-in rates, verified rate, new contacts by source, top companies by deals.

---

## 11. Acceptance Criteria
- Create/edit/list/search contacts & companies with tenant isolation.
- Channel CRUD validates E.164 for phone/WA; email format checks.
- Opt-in/out stored and respected in marketing.
- Verification flows work via Notifications Core for phones.
- Duplicate blocking on exact email/phone; merge preserves links.
- Custom fields validate type and appear in forms and API.
- Segments save and run correctly.

---

## 12. Open Decisions
1. Lifecycle stages — keep `lead, prospect, customer, inactive` or add `lost`?
2. Single owner or allow co-owners?
3. Custom fields cap per plan — DevFree=10 per entity?
4. Use company domain as dedupe signal?
5. Private contacts in MVP or later?

---

# Phase 1 — Section 3A: Groups, Role Trees & Approvals Core
**Applies to: Tenant Users Only — Internal Access Control, Entitlements, and Action Approvals**

---

## 1. Overview & Goals
- Extend **RBAC** with **user groups** and **role hierarchies** for tenant users.
- Allow **entitlement overrides** per group or individual tenant user (feature/limit changes from the plan).
- Provide an **approvals engine** for sensitive actions, with flat or multi-level steps based on role, group, function, and/or transaction amount.

---

## 2. Scope
### MVP
- Groups for tenant users with membership management.
- Role hierarchy support (parent/child roles, inheritance).
- Entitlement overrides at tenant, group, and user levels.
- Approval policies for selected action types with flat or sequential steps.
- Approvals integrated into **Deals**, **Property Inventory**, **Marketing Campaigns** (from their first release).

### Advanced
- Parallel approval steps.
- SLA timers with escalation.
- Dynamic approver resolution (e.g., “owner’s manager”).
- Conditional steps based on payload values.
- Reporting on approval cycle times and bottlenecks.

---

## 3. Data Model
- `groups (id, tenant_id, name, code, description, is_active, created_at)`
- `group_members (group_id, user_id, added_at)`
- `role_hierarchy (tenant_id, parent_role_id, child_role_id)`
- `entitlements_overrides_tenant (tenant_id, feature, limit_value?)`
- `entitlements_overrides_group (tenant_id, group_id, feature, limit_value?)`
- `entitlements_overrides_user (tenant_id, user_id, feature, limit_value?)`
- `approval_policies (id, tenant_id, name, action_code, object_type, conditions JSONB, active BOOL)`
- `approval_steps (id, policy_id, seq, kind ENUM['flat','sequential','parallel'], approver_mode ENUM['role','group','user','dynamic'], approver_ref, threshold JSONB NULL, sla_hours INT NULL)`
- `approval_requests (id, tenant_id, policy_id, action_code, object_type, object_id, requester_user_id, state ENUM['pending','approved','rejected','cancelled'], current_step INT, payload JSONB, created_at, decided_at?)`
- `approval_actions (id, request_id, step_seq, approver_user_id, decision ENUM['approve','reject'], comment, created_at)`

---

## 4. API Surface (v1)
### Groups
- `GET/POST/PATCH/DELETE /v1/admin/groups`
- `POST/DELETE /v1/admin/groups/:id/members`

### Roles
- `GET/POST/DELETE /v1/admin/roles/hierarchy`

### Entitlements Overrides
- `GET/PUT /v1/admin/entitlements/overrides/{tenant|group|user}`
- `GET /v1/admin/entitlements/effective?userId=…` (debug)

### Approvals
- `GET/POST/PATCH/DELETE /v1/approvals/policies`
- `GET /v1/approvals/requests`
- `POST /v1/approvals/requests/:id/approve` / `reject`

---

## 5. Permission Codes
- `groups.manage`, `groups.members.manage`
- `roles.hierarchy.manage`
- `entitlements.overrides.manage`
- `approvals.policies.manage`
- `approvals.requests.read`
- `approvals.decide`

---

## 6. Entitlements & Precedence
1. User overrides
2. Group overrides (max across groups)
3. Tenant plan defaults (from Section 1)

---

## 7. Approval Examples (MVP)
- **Deals**: Require manager approval for discounts > 10% or deal value > $100k.
- **Property Inventory**: Require finance group approval for price overrides > $5k.
- **Marketing**: Require marketing lead approval for campaigns > 5,000 recipients or sending SMS/WA exceeding daily cap.

---

## 8. Notifications
- Each approval step opening triggers:
  - **Inbox notification** (always)
  - **Email** (always, unless user disabled for transactional)
  - **SMS/WhatsApp** optional (per preferences, from Notifications Core)
- SLA approaching: reminder notifications.

---

## 9. Acceptance Criteria
- Adding/removing user from group updates permissions/entitlements instantly.
- Role hierarchy inheritance works without cycles.
- Approvals block the action until required steps are complete.
- Policies and steps can be enabled/disabled without code changes.
- All approvals actions are audited.

---

## 10. Integration Points
- **Deals/Pipelines**: discount thresholds, high-value deals trigger approvals.
- **Property Inventory**: price changes, reservation releases trigger approvals.
- **Marketing Campaigns**: large audience sends or high-cost campaigns trigger approvals.
- Approval engine callable from any module with `approvals.checkAndMaybeEnqueue(...)`.

---

## 11. Open Decisions
1. Default approver sources to seed? (`sales_manager`, `finance_manager`, `inventory_manager`, `executive_board` group)
2. Dynamic approver rules out-of-the-box? (`owner.manager`, `pipeline.owner`, `project.owner`)
3. Threshold fields by default for Deals, Marketing, Inventory.
4. Plan limits for approvals (DevFree: 2 active policies, no parallel steps? DevPro: unlimited?).

---

# Phase 1 — Section 4: Activities & Tasks

---

## 1. Overview & Goals
- Central log for **interactions** (calls, emails, meetings, notes) and **tasks** related to contacts, companies, deals, or properties.
- Unified **activity timeline** across modules.
- Integrated with Notifications Core for **reminders** and **status updates**.
- Supports linking to multiple entities and owners.

---

## 2. Scope
### MVP
- Activity types: call, email, meeting, note, system event (read-only from other modules).
- Tasks: title, description, due date/time, priority, status.
- Links to subject(s) (e.g., Contact, Company, Deal, Inventory Unit).
- Owner assignment and team visibility.
- Reminders via Notifications Core (email, inbox, optional SMS/WA).
- Timeline aggregation endpoint per entity.

### Advanced
- Recurring tasks.
- Email sync (IMAP/SMTP) for sent/received linking.
- Calendar integration (Google, Outlook).
- Activity templates (common meeting/task formats).

---

## 3. Data Model
- `activities (id, tenant_id, type ENUM['call','email','meeting','note','system'], subject_type, subject_id, owner_user_id, title, body, direction ENUM['inbound','outbound'], started_at, ended_at, created_at)`
- `tasks (id, tenant_id, title, description, status ENUM['open','in_progress','done','cancelled'], priority ENUM['low','medium','high'], due_at, owner_user_id, related_type, related_id, created_at, completed_at)`
- `activity_links (activity_id, related_type, related_id)` — many-to-many linking.
- `task_links (task_id, related_type, related_id)`
- `reminders (id, tenant_id, task_id, remind_at, channel ENUM['email','inbox','sms','whatsapp'], status ENUM['pending','sent','cancelled'])`

---

## 4. API Surface (v1)
### Activities
- `GET /v1/activities` (filters: subject, type, date range, owner)
- `POST /v1/activities`
- `GET /v1/activities/:id`
- `PATCH /v1/activities/:id`
- `DELETE /v1/activities/:id`

### Tasks
- `GET /v1/tasks` (filters: status, priority, due range, owner)
- `POST /v1/tasks`
- `GET /v1/tasks/:id`
- `PATCH /v1/tasks/:id`
- `DELETE /v1/tasks/:id`
- `POST /v1/tasks/:id/complete`
- `POST /v1/tasks/:id/remind` — schedule reminder(s)

### Timeline
- `GET /v1/timeline?subject_type=...&subject_id=...` — merged activities/tasks/events sorted by date.

---

## 5. Permissions & Visibility
- Activities: `activity.read`, `activity.create`, `activity.update`, `activity.delete`
- Tasks: `task.read`, `task.create`, `task.update`, `task.delete`, `task.complete`
- Owners can always read/update their own; Admins can read/update all.
- Team visibility rules from RBAC/Groups module (Section 3A).

---

## 6. Notifications & Reminders
- All reminders use Notifications Core:
  - Inbox + Email always; optional SMS/WA per preferences.
- Task assignment triggers notification to assignee.
- Reminders fire at `remind_at`, can have multiple channels.
- Overdue tasks trigger daily digest notification.

---

## 7. Integrations & Touchpoints
- **Contacts/Companies**: timeline view uses this module.
- **Deals/Pipelines**: activities link to deals for sales tracking.
- **Property Inventory**: tasks for unit follow-ups or inspections.
- **Approvals Core**: certain task completions (e.g., high-value approvals) can trigger approval checks.

---

## 8. UI/UX
- Timeline widget: grouped by date, activity type icons, expandable details.
- Task list: filter by owner, due date, status; drag-and-drop reordering (optional).
- Task form: add description, due date, reminders (multi-channel).
- Calendar view (later) for activities/tasks.

---

## 9. Entitlements & Limits
- Features: `tasks.recurring` (later), `activities.emailSync` (later).
- Limits: `tasks.max` per plan (optional).
- Enforcement: via Entitlements middleware from Section 1.

---

## 10. Events & Analytics
- Emit: `activity.created`, `activity.updated`, `activity.deleted`, `task.created`, `task.completed`, `task.deleted`, `reminder.sent`.
- Analytics: tasks completed on time %, overdue counts, activities by type.

---

## 11. Acceptance Criteria
- Create/edit/delete activities & tasks scoped to tenant.
- Link to multiple related records; show in each related entity’s timeline.
- Reminders send through Notifications Core respecting preferences.
- Timeline aggregation returns consistent ordering and type info.
- Permissions and team visibility rules enforced.

---

## 12. Open Decisions
1. Should system events (e.g., deal stage change) be stored in `activities` or a separate table and merged at query time?
2. Multiple owners for tasks allowed or single owner only?
3. Default reminder time before due date (e.g., 15 min, 1h)?
4. Do we allow editing activity type after creation?
5. Should overdue tasks auto-escalate via Approvals Core in some cases?

---

# Phase 2 — Section 5: Deals & Pipelines

---

## 1. Overview & Goals
- Manage **sales opportunities** (deals) moving through one or more **pipelines**.
- Flexible **pipeline stages** with custom fields and probabilities.
- Link deals to **contacts**, **companies**, **activities**, and **property inventory**.
- Integrate with Approvals Core for **discounts**, **price overrides**, or **large deals**.

---

## 2. Scope
### MVP
- Multiple pipelines per tenant (plan-gated if needed).
- CRUD for pipelines, stages, and deals.
- Stage order, probability %, and win/lose outcomes.
- Deal fields: name, amount, currency, stage, pipeline, owner, linked contacts/companies.
- Activity timeline (from Activities module) visible in deal view.
- Simple forecasting based on stage probability.

### Advanced
- Weighted forecasting by historic conversion rates.
- Stage automation (move to next stage on condition).
- Products/line items per deal.
- Deal teams (multiple owners/co-owners).
- Deal score (AI/ML later).

---

## 3. Data Model
- `pipelines (id, tenant_id, name, description, is_active, created_at)`
- `pipeline_stages (id, pipeline_id, name, order_index, probability_pct, is_win BOOL, is_loss BOOL)`
- `deals (id, tenant_id, name, amount, currency, pipeline_id, stage_id, owner_user_id, status ENUM['open','won','lost'], close_date, created_at, updated_at)`
- `deal_contacts (deal_id, contact_id, role ENUM['decision_maker','influencer','other'])`
- `deal_companies (deal_id, company_id, role ENUM['primary','secondary'])`
- `deal_custom_field_values` (reuse `custom_field_defs` from Contacts module)
- `deal_approvals` (link to Approvals Core requests, if triggered)

---

## 4. API Surface (v1)
### Pipelines & Stages
- `GET/POST/PATCH/DELETE /v1/pipelines`
- `GET/POST/PATCH/DELETE /v1/pipelines/:id/stages`

### Deals
- `GET /v1/deals` (filters: pipeline, stage, owner, status, date range, min/max amount)
- `POST /v1/deals`
- `GET /v1/deals/:id`
- `PATCH /v1/deals/:id`
- `DELETE /v1/deals/:id`
- `POST /v1/deals/:id/move-stage`
- `POST /v1/deals/:id/mark-won`
- `POST /v1/deals/:id/mark-lost`

### Approvals
- Auto-checks when updating amount, discount, or price override.
- `/v1/deals/:id/request-approval` (manual trigger if needed).

---

## 5. Permissions & Visibility
- Permissions: `pipeline.manage`, `deal.read`, `deal.create`, `deal.update`, `deal.delete`, `deal.stage.move`, `deal.mark.win`, `deal.mark.loss`.
- Visibility rules: Owner can edit; Admin can edit all; team-based scope from Groups module.

---

## 6. Approvals Integration
- Policy triggers:
  - Discount % > threshold.
  - Deal amount > threshold.
  - Certain products or property units flagged as requiring approval.
- Block stage move or close until approved.

---

## 7. Notifications
- Deal assigned → notify owner via inbox/email (and optional SMS/WA).
- Stage change → notify watchers/subscribers.
- Approval required → notify approvers (mirrored channels).
- Won/lost → notify relevant stakeholders.

---

## 8. Integrations & Touchpoints
- **Contacts/Companies**: deals link to primary contact/company.
- **Activities/Tasks**: timeline embedded in deal view.
- **Property Inventory**: link deal to specific units; update unit status on win/loss.
- **Reports & Analytics**: pipeline conversion rates, sales velocity, forecast.

---

## 9. UI/UX
- Kanban board view per pipeline.
- Deal card with amount, owner, contact/company avatars, stage.
- Inline stage move via drag-and-drop.
- Deal detail view with tabs: Details, Timeline, Linked Records.

---

## 10. Entitlements & Limits
- Features:
  - `deals.multiPipelines`
  - `deals.customFields`
- Limits:
  - `deals.max`
- Enforced via Entitlements middleware.

---

## 11. Events & Analytics
- Emit: `deal.created`, `deal.updated`, `deal.deleted`, `deal.stage.moved`, `deal.won`, `deal.lost`.
- Analytics: win rate %, average deal size, pipeline value by stage, forecast by close date.

---

## 12. Acceptance Criteria
- Pipelines and stages are tenant-scoped and fully manageable.
- Deals can be created/edited/moved/won/lost with RBAC enforcement.
- Approval checks fire when thresholds met; block until decision.
- Kanban and list views reflect live deal data.
- All deal-related events are audited.

---

## 13. Open Decisions
1. Allow multiple pipelines in DevFree plan or limit to one?
2. Default stage probabilities or leave all at 0% until customized?
3. Should lost reason be a required field?
4. Auto-close deals past close date as lost?
5. Deal teams (multi-owner) in MVP or later?

---

# Phase 2 — Section 6: Leads Management

---

## 1. Overview & Goals
- Capture, qualify, and manage **inbound** and **outbound leads** before conversion to contacts, companies, and deals.
- Provide clear **lead sources**, **statuses**, and **scoring** for prioritization.
- Integrate with marketing campaigns, web forms, and import pipelines.

---

## 2. Scope
### MVP
- CRUD for leads with fields: name, contact info, source, status, owner.
- Lead statuses: `new`, `contacted`, `qualified`, `disqualified`, `converted`.
- Link leads to eventual contact/company/deal after conversion.
- Manual lead creation, CSV import, and API capture.
- Simple scoring model (rule-based).
- Duplicate detection with existing contacts.

### Advanced
- Automated scoring with behavior tracking.
- Round-robin or rules-based assignment.
- Multi-touch attribution.
- Lead nurturing sequences.

---

## 3. Data Model
- `leads (id, tenant_id, first_name, last_name, email, phone_e164, source ENUM['web','referral','manual','import','campaign','other'], status ENUM['new','contacted','qualified','disqualified','converted'], score INT, owner_user_id, created_at, updated_at)`
- `lead_custom_field_values` (reuse custom field system).
- `lead_conversions (lead_id, contact_id, company_id, deal_id, converted_at)`
- `lead_duplicates (lead_id, contact_id, reason, score)`

---

## 4. API Surface (v1)
- `GET /v1/leads` (filters: owner, status, source, date range, min score)
- `POST /v1/leads`
- `GET /v1/leads/:id`
- `PATCH /v1/leads/:id`
- `DELETE /v1/leads/:id`
- `POST /v1/leads/:id/convert` — creates/links contact/company/deal
- `POST /v1/leads/import` — CSV import with preview
- `POST /v1/leads/:id/score` — manual score adjustment

---

## 5. Permissions & Visibility
- Permissions: `lead.read`, `lead.create`, `lead.update`, `lead.delete`, `lead.convert`, `lead.import`.
- Owner can edit own leads; Admin can edit all.
- Group-based visibility (from Groups module) if enabled.

---

## 6. Duplicate Detection & Conversion
- On lead creation/update:
  - Check for matching email/phone in `contacts` or `companies`.
- Conversion:
  - If match found, link lead to existing contact/company.
  - If no match, create new contact/company.
  - Optionally create a deal and link it.
  - Preserve lead record with `converted` status.

---

## 7. Notifications
- Lead assigned → notify owner.
- Lead converted → notify owner and any watchers.
- Lead score change above threshold → notify owner.

---

## 8. Integrations & Touchpoints
- **Contacts/Companies**: lead conversion populates these modules.
- **Deals/Pipelines**: conversion may create a new deal.
- **Marketing Campaigns**: leads can be added to campaign audiences.
- **Reports & Analytics**: lead source performance, conversion rates, average score.

---

## 9. UI/UX
- Lead list with filters and bulk actions.
- Lead detail with info, activities timeline, linked marketing campaigns.
- Convert flow: choose or create contact/company/deal; confirm mapping.
- Import wizard: upload CSV, map fields, preview duplicates.

---

## 10. Entitlements & Limits
- Features:
  - `leads.import`
  - `leads.scoring`
- Limits:
  - `leads.max`
- Enforced via Entitlements middleware.

---

## 11. Events & Analytics
- Emit: `lead.created`, `lead.updated`, `lead.deleted`, `lead.converted`.
- Analytics: conversion rate %, average lead score, source performance.

---

## 12. Acceptance Criteria
- Leads can be created/imported and linked to owner.
- Duplicate detection with contacts works.
- Conversion flow works for both new and existing contacts/companies.
- Notifications sent for assignment, conversion, score threshold.
- Lead scoring adjustable via API and UI.
- Data isolated per tenant.

---

## 13. Open Decisions
1. Should “disqualified” leads auto-archive after N days?
2. Include multi-owner support in MVP?
3. Require owner assignment on creation or allow unassigned?
4. Limit number of custom fields for leads per plan?
5. Auto-create deal on conversion or make optional?

---

# Phase 3 — Section 7: Property Inventory Management

---

## 1. Overview & Goals
- Central database of all **properties**, **projects**, **buildings**, and **units** a tenant manages.
- Manage availability, pricing, attributes, and detailed dimensions for each unit.
- Link units to **deals**, **marketing campaigns**, and **map overlays**.
- Support **virtual tour links** as URL fields (no embedded 3D).
- Use **coded type dictionaries** for all key classification fields for consistent analytics.

---

## 2. Scope
### MVP
- Hierarchy: Project → Building → Unit.
- Unit attributes: type (coded), size, bedrooms, bathrooms, view, price, status.
- Status workflow: available, reserved, sold, on hold, unavailable.
- Price history tracking.
- Link units to deals for reservation/sale.
- Media: image gallery, brochure PDF link, virtual tour URL.
- Optional dimensions: overall and per-component (rooms, bathrooms, balconies, etc.)

### Advanced
- Bulk status updates and price changes.
- Custom unit attributes per tenant.
- Unit availability calendar.
- Integration with Map Overlay & Unit Mapping.
- Stock import/export via CSV.

---

## 3. Data Model
- `projects (id, tenant_id, name, location, description, developer_id?, created_at)`
- `buildings (id, project_id, name, floors, created_at)`
- `unit_type_codes (id, tenant_id NULL, code TEXT, label TEXT, description TEXT, is_active BOOL DEFAULT true, created_at, updated_at)`
- `component_type_codes (id, tenant_id NULL, code TEXT, label TEXT, description TEXT, is_active BOOL DEFAULT true, created_at, updated_at)`
- `units (
    id,
    building_id,
    code,
    floor,
    unit_type_code TEXT REFERENCES unit_type_codes(code),
    size_sqm NUMERIC(8,2),
    bedrooms INT,
    bathrooms INT,
    view TEXT,
    price NUMERIC(12,2),
    currency CHAR(3),
    status ENUM['available','reserved','sold','hold','unavailable'],
    virtual_tour_url TEXT,
    length_m NUMERIC(6,2) NULL,
    width_m NUMERIC(6,2) NULL,
    height_m NUMERIC(6,2) NULL,
    created_at,
    updated_at
  )`
- `unit_components (
    id,
    unit_id,
    component_type_code TEXT REFERENCES component_type_codes(code),
    name TEXT,
    length_m NUMERIC(6,2) NULL,
    width_m NUMERIC(6,2) NULL,
    height_m NUMERIC(6,2) NULL,
    area_sqm NUMERIC(8,2) NULL,
    notes TEXT,
    sort_order INT DEFAULT 0,
    created_at,
    updated_at
  )`
- `unit_price_history (id, unit_id, price, currency, effective_at, changed_by_user_id)`
- `unit_media (id, unit_id, media_type ENUM['image','pdf'], url, sort_order)`
- `unit_custom_field_values` (reuse custom field system)
- `unit_deals (unit_id, deal_id)`

---

## 4. API Surface (v1)
### Projects
- `GET/POST/PATCH/DELETE /v1/projects`
- `GET /v1/projects/:id` — with buildings/units

### Buildings
- `GET/POST/PATCH/DELETE /v1/buildings`
- `GET /v1/buildings/:id` — with units

### Units
- `GET/POST/PATCH/DELETE /v1/units`
- `GET /v1/units/:id`
- `PATCH /v1/units/:id/status`
- `POST /v1/units/:id/price`
- `POST /v1/units/:id/media`

### Unit Components
- `GET /v1/units/:id/components`
- `POST /v1/units/:id/components`
- `PATCH /v1/units/:id/components/:componentId`
- `DELETE /v1/units/:id/components/:componentId`

### Type Codes
- `GET/POST/PATCH/DELETE /v1/admin/unit-type-codes`
- `GET/POST/PATCH/DELETE /v1/admin/component-type-codes`

**Validation:** codes must be active and valid for tenant or global scope.

---

## 5. Permissions & Visibility
- Permissions: `project.manage`, `building.manage`, `unit.read`, `unit.update`, `unit.delete`, `unit.price.update`, `unit.status.update`, `unit.component.manage`, `code.manage`.
- Visibility: all tenant users unless restricted by group/project ownership.

---

## 6. Approvals Integration
- Approval triggers:
  - Price change > threshold.
  - Status change to “sold” without deal.
  - Reservation extension beyond policy.
- Approvals Core enforces rules before commit.

---

## 7. Notifications
- Unit reserved → notify owner & sales team.
- Unit sold → notify finance & marketing.
- Price change → notify watchers/subscribers.
- Status change via bulk update → notify affected deal owners.

---

## 8. Integrations & Touchpoints
- **Deals/Pipelines**: unit links to deal for reservation/sale tracking.
- **Marketing Campaigns**: available units feed into campaign targeting.
- **Map Overlay & Unit Mapping**: link unit polygons to records.
- **Reports & Analytics**: inventory velocity, availability rate, average price per sqm, breakdown by `unit_type_code` and `component_type_code`.

---

## 9. UI/UX
- Project/Building/Unit hierarchy view.
- Unit detail: attributes, coded type, dimensions, media, price history, linked deal.
- Components table: coded type, dimensions, notes.
- Filters: status, price range, bedrooms, size, project, unit type.
- Bulk edit: status and price (plan-gated if advanced).

---

## 10. Entitlements & Limits
- Features:
  - `units.customFields`
  - `units.bulkEdit`
  - `inventory.codeManagement`
- Limits:
  - `units.max`
- Enforced via Entitlements middleware.

---

## 11. Events & Analytics
- Emit: `unit.created`, `unit.updated`, `unit.deleted`, `unit.status.changed`, `unit.price.changed`, `unit.media.added`, `unit.component.added`.
- Analytics: inventory turnover, average days on market, price trends, size and area distribution by component type.

---

## 12. Acceptance Criteria
- Projects, buildings, units are tenant-scoped.
- Units have valid type codes and attributes; inactive codes rejected.
- Price changes recorded in history.
- Linked deals update unit status automatically on win/loss.
- Approval checks enforced for sensitive updates.
- Notifications sent for reservations, sales, and price changes.
- Components table supports coded type and dimensional data.

---

## 13. Open Decisions
1. Allow unit linked to multiple deals (waitlist)?
2. Price changes immediate or future-dated?
3. Bulk edit in MVP or gated?
4. Require media before marking “available”?
5. Virtual tour URL tenant-hosted or external only?
6. Require coded types for all key attributes in MVP or allow free text fallback?

---

# Phase 3 — Section 8: Map Overlay & Unit Mapping

**Scope:** Optional standalone module tightly integrated with **Section 7 — Property Inventory Management**.  
**Goal:** Visualize projects/buildings/floorplans on maps, draw/select **units** and (optionally) **unit components** as polygons, and keep geometry versions in sync with inventory records.

---

## 1. Overview & Goals
- Upload **map overlays** (site plans, floorplans) and align (georeference) them onto a base map.
- Draw and manage **polygons** for **units** and (optionally) **components** (rooms, bathrooms, balconies).
- Link shapes to inventory records (units / unit_components) using **coded types** for analytics.
- Provide selection → context actions (open unit, reserve, start deal).
- Keep **version history** and audit of geometry edits.
- Optional use of **PostGIS** for spatial queries; fallback to GeoJSON if disabled.

---

## 2. Scope
### MVP
- Upload raster overlays (JPG/PNG/SVG/PDF page) per **project** or **building**.
- Two alignment modes: **simple anchors** (scale/translate) or **georeference** (control points).
- Vector tools: polygon, rectangle; snap-to-edges; edit/merge/split.
- Link polygon ↔ **unit** (required) and optionally ↔ **unit_component** (room, balcony, etc.).
- Visibility by **layer** (e.g., floors) with toggle and opacity control.
- Selection panel with unit attributes (type code, status, price) and quick actions.
- Read-only public view link (optional) without sensitive fields.
- Export/import GeoJSON for backup/migration.

### Advanced
- Multi-page floorplans; automatic page→floor mapping.
- Topology checks (overlap, gaps) and **component/area validation** vs numeric dimensions.
- Distance/area measurement tools; auto-calc `area_sqm` for components.
- Pathfinding/nearest facilities (PostGIS).
- Real-time multi-editor presence & lock.
- Mobile-friendly markup + QR locate (scan a unit code → highlight polygon).

---

## 3. Data Model
> Uses PostgreSQL; enables **PostGIS** when available (recommended). Store geometries as `geometry(Polygon, SRID)`; fallback as GeoJSON text.

- `map_overlays (id, tenant_id, project_id?, building_id?, name, file_url, file_type, width_px, height_px, dpi, created_at)`
- `map_layers (id, overlay_id, name, kind ENUM['site','floor','custom'], floor_index INT NULL, order_index INT, is_visible BOOL DEFAULT true, opacity NUMERIC(3,2) DEFAULT 1.0)`
- `map_alignments (id, overlay_id, method ENUM['simple','georef'], control_points JSONB NULL, srid INT NULL, created_at, created_by_user_id)`
- `map_shapes (id, overlay_id, layer_id, kind ENUM['unit','component'], unit_id NULL, unit_component_id NULL, component_type_code TEXT NULL, unit_type_code TEXT NULL, geom GEOMETRY NULL, geom_geojson JSONB NULL, area_sqm NUMERIC(10,2) NULL, perimeter_m NUMERIC(12,2) NULL, label TEXT, version INT DEFAULT 1, is_active BOOL DEFAULT true, created_at, updated_at, updated_by_user_id)`
- `map_shape_versions (id, shape_id, version, geom, geom_geojson, area_sqm, perimeter_m, change_note TEXT, changed_by_user_id, changed_at)`
- `map_settings (tenant_id, default_srid INT, snap_tolerance_px INT, allow_public_views BOOL, require_coded_types BOOL)`

**Notes**
- `kind='unit'` must link `unit_id`.  
- `kind='component'` must link `unit_component_id` and **`component_type_code`** (coded dictionary from Section 7).  
- `unit_type_code` (redundant copy) is stored to **freeze analytics** at draw time; kept in sync by triggers when the unit’s code changes.

---

## 4. API Surface (v1)
### Overlays & Layers
- `GET/POST/PATCH/DELETE /v1/maps/overlays`
- `GET /v1/maps/overlays/:id` (includes layers, alignments summary)
- `POST /v1/maps/overlays/:id/align` — set `method` + control points/SRID
- `GET/POST/PATCH/DELETE /v1/maps/overlays/:id/layers`

### Shapes
- `GET /v1/maps/overlays/:id/shapes?layer=&kind=`
- `POST /v1/maps/overlays/:id/shapes` — create shape; body supports `geom_geojson` or WKT plus links
- `PATCH /v1/maps/shapes/:id` — edit geometry/links/label
- `DELETE /v1/maps/shapes/:id`
- `POST /v1/maps/shapes/:id/version` — save version with change note
- `POST /v1/maps/shapes/import` / `export` (GeoJSON)

### Linking & Validation
- `POST /v1/maps/shapes/:id/link-unit` `{ unit_id }`
- `POST /v1/maps/shapes/:id/link-component` `{ unit_component_id, component_type_code }`
- `POST /v1/maps/shapes/:id/validate` — run topology/area checks

### Public View (optional)
- `GET /v1/public/overlays/:publicId` (read-only; hides price/PII)

---

## 5. Permissions & RBAC
- `overlay.manage`, `layer.manage`, `shape.manage`, `shape.link`, `shape.validate`, `overlay.publish`
- Read access: `overlay.read`
- Respect **Groups/Role Trees** for project/building scoping (Section 3A).

---

## 6. Entitlements & Limits
- Features:
  - `maps.enabled`
  - `maps.componentShapes` (draw components, not just units)
  - `maps.publicViews`
- Limits:
  - `maps.overlays.max`, `maps.shapes.max` per tenant
- Enforced via Entitlements middleware (Section 1).

---

## 7. Integrations & Touchpoints
- **Inventory (Section 7):** shapes link to `units` and `unit_components`; store `unit_type_code` and `component_type_code` for analytics grouping by type.
- **Deals (Section 5):** clicking a unit shape → open the unit panel → start/attach deal; on deal win/loss, update shape badge (status color).
- **Marketing (later):** segment by geographic/plan context (e.g., “Available units on Floor 12 with sea view”).
- **Reports & Analytics:** total area mapped vs cataloged, component area distributions, heatmaps by unit type/status.

---

## 8. Geometry & Validation Rules
- **SRID:** default from `map_settings.default_srid` (e.g., 3857); allow custom per overlay.
- **Snapping:** enable edge/vertex snapping within `snap_tolerance_px` during edits.
- **Topology checks (advanced):**
  - No overlaps among shapes of the same layer.
  - Unit shapes contain all component shapes for that unit.
  - Area tolerance: `abs(component.area_sqm - (length_m*width_m)) <= epsilon` when both exist.
- **Versioning:** any geometry update creates a new row in `map_shape_versions` with change notes.

---

## 9. Notifications
- On shape create/update/delete → **Inbox + Email** to watchers (optional SMS/WA per preferences).
- On publish/unpublish public view → notify project/building owners.
- On validation failures → notify the editor with details and suggested fixes.

---

## 10. UI/UX
- **Overlay manager:** upload, align, set SRID, manage layers, visibility, opacity.
- **Drawing canvas:** polygon tools, snap, edit vertices, labels, area readout.
- **Inspector panel:** linked unit/component, coded types, status, price, dimensions summary.
- **Status legend:** colors for `available`, `reserved`, `sold`, `hold`, `unavailable`.
- **Search & jump:** by `unit.code`, `unit_type_code`, or component type.
- **Public share view** (optional): minimal UI with unit selection and contact CTA.

---

## 11. Acceptance Criteria (MVP)
- Upload overlays and align with at least **simple** and **georeference** methods.
- Draw, edit, and link polygons to **units**; optionally link **components** with **coded types**.
- Shapes list and render correctly by layer; selection opens unit panel.
- Versioning records edits; rollback to prior version possible by re-saving older geometry.
- Basic validation runs and reports errors.
- Entitlements and RBAC enforced; tenant isolation across all APIs.
- Notifications fire for edits/publish events; mirrored inbox/email as default.

---

## 12. Open Decisions
1. **PostGIS** required or optional? (Proposed: optional but recommended; auto-detect and enable if available.)
2. Public view: allow **unit status & price** or just availability badge?
3. Default SRID (Web Mercator 3857 vs WGS84 4326) and per-tenant override?
4. Should area be **authoritative** from geometry, or remain **advisory** vs numeric `size_sqm`? (Proposed: advisory with validation warnings.)

---

# Phase 3 — Section 9: Marketing Campaigns

---

## 1. Overview & Goals
- Create, manage, and track marketing campaigns targeting **contacts, leads, or properties**.
- Multi-channel delivery: Email (Brevo), optional SMS/WhatsApp (Infobip), in-app notifications.
- Support **audience segmentation** using coded attributes for consistency in analytics.
- Integrate with **Deals, Inventory, Map Overlay**, and **Reports** for targeting and tracking.

---

## 2. Scope
### MVP
- Campaign types: Email, SMS, WhatsApp, In-App Notification.
- Target audiences:
  - By contact/company filters (industry, location, type codes).
  - By lead filters (pipeline stage, source code).
  - By property filters (unit_type_code, project, status).
- Templates:
  - Email (HTML + variables).
  - SMS/WhatsApp (short text + variables).
  - In-app notifications.
- Scheduling: immediate or future send.
- Campaign performance tracking (opens, clicks, replies).
- Opt-in/opt-out management (per channel).
- Campaign status: draft, scheduled, sending, completed, archived.

### Advanced
- Multi-step drip campaigns.
- A/B testing (subject, content).
- Automated campaigns triggered by events (e.g., new listing in inventory).
- Audience lookalike building from top conversions.
- AI-assisted content generation.

---

## 3. Data Model
- `campaigns (id, tenant_id, name, type ENUM['email','sms','whatsapp','inapp'], status ENUM['draft','scheduled','sending','completed','archived'], scheduled_at, sent_at, completed_at, created_by_user_id, created_at, updated_at)`
- `campaign_audiences (id, campaign_id, audience_type ENUM['contact','lead','unit'], filter JSONB, segment_code TEXT NULL)`
- `campaign_templates (id, tenant_id, channel ENUM['email','sms','whatsapp','inapp'], name, content_html TEXT NULL, content_text TEXT NULL, variables JSONB NULL)`
- `campaign_sends (id, campaign_id, recipient_id, recipient_type ENUM['contact','lead','user'], channel, status ENUM['pending','sent','failed','delivered','opened','clicked'], sent_at, delivered_at, opened_at, clicked_at, error_message TEXT NULL)`
- `campaign_codes` (optional coded dictionary for campaign categories: e.g., `PROMO`, `NEWLISTING`, `EVENT`).

---

## 4. API Surface
- `GET/POST/PATCH/DELETE /v1/campaigns`
- `POST /v1/campaigns/:id/send`
- `GET/POST /v1/campaigns/:id/audience`
- `GET/POST /v1/campaigns/:id/templates`
- `GET /v1/campaigns/:id/performance`

---

## 5. Permissions
- `campaign.manage`, `campaign.send`, `campaign.view`.
- Campaign channel permissions: `campaign.email`, `campaign.sms`, `campaign.whatsapp`, `campaign.inapp`.

---

## 6. Approvals Integration
- Optionally require approval for campaigns over cost threshold or targeting more than N recipients.
- Multi-level approval if tied to budgets.

---

## 7. Notifications
- Notify campaign owner and team on send completion.
- Delivery errors trigger alerts.
- Campaign performance summaries sent post-campaign.

---

## 8. Integrations
- **Brevo**: Email transactional and marketing API.
- **Infobip**: SMS/WhatsApp optional integration.
- **Reports**: Conversion, ROI, click maps.
- **Deals**: Track deals created from campaign leads.
- **Inventory**: Auto-insert available properties into campaign templates.

---

## 9. UI/UX
- Campaign dashboard: filter by status, type, performance.
- Audience builder: multi-condition filters with code-based attributes.
- Template editor: WYSIWYG for email, text editor for SMS/WhatsApp, in-app notification composer.
- Performance charts: sends, deliveries, opens, clicks, conversions.

---

## 10. Entitlements
- Feature flags for channel access (`campaign.sms.enabled`, `campaign.whatsapp.enabled`).
- Max recipients per campaign limit for plan tiers.

---

## 11. Acceptance Criteria
- Campaign creation, targeting, sending, and tracking work as defined.
- Approvals enforced where enabled.
- Notifications and analytics work per channel.
- Codes used for categories and segment tracking.

---

## 12. Open Decisions
1. Should SMS/WhatsApp campaigns support attachments/media in MVP?
2. Default opt-out mechanism per channel?
3. Allow campaign duplication for faster re-use?
4. Multi-language campaign content support in MVP?

---

# Phase 3 — Section 10: Telemarketing & Phone Sales

---

## 1. Overview & Goals
- Manage **phone-based outreach** for cold, warm, and hot prospects.
- Support **inbound** and **outbound** calling workflows.
- **VoIP/PBX integration is optional** — module works fully in manual logging mode for MVP.
- Provide all **touch points** now for future integration with telephony providers (Infobip, Twilio, Asterisk, Cisco, etc.).
- Deliver **agent tools** for scripts, outcomes, and lead qualification.
- Feed results into **Leads** and **Deals** pipelines.

---

## 2. Scope
### MVP
- Contact list management (from Leads, Contacts, Campaigns, or custom imports).
- Call types: Cold, Warm, Active Customer.
- Manual call logging (always available).
- UI placeholders for telephony controls (click-to-call, recording playback) shown only if integration enabled.
- Call scripts (assignable by campaign, product, or segment).
- Outcome tracking (coded dictionary): No Answer, Left Voicemail, Call Back, Interested, Not Interested, Converted.
- Schedule follow-up calls and set reminders.
- Reporting: calls made, outcomes, conversion rate, talk time (if available).

### Advanced (Post-MVP)
- Predictive and power dialers.
- Call recording and playback (storage limits per plan).
- Supervisor whisper/barge-in.
- AI-assisted call summaries and sentiment analysis.
- Real-time agent performance dashboards.

---

## 3. Telephony Provider Adapter API (Future Integration)
We define a **common backend interface** for all providers:

```ts
interface TelephonyProvider {
  initiateCall(agentId: string, toNumber: string): Promise<CallSession>;
  endCall(sessionId: string): Promise<void>;
  getRecording(sessionId: string): Promise<RecordingFile>;
  getLiveStatus(sessionId: string): Promise<CallStatus>;
}
```

- **Adapter modules** implement this interface for each provider:
  - `telephony_infobip.ts`
  - `telephony_twilio.ts`
  - `telephony_asterisk.ts`
- Provider selection stored in `telephony_settings` table.
- If no provider configured:
  - Manual call logging only.
  - “Mark Call Started/Ended” replaces click-to-call.

---

## 4. Data Model
- `telemarketing_campaigns (id, tenant_id, name, type ENUM['cold','warm','active'], linked_marketing_campaign_id NULL, status ENUM['draft','active','completed'], created_at, updated_at)`
- `telemarketing_lists (id, campaign_id, name, source ENUM['contacts','leads','custom'], filter JSONB, created_at)`
- `telemarketing_calls (id, list_id, agent_user_id, contact_id NULL, lead_id NULL, phone_number, scheduled_at, started_at, ended_at, outcome_code TEXT, notes TEXT, recording_url TEXT NULL, talk_time_sec INT NULL, provider_session_id TEXT NULL)`
- `telemarketing_outcome_codes` (coded dictionary for call outcomes).
- `telephony_settings (tenant_id, provider_name, provider_config JSONB)`
- `telemarketing_scripts (id, tenant_id, name, content TEXT, assigned_to ENUM['campaign','list','agent'])`

---

## 5. API Surface
- `GET/POST/PATCH/DELETE /v1/telemarketing/campaigns`
- `GET/POST/PATCH/DELETE /v1/telemarketing/lists`
- `POST /v1/telemarketing/calls` (manual log or initiated via adapter)
- **Placeholders for future integration:**
  - `POST /v1/telephony/calls/initiate` → routes to configured adapter
  - `POST /v1/telephony/calls/end` → routes to adapter
  - `GET /v1/telephony/calls/:id/recording` → adapter or stored file
- `GET/POST/PATCH/DELETE /v1/telemarketing/scripts`

---

## 6. Permissions & RBAC
- `telemarketing.manage_campaigns`
- `telemarketing.manage_lists`
- `telemarketing.make_calls`
- `telemarketing.listen_recordings` (future integration only)
- Integrates with **Groups & Role Trees** for territory-based call assignments.

---

## 7. Approvals
- Optional approvals for:
  - Large outbound call campaigns
  - Accessing premium contact lists
- Supports flat or multi-level approvals by function.

---

## 8. Notifications
- Reminders for scheduled follow-ups.
- Alerts for missed SLAs (e.g., hot lead callback within 5 mins).
- Supervisor alerts for agent inactivity or dropped calls.

---

## 9. Integrations
- **Leads Management** → update lead status from call outcomes.
- **Deals/Pipelines** → auto-create deals for converted calls.
- **Marketing Campaigns** → import call lists from campaign audiences.
- **Reports** → integrate call conversion, agent productivity.

---

## 10. UI/UX
### Agent Dashboard
- Current call details
- Script panel
- Outcome buttons
- Call history

### Supervisor Dashboard
- Live agent status
- Call queue
- Listen/whisper/barge-in (future integration)

### Filters
- Outcomes, talk time, agent performance

---

## 11. Entitlements
- Feature flag: `telemarketing.enabled`
- Limits:
  - Max active campaigns
  - Max stored recordings (if enabled)
  - Concurrent calls (if enabled)

---

## 12. Acceptance Criteria
- Module works in manual mode by default.
- All UI, API, and DB touch points exist for future telephony integration.
- Calls and outcomes always linked to contacts/leads.
- Approvals, RBAC, and entitlements enforced.
- Reporting functional in both manual and integrated modes.

---

## 13. Open Decisions
1. Which telephony providers to prioritize for integration?
2. Should call recordings be stored in CRM or fetched live from provider?
3. Will predictive dialing be part of core product or an add-on?

---

# Phase 3 — Section 11: Reports & Analytics (with Modular Dashboard)

---

## 1. Overview & Goals
- Provide real-time and historical insights from all CRM modules.
- Centralize KPIs into a **modular, customizable dashboard**.
- Allow **per-user personalization**, **role-based templates**, and **tenant-wide shared dashboards**.
- Support drill-down from widgets to originating data views.
- Enable scheduled reporting via email/push.

---

## 2. Dashboard Architecture
### Widget Registry
- Catalog of pluggable widgets (KPI, Chart, Table, Map, Custom).
- Each widget defined by:
  - `type` (registry ID, e.g., `kpi.winRate`)
  - `version` (for safe upgrades)
  - `dataSource` (query ID + params)
  - `config` (JSON schema: filters, thresholds)
  - `refresh` (manual | interval | on-event)

### Layout Engine
- Responsive grid system.
- Drag-and-drop, resize, duplicate, hide/show widgets.
- Support multiple layouts per user.

### Personalization Scope
- **User dashboards** — private to the owner.
- **Role/Team templates** — starter layouts auto-applied on first login.
- **Tenant shared dashboards** — visible to all users with access.

---

## 3. Data & Performance
- **Query Layer**: Backend returns typed series/tables; client renders via React Query.
- **Caching**: Short TTL per widget; ETag headers for minimal reload.
- **Global Filters**:
  - Date range
  - Team/User
  - Pipeline
  - Project/Property
  - Campaign
- Widgets may override global filters.

- **Drill-down**: Every widget links to a filtered view/report.

- **Security**: RBAC + row-level filtering. Unauthorized widgets hidden or disabled.

---

## 4. Database Schema
- `dashboard_layouts (id, tenant_id, owner_user_id NULL, scope ENUM['user','role','tenant'], name, is_default BOOL, created_at)`
- `dashboard_widgets (id, layout_id, type, version, position JSONB, config JSONB, datasource JSONB, refresh JSONB)`
- `dashboard_templates (id, tenant_id, role_code, layout JSONB)`
- `dashboard_favorites (user_id, layout_id)`
- `dashboard_snapshots (id, layout_id, taken_at, image_url, metrics JSONB)`

---

## 5. API Endpoints
- `GET/POST/PATCH/DELETE /v1/dashboard/layouts`
- `POST /v1/dashboard/layouts/:id/widgets`
- `PATCH /v1/dashboard/layouts/:id/widgets/:widgetId`
- `DELETE /v1/dashboard/layouts/:id/widgets/:widgetId`
- `POST /v1/dashboard/apply-template`
- `GET /v1/dashboard/data/:queryId` (validated via Zod schema)
- `POST /v1/dashboard/snapshot/:layoutId`

---

## 6. Widgets (Initial Set)
### KPI
- Pipeline Value
- Win Rate
- Average Deal Size
- Calls Today
- Units Available
- Campaign CTR/Open Rate
- Tasks Due Today

### Charts
- Pipeline Funnel
- Leads by Source (coded)
- Deals by Stage Over Time
- Inventory Velocity
- Campaign Performance
- Telemarketing Outcomes

### Tables
- Top Deals Closing Soon
- Overdue Tasks
- Hot Leads
- Recent Unit Price Changes

### Map
- Available Units by Project/Floor (mini view from Map Overlay module)

### Custom
- Markdown Note
- Embedded External Link (allowlisted)
- Custom SQL/Metric (admin-only; parameterized for safety)

---

## 7. UX
- Drag-drop editing
- Resize & reorder widgets
- Save as personal, role, or tenant-wide
- Theme support (light/dark)
- Threshold colors & locale-specific number formats
- Role-based template suggestions on onboarding

---

## 8. Entitlements
- `dashboard.customize` — allow editing personal layouts.
- `dashboard.share` — allow publishing shared layouts.
- `dashboard.customSQL` — allow custom queries (admin-only).
- Plan-based limits: max widgets, max shared dashboards, snapshot scheduling.

---

## 9. Reporting Engine
### Standard Reports
- Prebuilt reports for Leads, Deals, Inventory, Marketing, Telemarketing, Billing.
- Export formats: PDF, Excel, CSV.

### Custom Reports
- Drag-and-drop builder with fields, filters, groupings, charts.
- Save as private, shared, or template.

### Scheduling
- Set frequency: Daily, Weekly, Monthly.
- Send via email or in-app notification with dashboard snapshot.

---

## 10. Integrations
- All modules publish metrics to Dashboard API.
- External BI tools (future integration).
- Notifications Core handles scheduled report/email delivery.

---

## 11. Acceptance Criteria
- Users can create and customize dashboards.
- Role/tenant templates work and can be applied to users.
- Global filters propagate; widget overrides apply correctly.
- Drill-down links preserve filter context.
- RBAC enforced per widget/data source.
- Snapshot and scheduled report delivery functional.

---

## 12. Open Decisions
1. Which widget types should be in MVP vs post-MVP?
2. Should dashboards support real-time streaming for live metrics?
3. Will tenant admins be able to lock certain widgets in shared layouts?

---

# Phase 5 — Section 12: User & Role Management (Admin UX)

> **Scope:** Tenant users and their lifecycle (invite → verify → onboard → manage).  
> **Depends on:** Section 1 (Tenant/Auth/RBAC & Sessions), Section 3A (Groups, Role Trees & Approvals), Section 2 (Notifications Core).  
> **Billing note:** Seat limits enforced via Entitlements; Stripe integration deferred to final phase.

---

## 1. Objectives
- Provide admins a complete UI to **create, invite, suspend, deactivate, and manage** tenant users.
- Manage **roles**, **groups**, and **role hierarchies** with clear permission visibility.
- Expose **entitlements** (plan features & limits) and allow **overrides** by user/group (where permitted).
- Centralize **security settings** (2FA, phone verification), **notification preferences**, and **audit trail**.
- Include **seat management** (limits & usage) without binding to Stripe yet.

---

## 2. User Lifecycle
- **Create / Invite**: via email; role(s) & group(s) pre-assigned.
- **Accept Invite**: verify email, set password, optional phone verify, optional 2FA.
- **Onboarding**: pick role template dashboard (Section 11), confirm notification preferences.
- **Active**: normal usage; can change own profile & preferences.
- **Suspend**: login blocked; sessions revoked; ownership reassignment optional.
- **Deactivate**: archived; cannot login; appears in audit references only.
- **Reinstate**: reverse suspend/deactivate with ownership review.

---

## 3. Data Model (Admin UX–facing)
(Reuses base tables from Sections 1 & 3A; adds admin metadata where needed.)

- `users (id, tenant_id, email, is_verified, status ENUM['active','suspended','deactivated'], created_at, last_login_at, ...)`
- `user_profiles (user_id, full_name, avatar_url, job_title_code?, department_code?, phone_e164, phone_verified_at, locale, timezone)`
- `roles, user_roles` — assignment UI
- `groups, group_members` — membership UI
- `role_hierarchy` — visual editor
- `entitlements_overrides_{tenant|group|user}` — overrides UI
- `notification_preferences (user_id, email_on_sms, email_on_whatsapp, inbox_on_all, marketing_email_opt_in, marketing_sms_opt_in, marketing_whatsapp_opt_in, locale)`
- `audit_logs` — filterable per user
- **Coded dictionaries (optional, extendable):**
  - `job_title_codes (tenant_id NULL, code, label, is_active)`
  - `department_codes (tenant_id NULL, code, label, is_active)`

---

## 4. Admin UI Surface
### Users
- List with search & filters: role, group, status, last login, verified phone/2FA.
- Actions: Invite, Create, Suspend, Deactivate, Reinstate, Resend Invite, Reset Password, Force Logout.
- Bulk actions: add to group, assign role, suspend, resend invite.
- Detail tabs:
  - **Profile**: name, email, job title (coded), department (coded), phone (verify)
  - **Security**: 2FA status (TOTP/SMS/WA), backup codes, recent sessions, IPs
  - **Access**: roles, groups, effective permissions (computed), effective entitlements (resolved view)
  - **Preferences**: notification preferences, locale, timezone
  - **Audit**: user-specific events timeline

### Roles & Hierarchies
- Roles list: create, edit, delete (guarded by usage).
- Visual **role tree** editor; prevents cycles; shows inherited permissions.
- Role details: permissions matrix with search; assign users.

### Groups
- Groups list & detail: add/remove members; assign default roles; entitlement overrides at group level.

### Entitlements
- Plan read-only (from Section 1); show usage (seats, sms/wa caps).
- Overrides editors: per tenant/group/user with precedence preview.
- Feature flags and limits searchable; audit changes.

### Seat Management (Stripe‑neutral)
- Show: **Seats used / Seats allowed** (from entitlements).
- Enforce on invite/create; soft nudge in UI with upgrade CTA (stub).
- Seat usage breakdown by role/group.

---

## 5. API Endpoints (Admin)
- `GET/POST/PATCH/DELETE /v1/admin/users`
- `POST /v1/admin/users/invite`
- `POST /v1/admin/users/:id/suspend` / `:id/reactivate` / `:id/deactivate`
- `POST /v1/admin/users/:id/force-logout`
- `GET/PUT /v1/admin/users/:id/preferences`
- `GET /v1/admin/users/:id/effective-permissions`
- `GET /v1/admin/users/:id/effective-entitlements`
- `GET/POST/DELETE /v1/admin/roles` ; `GET/POST/DELETE /v1/admin/roles/hierarchy`
- `GET/POST/DELETE /v1/admin/groups` ; `POST/DELETE /v1/admin/groups/:id/members`
- `GET/PUT /v1/admin/entitlements/overrides/{tenant|group|user}`
- `GET /v1/admin/seats`

---

## 6. Permissions (Admin Ops)
- `user.manage` (CRUD)
- `user.suspend`, `user.deactivate`, `user.reinstate`, `user.forceLogout`
- `roles.manage`, `roles.hierarchy.manage`
- `groups.manage`, `groups.members.manage`
- `entitlements.view`, `entitlements.overrides.manage`
- `seats.view`

---

## 7. Notifications (Admin)
- On invite sent, resend, and acceptance → owner/admin inbox + email (mirror to SMS/WA optional).
- On suspend/deactivate/reactivate → notify affected user via email + inbox.
- On seat limit reached → admin inbox + email (PLAN_REQUIRED error surfaced).

---

## 8. UX & DX Details
- **Effective Permissions/Entitlements** pane computes:
  - Role tree inheritance
  - Group-derived permissions
  - Overrides precedence (user > group > tenant plan)
- **Explainers** & audit: show *why* a permission/feature is granted or blocked.
- **Validation**: cannot delete role/group while assigned; prompts reassignment.
- **Accessibility**: keyboard navigation, focus states, semantic labels.
- **Internationalization**: locale-aware names, date/time formats, RTL support (e.g., Arabic).

---

## 9. Entitlements & Limits
- Features:
  - `rbac.roleHierarchy`
  - `rbac.groups`
  - `admin.entitlementsOverrides`
  - `admin.customDictionaries` (job/department codes)
- Limits:
  - `users.max` (seats)
  - `roles.max`, `groups.max` (optional)
- Enforcement via middleware from Section 1; UI guards present.

---

## 10. Events & Audit
- Emit: `user.invited`, `user.created`, `user.updated`, `user.suspended`, `user.deactivated`, `user.reinstated`, `user.forceLoggedOut`
- Entitlements: `entitlement.override.changed`
- RBAC: `role.created/updated/deleted`, `group.created/updated/deleted`, `role.hierarchy.changed`
- All actions record actor, IP, user-agent, and diffs where feasible.

---

## 11. Acceptance Criteria
- Admin can invite/create users respecting **seat limits**.
- Assign/remove roles and groups; role hierarchy editor prevents cycles.
- View **effective permissions/entitlements** accurately with precedence semantics.
- Suspend/deactivate/reactivate flows revoke sessions and notify.
- Phone verification & 2FA states visible and manageable.
- Notification preferences persist and are enforced by Notifications Core.
- All admin actions are audited and exportable.

---

## 12. Open Decisions
1. Do we allow **custom coded dictionaries** for job titles/departments in MVP or post‑MVP?
2. Should **seat roles** have different weights (e.g., view‑only not counted)?
3. Do we expose **team scoping** (territories) now or after core rollout?
4. Should deactivation force reassignment of owned records (contacts, deals)?

---

# Phase 5 — Section 13: Billing & Subscription Management (Touchpoints; Stripe Deferred)

> **Principle:** Provider-agnostic billing core now; actual provider adapters (Stripe, etc.) wired in the final phase.  
> **Scope:** Plans, seats, feature flags (entitlements), usage metering (incl. SMS/WhatsApp), invoicing placeholders, dunning hooks, audit.  
> **Depends on:** Section 1 (Entitlements Core), Section 2 (Notifications), Section 12 (Seats / User Admin).

---

## 1. Objectives
- Manage **plans**, **seats**, and **feature entitlements** across tenants.
- Track **usage-based metrics** (e.g., SMS/WhatsApp sends, extra seats, storage) for billing.
- Expose **admin UI** to view plan, limits, usage, and upcoming charges.
- Provide **API & webhooks touchpoints** for provider integration later (Stripe).
- Keep CRM functional with **Dev provider** until real billing is enabled.

---

## 2. Concepts
- **Plan**: feature bundle + limits (e.g., seats, SMS cap, dashboards).
- **Subscription**: tenant’s active plan with status & term dates.
- **Entitlements**: granular feature/limit switches enforced in runtime code (Section 1).
- **Usage Metering**: counters keyed by metric code & period (e.g., `sms.sent`, `whatsapp.sent`, `storage.gb`).
- **Charges (future)**: recurring (plan), overage (usage > cap), add-ons (extra seats, maps module).

---

## 3. Data Model (Provider-Agnostic)
- `plans (id, code UNIQUE, name, tier INT, description, is_active BOOL)`
- `plan_features (id, plan_id, feature_code, limit_value NUMERIC NULL)`
- `billing_products (id, code UNIQUE, label, kind ENUM['recurring','usage','addon'], is_active)`
- `tenant_subscription (tenant_id, plan_id, status ENUM['trial','active','past_due','canceled'], started_at, renews_at, canceled_at NULL, provider ENUM['dev','stripe' NULL], provider_customer_id NULL, provider_sub_id NULL)`
- `usage_counters (tenant_id, metric_code, value NUMERIC, period_start DATE, period_end DATE, last_increment_at)`  — reused by runtime
- `billing_usage_events (id, tenant_id, metric_code, quantity NUMERIC, occurred_at, source ENUM['system','api'], correlation_id, metadata JSONB)`
- `seat_ledger (id, tenant_id, user_id, action ENUM['assign','unassign'], occurred_at)`
- `invoices (id, tenant_id, period_start, period_end, total_amount NUMERIC, currency, status ENUM['draft','open','paid','void'], provider_invoice_id NULL, created_at)`
- `invoice_lines (id, invoice_id, product_code, description, quantity, unit_amount, amount, metadata JSONB)`
- `promo_codes (id, code UNIQUE, description, discount_pct NUMERIC NULL, discount_amount NUMERIC NULL, is_active, valid_from, valid_to)`
- `subscription_discounts (tenant_id, promo_code_id, applied_at, expires_at NULL)`
- `billing_webhook_logs (id, provider, event_type, raw JSONB, processed_at NULL, status_code, error_message NULL)`

**Notes**
- Keep **Dev provider** rows until Stripe is connected.  
- `usage_counters` is already used for enforcement; also drives billing later.

---

## 4. Metrics (Initial Set)
- `seats.used` (count of active users)
- `sms.sent` (from Section 2 outbox)
- `whatsapp.sent` (from Section 2 outbox)
- `email.sent` (optional informational; not billed by default)
- `maps.shapes.count`, `maps.overlays.count` (if you want tiering)
- `storage.gb` (optional; if you store media/recordings)
- `telephony.recording.hours` (future)

Each meter has:
- **Aggregation**: sum/count in `usage_counters` per monthly period.
- **Cap**: from `plan_features` (for enforcement) — overruns create **overage** lines later.

---

## 5. API Surface (v1)
### Tenant (Admin)
- `GET /v1/billing/plan` → current subscription, features, limits, usage summary
- `GET /v1/billing/usage?from=&to=&metric=` → detailed usage timeline
- `GET /v1/billing/invoices` / `GET /v1/billing/invoices/:id`
- `POST /v1/billing/apply-promo` `{ code }` (validates, attaches to subscription)
- `POST /v1/billing/seat/validate` → “what if” for adding users (shows overage/upgrade suggestion)
- `POST /v1/billing/preview` → returns **Dev** quote for next period (no provider call)

### Internal (Service-to-Service)
- `POST /v1/_billing/usage-event` `{ metric_code, quantity, occurred_at, correlation_id?, metadata? }`
- `POST /v1/_billing/recalculate` — recompute invoice draft for a period
- `POST /v1/_billing/rollover` — close period, open next (Dev provider)

### Provider Webhooks (stubs now)
- `POST /v1/webhooks/stripe` (deferred)
  - events: `invoice.created`, `invoice.finalized`, `invoice.paid`, `customer.subscription.updated`, `charge.failed`, etc.

---

## 6. Admin UI
- **Plan & Usage** page:
  - Current plan, renewal date, features/limits table.
  - Usage cards: seats, sms, whatsapp, storage.
  - Upgrade CTA (stub) with plan comparison modal.
- **Invoices** list:
  - Status badges (draft/open/paid).
  - Download (stub PDF) or view line items.
- **Promo**:
  - Apply/remove code; see effective discount.
- **Seat management** integration:
  - Invite/create user shows seat availability and any overage warnings.

---

## 7. Entitlements Sync
- On plan change, system updates **Entitlements Core** (Section 1).  
- Precedence remains: user/group overrides > plan defaults.  
- UI and API read from Entitlements; **Billing** is the source for defaults.

---

## 8. Usage Ingestion (Touchpoints Live Now)
- **Notifications Core** emits usage events for each SMS/WhatsApp send → increments `sms.sent` / `whatsapp.sent` (mirrored emails not billed by default).
- **User Admin** emits seat ledger events on invite/create/disable → recompute `seats.used` daily (or on write).
- **Maps**, **Telemarketing recordings** (future) emit their metrics when enabled.
- All usage flows through `billing_usage_events` → materialized into `usage_counters` by a daily job (plus near‑real‑time increments for UI).

---

## 9. Invoicing (Dev Provider Now)
- Monthly cycle: generate **draft invoice** for each tenant on period close.
- Draft lines example:
  - Plan fee (`product=PLAN:DEVPRO`)
  - Overage for `sms.sent` / `whatsapp.sent` (if enabled)
  - Add‑on seats beyond included count
  - Discounts from active promo
- Status transitions via Dev workflow; totals stored.  
- When Stripe is connected, invoice creation & payment capture move to provider adapter.

---

## 10. Provider Adapter (Stripe — Later)
Abstraction similar to telephony/SMS providers:
```ts
interface BillingProvider {
  ensureCustomer(tenant): Promise<{ customerId: string }>;
  ensureSubscription(tenant, plan): Promise<{ subscriptionId: string }>;
  createInvoice(tenant, lines): Promise<{ invoiceId: string, payUrl?: string }>;
  cancelSubscription(tenant): Promise<void>;
  applyPromo(tenant, code): Promise<void>;
}
```
- Adapter implementation: `billing_stripe.ts` (later).  
- Webhooks parser updates local records (`invoices`, `tenant_subscription`).

---

## 11. Dunning & Failure (Hooks Ready)
- Payment failure → set subscription `status='past_due'`, emit `billing.payment_failed` event, notify admins (inbox + email + optional SMS).
- Grace period configurable (e.g., 7 days). Post grace → restrict gated features (`PLAN_REQUIRED`) except admin panel & export.
- Restore access upon `invoice.paid` webhook (later).

---

## 12. Taxes & Currency (Deferred Details, Touchpoints Ready)
- Store currency per tenant (default from locale; editable by admin).
- Tax configuration (VAT/GST) metadata fields on tenant; pass-through to provider later.
- Prices stored as **minor units** (integer) to avoid rounding issues.

---

## 13. Permissions
- `billing.view`
- `billing.manage_promos`
- `billing.view_invoices`
- `billing.preview` (quotes)
- Provider admin restricted to system role (not tenant admin).

---

## 14. Events & Audit
- Emit: `billing.subscription.changed`, `billing.invoice.drafted`, `billing.invoice.finalized`, `billing.payment_failed`, `billing.promo.applied/removed`.
- Audit admin actions on plan/discount changes.

---

## 15. Acceptance Criteria (MVP Touchpoints)
- Tenants see their plan, features, and **live usage** for seats/SMS/WA.
- Usage events correctly aggregate into monthly `usage_counters`.
- Dev invoices are generated with accurate line items and totals.
- Entitlements reflect plan changes; overrides still take precedence.
- Notifications sent for payment failure (dev-simulated) and seat limit reached.
- Stripe adapter endpoints/webhooks exist as **stubs** (not active).

---

## 16. Open Decisions
1. Trial handling: 14 days with reduced caps vs full features?
2. Grace period length and blockade rules for `past_due` tenants.
3. Which metrics get billed in v1 (SMS/WA overage only, or also storage/maps)?
4. Price catalog: store locally now or defer entirely to provider?

---

# Phase 5 — Section 14: Notifications & Communications — System Behaviors, Preferences, Quiet Hours & Digests

> Builds on **Section 2 — Notifications Core**. This section defines **global behaviors**, **preferences**, **quiet hours**, **digests**, **governance**, and **observability** across channels (Email via Brevo, optional SMS/WhatsApp via Infobip, and Inbox). All provider integrations remain optional; touch points and abstractions are in place.

---

## 1. Objectives
- Standardize **when/what/how** we notify users and customers across modules.
- Provide **per-user** and **per-tenant** preferences, quiet hours, and digests.
- Enforce **consent**, **rate limits**, and **throttling** uniformly.
- Improve **delivery reliability** with retries, idempotency, and dead-letter queues.
- Establish **template governance**, **localization**, and **observability** for comms.

---

## 2. Scope (What this section adds beyond Section 2)
- **Preference hierarchy** (tenant policy → group defaults → user overrides).
- **Quiet hours** & **send windows** (channel-specific; time-zone aware).
- **Digests** & batching (reduce noise; periodic rollups).
- **Escalations** & reminders (SLA-aware; multi-channel with suppression).
- **Suppression lists** (bounces, complaints, STOP, unsubscribed).
- **Template governance** (versioning, approvals, localization strategy).
- **Sandbox / Test mode** (safe testing per tenant).
- **Observability** (metrics, tracing, searchable logs).
- **Compliance** (opt-out keywords, double opt-in, data retention windows).

---

## 3. Data Model Additions
- `notification_policies (tenant_id, key, value JSONB)`
  - Examples: `{"quietHours":{"start":"21:00","end":"08:00","channels":["sms","whatsapp"]}}`, `{"digest":{"dailyTime":"09:00"}}`
- `notification_preferences (user_id, prefs JSONB)`
  - Structure: `{ "email": {"marketing": true, "transactional": true}, "sms": {"marketing": false}, "whatsapp": {"marketing": false}, "inbox": {"all": true} }`
- `group_notification_defaults (group_id, prefs JSONB)`
- `suppression_list (tenant_id, channel, normalized_value, reason ENUM['bounce','complaint','manual','stop'], occurred_at)`
- `digest_subscriptions (id, tenant_id, user_id, kind ENUM['daily','weekly'], at_local TIME, timezone, enabled BOOL)`
- `digest_queue (id, tenant_id, user_id, digest_kind, payload JSONB, scheduled_at, status ENUM['queued','sent','failed'], error TEXT NULL)`
- `message_audit (id, outbox_id, policy_snapshot JSONB, preferences_snapshot JSONB, routed_channels TEXT[], created_at)`

> Reuses `messages_outbox`, `message_templates`, `channel_opt_ins`, `sms_stop_list` from Section 2.

---

## 4. Preference & Policy Resolution
**Order of precedence (most specific wins):**
1. **User preference overrides**
2. **Group defaults** (if user belongs to groups; union with most permissive per channel, unless tenant policy says otherwise)
3. **Tenant policy** (baseline; may be enforced for transactional mirroring and security alerts)
4. **Hard rules** (legal/compliance: e.g., STOP on SMS must always suppress marketing)

**Runtime resolution API**
- `GET /v1/notify/effective-preferences?userId=...`
- `POST /v1/notify/preview-routing` `{channel,intent:'transactional'|'marketing', to, template_code, payload}` → returns which channels will fire after applying preferences, consent, quiet hours, and caps.

---

## 5. Quiet Hours & Send Windows
- **Tenant quiet hours** per channel (e.g., SMS/WA 21:00–08:00 local).
- **User DND** window (personal quiet hours; UI toggle “Snooze until …”).
- **Time-zone aware**: use user’s profile timezone; fallback to tenant default.
- **Behavior**:
  - **Transactional**: queue to next allowed window unless marked “override” for security-critical (admin policy).
  - **Marketing**: always delayed to next window.
- Stored in `notification_policies` and `notification_preferences`.

---

## 6. Digests & Batching
**Goals**: reduce notification noise by bundling routine updates.

- **Digest kinds**: `daily.activity`, `daily.tasks`, `daily.deals`, `weekly.pipeline`, `inventory.changes`, `marketing.summary` (extensible).
- **Schedule**: per-user choice (daily/weekly) + time.
- **Aggregation jobs**: collect events → render digest templates → enqueue Inbox + Email (SMS/WA not used for digests).
- **Config**:
  - `digest_subscriptions` store schedule and enablement.
  - `digest_queue` stores pending sends and status.

**APIs**
- `GET/POST /v1/notify/digests` (list/subscribe)
- `POST /v1/notify/digests/preview` (show what would send now)

---

## 7. Escalations & Reminders
- **SLA-aware reminders** for approvals, tasks, hot leads callbacks.
- **Escalation policy**: after N minutes/hours without action, notify next role/group.
- **Multi-channel**:
  - Inbox + Email first
  - Optional SMS/WA if still pending (respect caps & quiet hours)
- Configured under `notification_policies` per domain (approvals/tasks/leads).

---

## 8. Suppression & Compliance
- **Automatic suppression** for bounces/complaints (Brevo webhooks) and **STOP** for SMS (keyword detection).
- **WhatsApp**: require opt-in (kept in `channel_opt_ins`); template approvals synced later.
- **Transactional vs Marketing**:
  - Transactional may bypass **marketing opt-out** but not legal STOP, per channel rules.
- **Double opt-in** (optional): send confirmation link/code before enabling marketing channels.
- **Data retention**: configurable purge windows for message logs & payloads (PII minimization).

---

## 9. Template Governance & Localization
- **Template versioning** with status: `draft` → `approved` → `retired`.
- **Approvals workflow** (internal, separate from WhatsApp provider approval).
- **Localization**:
  - Template families (same code across locales)
  - Fallback order: user locale → tenant default → `en`
- **Variables schema** validated at dispatch; missing variables → 422.
- **Test/Sandbox mode**:
  - Tenant-level setting: redirect outbound to test inbox/seeded emails; SMS/WA blocked or redirected.

**APIs**
- `POST /v1/notify/templates/:id/approve`
- `POST /v1/notify/templates/:id/localize`
- `POST /v1/notify/templates/:id/test-send`

---

## 10. Reliability: Retries, Idempotency, Dead Letters
- **Idempotency key** on dispatch bundles (already supported): `(tenant, template_code, to, payload_hash, schedule)`.
- **Backoff strategy**: exponential with jitter; max attempts per channel.
- **Dead-letter queue**: `outbox.status='failed'` with `error_code` and requeue option.
- **Partial failures**: mirrored channels independent; group correlation maintained.

---

## 11. Observability & Analytics
- **Metrics** (per tenant & global): queue depth, time-to-send, delivery rate, open/click (email), bounce/complaint, SMS/WA delivery/failure, inbox read rates.
- **Logs**: structured event logs with provider codes (PII minimized).
- **Dashboards** (Section 11 widgets):
  - “Comms Health” with per-channel gauges
  - “Failures by reason” table with drill-down
  - “Sends vs caps” trend
- **Traceability**: each send ties to module/action (lead assignment, approval, task reminder) via `meta.source` tags.

---

## 12. Permissions
- `notify.preferences.update.self`, `notify.preferences.update.user`
- `notify.policies.manage` (tenant admin)
- `notify.templates.manage`, `notify.templates.approve`
- `notify.suppression.read`, `notify.suppression.manage`
- `notify.digests.manage`

---

## 13. UI/UX
- **User Preferences**: channel toggles, quiet hours, DND, digest schedule.
- **Tenant Policies**: quiet hours, escalation policies, sandbox mode, default mirroring rules.
- **Template Manager**: list, edit, localize, preview, test-send, approvals.
- **Suppression Center**: view/remove suppressed entries (where legal).
- **Comms Health** dashboard widgets (Section 11).

---

## 14. Acceptance Criteria (MVP for this section)
- Effective routing respects preferences, tenant policies, caps, consent, and quiet hours.
- Digests can be subscribed, previewed, and delivered on schedule.
- Escalation/reminder logic fires and respects quiet hours & caps.
- Suppression from bounces/complaints/STOP enforced.
- Template approvals and localization workflows function.
- Sandbox/test mode redirects safely.
- Metrics and logs visible; failed sends recoverable with requeue.

---

## 15. Open Decisions
1. Default quiet hours for SMS/WA (proposed: 21:00–08:00 local)?
2. Enable double opt-in for marketing by default?
3. Include push notifications (APNS/FCM) in MVP or later?
4. Minimum data-retention period for message payloads/logs (e.g., 90 days)?

---

# Phase 0/UX — Section 15: App Shell & Navigation (Layout, Theming, Feature Flags)

---

## 1. Objectives
- Provide a **consistent, fast** shell for all modules (React 18 + Vite dashboard).
- **Role/plan aware** navigation with feature-flag toggles.
- **Modular, user-tunable** UI (theme, density, language, shortcuts).
- First‑class **global search**, **command palette**, and **notification inbox**.

---

## 2. Scope
### MVP
- Layout: Left nav (collapsible), top bar (search, quick actions, user menu), content area, right drawer (context/inbox).
- Nav items driven by RBAC + Entitlements (Section 1) + plan features.
- Theme system: light/dark + high‑contrast; density: comfortable/compact.
- i18n + RTL (Arabic) baked in; per‑user locale/timezone preference.
- Global search (contacts, companies, deals, units) with keyboard shortcut.
- Command palette (quick nav, create actions, “go to”).
- Notification center with per‑item actions (mark read, open related).
- Error boundaries + empty/loading states guidelines.
- Responsive (desktop-first, tablet OK; mobile read‑only minimum).

### Advanced
- PWA shell (offline read-only), background sync for drafts.
- Per‑user layout presets (pin favorite modules, reorder nav).
- Theming tokens export (design system API).
- Workspace tabs (multiple records open).
- In-app tour & onboarding checklists.

---

## 3. Architecture
- **Shell components**: `<AppLayout>`, `<SideNav>`, `<TopBar>`, `<RightPanel>`, `<CommandPalette>`, `<GlobalSearch>`, `<Inbox>`.
- **State**: Zustand for UI state; React Query for data; feature flags from Entitlements middleware.
- **Nav model**: array of items `{ id, label, icon, path, feature?, permission? }` resolved at runtime.
- **Lazy routes** with code-splitting; skeleton loaders.

---

## 4. Feature Flags & RBAC
- Hook examples: `useFeature('deals.multiPipelines')`, `usePermission('deal.create')`.
- Hide/disable nav & actions if feature/permission missing.
- Surface “request access/upgrade” CTA (stubbed to Billing).

---

## 5. Global Search & Command Palette
- Shortcut: `/` opens search; `⌘K / Ctrl+K` opens command palette.
- Search providers: Contacts, Companies, Deals, Units (extensible).
- Palette actions: create lead/deal/task, navigate to module, open settings.
- Result previews, quick open.

---

## 6. Notification Inbox (tie‑in to Sections 2 & 14)
- Right drawer or modal with tabs: **All**, **Approvals**, **Tasks**, **System**.
- Mirrored notifications (SMS/WA triggers also create Inbox + Email).
- Bulk mark‑read, filters, deep links.

---

## 7. Settings (per user)
- Theme, density, language, time format, notification prefs, quiet hours.
- Keyboard shortcuts reference.
- Personal dashboards (Section 11) quick switcher.

---

## 8. Accessibility & Internationalization
- WCAG 2.1 AA: focus states, ARIA landmarks, labeled controls.
- RTL support end‑to‑end; localized dates/numbers/units.
- High-contrast mode; avoid color-only semantics.

---

## 9. Performance & Telemetry
- Route‑level code splitting; data prefetch on hover.
- Error boundary + Sentry integration.
- Perf metrics: route TTI, widget load time, search latency.

---

## 10. Acceptance Criteria
- RBAC/feature‑aware nav works; hidden modules not accessible by URL.
- Global search returns cross‑module results with keyboard navigation.
- Command palette can navigate and create records.
- Notification center shows mirrored sends & approvals; actions work.
- Theme, density, language persist per user.
- Shell is responsive and accessible.

---

## 11. Open Decisions
1. Minimum mobile scope (read‑only vs limited edit)?
2. Which modules pinned by default in left nav?
3. Include PWA in v1 or later?
4. Allow per‑tenant branding (logo/colors) in MVP?

---

# Phase 5 — Section 16: Notifications & Communications UI

---

## 1. Objectives
- Provide a complete UI for **Inbox**, **Preferences**, **Quiet Hours**, **Digests**, **Suppression**, and **Templates**.
- Reflect the mirroring policy: **every SMS/WhatsApp → Inbox + Email** unless suppressed by policy/preferences.
- Surface delivery status, errors, and deep links to originating actions.

---

## 2. Scope
### MVP
- **Inbox** (per-user): list, filters, bulk mark-read, deep links (Approvals, Tasks, Deals, Units, Leads).
- **Preferences** (per-user): channel toggles, transactional vs marketing, quiet hours, language/locale.
- **Tenant Policies** (admin): global quiet hours, escalation rules, sandbox/test mode, mirroring defaults.
- **Digests**: subscribe/unsubscribe daily/weekly; preview next digest.
- **Template Manager** (admin): list, edit, versioning, localization, test-send.
- **Suppression Center** (admin): bounces/complaints/STOP; unblock where legal.
- Delivery status & basic analytics per message (sent/delivered/failed/opened/clicked).

### Advanced
- Per-user **routing rules** (e.g., if X type, only email; if after 21:00, inbox only).
- Multi-tenant **template libraries** with import/export.
- Inbox “bundling” (collapse related notifications).
- Push (APNS/FCM) channel UI if added later.

---

## 3. UI Surfaces
- **Inbox Drawer/Page**:
  - Tabs: All | Approvals | Tasks/Reminders | System | Marketing
  - Filters: unread, date range, source module, severity
  - Row shows: title, snippet, source (icon), time, status
  - Detail view: full message, related actions, mirrored channels
- **My Preferences**:
  - Channels (Email, SMS, WhatsApp, Inbox)
  - Marketing vs Transactional toggles
  - Quiet hours (local TZ) + “Snooze until …”
  - Digest schedule (daily/weekly, HH:MM)
- **Admin → Notification Policies**:
  - Mirroring defaults, quiet hours, escalation settings, sandbox/test mode
  - Routing preview tool
- **Admin → Templates**:
  - Grid with codes/families, locales, version status
  - Editors: Email HTML, SMS/WA text; variables schema; test-send
- **Admin → Suppression Center**:
  - Lists per channel; reasons (bounce, complaint, STOP, manual)
  - Search by email/E.164; history; unblock if allowed

---

## 4. Data Hooks
- Uses: `messages_outbox`, `notifications_inbox`, `notification_preferences`, `notification_policies`, `digest_subscriptions`, `suppression_list`, `message_templates`, `message_audit`.
- Respects template families/codes.

---

## 5. API Endpoints
- **Inbox**: `GET /v1/me/notifications`, `PATCH /v1/me/notifications/read-bulk`, `GET /v1/me/notifications/:id`
- **Preferences**: `GET/PUT /v1/me/notification-preferences`
- **Digests**: `GET/POST /v1/notify/digests`, `POST /v1/notify/digests/preview`
- **Policies (admin)**: `GET/PUT /v1/admin/notification-policies`
- **Templates (admin)**: `GET/POST/PATCH /v1/notify/templates`, `POST /v1/notify/templates/:id/test-send`, `POST /v1/notify/templates/:id/approve`, `POST /v1/notify/templates/:id/localize`
- **Suppression (admin)**: `GET/POST/DELETE /v1/notify/suppression`
- **Routing preview**: `POST /v1/notify/preview-routing`

---

## 6. Permissions
- Users: `notify.inbox.read.self`, `notify.preferences.update.self`
- Admins: `notify.policies.manage`, `notify.templates.manage`, `notify.templates.approve`, `notify.suppression.manage`, `notify.routing.preview`

---

## 7. UX Rules
- Respect **quiet hours**: show “Scheduled for HH:MM local” when delayed.
- Show **mirrored channels** in detail view (group by correlation id).
- Security notices highlighted; mirroring enforced by policy.
- Failed sends show provider reason; allow requeue if permitted.

---

## 8. Analytics (Section 11 widgets)
- Comms health: delivery rates by channel
- Failures by reason
- Sends vs caps
- Inbox read rate

---

## 9. Acceptance Criteria
- Inbox loads, filters, and links back to source; bulk mark-read works.
- Preferences & quiet hours affect routing in real time.
- Admin policy changes and routing preview function as expected.
- Template CRUD, versioning, localization, test-send work.
- Suppression center enforces STOP/bounce/complaint.
- Delivery statuses display correctly; mirrored channel groups visible.

---

## 10. Open Decisions
1. Default digest schedule (off vs daily 09:00 local)?
2. User override of tenant quiet hours for transactional messages?
3. Template approval workflow complexity (single vs multi-step)?
4. Default redaction of SMS/WA in UI for privacy?

---

# Section 17 — Developer Experience & CI/CD

---

## 1. Objectives
- Ensure the CRM is **fast to develop, test, and deploy**.
- Standardize workflows for frontend, backend, and shared packages in the monorepo.
- Automate builds, tests, deployments, and environment provisioning.
- Provide clear onboarding for new developers.

---

## 2. Scope
### MVP
- Monorepo structure with **Yarn/NPM workspaces** (frontend, backend, shared).
- Local dev setup scripts (`make dev`, `make db-up`).
- Preconfigured **linting** (ESLint, Prettier), **type-checking** (TypeScript strict mode), and **unit tests** (Vitest/Jest).
- Git hooks with **lint-staged** + **commitlint** + conventional commits.
- `.env` management with `.env.local`, `.env.development`, `.env.production`.
- GitHub Actions:
  - **Build & Lint** on PRs
  - **Run Tests** on PRs
  - **Preview Deployments** (Vercel for marketing site, DO App Platform for backend/CRM)
- Staging & Production environments with automatic deploys from `main` & `release` branches.

### Advanced
- **PR-based ephemeral environments** (Vercel preview + DO temporary DB).
- **Visual regression testing** (Playwright/Cypress).
- Performance budget checks (Lighthouse CI).
- **Sentry release tracking** & sourcemaps upload.
- Terraform or Pulumi for infra-as-code.
- Automated DB migrations in pipeline.

---

## 3. Architecture
- **Repo Layout**:
  ```
  /apps
    /crm-dashboard (React+Vite)
    /marketing-site (Next.js)
    /backend (Node+Express)
  /packages
    /shared-types
    /ui-components
    /services
  /infra
    /docker
    /terraform
  ```
- **Branch Strategy**:
  - `main`: staging deployments
  - `release/*`: production deployments
  - feature branches: PRs → staging
- **Versioning**: semantic-release for automated version bumps & changelogs.

---

## 4. Tooling
- **Local Dev**:
  - Docker for DB, Redis, Mailhog (Brevo SMTP testing)
  - `dev-proxy` for API routing in frontend
- **Testing**:
  - Unit: Vitest/Jest
  - E2E: Playwright
  - API: Supertest
- **Monitoring in CI**:
  - Test coverage thresholds enforced
  - Lint errors block merges

---

## 5. Environments
- **Local**: developer machines with Dockerized DBs.
- **Staging**: mirrors production config but uses sandbox keys for Stripe, Brevo, Infobip.
- **Production**: monitored with Sentry + Datadog, runs on DO App Platform + Managed PostgreSQL.

---

## 6. Permissions & Secrets
- GitHub Actions secrets for API keys.
- DO App Platform secrets for staging/prod.
- Git-ignored `.env` files for local.

---

## 7. Onboarding
- Single script (`make setup`) to clone, install, configure `.env`, start containers, run migrations, and seed demo data.
- Docs in `/docs` with architecture diagrams, API contracts, and coding standards.

---

## 8. Optional Sandbox Hooks (Stripe, Brevo, Infobip)
- CI/CD **staging jobs** include dummy API calls to Stripe, Brevo, and Infobip sandbox endpoints to validate keys and connectivity.
- Sandbox hooks **log but do not send** any real transactions.
- Placeholder test data ensures endpoints can handle expected payload structures.

---

## 9. Acceptance Criteria
- PR merges automatically deploy to correct environment.
- Failing tests/lints block merge.
- New developer can set up environment in <15 minutes.
- Automated DB migrations run in staging & production deploys.
- Sandbox API hooks run successfully in staging.

---

## 10. Open Decisions
1. Require **ephemeral DBs** for preview deployments?
2. Add **UI screenshot diffing** in MVP?
3. Require manual approval for production deploys?

---

# Section 18 — Security, Compliance & Audit Logging

---

## 1. Objectives
- Protect tenant and user data through **end-to-end security controls**.
- Meet compliance requirements for **multi-tenant SaaS**, including GDPR, local data protection laws (e.g., Egypt, Gulf states), and PCI-DSS (Stripe touchpoints).
- Provide a **complete audit trail** for sensitive actions, changes, and access events.

---

## 2. Scope
### MVP
- Multi-tenant isolation enforced at **DB layer** via `company_id` in all core tables.
- Role-based access control (RBAC) with fine-grained permissions.
- Secure authentication (JWT + refresh token rotation + optional 2FA with Google Authenticator, SMS, WhatsApp via Infobip).
- Email verification and mobile number verification at signup/invite.
- Strong password policies & hashing (Argon2/bcrypt).
- HTTPS/TLS enforced for all endpoints.
- Audit logging for:
  - Login attempts (success/failure)
  - Role/permission changes
  - Data creation, update, delete events for critical entities
  - Billing/subscription changes
- Basic **data retention policies** (archival/deletion on tenant deletion).

### Advanced
- Field-level encryption for sensitive PII (phone, ID numbers).
- Customer-managed encryption keys (CMEK).
- Automated anomaly detection on access patterns.
- Tamper-proof audit logs (write-once storage).
- Data residency enforcement (per-region storage).
- Configurable retention per tenant.

---

## 3. Authentication & Authorization
- **Auth flows**:
  - Email/password + JWT
  - Social logins (Google, Apple, LinkedIn — deferred)
  - Optional 2FA (TOTP via Google Authenticator, SMS, WhatsApp via Infobip)
- **Mobile number verification**:
  - At signup/invite, send OTP via SMS/WhatsApp (Infobip) before activating account.
  - Verification status stored in `user_profiles`.
- **Permissions enforcement**:
  - API middleware checks both RBAC & plan entitlements.
  - UI hides unauthorized features.
- **Approval workflows** (from Section 12): flat/multi-level, amount-based approvals.

---

## 4. Audit Logging Model
- **Tables**: `audit_logs`
  - `id`, `timestamp`, `user_id`, `company_id`, `action`, `entity_type`, `entity_id`, `before_data`, `after_data`, `ip_address`, `user_agent`
- **Triggers** for key tables to auto-log CRUD changes.
- **Immutable store** option for compliance.

---

## 5. Compliance Considerations
- **GDPR**:
  - Right to access/export data
  - Right to be forgotten
  - Data processing agreements
- **PCI-DSS**:
  - Stripe handles card data; ensure tokenization
- **Local laws (Egypt & Gulf states)**:
  - Data storage location & consent requirements
  - SMS/WhatsApp opt-in rules

---

## 6. Security Operations
- **Monitoring**: Sentry + Datadog for security-related errors/events.
- **Alerts**: unusual login patterns, failed logins > N threshold.
- **Penetration Testing**: scheduled before major releases.
- **Dependencies**: automated scanning via GitHub Dependabot.

---

## 7. API & UI Touchpoints
- API middleware for tenant isolation & RBAC.
- UI indicators for approval-required actions.
- **Infobip touchpoints**:
  - 2FA via SMS/WhatsApp as an alternative to TOTP.
  - Mobile number OTP verification during signup.
  - Mirroring policy: all 2FA and verification messages also sent to **user inbox** and **email**.
- Audit log viewer (admin-only, filter/search by date/user/action/entity).

---

## 8. Acceptance Criteria
- Tenant isolation enforced across all APIs.
- RBAC permissions correctly restrict UI and API access.
- All critical actions logged in `audit_logs`.
- 2FA (TOTP/SMS/WhatsApp) optional per tenant policy.
- Mobile number verification required where enabled.
- Audit logs exportable for compliance.
- Data deletion process verified for GDPR/local compliance.

---

## 9. Open Decisions
1. Should audit logs be tenant-visible or admin-only?
2. Enable CMEK in v1 or later?
3. Retention default for audit logs (1 year vs 7 years)?

---

# Section 19 — Performance, Scalability & Multi‑Tenant Optimization

> Objective: ensure responsive UX and predictable costs while supporting growth across many tenants. This section defines SLOs, architectural patterns, DB/indexing strategy, caching, rate limiting, isolation, and observability.

---

## 1. Service Level Objectives (SLOs)
- **API P95 latency**: ≤ 250 ms for read, ≤ 400 ms for write (under normal load).
- **Dashboard initial load (TTI)**: ≤ 3.0 s on standard network.
- **Background jobs**: 99% executed within scheduled window.
- **Availability**: 99.9% monthly (single-region MVP), multi-region later.
- **RPO/RTO**: RPO ≤ 15 min, RTO ≤ 60 min.

---

## 2. Multi‑Tenant Data Strategy
- **Schema**: shared schema with `tenant_id` on all rows; strict middleware checks.
- **Indexes**: composite `(tenant_id, ...)` on all frequently filtered columns; partial indexes for status flags.
- **Partitioning** (later): range/hash on `tenant_id` for very large tables (e.g., `messages_outbox`, `audit_logs`).
- **Connection pooling**: PgBouncer; max connections tuned per DO plan.
- **Row Level Security (optional)**: policy `WHERE tenant_id = current_setting('app.tenant_id')::uuid` in read replicas.

---

## 3. Query & Storage Patterns
- **CQRS-lite**: keep normalized OLTP; add **read models/materialized views** for heavy dashboards (e.g., pipeline summary, comms health).
- **Pagination**: keyset/seek pagination (by `(tenant_id, id desc)`) for large lists; avoid `OFFSET` for deep pages.
- **Search**: Postgres `tsvector` for basic search; optional OpenSearch later for fuzzy, faceted queries.
- **Files/Media**: DO Spaces + CDN; signed URLs; thumbnails generated async.
- **Cold data**: move old `audit_logs/messages_outbox` to cheaper storage after N days (configurable).

---

## 4. Caching & Performance
- **Cache tiers**:
  - In‑process LRU (short‑lived entity cache).
  - Redis for shared cache (sessions, feature flags, rate limits, idempotency keys).
  - Materialized views refreshed on schedule/event for dashboards.
- **HTTP**: ETag/Last‑Modified; client caching for GETs.
- **Frontend**: React Query caching & background revalidation; route‑level code‑split; prefetch on hover.
- **N+1**: repository helpers with batched loaders; limit default includes; measured via query logger.

---

## 5. Workloads & Async Jobs
- **Queue**: BullMQ / RabbitMQ for heavy jobs (imports, digest building, campaign sends).
- **Backpressure**: per‑tenant concurrency & rate caps to avoid noisy neighbors.
- **Idempotency**: all jobs carry `idempotency_key` (dedupe table).
- **Retries**: exponential backoff with max attempts; DLQ for poison messages.
- **Cron**: consolidated scheduler service; drift detection.

---

## 6. Rate Limiting & Fair Usage
- **Per‑tenant** and **per‑user** token buckets for API (global + route‑specific).
- **Campaign/telephony** send rates capped per plan; bursts smoothed by queue.
- **Abuse protection**: login and OTP endpoints with stricter caps; CAPTCHA after threshold (optional).

---

## 7. Isolation & Noisy Neighbor Controls
- **Quota enforcement** via Entitlements (rows, file sizes, API calls, active campaigns).
- **Per‑tenant queues** and **per‑tenant workers** for expensive flows.
- **Feature flags** to gate heavy features per plan or allowlist tenants.
- **Transactional fences**: long‑running operations off the request path.

---

## 8. Read Replicas & HA (Later Phase)
- Promote read‑intensive workloads (timeline, analytics) to **read replicas**.
- **Failover plan**: managed PG HA (DO) + app health checks; DSN rotated via config.
- **Backups**: point‑in‑time recovery; verify monthly restores to new env.
- **Multi‑region** (future): active‑passive; sticky tenants by region.

---

## 9. Frontend Performance
- Vite build with code‑splitting; lazy‑load heavy pages (Maps, Reports).
- Asset budgets; compress (Gzip/Brotli); image optimization with responsive sizes.
- Minimize hydration work; memoize heavy widgets; virtualized tables for long lists.
- Keep **global search** & **command palette** ultra‑fast with pre‑indexed datasets per tenant.

---

## 10. Observability & Ops
- **Metrics**: request rate/latency/error, queue depth/latency, DB connections, cache hit rate.
- **Tracing**: OpenTelemetry → Datadog; traces correlate API → DB → queue → provider calls.
- **Logging**: structured logs (Pino); tenant_id in context; log sampling under load.
- **SLO dashboards** & alerts: Apdex, P95 breaches, queue time > SLA, error spikes.
- **Feature usage analytics**: per widget/module to guide capacity planning.

---

## 11. Load & Chaos Testing
- **Synthetic load**: k6/Gatling scenarios per critical flows (login, list search, deal stage move, campaign enqueue).
- **Data scale models**: small/medium/large tenants; mixed traffic profile.
- **Chaos** (later): inject provider/API failures; verify retries/fallbacks and user messaging.

---

## 12. Cost Management
- Tag infra by environment & component; cost dashboards.
- Tune retention (logs, audit, outbox) per plan.
- CDN for static assets; cache headers reduce origin hits.
- Instance right‑sizing and autoscale policies with guardrails.

---

## 13. Security & Performance Intersection
- JWT size budget; compress cookies if needed.
- 2FA/OTP endpoints hardened with strict rate limits.
- Encryption at rest with minimal overhead (PG AES‑NI; S3 SSE).

---

## 14. Acceptance Criteria
- Meet SLOs under “medium tenant” load with 5x concurrency headroom.
- Key lists use **seek pagination**; no timeouts on deep scroll.
- Major flows (create lead/deal, move stage, reserve unit, send campaign) stay < P95 targets.
- Backpressure prevents any tenant from degrading others.
- Dashboards remain responsive via cached read models.
- Observability shows clean traces; alerts configured & tested.

---

## 15. Open Decisions
1. Adopt OpenSearch in v1 or defer until search demands exceed PG FTS?
2. Implement partitioning early for `audit_logs`/`messages_outbox` or wait for scale?
3. Minimum and maximum per‑tenant concurrency defaults for queues?
4. Multi‑region timeline (target quarter) and which regions first?

---

# Section 20 — QA Strategy & Test Plans

---

## 1. Objectives
- Ensure all CRM modules function correctly across web (and mobile clients if applicable) before release.
- Catch defects early via layered automated testing and targeted manual validation.
- Validate functional requirements, performance SLOs, security/compliance controls, and multi-tenant isolation.
- Provide regression confidence during rapid iteration.

---

## 2. Scope
- Modules: Leads, Contacts/Companies, Activities/Tasks, Deals/Pipelines, Property Inventory, Map Overlay, Marketing Campaigns, Telemarketing, Reports/Dashboard, User & Role Mgmt, Billing, Notifications (Core + UI), Security/Compliance, DX/CI.
- Cross-cutting: RBAC + Approvals, Entitlements, Notifications mirroring rules, Coded dictionaries, Provider adapters (deferred).
- Multi-tenant isolation and plan-based feature enforcement included.

---

## 3. Testing Types
### Automated
- **Unit** (Vitest/Jest): utilities, hooks, reducers, services.
- **Component/UI**: RTL + accessibility assertions.
- **Integration/API** (Supertest): endpoints, validation (Zod), DB with transactional tests.
- **E2E** (Playwright/Cypress): critical flows (login, create/edit, approvals, send campaign, reserve unit, convert lead).
- **Snapshot/Visual**: Storybook or Playwright screenshots for key pages.
- **Performance**: k6/Gatling scenarios for hot paths and background jobs.
- **Security**: OWASP ZAP scans; dependency audits (npm audit / Dependabot).

### Manual
- **Exploratory**: new/high-change areas.
- **Usability**: task completion studies.
- **Acceptance/UAT**: per module acceptance criteria.
- **Device/Browser**: Chrome, Safari, Firefox; desktop/tablet; RTL sanity for Arabic.

---

## 4. QA Environments
- **Local Dev**: `make test`, `make e2e-local` with Docker PG + Mailhog.
- **CI Staging**: PR-triggered pipelines (lint, unit, integration).
- **QA/Staging**: nightly E2E + sandbox integration hooks.
- **Production**: smoke checks post-deploy (read-only ops).

---

## 5. Test Data & Fixtures
- **Seed scripts**: tenants (small/medium/large), sample users/roles/groups, contacts/leads, pipelines, projects/units (with codes), maps overlay samples.
- **Factories**: generate realistic phone/email, E.164, WhatsApp opt-ins.
- **Anonymized real data** (optional) for perf tests.

---

## 6. Automation Pipeline (GitHub Actions)
- **On PR**:
  - Build + Lint
  - Typecheck
  - Unit + Integration
  - Minimal E2E smoke (happy path login + dashboard paint)
- **Nightly (staging)**:
  - Full E2E suite (multi-tenant + RBAC paths)
  - Visual regression pass
  - Performance baseline (k6 light run)
  - **Sandbox hooks** (see §8)
- **Release candidates**:
  - DB migration dry-run
  - UAT checklist auto-generated from acceptance criteria
  - Sentry release + sourcemaps (staging only)

---

## 7. Reporting & Defects
- JUnit/HTML artifacts uploaded on CI.
- Coverage (Codecov) with thresholds (backend 80%, frontend 80%).
- Defects in Jira/GitHub with repro, severity, tenant scope, screenshots/video.
- Flaky test quarantine label with auto-retry limited to 1x.

---

## 8. Sandbox Integration Hooks (from day one)
> Validate keys/config and payload contracts without hitting production providers.

- **Brevo (Email)**:
  - Health check: send to Mailhog or Brevo sandbox; assert 2xx + webhook echo.
  - Template render test: compile template with variables; lint for missing vars.
- **Infobip (SMS/WhatsApp)**:
  - Health check: POST to sandbox endpoints with test numbers; assert accepted + simulated delivery status.
  - Opt-in/STOP flow simulation; verify suppression list updates.
  - 2FA OTP flow simulation (no real delivery) with idempotency keys.
- **Stripe (Billing)** (deferred integration but hooked):
  - API key ping using test secret; create/cancel **test** customer + subscription in dry-run mode.
  - Webhook payload replay into `/v1/webhooks/stripe` stub; assert parsing + idempotency.

Artifacts: JSON transcripts stored as CI artifacts; redacted secrets.

---

## 9. Special Test Areas
- **Multi-tenant isolation**: cross-tenant access attempts must 403; DB row filters validated.
- **RBAC/Approvals**: flat/seq/parallel paths; threshold evaluation; escalations + SLAs (reminders respect quiet hours).
- **Notifications**: mirroring rule (every SMS/WA → Inbox + Email) verified with outbox + inbox assertions.
- **Inventory & Mapping**: shape↔unit linkage, coded types, area validation tolerance.
- **Security**: 2FA (TOTP/SMS/WA), mobile verification OTP, audit logs completeness.
- **Billing touchpoints**: usage counters increment on SMS/WA sends; Dev invoice draft generation.

---

## 10. Acceptance Criteria
- Coverage ≥ **80%** both frontend & backend.
- All critical paths have green E2E including:
  - Create→qualify lead→convert to contact/company→create deal
  - Move deal stage with approval gate
  - Reserve unit & price change with approval gate
  - Send campaign (email & optional SMS/WA), mirroring verified
  - Telemarketing call logged (manual mode), follow-up reminder sent
- No **critical (P0/P1)** defects open at release cut.
- Sandbox hooks pass (Brevo/Infobip/Stripe).

---

## 11. Open Decisions
1. Performance test cadence (per release vs quarterly)?
2. Nightly sandbox hooks always on, or opt-out via label?
3. UAT sign-off owner (product vs QA lead)?

---

# Section 21 — Release Management & Versioning

---

## 1. Objectives
- Establish a structured, predictable release cycle across all modules.
- Reduce risk via staged deployments and controlled validations.
- Maintain clear version history for traceability and rollback.

---

## 2. Release Types
- **Major** — breaking changes or large features/modules (e.g., Telemarketing).
- **Minor** — new features without breaking changes.
- **Patch** — bug fixes, small improvements, security updates.
- **Hotfix** — urgent production fix (post‑facto testing & notes required).

---

## 3. Versioning
- **Semantic Versioning**: `MAJOR.MINOR.PATCH` (e.g., `1.3.2`).
- Pre‑releases: `-beta`, `-rc.N`.
- Git tags + GitHub Releases for each production build (changelog attached).

---

## 4. Environments & Branching
- Flow: **Local Dev → CI/Staging → QA/Staging → Production**.
- Branch strategy:
  - Feature branches → PR to `develop` → auto‑deploy to staging.
  - Release branch `release/x.y` → final UAT → merge to `main`.
- Feature flags gate risky features (opt‑in tenants).

---

## 5. Release Cadence
- MVP phase: **bi‑weekly**.
- Post‑MVP: **monthly** minor; **quarterly** major.
- Hotfixes: as needed with approvals.

---

## 6. Deployment Process
1. **Code freeze** on `release/x.y`.
2. CI builds, runs tests; generate artifacts.
3. **UAT** passes on staging; sign‑off recorded.
4. Merge to `main` → tag `vx.y.z` → production deploy (GitHub Actions → DO App Platform/Vercel).
5. **Post‑deploy smoke tests** (synthetic checks).
6. Monitor Sentry/Datadog for 24h; rollback if SLOs breached.

---

## 7. Tenant Communications (Brevo/Infobip touchpoints)
- **What’s New** in‑app panel pulls from release notes feed.
- **Downtime/maintenance notices**:
  - Primary: **Email (Brevo)** to tenant admins.
  - Mirrored: **Inbox** for all users; optional **SMS/WhatsApp (Infobip)** for critical windows.
- **Beta feature invitations** via in‑app banner + email; opt‑in recorded per tenant.
- **Post‑release digest** summarizing changes & links to docs.
- All comms respect preferences/quiet hours (Sections 14 & 16) but **critical notices** may use policy override.

---

## 8. Rollback Strategy
- **DB**: transactional migrations; backup snapshot before deploy; rollback script tested.
- **App**: redeploy previous artifact; invalidate CDN caches where needed.
- Communication:
  - Internal incident note.
  - Tenant notice via in‑app banner + email (mirrored per policy).

---

## 9. Compliance & Audit
- Tag every release with:
  - Git SHA, build number, migration ids, feature flags toggled.
- Store release metadata in `release_log (id, version, sha, date, env, notes, toggles JSONB)`.
- Audit events: `release.deployed`, `release.rolled_back`, `maintenance.window.announced`.

---

## 10. Acceptance Criteria
- All prod releases are tagged, changelogged, and visible in the **What’s New** panel.
- UAT sign‑off recorded before production deploys (except hotfix with retro sign‑off).
- Rollback drills executed **quarterly**.
- Planned downtime notifications sent ≥72h in advance (critical ≥24h), mirrored per policy.
- Post‑deploy smoke tests green; monitoring shows no SLO breaches.

---

## 11. Open Decisions
1. Hotfix approver(s): engineering lead + product lead + incident commander?
2. Pre‑release opt‑in: allow tenant‑level beta channel?
3. Minimum notice window for non‑critical maintenance (48h vs 72h)?

---

# Appendix A — Integration API Contracts (Developer-Ready)

This appendix defines **provider-agnostic touchpoints** and concrete examples for **Brevo (email)**, **Infobip (SMS/WhatsApp)**, **Stripe (billing)**, **Google Authenticator (TOTP 2FA)**, and **Social Logins**.  
All integrations are **optional** initially; endpoints, request/response shapes, and webhooks are defined now so later work is plug‑and‑play.

> Conventions: JSON bodies are UTF‑8, timestamps are ISO‑8601 UTC, phone numbers are **E.164**. Idempotency keys are recommended on **all** create/send requests.

---

## 0) Shared Concepts (Applies to All Providers)
### Headers
- `X-Request-Id`: caller-provided correlation id (UUID).
- `Idempotency-Key`: deduplication token for creates/sends.
- `X-Tenant-Id`: tenant UUID (for our logs).

### Error Model (normalized locally)
```json
{
  "error": {
    "code": "PROVIDER_ERROR|INVALID_REQUEST|UNAUTHORIZED|RATE_LIMITED|TEMPORARY_FAILURE",
    "message": "Human readable message",
    "provider": "brevo|infobip|stripe|oauth",
    "providerCode": "string|null",
    "retryable": true
  }
}
```

### Webhooks → Local Receiver
- Local endpoints: `/v1/webhooks/brevo`, `/v1/webhooks/infobip`, `/v1/webhooks/stripe`, `/v1/webhooks/oauth`
- Validate signatures (provider-specific), store raw payload + headers.

---

## 1) Brevo — Transactional & Marketing Email

### 1.1 Send Transactional Email
**Provider API**: `POST https://api.brevo.com/v3/smtp/email`  
**Headers**: `api-key: {BREVO_API_KEY}`, `Content-Type: application/json`

**Request (example)**
```json
{
  "to": [{"email": "user@example.com", "name": "Sara Ali"}],
  "templateId": 42,
  "params": {
    "firstName": "Sara",
    "ctaUrl": "https://crm.example.com/verify?token=abc"
  },
  "replyTo": {"email": "support@yourcrm.com", "name": "Support"},
  "headers": {"X-Campaign-Code": "VERIFICATION"},
  "tags": ["transactional", "verification"]
}
```

**Response (example)**
```json
{
  "messageId": "<2025-08-09.abc123@brevo>",
  "messageIds": ["<2025-08-09.abc123@brevo>"]
}
```

### 1.2 Create & Send Marketing Campaign (simplified)
**Provider API**: `POST https://api.brevo.com/v3/emailCampaigns` then `POST /v3/emailCampaigns/{id}/send`

**Create Request (example)**
```json
{
  "name": "New Listings August",
  "subject": "Explore this week's top properties",
  "sender": {"name": "M3 Realty", "email": "marketing@m3realty.com"},
  "type": "classic",
  "htmlContent": "<html><body><h1>Top Picks</h1>{{content}}</body></html>",
  "recipients": {"listIds": [12345]},
  "inlineImageActivation": false,
  "mirrorActive": true
}
```

**Create Response (example)**
```json
{"id": 67890}
```

**Send Response (example)**
```json
{"message": "Campaign sent"}
```

### 1.3 Brevo Webhooks → `/v1/webhooks/brevo`
**Sample Events (email)**
```json
[
  {
    "event": "delivered",
    "email": "user@example.com",
    "messageId": "<2025-08-09.abc123@brevo>",
    "date": "2025-08-09T10:40:00Z"
  },
  {
    "event": "bounce",
    "email": "user@example.com",
    "reason": "mailbox_full",
    "messageId": "<2025-08-09.abc123@brevo>",
    "date": "2025-08-09T10:41:00Z"
  },
  {
    "event": "opened",
    "email": "user@example.com",
    "date": "2025-08-09T10:50:10Z",
    "messageId": "<2025-08-09.abc123@brevo>"
  }
]
```

---

## 2) Infobip — SMS & WhatsApp (Optional)

### 2.1 Send SMS (Advanced Text)
**Provider API**: `POST https://{baseDomain}/sms/2/text/advanced`  
**Headers**: `Authorization: App {INFOBIP_API_KEY}`, `Content-Type: application/json`

**Request (example)**
```json
{
  "messages": [
    {
      "from": "PropertyCRM",
      "destinations": [{"to": "+201000000001"}],
      "text": "Your OTP is 123456. Expires in 5 minutes.",
      "notifyUrl": "https://crm.example.com/v1/webhooks/infobip",
      "callbackData": "tenant=acme|purpose=otp"
    }
  ]
}
```

**Response (example)**
```json
{
  "messages": [
    {
      "to": "+201000000001",
      "status": {"groupId": 1, "groupName": "PENDING", "id": 26, "name": "MESSAGE_ACCEPTED"}
    }
  ]
}
```

### 2.2 Send WhatsApp Text
**Provider API**: `POST https://{baseDomain}/whatsapp/1/message/text`

**Request (example)**
```json
{
  "from": "447860099299",
  "to": "201000000001",
  "content": {
    "text": "Hi Sara, a new unit matches your preferences. View: https://crm.example.com/u/AB-1203"
  },
  "callbackData": "tenant=acme|purpose=campaign",
  "notifyUrl": "https://crm.example.com/v1/webhooks/infobip"
}
```

**Response (example)**
```json
{"messages": [{"messageId": "whatsapp-abc-123"}]}
```

### 2.3 Infobip Delivery Webhook → `/v1/webhooks/infobip`
**Sample Event (SMS)**
```json
[
  {
    "results": [
      {
        "messageId": "abc123",
        "to": "201000000001",
        "sentAt": "2025-08-09T10:40:00Z",
        "doneAt": "2025-08-09T10:40:10Z",
        "status": {"groupId": 3, "groupName": "DELIVERED", "id": 5, "name": "DELIVERED_TO_HANDSET"},
        "price": {"pricePerMessage": 0.035, "currency": "USD"}
      }
    ]
  }
]
```
> Upon send, **our system mirrors** to **Inbox + Email** (policy in Sections 14/16).

---

## 3) Stripe — Billing & Subscription (Deferred, Contracts Ready)

### 3.1 Create Test Customer & Subscription (example)
**API**: `POST https://api.stripe.com/v1/customers` then `POST /v1/subscriptions`

**Create Customer Request**
```x-www-form-urlencoded
name=ACME%20LLC&email=owner@acme.tld&metadata[tenantId]=70a3...
```

**Create Subscription Request**
```x-www-form-urlencoded
customer=cus_123456789&items[0][price]=price_abc123&metadata[tenantId]=70a3...
```

**Response (subscription excerpt)**
```json
{
  "id": "sub_12345",
  "status": "active",
  "items": {"data": [{"price": {"id": "price_abc123", "unit_amount": 4999, "currency": "usd"}}]}
}
```

### 3.2 Stripe Webhooks → `/v1/webhooks/stripe`
**Sample Events**
```json
{
  "type": "invoice.payment_succeeded",
  "data": {
    "object": {
      "id": "in_123",
      "customer": "cus_123",
      "amount_paid": 4999,
      "currency": "usd",
      "lines": {"data": []}
    }
  }
}
```
```json
{
  "type": "customer.subscription.updated",
  "data": {
    "object": {"id": "sub_12345", "status": "past_due", "cancel_at_period_end": false}
  }
}
```

---

## 4) Google Authenticator — TOTP 2FA

### 4.1 Issue TOTP Secret (local service)
**Endpoint**: `POST /v1/auth/2fa/totp/issue`  
**Response (example)**
```json
{
  "otpauthUrl": "otpauth://totp/M3CRM:owner@acme.tld?secret=JBSWY3DPEHPK3PXP&issuer=M3CRM",
  "secret": "JBSWY3DPEHPK3PXP",
  "qrPngDataUrl": "data:image/png;base64,iVBORw0..."
}
```

### 4.2 Verify TOTP Code
**Endpoint**: `POST /v1/auth/2fa/totp/verify`  
**Request**
```json
{"code": "123456"}
```
**Response**
```json
{"ok": true, "recoveryCodesIssued": true}
```

---

## 5) Social Logins — OAuth (Phase 3 Stubs)

### 5.1 Begin OAuth
**Endpoint**: `GET /v1/auth/oauth/start?provider=google|apple|linkedin&redirectUri=...`  
**Response**
```json
{"authUrl": "https://accounts.google.com/o/oauth2/v2/auth?...state=abc"}
```

### 5.2 Callback
**Endpoint**: `POST /v1/auth/oauth/callback`  
**Request**
```json
{"provider": "google", "code": "4/0A...","state":"abc"}
```
**Response**
```json
{"token": {"access":"jwt..","refresh":"rjwt.."}, "user":{"id":"u_1","email":"owner@acme.tld"}}
```

---

## 6) Local Abstractions (Provider Adapters)

### 6.1 Email/SMS/WA Send (our internal facade)
**Endpoint**: `POST /v1/notify/send`  
**Request**
```json
{
  "channel": "email|sms|whatsapp",
  "template": "VERIFICATION|APPROVAL_REMINDER|MARKETING_PROMO",
  "to": {"email": "user@example.com", "phone": "+201000000001"},
  "params": {"firstName": "Sara", "code": "123456"},
  "idempotencyKey": "4b0e2c90-..."
}
```
**Response**
```json
{"ok": true, "provider": "brevo|infobip", "providerMessageId": "abc123"}
```

### 6.2 Webhook Receipt Storage
- Store raw JSON + headers → `integration_webhook_logs`
- Normalize into `messages_outbox` / `billing_usage_events` (for SMS/WA cost metrics).

---

## 7) Error & Retry Patterns
- Retry **429/5xx** with exponential backoff and jitter.
- Circuit breaker per provider to avoid cascading failures.
- Dead‑letter queue for messages that repeatedly fail; manual requeue action.
- Idempotency enforced in our DB to prevent duplicate sends/charges.

---

## 8) Security & Compliance
- Secrets kept in provider‑specific vault/DO secrets; rotated regularly.
- PII minimization: redact message bodies in logs; store hashes when possible.
- Respect opt‑in/opt‑out: STOP for SMS; WhatsApp template approvals; email unsubscribe.
- All 2FA/OTP/verification messages **mirrored** to Inbox + Email as backup.

---

## 9) Contract Testing (CI Hooks)
- Staging CI sends **mock** requests to sandbox endpoints.
- Validates schemas and signature verification for webhooks.
- Stores transcripts as build artifacts (without secrets).

---

# Appendix B — Sandbox Test Hooks

This appendix describes **safe, non-production** test hooks and fixtures for validating provider connectivity, payload contracts, webhooks, and routing logic end‑to‑end. Hooks are used locally and in CI **without** sending real emails/SMS/charges.

> Conventions: Use tenant-scoped keys; NEVER run sandbox hooks with production secrets. All examples use placeholder values.

---

## 1) Environments & Secrets

### Environment Variables
```bash
# Shared
APP_ENV=staging
SANDBOX_MODE=true
TENANT_ID=00000000-0000-0000-0000-000000000000

# Brevo
BREVO_API_KEY=sbx_...

# Infobip
INFOBIP_API_KEY=sbx_...
INFOBIP_BASE_DOMAIN=api.sbx.infobip.com

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_PRICE_BASIC=price_test_basic_123

# Webhook secret samples
WEBHOOK_SECRET_BREVO=whsec_brevo_sbx
WEBHOOK_SECRET_INFOBIP=whsec_infobip_sbx
WEBHOOK_SECRET_STRIPE=whsec_stripe_sbx
```

### Test Identities
```text
EMAIL_TEST=user+test@m3labs.dev
SMS_TEST_E164=+201000000001
WA_TEST_E164=+201000000002
```

---

## 2) Local Mock Services

- **Mailhog / SMTP** for email loopback; accepts Brevo-simulated sends in local dev.
- **Webhook catcher**: `/dev/webhook-catcher` to capture and inspect payloads during local runs.
- **Stripe CLI** (optional) to replay test events against `/v1/webhooks/stripe`.

Docker compose (excerpt):
```yaml
services:
  mailhog:
    image: mailhog/mailhog
    ports: ["8025:8025", "1025:1025"]
  webhook-catcher:
    image: mendhak/http-https-echo
    ports: ["8085:80"]
```

---

## 3) Brevo Hooks

### 3.1 Transactional Email Health Check
```bash
curl -X POST https://api.brevo.com/v3/smtp/email   -H "api-key: $BREVO_API_KEY" -H "Content-Type: application/json"   -d '{
    "to":[{"email":"'"$EMAIL_TEST"'","name":"Sandbox"}],
    "subject":"[SBX] Health Check",
    "htmlContent":"<p>Sandbox ok</p>",
    "headers":{"X-Request-Id":"'"$GITHUB_RUN_ID"'","X-Tenant-Id":"'"$TENANT_ID"'"},
    "tags":["sbx","healthcheck"]
  }'
```
**Expected**: HTTP 2xx; log messageId; no real delivery in local; in staging, verify webhook receipt below.

### 3.2 Webhook Replay (Brevo → CRM)
```bash
curl -X POST https://crm.example.com/v1/webhooks/brevo   -H "X-Webhook-Signature: $WEBHOOK_SECRET_BREVO"   -H "Content-Type: application/json"   -d '[{"event":"delivered","email":"'"$EMAIL_TEST"'","messageId":"<sbx@brevo>","date":"2025-08-09T10:40:00Z"}]'
```
**Asserts**: outbox status → delivered; inbox mirroring present.

---

## 4) Infobip Hooks (SMS & WhatsApp)

### 4.1 Send SMS (Sandbox)
```bash
curl -X POST https://$INFOBIP_BASE_DOMAIN/sms/2/text/advanced   -H "Authorization: App $INFOBIP_API_KEY" -H "Content-Type: application/json"   -d '{
    "messages":[{
      "from":"M3CRM",
      "destinations":[{"to":"'"$SMS_TEST_E164"'"}],
      "text":"[SBX] OTP 123456 (ignore)",
      "notifyUrl":"https://crm.example.com/v1/webhooks/infobip",
      "callbackData":"tenant='"$TENANT_ID"'|purpose=healthcheck"
    }]
  }'
```
**Expected**: `MESSAGE_ACCEPTED`. Record `providerMessageId`.

### 4.2 WhatsApp Text (Sandbox)
```bash
curl -X POST https://$INFOBIP_BASE_DOMAIN/whatsapp/1/message/text   -H "Authorization: App $INFOBIP_API_KEY" -H "Content-Type: application/json"   -d '{
    "from":"447860099299",
    "to":"'"$WA_TEST_E164"'",
    "content":{"text":"[SBX] WhatsApp ping"},
    "notifyUrl":"https://crm.example.com/v1/webhooks/infobip",
    "callbackData":"tenant='"$TENANT_ID"'|purpose=healthcheck"
  }'
```
**Expected**: 2xx with `messageId`.

### 4.3 Delivery Webhook Replay
```bash
curl -X POST https://crm.example.com/v1/webhooks/infobip   -H "X-Webhook-Signature: $WEBHOOK_SECRET_INFOBIP"   -H "Content-Type: application/json"   -d '[{"results":[{"messageId":"sbx-1","to":"'"$SMS_TEST_E164"'","status":{"groupName":"DELIVERED","name":"DELIVERED_TO_HANDSET"},"price":{"pricePerMessage":0.01,"currency":"USD"}}]}]'
```
**Asserts**: outbox delivered; billing usage counter `sms.sent` incremented; **Inbox + Email** mirror created.

---

## 5) Stripe Hooks (Deferred Integration, Contracts Live)

### 5.1 Dry-Run Customer & Subscription
```bash
curl -X POST https://api.stripe.com/v1/customers   -u $STRIPE_API_KEY: -d "email=$EMAIL_TEST" -d "metadata[tenantId]=$TENANT_ID"
curl -X POST https://api.stripe.com/v1/subscriptions   -u $STRIPE_API_KEY: -d "customer=cus_test_123" -d "items[0][price]=$STRIPE_PRICE_BASIC"
```

### 5.2 Webhook Replay
```bash
stripe trigger invoice.payment_succeeded   --webhook-url https://crm.example.com/v1/webhooks/stripe
```
**Asserts**: invoice draft updated; subscription status reflected; events audited.

---

## 6) CI/CD Integration (GitHub Actions)

### 6.1 Job Snippet
```yaml
name: Sandbox Hooks
on:
  schedule: [{cron: "0 3 * * *"}] # nightly
  workflow_dispatch:
jobs:
  sandbox-hooks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Brevo Health
        run: bash scripts/hook_brevo_health.sh
        env: { BREVO_API_KEY: ${{ secrets.BREVO_API_KEY }}, EMAIL_TEST: ${{ vars.EMAIL_TEST }} }
      - name: Infobip SMS Health
        run: bash scripts/hook_infobip_sms.sh
        env:
          INFOBIP_API_KEY: ${{ secrets.INFOBIP_API_KEY }}
          INFOBIP_BASE_DOMAIN: ${{ vars.INFOBIP_BASE_DOMAIN }}
          SMS_TEST_E164: ${{ vars.SMS_TEST_E164 }}
      - name: Stripe Dry Run
        run: bash scripts/hook_stripe_dryrun.sh
        env: { STRIPE_API_KEY: ${{ secrets.STRIPE_API_KEY }} }
      - name: Collect Artifacts
        uses: actions/upload-artifact@v4
        with: { name: sandbox-transcripts, path: artifacts/sandbox/*.json }
```

### 6.2 Assertions & Gates
- Parse responses; assert 2xx statuses; schema-validate JSON.
- Fail job on non-2xx or missing fields.
- Redact secrets; attach transcript artifacts.

---

## 7) Failure Injection & Rate Limits

- **Transient failure simulation**: set `X-Inject-Failure: true` header in our staging proxy to return 500/429 for provider calls during tests.
- **Retry verification**: assert exponential backoff attempts and idempotency behavior.
- **Rate limit simulation**: staged burst sends to confirm queueing/backpressure and that **mirroring** still enqueues Inbox + Email.

---

## 8) Data Redaction & Privacy

- Do not store full message bodies in logs for SMS/WhatsApp; store hashes or first 20 chars.
- Mask emails in artifacts (`u***@example.com`).
- Purge webhook raw logs older than **7 days** in staging.

---

## 9) Checklist (Per Run)
- [ ] Brevo transactional send returns 2xx, webhook delivery stored.
- [ ] Infobip SMS/WA sends accepted; delivery webhook stored & usage counter incremented.
- [ ] Stripe dry-run endpoints reachable; webhook parsed by stub.
- [ ] Inbox + Email mirroring confirmed for SMS/WA sends.
- [ ] Artifacts uploaded; sensitive data redacted.
- [ ] All assertions passed; failures triaged with provider code and retry plan.

---

# Appendix C — Data Models & ERDs

This appendix consolidates the **multi-tenant PostgreSQL schema**, entity relationships, coded dictionaries, and **indexing guidance** used across M3CoreCRM. Diagrams are provided in **Mermaid ER** format for portability.

> Conventions:  
> - All tenant-scoped tables include `tenant_id UUID NOT NULL` (aka `company_id` in earlier sections).  
> - Primary keys are `UUID` (v4).  
> - Timestamps: `created_at`, `updated_at` (UTC).  
> - Soft-delete is avoided in MVP; use status flags where needed.  
> - Foreign keys always include `tenant_id` in composite indexes to optimize isolation queries.

---

## 1) Core & Identity

```mermaid
erDiagram
TENANTS ||--o{ USERS : "has many"
USERS ||--o{ USER_ROLES : "assigned"
ROLES ||--o{ USER_ROLES : ""
TENANTS ||--o{ GROUPS : ""
GROUPS ||--o{ GROUP_MEMBERS : ""
ROLES ||--o{ ROLE_PERMISSIONS : ""
USERS ||--o{ SESSIONS : ""
USERS ||--o{ AUDIT_LOGS : "actor"
TENANTS ||--o{ ENTITLEMENTS : ""
TENANTS ||--o{ ENTITLEMENTS_OVERRIDES : ""

TENANTS {
  uuid id PK
  text name
  text locale
  text timezone
  timestamp created_at
}
USERS {
  uuid id PK
  uuid tenant_id FK
  text email
  bool is_verified
  text status  // active|suspended|deactivated
  timestamp last_login_at
  timestamp created_at
}
USER_PROFILES {
  uuid user_id PK FK
  text full_name
  text phone_e164
  timestamp phone_verified_at
  text locale
  text timezone
}
ROLES {
  uuid id PK
  uuid tenant_id FK
  text code
  text name
}
USER_ROLES {
  uuid user_id FK
  uuid role_id FK
  uuid tenant_id FK
}
GROUPS {
  uuid id PK
  uuid tenant_id FK
  text name
}
GROUP_MEMBERS {
  uuid group_id FK
  uuid user_id FK
  uuid tenant_id FK
}
ROLE_PERMISSIONS {
  uuid role_id FK
  text permission
}
SESSIONS {
  uuid id PK
  uuid user_id FK
  text refresh_token_hash
  timestamp created_at
  timestamp revoked_at
}
AUDIT_LOGS {
  uuid id PK
  uuid tenant_id FK
  uuid user_id
  text action
  text entity_type
  uuid entity_id
  jsonb before_data
  jsonb after_data
  inet ip_address
  text user_agent
  timestamp created_at
}
ENTITLEMENTS {
  uuid tenant_id PK
  jsonb features  // {feature_code: true/false}
  jsonb limits    // {metric: numeric}
}
ENTITLEMENTS_OVERRIDES {
  uuid id PK
  uuid tenant_id FK
  text scope  // tenant|group|user
  uuid scope_id
  jsonb features
  jsonb limits
}
```

**Indexes**
- `users (tenant_id, email)` unique per tenant.  
- `audit_logs (tenant_id, created_at DESC)`; consider monthly partitions.  
- `user_roles (tenant_id, user_id)`; `group_members (tenant_id, group_id, user_id)`.

---

## 2) CRM Entities — Leads, Contacts, Companies, Deals, Activities

```mermaid
erDiagram
TENANTS ||--o{ COMPANIES : ""
COMPANIES ||--o{ CONTACTS : ""
TENANTS ||--o{ LEADS : ""
TENANTS ||--o{ DEAL_PIPELINES : ""
DEAL_PIPELINES ||--o{ DEAL_STAGES : ""
DEAL_PIPELINES ||--o{ DEALS : ""
CONTACTS ||--o{ ACTIVITIES : ""
DEALS ||--o{ ACTIVITIES : ""

COMPANIES {
  uuid id PK
  uuid tenant_id FK
  text name
  text industry_code
  text city
  text country
  timestamp created_at
  timestamp updated_at
}
CONTACTS {
  uuid id PK
  uuid tenant_id FK
  uuid company_id FK
  text full_name
  text email
  text phone_e164
  text role_title_code
  timestamp created_at
  timestamp updated_at
}
LEADS {
  uuid id PK
  uuid tenant_id FK
  text source_code
  text status_code   // new|qualified|disqualified|converted (coded)
  uuid contact_id
  uuid company_id
  jsonb attributes
  timestamp created_at
  timestamp updated_at
}
DEAL_PIPELINES {
  uuid id PK
  uuid tenant_id FK
  text name
}
DEAL_STAGES {
  uuid id PK
  uuid pipeline_id FK
  uuid tenant_id FK
  text code
  int order_index
}
DEALS {
  uuid id PK
  uuid tenant_id FK
  uuid pipeline_id FK
  uuid stage_id FK
  uuid contact_id
  uuid company_id
  numeric amount
  text currency
  text status  // open|won|lost
  timestamp expected_close_at
  timestamp created_at
  timestamp updated_at
}
ACTIVITIES {
  uuid id PK
  uuid tenant_id FK
  text type_code  // call|email|meeting|task
  uuid contact_id
  uuid company_id
  uuid deal_id
  uuid owner_user_id
  text subject
  text description
  timestamp due_at
  text status  // open|done|cancelled
  timestamp created_at
  timestamp updated_at
}
```

**Indexes**
- `contacts (tenant_id, email)`; `contacts (tenant_id, phone_e164)`.
- `leads (tenant_id, status_code, created_at DESC)`.
- `deals (tenant_id, pipeline_id, stage_id, updated_at DESC)` seek pagination.  
- `activities (tenant_id, owner_user_id, due_at)`.

---

## 3) Property Inventory & Mapping

```mermaid
erDiagram
TENANTS ||--o{ PROJECTS : ""
PROJECTS ||--o{ BUILDINGS : ""
BUILDINGS ||--o{ UNITS : ""
UNITS ||--o{ UNIT_COMPONENTS : ""
UNITS ||--o{ UNIT_MEDIA : ""
UNITS ||--o{ UNIT_PRICE_HISTORY : ""
UNITS ||--o{ UNIT_DEALS : ""

UNIT_TYPE_CODES ||--o{ UNITS : ""
COMPONENT_TYPE_CODES ||--o{ UNIT_COMPONENTS : ""

PROJECTS {
  uuid id PK
  uuid tenant_id FK
  text name
  text location
  text description
  timestamp created_at
}
BUILDINGS {
  uuid id PK
  uuid project_id FK
  uuid tenant_id FK
  text name
  int floors
  timestamp created_at
}
UNITS {
  uuid id PK
  uuid tenant_id FK
  uuid building_id FK
  text code
  int floor
  text unit_type_code FK
  numeric size_sqm
  int bedrooms
  int bathrooms
  text view
  numeric price
  text currency
  text status  // available|reserved|sold|hold|unavailable
  text virtual_tour_url
  numeric length_m
  numeric width_m
  numeric height_m
  timestamp created_at
  timestamp updated_at
}
UNIT_COMPONENTS {
  uuid id PK
  uuid tenant_id FK
  uuid unit_id FK
  text component_type_code FK
  text name
  numeric length_m
  numeric width_m
  numeric height_m
  numeric area_sqm
  int sort_order
  timestamp created_at
  timestamp updated_at
}
UNIT_MEDIA {
  uuid id PK
  uuid tenant_id FK
  uuid unit_id FK
  text media_type // image|pdf
  text url
  int sort_order
}
UNIT_PRICE_HISTORY {
  uuid id PK
  uuid tenant_id FK
  uuid unit_id FK
  numeric price
  text currency
  timestamp effective_at
  uuid changed_by_user_id
}
UNIT_DEALS {
  uuid unit_id FK
  uuid deal_id FK
  uuid tenant_id FK
}
UNIT_TYPE_CODES {
  uuid id PK
  uuid tenant_id  // NULL means global
  text code
  text label
  bool is_active
}
COMPONENT_TYPE_CODES {
  uuid id PK
  uuid tenant_id  // NULL means global
  text code
  text label
  bool is_active
}
```

### Map Overlay & Unit Mapping

```mermaid
erDiagram
TENANTS ||--o{ MAP_OVERLAYS : ""
MAP_OVERLAYS ||--o{ MAP_LAYERS : ""
MAP_OVERLAYS ||--o{ MAP_SHAPES : ""
MAP_SHAPES ||--o{ MAP_SHAPE_VERSIONS : ""

MAP_OVERLAYS {
  uuid id PK
  uuid tenant_id FK
  uuid project_id
  uuid building_id
  text name
  text file_url
  text file_type
  int width_px
  int height_px
  int dpi
  timestamp created_at
}
MAP_LAYERS {
  uuid id PK
  uuid overlay_id FK
  text name
  text kind // site|floor|custom
  int floor_index
  int order_index
  bool is_visible
  numeric opacity
}
MAP_SHAPES {
  uuid id PK
  uuid overlay_id FK
  uuid tenant_id FK
  uuid layer_id FK
  text kind // unit|component
  uuid unit_id
  uuid unit_component_id
  text unit_type_code
  text component_type_code
  geometry geom
  jsonb geom_geojson
  numeric area_sqm
  numeric perimeter_m
  text label
  int version
  bool is_active
  timestamp created_at
  timestamp updated_at
  uuid updated_by_user_id
}
MAP_SHAPE_VERSIONS {
  uuid id PK
  uuid shape_id FK
  int version
  geometry geom
  jsonb geom_geojson
  numeric area_sqm
  numeric perimeter_m
  text change_note
  uuid changed_by_user_id
  timestamp changed_at
}
```

**Indexes**
- `units (tenant_id, status, unit_type_code, price)`; GIN on `geom_geojson` if PostGIS disabled.  
- `map_shapes (overlay_id, layer_id, kind, is_active)`; GiST index on `geom` when PostGIS enabled.

---

## 4) Marketing Campaigns & Telemarketing

```mermaid
erDiagram
TENANTS ||--o{ CAMPAIGNS : ""
CAMPAIGNS ||--o{ CAMPAIGN_AUDIENCES : ""
CAMPAIGNS ||--o{ CAMPAIGN_TEMPLATES : ""
CAMPAIGNS ||--o{ CAMPAIGN_SENDS : ""

TENANTS ||--o{ TELEMARKETING_CAMPAIGNS : ""
TELEMARKETING_CAMPAIGNS ||--o{ TELEMARKETING_LISTS : ""
TELEMARKETING_LISTS ||--o{ TELEMARKETING_CALLS : ""
TELEMARKETING_CAMPAIGNS ||--o{ TELEMARKETING_SCRIPTS : ""

CAMPAIGNS {
  uuid id PK
  uuid tenant_id FK
  text name
  text type // email|sms|whatsapp|inapp
  text status // draft|scheduled|sending|completed|archived
  timestamp scheduled_at
  timestamp sent_at
  timestamp completed_at
  uuid created_by_user_id
  timestamp created_at
}
CAMPAIGN_AUDIENCES {
  uuid id PK
  uuid campaign_id FK
  uuid tenant_id FK
  text audience_type // contact|lead|unit
  jsonb filter
  text segment_code
}
CAMPAIGN_TEMPLATES {
  uuid id PK
  uuid tenant_id FK
  text channel // email|sms|whatsapp|inapp
  text name
  text content_html
  text content_text
  jsonb variables
}
CAMPAIGN_SENDS {
  uuid id PK
  uuid tenant_id FK
  uuid campaign_id FK
  uuid recipient_id
  text recipient_type // contact|lead|user
  text channel
  text status // pending|sent|failed|delivered|opened|clicked
  timestamp sent_at
  timestamp delivered_at
  timestamp opened_at
  timestamp clicked_at
  text error_message
}
TELEMARKETING_CAMPAIGNS {
  uuid id PK
  uuid tenant_id FK
  text name
  text type // cold|warm|active
  uuid linked_marketing_campaign_id
  text status // draft|active|completed
  timestamp created_at
}
TELEMARKETING_LISTS {
  uuid id PK
  uuid tenant_id FK
  uuid campaign_id FK
  text source // contacts|leads|custom
  jsonb filter
  timestamp created_at
}
TELEMARKETING_CALLS {
  uuid id PK
  uuid tenant_id FK
  uuid list_id FK
  uuid agent_user_id
  uuid contact_id
  uuid lead_id
  text phone_number
  timestamp scheduled_at
  timestamp started_at
  timestamp ended_at
  text outcome_code
  text notes
  text recording_url
  int talk_time_sec
  text provider_session_id
}
TELEMARKETING_SCRIPTS {
  uuid id PK
  uuid tenant_id FK
  text name
  text content
  text assigned_to // campaign|list|agent
}
```

**Indexes**
- `campaign_sends (tenant_id, campaign_id, status, sent_at)`; GIN on `variables` if querying.  
- `telemarketing_calls (tenant_id, agent_user_id, scheduled_at)`; `telemarketing_calls (tenant_id, outcome_code)`.

---

## 5) Notifications Core & UI

```mermaid
erDiagram
TENANTS ||--o{ MESSAGE_TEMPLATES : ""
TENANTS ||--o{ MESSAGES_OUTBOX : ""
USERS ||--o{ NOTIFICATIONS_INBOX : ""

MESSAGE_TEMPLATES {
  uuid id PK
  uuid tenant_id FK
  text code
  text channel // email|sms|whatsapp|inapp
  text locale
  text version_status // draft|approved|retired
  text subject
  text html_body
  text text_body
  jsonb variables_schema
  timestamp created_at
  timestamp updated_at
}
MESSAGES_OUTBOX {
  uuid id PK
  uuid tenant_id FK
  text channel
  text to_email
  text to_phone_e164
  text template_code
  jsonb payload
  text status // pending|sent|failed|delivered|opened|clicked
  text provider
  text provider_message_id
  text idempotency_key
  timestamp queued_at
  timestamp sent_at
  timestamp delivered_at
  text error_code
}
NOTIFICATIONS_INBOX {
  uuid id PK
  uuid tenant_id FK
  uuid user_id FK
  text category // approvals|tasks|system|marketing
  text title
  text body
  jsonb meta
  bool is_read
  timestamp created_at
}
SUPPRESSION_LIST {
  uuid id PK
  uuid tenant_id FK
  text channel
  text normalized_value
  text reason // bounce|complaint|manual|stop
  timestamp occurred_at
}
NOTIFICATION_PREFERENCES {
  uuid user_id PK
  jsonb prefs
}
NOTIFICATION_POLICIES {
  uuid tenant_id PK
  jsonb value
}
```

**Indexes**
- `messages_outbox (tenant_id, status, queued_at DESC)`; `idempotency_key` unique where not null.  
- `notifications_inbox (tenant_id, user_id, is_read, created_at DESC)`.

---

## 6) Billing (Provider-Agnostic Touchpoints)

```mermaid
erDiagram
TENANTS ||--o{ TENANT_SUBSCRIPTION : ""
TENANTS ||--o{ USAGE_COUNTERS : ""
TENANTS ||--o{ INVOICES : ""
INVOICES ||--o{ INVOICE_LINES : ""

PLANS ||--o{ PLAN_FEATURES : ""

PLANS {
  uuid id PK
  text code
  text name
  int tier
  bool is_active
}
PLAN_FEATURES {
  uuid id PK
  uuid plan_id FK
  text feature_code
  numeric limit_value
}
TENANT_SUBSCRIPTION {
  uuid tenant_id PK
  uuid plan_id FK
  text status // trial|active|past_due|canceled
  timestamp started_at
  timestamp renews_at
  text provider // dev|stripe
  text provider_customer_id
  text provider_sub_id
}
USAGE_COUNTERS {
  uuid id PK
  uuid tenant_id FK
  text metric_code // sms.sent|whatsapp.sent|seats.used
  numeric value
  date period_start
  date period_end
  timestamp last_increment_at
}
INVOICES {
  uuid id PK
  uuid tenant_id FK
  date period_start
  date period_end
  numeric total_amount
  text currency
  text status // draft|open|paid|void
  text provider_invoice_id
  timestamp created_at
}
INVOICE_LINES {
  uuid id PK
  uuid invoice_id FK
  text product_code
  text description
  numeric quantity
  numeric unit_amount
  numeric amount
  jsonb metadata
}
```

**Indexes**
- `usage_counters (tenant_id, metric_code, period_start)` unique.  
- `invoices (tenant_id, period_start DESC)`; `invoice_lines (invoice_id)`.

---

## 7) Provider Integrations & Webhook Logs

```mermaid
erDiagram
TENANTS ||--o{ INTEGRATION_WEBHOOK_LOGS : ""
TENANTS ||--o{ BILLING_WEBHOOK_LOGS : ""

INTEGRATION_WEBHOOK_LOGS {
  uuid id PK
  uuid tenant_id FK
  text provider // brevo|infobip|oauth
  text event_type
  jsonb raw
  timestamp received_at
  bool processed
}
BILLING_WEBHOOK_LOGS {
  uuid id PK
  text provider // stripe
  text event_type
  jsonb raw
  timestamp received_at
  bool processed
  text error_message
}
```

---

## 8) Indexing & Partitioning Guidance (Summary)

- Always prefix tenant-scoped indexes with `(tenant_id, ...)` to ensure planner selects the right index.  
- **Time-series tables** (`audit_logs`, `messages_outbox`, `integration_webhook_logs`) → consider monthly partitions + partial indexes by `status`.  
- **GIN** on JSONB fields only when specific keys are frequently queried.  
- **GiST** on `geom` for PostGIS; otherwise index `geom_geojson` as JSONB with expression indexes if needed.  
- Prefer **seek pagination** using `(tenant_id, created_at, id)` composite to avoid deep `OFFSET` scans.

---

## 9) Naming & Coding Dictionaries

- Coded dictionaries (e.g., `unit_type_codes`, `component_type_codes`, `lead_source_codes`, `telemarketing_outcome_codes`) follow the pattern:  
  `id, tenant_id NULL, code, label, description, is_active, created_at, updated_at`  
  - `tenant_id NULL` rows are **global defaults**.  
  - Enforce unique `(COALESCE(tenant_id,'GLOBAL'), code)`.

---

## 10) Open Data Items

1. Do we add `job_title_codes` and `department_codes` to core by default?  
2. Should `unit_deals` allow multiple active reservations (waitlist) or enforce 1 active?  
3. Future search: adopt OpenSearch for fuzzy + facets when Postgres FTS is insufficient.

---

**End of Appendix C** — ERDs will evolve with implementation; keep Mermaid blocks updated to auto-refresh diagrams in docs sites that support Mermaid.

---

# Appendix D — Example Dashboards (Modular, User‑Configurable)

This appendix provides **reference dashboard layouts**, a **widget metadata schema**, and **role‑based templates** you can apply per tenant/user. It complements **Section 11 (Reports & Analytics + Modular Dashboard)**.

---

## 1) Widget Metadata Schema (Contract)

Widgets are registered in a catalog. Each widget conforms to the following JSON contract (stored in code; persisted instances save `config` + `datasource` + `position`).

```json
{
  "type": "kpi.pipelineValue",
  "version": "1.0.0",
  "displayName": "Pipeline Value",
  "category": "KPI|Chart|Table|Map|Custom",
  "inputs": {
    "datasource": {
      "queryId": "deals.pipeline.value",
      "paramsSchema": {
        "pipelineId": "uuid?",
        "currency": "string?",
        "dateFrom": "string?",
        "dateTo": "string?"
      }
    },
    "configSchema": {
      "title": "string?",
      "thresholds": {"warn": "number?", "alert": "number?"},
      "inheritGlobalFilters": "boolean"
    },
    "refreshSchema": {
      "mode": "manual|interval|event",
      "seconds": "number?"
    }
  },
  "capabilities": {
    "drilldown": true,
    "export": "csv|xlsx|pdf",
    "permissions": ["deals.view"]
  }
}
```

**Notes**
- `paramsSchema` validated by Zod on `/v1/dashboard/data/:queryId` requests.
- `inheritGlobalFilters` lets widgets adopt global date/team filters or override them.
- `permissions` control visibility; if user lacks permission, widget is hidden or disabled.

---

## 2) Data Queries Catalog (Examples)

Data endpoints return **typed series/tables** optimized for charting.

- `deals.pipeline.value` → `{ currency, total, byStage: [{stage, value}] }`
- `leads.bySource` → `{ items: [{sourceCode, count}], total }`
- `inventory.availability` → `{ items: [{unitTypeCode, available, reserved, sold}] }`
- `campaigns.performance` → `{ items: [{name, sent, delivered, opened, clicked}] }`
- `telemarketing.outcomes` → `{ items: [{outcomeCode, count, talkTimeSec}] }`
- `tasks.overdue` → table rows with `id, subject, dueAt, owner`

---

## 3) Role‑Based Default Templates

### 3.1 Sales (Account Executive)
**Goal:** prioritize pipeline movement, hot leads, and tasks.

**Widgets**
1. `kpi.pipelineValue` (inherit globals)
2. `chart.pipelineFunnel` (pipelineId=default)
3. `table.topDealsClosingSoon` (limit=15)
4. `chart.leadsBySource` (period=30d)
5. `table.tasksOverdue` (owner=self)
6. `kpi.winRate` (period=90d)

**ASCII Wireframe**
```
+-------------------+---------------------+
| KPI: Pipeline $   | Funnel: Pipeline    |
+-------------------+---------------------+
| Top Deals Closing Soon (table)          |
+-----------------------------------------+
| Leads by Source (bar)   | KPI: Win Rate |
+-------------------------+----------------+
| Overdue Tasks (table)                     |
+------------------------------------------+
```

### 3.2 Marketing
**Goal:** campaign health, audience growth, attribution.

**Widgets**
1. `kpi.campaignCTR` (period=30d)
2. `chart.campaignPerformance` (by campaign)
3. `kpi.audienceGrowth` (contacts)
4. `table.campaignSends` (latest 20)
5. `chart.telemarketingOutcomes` (if TM enabled)
6. `kpi.optOutRate` (email/SMS/WA)

**Wireframe**
```
+--------------------+-----------------------+
| KPI: CTR           | KPI: Audience Growth  |
+--------------------+-----------------------+
| Campaign Performance (line/area)           |
+--------------------------------------------+
| Recent Sends (table)   | Tele Outcomes     |
+------------------------+-------------------+
| KPI: Opt-out Rate                          |
+--------------------------------------------+
```

### 3.3 Inventory Manager
**Goal:** availability, price changes, velocity.

**Widgets**
1. `kpi.unitsAvailable`
2. `chart.inventoryVelocity` (by unitTypeCode)
3. `map.availableUnitsMini` (project selector)
4. `table.recentPriceChanges`
5. `kpi.avgDaysOnMarket`

**Wireframe**
```
+-----------------------+----------------------+
| KPI: Units Available  | KPI: Avg Days Market |
+-----------------------+----------------------+
| Velocity by Unit Type (line)                |
+---------------------------------------------+
| Map Mini: Available Units                   |
+---------------------------------------------+
| Recent Price Changes (table)                |
+---------------------------------------------+
```

### 3.4 Admin / Super Admin
**Goal:** health, usage, billing, compliance.

**Widgets**
1. `kpi.activeUsers` / `kpi.seatsUsed`
2. `chart.commsHealth` (delivery rates by channel)
3. `chart.usageCounters` (sms.sent, whatsapp.sent, seats.used)
4. `table.auditLogRecent`
5. `kpi.billingStatus` (renewal date, past_due flag)

**Wireframe**
```
+-----------------+-----------------------+
| KPI: Seats Used | KPI: Billing Status   |
+-----------------+-----------------------+
| Comms Health (stacked bars)             |
+-----------------------------------------+
| Usage Counters (lines)                  |
+-----------------------------------------+
| Recent Audit Events (table)             |
+-----------------------------------------+
```

---

## 4) Widget Library (Initial Set)

### KPI
- `kpi.pipelineValue`, `kpi.winRate`, `kpi.avgDealSize`, `kpi.unitsAvailable`, `kpi.callsToday`, `kpi.campaignCTR`, `kpi.billingStatus`, `kpi.seatsUsed`

### Charts
- `chart.pipelineFunnel`, `chart.leadsBySource`, `chart.dealsByStageOverTime`,
  `chart.inventoryVelocity`, `chart.campaignPerformance`, `chart.telemarketingOutcomes`,
  `chart.usageCounters`, `chart.commsHealth`

### Tables
- `table.topDealsClosingSoon`, `table.overdueTasks`, `table.hotLeads`, `table.recentPriceChanges`, `table.auditLogRecent`, `table.campaignSends`

### Map
- `map.availableUnitsMini`

### Custom
- `custom.markdownNote`, `custom.externalFrame`, `custom.sqlMetric` (admin‑only)

---

## 5) Widget Instance JSON (Examples)

### 5.1 KPI — Pipeline Value
```json
{
  "type": "kpi.pipelineValue",
  "version": "1.0.0",
  "datasource": {
    "queryId": "deals.pipeline.value",
    "params": {"pipelineId": "e1c8...","currency": "USD"}
  },
  "config": {"title": "Pipeline Value (USD)", "thresholds": {"warn": 250000, "alert": 150000}, "inheritGlobalFilters": true},
  "position": {"x":0,"y":0,"w":6,"h":3},
  "refresh": {"mode":"interval","seconds":300}
}
```

### 5.2 Chart — Pipeline Funnel
```json
{
  "type": "chart.pipelineFunnel",
  "version": "1.0.0",
  "datasource": {
    "queryId": "deals.pipeline.funnel",
    "params": {"pipelineId": "e1c8..."}
  },
  "config": {"title": "Sales Funnel • Q3", "inheritGlobalFilters": true},
  "position": {"x":6,"y":0,"w":6,"h":6},
  "refresh": {"mode":"event"}
}
```

### 5.3 Table — Overdue Tasks
```json
{
  "type": "table.overdueTasks",
  "version": "1.0.0",
  "datasource": {
    "queryId": "tasks.overdue",
    "params": {"owner": "self"}
  },
  "config": {"title": "Overdue Tasks", "columns": ["subject","dueAt","deal","contact"]},
  "position": {"x":0,"y":9,"w":12,"h":6},
  "refresh": {"mode":"interval","seconds":600}
}
```

---

## 6) Layout Persistence

- **Tables**
  - `dashboard_layouts (id, tenant_id, owner_user_id NULL, scope ENUM['user','role','tenant'], name, is_default BOOL, created_at)`
  - `dashboard_widgets (id, layout_id, type, version, position JSONB, config JSONB, datasource JSONB, refresh JSONB)`
- **Serialization**
  - Layout save merges widget positions and config; server validates against widget registry schemas.
- **Permissions**
  - Widget visibility tied to `capabilities.permissions`; layouts with unauthorized widgets degrade gracefully (hidden with inline “missing permission” note for editors).

---

## 7) Global Filters & Drill‑downs

- **Global Filters**: date range, team/user, pipeline, project — available in the shell header.
- **Inheritance**: widgets default to inherit; can override in config (e.g., fixed pipeline).  
- **Drill‑down**: each widget deep‑links to its source list/report with identical filters.  
- **Export**: CSV/XLSX/PDF where supported; governed by `reports.export` permission.

---

## 8) Example: Full JSON Layout (Sales Template)

```json
{
  "name": "Sales Default",
  "scope": "role",
  "widgets": [
    {"type":"kpi.pipelineValue","version":"1.0.0","position":{"x":0,"y":0,"w":6,"h":3},"datasource":{"queryId":"deals.pipeline.value","params":{"pipelineId":"e1c8..."}},"config":{"title":"Pipeline Value","inheritGlobalFilters":true}},
    {"type":"chart.pipelineFunnel","version":"1.0.0","position":{"x":6,"y":0,"w":6,"h":6},"datasource":{"queryId":"deals.pipeline.funnel","params":{"pipelineId":"e1c8..."}},"config":{"title":"Funnel"}},
    {"type":"table.topDealsClosingSoon","version":"1.0.0","position":{"x":0,"y":6,"w":12,"h":4},"datasource":{"queryId":"deals.closingSoon","params":{"days":30}},"config":{"title":"Top Deals"}},
    {"type":"chart.leadsBySource","version":"1.0.0","position":{"x":0,"y":10,"w":8,"h":5},"datasource":{"queryId":"leads.bySource","params":{"periodDays":30}},"config":{"title":"Leads by Source"}},
    {"type":"kpi.winRate","version":"1.0.0","position":{"x":8,"y":10,"w":4,"h":3},"datasource":{"queryId":"deals.winRate","params":{"periodDays":90}},"config":{"title":"Win Rate"}},
    {"type":"table.overdueTasks","version":"1.0.0","position":{"x":0,"y":15,"w":12,"h":5},"datasource":{"queryId":"tasks.overdue","params":{"owner":"self"}},"config":{"title":"Overdue Tasks"}}
  ]
}
```

---

## 9) Entitlements & Limits

- Per plan limits: `maxWidgetsPerLayout`, `maxSharedLayouts`, `snapshotScheduling`.
- Feature flags per widget (e.g., `telemarketing.enabled` for tele outcomes widget).
- Admin can **publish** role/tenant templates; users can clone and customize.

---

## 10) Open Decisions
1. Should we allow **cross‑tenant template sharing** (marketplace) later?
2. Do we support **real‑time streaming** widgets in MVP?
3. Should admins be able to **lock** certain widgets in shared layouts?

---

**End of Appendix D.**

---

