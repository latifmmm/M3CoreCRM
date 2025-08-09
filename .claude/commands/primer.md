# Prime Context for Claude Code

## Critical Files to Review (In Order)

1. **SESSION_NOTES.md** - Check current session state and what's next
2. **IMPLEMENTATION_LOG.md** - Review recent progress and current phase
3. **CLAUDE.md** - Understand project guidelines and documentation references
4. **src/AGENTS.md** - Refresh on 39 specialized agents and invocation logic
5. **PROJECT_STATUS.md** - Current project status and phase details

## Project Understanding

Use the command `tree` or `ls` to get an understanding of the project structure.

Read the README.md file to understand the project overview.

## Key Documentation to Review

### Core Specifications (src/)
- **src/M3CoreCRM_Specification_Full_v1.0.md** - Complete system requirements
- **src/Database_Schema_Master.md** - Database schema with multi-tenant structure
- **src/Pre-Coding_Document.md** - API contracts and implementation details
- **src/Implementation_Task_Plan_M3CoreCRM.md** - Sprint-by-sprint development plan

### Technical Guides (src/)
- **src/Environment_Secrets_Management_Guide_M3CoreCRM.md** - Environment setup
- **src/Security_Privacy_Threat_Model_M3CoreCRM.md** - Security requirements
- **src/NonFunctional_Requirements_SLOs_M3CoreCRM.md** - Performance targets
- **src/Test_Strategy_QA_Plan_M3CoreCRM.md** - Testing requirements

## Explain Back
After reviewing the files, explain:
- Current development phase and next priorities
- Active agents system (39 agents in 12 categories)
- Project structure (monorepo with apps/, packages/, src/)
- Project purpose (Multi-tenant Real Estate CRM)
- Tech stack (React, Next.js, Node.js, PostgreSQL, Redis)
- Key implementation guidelines from specifications
- What work needs to be done next (from SESSION_NOTES.md)