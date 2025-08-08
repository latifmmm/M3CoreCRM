# M3Labs Hybrid CRM - Active Agents System

## Active Agents Overview
The M3Labs Hybrid CRM includes 30 specialized agents organized into 10 categories. Each agent has specific invocation triggers and enhanced keywords for precise selection. The system uses a hierarchical approach where agents can coordinate for complex tasks.

## Agent Categories and Colors
- 🟦 **Tech Stack** (1 agent) - Architecture and technology decisions
- 🟨 **Core Infrastructure** (5 agents) - Backend systems, database, APIs, migrations
- 🟥 **Security & Compliance** (3 agents) - Authentication, security, audit logging
- 🟪 **Communication** (1 agent) - Email notifications and messaging
- 🟩 **Frontend Development** (12 agents) - UI/UX, components, performance, accessibility
- 💰 **Payments & Billing** (1 agent) - Stripe integration and subscription management
- 🧪 **Testing & Quality** (1 agent) - Automated testing and quality assurance
- ⚡ **Performance & Operations** (2 agents) - Optimization and disaster recovery
- 📊 **Product Features** (3 agents) - Analytics, search, feature flags
- 🔧 **DevOps & Documentation** (1 agent) - Documentation and Git management

## Complete Invocation Rules

### 🟦 Tech Stack (1 Agent)
**@tech-stack-final** - Technology Stack & Architecture Guide
- **Invoke when:** User asks about technology choices, architecture decisions, dependency versions, environment setup, integration points, stack selection, framework comparisons
- **Enhanced triggers:** architecture, dependencies, environment, integration, React, Next.js, PostgreSQL, Prisma, Node.js, tech stack, framework selection, deployment architecture, API design patterns

### 🟨 Core Infrastructure (5 Agents)
**@local-dev-project-setup** - Local Development & Project Setup Specialist
- **Invoke when:** User asks about local setup, development environment, monorepo structure, Docker setup, macOS development, dependency installation, project initialization
- **Enhanced triggers:** local development, setup, environment, monorepo, Docker, macOS, dependencies, Node.js, PostgreSQL, development workflow, project structure

**@database-query-optimization** - Database Query Optimization Specialist
- **Invoke when:** User asks about PostgreSQL optimization, database schema, indexing strategies, Prisma configuration, query performance, database migrations
- **Enhanced triggers:** database, PostgreSQL, Prisma, queries, optimization, indexing, schema design, migrations, performance tuning, ORM

**@api-contract-integration-manager** - API Contracts & Backend Architecture Specialist
- **Invoke when:** User asks about API design, backend architecture, integration patterns, contract definitions, service communication, API documentation
- **Enhanced triggers:** API, backend, contracts, integration, microservices, REST, GraphQL, service architecture, API documentation, OpenAPI

**@data-migration-import-export** - Data Migration & Schema Evolution Expert
- **Invoke when:** User asks about data migration, import/export functionality, legacy system integration, bulk data operations, schema evolution
- **Enhanced triggers:** migration, import, export, data transfer, legacy systems, bulk operations, schema changes, data transformation

**@integration-webhooks-manager** - Integration & Webhooks Manager
- **Invoke when:** User asks about webhooks, third-party integrations, API authentication, external service connections, integration security
- **Enhanced triggers:** webhooks, integration, third-party, API authentication, external services, integration security, callback handling

### 🟥 Security & Compliance (3 Agents)
**@authentication-rbac-specialist** - Authentication & RBAC Specialist
- **Invoke when:** User asks about authentication, authorization, RBAC, 2FA, OAuth, user management, session management, security tokens
- **Enhanced triggers:** authentication, authorization, RBAC, 2FA, OAuth, JWT, session management, user roles, security, login, permissions

**@security-compliance-manager** - Security & Compliance Manager
- **Invoke when:** User asks about security audits, GDPR compliance, CCPA, data protection, encryption, security best practices, compliance requirements
- **Enhanced triggers:** security, GDPR, CCPA, compliance, data protection, encryption, audit, privacy, security standards, penetration testing

**@audit-logging-activity-tracking** - Audit Logging & Activity Tracking Specialist
- **Invoke when:** User asks about audit logs, activity tracking, compliance logging, event logging, user activity monitoring, audit trails
- **Enhanced triggers:** audit logging, activity tracking, compliance logging, event tracking, user activity, audit trails, monitoring, forensics

### 🟪 Communication (1 Agent)
**@notifications-communication-specialist** - Notifications & Communication Specialist
- **Invoke when:** User asks about Brevo integration, email templates, notification systems, communication workflows, email automation, transactional emails
- **Enhanced triggers:** Brevo, email, notifications, templates, communication, email automation, transactional emails, marketing emails, messaging

### 🟩 Frontend Development (12 Agents)
**@shared-component-design-system** - Shared Component & Design System Manager
- **Invoke when:** User asks about design systems, UI components, Tailwind CSS, component library, design tokens, reusable components
- **Enhanced triggers:** design system, components, Tailwind, UI library, design tokens, component architecture, styling, CSS

**@frontend-state-data-flow** - Frontend State & Data Flow Manager
- **Invoke when:** User asks about state management, Zustand, React Query, data fetching, client-side caching, state architecture
- **Enhanced triggers:** state management, Zustand, React Query, data fetching, caching, state architecture, client state, server state

**@frontend-component-animation** - Frontend Component & Animation Manager
- **Invoke when:** User asks about animations, transitions, microinteractions, CSS animations, motion design, UI effects
- **Enhanced triggers:** animations, transitions, microinteractions, motion design, CSS animations, UI effects, Framer Motion

**@i18n-localization-manager** - i18n & Localization Manager
- **Invoke when:** User asks about internationalization, localization, multi-language support, RTL layouts, translation management
- **Enhanced triggers:** i18n, localization, translations, multi-language, RTL, internationalization, language support

**@mobile-cross-platform-specialist** - Mobile & Cross-Platform Specialist
- **Invoke when:** User asks about mobile optimization, responsive design, PWA, native mobile, cross-platform development, mobile performance
- **Enhanced triggers:** mobile, responsive, PWA, native, cross-platform, mobile optimization, touch interfaces, mobile performance

**@seo-marketing-performance** - SEO & Marketing Performance Manager
- **Invoke when:** User asks about SEO optimization, Core Web Vitals, marketing site performance, search engine optimization, metadata management
- **Enhanced triggers:** SEO, Core Web Vitals, marketing site, search optimization, metadata, performance optimization, search rankings

**@accessibility-ux-standards** - Accessibility & UX Standards Specialist
- **Invoke when:** User asks about accessibility, WCAG compliance, screen readers, keyboard navigation, inclusive design, usability
- **Enhanced triggers:** accessibility, WCAG, screen readers, keyboard navigation, inclusive design, usability, a11y, ADA compliance

**@responsive-layout-adaptive-design** - Responsive Layout & Adaptive Design Specialist
- **Invoke when:** User asks about responsive layouts, breakpoints, adaptive design, cross-device compatibility, layout optimization
- **Enhanced triggers:** responsive design, breakpoints, adaptive layout, cross-device, layout optimization, mobile-first, fluid design

**@form-validation-input-experience** - Form Validation & Input Experience Specialist
- **Invoke when:** User asks about form validation, React Hook Form, Zod validation, input components, form UX, validation patterns
- **Enhanced triggers:** forms, validation, React Hook Form, Zod, input validation, form UX, user input, field validation

**@data-visualization-charting** - Data Visualization & Charting Specialist
- **Invoke when:** User asks about charts, graphs, data visualization, dashboards, Recharts, D3.js, analytics visualization
- **Enhanced triggers:** charts, graphs, data visualization, dashboards, Recharts, D3.js, analytics, data presentation

**@frontend-build-bundling-optimization** - Frontend Build & Bundling Optimization Specialist
- **Invoke when:** User asks about build optimization, bundle analysis, code splitting, lazy loading, Vite configuration, webpack optimization
- **Enhanced triggers:** build optimization, bundling, code splitting, lazy loading, Vite, webpack, performance budgets, asset optimization

**@theme-branding-system** - Theme & Branding System Specialist
- **Invoke when:** User asks about theming systems, multi-tenant branding, light/dark mode, theme configuration, brand customization
- **Enhanced triggers:** theming, branding, multi-tenant, light mode, dark mode, theme configuration, brand customization, design tokens

### 💰 Payments & Billing (1 Agent)
**@stripe-billing-subscription** - Stripe Billing & Subscription Specialist
- **Invoke when:** User asks about Stripe integration, subscription billing, payment processing, subscription management, billing automation
- **Enhanced triggers:** Stripe, billing, subscriptions, payments, payment processing, subscription management, billing automation, invoicing

### 🧪 Testing & Quality (1 Agent)
**@testing-quality-assurance-manager** - Testing & Quality Assurance Manager
- **Invoke when:** User asks about unit testing, integration testing, E2E testing, test automation, quality assurance, testing strategies
- **Enhanced triggers:** testing, unit tests, integration tests, E2E, test automation, quality assurance, Vitest, Jest, Playwright, Cypress

### ⚡ Performance & Operations (2 Agents)
**@performance-optimization-manager** - Performance & Optimization Manager
- **Invoke when:** User asks about Core Web Vitals optimization, performance tuning, backend profiling, database performance, speed optimization
- **Enhanced triggers:** performance, Core Web Vitals, optimization, profiling, speed, performance tuning, LCP, FID, CLS, TTFB

**@backup-disaster-recovery** - Backup & Disaster Recovery Specialist
- **Invoke when:** User asks about backup strategies, disaster recovery, restore procedures, data retention, business continuity, failover
- **Enhanced triggers:** backup, disaster recovery, restore, data retention, business continuity, failover, RTO, RPO, backup automation

### 📊 Product Features (3 Agents)
**@analytics-reporting-specialist** - Analytics & Reporting Specialist
- **Invoke when:** User asks about dashboards, reporting, analytics, KPIs, data aggregation, business intelligence, metrics tracking
- **Enhanced triggers:** analytics, reporting, dashboards, KPIs, metrics, business intelligence, data aggregation, charts, graphs

**@search-filtering-specialist** - Search & Filtering Specialist
- **Invoke when:** User asks about search functionality, filtering systems, autocomplete, full-text search, search optimization, faceted search
- **Enhanced triggers:** search, filtering, autocomplete, full-text search, search optimization, faceted search, elasticsearch, search performance

**@feature-flag-experimentation** - Feature Flag & Experimentation Specialist
- **Invoke when:** User asks about feature flags, A/B testing, experimentation, staged rollouts, canary deployments, user segmentation
- **Enhanced triggers:** feature flags, A/B testing, experiments, rollouts, canary deployment, user segmentation, feature toggles

### 🔧 DevOps & Documentation (1 Agent)
**@documentation-git-manager** - Documentation & Git Manager
- **Invoke when:** User asks about documentation standards, Git workflows, commit strategies, PR management, release tagging, branching strategies
- **Enhanced triggers:** documentation, Git, commits, pull requests, branching, release management, Git workflows, documentation standards

## Multi-Agent Coordination Rules
1. **Primary Agent Selection**: Choose the most specific agent that matches the user's request
2. **Secondary Agent Coordination**: If multiple domains are involved, invoke additional relevant agents
3. **Cross-Domain Integration**: Agents can reference integration handoffs to coordinate complex tasks
4. **Escalation Path**: If no agent matches perfectly, use the closest match and note the limitation

## Quick Reference Table
| Task Type | Primary Agent | Secondary Agents |
|-----------|---------------|------------------|
| **Architecture Planning** | @tech-stack-final | @local-dev-project-setup |
| **Database Design** | @database-query-optimization | @api-contract-integration-manager |
| **Authentication Setup** | @authentication-rbac-specialist | @security-compliance-manager |
| **Frontend Components** | @shared-component-design-system | @theme-branding-system, @accessibility-ux-standards |
| **Performance Issues** | @performance-optimization-manager | @frontend-build-bundling-optimization |
| **Testing Strategy** | @testing-quality-assurance-manager | @performance-optimization-manager |
| **API Development** | @api-contract-integration-manager | @integration-webhooks-manager |
| **Mobile Development** | @mobile-cross-platform-specialist | @responsive-layout-adaptive-design |
| **Analytics Implementation** | @analytics-reporting-specialist | @data-visualization-charting |
| **Search Features** | @search-filtering-specialist | @performance-optimization-manager |

## When to Use Which Agent - Examples & Guidelines

### Example Invocation Scenarios

#### Technical Architecture & Setup
- **"How should I structure the monorepo?"** → @local-dev-project-setup
- **"What database indexes should I create?"** → @database-query-optimization  
- **"How do I configure React with TypeScript?"** → @tech-stack-final
- **"API rate limiting implementation"** → @api-contract-integration-manager

#### Security & Authentication
- **"Implement user login with 2FA"** → @authentication-rbac-specialist
- **"GDPR compliance checklist"** → @security-compliance-manager
- **"Track user actions for audit"** → @audit-logging-activity-tracking

#### Frontend Development
- **"Create a design system with Tailwind"** → @shared-component-design-system
- **"State management best practices"** → @frontend-state-data-flow
- **"Add smooth transitions to buttons"** → @frontend-component-animation
- **"Support Arabic RTL layout"** → @i18n-localization-manager
- **"Optimize for mobile devices"** → @mobile-cross-platform-specialist
- **"Improve SEO rankings"** → @seo-marketing-performance
- **"Make the app accessible"** → @accessibility-ux-standards
- **"Responsive grid system"** → @responsive-layout-adaptive-design
- **"Form validation with React Hook Form"** → @form-validation-input-experience
- **"Dashboard with charts"** → @data-visualization-charting
- **"Bundle size is too large"** → @frontend-build-bundling-optimization
- **"Multi-tenant theming system"** → @theme-branding-system

#### Performance & Quality
- **"Why is the app slow?"** → @performance-optimization-manager
- **"Set up automated backups"** → @backup-disaster-recovery
- **"Testing strategy for the project"** → @testing-quality-assurance-manager

#### Product Features
- **"Analytics dashboard implementation"** → @analytics-reporting-specialist
- **"Search functionality with filters"** → @search-filtering-specialist
- **"A/B test new features"** → @feature-flag-experimentation

#### Business Operations
- **"Stripe subscription billing"** → @stripe-billing-subscription
- **"Email notification system"** → @notifications-communication-specialist
- **"Git workflow and documentation"** → @documentation-git-manager

### Selection Priority Guidelines
1. **Exact Match**: Choose agent with most specific expertise for the task
2. **Broad Match**: If no exact match, choose the closest related agent
3. **Multi-Domain**: For complex tasks, coordinate multiple agents
4. **Escalation**: If uncertain, start with @tech-stack-final for architecture questions

### Agent Coordination Examples
- **Authentication + Email**: @authentication-rbac-specialist + @notifications-communication-specialist
- **Mobile Performance**: @mobile-cross-platform-specialist + @performance-optimization-manager  
- **Accessible Components**: @shared-component-design-system + @accessibility-ux-standards
- **SEO + Performance**: @seo-marketing-performance + @frontend-build-bundling-optimization