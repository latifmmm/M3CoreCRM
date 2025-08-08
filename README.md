# M3Core CRM - Multi-tenant Real Estate Management Platform

## Overview
M3Core CRM is a comprehensive multi-tenant SaaS platform designed for real estate businesses. Built with modern technologies and best practices, it provides complete CRM functionality including property management, lead tracking, and team collaboration.

## Tech Stack

### Backend
- Node.js v24.5.0 + Express v5.1.0
- PostgreSQL v17.5 + Redis v8.2.0
- TypeScript v5.9.2
- JWT Authentication + bcrypt
- Brevo (Sendinblue) for email services
- Stripe for payment processing

### Frontend
- React v18.3.1 + Vite v6.0.5
- Next.js 15+ for marketing site
- Tailwind CSS v3.4.17
- Zustand for state management
- TanStack Query for data fetching
- React Hook Form + Zod for form handling
- i18next for internationalization

## Project Structure

```
M3CoreCRM/
├── apps/
│   ├── backend/         # Express API server
│   ├── frontend/        # React CRM dashboard
│   └── marketing/       # Next.js marketing site
├── packages/
│   ├── shared/          # Shared utilities
│   ├── types/           # TypeScript definitions
│   └── ui/              # Reusable UI components
└── src/                 # Documentation and specs
```

## Getting Started

### Prerequisites
- Node.js v24.5.0 or higher
- npm v11.4.2 or higher
- PostgreSQL v17.5
- Redis v8.2.0

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd M3CoreCRM
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration

# Also set up environment for each app
cp apps/frontend/.env.example apps/frontend/.env
cp apps/marketing/.env.example apps/marketing/.env
```

4. Set up PostgreSQL database
```bash
# Create database
createdb m3core_crm

# Run migrations (when available)
npm run db:migrate
```

5. Start Redis server
```bash
redis-server
```

### Development

Run all services concurrently:
```bash
npm run dev
```

Or run individual services:
```bash
npm run dev:backend   # API server on http://localhost:5000
npm run dev:frontend  # CRM dashboard on http://localhost:3000
npm run dev:marketing # Marketing site on http://localhost:3001
```

### Building for Production

```bash
npm run build
```

## Features

- **Multi-tenant Architecture**: Complete company isolation with custom ID formats
- **Role-Based Access Control**: 5 default roles with customizable permissions
- **Authentication**: JWT, OAuth (Google, Apple, LinkedIn), 2FA with Google Authenticator
- **Property Management**: Comprehensive real estate inventory tracking
- **Lead & Contact Management**: Full CRM capabilities
- **Communication**: Email integration via Brevo, activity tracking
- **Billing**: Stripe integration for subscription management
- **Analytics**: Reporting and dashboard capabilities
- **Mobile Ready**: Responsive design and PWA support

## API Documentation

The API is available at `http://localhost:5000/api/v1`

Health check: `http://localhost:5000/health`

## Contributing

Please read the contributing guidelines before submitting pull requests.

## License

Proprietary - M3Labs

## Support

For support, please contact the development team.