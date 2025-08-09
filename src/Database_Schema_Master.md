# M3CoreCRM — Database Schema Master (PostgreSQL + Prisma targets)

> Source of truth for tables, fields, constraints, indexes, seed data, and optional partitions.  
> Multi‑tenant isolation via `tenant_id UUID NOT NULL` (aka `company_id`). All FK relations include `tenant_id` to guarantee scoping.  
> PKs are UUID v4. Timestamps are UTC (`created_at`, `updated_at`).

---

## 0) Global Conventions
- **Naming**: snake_case tables/columns; singular for tables that act as logs (e.g., `audit_logs` still plural).  
- **UUID**: default via `gen_random_uuid()` (pgcrypto or pguuid).  
- **Money**: use `BIGINT` minor units; `currency CHAR(3)`.  
- **JSON**: `JSONB` for flexible attrs; index only when needed.  
- **Soft delete**: avoid; use `status` flags or archival tables.
- **Seek pagination**: prefer `(tenant_id, created_at, id)` composites.

---

## 1) Identity & Tenancy

### 1.1 tenants
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  locale TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'Africa/Cairo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX tenants_slug_uq ON tenants(slug);
```

### 1.2 users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email CITEXT NOT NULL,
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active|suspended|deactivated
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX users_email_per_tenant_uq ON users(tenant_id, email);
```

### 1.3 user_profiles
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_e164 TEXT,
  phone_verified_at TIMESTAMPTZ,
  locale TEXT,
  timezone TEXT
);
```

### 1.4 roles, user_roles, groups, group_members, role_permissions
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  parent_role_id UUID REFERENCES roles(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX roles_code_uq ON roles(tenant_id, code);
CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  PRIMARY KEY(role_id, permission)
);
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);
CREATE TABLE group_members (
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  PRIMARY KEY(group_id, user_id)
);
CREATE INDEX group_members_tenant_user_ix ON group_members(tenant_id, user_id);
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  PRIMARY KEY(user_id, role_id)
);
```

### 1.5 sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);
CREATE INDEX sessions_user_created_ix ON sessions(user_id, created_at DESC);
```

### 1.6 audit_logs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX audit_logs_tenant_time_ix ON audit_logs(tenant_id, created_at DESC);
```

---

## 2) CRM Core

### 2.1 companies
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry_code TEXT,
  city TEXT,
  country TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX companies_tenant_name_ix ON companies(tenant_id, name);
```

### 2.2 contacts
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email CITEXT,
  phone_e164 TEXT,
  role_title_code TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX contacts_email_per_tenant_uq ON contacts(tenant_id, email) WHERE email IS NOT NULL;
CREATE INDEX contacts_phone_ix ON contacts(tenant_id, phone_e164);
```

### 2.3 leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  source_code TEXT,
  status_code TEXT NOT NULL DEFAULT 'new',
  score INT,
  attributes JSONB,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX leads_status_time_ix ON leads(tenant_id, status_code, created_at DESC);
CREATE INDEX leads_assignee_ix ON leads(tenant_id, assigned_to);
```

### 2.4 pipelines, stages, deals
```sql
CREATE TABLE deal_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);
CREATE TABLE deal_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pipeline_id UUID NOT NULL REFERENCES deal_pipelines(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  order_index INT NOT NULL
);
CREATE UNIQUE INDEX stage_code_uq ON deal_stages(tenant_id, pipeline_id, code);
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  pipeline_id UUID NOT NULL REFERENCES deal_pipelines(id) ON DELETE CASCADE,
  stage_id UUID NOT NULL REFERENCES deal_stages(id),
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount_minor BIGINT,
  currency CHAR(3),
  status TEXT NOT NULL DEFAULT 'open', -- open|won|lost
  expected_close_at DATE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX deals_stage_time_ix ON deals(tenant_id, pipeline_id, stage_id, updated_at DESC);
```

### 2.5 activities
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type_code TEXT NOT NULL, -- call|email|meeting|task
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  subject TEXT,
  description TEXT,
  due_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'open', -- open|done|cancelled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX activities_owner_due_ix ON activities(tenant_id, owner_user_id, due_at);
```

---

## 3) Property Inventory & Mapping

### 3.1 developers, projects, buildings (optional buildings if vertical)
```sql
CREATE TABLE developers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  logo_url TEXT
);
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES developers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  location JSONB, -- {lat, lng}
  status TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  map_overlay_id UUID
);
CREATE INDEX projects_tenant_name_ix ON projects(tenant_id, name);
```

### 3.2 coded dictionaries
```sql
CREATE TABLE unit_type_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID, -- NULL = global
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (COALESCE(tenant_id, '00000000-0000-0000-0000-000000000000'), code)
);
CREATE TABLE component_type_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (COALESCE(tenant_id, '00000000-0000-0000-0000-000000000000'), code)
);
```

### 3.3 units & components
```sql
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code TEXT,
  floor INT,
  unit_type_code TEXT NOT NULL,
  size_sqm NUMERIC(12,2),
  bedrooms INT,
  bathrooms INT,
  view TEXT,
  price_minor BIGINT,
  currency CHAR(3),
  status TEXT NOT NULL DEFAULT 'available',
  virtual_tour_url TEXT,
  length_m NUMERIC(12,2),
  width_m NUMERIC(12,2),
  height_m NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX units_lookup_ix ON units(tenant_id, status, unit_type_code, price_minor);
CREATE TABLE unit_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  component_type_code TEXT NOT NULL,
  name TEXT,
  length_m NUMERIC(12,2),
  width_m NUMERIC(12,2),
  height_m NUMERIC(12,2),
  area_sqm NUMERIC(12,2),
  sort_order INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX unit_components_unit_ix ON unit_components(tenant_id, unit_id);
CREATE TABLE unit_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
  price_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  effective_at TIMESTAMPTZ NOT NULL,
  changed_by_user_id UUID REFERENCES users(id)
);
CREATE INDEX unit_price_time_ix ON unit_price_history(tenant_id, unit_id, effective_at DESC);
```

### 3.4 mapping overlays & shapes
```sql
CREATE TABLE map_overlays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT,
  file_url TEXT,
  file_type TEXT,
  width_px INT,
  height_px INT,
  dpi INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE map_shapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  overlay_id UUID NOT NULL REFERENCES map_overlays(id) ON DELETE CASCADE,
  kind TEXT NOT NULL, -- unit|component
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  unit_component_id UUID REFERENCES unit_components(id) ON DELETE SET NULL,
  unit_type_code TEXT,
  component_type_code TEXT,
  geom_geojson JSONB NOT NULL,
  area_sqm NUMERIC(12,2),
  perimeter_m NUMERIC(12,2),
  label TEXT,
  version INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX map_shapes_overlay_kind_ix ON map_shapes(overlay_id, kind, is_active);
```

---

## 4) Marketing & Telemarketing (summaries)

### 4.1 campaigns & campaign_sends
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- email|sms|whatsapp|inapp
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE campaign_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  recipient_id UUID,
  recipient_type TEXT, -- contact|lead|user
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT,
  provider_message_id TEXT,
  queued_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  error_message TEXT
);
CREATE INDEX campaign_sends_lookup_ix ON campaign_sends(tenant_id, campaign_id, status, queued_at);
```

### 4.2 telemarketing_calls (adapter‑agnostic)
```sql
CREATE TABLE telemarketing_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  agent_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  phone_number TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  outcome_code TEXT,
  notes TEXT,
  recording_url TEXT,
  talk_time_sec INT,
  provider_session_id TEXT
);
CREATE INDEX tm_calls_agent_time_ix ON telemarketing_calls(tenant_id, agent_user_id, scheduled_at);
```

---

## 5) Notifications Core

```sql
CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  channel TEXT NOT NULL, -- email|sms|whatsapp|inapp
  locale TEXT DEFAULT 'en',
  version_status TEXT NOT NULL DEFAULT 'approved', -- draft|approved|retired
  subject TEXT,
  html_body TEXT,
  text_body TEXT,
  variables_schema JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, code, locale)
);
CREATE TABLE messages_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  to_email TEXT,
  to_phone_e164 TEXT,
  template_code TEXT,
  payload JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  provider TEXT,
  provider_message_id TEXT,
  idempotency_key TEXT,
  queued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  error_code TEXT
);
CREATE UNIQUE INDEX outbox_idem_uq ON messages_outbox(tenant_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE INDEX outbox_status_time_ix ON messages_outbox(tenant_id, status, queued_at DESC);

CREATE TABLE notifications_inbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- approvals|tasks|system|marketing
  title TEXT NOT NULL,
  body TEXT,
  meta JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX inbox_user_time_ix ON notifications_inbox(tenant_id, user_id, is_read, created_at DESC);

CREATE TABLE suppression_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  normalized_value TEXT NOT NULL,
  reason TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX suppression_lookup_ix ON suppression_list(tenant_id, channel, normalized_value);
```

---

## 6) Billing Touchpoints (Provider‑agnostic)

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tier INT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  feature_code TEXT NOT NULL,
  limit_value NUMERIC,
  UNIQUE(plan_id, feature_code)
);
CREATE TABLE tenant_subscription (
  tenant_id UUID PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES plans(id),
  status TEXT NOT NULL DEFAULT 'trial',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  renews_at TIMESTAMPTZ,
  provider TEXT,
  provider_customer_id TEXT,
  provider_sub_id TEXT
);
CREATE TABLE usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  metric_code TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  last_increment_at TIMESTAMPTZ,
  UNIQUE(tenant_id, metric_code, period_start)
);
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_amount BIGINT NOT NULL DEFAULT 0,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft',
  provider_invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_code TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_amount BIGINT NOT NULL,
  amount BIGINT NOT NULL,
  metadata JSONB
);
```

---

## 7) Approvals

```sql
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL, -- e.g., deal.stage.move
  subject_entity TEXT NOT NULL, -- deal|unit|campaign
  subject_id UUID NOT NULL,
  payload JSONB,
  state TEXT NOT NULL DEFAULT 'pending', -- pending|approved|rejected|cancelled|applied
  level INT NOT NULL DEFAULT 1,
  required_levels INT NOT NULL DEFAULT 1,
  requested_by UUID NOT NULL REFERENCES users(id),
  sla_due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_id UUID NOT NULL REFERENCES approvals(id) ON DELETE CASCADE,
  actor_user_id UUID,
  action TEXT NOT NULL, -- submitted|approved|rejected|escalated|cancelled|applied
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX approvals_inbox_ix ON approvals(tenant_id, state, level, sla_due_at);
```

---

## 8) Integration & Webhook Logs

```sql
CREATE TABLE integration_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- brevo|infobip|oauth
  event_type TEXT,
  raw JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE billing_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL, -- stripe
  event_type TEXT,
  raw JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  error_message TEXT
);
```

---

## 9) RLS (Optional) & Partitioning Guidance

- **RLS**: enable on hot tables if desired; set `SET app.tenant_id='<uuid>'` at session and policy `USING (tenant_id = current_setting('app.tenant_id')::uuid)`.
- **Partitioning**: monthly partitions recommended for `audit_logs`, `messages_outbox`, `integration_webhook_logs`; by tenant hash for extreme multi‑tenant scale.

---

## 10) Seed Data (Essentials)

```sql
-- global codes
INSERT INTO unit_type_codes (tenant_id, code, label) VALUES
  (NULL, 'APT_1BR', 'Apartment 1BR'),
  (NULL, 'APT_2BR', 'Apartment 2BR'),
  (NULL, 'VILLA_4BR', 'Villa 4BR');

INSERT INTO component_type_codes (tenant_id, code, label) VALUES
  (NULL, 'ROOM_BED', 'Bedroom'),
  (NULL, 'ROOM_BATH', 'Bathroom'),
  (NULL, 'KITCHEN_STD', 'Kitchen'),
  (NULL, 'BALCONY_STD', 'Balcony');

-- roles
INSERT INTO roles (tenant_id, code, name) VALUES
  ('${TENANT}', 'admin', 'Administrator'),
  ('${TENANT}', 'sales_exec', 'Sales Executive'),
  ('${TENANT}', 'inventory_mgr', 'Inventory Manager');

-- basic permissions (example)
INSERT INTO role_permissions (role_id, permission) SELECT r.id, p.perm
FROM roles r
JOIN (VALUES ('leads.view'),('leads.create'),('deals.view'),('inventory.view'),('reports.view')) AS p(perm) ON TRUE
WHERE r.code IN ('admin','sales_exec','inventory_mgr');
```

---

## 11) Prisma Notes (Mapping Hints)
- Use `@@index([tenantId, createdAt, id])` for seek pagination.  
- Composite unique: `@@unique([tenantId, email])` for contacts/users.  
- Enum types (optional) for `status_code`, `activity.type`; or keep TEXT + dictionaries.

---

## 12) Open Items
1. Decide whether to store **recording transcripts** (future AI features) in a separate storage.  
2. Confirm **read replicas** adoption for analytics-heavy queries.  
3. Confirm **GiST PostGIS** usage vs GeoJSON in JSONB for maps.

---

**End — Database Schema Master**
