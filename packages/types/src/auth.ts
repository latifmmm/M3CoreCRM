export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    company_id: string;
    roles: string[];
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  company_name: string;
}

export interface TokenPayload {
  user_id: string;
  company_id: string;
  email: string;
  roles: string[];
}