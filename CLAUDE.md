# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Active Agents System

**IMPORTANT: Always check src/AGENTS.md for the complete active agents system before processing any user prompt.**

📍 **Agent System Reference**: All agent definitions, invocation rules, and coordination guidelines are maintained in [`src/AGENTS.md`](./src/AGENTS.md)

The active agents system includes:
- 30 specialized agents organized into 10 categories
- Specific invocation triggers and enhanced keywords for each agent
- Multi-agent coordination rules for complex tasks
- Example scenarios and selection guidelines

**Before responding to any prompt, consult src/AGENTS.md to determine if a specialized agent should be invoked.**

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