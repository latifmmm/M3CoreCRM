# Implementation & Task Plan — M3CoreCRM

## 1. Development Prerequisites
- **Install**: Node.js LTS, PostgreSQL, Prisma CLI, Docker (optional for local DB).
- **Frontend**: React 18 + Vite, Next.js 14, Tailwind CSS.
- **Backend**: Express.js with TypeScript, Prisma ORM.
- **Dev Tools**: GitHub Actions (CI/CD), Sentry, Datadog.
- **Hosting**: DigitalOcean App Platform (backend), Vercel (marketing site).
- **Object Storage**: DigitalOcean Spaces.

---

## 2. Project Setup
**Milestone 1: Base Monorepo**
1. Create monorepo with `packages/` for shared code.
2. Configure workspace: `backend/`, `crm-dashboard/`, `marketing-site/`.
3. Shared package for:
   - Models (`/packages/models`)
   - API types (`/packages/api-types`)
   - Utils (`/packages/utils`)

**Milestone 2: Core Config**
- ESLint, Prettier, Husky hooks.
- Environment variable management.
- Config manager for API URLs, keys.

---

## 3. Backend Development

### Phase 1 — Core Infrastructure
1. Setup Express server with tenant-aware middleware (`X-Tenant-Id`).
2. JWT authentication with refresh token rotation.
3. User CRUD with roles and groups.
4. RBAC middleware integrated with approval workflows.
5. Database connection (Prisma with multi-tenant schema).

**Deliverables**: 
- User management APIs.
- Role/group APIs.
- Approval policies APIs.

### Phase 2 — Core CRM Modules
1. Leads Management (CRUD, lead sources, statuses).
2. Deals/Pipelines (stages, activities linkage).
3. Contacts & Companies (link to leads/deals).
4. Activities & Tasks.

**Deliverables**:
- CRUD endpoints per module.
- Linking logic between entities.

### Phase 3 — Property Inventory Management
1. Property CRUD with unit/component type codes.
2. Map overlay APIs (optional at first).
3. Dimensions capture (units, rooms, etc.).

**Deliverables**:
- Inventory APIs ready for integration.

---

## 4. Frontend Development

### Phase 1 — CRM Dashboard Shell
1. Login & registration (with mobile/email verification hooks).
2. Multi-tenant sidebar & topbar.
3. User profile management.

### Phase 2 — Core Modules UI
- Leads, Deals, Contacts views with React Query for data fetching.
- Activity/Task board (drag & drop optional).
- Inventory listing & detail view.

### Phase 3 — Dashboard Customization
- Widget-based layout, draggable & resizable components.
- User-specific saved layouts.

---

## 5. Optional Integrations (Touchpoints Already in Place)
1. **Stripe** — Subscription upgrade/downgrade, billing portal.
2. **Infobip** — SMS/WhatsApp for 2FA, notifications, marketing.
3. **VOIP/PBX** — Telemarketing integration.

**Deliverables**: Activated in final sprint.

---

## 6. Reports & Analytics
- Server-side aggregation endpoints.
- Export endpoints (CSV, PDF).
- Dashboard widgets for KPIs.

---

## 7. Notifications & Communications
- In-app notification center.
- Email/SMS/WhatsApp routing (configurable per tenant).
- Alerts linked to module events.

---

## 8. Testing & QA
- Unit tests per service layer.
- Integration tests for API endpoints.
- E2E tests (Playwright/Cypress) for critical flows.
- Load testing for multi-tenant scenarios.

---

## 9. CI/CD Pipeline
- **Backend**: Lint → Test → Build → Deploy (DigitalOcean).
- **Frontend**: Lint → Test → Build → Deploy (Vercel).
- DB migrations run automatically on deployment.

---

## 10. Milestones & Timeline
**Sprint 1-2**: Monorepo setup, backend infra, authentication.  
**Sprint 3-4**: Core CRM backend modules.  
**Sprint 5-6**: Frontend core modules UI.  
**Sprint 7**: Inventory & map overlay APIs/UI.  
**Sprint 8**: Dashboard customization.  
**Sprint 9**: Reports, analytics, notifications.  
**Sprint 10**: Optional integrations (Stripe, Infobip, VOIP).  
**Sprint 11**: QA, load testing, security audit.  
**Sprint 12**: Production deployment.

---

## Acceptance Criteria
- All API endpoints implemented as per API Contract Master.
- Database schema matches Database Schema Master.
- Frontend matches UX wireframes & functional specs.
- Optional integrations wired without breaking core.
