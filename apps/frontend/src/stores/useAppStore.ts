import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  companyId: string;
  profileImageUrl?: string;
}

interface Company {
  id: string;
  name: string;
  logo?: string;
}

interface AppState {
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Company
  company: Company | null;
  setCompany: (company: Company | null) => void;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Language
  language: 'en' | 'ar';
  setLanguage: (language: 'en' | 'ar') => void;
  
  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Notifications
  notificationCount: number;
  setNotificationCount: (count: number) => void;
  
  // Auth
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  clearAuth: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Company
      company: null,
      setCompany: (company) => set({ company }),
      
      // Theme
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Language
      language: 'en',
      setLanguage: (language) => set({ language }),
      
      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      
      // Notifications
      notificationCount: 0,
      setNotificationCount: (notificationCount) => set({ notificationCount }),
      
      // Auth
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearAuth: () => set({ 
        user: null, 
        company: null, 
        accessToken: null, 
        refreshToken: null 
      }),
    }),
    {
      name: 'm3core-crm-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        sidebarCollapsed: state.sidebarCollapsed,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);