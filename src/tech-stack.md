# M3Core CRM - Technology Stack

## System Requirements
- **macOS**: Sequoia (or later)
- **Node.js**: v24.5.0
- **npm**: v11.4.2
- **Git**: v2.50.1

## Database & Caching
- **PostgreSQL**: v17.5
  - Primary database
  - Full-text search (initial phase)
  - Connection pooling
- **Redis**: v8.2.0
  - Session management
  - Caching layer
  - Real-time data

## Backend Stack
- **Runtime**: Node.js v24.5.0
- **Framework**: Express v5.1.0
- **Language**: TypeScript v5.9.2
- **Authentication**: 
  - JWT (jsonwebtoken v9.0.2)
  - bcrypt v6.0.0
  - Speakeasy (2FA - to be added)
- **Database Client**: pg v8.16.3
- **File Upload**: Multer v2.0.2
- **CORS**: cors v2.8.5
- **Environment**: dotenv v17.2.1
- **UUID**: uuid v11.1.0

## Frontend Stack
- **Framework**: React v18.3.1
- **Build Tool**: Vite v6.0.5
- **Language**: TypeScript v5.9.2
- **Styling**: 
  - Tailwind CSS v3.4.17
  - PostCSS v8.5.2
  - Autoprefixer v10.5.2
- **Routing**: React Router DOM v7.1.1
- **State Management**: Zustand v5.0.4
- **Data Fetching**: TanStack Query v6.4.0
- **Forms**: React Hook Form v7.55.2
- **HTTP Client**: Axios v1.8.1
- **Icons**: Lucide React v0.479.0
- **Internationalization**: 
  - i18next v25.2.2
  - react-i18next v16.2.2

## Development Tools
- **TypeScript**: v5.9.2 (global)
- **ts-node**: v10.9.2
- **ESLint**: v9.20.1 (global)
- **Prettier**: v3.5.2 (global)
- **nodemon**: v3.1.9 (global)
- **VS Code**: v1.102.3

## Deployment Target
- **Backend**: DigitalOcean App Platform
- **Frontend**: DigitalOcean Static Sites / Vercel
- **Database**: DigitalOcean Managed PostgreSQL
- **File Storage**: 
  - Local (development)
  - DigitalOcean Spaces (production)
- **Search**: 
  - PostgreSQL Full-text (initial)
  - Elasticsearch (future)

## Package Managers
- **Homebrew**: v4.5.13
- **npm**: v11.4.2

## Version Policy
- All packages are maintained at their latest stable versions
- Security updates are applied immediately
- Major version updates are tested before deployment

## Future Additions
- **Email Service**: Brevo (SendinBlue)
- **2FA**: Speakeasy (Google Authenticator)
- **WebSockets**: Socket.io (real-time notifications)
- **Search**: Elasticsearch (advanced search)
- **PWA**: Service Workers & Web App Manifest
- **Analytics**: To be determined
- **Monitoring**: To be determined

## Notes
- All services are installed via Homebrew on macOS
- PostgreSQL and Redis run as background services
- Development is Docker-free for simplicity
- Migration to cloud services uses environment variables