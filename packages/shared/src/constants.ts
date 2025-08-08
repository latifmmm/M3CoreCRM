export const SUBSCRIPTION_PLANS = {
  TRIAL: 'trial',
  BASIC: 'basic',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  VIEWER: 'viewer',
} as const;

export const ID_PREFIXES = {
  COMPANY: 'C',
  USER: 'U',
  GROUP: 'G',
  ROLE: 'R',
  PROPERTY: 'P',
  LEAD: 'L',
} as const;