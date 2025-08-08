export interface Company {
  id: string;
  name: string;
  domain?: string;
  subscription_plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  timezone: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  is_active: boolean;
  trial_ends_at?: Date;
  subscription_ends_at?: Date;
  created_at: Date;
  updated_at: Date;
}