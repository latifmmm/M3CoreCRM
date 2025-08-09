# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 CRITICAL: Implementation Guidelines

**MANDATORY**: Before ANY implementation work:
1. Check `SESSION_NOTES.md` for current session state
2. Review `IMPLEMENTATION_LOG.md` for recent progress
3. Consult specification documents for exact requirements
4. Update progress logs at session end

## Active Agents System

**IMPORTANT: Always check src/AGENTS.md for the complete active agents system before processing any user prompt.**

📍 **Agent System Reference**: All agent definitions, invocation rules, and coordination guidelines are maintained in [`src/AGENTS.md`](./src/AGENTS.md)

The active agents system includes:
- 31 specialized agents organized into 10 categories
- Specific invocation triggers and enhanced keywords for each agent
- Multi-agent coordination rules for complex tasks
- Example scenarios and selection guidelines

**Before responding to any prompt, consult src/AGENTS.md to determine if a specialized agent should be invoked.**

## 📚 Critical Documentation References

### Core Specifications (MUST READ)
- **Full Specification**: [`src/M3CoreCRM_Specification_Full_v1.0.md`](./src/M3CoreCRM_Specification_Full_v1.0.md) - Complete system requirements
- **Database Schema**: [`src/Database_Schema_Master.md`](./src/Database_Schema_Master.md) - PostgreSQL schema with multi-tenant structure
- **API Contracts**: [`src/Pre-Coding_Document.md`](./src/Pre-Coding_Document.md) - Detailed API endpoint specifications
- **OpenAPI Definition**: [`src/OpenAPI_v1_Full.yaml`](./src/OpenAPI_v1_Full.yaml) - Full API contract

### Implementation Guides
- **Implementation Plan**: [`src/Implementation_Task_Plan_M3CoreCRM.md`](./src/Implementation_Task_Plan_M3CoreCRM.md) - Sprint-by-sprint development plan
- **Environment Setup**: [`src/Environment_Secrets_Management_Guide_M3CoreCRM.md`](./src/Environment_Secrets_Management_Guide_M3CoreCRM.md) - Environment variables and secrets
- **CI/CD Guide**: [`src/CICD_Deployment_Guide_M3CoreCRM.md`](./src/CICD_Deployment_Guide_M3CoreCRM.md) - Deployment pipelines
- **UI Components**: [`src/UI_Component_Library_Theming_Spec.md`](./src/UI_Component_Library_Theming_Spec.md) - Component specifications

### Quality & Operations
- **Security Model**: [`src/Security_Privacy_Threat_Model_M3CoreCRM.md`](./src/Security_Privacy_Threat_Model_M3CoreCRM.md) - STRIDE threat model
- **Test Strategy**: [`src/Test_Strategy_QA_Plan_M3CoreCRM.md`](./src/Test_Strategy_QA_Plan_M3CoreCRM.md) - Testing requirements
- **NFRs & SLOs**: [`src/NonFunctional_Requirements_SLOs_M3CoreCRM.md`](./src/NonFunctional_Requirements_SLOs_M3CoreCRM.md) - Performance targets
- **Runbooks**: [`src/Runbooks_Deploy_Rollback_Incident_M3CoreCRM.md`](./src/Runbooks_Deploy_Rollback_Incident_M3CoreCRM.md) - Operational procedures

### Reference Data
- **Data Dictionary**: [`src/Module_Data_Dictionary_M3CoreCRM.md`](./src/Module_Data_Dictionary_M3CoreCRM.md) - Coded lists and enums
- **Postman Collection**: [`src/M3CoreCRM_Postman_Collection.json`](./src/M3CoreCRM_Postman_Collection.json) - API testing

## 🛠️ Implementation Standards

### Database Requirements
- **ALWAYS** include `tenant_id` in every table and query
- Use UUID v4 for all primary keys
- Follow the Database Schema Master EXACTLY
- Implement audit logging for all data changes
- Use Prisma ORM with TypeScript

### API Development
- Follow API Contract Master specifications precisely
- Implement idempotency keys for create/update operations
- Use proper HTTP status codes and error formats
- Include request validation with Zod
- Maintain OpenAPI documentation

### Security Mandates
- JWT with access (15min) and refresh (30d) tokens
- Implement refresh token rotation with reuse detection
- Use Argon2id for password hashing
- Rate limiting on all endpoints
- HMAC signature verification for webhooks
- Tenant isolation in EVERY query

### Testing Requirements
- Minimum 80% unit test coverage
- Minimum 70% integration test coverage
- E2E tests for all critical user flows
- Load testing before production deployment
- Security testing with OWASP ZAP

## 📊 Progress Tracking Protocol

### Session Management
1. **Start of Session**:
   - Read `SESSION_NOTES.md` for context
   - Check `IMPLEMENTATION_LOG.md` for recent work
   - Review current sprint in `PROJECT_STATUS.md`

2. **During Session**:
   - Follow specifications exactly
   - Document decisions in code comments
   - Create tests alongside implementation

3. **End of Session**:
   - Update `IMPLEMENTATION_LOG.md` with work completed
   - Update `SESSION_NOTES.md` with current state
   - Update `PROJECT_STATUS.md` if milestone reached
   - Commit with descriptive messages

## 🔔 Enhancement & Change Protocol

### When to Flag for Approval
- Any deviation from specification documents
- Performance optimizations not in NFRs
- New dependencies or technology choices
- Schema changes beyond specifications
- Security model modifications

### How to Propose Enhancements
1. **Document the Issue**: Clearly describe what needs enhancement and why
2. **Propose Solution**: Provide specific implementation approach
3. **Impact Analysis**: List affected components and risks
4. **Wait for Approval**: DO NOT implement without explicit approval

### Enhancement Template
```markdown
## Proposed Enhancement
**Component**: [Component name]
**Specification**: [Reference to spec document]
**Issue**: [What needs to be enhanced]
**Proposed Solution**: [How to fix it]
**Impact**: [What will be affected]
**Risk**: [Low/Medium/High]
```

## Project Overview

M3Labs Hybrid CRM is a multi-tenant SaaS platform featuring:
- **React 18 + Vite** CRM dashboard
- **Next.js 14+ App Router** marketing site
- **Node.js + Express + PostgreSQL** backend
- **Brevo (Sendinblue)** for transactional + marketing emails
- **Google Authenticator (TOTP)** 2FA
- **OAuth logins** (Google, Apple, LinkedIn)
- **Stripe** subscription billing
- **Multi-tenant RBAC** (role-based access control)

Each agent is documented in **Role / Process / Provide** format for consistent, specialized responses.

## Orchestration Memories
- Always check src/AGENTS.md for the active agents system before processing user prompts
- Always use the latest stable components and dependencies
- The agent system is maintained separately in src/AGENTS.md for easier updates

## Agent System Status (2025-08-07)

### ✅ Completed System Migration
1. **Modernized to Active Agents System**
   - Migrated from old subagent orchestration to streamlined active agents approach
   - All 30 agents now use simplified @agent-name invocation format
   - Removed complex file loading and directory navigation requirements

2. **Cleaned Architecture**
   - Removed outdated orchestration rules and file mapping sections
   - Streamlined CLAUDE.md to focus on active agents system only
   - Eliminated confusion from old subagent loading mechanisms

3. **Enhanced Agent Selection**
   - Clear invocation criteria with enhanced triggers for each agent
   - Multi-agent coordination rules for complex tasks
   - Priority guidelines for agent selection and escalation

### 🎯 Active Agents Benefits
- **Simplified Invocation**: Direct @agent-name format instead of complex file loading
- **Clear Responsibilities**: Each agent has specific "Invoke when" criteria
- **Better Coordination**: Multi-agent rules for complex cross-domain tasks
- **Faster Response**: No need to load external files or navigate directories

## Project Structure

```
M3CoreCRM/
├── apps/                # Application packages
│   ├── backend/        # Express API server (Node.js + TypeScript)
│   ├── frontend/       # React CRM dashboard (Vite + TypeScript)
│   └── marketing/      # Next.js marketing site (App Router)
├── packages/           # Shared packages
│   ├── shared/         # Common utilities and constants
│   ├── types/          # TypeScript type definitions
│   └── ui/             # Reusable React components
├── src/                # Documentation and specifications
│   ├── AGENTS.md       # Complete agent system documentation
│   ├── M3CoreCRM_SPECS.md
│   ├── database-schema.md
│   ├── tech-stack.md
│   └── *.md            # Other documentation files
├── keys/               # Authentication keys (e.g., Apple OAuth)
├── .env.example        # Environment variables template
├── package.json        # Root monorepo configuration
├── README.md           # Project documentation
└── CLAUDE.md           # This file
```

## Development Guidelines

### Setup Instructions
1. **Prerequisites**: Node.js v24.5.0+, PostgreSQL v17.5, Redis v8.2.0
2. **Install**: Run `npm install` in root directory
3. **Configure**: Copy `.env.example` to `.env` and update values
4. **Database**: Create PostgreSQL database named `m3core_crm`
5. **Development**: Run `npm run dev` to start all services

### Development Commands
- `npm run dev` - Start all services concurrently
- `npm run dev:backend` - Start backend API (port 5000)
- `npm run dev:frontend` - Start CRM dashboard (port 3000)
- `npm run dev:marketing` - Start marketing site (port 3001)
- `npm run build` - Build all packages for production
- `npm run lint` - Run ESLint across all packages
- `npm run test` - Run tests across all packages

### Key Technologies Implemented
- **Monorepo**: npm workspaces for package management
- **Backend**: Express + TypeScript + PostgreSQL + Redis
- **Frontend**: React 18 + Vite + TanStack Query + Zustand
- **Marketing**: Next.js 15 with App Router
- **Styling**: Tailwind CSS across all applications
- **Authentication**: JWT + bcrypt + OAuth ready
- **Type Safety**: Shared TypeScript definitions

## Notes

- The .claude/settings.local.json allows the `find` command to be used in bash
- Update this file as the project develops with specific build commands and architecture details