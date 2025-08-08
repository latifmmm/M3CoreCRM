# Multitenant Real Estate CRM — Comprehensive Modular Specification

## Table of Contents

### Part I: Executive Summary
- [Section 1 — Executive & Product Overview](#section-1--executive--product-overview)

### Part II: System Architecture & Foundation
- [Section 2 — System Architecture](#section-2--system-architecture)
- [Section 3 — Security & Compliance](#section-3--security--compliance)
- [Section 4 — Data Model & Storage](#section-4--data-model--storage)
- [Section 5 — Multi-Tenancy & Scaling](#section-5--multi-tenancy--scaling)
- [Section 6 — Search & Filtering Strategy](#section-6--search--filtering-strategy)

### Part III: Core CRM Modules
- [Section 7 — User Management & Roles](#section-7--user-management--roles)
- [Section 8 — Authentication & Authorization](#section-8--authentication--authorization)
- [Section 9 — Property Inventory Management](#section-9--property-inventory-management)
- [Section 10 — Lead & Contact Management](#section-10-lead--contact-management)
- [Section 11 — Activities & Communication Tracking](#section-11-activities--communication-tracking)
- [Section 12 — Developer & Partner Management](#section-12-developer--partner-management)
- [Section 13 — Mapping & Overlay Management](#section-13-mapping--overlay-management)

### Part IV: Communication & Analytics
- [Section 14 — Notifications, Messaging & Alerting](#section-14--notifications-messaging--alerting)
- [Section 15 — Reporting & Analytics](#section-15--reporting--analytics)
- [Section 16 — Billing & Subscription Management](#section-16--billing--subscription-management)

### Part V: Data Operations
- [Section 17 — Data Import, Export & Migration](#section-17--data-import-export--migration)
- [Section 18 — Audit Logging & Compliance](#section-18--audit-logging--compliance)
- [Section 19 — Data Archiving & Retention](#section-19--data-archiving--retention)

### Part VI: Integration & APIs
- [Section 20 — API Management & Integration Governance](#section-20--api-management--integration-governance)

### Part VII: Mobile & Multi-Platform
- [Section 21 — Mobile App Features & Synchronization](#section-21--mobile-app-features--synchronization)
- [Section 22 — Multilingual & Localization Support](#section-22--multilingual--localization-support)
- [Section 23 — Accessibility & Inclusive Design](#section-23--accessibility--inclusive-design)

### Part VIII: Infrastructure & Operations
- [Section 24 — Backup & Disaster Recovery](#section-24--backup--disaster-recovery)
- [Section 25 — Monitoring & Performance Optimization](#section-25--monitoring--performance-optimization)
- [Section 26 — Deployment, DevOps & Release Management](#section-26--deployment-devops--release-management)

### Part IX: Quality & Support
- [Section 27 — Testing & Quality Assurance](#section-27--testing--quality-assurance)
- [Section 28 — Training & User Support](#section-28--training--user-support)
- [Section 29 — Documentation & Knowledge Management](#section-29--documentation--knowledge-management)

### Part X: Governance
- [Section 30 — Compliance & Regulatory Requirements](#section-30--compliance--regulatory-requirements)
- [Section 31 — Change Management](#section-31--change-management)
- [Section 32 — Third-Party Vendor Management](#section-32--third-party-vendor-management)
- [Section 33 — Maintenance & Continuous Improvement](#section-33--maintenance--continuous-improvement)

### Part XI: Extensibility & Future
- [Section 34 — Customization & Extensibility](#section-34--customization--extensibility)
- [Section 35 — Workflow Automation](#section-35--workflow-automation)
- [Section 36 — Future Enhancements & Roadmap](#section-36--future-enhancements--roadmap)

### Part XII: Appendices
- [Appendix A — Glossary](#appendix-a--glossary)
- [Appendix B — Environment Variables](#appendix-b--environment-variables)
- [Appendix C — API Request/Response Examples](#appendix-c--api-requestresponse-examples)
- [Appendix D — Subscription Plans & Feature Matrix](#appendix-d--subscription-plans--feature-matrix)
- [Appendix E — Compliance Checklist](#appendix-e--compliance-checklist)
- [Appendix F — Sample Dashboards & Reports](#appendix-f--sample-dashboards--reports)
- [Appendix G — Developer Onboarding](#appendix-g--developer-onboarding)
- [Appendix H — Merged RBAC & Authorization](#appendix-h--merged-rbac--authorization)
---

# Section 1 — Executive & Product Overview

## 1.1 Purpose & Vision

Deliver a **multitenant, modular Real Estate CRM** that shortens the sales cycle, improves lead conversion, and centralizes operations (inventory, leads, mapping, documents, analytics) across web and iOS (v1), with Android support in Phase 3.

## 1.2 Target Users & Personas

- **Super Admin:** Owns tenant setup, billing, security policies.
- **Admin:** Runs day-to-day operations; manages inventory, pipeline, and team.
- **Staff/Agent:** Works leads, updates properties/units, logs activities.

## 1.3 Problem Statement

Real‑estate teams juggle spreadsheets, WhatsApp threads, and siloed tools. The CRM consolidates **inventory** + **pipeline** + **communications** with robust **tenant isolation**, **RBAC**, and **Arabic/RTL** support.

## 1.4 Scope (v1) / Non‑Scope

**In‑Scope (v1):** 
- Web CRM
- iOS mobile app  
- Core modules (Properties, Leads, Activities, Developers)
- Invitations, email verification, TOTP 2FA
- Brevo emails, Stripe subscriptions (seat limits)
- i18n/RTL, exports, basic reports

**Out of Scope (v1):** 
- Android app (Phase 3)
- Built‑in dialer/telephony
- Embedded 3D tours (links only)
- Advanced AI features (Phase 4)

## 1.5 Success Metrics (KPIs)

 | KPI | Baseline | v1 Target | v2 Target | 
 | --------------------------------- | ---------- | ------------ | --------- | 
 | Lead → Qualified conversion | TBD/tenant | **+20%** | +30% | 
 | Lead response SLA (median) | TBD | **≤ 10 min** | ≤ 5 min | 
 | Time‑to‑list property | TBD | **≤ 5 min** | ≤ 3 min | 
 | Monthly Active Users (MAU/Seats) | TBD | **≥ 80%** | ≥ 85% | 
 | Email deliverability (inbox rate) | TBD | **≥ 97%** | ≥ 98% | 
 | App p95 read latency | — | **≤ 300 ms** | ≤ 250 ms | 
 | API response time (p95) | — | **≤ 200 ms** | ≤ 150 ms | 
 | Database query time (p95) | — | **≤ 100 ms** | ≤ 75 ms | 
 | Mobile sync time (full) | — | **≤ 30 sec** | ≤ 20 sec | 
 | Search query response time | — | **≤ 500 ms** | ≤ 300 ms | 

## 1.6 Releases & Phasing

- **MVP (Phase 1):** Auth (signup/invite/verify/2FA), Properties, Leads, Activities, Developers, Brevo transactional email, Stripe checkout, basic reports, iOS app.
- **Phase 2:** Off‑plan unit mapping tool, SMS/OTP, marketing lists & segmentation, data import wizard v2, push notifications.
- **Phase 3:** Android app (offline cache + push), social logins (Google/Apple/LinkedIn), DigitalOcean Spaces (S3) migration.
- **Phase 4:** Advanced analytics dashboards, AI lead scoring/suggestions, ERP integration.

## 1.7 High‑Level Architecture (Diagram)

**Architecture Diagram:** See [Section 1.7](#section-17-high-level-architecture-diagram)

+---------------------------------------------------------+
 | Clients | 
 | +------------------+  +-----------------------------+ | 
 |  | Web CRM (React) |  | iOS App (SwiftUI) |  | 
 | +------------------+  +-----------------------------+ | 
+-----------------------------|---------------------------+
                              |
                              v
+---------------------------------------------------------+
 | API Gateway / Backend (Express + Node) | 
 | JWT Auth, RBAC, Tenant Context, Feature Flags | 
 | --------------------------------------------------------- | 
 | Services: Auth, Tenancy, Inventory, Leads, Mapping, | 
 | Notifications, Billing, Admin, Reports | 
+---------------------------------------------------------+
                              |
         -------------------------------------------------
         |                       |                       |
         v                       v                       v
+---------------+     +-------------------+    +-----------------+
 | PostgreSQL |  | Object Storage |  | External APIs | 
 | (Multi-tenant) |  | (DO DigitalOcean Spaces - S3) |  | Brevo, Stripe | 
+---------------+     +-------------------+    +-----------------+
                                                 | Google/Apple OAuth
                                                 | Webhooks (Stripe, Brevo)

```

**The diagram should show:**
- Clients: Web (React/Vite), iOS (SwiftUI)
- API (Express/Node) with JWT + RBAC, queues (emails/reports), webhook handlers (Stripe/Brevo)
- Data: PostgreSQL (multi‑tenant schema), Spaces (S3) for media
- Integrations: Brevo, Stripe

+---------------------------------------------------------+
 | Clients | 
 | +------------------+  +-----------------------------+ | 
 |  | Web CRM (React) |  | iOS App (SwiftUI) |  | 
 | +------------------+  +-----------------------------+ | 
+-----------------------------|---------------------------+
                              |
                              v
+---------------------------------------------------------+
 | API Gateway / Backend (Express + Node) | 
 | JWT Auth, RBAC, Tenant Context, Feature Flags | 
 | --------------------------------------------------------- | 
 | Services: Auth, Tenancy, Inventory, Leads, Mapping, | 
 | Notifications, Billing, Admin, Reports | 
+---------------------------------------------------------+
                              |
         -------------------------------------------------
         |                       |                       |
         v                       v                       v
+---------------+     +-------------------+    +-----------------+
 | PostgreSQL |  | Object Storage |  | External APIs | 
 | (Multi-tenant) |  | (DO DigitalOcean Spaces - S3) |  | Brevo, Stripe | 
+---------------+     +-------------------+    +-----------------+
                                                 | Google/Apple OAuth
                                                 | Webhooks (Stripe, Brevo)

## 1.8 Master ERD (ASCII Diagram)

```
[companies] 1---n [users]
   |                  |
   |                  n---1 [roles]
   |
   |---n [properties] 1---n [units]
   |                        |
   |                        n---n [map_overlays] 1---n [overlay_shapes]
   |
   |---n [developers]
   |
   |---n [leads] 1---n [activities]
   |
   |---n [invitations]
   |
   |---n [audit_logs]
   |
   |---n [media]
```

[companies] 1---n [users]
   |                  |
   |                  n---1 [roles]
   |
   |---n [properties] 1---n [units]
   |                        |
   |                        n---n [map_overlays] 1---n [overlay_shapes]
   |
   |---n [developers]
   |
   |---n [leads] 1---n [activities]
   |
   |---n [invitations]
   |
   |---n [audit_logs]
   |
   |---n [media]

## 1.9 Key Business Rules (Summary)

- **Tenancy:** Every row carries `company_id`; requests must be scoped and enforced at API boundary.
- **RBAC:** Super Admin > Admin > Staff (least privilege); UI hides unauthorized actions.
- **Leads:** Unique by email/phone per tenant (fuzzy dedupe); stage transitions tracked with timestamps.
- **Units:** Status transitions gated by documents/payments where applicable.
- **Billing:** Seat limits and entitlements evaluated on each privileged action.

## 1.10 Risks & Guardrails (Exec View)

- **Deliverability risk** → authenticated domain (SPF/DKIM), bounce monitoring, warm‑up playbook.
- **Data isolation risk** → integration tests for tenant scoping; request‑ID + tenant‑ID tracing.
- **Webhook reliability** → idempotent handlers, retries with backoff, DLQ.

## 1.11 Stakeholders & RACI (v1)

 | Area | R | A | C | I | 
 | ---------------- | ------------ | --- | --------------- | --------- | 
 | Auth & Security | Backend Lead | CTO | QA, PM | All | 
 | Properties/Units | FE Lead | PM | Backend, Design | Sales Ops | 
 | Leads/Pipeline | FE Lead | PM | Backend, Design | Sales Ops | 
 | Billing | Backend Lead | CTO | Finance, PM | Support | 
 | i18n/RTL | FE Lead | PM | QA, Design | All | 

## 1.12 Acceptance Criteria (Done for Section 1)

- Architecture diagram and master ERD attached.
- KPIs documented with collection method and owners.
- Phase scope and non‑scope approved by PM/CTO.
- Risks/guardrails reviewed and logged in ADRs.

---

# Section 2 — System Architecture

## 2.1 Architecture Overview

**Style:** Modular services behind a single Express API (monolith-first, service boundaries defined for future extraction). 
**Tenancy:** Strong logical isolation via `company_id` on every row, plus request-scoped tenant context. 
**Transport:** HTTPS + JSON REST; Webhooks for Stripe/Brevo; WebSocket/SSE for in‑app notifications (Phase 2).

```
Clients (Web, iOS)
   │
   ▼
API Gateway (Express/Node, JWT/RBAC)
   ├─ Auth & Users
   ├─ Tenancy & RBAC
   ├─ Properties & Units
   ├─ Leads & Activities
   ├─ Developers & Mapping
   ├─ Notifications (Email/SMS, In‑App)
   ├─ Billing (Stripe)
   └─ Admin (Settings, Roles, Plans)
       │
       ├─ PostgreSQL (primary)
       ├─ Object Storage (DO DigitalOcean Spaces (S3))
       ├─ Queue Workers (emails, exports, webhooks)
       └─ Observability (Sentry, Datadog)
```

C4 System Context:

[Super Admin] ---\
[Admin] ----------- > (Web CRM) ---> [CRM Backend API] ---> [PostgreSQL]
[Agent] -----------/                  |                     [DigitalOcean Spaces]
                                      |-> [Brevo API]
                                      |-> [Stripe API]
                                      |-> [Push Notifications]

Container Diagram:

+--------------------------------------------------------+
 | CRM Backend API (Express/Node) | 
 | -------------------------------------------------------- | 
 | Containers: | 
 | - Auth Service | 
 | - Tenant Service | 
 | - Inventory Service | 
 | - Leads Service | 
 | - Mapping Service | 
 | - Billing Service | 
 | - Notification Service | 
 | - Admin Service | 
+--------------------------------------------------------+
| PostgreSQL | Spaces (S3) | Queue Workers | Monitoring  |
+--------------------------------------------------------+

## 2.1a Module Interaction Diagram

The following diagram illustrates the main flows between CRM modules and back-end services:

[User Action] -> [Frontend Module]
   |    Leads -> Leads API -> Leads Service -> PostgreSQL
   | Properties -> Inventory Service -> PostgreSQL
   | Mapping -> Mapping Service -> Overlay Shapes -> PostgreSQL
   | Billing -> Billing Service -> Stripe
   | Notifications -> Notification Service -> Brevo/SMS

## 2.2 Service Boundaries (Monolith‑first)

- **Auth Service:** signup/login, refresh, 2FA, invitations, email verification.
- **Tenant Service:** companies, plans, seats, settings, feature flags.
- **Inventory Service:** properties, units, media, price history, search.
- **Leads Service:** leads, stages, assignment, dedupe, activities/notes.
- **Mapping Service:** projects, overlays, shapes, status coloring, versions.
- **Billing Service:** Stripe checkout/portal, webhooks, entitlements.
- **Notification Service:** Brevo API (transactional/marketing), templates, preferences.
- **Admin Service:** roles/permissions, audit logs, configuration.

## 2.3 Tenancy Model & Guards

- **Tenant Key:** `company_id` required on all major tables and mutations.
- **Propagation:** Tenant ID resolved from JWT → request context → repository filters.
- **Guards:** Middleware enforces tenant scoping and RBAC before hitting handlers.
- **Auditing:** `audit_logs` record actor, tenant, action, entity diff.

## 2.4 Configuration & Environments

- **Envs:** Local, Staging, Production.
- **Config Sources:** `.env` (local), platform secrets (staging/prod). No secrets in code.
- **Feature Flags:** `features.json` per env (plan + rollout keys), loaded at startup and cached 60s.

**Key Variables** (See Appendix B for full list)

## 2.5 Data Stores & Access Layer

- **PostgreSQL (primary):** strict schema, UUID or custom IDs, JSONB for flex fields.
- **Spaces (S3):** documents/media; presigned URLs; lifecycle rules.
- **Cache (in‑proc, optional Redis later):** hot config, plans, role maps (TTL 60s) with stampede protection.
- **Repositories:** one module = one repo package; query builders with parameterized SQL; metrics per query group.

## 2.6 API Conventions

- **Base:** `/v1` prefix; REST resources; nouns; plural.
- **Auth:** Bearer JWT; refresh rotation; 401/403 split; `x-tenant-id` logged.
- **Pagination:** Cursor style `{cursor, limit}`; `nextCursor` in response.
- **Errors:** `{ code, message, details?, traceId }`.
- **Idempotency:** `Idempotency-Key` for POST that can be retried.

## 2.7 Messaging & Jobs

- **Queue:** Minimal job system (Node workers) for emails, exports, report generation, webhook retries; exponential backoff + DLQ.
- **Webhooks:** Stripe and Brevo handled on dedicated endpoints; verify signatures; idempotent storage of events.

## 2.8 Caching Strategy

- **HTTP Caching:** `ETag` + `Cache-Control` for read‑only endpoints; 304 support.
- **Client Cache (React Query):** Module defaults for `staleTime` and background revalidation.
- **Invalidation:** On write, publish module events to local bus → targeted cache bust (API + FE).

## 2.9 Deployment Topology

- **API:** DigitalOcean App Platform (autoscale on CPU/RAM); rolling deploy; health/readiness probes.
- **CRM Web:** DigitalOcean App Platform static hosting + edge cache.
- **Marketing:** Vercel with ISR; edge cache.
- **DB:** DO Managed PostgreSQL (primary + HA standby); scheduled backups.
- **Storage:** DO DigitalOcean Spaces with CDN; signed URLs for private assets.

Infrastructure Topology Diagram:

[Clients] -> HTTPS -> [DigitalOcean App Platform: API Backend] 
                          |-> [DO Managed PostgreSQL]
                          |-> [DO DigitalOcean Spaces + CDN]
                          |-> [Sentry, Datadog]
                          |-> [Stripe/Brevo APIs]
[CRM Web] -> [DigitalOcean App Platform Static Hosting + CDN]
[Marketing Site] -> [Vercel + Edge Cache]

## 2.10 Observability Hooks (Across Layers)

- **Tracing:** OpenTelemetry spans from FE → API → DB; propagate `traceparent`.
- **Logging:** Correlation IDs (`x-request-id`, `tenant-id`, `user-id`); PII redaction.
- **Metrics:** p50/p95/p99 latency, error rate, queue depth, webhook failure ratio.

### Alert Severity Matrix

 | Severity | Description | Example Triggers | SLA to Acknowledge | SLA to Resolve | Notification Channels | 
 | ---------- | ------------- | ------------------ | -------------------- | ---------------- | ----------------------- | 
 | **P0 — Critical** | Total outage or severe data loss risk | API down, DB unreachable, multi-tenant data leak detected | Immediate (<5 min) | 1 hour | PagerDuty, SMS, Slack Critical | 
 | **P1 — High** | Major feature unavailable for most tenants | Login failures, billing webhook failures | 15 min | 4 hours | PagerDuty, Slack | 
 | **P2 — Medium** | Non-critical feature degraded or delayed | Report generation slow, sync delay > 10 min | 30 min | 1 business day | Slack | 
 | **P3 — Low** | Cosmetic or minor defects with workarounds | Minor UI bug, log formatting issue | 4 hours | Next sprint | Jira | 

---

### Runbook Guidelines
### Additional Operational Runbooks
- **Database Failover:** Steps to promote standby, update DNS, validate service.
- **Data Migration Rollback:** Restore from backup, replay delta logs if needed.
- **Media Storage Outage:** Switch to secondary bucket, update configs, sync on recovery.

1. **Acknowledge Alert**  
   - Assign on-call engineer immediately (SLA from table above).  
   - Confirm alert validity by checking monitoring dashboards (Datadog/Sentry).  

2. **Identify Scope & Impact**  
   - Determine affected tenants, modules, and integrations.  
   - Check recent deployments for correlation.  

3. **Remediate**  
   - Apply hotfix, revert deploy, or run failover scripts as per module’s recovery plan.  
   - Update alert ticket with resolution steps.  

4. **Verify**  
   - Ensure monitoring returns to normal state.  
   - Run smoke tests on affected module(s).  

5. **Post-Incident Review**  
   - Complete incident report within 24h for P0/P1 events.  
   - Add automation/tests to prevent recurrence.  

   > **Note:** This severity classification and runbook process is to be applied in conjunction with 
> [Section 25 — Monitoring & Performance Optimization](#section-25--monitoring--performance-optimization) 
> to ensure consistent alert handling, performance tracking, and incident resolution across the system.

## 2.11 Security Posture

- TLS everywhere; HSTS; secure cookies where used; CSRF protections.
- Rate limits (per IP, per user, per tenant) with sliding window; lockout rules for auth.
- Least‑privilege API keys for external providers; regular rotation.

## 2.12 Monorepo Structure

```
/apps
  /api           (Express + TypeScript)
  /crm-web       (React + Vite)
  /marketing     (Next.js App Router)
/packages
  /models        (shared TS types, zod schemas)
  /ui            (design system components)
  /client        (axios client, React Query hooks)
  /config        (env loaders, feature flags)
/tools
  /scripts       (migrate, seed, lint, typecheck)
```

## 2.13 Acceptance Criteria

- C4 System + Container diagrams attached.
- Documented service boundaries with clear ownership.
- Tenancy propagation and guards defined and tested.
- API conventions, pagination, and error shape specified.
- Deployment topology + config matrix approved by DevOps.

---

# Section 3 — Security & Compliance

## 3.1 Security Objectives
- Safeguard sensitive tenant and user data from unauthorized access.
- Maintain compliance with GDPR, Egyptian, and Gulf state data protection regulations.
- Ensure secure and compliant integrations with all external services.

## 3.2 Authentication & Authorization
- **Auth Method:** JWT access tokens with refresh token rotation and revocation.
- **2FA:** TOTP (Google Authenticator) optional per user; enforceable tenant‑wide by Super Admin.
- **RBAC:** Role-based access control with least privilege (Super Admin > Admin > Staff).
- **Password Policy:** Min 12 chars, complexity rules; Argon2 hashing with unique salts.
- **Social Logins:** Google, Apple, LinkedIn (PKCE + minimal scopes) in Phase 3.

## 3.3 Data Security
- **Encryption in Transit:** Enforce TLS 1.3 for all HTTP(S) traffic.
- **Encryption at Rest:** AES‑256 for sensitive fields; encrypted DO Managed PostgreSQL volumes.
- **Key Management:** DigitalOcean App Platform secrets; rotation every 90 days.
- **Backups:** Encrypted at rest and in transit; retention per Section 24.

## 3.4 Compliance Measures
- **GDPR/Local Compliance:** Implement access, rectification, erasure workflows.
- **Data Retention Policy:** Defaults in Section 19; configurable per tenant.
- **Audit Logging:** Append‑only immutable logs for sensitive actions.

## 3.5 Third‑Party Integrations Security
- **Brevo:** API keys in secrets manager; verified sending domains; SPF/DKIM alignment.
- **Stripe:** Webhook signature verification; idempotent event handling; PCI‑DSS Level 1 provider.
- **OAuth Providers:** Minimal scopes; PKCE for all public client flows.

## 3.6 Threat Detection & Incident Response
## 3.6a Threat Model (STRIDE)

 | Threat Category | Example | Mitigation | 
 | ----------------- | --------- | ------------ | 
 | **Spoofing** | Fake login requests | JWT auth, 2FA, IP monitoring | 
 | **Tampering** | Altering API requests | HTTPS/TLS, input validation | 
 | **Repudiation** | Denying performed actions | Immutable audit logs | 
 | **Information Disclosure** | Data leak via API | RBAC, data encryption | 
 | **Denial of Service** | Overwhelming API | Rate limiting, WAF | 
 | **Elevation of Privilege** | Gaining admin rights | Strict role checks, privilege separation | 

- **Monitoring:** Real‑time detection of anomalies.
- **Incident Plan:** Escalation matrix; 24h initial response SLA; 72h notification to regulators.
- **Testing:** Annual penetration testing by certified third party.
- **Drills:** Semi‑annual tabletop exercises with full post‑mortems.

## 3.7 Security Tooling
- **SAST/DAST:** Automated static and dynamic scans in CI/CD.
- **Dependency Scanning:** Automated checks for known vulnerabilities.
- **Secrets Detection:** Pre‑commit and pipeline enforcement.

## 3.8 Acceptance Criteria
- Security policies approved by CTO and legal.
- All high‑severity vulnerabilities remediated before release.
- Annual penetration testing and twice‑yearly incident drills documented.
- All third‑party integrations reviewed for minimal privilege.

---

# Section 4 — Data Model & Storage

## 4.1 Data Model Overview
The CRM employs a **multi-tenant PostgreSQL schema** with strict separation of data by `company_id`. All tables are normalized to at least 3NF, with selective JSONB usage for extensible attributes.

## 4.2 Core Entities & Relationships
**Key Tables:**
- **companies** — tenant record, subscription plan, settings.
- **users** — belongs to one company; linked to roles and authentication data.
- **invitations** — pending user onboarding tokens.
- **properties** — core property records, linked to developers and units.
- **units** — sub-entities under properties; track size, price, status.
- **developers** — organizations creating properties.
- **leads** — prospective clients, linked to activities and assigned users.
- **activities** — interactions with leads (calls, emails, meetings).
- **map_overlays** — geospatial project overlays.
- **overlay_shapes** — individual units or areas on a map overlay.
- **media** — images, documents linked to properties, units, or developers.
- **audit_logs** — immutable action logs.

Detailed ERD with PK/FK Relationships

**Architecture Diagram:**
```

+---------------------------------------------------------+
 | Clients | 
 | +------------------+  +-----------------------------+ | 
 |  | Web CRM (React) |  | iOS App (SwiftUI) |  | 
 | +------------------+  +-----------------------------+ | 
+-----------------------------|---------------------------+
                              |
                              v
+---------------------------------------------------------+
 | API Gateway / Backend (Express + Node) | 
 | JWT Auth, RBAC, Tenant Context, Feature Flags | 
 | --------------------------------------------------------- | 
 | Services: Auth, Tenancy, Inventory, Leads, Mapping, | 
 | Notifications, Billing, Admin, Reports | 
+---------------------------------------------------------+
                              |
         -------------------------------------------------
         |                       |                       |
         v                       v                       v
+---------------+     +-------------------+    +-----------------+
 | PostgreSQL |  | Object Storage |  | External APIs | 
 | (Multi-tenant) |  | (DO DigitalOcean Spaces (S3) - S3) |  | Brevo, Stripe | 
+---------------+     +-------------------+    +-----------------+
                                                 | Google/Apple OAuth
                                                 | Webhooks (Stripe, Brevo)

```

Will be an expanded version of Master ERD with:

PK/FK Notation
Indexes
Constraints

Example:

companies (company_id PK, name, plan_id FK)
users (user_id PK, company_id FK, role_id FK, ...)
roles (role_id PK, name, ...)
properties (property_id PK, company_id FK, developer_id FK, ...)
units (unit_id PK, property_id FK, ...)
map_overlays (overlay_id PK, property_id FK, ...)
overlay_shapes (shape_id PK, overlay_id FK, ...)

## 4.3 Field Standards
- **Primary Keys:** UUIDv4 (or prefixed IDs like `U12345`, `C12345`).
- **Foreign Keys:** Always enforce referential integrity.
- **Timestamps:** `created_at`, `updated_at`, `deleted_at` (soft delete).
- **Indexing:** Composite indexes for frequent queries; JSONB GIN indexes.

## 4.4 Multi-Tenancy Enforcement
- All core tables include `company_id`.
- Queries filtered by `company_id` at repository level.
- Unique constraints scoped to `company_id`.

## 4.5 Data Types & Constraints
- Use correct domain types (e.g., `NUMERIC(12,2)` for currency).
- Enforce NOT NULL on required fields.
- Enum-like constraints for statuses.

## 4.6 Media & File Storage
- **Storage:** DigitalOcean Spaces (S3-compatible) for media.
- **Access:** Presigned URLs for secure client uploads/downloads.
- **Lifecycle Rules:** Auto-archive unused assets after 12 months.

## 4.7 Data Retention & Archival
- Leads: Retained for 2 years post last activity (default).
- Audit Logs: Permanent retention.
- Media: Archived after property/unit deletion unless linked elsewhere.

## 4.8 Backup & Restore
- **Backups:** Full daily backup + 15-minute point-in-time recovery.
- **Retention:** 30 days for daily backups.
- **Testing:** Quarterly restore drill to staging environment.

## 4.9 Acceptance Criteria
- ERD diagram created and approved.
- All core entities have defined PK/FK, constraints, and indexes.
- Multi-tenancy enforced at schema and query layer.
- Backup/restore tested and documented.

---

# Section 5 — Multi-Tenancy & Scaling

## 5.1 Overview
This section defines the scaling strategy and limits for multi-tenant operations, ensuring predictable performance as the system grows.

## 5.2 Tenant Isolation Strategy
- **Logical Isolation:** Single database with `company_id` partitioning.
- **Query Scoping:** All queries automatically filtered by tenant ID.
- **Connection Pooling:** Per-tenant connection limits to prevent resource monopolization.

## 5.3 Scaling Limits & Thresholds

 | Resource | Soft Limit | Hard Limit | Action at Limit | 
 | --------------------- | ---------- | ---------- | --------------- | 
 | Users per tenant | 500 | 1,000 | Manual review | 
 | Properties per tenant | 10,000 | 50,000 | Pagination req. | 
 | Leads per tenant | 100,000 | 500,000 | Archive old | 
 | Storage per tenant | 100 GB | 500 GB | Billing alert | 
 | API calls/hour | 10,000 | 50,000 | Rate limiting | 
 | Concurrent users | 100 | 500 | Queue requests | 

## 5.4 Database Scaling Strategy
- **Vertical Scaling:** Initial approach for v1.
- **Read Replicas:** For reporting workloads (Phase 2).
- **Partitioning:** By `company_id` for large tenants (Phase 3).
- **Sharding:** Horizontal sharding for mega-tenants (Future).

## 5.5 Performance Monitoring
- Alert when any tenant approaches 80% of soft limits.
- Weekly capacity planning reviews.
- Automated scaling for compute resources.

## 5.6 Acceptance Criteria
- Scaling limits documented and enforced.
- Monitoring alerts configured for all thresholds.
- Load testing validates limits.

---

# Section 6 — Search & Filtering Strategy

## 6.1 Overview
Unified search strategy across all CRM modules, balancing performance with functionality.

## 6.2 Search Architecture

### 6.2.1 Text Search
- **Primary:** PostgreSQL full-text search with GIN indexes.
- **Fields Indexed:** Property names/descriptions, lead names/notes, activity summaries.
- **Performance Target:** <500ms for 95% of searches.

### 6.2.2 Faceted Search
- **Properties:** Filter by status, type, developer, price range, area.
- **Leads:** Filter by stage, source, assignment, date range.
- **Activities:** Filter by type, user, date, linked entity.

### 6.2.3 Future Enhancement
- **ElasticSearch:** Consider for Phase 3 if search volume exceeds PostgreSQL capacity.
- **AI-Powered Search:** Semantic search using embeddings (Phase 4).

## 6.3 Search API Design
```
GET /v1/search/global?q={query}&type={entity}&filters={json}
GET /v1/search/properties?q={query}&status={status}&min_price={price}
GET /v1/search/leads?q={query}&stage={stage}&assigned_to={user_id}
```

## 6.4 Caching Strategy
- Cache popular searches for 5 minutes.
- Invalidate on entity updates.
- Pre-warm cache for common filters.

## 6.5 Acceptance Criteria
- Search returns results within 500ms SLA.
- All major entities searchable.
- Filters work correctly with pagination.

---

# Section 7 — User Management & Roles

## 7.1 Overview
The User Management & Roles module governs authentication, authorization, and lifecycle management of all users within a tenant. It ensures secure onboarding, role assignment, and enforcement of permissions.

## 7.2 User Lifecycle
- **Invite:** Super Admin or Admin sends email invite via Brevo; token valid for 72h.
- **Registration:** User completes profile (name, password, optional 2FA setup).
- **Verification:** Email verification mandatory; SMS OTP optional if enabled.
- **Active Use:** RBAC applied to all API/UI actions.
- **Deactivation:** Soft-delete with retention of audit logs; access revoked immediately.
- **Reactivation:** Allowed by Admin/Super Admin within retention period.

### 7.3 Role-Based Access Control (RBAC)

RBAC definitions, default role permissions, enforcement, and audit/compliance policies are now centralized in **Appendix H — Merged RBAC & Authorization**.  
This section inherits all definitions from the appendix to avoid duplication.

See: [Appendix H — Merged RBAC & Authorization](#appendix-h--merged-rbac--authorization)

## 7.4 RBAC Enforcement
- Middleware extracts user role from JWT.
- Permissions checked before service handlers execute.
- Admin overrides restricted to specific modules (e.g., property edits, billing).

## 7.5 Profile Management
- Fields: Salute, First name, Last name, Nickname, Telephone(s), Profile photo.
- Profile photo stored in DigitalOcean Spaces (S3) with presigned URLs.
- Users can update their own profile; Admins can update for staff.

## 7.6 Security Features
- Passwords hashed with Argon2.
- Optional TOTP 2FA setup; QR code generated by API.
- Automatic session invalidation on password change or role change.

## 7.7 Audit & Compliance
- All role changes logged in `audit_logs` with actor, target, timestamp, and changes.
- Login attempts tracked with IP, user agent, and tenant.
- Exportable access logs for compliance audits.

## 7.8 Acceptance Criteria
- User lifecycle fully implemented with invite, activation, and deactivation.
- RBAC enforced consistently across UI and API.
- Profile updates and role changes reflected in real time.
- All role and permission changes recorded in immutable audit logs.

---

# Section 8 — Authentication & Authorization

## 8.1 Overview
This section defines the authentication flows, token management, and authorization mechanisms across the CRM system. It ensures secure identity verification, controlled access to resources, and compliance with industry standards.

### 8.2 Authorization

Authorization policies, role-permission mapping, plan-based feature enforcement, and tenant isolation rules are defined in **Appendix H — Merged RBAC & Authorization**.  
This section references those policies for consistency across the system.

See: [Appendix H — Merged RBAC & Authorization](#appendix-h--merged-rbac--authorization)

## 8.3 Token Strategy
- **Access Token:** Short-lived JWT containing `user_id`, `company_id`, `role`, and permissions.
- **Refresh Token:** Long-lived JWT; rotation with each refresh; invalidated on logout, password change, or suspicious activity.
- **Revocation List:** Stored in cache or DB; checked on every refresh.

## 8.4 Authorization Model
- **RBAC Core:** Role-based access mapped to permissions stored in DB.
- **Plan-Based Feature Flags:** Plan restrictions applied after RBAC check.
- **Tenant Isolation:** All resource access scoped by `company_id` in token.

## 8.5 Login & Signup Flows
- **Super Admin Signup:** Creates new tenant; auto-assigns Super Admin role.
- **Invite Acceptance:** Token-based registration for Admin/Staff.
- **Login:** Email/password or social login → token issuance.
- **2FA Verification:** Code entry after primary authentication.

## 8.6 Security Controls
- **Brute Force Protection:** Rate-limiting per IP/user.
- **Account Lockout:** After 5 failed attempts within 10 minutes.
- **IP Logging:** Store last 5 login IPs with geolocation.
- **Device Tracking:** Maintain list of active sessions; allow remote logout.

## 8.7 API Protection
- All endpoints require Bearer token except public ones (login, signup, invite acceptance).
- CSRF tokens required for browser-based clients on state-changing requests.
- Input validation for all request bodies.

## 8.8 Audit Logging
- Log all logins, logouts, failed attempts, token refreshes, and 2FA events.
- Include timestamp, IP, device info, and outcome.

## 8.9 Acceptance Criteria
- All auth flows implemented with secure password hashing and token handling.
- RBAC and tenant isolation applied consistently.
- 2FA functional and enforceable per tenant.
- All auth-related events recorded in immutable audit logs.

---

# Section 9 — Property Inventory Management

## 9.1 Overview
The Property Inventory Management module manages all real estate property listings, including off-plan projects, ready units, and associated metadata. It serves as the backbone for sales, marketing, and client engagement.

## 9.2 Key Features
- **Property Records:** Create, edit, archive property listings with full metadata.
- **Unit Management:** Add, update, and track status of units (Available, Reserved, Sold).
- **Price History:** Track historical changes in unit prices, discounts, and offers.
- **Virtual Tour Links:** Store as URL fields; support multiple formats.
- **Media Gallery:** Upload and manage images, floor plans, brochures.
- **Developer Linkage:** Associate each property with a registered developer.
- **Custom Fields:** Tenant-defined fields for additional property details.

## 9.3 Off-Plan Project Support
- **Master Plan Upload:** Upload project layout images.
- **Unit Shape Mapping:** Define clickable polygons for units; color-code by status.
- **Versioning:** Maintain historical versions of overlays and shapes.

## 9.4 Data Model Integration
- **Tables:** `properties`, `units`, `price_history`, `media`, `map_overlays`, `overlay_shapes`.
- **Relationships:** One-to-many from properties to units; one-to-many from properties to media; one-to-many from overlays to shapes.
- **Constraints:** Status transitions follow business rules; archived units remain linked to historical sales.

## 9.5 Business Rules
- Status transitions gated by documents/payments where applicable.
- Status changes trigger notifications to assigned agents.
- Status changes must be consistent across property, mapping, and mobile sync modules.
- Mobile-specific: Offline updates queue and sync upon connectivity, conflicts resolved using server authority.---

# Section 14 — Notifications, Messaging & Alerting

## 14.1 Overview
Unified notification system delivering timely, relevant information through multiple channels for both transactional communications and system alerts.

## 14.2 Key Features

### 14.2.1 Transactional Notifications
- Account verification, password resets
- Lead assignments, status updates
- Unit availability changes
- Appointment reminders

### 14.2.2 Marketing Communications
- Newsletters, campaigns, promotional offers
- Requires opt-in consent
- Unsubscribe management

### 14.2.3 System Alerts
- **Priority Levels:** Info, Warning, Critical
- **Escalation Paths:** Auto-escalate critical alerts
- **Configurable Rules:** User-defined triggers
- **Snooze/Mute:** Temporary disable options

### 14.2.4 Delivery Channels
- **Email:** Via Brevo API
- **SMS:** Via Brevo (Phase 2)
- **In-App:** Real-time via WebSocket (Phase 2)
- **Push:** iOS via APNS, Android via FCM (Phase 3)

## 14.3 Template Management
- HTML and text templates with variables
- Version control for templates
- A/B testing support (Phase 2)
- Localization per recipient preference

## 14.4 Data Model
- **Tables:** `notifications`, `notification_templates`, `notification_rules`, `notification_queue`, `notification_logs`
- **Tracking:** Read/unread status, delivery confirmation
- **Preferences:** Per-user channel and frequency settings

## 14.5 Business Rules
- Transactional messages: 1-minute SLA
- Marketing messages: Require consent
- Critical alerts: Multi-channel delivery
- Failed deliveries: 3 retries with backoff
- In-app notifications: 30-day retention

## 14.6 Integrations
- **Brevo:** Email/SMS delivery
- **Workflow Engine:** Trigger from automations
- **Analytics:** Track engagement metrics

## 14.7 Acceptance Criteria
- All notification types delivered within SLA
- 99% delivery success rate
- Templates render correctly across channels
- User preferences respected

---

# Section 15 — Reporting & Analytics

## 15.1 Overview
Comprehensive analytics and reporting system providing real-time insights and historical analysis.

## 15.2 Report Types

### 15.2.1 Pre-Built Reports
- Sales Performance Dashboard
- Lead Conversion Funnel
- Property Inventory Status
- Agent Productivity Metrics
- Financial Summary

### 15.2.2 Custom Reports
- Drag-and-drop report builder
- Custom metrics and calculations
- Saved report templates
- Scheduled generation

## 15.3 Data Visualization
- Interactive charts and graphs
- Heat maps for geographic data
- Trend analysis
- Comparative analytics
- Drill-down capabilities

## 15.4 Real-Time Dashboards
- Customizable widgets
- Role-based dashboards
- Auto-refresh intervals
- Mobile-optimized views

## 15.5 Export & Distribution
- **Formats:** PDF, Excel, CSV, JSON
- **Scheduling:** Daily, weekly, monthly
- **Distribution:** Email, shared links
- **Watermarking:** Tenant and user info

## 15.6 Performance Requirements
- Dashboard load: <2 seconds
- Report generation: <10 seconds
- Export creation: <30 seconds
- Real-time metrics: 1-minute lag

## 15.7 Data Model
- **Tables:** `reports`, `report_templates`, `report_schedules`, `dashboards`, `widgets`
- **Aggregations:** Pre-computed for common metrics
- **Time-series:** Optimized for trend analysis

## 15.8 Acceptance Criteria
- All KPIs accessible via dashboards
- Custom reports created without code
- Exports match displayed data
- Performance SLAs met

---

# Section 16 — Billing & Subscription Management

## 16.1 Overview
The Billing & Subscription Management module governs all aspects of tenant plan management, payment handling, seat limits, and feature access. It integrates directly with Stripe for secure, compliant billing and ensures tenants remain within the terms of their subscription.

## 16.2 Key Features
- **Plan Management:** Multiple tiers (e.g., Basic, Pro, Enterprise) with customizable feature sets.
- **Seat Limit Enforcement:** Automatic validation of active user count at login and during user creation.
- **Billing Cycles:** Support for monthly, annual, and configurable billing periods.
- **Payment Processing:** Stripe-powered checkout, recurring billing, proration, and refunds.
- **Self-Service Portal:** Tenant-managed payment methods, invoice downloads, and plan upgrades/downgrades.
- **Feature Flags:** Dynamic enabling/disabling of CRM features based on plan.
- **Trial Periods:** Customizable trial lengths with automated conversion to paid plans.
- **Dunning Management:** Automated retry schedule and notifications for failed payments.

## 16.3 Data Model Integration
- **Tables:** `plans`, `subscriptions`, `invoices`, `payment_methods`, `billing_history`, `seat_usage`.
- **Relationships:** One-to-many from subscription to invoices; each subscription linked to a single tenant.
- **Constraints:** One active subscription per tenant; plan changes must calculate and apply prorated amounts.

## 16.4 Business Rules
- Tenants without an active subscription cannot access core CRM functions.
- Seat overages must prompt an upgrade or remove excess users before proceeding.
- Payment failures trigger dunning workflow; suspension occurs after defined grace period.
- Feature flags updated instantly on plan change, impacting both API and UI access.

## 16.5 Integrations
- **Stripe API:** For checkout sessions, customer portal, and webhook-based billing event processing.
- **Notifications Module:** Alerts for trial expiry, payment failures, renewals, and plan changes.
- **RBAC System:** Role and feature permissions adjusted dynamically per plan.

## 16.6 Security & Compliance
- PCI compliance through Stripe; no sensitive card data stored in CRM.
- Webhook event signatures validated before processing.
- All billing-related actions and events logged with immutable audit records.
- GDPR compliance for storing customer billing data.

## 16.7 Acceptance Criteria
- Users can subscribe, upgrade, downgrade, and cancel directly from the billing portal.
- Seat limits enforced consistently at all access points.
- Stripe webhook events processed correctly, with accurate invoice and payment status.
- All plan-based feature access enforced in real time and reflected in the UI.
- Dunning process automatically suspends tenants after grace period if payment not resolved.

---

# Section 17 — Data Import, Export & Migration

## 17.1 Overview
Comprehensive data management system for importing, exporting, and migrating CRM data.

## 17.2 Import Capabilities

### 17.2.1 Regular Imports
- **Formats:** CSV, Excel, JSON
- **Entities:** Leads, Properties, Contacts
- **Validation:** Pre-import checks
- **Mapping:** Interactive column mapping
- **Deduplication:** Automatic duplicate detection

### 17.2.2 Migration Tools
- **System Migration:** From other CRMs
- **Format Support:** CSV, Excel, JSON, XML, API
- **Incremental Import:** Delta updates
- **Rollback Points:** Before major migrations
- **Data Transformation:** Field mapping and conversion

## 17.3 Export Capabilities
- **Bulk Export:** All entities
- **Filtered Export:** Based on criteria
- **Scheduled Export:** Automated backups
- **Compliance Export:** GDPR data requests

## 17.4 Data Validation
- **Required Fields:** Enforcement
- **Format Validation:** Email, phone, dates
- **Referential Integrity:** FK validation
- **Business Rules:** Custom validation logic

## 17.5 Performance
- **Async Processing:** For large files
- **Progress Tracking:** Real-time updates
- **Error Handling:** Detailed error logs
- **Partial Success:** Skip invalid rows option

## 17.6 Security
- **Encryption:** File transfer and storage
- **Access Control:** Role-based permissions
- **Audit Trail:** All import/export activities
- **Data Sanitization:** Remove sensitive fields

## 17.7 Acceptance Criteria
- Import/export all entity types
- Handle files up to 100MB
- Process 10,000 records in <5 minutes
- Zero data loss during migration

---

# Section 18 — Audit Logging & Compliance

## 18.1 Overview
The Audit Logging & Compliance module tracks all significant actions within the CRM, ensuring transparency, accountability, and compliance with industry regulations and tenant policies.

## 18.2 Key Features
- **Comprehensive Logging:** Capture user actions, system events, and configuration changes.
- **Immutable Records:** Logs stored in tamper-evident format.
- **Granular Scope:** Log entries include user ID, tenant ID, timestamp, IP address, and action details.
- **Search & Filtering:** UI tools to search logs by date range, user, action type, or entity affected.
- **Retention Policies:** Configurable retention duration per tenant or compliance requirement.
- **Export & Archive:** Secure export of logs for external auditing.

## 18.3 Data Model Integration
- **Tables:** `audit_logs`, `audit_log_archives`.
- **Relationships:** Logs linked to entities they reference (e.g., leads, properties, settings).
- **Constraints:** All critical operations must generate audit entries before committing changes.

## 18.4 Business Rules
- Logs must be immutable; only archival or purge allowed based on retention policy.
- Access to logs restricted to authorized roles (e.g., Admin, Compliance Officer).
- System-generated events must be clearly distinguishable from user actions.
- Exported logs must maintain original structure and metadata.

## 18.5 Integrations
- **Security Module:** Link logs to authentication events and failed login attempts.
- **Notification Module:** Alert compliance officers on specific log patterns (e.g., repeated failed logins).
- **Reporting Module:** Include audit metrics in compliance reports.

## 18.6 Security & Compliance
- Compliance with GDPR, CCPA, and other relevant privacy regulations.
- Encryption of logs at rest and in transit.
- Role-based access with MFA for compliance roles.

## 18.7 Acceptance Criteria
- All defined user and system actions are logged with required details.
- Logs are tamper-evident and immutable within retention period.
- Authorized users can search, filter, and export logs.
- Compliance reports can be generated directly from the audit log data.

---

# Section 19 — Data Archiving & Retention

## 19.1 Overview
The Data Archiving & Retention module manages the lifecycle of CRM data, ensuring inactive or obsolete records are securely archived, retained for the required period, and disposed of in compliance with legal and business policies.

## 19.2 Key Features
- **Automated Archiving:** Scheduled archiving of inactive records based on configurable criteria.
- **Tiered Storage:** Use of cost-effective storage for archived data.
- **Retention Policies:** Customizable per entity type and jurisdiction.
- **Searchable Archives:** Secure search functionality for archived data.
- **Automated Disposal:** Secure deletion of data after retention period ends.
- **Audit Trails:** Logs for all archiving, retrieval, and deletion activities.

## 19.3 Data Model Integration
- **Tables:** `archive_jobs`, `archived_records`, `retention_policies`.
- **Relationships:** Archived records linked to original entity IDs and tenant.
- **Constraints:** Archived data is read-only and encrypted at rest.

## 19.4 Business Rules
- Retention schedules must comply with applicable regulations (e.g., GDPR, HIPAA).
- Retrieval requests require authorization from designated roles.
- Disposal actions require dual confirmation to prevent accidental data loss.
- All archiving actions logged for compliance.

## 19.5 Integrations
- **Search Module:** Enables filtered queries on archived datasets.
- **Compliance Module:** Enforces retention rules per jurisdiction.
- **Backup & DR Module:** Includes archived data in backup strategy.

## 19.6 Security & Compliance
- Encryption using AES-256 for archived data.
- TLS 1.3 for data transfers between archive storage and live systems.
- Compliance with regional and industry-specific retention mandates.
- Access control lists (ACLs) for archive retrieval permissions.

## 19.7 Acceptance Criteria
- 100% of eligible records archived according to retention rules.
- Archived data retrievable within defined SLA.
- Automatic deletion of expired records verified by audit logs.
- No unauthorized access to archived data detected in security audits.

---

# Section 20 — API Management & Integration Governance

## 20.1 Overview
Unified framework for managing internal APIs and external integrations.

## 20.2 API Architecture

### 20.2.1 RESTful API
- **Versioning:** `/v1`, `/v2` with 6-month overlap
- **Authentication:** JWT bearer tokens
- **Rate Limiting:** Per tenant and endpoint
- **Documentation:** OpenAPI 3.0 spec

### 20.2.2 GraphQL (Future)
- Optional for complex queries
- Same auth as REST
- Query complexity limits

### 20.2.3 Webhooks
- **Outbound:** Event notifications
- **Security:** Signed payloads
- **Retry Logic:** Exponential backoff
- **Event Types:** Entity CRUD, status changes

## 20.3 Integration Registry
- **Catalog:** All active integrations
- **Configuration:** Per-tenant settings
- **Monitoring:** Usage and errors
- **Versioning:** Integration compatibility

## 20.4 External Integrations
- **Brevo:** Email/SMS
- **Stripe:** Payments
- **OAuth:** Google, Apple, LinkedIn
- **Calendar:** Google, Outlook
- **Storage:** DigitalOcean Spaces (S3)
- **Future:** Zapier, Salesforce, HubSpot

## 20.5 API Gateway Features
- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- Caching and compression
- Monitoring and analytics

## 20.6 Developer Experience
- **Portal:** Documentation and testing
- **SDKs:** JavaScript/TypeScript
- **Postman Collection:** Pre-built requests
- **Sandbox:** Test environment

## 20.7 Governance
- **Change Management:** Version deprecation policy
- **Security Reviews:** For new integrations
- **Performance Standards:** SLA enforcement
- **Compliance:** Data handling requirements

## 20.7a Integration Data Flow

The following diagram shows the major external integration flows for transactional, billing, and authentication services:

+-------------+          +-------------------+
 | CRM Backend | <------> | Brevo API | 
 | (Webhook) |  | Stripe API | 
 |  | <------> | OAuth Providers | 
+-------------+          +-------------------+

Events:
- Unit status change -> Brevo transactional email
- Subscription change -> Stripe webhook -> Update plan
- User login (social) -> OAuth token -> Profile creation

## 20.8 Acceptance Criteria
- All APIs documented
- Rate limits enforced
- 99.9% uptime SLA
- <200ms p95 latency

---

# Section 21 — Mobile App Features & Synchronization

## 21.1 Overview
Native mobile experience for iOS (v1) with offline capabilities and real-time sync. Android support planned for Phase 3.

## 21.2 Platform Support
- **iOS (v1):** Native app with SwiftUI, iOS 15+
- **Android (Phase 3):** Native app with Kotlin

## 21.3 Core Features
- **Offline Mode:** Full functionality without connection
- **Sync Strategy:** 
  - Delta sync for changes
  - Full sync on demand
  - Conflict resolution with merge logic
- **Push Notifications:** Real-time alerts
- **Biometric Auth:** Face ID, Touch ID
- **Quick Actions:** 3D touch shortcuts

## 21.4 Offline Conflict Resolution
This section outlines how offline data conflicts are detected and resolved between the mobile app and server during synchronization.

## 21.4a Offline Conflict Resolution Examples

The following table outlines common mobile sync conflict scenarios, the default resolution approach, and any exceptions. This ensures predictable handling when the same record is updated both locally and on the server.

 | Entity / Field | Conflict Scenario | Default Resolution | Exceptions / Notes | 
 | ---------------- | ------------------ | -------------------- | -------------------- | 
 | **Lead – Contact Info** | Email or phone updated on both mobile and server | **Manual review** — prompt user to choose which value to keep | Always prioritize verified contact info if available | 
 | **Lead – Notes** | New notes added both locally and on server | **Merge** — append both notes chronologically | Preserve original author metadata | 
 | **Unit – Status** | Status change on both sides (e.g., Available → Reserved vs Available → Sold) | **Admin review** — block auto-update and flag for approval | Auto-resolve only if status change is from lower → higher commitment (Reserved → Sold) | 
 | **Unit – Price** | Price updated in both places | **Last-write-wins** based on timestamp | Notify assigned agent if change > 5% | 
 | **Activity – Completion** | Activity marked complete in both places | **Last-write-wins** | Keep both completion timestamps in audit log | 
 | **Property – Description** | Edited in both places | **Merge text** where possible, else last-write-wins | Apply text diff merge if conflict length < 500 chars | 

---

### Conflict Resolution Workflow
1. Detect conflict during delta sync.  
2. Apply rule from the table above.  
3. If manual review is required, store both versions locally and prompt the user at next app open.  
4. All resolutions must be logged in `sync_conflicts` table with:
   - Entity type
   - Entity ID
   - Conflict type
   - Resolution applied
   - Timestamps

## 21.5 Data Management
- **Local Storage:** Encrypted SQLite
- **Sync Queue:** Pending changes
- **Cache Strategy:** LRU with 100MB limit
- **Media:** Progressive download

## 21.6 Performance Targets
- **App Launch:** <2 seconds
- **Screen Load:** <500ms
- **Full Sync:** <30 seconds
- **Delta Sync:** <5 seconds

## 21.7 Acceptance Criteria
- Offline mode fully functional
- Sync conflicts resolved correctly
- Push notifications delivered
- Performance targets met

---

# Section 22 — Multilingual & Localization Support

## 22.1 Overview
The Multilingual & Localization Support module ensures the CRM is accessible and fully functional across multiple languages and regions, with proper handling for right-to-left (RTL) and left-to-right (LTR) scripts.

## 22.2 Key Features
- **Language Switching:** Real-time language selection without requiring logout.
- **RTL & LTR Support:** Dynamic layout adjustments based on selected language.
- **Localized Date & Number Formats:** Automatic adaptation of currency, date, and number formats.
- **Translation Management:** Centralized system for managing translation keys and strings.
- **Fallback Logic:** Default to English when translations are missing.
- **Regional Settings:** Time zones, address formats, and phone number formats per locale.

## 22.3 Data Model Integration
- **Tables:** `languages`, `translations`, `user_preferences`.
- **Relationships:** User preferences linked to selected language; translations linked to modules and keys.
- **Constraints:** Only approved translations published to production.

## 22.4 Business Rules
- All user-facing text must come from the translation engine.
- Translations must be validated before deployment.
- Default tenant language set at company creation but can be overridden per user.

## 22.5 Integrations
- **UI Components:** All front-end components consume translations via a shared localization library.
- **Notification Module:** Templates localized per recipient's language.
- **Reporting Module:** Report headers and labels localized according to user preferences.

## 22.6 Security & Compliance
- No sensitive information embedded in translation files.
- Translation file changes tracked in version control.
- Compliance with accessibility standards (WCAG) for multilingual content.

## 22.7 Acceptance Criteria
- Users can switch languages without logging out.
- RTL and LTR layouts render correctly with no visual defects.
- All modules display content in the selected language.
- Missing translations fall back to default language seamlessly.

---

# Section 23 — Accessibility & Inclusive Design

## 23.1 Overview
The Accessibility & Inclusive Design module ensures the CRM is usable by people of all abilities and meets global accessibility standards, fostering inclusivity and compliance.

## 23.2 Key Features
- **WCAG Compliance:** Adherence to WCAG 2.1 AA or higher standards.
- **Keyboard Navigation:** Full functionality available without a mouse.
- **Screen Reader Compatibility:** Proper ARIA labels, semantic HTML, and reading order.
- **High Contrast & Text Scaling:** Adjustable themes and font sizes for visibility.
- **Customizable Interaction Methods:** Support for voice input, switch devices, and alternative pointing devices.
- **Error Prevention & Feedback:** Clear error messages and confirmation steps for critical actions.

## 23.3 Data Model Integration
- **Tables:** `accessibility_settings`, `user_accessibility_profiles`.
- **Relationships:** User profiles linked to accessibility preferences.
- **Constraints:** Accessibility settings persist across sessions and devices.

## 23.4 Business Rules
- All UI components tested for accessibility compliance before release.
- No functionality exclusive to a single interaction method.
- Default settings optimized for general accessibility; users can personalize.
- Accessibility compliance checks part of QA and release workflows.

## 23.5 Integrations
- **UI Rendering Engine:** Adapts themes, contrast modes, and scaling dynamically.
- **Notification Module:** Delivers accessible, multi-modal alerts.
- **Analytics Module:** Tracks accessibility feature usage to guide improvements.

## 23.6 Security & Compliance
- Compliance with WCAG, ADA, and regional accessibility regulations.
- Accessibility testing integrated into CI/CD pipeline.
- Privacy-preserving storage of user accessibility preferences.

## 23.7 Acceptance Criteria
- 100% of UI components pass accessibility audits.
- Users can enable/disable accessibility features without requiring admin assistance.
- No critical workflows are inaccessible via keyboard navigation.
- All system messages, notifications, and modals compatible with screen readers.

---

# Section 24 — Backup & Disaster Recovery

## 24.1 Overview
Comprehensive backup and disaster recovery strategy ensuring business continuity.

## 24.2 Backup Strategy
- **Frequency:** 
  - Full daily backups
  - Incremental every 4 hours
  - Transaction logs every 15 minutes
- **Retention:**
  - Daily: 30 days
  - Weekly: 6 months
  - Monthly: 2 years
- **Storage:** Geo-redundant, 3 locations minimum

## 24.3 Recovery Objectives
- **RTO (Recovery Time Objective):** 
  - Critical systems: 1 hour
  - Non-critical: 4 hours
  - Full recovery: 8 hours
- **RPO (Recovery Point Objective):**
  - Database: 15 minutes
  - Files: 4 hours
  - Configs: 24 hours

## 24.4 Disaster Recovery Plan
- **Scenarios Covered:**
  - Data center failure
  - Database corruption
  - Ransomware attack
  - Natural disasters
- **Procedures:**
  - Automated failover for critical services
  - Manual failover approval for data services
  - Communication plan for stakeholders

## 24.5 Testing
- **Frequency:**
  - Monthly: Backup verification
  - Quarterly: Restore drill
  - Semi-annual: Full DR simulation
- **Documentation:** Post-drill reports and improvements

## 24.6 Acceptance Criteria
- All backups complete successfully
- RTO/RPO targets met in tests
- DR plan tested and documented
- Zero data loss in recovery drills

---

# Section 25 — Monitoring & Performance Optimization

## 25.1 Overview
The Monitoring & Performance Optimization module ensures the CRM operates at peak efficiency by continuously tracking system health, performance metrics, and usage patterns, while proactively identifying and resolving bottlenecks.

## 25.2 Key Features
- **Real-Time Monitoring:** Continuous tracking of API response times, database performance, and server health.
- **Custom Dashboards:** Visualizations for CPU, memory, disk usage, and network activity.
- **Error Tracking:** Automatic capture of application errors, exceptions, and failed jobs.
- **Performance Alerts:** Threshold-based alerts for critical performance metrics.
- **Resource Scaling:** Integration with infrastructure auto-scaling for handling high load.
- **Usage Analytics:** Insights into user behavior, feature adoption, and peak usage times.

## 25.3 Data Model Integration
- **Tables:** `performance_metrics`, `error_logs`, `alert_rules`, `system_events`.
- **Relationships:** Metrics linked to specific services and tenants; alerts linked to triggering events.
- **Constraints:** Performance data anonymized where required by privacy regulations.

## 25.4 Business Rules
- Alerts must be acknowledged and resolved within SLA-defined timeframes.
- Regular review of performance data to identify trends and plan optimizations.
- Error logs retained for at least 90 days for debugging and auditing.

> **See also:** [Section 2.10 — Alert Severity Matrix](#section-2-10-alert-severity-matrix--runbooks) 
> for detailed incident classification and resolution procedures.

## 25.5 Integrations
- **Monitoring Tools:** Integration with Datadog, Sentry, or equivalent.
- **Notification Module:** Alerts sent to DevOps via email, SMS, or chat integrations.
- **Deployment Pipeline:** Performance tests run as part of CI/CD process.

## 25.6 Security & Compliance
- Access to monitoring tools restricted to authorized personnel.
- All monitoring data encrypted at rest and in transit.
- Compliance with internal security policies for log retention and access control.

## 25.7 Acceptance Criteria
- Real-time dashboards display accurate system health metrics.
- Alerts trigger within defined thresholds and reach the correct on-call personnel.
- Performance issues identified are documented and resolved within SLA.
- System maintains agreed-upon uptime and response time SLAs.

---

# Section 26 — Deployment, DevOps & Release Management

## 26.1 Overview
Unified deployment and release strategy combining DevOps practices with release governance.

## 26.2 CI/CD Pipeline

### 26.2.1 Build Pipeline
- **Trigger:** Code push to main/develop
- **Steps:**
  1. Code checkout
  2. Dependency installation
  3. Linting and formatting
  4. Unit tests
  5. Integration tests
  6. Security scanning
  7. Build artifacts
  8. Container creation

### 26.2.2 Deployment Pipeline
- **Environments:** Dev → Staging → Production
- **Strategy:** 
  - Blue-green for zero downtime
  - Canary for gradual rollout
  - Rollback capability

## 26.3 Infrastructure As Code
- **Tools:** Terraform for infrastructure
- **Version Control:** All configs in Git
- **Change Review:** PR approval required

## 26.4 Release Management

### 26.4.1 Release Cycle
- **Frequency:** Bi-weekly sprints
- **Types:**
  - Feature releases: Planned
  - Hotfixes: Emergency
  - Security patches: Priority

### 26.4.2 Release Process
1. Feature freeze
2. QA validation
3. UAT sign-off
4. Release notes preparation
5. Deployment approval
6. Production deployment
7. Post-deployment validation
8. Stakeholder notification

## 26.5 Environment Management
- **Development:** Latest code, unstable
- **Staging:** Production mirror
- **Production:** Stable releases only
- **Hotfix:** Emergency patch testing

## 26.6 Feature Flags
- **Management:** LaunchDarkly or custom
- **Types:** Release, experiment, ops
- **Rollout:** Percentage-based
- **Monitoring:** Flag performance impact

## 26.7 Rollback Strategy
- **Database:** Point-in-time recovery
- **Application:** Previous container version
- **Configuration:** Git revert
- **Time Target:** <15 minutes

## 26.8 DevOps Practices
- **Monitoring:** All deployments
- **Alerting:** Failure notifications
- **Documentation:** Runbooks
- **Automation:** Maximum coverage

## 26.9 Acceptance Criteria
- Zero-downtime deployments
- Rollback within 15 minutes
- 100% automated deployment
- Release notes auto-generated

---

# Section 27 — Testing & Quality Assurance

## 27.1 Overview
Comprehensive testing strategy ensuring quality at all levels.

## 27.2 Testing Levels

### 27.2.1 Unit Testing
- **Coverage:** Minimum 80%
- **Framework:** Jest for JavaScript
- **Execution:** On every commit

### 27.2.2 Integration Testing
- **Scope:** API endpoints, database
- **Framework:** Supertest
- **Data:** Isolated test database

### 27.2.3 End-to-End Testing
- **Coverage:** Critical user flows
- **Framework:** Cypress
- **Execution:** Before release

### 27.2.4 User Acceptance Testing (UAT)
- **Participants:** Business stakeholders
- **Duration:** 3-5 days per release
- **Environment:** Staging
- **Sign-off:** Required for production

## 27.3 Performance Testing
- **Load Testing:** Normal conditions
- **Stress Testing:** Peak conditions
- **Spike Testing:** Sudden load
- **Soak Testing:** Extended duration

## 27.4 Security Testing
- **SAST:** Static code analysis
- **DAST:** Dynamic testing
- **Penetration:** Annual third-party
- **Dependency:** Vulnerability scanning

## 27.5 Mobile Testing

**Mobile Testing Tools:**  
- XCUITest for iOS UI automation  
- XCTest for iOS unit/UI tests  
- Appium for cross-platform mobile automation  

- **Devices:** Top 10 iOS devices
- **OS Versions:** Current and previous
- **Networks:** 3G, 4G, 5G, WiFi
- **Offline:** Full offline scenarios

## 27.6 Test Data Management
- **Generation:** Faker.js for synthetic
- **Anonymization:** Production copies
- **Cleanup:** After test runs
- **Compliance:** GDPR compliant

## 27.7 Defect Management
- **Severity Levels:** Critical, High, Medium, Low
- **SLA:** Critical - 4hrs, High - 24hrs
- **Tracking:** Jira or Linear
- **Metrics:** Defect density, escape rate

## 27.8 Acceptance Criteria
- 90% automated test coverage
- Zero critical defects in production
- UAT sign-off for all releases
- Performance SLAs met

---

# Section 28 — Training & User Support

## 28.1 Overview
The Training & User Support module ensures users can effectively utilize the CRM by providing accessible learning materials, onboarding assistance, and responsive technical support channels.

## 28.2 Key Features
- **Interactive Onboarding:** Step-by-step guided tours for new users.
- **Knowledge Base:** Central repository of articles, FAQs, and how-to guides.
- **Video Tutorials:** Short, task-oriented videos covering common workflows.
- **Contextual Help:** Tooltips and embedded documentation within the UI.
- **Support Channels:** Email, live chat, and ticketing system for issue reporting.
- **User Feedback Loop:** Built-in feedback submission to suggest improvements.

## 28.3 Data Model Integration
- **Tables:** `support_tickets`, `knowledge_base_articles`, `training_modules`, `feedback_entries`.
- **Relationships:** Support tickets linked to users and tenants; feedback linked to feature requests.
- **Constraints:** Knowledge base articles versioned for accuracy across product releases.

## 28.4 Business Rules
- Support SLAs defined by subscription tier (e.g., priority support for Enterprise clients).
- Onboarding content auto-assigned to new users based on their role.
- Feedback entries reviewed weekly by product management.

## 28.5 Integrations
- **Notification Module:** Alerts users when ticket status changes.
- **Analytics Module:** Tracks usage of knowledge base articles and tutorial videos.
- **CRM Updates:** Knowledge base auto-updated during feature releases.

## 28.6 Security & Compliance
- Support tickets scrubbed of sensitive data before escalation.
- Knowledge base access scoped to tenant and subscription tier.
- Compliance with data protection laws for handling user support communications.

## 28.7 Acceptance Criteria
- New users complete onboarding with demonstrated understanding of core CRM functions.
- Support tickets resolved within SLA-defined timelines.
- Knowledge base and tutorial library cover at least 95% of common support queries.
- Feedback mechanism actively used and results incorporated into product roadmap.

---

# Section 29 — Documentation & Knowledge Management

## 29.1 Overview
The Documentation & Knowledge Management module ensures that all CRM-related information—technical, functional, and operational—is accurately recorded, easily accessible, and consistently maintained for internal teams and end users.

## 29.2 Key Features
- **Developer Documentation:** Detailed API references, architecture diagrams, and module specifications.
- **User Documentation:** Step-by-step guides, FAQs, and best practice documents for end users.
- **Release Notes:** Versioned change logs detailing new features, fixes, and known issues.
- **Internal Wiki:** Centralized repository for process documentation, decision logs, and design discussions.
- **Searchable Repository:** Indexed content with advanced search and filtering.
- **Version Control:** Documentation stored and managed alongside code for synchronization with releases.

## 29.3 Data Model Integration
- **Tables:** `documentation_pages`, `documentation_versions`, `release_notes`.
- **Relationships:** Documentation linked to modules and release versions; version history maintained per document.
- **Constraints:** Only approved contributors can publish or modify documentation.

## 29.4 Business Rules
- All new features must include updated user and developer documentation before release.
- Documentation reviewed quarterly to ensure accuracy.
- Internal process changes documented within one week of approval.

## 29.5 Integrations
- **CI/CD Pipeline:** Automatically publishes updated documentation with new releases.
- **Knowledge Base Module:** Shares content with public-facing support portals.
- **Search Service:** Enables keyword and metadata-based content retrieval.

## 29.6 Security & Compliance
- Sensitive architectural and operational details restricted to authorized roles.
- Public documentation reviewed for compliance with export control and data privacy laws.
- Documentation changes tracked for audit purposes.

## 29.7 Acceptance Criteria
- Documentation repository covers 100% of active modules and features.
- All content indexed and searchable within 2 seconds.
- Users and developers can locate relevant documentation in ≤ 3 clicks.
- Documentation updated within release cycle for all changes.

---

# Section 30 — Compliance & Regulatory Requirements

## 30.1 Overview
The Compliance & Regulatory Requirements module ensures the CRM adheres to applicable laws, industry standards, and tenant-specific contractual obligations, reducing legal and operational risks.

## 30.2 Key Features
- **Regulation Mapping:** Identify and document relevant regulations (e.g., GDPR, CCPA, PCI DSS, ISO 27001, SOC 2).
- **Policy Enforcement:** Implement automated checks and workflows to enforce compliance.
- **Consent Management:** Track user consent for data collection and processing.
- **Data Retention Policies:** Automated enforcement of retention schedules per regulation.
- **Right-to-Access & Right-to-Be-Forgotten:** Self-service tools for data requests and deletion.
- **Audit Trails:** Maintain complete logs to support compliance audits.

## 30.3 Data Model Integration
- **Tables:** `compliance_policies`, `consent_records`, `regulatory_audits`.
- **Relationships:** Consent records linked to users; policies linked to applicable tenants and regions.
- **Constraints:** Policies version-controlled; consent changes logged for traceability.

## 30.4 Business Rules
- Regulatory updates must be reviewed and applied within defined SLA.
- Only authorized compliance officers can approve policy changes.
- Data processing agreements stored and linked to applicable tenants.
- Consent revocation triggers cessation of all related data processing.

## 30.5 Integrations
- **Audit Logging Module:** Stores all compliance-relevant actions.
- **Security Module:** Ensures encryption and access controls meet regulatory requirements.
- **Notification Module:** Alerts compliance officers to upcoming deadlines or regulation changes.

## 30.6 Security & Compliance
- Compliance with GDPR, CCPA, and relevant local laws in operating regions.
- Periodic internal and external compliance audits.
- Documentation repository for regulatory certifications and audit reports.

## 30.7 Acceptance Criteria
- All required regulations mapped and actively monitored.
- Policies enforced automatically across CRM modules.
- Users can manage consent via self-service tools.
- Compliance audits pass without major findings.

---

# Section 31 — Change Management

## 31.1 Overview
The Change Management module governs how modifications—whether technical, functional, or operational—are proposed, reviewed, approved, and implemented within the CRM, ensuring stability, traceability, and stakeholder alignment.

## 31.2 Key Features
- **Change Request Workflow:** Standardized process for submitting and tracking changes.
- **Impact Assessment:** Evaluation of potential effects on system performance, security, and user experience.
- **Approval Hierarchies:** Role-based authorization for change approvals.
- **Change Calendar:** Scheduling changes to minimize disruption.
- **Rollback Planning:** Predefined rollback strategies for each change.
- **Post-Implementation Review:** Assessing outcomes and identifying improvement opportunities.

## 31.3 Data Model Integration
- **Tables:** `change_requests`, `change_approvals`, `change_reviews`.
- **Relationships:** Requests linked to initiating user, module, and related tickets; approvals linked to approvers.
- **Constraints:** All changes require at least one approver outside the requesting team.

## 31.4 Business Rules
- Emergency changes follow expedited but documented workflows.
- All changes logged in audit trail with timestamps and responsible parties.
- Changes scheduled to avoid peak usage periods unless critical.
- Rollback plans tested before major releases.

## 31.5 Integrations
- **Issue Tracking System:** Links change requests to related bug fixes, features, or improvements.
- **Notification Module:** Alerts stakeholders about scheduled and completed changes.
- **Monitoring Module:** Validates system health post-change.

## 31.6 Security & Compliance
- Access to change management tools restricted to authorized roles.
- Compliance with ISO 27001 and SOC 2 change control standards.
- Documentation of all approvals and reviews retained for audits.

## 31.7 Acceptance Criteria
- 100% of changes follow defined workflows with required approvals.
- All high-impact changes undergo formal impact assessment.
- No unplanned downtime or major incidents resulting from changes.
- Post-implementation reviews completed for all significant changes.

---

# Section 32 — Third-Party Vendor Management

## 32.1 Overview
The Third-Party Vendor Management module governs the evaluation, onboarding, monitoring, and offboarding of external vendors, ensuring all integrations and services meet business, security, and compliance requirements.

## 32.2 Key Features
- **Vendor Registry:** Centralized repository of approved vendors with contact details and service descriptions.
- **Risk Assessment:** Evaluation of vendor security posture, compliance certifications, and financial stability.
- **Performance Monitoring:** Ongoing review of vendor service levels against contractual obligations.
- **Contract Management:** Storage and tracking of vendor agreements, renewal dates, and termination clauses.
- **Incident Reporting:** Workflow for logging and resolving vendor-related issues.
- **Offboarding Procedures:** Steps to ensure secure disengagement from a vendor relationship.

## 32.3 Data Model Integration
- **Tables:** `vendors`, `vendor_contracts`, `vendor_risk_assessments`, `vendor_performance_reviews`.
- **Relationships:** Vendors linked to related services, contracts, and incidents.
- **Constraints:** Vendors must have active risk assessment before integration.

## 32.4 Business Rules
- All vendors undergo initial and periodic risk assessments.
- Vendors failing performance or compliance reviews must follow corrective action plans.
- Contract renewals require sign-off from legal, procurement, and security teams.
- Vendor offboarding includes revoking system access and deleting shared data.

## 32.5 Integrations
- **Compliance Module:** Validates vendor adherence to regulatory requirements.
- **Security Module:** Monitors vendor connections for anomalies.
- **Notification Module:** Sends alerts for expiring contracts and overdue reviews.

## 32.6 Security & Compliance
- Vendor access restricted to required systems and data.
- Contracts include mandatory security and compliance clauses.
- Vendor assessments aligned with ISO 27001, SOC 2, and applicable regulations.

## 32.7 Acceptance Criteria
- 100% of vendors have completed and approved risk assessments.
- No active contracts expire without review.
- All vendor incidents tracked and resolved within SLA.
- Offboarded vendors have zero remaining system access or retained sensitive data.

---

# Section 33 — Maintenance & Continuous Improvement

## 33.1 Overview
The Maintenance & Continuous Improvement module defines the processes and practices for keeping the CRM platform stable, up to date, and aligned with evolving business and technical requirements.

## 33.2 Key Features
- **Scheduled Maintenance:** Regularly planned maintenance windows with minimal disruption.
- **Patch Management:** Deployment of security patches, bug fixes, and dependency updates.
- **Feature Iteration:** Continuous improvement cycles for enhancing existing features.
- **Technical Debt Management:** Tracking and prioritizing refactoring tasks.
- **Performance Tuning:** Ongoing analysis and optimization of system performance.
- **User Feedback Loop:** Incorporating user suggestions into development roadmaps.

## 33.3 Data Model Integration
- **Tables:** `maintenance_logs`, `patch_history`, `improvement_backlog`.
- **Relationships:** Maintenance logs linked to environments; backlog items linked to originating feedback or metrics.
- **Constraints:** All production changes documented and approved before execution.

## 33.4 Business Rules
- Security patches applied within SLA timelines based on severity.
- Major improvements scheduled alongside quarterly release cycles.
- Maintenance activities communicated to affected tenants at least 48 hours in advance.
- Feedback-driven improvements must be reviewed for feasibility and ROI.

## 33.5 Integrations
- **Monitoring Module:** Identifies performance or stability issues for improvement.
- **Notification Module:** Communicates maintenance schedules and post-maintenance status.
- **Issue Tracking System:** Tracks improvement tasks and their implementation status.

## 33.6 Security & Compliance
- Maintenance processes follow change management protocols.
- Post-maintenance security scans required before releasing updated systems.
- Compliance checks run after each patch to validate adherence to regulations.

## 33.7 Acceptance Criteria
- No unplanned downtime resulting from maintenance activities.
- All critical security patches deployed within SLA.
- Continuous improvement backlog regularly updated and prioritized.
- User satisfaction metrics improve over successive release cycles.

---

# Section 34 — Customization & Extensibility

## 34.1 Overview
The Customization & Extensibility module empowers tenants to adapt the CRM to their unique workflows without requiring core code modifications, ensuring flexibility while maintaining stability and security.

## 34.2 Key Features
- **Custom Fields:** Add and manage entity-specific fields with validation rules.
- **Custom Modules:** Create additional functional modules via an extension framework.
- **Workflow Automation:** Tenant-defined triggers, conditions, and actions.
- **UI Customization:** Adjust layouts, themes, and dashboard widgets per user or role.
- **Scripting Support:** Sandbox environment for executing safe, tenant-specific scripts.
- **Marketplace Integration:** Browse and install verified extensions.

## 34.3 Data Model Integration
- **Tables:** `custom_fields`, `custom_modules`, `workflow_rules`, `installed_extensions`.
- **Relationships:** Custom fields linked to core entities; workflows linked to triggers and actions.
- **Constraints:** All custom elements scoped to tenant; sandbox enforces execution limits.

## 34.4 Business Rules
- Extensions must pass validation before activation.
- Custom scripts limited in execution time and resource usage.
- Workflow automations logged for auditing.
- UI changes must not break accessibility or responsiveness standards.

### Extension Versioning & Update Policy

To ensure stability, security, and compatibility across tenant environments, all extensions must follow a clear versioning and update process.

#### Versioning Standard
- **Semantic Versioning (SemVer)** is required:
  - **MAJOR** — Breaking changes that require manual migration or may alter existing behavior.
  - **MINOR** — Backward-compatible feature additions.
  - **PATCH** — Backward-compatible bug fixes and security patches.
- Versions must be stored in the `installed_extensions` table alongside:
  - Extension ID
  - Version number
  - Install date
  - Last update date
  - Update source (manual, auto)

#### Update Channels
- **Stable:** Default for all tenants; only receives tested and approved releases.
- **Beta:** Optional opt-in; early access to new features, may include bugs.
- **Manual:** Tenant controls when to apply updates; recommended for mission-critical workflows.

#### Update Workflow
1. **Compatibility Check**  
   - Verify CRM core version compatibility before allowing update.
2. **Pre-Update Snapshot**  
   - Backup extension configuration and related data.
3. **Update Execution**  
   - Apply update in a sandbox first, verify functionality, then apply to production.
4. **Post-Update Verification**  
   - Run automated tests (UI/API) on updated extension.
5. **Rollback Option**  
   - Allow revert to last known good version within 7 days.

#### Security Requirements
- All updates must pass:
  - Vulnerability scan
  - Code signing verification
  - Extension permission re-validation
- Auto-updates disabled if:
  - Security scan fails
  - Incompatible CRM core version detected

#### Audit Logging
- Every extension install/update/rollback must create an entry in `audit_logs` with:
  - Tenant ID
  - Extension ID
  - Old version
  - New version
  - Action type (install, update, rollback)
  - Actor (system, tenant admin)
  - Timestamp

## 34.5 Integrations
- **API Management Module:** Exposes APIs for extension developers.
- **Audit Logging Module:** Records creation and modification of custom elements.
- **Security Module:** Validates extensions for vulnerabilities before deployment.

## 34.6 Security & Compliance
- All custom code executed in isolated, tenant-specific sandboxes.
- Extensions vetted for compliance with GDPR and CCPA.
- Permission checks enforced for customization management.

## 34.7 Acceptance Criteria
- Tenants can add and manage custom fields, workflows, and modules without developer assistance.
- Extensions can be installed, configured, and removed without downtime.
- UI customizations persist across sessions and devices.
- Customizations do not degrade system performance or compromise security.

---

# Section 35 — Workflow Automation

## 35.1 Overview
The Workflow Automation module streamlines repetitive tasks, enforces business rules, and ensures consistent processes across the CRM by enabling the creation, execution, and monitoring of automated workflows.

## 35.2 Key Features
- **Visual Workflow Builder:** Drag-and-drop interface to define triggers, conditions, and actions.
- **Pre-Built Templates:** Common workflows for lead assignment, follow-ups, and approvals.
- **Conditional Logic:** Branching paths based on data values or user input.
- **Multi-Step Actions:** Sequential or parallel execution of tasks.
- **Event Triggers:** Based on record creation, updates, status changes, or scheduled times.
- **Workflow Scheduling:** Timed execution and delayed actions.

## 35.3 Data Model Integration
- **Tables:** `workflows`, `workflow_steps`, `workflow_triggers`, `workflow_logs`.
- **Relationships:** Workflows linked to modules, tenants, and triggering events.
- **Constraints:** Workflows must pass validation checks before activation.

## 35.4 Business Rules
- All workflows must include at least one trigger and one action.
- High-impact workflows require admin approval before deployment.
- Workflow changes logged with version history.
- Failed workflow executions generate error alerts for review.

### Workflow Automation SLA & Limits

To ensure consistent performance and prevent abuse, workflow automation execution is subject to defined service-level agreements (SLAs) and operational limits.

#### Execution SLAs
 | Metric | Target | Notes | 
 | -------- | -------- | ------- | 
 | Trigger Detection Time | ≤ 2 seconds | Time from event occurrence to workflow queue insertion | 
 | Action Execution Delay | ≤ 5 seconds | Time from trigger to first action execution start | 
 | Workflow Completion | ≤ 30 seconds | For workflows with ≤ 5 sequential actions | 
 | Failure Retry Delay | Initial: 15 seconds | Exponential backoff up to 5 retries | 
 | Uptime | ≥ 99.9% monthly | Measured per environment | 

#### Operational Limits
- **Max Active Workflows per Tenant:**  
  - Starter: 5  
  - Professional: 25  
  - Enterprise: Unlimited
- **Max Steps per Workflow:**  
  - Starter: 5  
  - Professional: 15  
  - Enterprise: 50
- **Max Concurrent Executions per Tenant:**  
  - Starter: 20  
  - Professional: 100  
  - Enterprise: 500
- **Max Payload Size:** 256KB per action

#### Failure Handling
1. All failed executions are logged in `workflow_logs` with:
   - Workflow ID
   - Step ID
   - Error message
   - Retry count
   - Timestamps
2. If retries are exhausted:
   - Notify tenant admin
   - Mark execution as “Failed” in the UI
   - Provide option to re-run manually

#### Monitoring
- SLA compliance tracked via the Monitoring Module (Section 25).
- Monthly SLA reports available per tenant.
- Alerts triggered if SLA thresholds are breached.

## 35.5 Integrations
- **Notification Module:** Sends alerts based on workflow actions.
- **API Module:** Invokes external services as part of workflow actions.
- **Task Management Module:** Creates or updates tasks automatically from workflows.

## 35.6 Security & Compliance
- Role-based access control for workflow creation and modification.
- Audit trails for all workflow executions.
- Compliance with data privacy regulations for automated data processing.

## 35.7 Acceptance Criteria
- Users can create, activate, and monitor workflows without technical intervention.
- All active workflows execute within defined SLA times.
- No unauthorized modifications to workflows detected.
- Workflow failure rate remains within acceptable operational thresholds.

---

# Section 36 — Future Enhancements & Roadmap

## 36.1 Overview
Strategic roadmap for future CRM enhancements beyond initial release phases.

## 36.2 Phase 2 Enhancements (Q2-Q3 2025)
- Off-plan unit mapping tool
- SMS/OTP authentication
- Marketing lists and segmentation
- Advanced import wizard
- Push notifications
- WebSocket real-time updates

## 36.3 Phase 3 Enhancements (Q4 2025)
- Android mobile app
- Social login (Google, Apple, LinkedIn)
- Advanced reporting builder
- Calendar synchronization
- Email integration (IMAP/SMTP)
- Zapier integration

## 36.4 Phase 4 Enhancements (2026)
- AI-powered lead scoring
- Predictive analytics
- Natural language search
- Voice interface
- Virtual property tours
- Blockchain property records

## 36.5 Long-term Vision (2026+)
- Multi-language voice assistant
- AR property visualization
- IoT integration for smart buildings
- Automated contract generation
- Cross-platform marketplace
- White-label solutions

## 36.6 Technical Debt Roadmap
- Microservices migration
- GraphQL implementation
- ElasticSearch integration
- Kubernetes orchestration
- Event-driven architecture
- Real-time collaboration

## 36.7 Integration Roadmap
- **CRM:** Salesforce, HubSpot, Pipedrive
- **ERP:** SAP, Oracle, Microsoft Dynamics
- **Marketing:** Mailchimp, SendGrid, Twilio
- **Analytics:** Google Analytics, Mixpanel
- **Finance:** QuickBooks, Xero
- **Communication:** Slack, Teams, WhatsApp Business

## 36.8 Acceptance Criteria
- Roadmap reviewed quarterly
- Customer feedback incorporated
- Technical feasibility validated
- Business case for each enhancement

---

- [Appendix H — Merged RBAC & Authorization](#appendix-h--merged-rbac--authorization)
- [Appendix A — Glossary](#appendix-a--glossary)
# Appendix B — Environment Variables

## Required Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Authentication
JWT_SECRET=<32-char-random-string>
JWT_EXPIRY=15m
REFRESH_JWT_SECRET=<32-char-random-string>
REFRESH_JWT_EXPIRY=14d
TOTP_SECRET=<16-char-random-string>

# API Configuration
NODE_ENV=development|staging|production
PORT=3000
API_BASE_URL=https://api.example.com
APP_BASE_URL=https://app.example.com

# Email Service (Brevo)
BREVO_API_KEY=<api-key>
BREVO_SENDER_EMAIL=noreply@example.com
BREVO_SENDER_NAME=CRM System

# Payment (Stripe)
STRIPE_SECRET_KEY=<secret-key>
STRIPE_WEBHOOK_SECRET=<webhook-secret>
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_PRO=price_yyy
STRIPE_PRICE_ENTERPRISE=price_zzz

# Storage (DigitalOcean Spaces (S3))
SPACES_KEY=<access-key>
SPACES_SECRET=<secret-key>
SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
SPACES_BUCKET=crm-media
SPACES_REGION=nyc3

# Monitoring
SENTRY_DSN=<sentry-dsn>
DATADOG_API_KEY=<api-key>
LOG_LEVEL=debug|info|warn|error

# Feature Flags
ENABLE_MOBILE_SYNC=true
ENABLE_MARKETING_CAMPAIGNS=false
ENABLE_AI_FEATURES=false

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET=<32-char-random-string>
CORS_ORIGINS=https://app.example.com,https://admin.example.com
```

## Optional Variables

```env
# Redis (if Using)
REDIS_URL=redis://localhost:6379

# OAuth (Phase 3)
GOOGLE_CLIENT_ID=<client-id>
GOOGLE_CLIENT_SECRET=<client-secret>
APPLE_CLIENT_ID=<client-id>
APPLE_CLIENT_SECRET=<client-secret>

# Push Notifications
FCM_SERVER_KEY=<server-key>
APNS_KEY_ID=<key-id>
APNS_TEAM_ID=<team-id>

# Analytics
GA_TRACKING_ID=<tracking-id>
MIXPANEL_TOKEN=<token>
```

---

# Appendix C — API Request/Response Examples

## Authentication

### Login Request
```http
POST /v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "totp_code": "123456"  // optional
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
    "expires_in": 900,
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin",
      "company_id": "cmp_456"
    }
  }
}
```

## Properties

### Create Property Request
```http
POST /v1/properties
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sunset Towers",
  "type": "residential",
  "status": "available",
  "developer_id": "dev_789",
  "address": {
    "street": "123 Main St",
    "city": "Cairo",
    "country": "Egypt",
    "postal_code": "12345"
  },
  "description": "Luxury residential complex",
  "amenities": ["pool", "gym", "parking"],
  "total_units": 100,
  "available_units": 75
}
```

### List Properties Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prop_001",
        "name": "Sunset Towers",
        "type": "residential",
        "status": "available",
        "developer": {
          "id": "dev_789",
          "name": "ABC Developers"
        },
        "units_summary": {
          "total": 100,
          "available": 75,
          "reserved": 20,
          "sold": 5
        },
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "cursor": "eyJpZCI6InByb3BfMDAxIn0=",
      "has_next": true,
      "total": 150
    }
  }
}
```

## Leads

### Create Lead Request
```http
POST /v1/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+201234567890",
  "source": "website",
  "stage": "new",
  "assigned_to": "usr_123",
  "properties_interested": ["prop_001", "prop_002"],
  "budget_min": 500000,
  "budget_max": 1000000,
  "notes": "Looking for 3-bedroom unit"
}
```

## Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email already exists for this tenant"
      }
    ],
    "trace_id": "abc123def456"
  }
}
```

# Additional API Request/Response Examples

## Units — Update Status
**Request**
```http
PATCH /v1/units/unit_123/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "reserved",
  "reserved_by": "usr_456"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "unit_123",
    "status": "reserved",
    "reserved_by": {
      "id": "usr_456",
      "name": "Jane Doe"
    },
    "updated_at": "2024-05-12T10:30:00Z"
  }
}
```

---

## Workflow — Trigger Manually
**Request**
```http
POST /v1/workflows/wf_789/trigger
Authorization: Bearer <token>
Content-Type: application/json

{
  "input": {
    "lead_id": "lead_001",
    "priority": "high"
  }
}
{
  "success": true,
  "data": {
    "workflow_id": "wf_789",
    "execution_id": "exec_101",
    "status": "started",
    "started_at": "2024-05-12T10:32:00Z"
  }
}
```

---

## Reports — Fetch By ID
**Request**
```http
GET /v1/reports/report_555
Authorization: Bearer <token>
Accept: application/json
{
  "success": true,
  "data": {
    "id": "report_555",
    "name": "Monthly Sales Summary",
    "generated_at": "2024-05-01T00:00:00Z",
    "filters": {
      "tenant_id": "cmp_123",
      "date_range": "2024-04-01 to 2024-04-30"
    },
    "metrics": {
      "total_sales": 1250000,
      "units_sold": 57,
      "conversion_rate": 0.21
    }
  }
}
```

---

## Error Response — Example for Invalid Workflow Trigger
```json
{
  "success": false,
  "error": {
    "code": "WORKFLOW_INVALID_INPUT",
    "message": "Required field 'lead_id' is missing in workflow input",
    "trace_id": "abc123def456"
  }
}
```

---

# Appendix D — Subscription Plans & Feature Matrix

## Plan Comparison

 | Feature Category | Starter | Professional | Enterprise | 
 | ----------------- | --------- | -------------- | ------------ | 
 | **Pricing** | 
 | Monthly Price | $99/month | $299/month | Custom | 
 | Annual Discount | 20% | 20% | Negotiable | 
 | Setup Fee | Free | Free | Custom | 
 | **Users & Access** | 
 | Admin Users | 1 | 5 | Unlimited | 
 | Staff Users | 4 | 15 | Unlimited | 
 | Read-Only Users | Unlimited | Unlimited | Unlimited | 
 | SSO/SAML | - | - | ✓ | 
 | **Data Limits** | 
 | Active Properties | 100 | 1,000 | Unlimited | 
 | Active Leads | 1,000 | 10,000 | Unlimited | 
 | Storage | 10 GB | 100 GB | 1 TB+ | 
 | File Upload Size | 10 MB | 50 MB | 100 MB | 
 | **Features** | 
 | Web Application | ✓ | ✓ | ✓ | 
 | iOS App | ✓ | ✓ | ✓ | 
 | Android App | - | ✓ | ✓ | 
 | Offline Mode | - | ✓ | ✓ | 
 | **Integrations** | 
 | Email (Brevo) | 1,000/mo | 10,000/mo | Unlimited | 
 | SMS | - | 500/mo | Custom | 
 | API Access | Read Only | Full | Full | 
 | API Rate Limit | 1,000/hr | 10,000/hr | Custom | 
 | Webhooks | - | 5 | Unlimited | 
 | Zapier | - | ✓ | ✓ | 
 | **Reporting** | 
 | Basic Reports | ✓ | ✓ | ✓ | 
 | Custom Reports | 3 | 25 | Unlimited | 
 | Scheduled Reports | - | ✓ | ✓ | 
 | Data Export | CSV | CSV, Excel | All Formats | 
 | **Customization** | 
 | Custom Fields | 5 | 25 | Unlimited | 
 | Custom Workflows | - | 10 | Unlimited | 
 | White Labeling | - | - | ✓ | 
 | Custom Domain | - | - | ✓ | 
 | **Support** | 
 | Knowledge Base | ✓ | ✓ | ✓ | 
 | Email Support | 48hr SLA | 24hr SLA | 4hr SLA | 
 | Phone Support | - | Business Hours | 24/7 | 
 | Dedicated Manager | - | - | ✓ | 
 | Training Sessions | - | 2/year | Monthly | 
 | **Security & Compliance** | 
 | Data Encryption | ✓ | ✓ | ✓ | 
 | 2FA | Optional | Required | Required | 
 | Audit Logs | 30 days | 1 year | Unlimited | 
 | GDPR Tools | ✓ | ✓ | ✓ | 
 | SLA | - | 99.5% | 99.9% | 
 | Custom Contracts | - | - | ✓ | 

## Feature Flags Configuration

```json
{
  "starter": {
    "max_users": 5,
    "max_properties": 100,
    "max_leads": 1000,
    "enable_ios_app": true,
    "enable_android_app": false,
    "enable_offline_mode": false,
    "enable_custom_reports": false,
    "enable_api_write": false,
    "enable_webhooks": false,
    "enable_workflow_automation": false
  },
  "professional": {
    "max_users": 20,
    "max_properties": 1000,
    "max_leads": 10000,
    "enable_ios_app": true,
    "enable_android_app": true,
    "enable_offline_mode": true,
    "enable_custom_reports": true,
    "enable_api_write": true,
    "enable_webhooks": true,
    "enable_workflow_automation": true
  },
  "enterprise": {
    "max_users": -1,
    "max_properties": -1,
    "max_leads": -1,
    "enable_all_features": true
  }
}
```

---

# Appendix E — Compliance Checklist

## GDPR Compliance

 | Requirement | Implementation | Status | 
 | ------------ | --------------- | -------- | 
 | **Lawful Basis** | 
 | Consent Management | User consent tracked for marketing | ✓ | 
 | Legitimate Interest | Documented for business operations | ✓ | 
 | **Data Subject Rights** | 
 | Right to Access | Export user data via API/UI | ✓ | 
 | Right to Rectification | Users can update their data | ✓ | 
 | Right to Erasure | Soft delete with purge after retention | ✓ | 
 | Right to Portability | Export in machine-readable format | ✓ | 
 | Right to Object | Opt-out from marketing | ✓ | 
 | **Data Protection** | 
 | Encryption at Rest | AES-256 for sensitive fields | ✓ | 
 | Encryption in Transit | TLS 1.3 enforced | ✓ | 
 | Pseudonymization | PII separated from identifiers | ✓ | 
 | **Documentation** | 
 | Privacy Policy | Published and versioned | ✓ | 
 | Data Processing Agreement | Template available | ✓ | 
 | Records of Processing | Audit logs maintained | ✓ | 
 | **Breach Management** | 
 | Detection | Monitoring and alerts | ✓ | 
 | Notification | 72-hour process defined | ✓ | 
 | Documentation | Incident response plan | ✓ | 

## SOC 2 Type II Controls

 | Control Category | Control | Evidence | 
 | ----------------- | --------- | ---------- | 
 | **Security** | 
 | Access Control | RBAC implementation | Code + Logs | 
 | Encryption | TLS and AES-256 | Config + Tests | 
 | Vulnerability Management | Regular scanning | Scan Reports | 
 | **Availability** | 
 | Performance Monitoring | Uptime tracking | Dashboards | 
 | Incident Response | Defined procedures | Documentation | 
 | Backup/Recovery | Regular testing | Test Reports | 
 | **Confidentiality** | 
 | Data Classification | Sensitive data identified | Data Map | 
 | Access Restrictions | Need-to-know basis | Access Matrix | 
 | **Processing Integrity** | 
 | Input Validation | All inputs validated | Code Reviews | 
 | Output Completeness | Transaction logs | Audit Trails | 
 | **Privacy** | 
 | Notice | Privacy policy provided | Website | 
 | Choice | Consent mechanisms | UI/Database | 
 | Access | Data subject requests | Process Docs | 

## Regional Compliance

 | Region | Regulation | Key Requirements | Status | 
 | -------- | ----------- | ----------------- | -------- | 
 | EU | GDPR | See above | ✓ | 
 | USA | CCPA | Similar to GDPR | ✓ | 
 | Egypt | Data Protection Law | Local data residency option | Planned | 
 | UAE | DIFC Data Protection | Consent and security | ✓ | 
 | KSA | NDMO | Government cloud option | Planned | 

---

# Appendix F — Sample Dashboards & Reports

## Executive Dashboard

```
┌─────────────────────────────────────────────────────────┐
│                  EXECUTIVE DASHBOARD                     │
├─────────────────┬───────────────────┬──────────────────┤
│   Total Revenue │   Active Leads    │  Conversion Rate │
│    $2.5M MTD   │       347         │      23%         │
│    ↑ 15%       │       ↑ 8%        │      ↑ 3%        │
├─────────────────┴───────────────────┴──────────────────┤
│                    Sales Pipeline                       │
│  New: ████████ 120                                     │
│  Qualified: ██████ 89                                  │
│  Negotiation: ████ 52                                  │
│  Closed Won: ███ 45                                    │
│  Closed Lost: ██ 41                                    │
├─────────────────────────────────────────────────────────┤
│              Top Performing Properties                  │
│  1. Sunset Towers     - 15 units sold                  │
│  2. Garden Heights    - 12 units sold                  │
│  3. Marina View       - 10 units sold                  │
├─────────────────────────────────────────────────────────┤
│                Agent Performance                        │
│  John D.  ████████████ 25 deals                       │
│  Sarah M. █████████ 20 deals                          │
│  Ahmed K. ███████ 18 deals                            │
└─────────────────────────────────────────────────────────┘
```

## Lead Conversion Funnel

```
        Website Visitors
              │
              ▼
        ┌──────────┐
        │  10,000  │  100%
        └──────────┘
              │
              ▼
         Lead Capture
        ┌──────────┐
        │   500    │  5%
        └──────────┘
              │
              ▼
          Qualified
        ┌──────────┐
        │   200    │  40%
        └──────────┘
              │
              ▼
         Opportunity
        ┌──────────┐
        │   100    │  50%
        └──────────┘
              │
              ▼
         Closed Won
        ┌──────────┐
        │    25    │  25%
        └──────────┘

    Overall Conversion: 0.25%
    Avg. Sales Cycle: 45 days
```

## Property Inventory Report

 | Property Name | Total Units | Available | Reserved | Sold | Occupancy | 
 | -------------- | ------------- | ----------- | ---------- | ------ | ----------- | 
 | Sunset Towers | 100 | 45 | 20 | 35 | 65% | 
 | Garden Heights | 80 | 30 | 15 | 35 | 62.5% | 
 | Marina View | 120 | 60 | 25 | 35 | 50% | 
 | City Center | 50 | 5 | 10 | 35 | 90% | 
 | **Total** | **350** | **140** | **70** | **140** | **60%** | 

## Agent Activity Report

```
Agent Performance - January 2024

┌──────────────┬────────┬────────┬─────────┬──────────┐
│ Agent Name   │ Calls  │ Emails │ Meetings│ Deals    │
├──────────────┼────────┼────────┼─────────┼──────────┤
│ John Doe     │  250   │  180   │   45    │    8     │
│ Sarah Miller │  220   │  200   │   40    │    7     │
│ Ahmed Khan   │  280   │  150   │   50    │    9     │
│ Lisa Chen    │  200   │  220   │   35    │    6     │
├──────────────┼────────┼────────┼─────────┼──────────┤
│ Team Total   │  950   │  750   │   170   │   30     │
└──────────────┴────────┴────────┴─────────┴──────────┘

Key Metrics:
- Avg. Calls per Deal: 31.7
- Avg. Response Time: 2.5 hours
- Meeting Conversion: 18%
```

---

# Appendix G — Developer Onboarding

## Overview
This appendix provides the steps, tooling, and configuration needed for a new engineer to get the M3CoreCRM project running locally without containers.

---

## G.1 Prerequisites
- **Hardware:**  
  - macOS 13+ (Apple Silicon or Intel)  
  - 16GB+ RAM  
  - 20GB free disk space
- **Accounts:**  
  - GitHub access to the repository  
  - Brevo developer account (sandbox key)  
  - Stripe developer account (test keys)  
  - DigitalOcean Spaces (S3) (test bucket & keys)
- **Installed Tools:**  
  - Node.js LTS (v20.x)  
  - Yarn (v1.22.x)  
  - PostgreSQL (v15.x) installed locally  
  - Git CLI  
  - VSCode with recommended extensions:  
    - ESLint  
    - Prettier  
    - REST Client / Thunder Client

---

## G.2 Local Environment Setup
1. **Clone the repository:**
   ```bash
   git clone git@github.com:yourorg/M3CoreCRM.git
   cd M3CoreCRM
   ```

2. **Install dependencies:**
   ```bash
   yarn install
   ```

3. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with development values:**
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/m3corecrm_dev
   BREVO_API_KEY=<sandbox-api-key>
   STRIPE_SECRET_KEY=<test-key>
   SPACES_KEY=<test-key>
   SPACES_SECRET=<test-secret>
   SPACES_BUCKET=crm-media-dev
   ```
   Use **local non-production credentials** only.

---

## G.3 Local Database Setup
1. **Create the database:**
   ```bash
   createdb m3corecrm_dev
   ```

2. **Run migrations:**
   ```bash
   yarn workspace api prisma migrate dev
   ```

3. **Seed sample data (optional):**
   ```bash
   yarn workspace api seed
   ```

---

## G.4 Running the Application
Run API + Web concurrently:
```bash
yarn dev
```
- **CRM Web:** http://localhost:3000  
- **API:** http://localhost:4000

---

## G.5 Testing
Run unit tests:
```bash
yarn test
```
Run integration/E2E tests:
```bash
yarn e2e