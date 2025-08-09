# API Contract Master — Part A: Auth & Tenancy

> Scope: **Tenant‑aware auth**, sessions, 2FA (TOTP + optional SMS/WhatsApp via Infobip), mobile number verification, email verification, password reset, and tenancy resolution (subdomain/header). Built on JWT access + refresh tokens with rotation & revocation.  
> All examples use JSON; times are ISO‑8601 UTC; phone numbers are **E.164**.  
> **Mirroring rule** (from Sections 14/16): any OTP via SMS/WhatsApp triggers **Inbox + Email** copies.

---

## 0) Conventions & Headers

- Base URL: `https://api.m3corecrm.com/v1`
- Required headers on authenticated requests:
  - `Authorization: Bearer <access_jwt>`
  - `X-Tenant-Id: <uuid>` *(if not using subdomain)*
  - `X-Request-Id: <uuid>` *(optional, for traceability)*
- Idempotency for *creates/sends*: `Idempotency-Key: <uuid>`
- Pagination: `?limit=50&cursor=<opaque>` (seek pagination)
- Errors (normalized):
```json
{
  "error": {
    "code": "UNAUTHORIZED|FORBIDDEN|VALIDATION_ERROR|RATE_LIMITED|CONFLICT|NOT_FOUND|TEMPORARY_FAILURE",
    "message": "Human readable message",
    "details": [{"path": "email", "message": "Invalid email"}]
  }
}
```

---

## 1) Tenancy Resolution

### 1.1 Subdomain Strategy
- `https://<tenantSlug>.m3corecrm.com` → backend resolves `tenant_id` via slug.
- Fallback header: `X-Tenant-Id` if hitting `api.m3corecrm.com` directly.

### 1.2 Effective Tenant Check
- Middleware binds `tenant_id` to request context; all queries filter by `(tenant_id, …)`.

---

## 2) Authentication Flows

### 2.1 Email/Password Login
**POST** `/auth/login`  
**Body**
```json
{"email":"owner@acme.tld","password":"S3cret!", "rememberMe": true}
```
**Response**
```json
{
  "token": {"access":"eyJ...","refresh":"eyJ...","expiresInSec":3600},
  "user": {"id":"u_1","email":"owner@acme.tld","fullName":"Owner","tenantId":"t_1","requires2fa": true},
  "next": "2FA_REQUIRED|OK"
}
```
**Errors**: `UNAUTHORIZED` (bad creds), `FORBIDDEN` (suspended).

### 2.2 Refresh Token (Rotation)
**POST** `/auth/refresh`  
**Body**
```json
{"refresh":"eyJ...","device":"MacBook-Pro"}
```
**Response**
```json
{"access":"eyJ...","refresh":"eyJ...","expiresInSec":3600}
```
**Notes**: old refresh revoked; reuse detection → revoke session.

### 2.3 Logout (Revoke Session)
**POST** `/auth/logout`  
**Body**
```json
{"refresh":"eyJ..."}
```
**Response**
```json
{"ok": true}
```

---

## 3) Email Verification & Password Reset

### 3.1 Send Verification Email
**POST** `/auth/email/verify/send`  
**Body**
```json
{"email":"new.user@acme.tld"}
```
**Response** `{"ok": true}`

### 3.2 Verify Email (Link/Code)
**POST** `/auth/email/verify`  
**Body**
```json
{"token":"vfy_abc123"}
```
**Response** `{"ok": true}`

### 3.3 Request Password Reset
**POST** `/auth/password/reset/request`  
**Body**
```json
{"email":"owner@acme.tld"}
```
**Response** `{"ok": true}`

### 3.4 Confirm Password Reset
**POST** `/auth/password/reset/confirm`  
**Body**
```json
{"token":"rst_abc123","newPassword":"N3wS3cret!"}
```
**Response** `{"ok": true}`

---

## 4) 2FA — TOTP (Google Authenticator)

### 4.1 Issue TOTP Secret
**POST** `/auth/2fa/totp/issue` *(auth required)*  
**Response**
```json
{
  "otpauthUrl":"otpauth://totp/M3CRM:owner@acme.tld?secret=JBSW...&issuer=M3CRM",
  "secret":"JBSW...",
  "qrPngDataUrl":"data:image/png;base64,iVBORw0..."
}
```

### 4.2 Verify & Enable TOTP
**POST** `/auth/2fa/totp/verify`  
**Body**
```json
{"code":"123456"}
```
**Response**
```json
{"ok": true, "recoveryCodesIssued": true}
```

### 4.3 Disable TOTP
**POST** `/auth/2fa/totp/disable`  
**Body**
```json
{"code":"123456"}
```
**Response** `{"ok": true}`

---

## 5) 2FA — SMS/WhatsApp (Infobip touchpoints — optional)

### 5.1 Send 2FA OTP (SMS or WhatsApp)
**POST** `/auth/2fa/otp/send`  
**Body**
```json
{"channel":"sms|whatsapp","phone":"+201000000001","purpose":"login"}
```
**Response**
```json
{"ok": true, "expiresInSec": 300, "provider":"infobip","providerMessageId":"abc123"}
```
**Notes**: Mirrors to **Inbox + Email** for the user.

### 5.2 Verify 2FA OTP
**POST** `/auth/2fa/otp/verify`  
**Body**
```json
{"code":"123456","channel":"sms","phone":"+201000000001"}
```
**Response**
```json
{"ok": true, "token": {"access":"eyJ...","refresh":"eyJ..."}} 
```

### 5.3 Backup Codes (optional)
**GET** `/auth/2fa/backup-codes` → list masked codes  
**POST** `/auth/2fa/backup-codes/regenerate` → rotates codes

---

## 6) Mobile Number Verification (Onboarding / Profile)

### 6.1 Send Mobile Verify OTP
**POST** `/auth/phone/verify/send`  
**Body**
```json
{"phone":"+201000000001","channel":"sms|whatsapp"}
```
**Response** `{"ok": true, "expiresInSec": 300}`

### 6.2 Verify Mobile OTP
**POST** `/auth/phone/verify`  
**Body**
```json
{"phone":"+201000000001","code":"123456"}
```
**Response** `{"ok": true, "verifiedAt":"2025-08-09T10:00:00Z"}`

---

## 7) Sessions & Devices

### 7.1 List Active Sessions
**GET** `/auth/sessions`  
**Response**
```json
[
  {"id":"s_1","device":"Mac Safari","ip":"102.0.0.1","lastSeen":"2025-08-09T10:30:00Z"},
  {"id":"s_2","device":"iPhone iOS","ip":"102.0.0.2","lastSeen":"2025-08-08T17:12:00Z"}
]
```

### 7.2 Revoke Session
**POST** `/auth/sessions/:id/revoke` → `{"ok": true}`

### 7.3 Introspect Token (admin/support)
**POST** `/auth/introspect`  
**Body**
```json
{"token":"eyJ..."}
```
**Response**
```json
{"active": true, "userId":"u_1", "tenantId":"t_1", "scopes":["user:read"], "exp": 1754673132}
```

---

## 8) Rate Limits & Lockouts

- **Login**: 5 attempts / 15 min per IP + user; then CAPTCHA or cooldown.
- **OTP endpoints**: 3 sends / 10 min per user; verify attempts limited (e.g., 5 / 10 min).
- HTTP 429 with `Retry-After` header on exceed.

---

## 9) Security Notes

- Password hashing: Argon2id (or bcrypt cost ≥ 12).
- Refresh token rotation; detect reuse → revoke all sessions.
- JWT claims keep minimal PII; include `tenantId`, `roles` snapshot, `exp`.
- All OTPs/2FA/verification sends are **idempotent** and logged; messages mirrored.

---

## 10) Example Auth + 2FA Login Sequence

1) User posts to `/auth/login` with email/password → gets `next="2FA_REQUIRED"`  
2) User chooses TOTP or `sms|whatsapp` OTP  
3) Backend validates code → returns `access/refresh`  
4) Frontend stores tokens (httpOnly cookie or memory + secure storage)  
5) Subsequent calls include `Authorization` + tenant context

---

## 11) Error Examples

**Bad password**
```json
{"error":{"code":"UNAUTHORIZED","message":"Invalid credentials"}}
```
**OTP wrong/expired**
```json
{"error":{"code":"VALIDATION_ERROR","message":"Invalid or expired OTP"}}
```
**Rate limited**
```json
{"error":{"code":"RATE_LIMITED","message":"Too many requests. Try later."}}
```

---

## 12) Webhook Touchpoints (for completeness)

- `/v1/webhooks/infobip` — receives delivery statuses for OTP/verification SMS/WA; updates outbox + usage counters.  
- `/v1/webhooks/brevo` — email delivery/bounce events for verification/reset emails.

---

**Acceptance**  
- All endpoints documented with request/response examples.  
- Tenancy resolution + RBAC middleware in place.  
- OTP & 2FA flows enforce rate limits, idempotency, and mirroring.  
- Session revocation & refresh rotation verified in QA.

---

# API Contract Master — Part B: RBAC, Entitlements & Approvals

> Scope: **runtime permission checks**, **feature/limit resolution (entitlements)**, and **approval workflows** (flat/multi‑level, amount‑based).  
> All endpoints are tenant‑aware; responses omit sensitive internals where not required by the client UI.

---

## 0) Conventions
- Headers: `Authorization: Bearer <access>`, `X-Tenant-Id: <uuid>` (if not subdomain).
- Idempotency for mutations that can be retried: `Idempotency-Key`.
- Amounts in **minor units** (e.g., cents) unless specified.

---

## 1) Permissions & Roles — Read (runtime helpers)

### 1.1 Effective Permissions (for current user)
**GET** `/rbac/effective-permissions`  
**Response (example)**
```json
{
  "userId": "u_1",
  "roles": ["sales_exec", "approver_lvl1"],
  "permissions": [
    "lead.create", "lead.view", "deal.view", "deal.create",
    "deal.stage.move", "approval.request.create", "approval.request.view"
  ],
  "derivedFrom": {
    "roles": {"sales_exec":["lead.*","deal.view","deal.create"],"approver_lvl1":["approval.*"]},
    "groups": {"sales-team":["deal.stage.move"]},
    "overrides": {"user":[]}
  }
}
```

### 1.2 Check Permission (single)
**GET** `/rbac/check?perm=deal.stage.move` → `{"allowed": true}`

### 1.3 Effective Entitlements (features & limits)
**GET** `/entitlements/effective`  
**Response (example)**
```json
{
  "plan": {"code":"PRO","renewsAt":"2025-09-01T00:00:00Z"},
  "features": {"dashboard.customize": true, "telemarketing.enabled": false},
  "limits": {"users.max": 50, "sms.monthly": 1000, "whatsapp.monthly": 200},
  "origin": {
    "plan":"PRO",
    "overrides":{
      "group": {"sales-team":{"dashboard.customize":true}},
      "user": {}
    }
  }
}
```

---

## 2) Roles, Groups & Hierarchy — Admin endpoints (summary)
> Full CRUD is specified in **User & Role Management**. Minimal endpoints exposed here for RBAC UI helpers.

### 2.1 List Roles
**GET** `/rbac/roles` → `[{ "id":"r_1","code":"sales_exec","name":"Sales Executive"}]`

### 2.2 List Groups
**GET** `/rbac/groups` → `[{ "id":"g_1","name":"Sales Team"}]`

### 2.3 Role Hierarchy Snapshot
**GET** `/rbac/roles/hierarchy`  
**Response**
```json
{
  "nodes": [{"id":"r_1","code":"sales_exec"},{"id":"r_2","code":"approver_lvl1"}],
  "edges": [{"from":"r_2","to":"r_1","type":"inherits"}]
}
```

---

## 3) Approvals — Model & States
- **Entities that may require approval**: deals (stage move, discount), unit reservations, price changes, campaigns, billing changes.  
- **States**: `draft` → `pending` → (`approved` | `rejected`) → `applied` (optional)  
- **Routing**:
  - **Flat**: any user with permission can approve.
  - **Multi‑level**: L1 → L2 → L3 … (thresholds by **amount** or **function**).
  - **Escalation**: if SLA expires, route to next role/group.

### 3.1 Approval Object (canonical)
```json
{
  "id": "appr_123",
  "tenantId": "t_1",
  "domain": "deal.stage.move",
  "subject": {"entityType": "deal", "entityId": "d_1"},
  "payload": {"fromStage":"proposal","toStage":"negotiation","amountMinor": 12500000, "currency":"USD"},
  "state": "pending",
  "level": 1,
  "requiredLevels": 2,
  "requestedBy": "u_req",
  "assignees": [{"role":"approver_lvl1"},{"role":"approver_lvl2"}],
  "sla": {"dueAt":"2025-08-10T10:00:00Z", "escalateTo":"approver_lvl2"},
  "history": [
    {"at":"2025-08-09T09:00:00Z","by":"u_req","action":"submitted"}
  ],
  "createdAt":"2025-08-09T09:00:00Z",
  "updatedAt":"2025-08-09T09:00:00Z"
}
```

---

## 4) Approvals — Endpoints

### 4.1 Create Approval Request
**POST** `/approvals`  
**Body (deal stage move example)**
```json
{
  "domain": "deal.stage.move",
  "subject": {"entityType":"deal","entityId":"d_1"},
  "payload": {"fromStage":"proposal","toStage":"negotiation","amountMinor": 12500000, "currency":"USD"},
  "routing": {"type":"multi", "levels":[
    {"role":"approver_lvl1","thresholdMinor": 0},
    {"role":"approver_lvl2","thresholdMinor": 10000000}
  ]},
  "notes": "Discount exceeds L1 threshold"
}
```
**Response**
```json
{"id":"appr_123","state":"pending","level":1,"requiredLevels":2}
```

### 4.2 Get Approval
**GET** `/approvals/:id` → approval object

### 4.3 List Approvals (inbox view)
**GET** `/approvals?state=pending&assignee=me`  
**Response**
```json
{
  "items":[
    {"id":"appr_123","domain":"deal.stage.move","subject":{"entityType":"deal","entityId":"d_1"},"state":"pending","level":1,"dueAt":"2025-08-10T10:00:00Z"}
  ],
  "nextCursor":"opaque"
}
```

### 4.4 Approve Current Level
**POST** `/approvals/:id/approve`  
**Body**
```json
{"note":"Looks good"}
```
**Response (example)**
```json
{"state":"pending","level":2,"requiredLevels":2,"nextAssignees":[{"role":"approver_lvl2"}]}
```
*If last level:* `{"state":"approved"}` and domain hook may proceed (`applied` state optional after action).

### 4.5 Reject
**POST** `/approvals/:id/reject`  
**Body**
```json
{"reason":"Insufficient margin"}
```
**Response** `{"state":"rejected"}`

### 4.6 Escalate (manual or SLA)
**POST** `/approvals/:id/escalate`  
**Body**
```json
{"toRole":"approver_lvl2","reason":"SLA expired"}
```
**Response** `{"state":"pending","level":2}`

### 4.7 Cancel (by requester/admin)
**POST** `/approvals/:id/cancel` → `{"state":"cancelled"}`

### 4.8 Webhook/Callback after Final Approval
**POST** `/approvals/:id/apply` *(internal domain hook)*  
- Example for `deal.stage.move`: transitions deal, records audit, sends notifications.

---

## 5) Notifications & Mirroring
- Creating, approving, rejecting, escalating **emit events** → **Inbox** for actors and watchers.  
- Critical events can mirror to **Email** and optional **SMS/WhatsApp** (respect quiet hours; escalations can override by policy).  
- Example outbox payload:
```json
{"template":"APPROVAL_REQUEST","to":{"userId":"u_mgr"},"params":{"entity":"Deal d_1","dueAt":"2025-08-10T10:00:00Z"}}
```

---

## 6) Limits & Entitlements Enforcement
- Example checks before creating approval:
  - `entitlements.features['approvals.enabled'] === true`
  - Role requirement for requester: `approval.request.create`
  - Amount thresholds resolved from policy per tenant: `approval.thresholds.deal.stage.move`
- Rate limiting for approval actions (anti‑abuse): 60 req/min per user.

---

## 7) Errors
```json
{"error":{"code":"FORBIDDEN","message":"You are not allowed to approve at this level"}}
```
```json
{"error":{"code":"VALIDATION_ERROR","message":"Routing levels invalid"}}
```
```json
{"error":{"code":"CONFLICT","message":"Approval already resolved"}}
```

---

## 8) Audit & Events
- All actions create `audit_logs` entries with diffs.
- Events: `approval.created|approved|rejected|escalated|cancelled|applied` with metadata for dashboards.

---

## 9) Acceptance
- Effective permissions & entitlements endpoints return correct merged view.  
- Approval lifecycle supports flat & multi‑level with amount‑based thresholds.  
- Notifications mirror per policy; audit logs complete.  
- Rate limits & idempotency validated in QA.

---

# API Contract Master — Part C: Core CRM

> Scope: **Leads Management**, **Contacts & Companies**, **Deals/Pipelines**, and **Activities & Tasks**.  
> Tenant‑aware, with coded dictionaries for statuses, sources, stages, and activity types.  
> All entities support approvals (when required), notifications, and optional future integrations.

---

## 0) Conventions
- Headers: `Authorization: Bearer <access>`, `X-Tenant-Id: <uuid>` if not subdomain.
- All list endpoints support cursor pagination: `?limit=50&cursor=opaque`.
- Timestamps: ISO‑8601 in UTC.
- Coded dictionaries: `lead.status`, `lead.source`, `deal.stage`, `activity.type`.

---

## 1) Leads Management

### 1.1 Lead Object
```json
{
  "id": "lead_123",
  "tenantId": "t_1",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+201234567890",
  "status": "new",
  "source": "website_form",
  "score": 85,
  "assignedTo": "u_45",
  "companyId": "comp_12",
  "customFields": {"budget": "250000", "interestArea": "Downtown"},
  "tags": ["priority", "hot"],
  "createdAt": "2025-08-09T09:00:00Z",
  "updatedAt": "2025-08-09T09:00:00Z"
}
```

### 1.2 Create Lead
**POST** `/leads`  
Body:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "+201234567890",
  "source": "website_form",
  "customFields": {"budget": "250000"}
}
```
Response: lead object.

### 1.3 Update Lead
**PATCH** `/leads/:id`

### 1.4 Get Lead
**GET** `/leads/:id`

### 1.5 List Leads
**GET** `/leads?status=new&assignedTo=me`

### 1.6 Merge Leads
**POST** `/leads/merge`  
```json
{"primaryId":"lead_123","duplicateId":"lead_456","fieldsToKeep":["email","phone"]}
```

### 1.7 Archive Lead
**POST** `/leads/:id/archive`

---

## 2) Contacts & Companies

### 2.1 Contact Object
```json
{
  "id": "cont_123",
  "tenantId": "t_1",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "+201234567891",
  "companyId": "comp_12",
  "position": "CEO",
  "tags": ["vip"]
}
```

### 2.2 Company Object
```json
{
  "id": "comp_12",
  "tenantId": "t_1",
  "name": "Example Corp",
  "industry": "Real Estate",
  "size": "51-200",
  "website": "https://example.com",
  "contacts": ["cont_123"]
}
```

**CRUD Endpoints**: `/contacts`, `/companies`

- Deduplication endpoint: **POST** `/contacts/deduplicate`
- Link contact to lead/deal: **POST** `/contacts/:id/link`

---

## 3) Deals & Pipelines

### 3.1 Deal Object
```json
{
  "id": "deal_123",
  "tenantId": "t_1",
  "name": "Deal with Example Corp",
  "stage": "proposal",
  "probability": 60,
  "valueMinor": 25000000,
  "currency": "USD",
  "contactIds": ["cont_123"],
  "companyId": "comp_12",
  "pipelineId": "pipe_1",
  "expectedCloseDate": "2025-09-15",
  "tags": ["high_value"],
  "approvalsRequired": true
}
```

**Endpoints**:
- `/deals` CRUD
- `/pipelines` CRUD (with ordered stages)
- Move stage: **POST** `/deals/:id/move-stage`
- Weighted forecast: **GET** `/pipelines/:id/forecast`

---

## 4) Activities & Tasks

### 4.1 Activity Object
```json
{
  "id": "act_123",
  "tenantId": "t_1",
  "type": "call",
  "subject": "Follow-up with client",
  "dueDate": "2025-08-15T10:00:00Z",
  "assignedTo": "u_45",
  "linkedEntity": {"type":"deal","id":"deal_123"},
  "notes": "Discuss contract details",
  "completed": false
}
```

**Endpoints**:
- `/activities` CRUD
- `/tasks` CRUD (tasks are a subset with type=task)
- Complete: **POST** `/activities/:id/complete`
- Link to lead/deal/company: `/activities/:id/link`

---

## 5) Touchpoints & Hooks
- All creates/updates trigger **event bus** events: `lead.created`, `deal.stage.changed`, `activity.completed`.
- Approval checks occur for stage moves, high-value deals, or certain lead status changes.
- Notifications:
  - In-app inbox
  - Email
  - Optional SMS/WhatsApp
- Webhooks for integration with marketing automation or inventory updates.

---

## 6) Acceptance
- All CRUD and linking endpoints functional and tenant-isolated.
- Coded dictionaries enforced for status, source, stage, type.
- Events emitted for all major actions.
- Approval & notification touchpoints ready for integration.

---

# API Contract Master — Part D: Telemarketing & Phone Sales (Optional)

> Scope: **telemarketing campaigns, call lists, agent states, scripts, outcomes, and call logging**.  
> Telephony (SIP/PBX/WebRTC) uses **adapter interfaces**; all provider integrations are optional and deferred.  
> Mirrors Notifications policy: important call events can trigger **Inbox + Email**; SMS/WhatsApp follow-ups are optional via Infobip.

---

## 0) Conventions
- Headers: `Authorization`, `X-Tenant-Id` (if not subdomain)
- All IDs are UUID; timestamps ISO‑8601 UTC.
- E.164 for phone numbers.  
- **Do‑Not‑Call (DNC)** and consent are enforced before dialing.

---

## 1) Entities

### 1.1 Telemarketing Campaign
```json
{
  "id":"tmc_1",
  "name":"Q3 Cold Outreach",
  "type":"cold|warm|active",
  "status":"draft|active|paused|completed|archived",
  "linkedMarketingCampaignId": "cmp_123",
  "scriptId":"tms_1",
  "schedule":{"days":["sun","mon","tue","wed","thu"],"from":"10:00","to":"18:00","tz":"Africa/Cairo"},
  "createdBy":"u_1",
  "createdAt":"2025-08-09T10:00:00Z"
}
```

### 1.2 Call List & Enrollment
```json
{
  "id":"tml_1",
  "campaignId":"tmc_1",
  "source":"contacts|leads|custom",
  "filter":{"segmentCode":"high_value","city":"Cairo"},
  "status":"ready|in_progress|completed",
  "counts":{"total":500,"assigned":300,"completed":120}
}
```
Enrollment record (flattened for dialing):
```json
{
  "id":"tme_1",
  "listId":"tml_1",
  "entityType":"contact|lead",
  "entityId":"cont_1",
  "name":"Sara Ali",
  "phone":"+201000000001",
  "altPhones":["+201000000009"],
  "timezone":"Africa/Cairo",
  "dnc": false,
  "lastOutcomeCode":"NO_ANSWER",
  "attempts":2,
  "nextAttemptAt":"2025-08-10T09:15:00Z",
  "ownerUserId":"u_agent_1"
}
```

### 1.3 Call Log
```json
{
  "id":"tmcall_1",
  "campaignId":"tmc_1",
  "enrollmentId":"tme_1",
  "agentUserId":"u_agent_1",
  "dialStartAt":"2025-08-09T11:00:00Z",
  "connectedAt":"2025-08-09T11:00:05Z",
  "endedAt":"2025-08-09T11:07:14Z",
  "durationSec": 429,
  "outcomeCode":"QUALIFIED|CALLBACK|NO_ANSWER|BUSY|DNC_REQUEST|WRONG_NUMBER|VOICEMAIL|DISCONNECTED|SALE",
  "notes":"Interested in 2BR Downtown; wants pricing via WhatsApp",
  "recordingUrl":"https://storage/rec/abc.mp3",
  "providerSessionId":"prov-123",
  "costMinor": 35,
  "currency":"USD"
}
```

### 1.4 Script
```json
{
  "id":"tms_1",
  "name":"Standard Cold Open",
  "content":"Hello {{firstName}}, this is ...",
  "assignedTo":"campaign|list|agent"
}
```

---

## 2) Campaign & List Endpoints

### 2.1 Create/Update Campaign
**POST** `/tm/campaigns`  
**PATCH** `/tm/campaigns/:id`  
**GET** `/tm/campaigns/:id`  
**GET** `/tm/campaigns?status=active`

### 2.2 Activate/Pause/Complete
**POST** `/tm/campaigns/:id/activate` → `{"status":"active"}`  
**POST** `/tm/campaigns/:id/pause` → `{"status":"paused"}`  
**POST** `/tm/campaigns/:id/complete` → `{"status":"completed"}`

### 2.3 Lists & Enrollments
**POST** `/tm/lists` (build from segment/filter or CSV upload id)  
**GET** `/tm/lists/:id`  
**GET** `/tm/lists/:id/enrollments?status=ready&owner=me&limit=50&cursor=opaque`  
**POST** `/tm/lists/:id/assign`  
```json
{"ownerUserId":"u_agent_1","count":100,"strategy":"round_robin|load_balance"}
```

---

## 3) Agent State & Dialer Controls (Provider‑Agnostic)

### 3.1 Agent Presence
**GET** `/tm/agents/me/state` → `{"state":"available|busy|away|offline"}`  
**POST** `/tm/agents/me/state`  
```json
{"state":"available","reason":null}
```

### 3.2 Start Call (Manual/Preview)
**POST** `/tm/calls/start`  
```json
{"enrollmentId":"tme_1","phone":"+201000000001","dialMode":"manual|preview"}
```
**Response**  
```json
{"callId":"tmcall_1","provider":"webrtc|pbx","providerSessionId":"prov-123"}
```

### 3.3 End / Pause / Resume
**POST** `/tm/calls/:id/end` → `{"ok":true}`  
**POST** `/tm/calls/:id/pause` → `{"ok":true}`  
**POST** `/tm/calls/:id/resume` → `{"ok":true}`

### 3.4 Disposition (Outcome)
**POST** `/tm/calls/:id/disposition`  
```json
{"outcomeCode":"CALLBACK","nextAttemptAt":"2025-08-10T10:00:00Z","notes":"Send pricing via WhatsApp"}
```
**Response** → call log updated; enrollment next attempt scheduled.

### 3.5 Send Follow‑up (optional)
**POST** `/tm/calls/:id/followup`  
```json
{"channel":"email|sms|whatsapp","template":"FOLLOWUP_TM","params":{"unit":"AB-1203","price":"2.5M EGP"}}
```
**Notes**: respects policies; SMS/WA mirrored to Inbox + Email.

---

## 4) DNC, Consent & Compliance

### 4.1 DNC Registry (Tenant)
**GET** `/tm/dnc?phone=+201000000001` → `{"dnc": false}`  
**POST** `/tm/dnc`  
```json
{"phone":"+201000000001","reason":"request"}
```
**DELETE** `/tm/dnc/:id`

### 4.2 Consent Tracking
- Store proof of consent for marketing calls/messages per contact/lead.  
- `GET /tm/consent/:entityType/:entityId` → consent records.

### 4.3 Local Quiet Hours & Jurisdiction
- Dialing windows enforced from campaign schedule and tenant policy (Section 14).

---

## 5) Scripts & Notes

**CRUD**: `/tm/scripts`  
Assign script: `POST /tm/campaigns/:id/script` `{ "scriptId":"tms_1" }`

---

## 6) Provider Adapters (Optional Integrations)

### 6.1 Adapter Catalog
**GET** `/tm/adapters` → `[{ "code":"webrtc","status":"available"},{"code":"twilio-pbx","status":"optional"},{"code":"asterisk-sip","status":"optional"}]`

### 6.2 Adapter Config (Admin)
**POST** `/tm/adapters/:code/config`  
```json
{"apiKey":"sbx_...","baseUrl":"https://pbx.sbx","callerId":"+12025550123"}
```

### 6.3 Adapter Webhooks
- `/v1/webhooks/telephony/:adapter`  
Events (examples):
```json
{
  "event":"call.connected|call.ended|recording.ready",
  "providerSessionId":"prov-123",
  "callId":"tmcall_1",
  "durationSec": 429,
  "recordingUrl":"https://storage/rec/abc.mp3"
}
```

**Behavior**: webhook updates `tmcall`, attaches recording URL, updates enrollment stats, and can emit notifications to agents/managers.

---

## 7) Analytics & Exports

**GET** `/tm/analytics/summary?campaignId=tmc_1&period=30d`  
```json
{
  "callsTotal": 1200,
  "connectRate": 0.42,
  "avgTalkTimeSec": 230,
  "outcomes": [{"code":"QUALIFIED","count":85},{"code":"CALLBACK","count":140}],
  "costMinor": 43000,
  "currency": "USD"
}
```

**GET** `/tm/calls/export?campaignId=tmc_1&format=csv` → file

---

## 8) Notifications & Usage

- Agent reminders and callbacks → **Inbox**; escalation rules apply.  
- SMS/WA follow‑ups mirrored to **Inbox + Email**.  
- Usage counters: `sms.sent`, `whatsapp.sent`, `calls.minutes` increment for billing/reporting.

---

## 9) Errors
```json
{"error":{"code":"DNC_BLOCKED","message":"Number is on DNC list"}}
```
```json
{"error":{"code":"QUIET_HOURS","message":"Dialing not allowed in current window"}}
```
```json
{"error":{"code":"ADAPTER_UNAVAILABLE","message":"Telephony adapter not configured"}}
```

---

## 10) Acceptance
- Campaign/list management, agent states, call lifecycle, dispositions working end‑to‑end.  
- DNC checks & quiet hours enforced.  
- Adapter webhooks update call logs & recordings.  
- Follow‑ups respect mirroring; usage counters increment for analytics/billing.

---

# API Contract Master — Part E: Property Inventory Management & Map Overlay/Unit Mapping APIs

> Scope: Full inventory lifecycle, from developers/projects down to units, including coded unit/component types, optional dimensions, and mapping overlays.  
> Supports analytics-ready coding for all inventory data.  
> Map overlay & polygon mapping allow interactive project/unit visualization.

---

## 0) Conventions
- Tenant-aware endpoints with `Authorization` & `X-Tenant-Id` headers.
- IDs: UUIDv4, timestamps in ISO‑8601 UTC.
- Dimensions: meters (m) for length, width, height; square meters (m²) for area.

---

## 1) Developers & Projects

### 1.1 Developer Object
```json
{
  "id":"dev_1",
  "name":"M3 Real Estate Development",
  "website":"https://m3realestate.com",
  "phone":"+20200000000",
  "email":"info@m3realestate.com",
  "address":"Cairo, Egypt",
  "logoUrl":"https://cdn/logo/dev1.png"
}
```

**CRUD**: `/developers`

### 1.2 Project Object
```json
{
  "id":"proj_1",
  "developerId":"dev_1",
  "name":"M3 Downtown Residences",
  "location":{"lat":30.0444,"lng":31.2357},
  "status":"planning|active|completed|on_hold",
  "startDate":"2025-01-01",
  "endDate":"2027-12-31",
  "description":"High-end residential towers in downtown Cairo",
  "mapOverlayId":"map_1"
}
```

**CRUD**: `/projects`

---

## 2) Unit Types & Component Types (Coded Dictionaries)

### 2.1 Unit Type Codes
Examples: `APT_1BR`, `APT_2BR`, `VILLA_4BR`, `OFFICE_STD`, `RETAIL_SMALL`

### 2.2 Component Type Codes
Examples: `ROOM_BED`, `ROOM_BATH`, `KITCHEN_STD`, `BALCONY_STD`

**CRUD**: `/inventory/unit-types`, `/inventory/component-types`

---

## 3) Units

### 3.1 Unit Object
```json
{
  "id":"unit_101",
  "projectId":"proj_1",
  "unitTypeCode":"APT_2BR",
  "floor":"5",
  "status":"available|reserved|sold|off_plan",
  "priceMinor":250000000,
  "currency":"EGP",
  "dimensions":{"areaM2":120,"widthM":10,"lengthM":12},
  "components":[
    {"componentTypeCode":"ROOM_BED","count":2,"dimensions":{"areaM2":20}},
    {"componentTypeCode":"ROOM_BATH","count":2,"dimensions":{"areaM2":5}},
    {"componentTypeCode":"KITCHEN_STD","count":1,"dimensions":{"areaM2":12}}
  ],
  "virtualTourUrl":"https://vtours/m3/unit_101",
  "mapPolygonId":"poly_101"
}
```

**Endpoints**:
- `/units` CRUD
- `/units/:id/status` → change status
- `/units/:id/price` → update price
- `/units/:id/components` → update component details

---

## 4) Map Overlays & Unit Mapping

### 4.1 Map Overlay Object
```json
{
  "id":"map_1",
  "projectId":"proj_1",
  "imageUrl":"https://cdn/maps/proj1_master.png",
  "bounds":{"north":30.045,"south":30.043,"east":31.237,"west":31.234}
}
```
**CRUD**: `/maps/overlays`

### 4.2 Unit Polygon Object
```json
{
  "id":"poly_101",
  "mapOverlayId":"map_1",
  "unitId":"unit_101",
  "coordinates":[
    {"lat":30.0445,"lng":31.2358},
    {"lat":30.0445,"lng":31.2359},
    {"lat":30.0444,"lng":31.2359},
    {"lat":30.0444,"lng":31.2358}
  ]
}
```
**Endpoints**:
- `/maps/polygons` CRUD
- `/maps/polygons/:id/coordinates` → update coordinates

---

## 5) Linking & Integration Hooks
- Units link to **Deals/Pipelines** when sold/reserved.
- Units can link to **Marketing Campaigns** for promotions.
- Polygon selection in UI triggers property detail modal.

---

## 6) Analytics & Reporting
- Occupancy rate = sold/reserved units ÷ total units in project.
- Price per m² trends.
- Component type distribution across inventory.

**GET** `/inventory/analytics/summary?projectId=proj_1`  
```json
{
  "totalUnits":150,
  "availableUnits":50,
  "soldUnits":80,
  "reservedUnits":20,
  "avgPricePerM2":21000
}
```

---

## 7) Acceptance
- All CRUD endpoints functional & tenant-isolated.
- Coded dictionaries for unit/component types enforced.
- Optional dimensions stored where provided.
- Map overlays and polygons editable via UI.
- Analytics endpoints return correct aggregates.

---

# API Contract Master — Part F: Notifications & Communications

> Scope: In-app notifications, email, SMS, and WhatsApp communications for transactional and marketing purposes.  
> Includes touchpoints for optional Infobip integration and fallback mechanisms.  
> All SMS/WhatsApp are mirrored to in-app notifications and email.

---

## 0) Conventions
- Tenant-aware endpoints; `Authorization` & `X-Tenant-Id` headers required.
- Notification IDs are UUIDv4.
- All message templates versioned.

---

## 1) Notification Types
- **Transactional**: system alerts, approvals, 2FA codes, mobile verification.
- **Marketing**: campaigns, offers, announcements.
- **Operational**: task assignments, deal updates, telemarketing callbacks.

---

## 2) Notification Object
```json
{
  "id":"notif_1",
  "type":"transactional|marketing|operational",
  "channel":"inbox|email|sms|whatsapp",
  "templateCode":"2FA_CODE",
  "subject":"Your verification code",
  "body":"Your code is 123456",
  "params":{"code":"123456"},
  "status":"pending|sent|failed|read",
  "priority":"high|normal|low",
  "recipientUserId":"u_1",
  "sentAt":"2025-08-09T10:00:00Z",
  "readAt":"2025-08-09T10:05:00Z",
  "providerMessageId":"infobip-123",
  "error":null
}
```

---

## 3) Endpoints

### 3.1 Send Notification (Unified)
**POST** `/notifications/send`
```json
{
  "recipientUserId":"u_1",
  "channels":["inbox","email","sms"],
  "templateCode":"WELCOME_USER",
  "params":{"firstName":"Sara"},
  "priority":"normal"
}
```

### 3.2 List Notifications
**GET** `/notifications?userId=u_1&status=unread&limit=20&cursor=opaque`

### 3.3 Mark as Read
**POST** `/notifications/:id/read`

### 3.4 Delete Notification
**DELETE** `/notifications/:id`

---

## 4) Templates

### 4.1 Template Object
```json
{
  "id":"tmpl_1",
  "code":"WELCOME_USER",
  "type":"transactional|marketing",
  "subject":"Welcome to M3CoreCRM",
  "body":"Hello {{firstName}}, welcome aboard!",
  "version":1,
  "createdAt":"2025-08-01T10:00:00Z"
}
```

**CRUD**: `/notifications/templates`

### 4.2 Localization
- Store localized versions under same `code`.
- `GET /notifications/templates?code=WELCOME_USER&lang=ar`

---

## 5) SMS & WhatsApp (Optional Infobip)

### 5.1 Provider Adapter
**GET** `/notifications/adapters` → available channels & status.

**POST** `/notifications/adapters/:code/config`
```json
{"apiKey":"infobip_...","senderId":"M3CoreCRM"}
```

### 5.2 Sending
- Follows unified `/notifications/send` with `"channel":"sms"` or `"whatsapp"`.
- Mirrors message to **inbox** and **email**.

---

## 6) Email
- Primary via Brevo SMTP/API.
- Fallback to secondary SMTP provider if configured.

---

## 7) Mobile Number Verification Flow
1. User enters phone number.
2. System sends OTP via SMS/WhatsApp (if enabled) + inbox + email.
3. User submits OTP to `/auth/verify-phone`.
4. Success updates `user.phoneVerified=true`.

---

## 8) 2FA via SMS/WhatsApp
- Optional per-tenant setting.
- Touchpoints at login & sensitive actions.

---

## 9) Event Hooks
- All major actions (deal stage change, unit reservation, task assignment) can trigger notifications via event bus.

---

## 10) Analytics
**GET** `/notifications/analytics?period=30d`
```json
{
  "sent":{"email":1200,"sms":300,"whatsapp":100,"inbox":1500},
  "failed":{"email":2,"sms":5,"whatsapp":1,"inbox":0},
  "readRateInbox":0.92,
  "clickRateEmail":0.35
}
```

---

## 11) Acceptance
- Unified send endpoint works across all channels.
- SMS/WhatsApp always mirrored to inbox + email.
- Provider adapters configurable & optional.
- OTP flows for mobile verification & 2FA functional.

---

# API Contract Master — Part G: Reports & Analytics APIs

> Scope: Unified reporting and analytics endpoints across CRM modules.  
> Supports configurable dashboards, exportable reports, and analytics hooks for external BI tools.

---

## 0) Conventions
- Tenant-aware endpoints.
- All analytics data timestamped in UTC.
- Default aggregation period: daily, weekly, monthly.

---

## 1) Reporting Modules
- **Leads & Sales Pipeline**: conversion rates, source performance, stage duration.
- **Contacts & Companies**: growth trends, segmentation by tags, activity heatmaps.
- **Deals**: win/loss analysis, revenue forecasting, stage bottlenecks.
- **Activities & Tasks**: completion rates, overdue items, productivity metrics.
- **Property Inventory**: occupancy rates, price per m² trends, sales velocity.
- **Marketing Campaigns**: open rates, click-through rates, ROI analysis.
- **Notifications & Communications**: delivery rates, read/click rates.

---

## 2) Dashboard Widgets (Configurable by User)
- Users can add/remove/reorder widgets.
- Widget types:
  - KPI cards (single value, trend arrow)
  - Charts (bar, line, pie)
  - Tables (sortable, filterable)
- Example widget: "Leads Conversion Rate (Last 30 days)"

**Endpoint**:
- `/dashboard/widgets` CRUD
- `/dashboard/widgets/order` → save layout order

---

## 3) Analytics Endpoints

### 3.1 Lead Conversion Rate
**GET** `/analytics/leads/conversion?start=2025-08-01&end=2025-08-31`
```json
{
  "totalLeads": 150,
  "converted": 45,
  "conversionRate": 0.3
}
```

### 3.2 Sales Forecast
**GET** `/analytics/deals/forecast?period=quarter`
```json
{
  "pipelineValue": 50000000,
  "weightedValue": 35000000,
  "currency": "USD"
}
```

### 3.3 Inventory Occupancy
**GET** `/analytics/inventory/occupancy?projectId=proj_1`
```json
{
  "totalUnits": 200,
  "soldUnits": 150,
  "reservedUnits": 20,
  "availableUnits": 30,
  "occupancyRate": 0.9
}
```

### 3.4 Marketing ROI
**GET** `/analytics/marketing/roi?campaignId=camp_1`
```json
{
  "spend": 10000,
  "revenueAttributed": 40000,
  "roi": 4.0
}
```

---

## 4) Data Export
- CSV, XLSX, PDF formats.
- `/reports/export?module=leads&type=csv&start=...&end=...`

---

## 5) BI Integration Hooks
- `/analytics/export/raw` → full raw data dump for BI tools (e.g., Power BI, Tableau).
- Optional API keys per integration.

---

## 6) Audit & Access Control
- Report visibility tied to RBAC & entitlements.
- Sensitive reports (e.g., revenue) require higher roles.

---

## 7) Acceptance
- All core modules have analytics endpoints.
- Dashboards fully user-configurable.
- Data export functional for all supported formats.
- BI integration hooks tested and documented.

---

# API Contract Master — Part H: Billing & Subscription Management APIs

> Scope: Tenant-level subscription plans, seat limits, billing cycles, and Stripe integration touchpoints.  
> Stripe integration is implemented at the end, but all endpoints and data models are prepared now.

---

## 0) Conventions
- Tenant-aware endpoints with `Authorization` & `X-Tenant-Id` headers.
- All monetary values stored in minor currency units (e.g., cents).

---

## 1) Plan Model

### 1.1 Plan Object
```json
{
  "id":"plan_pro",
  "name":"Pro",
  "description":"Full access to all CRM features",
  "priceMinor":4999,
  "currency":"USD",
  "billingCycle":"monthly|yearly",
  "seatLimit":20,
  "features":["leads","inventory","marketing","reports"]
}
```

**CRUD**: `/billing/plans` (internal/admin only)

---

## 2) Tenant Subscription

### 2.1 Subscription Object
```json
{
  "id":"sub_1",
  "tenantId":"tenant_1",
  "planId":"plan_pro",
  "status":"active|trialing|past_due|canceled",
  "currentPeriodStart":"2025-08-01",
  "currentPeriodEnd":"2025-09-01",
  "seatLimit":20,
  "activeSeats":15,
  "paymentProvider":"stripe",
  "paymentProviderSubscriptionId":"sub_stripe_123"
}
```

**Endpoints**:
- `/billing/subscription` GET (current tenant)
- `/billing/subscription/upgrade` POST
- `/billing/subscription/cancel` POST

---

## 3) Seat Management

### 3.1 Add Seat
**POST** `/billing/seats/add`
```json
{"count":1}
```

### 3.2 Remove Seat
**POST** `/billing/seats/remove`
```json
{"count":1}
```

**Validation**: Cannot exceed `seatLimit`.

---

## 4) Stripe Integration Touchpoints (Optional, Implement Later)
- `/billing/stripe/checkout` → create Stripe Checkout Session.
- `/billing/stripe/portal` → access Stripe customer portal.
- Webhook: `/billing/stripe/webhook` → handle subscription events.

---

## 5) Invoicing & Payment History

### 5.1 Invoice Object
```json
{
  "id":"inv_1",
  "tenantId":"tenant_1",
  "amountMinor":4999,
  "currency":"USD",
  "status":"paid|unpaid|void",
  "issueDate":"2025-08-01",
  "dueDate":"2025-08-08",
  "pdfUrl":"https://cdn/invoices/inv_1.pdf"
}
```

**GET** `/billing/invoices?tenantId=tenant_1`

---

## 6) Trial Periods
- `trialing` status with trial end date.
- Auto-convert to `active` if payment method on file.

---

## 7) Alerts & Notifications
- Past-due alerts sent to tenant admins.
- Seat limit warnings when usage ≥ 90% of limit.

---

## 8) Acceptance
- Plan CRUD functional (internal).
- Tenant subscription endpoints ready.
- Seat count validation enforced.
- Stripe touchpoints documented for later implementation.

---

# API Contract Master — Part I: User & Role Management APIs with Groups, Role Trees, and Approvals

> Scope: Tenant-level user management, RBAC with groups, role trees, entitlements, and optional flat/multi-level approvals by function and/or amount.

---

## 0) Conventions
- Tenant-aware endpoints; `Authorization` & `X-Tenant-Id` headers required.
- User IDs: prefixed `u_`, role IDs prefixed `role_`, group IDs prefixed `grp_`.

---

## 1) User Model

### 1.1 User Object
```json
{
  "id":"u_1",
  "tenantId":"tenant_1",
  "email":"user@example.com",
  "phone":"+201000000000",
  "firstName":"Sara",
  "lastName":"Ibrahim",
  "status":"active|inactive|pending",
  "roles":["role_admin"],
  "groups":["grp_sales"],
  "phoneVerified":true,
  "lastLogin":"2025-08-09T10:00:00Z",
  "profileImageUrl":"https://cdn/users/u_1.png"
}
```

**Endpoints**:
- `/users` CRUD
- `/users/:id/status` POST
- `/users/:id/roles` POST
- `/users/:id/groups` POST

---

## 2) Roles & Role Trees

### 2.1 Role Object
```json
{
  "id":"role_sales_manager",
  "tenantId":"tenant_1",
  "name":"Sales Manager",
  "description":"Manages sales team and deals",
  "permissions":["leads.view","deals.edit","reports.view"],
  "parentRoleId":"role_sales"  
}
```
- `parentRoleId` allows role trees (inheritance of permissions).

**CRUD**: `/roles`

### 2.2 Permission Model
- Permissions defined globally; assigned to roles.
- Format: `module.action` (e.g., `inventory.view`, `inventory.edit`).

**GET** `/permissions`

---

## 3) Groups

### 3.1 Group Object
```json
{
  "id":"grp_sales",
  "tenantId":"tenant_1",
  "name":"Sales Team",
  "description":"Handles all leads and deals",
  "members":["u_1","u_2"],
  "assignedRoles":["role_sales_rep"]
}
```

**CRUD**: `/groups`

---

## 4) Approvals (Flat & Multi-Level)

### 4.1 Approval Policy Object
```json
{
  "id":"appr_deals_over_100k",
  "tenantId":"tenant_1",
  "name":"High Value Deals Approval",
  "module":"deals",
  "criteria":{"amountGreaterThan":100000},
  "type":"flat|multi_level",
  "levels":[
    {"order":1,"roleId":"role_sales_manager","minAmount":100000,"maxAmount":500000},
    {"order":2,"roleId":"role_director","minAmount":500001,"maxAmount":null}
  ]
}
```

**CRUD**: `/approvals`

### 4.2 Approval Requests
```json
{
  "id":"appr_req_1",
  "policyId":"appr_deals_over_100k",
  "recordId":"deal_101",
  "status":"pending|approved|rejected",
  "currentLevel":1,
  "history":[
    {"level":1,"approverId":"u_5","status":"approved","timestamp":"2025-08-09T11:00:00Z"}
  ]
}
```

**Endpoints**:
- `/approvals/requests` GET
- `/approvals/requests/:id/approve` POST
- `/approvals/requests/:id/reject` POST

---

## 5) Authentication Hooks
- Mobile number verification touchpoints (Part F).
- 2FA optional per tenant.

---

## 6) Audit Logging
- All role/group/approval changes logged with user & timestamp.

---

## 7) Acceptance
- User CRUD functional.
- Roles, groups, and permissions enforced at API level.
- Approval workflows support both flat & multi-level logic.

---

# API Contract Master — Part J: Appendices — Merged RBAC & Authorization

> Consolidated reference for role-based access control (RBAC), group entitlements, and approval workflows across all CRM modules.

---

## 1) RBAC Overview
RBAC in M3CoreCRM enforces access control at the API and UI level, ensuring users only see and perform actions they are authorized for.

- **Roles**: Define sets of permissions.
- **Permissions**: Granular rights in the format `module.action` (e.g., `deals.edit`).
- **Role Trees**: Parent-child relationships to inherit permissions.
- **Groups**: Logical user collections for easier role assignment.
- **Approvals**: Optional workflows tied to permissions and actions.

---

## 2) Permissions Registry (Global)
Permissions are defined globally and linked to modules.  
Example categories:
- Leads: `leads.view`, `leads.create`, `leads.edit`, `leads.delete`
- Deals: `deals.view`, `deals.edit`, `deals.approve`
- Inventory: `inventory.view`, `inventory.edit`, `inventory.publish`
- Marketing: `marketing.view`, `marketing.send`
- Reports: `reports.view`, `reports.export`
- Billing: `billing.view`, `billing.update`

**Endpoint**: `/permissions` returns full registry.

---

## 3) Default Role Templates (Per Tenant Type)

### Small Tenant (≤10 users)
- **Super Admin**: Full permissions.
- **Manager**: All except billing & plan management.
- **Agent**: Leads/deals access, read-only reports.

### Medium Tenant (≤50 users)
- **Department Manager**: Module-specific full access.
- **Team Lead**: Limited create/edit in assigned group.
- **Staff**: Read-only outside assigned deals/leads.

### Enterprise Tenant (>50 users)
- Department/Region segmentation.
- Multi-level approvals enforced for high-value actions.

---

## 4) Groups & Entitlements
Groups can:
- Have multiple roles assigned.
- Limit access to specific data scopes (e.g., sales region).
- Serve as approval workflow participants.

**Example**: Sales Team in Cairo has `role_sales_rep` and `role_inventory_viewer`.

---

## 5) Approval Workflows Integration
- Linked to both roles and groups.
- Supports **flat** (single-step) or **multi-level** (hierarchical) approvals.
- Approval triggers can be amount-based, function-based, or both.

**Example**:
- Deals > $100,000 require Sales Manager approval.
- Deals > $500,000 require Director approval after Sales Manager.

---

## 6) Cross-Module Enforcement Rules
- Inventory edit permission also required for uploading floor plans in Map Overlay module.
- Marketing send permission required for campaign scheduling in Leads module.
- Billing update permission required for seat increases in User Management.

---

## 7) Enforcement Flow
1. API Gateway checks `Authorization` & `X-Tenant-Id`.
2. Role permissions fetched & merged with group entitlements.
3. Approvals checked if applicable.
4. Action allowed or rejected with `403 Forbidden`.

---

## 8) Audit Logging
- All role, permission, group, and approval changes recorded.
- Audit logs immutable, stored with timestamp, actor, and change details.

---

## 9) Acceptance
- Single source of truth for RBAC across all modules.
- Role trees, groups, and approvals integrated and consistent.
- Cross-module rules explicitly mapped.

---

# API Contract Master — Part K: Executive Summary & Technical Highlights

---

## Executive Summary
The M3CoreCRM API Contract Master defines the foundation for a **multi-tenant, role-based, modular CRM system** with advanced flexibility, scalability, and extensibility.  
It consolidates endpoints, data models, and integration touchpoints across **Leads Management, Property Inventory, Marketing, Notifications, Reports, Billing, User Management, and Approvals** — ensuring development consistency and future-proofing.

### Key Goals:
- Centralized API definitions with shared models.
- Multi-tenant isolation at database and API levels.
- Optional feature integrations (Stripe, Infobip, VOIP/PBX).
- Fully documented touchpoints for deferred implementations.
- Clear separation of concerns between modules.

---

## Technical Highlights

### 1) **Architecture**
- **Backend**: Node.js + Express, PostgreSQL (multi-tenant schema via `company_id`).
- **Frontend**: React 18 (Vite) for CRM dashboard, Next.js 14 for marketing site.
- **ORM**: Prisma with strict schema versioning.
- **API Style**: RESTful with JSON payloads, tenant-aware endpoints.

### 2) **Multi-Tenancy**
- Tenant isolation via `X-Tenant-Id` header & database schema design.
- Role-based feature gating and seat limits per plan.

### 3) **Authentication & Security**
- JWT auth with refresh token rotation.
- Optional 2FA (Google Authenticator, SMS, WhatsApp).
- Role-based access control (RBAC) with role trees & group entitlements.
- Approval workflows (flat & multi-level) for high-value actions.

### 4) **Modularity**
- Each module (Leads, Deals, Marketing, Inventory, etc.) defined with CRUD endpoints & event hooks.
- Configurable dashboards per user.
- Extensible permission registry.

### 5) **Integrations**
- **Stripe** for subscription management (touchpoints prepared, deferred implementation).
- **Infobip** for SMS/WhatsApp (verification, notifications, marketing).
- **VOIP/PBX** optional for telemarketing.
- External BI tools (Power BI, Tableau) via raw analytics exports.

### 6) **Data Models & Codes**
- Unified code dictionaries for entity types (unit types, component types, lead sources, etc.).
- Support for optional dimensions on properties & components for analytics.

### 7) **Reporting & Analytics**
- Real-time KPIs, charts, and exportable reports.
- User-configurable dashboard widgets.
- BI integration endpoints for external reporting.

### 8) **Deployment & DevOps**
- Hosted on DigitalOcean App Platform + Vercel (marketing site).
- Managed PostgreSQL & object storage (DigitalOcean Spaces).
- CI/CD via GitHub Actions.
- Monitoring via Sentry & Datadog.

---

## Development Readiness
This contract ensures Claude-Code or other AI-assisted coding agents can generate consistent backend and frontend implementations **without architectural drift**.  
All integrations and optional modules are documented with touchpoints, allowing progressive rollout.

---

## Acceptance
- All modules defined in sequence, with appendices consolidating RBAC & cross-module rules.
- Deferred integrations have placeholders & documented touchpoints.
- Executive Summary & Technical Highlights serve as a quick onboarding reference for any developer or AI agent.

---