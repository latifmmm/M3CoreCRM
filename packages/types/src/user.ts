export interface User {
  id: string;
  company_id: string;
  email: string;
  first_name: string;
  middle_initial?: string;
  last_name: string;
  salutation?: string;
  gender?: 'male' | 'female' | 'other';
  is_active: boolean;
  email_verified: boolean;
  two_fa_enabled: boolean;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'system';
  created_at: Date;
  updated_at: Date;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  assigned_at: Date;
  assigned_by: string;
}