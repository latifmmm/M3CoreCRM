# M3Core CRM Implementation Plan

## Project Overview
M3Core CRM is a multi-tenant real estate management SaaS platform with:
- **Frontend**: React 18 + Vite CRM dashboard  
- **Marketing Site**: Next.js 14+ App Router
- **Backend**: Node.js + Express + PostgreSQL
- **Email**: Brevo (Sendinblue) for transactional + marketing emails
- **Authentication**: Google Authenticator (TOTP) 2FA + OAuth (Google, Apple, LinkedIn)
- **Billing**: Stripe subscription billing
- **Access Control**: Multi-tenant RBAC (role-based access control)

## Current Status: Phase 0 - Foundation Setup ✅ COMPLETE

### ✅ Completed Tasks (Phase 0)
1. **Build master layout for CRM dashboard** ✅
   - Imported MasterLayout from MasterComponents
   - Fixed TypeScript module configuration (CommonJS → ESNext)
   
2. **Create navigation components** ✅
   - Header with breadcrumbs, notifications, user menu
   - VS Code-style dual sidebar (icon rail + expandable panel)
   - Status bar with system information
   
3. **Implement responsive layout system** ✅
   - Mobile-responsive sidebar
   - Flexible grid layouts
   - Consistent spacing and padding
   
4. **Set up theme and design tokens** ✅
   - Dark/light mode toggle
   - CSS variables for colors
   - Tailwind configuration with custom colors
   
5. **Create layout context for state management** ✅
   - Zustand store for app state
   - Theme and language management
   
6. **Create remaining placeholder pages** ✅
   - Dashboard with stats and quick actions
   
7. **Copy logo and static assets** ✅
   - Logo files in place
   
8. **Update CSS with Tailwind configuration** ✅
   - PostCSS configuration fixed
   - Tailwind forms plugin added
   - Dark mode class-based approach
   
9. **Test the master layout** ✅
   - Layout renders correctly
   - Dark/light mode working
   - Sidebar colors consistent

### ✅ Recently Completed
- **Fix sidebar icons not displaying** ✅
  - Icons imported as component references ✅
  - Changed from fill-current to stroke-current ✅
  - Dashboard icon with submenu added ✅
  - Added debug code to show "?" if Icon is falsy ✅
  - **Solution**: Hardcoded icon rendering based on item ID with fallback to defaultItems
  - Fixed dark mode active state visibility (changed to `bg-blue-500/20`)
  - **Debug Steps Taken**:
    - Verified lucide-react is installed in both packages
    - Changed CSS classes (fill-current, stroke-current, text-current)
    - Added conditional rendering to detect if Icons are undefined
    - Created icons.ts re-export file
    - Used defaultItems when no items passed from parent
    - Finally hardcoded icons based on item.id which resolved the issue
  - **Note**: All 7 sidebar icons now displaying correctly

## Phase 1: Core Backend Infrastructure (Weeks 1-4)

### Week 1-2: Database & Authentication
- [ ] PostgreSQL schema with multi-tenant structure
  - tenants table
  - users table with tenant_id
  - roles & permissions tables
  - properties, leads, deals tables
- [ ] JWT authentication with refresh tokens
- [ ] Google Authenticator TOTP setup
- [ ] OAuth integration (Google, Apple, LinkedIn)
- [ ] Role-based middleware

### Week 3-4: Core API Development
- [ ] Express.js REST API structure
- [ ] Tenant isolation middleware
- [ ] CRUD operations for:
  - Properties
  - Leads & Clients
  - Deals & Transactions
- [ ] API documentation with OpenAPI/Swagger
- [ ] Input validation with Joi/Zod
- [ ] Error handling middleware

## Phase 2: CRM Core Features (Weeks 5-8)

### Week 5-6: Property Management
- [ ] Property listing interface
- [ ] Advanced search & filters
- [ ] Property details pages
- [ ] Image upload with optimization
- [ ] Property status workflow
- [ ] Bulk import/export

### Week 7-8: Lead & Client Management
- [ ] Lead capture forms
- [ ] Lead scoring algorithm
- [ ] Lead assignment rules
- [ ] Client profiles & history
- [ ] Communication log
- [ ] Lead-to-client conversion

## Phase 3: Advanced Features (Weeks 9-12)

### Week 9-10: Communication & Marketing
- [ ] Brevo integration setup
- [ ] Email templates (transactional)
- [ ] Marketing campaign builder
- [ ] SMS notifications
- [ ] In-app notifications
- [ ] Email tracking & analytics

### Week 11-12: Billing & Subscriptions
- [ ] Stripe integration
- [ ] Subscription plans setup
- [ ] Usage-based billing
- [ ] Invoice generation
- [ ] Payment history
- [ ] Dunning management

## Phase 4: Analytics & Reporting (Weeks 13-14)

### Week 13: Analytics Dashboard
- [ ] Real-time metrics
- [ ] Sales pipeline visualization
- [ ] Performance KPIs
- [ ] Team productivity metrics
- [ ] Revenue forecasting

### Week 14: Custom Reports
- [ ] Report builder interface
- [ ] Scheduled reports
- [ ] Export to PDF/Excel
- [ ] Data visualization with D3.js
- [ ] Saved report templates

## Phase 5: Mobile & PWA (Weeks 15-16)

### Week 15: Mobile Optimization
- [ ] Responsive design refinement
- [ ] Touch gestures
- [ ] Offline mode with service workers
- [ ] Push notifications

### Week 16: PWA Features
- [ ] App manifest
- [ ] Install prompts
- [ ] Background sync
- [ ] Camera integration for property photos

## Phase 6: Testing & Deployment (Weeks 17-18)

### Week 17: Testing
- [ ] Unit tests (Jest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Performance testing
- [ ] Security audit

### Week 18: Deployment
- [ ] CI/CD pipeline setup
- [ ] Docker containerization
- [ ] Kubernetes deployment
- [ ] SSL certificates
- [ ] CDN configuration
- [ ] Monitoring setup (Datadog/NewRelic)

## Technical Debt & Known Issues

### Current Issues
1. **Sidebar Icons Not Displaying**
   - Component references implemented correctly
   - Lucide-react installed in both UI package and frontend
   - Icons are being imported but not rendering visually
   - Possible bundling or CSS issue

### Technical Improvements Needed
1. Error boundary components
2. Loading states and skeletons
3. Form validation schemas
4. API rate limiting
5. Request caching strategy
6. Database connection pooling
7. Automated backups

## Development Guidelines

### Code Standards
- TypeScript strict mode
- ESLint + Prettier configuration
- Conventional commits
- PR templates
- Code review process

### Architecture Decisions
- Monorepo with npm workspaces
- Shared UI component library
- Centralized type definitions
- Feature-based folder structure
- Domain-driven design for backend

### Testing Strategy
- Unit tests: 80% coverage minimum
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance budgets
- Accessibility testing (WCAG 2.1 AA)

## Next Immediate Actions
1. Debug and fix sidebar icon rendering issue
2. Begin Phase 1 PostgreSQL schema implementation
3. Set up backend Express.js boilerplate
4. Configure ESLint and Prettier across monorepo
5. Create API design documentation

## Resources & Dependencies
- **UI Framework**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Prisma ORM
- **Authentication**: Passport.js, Speakeasy (TOTP)
- **Email**: Brevo API
- **Payments**: Stripe API
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library, Playwright

---

*Last Updated: 2025-01-09*
*Current Phase: 0 - Foundation Setup ✅ COMPLETE*
*Next Phase: 1 - Core Backend Infrastructure*