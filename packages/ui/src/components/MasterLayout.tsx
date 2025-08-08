import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { VSCodeSidebar } from './VSCodeSidebar';
import { StatusBar } from './StatusBar';
import type { SidebarItem } from './VSCodeSidebar';

interface MasterLayoutProps {
  children: React.ReactNode;
  companyLogo?: string;
  companyName: string;
  userName: string;
  userRole: 'super_admin' | 'admin' | 'staff';
  userAvatar?: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  breadcrumbs?: Array<{ label: string; href?: string }>;
  sidebarItems?: SidebarItem[];
  activeSidebarId?: string;
  notificationCount?: number;
  onLanguageChange: (lang: 'en' | 'ar') => void;
  onThemeToggle: () => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onCompanySettingsClick?: () => void;
  onBillingClick?: () => void;
  onSignOut: () => void;
  onSidebarItemClick: (item: SidebarItem) => void;
  // Status Bar Props
  isOnline?: boolean;
  activeUsers?: number;
  databaseStatus?: 'connected' | 'disconnected' | 'syncing';
  lastSync?: Date;
  version?: string;
  environment?: 'development' | 'staging' | 'production';
  systemStatus?: 'operational' | 'degraded' | 'down';
  statusMessage?: string;
}

export const MasterLayout: React.FC<MasterLayoutProps> = ({
  children,
  companyLogo,
  companyName,
  userName,
  userRole,
  userAvatar,
  language,
  theme,
  breadcrumbs,
  sidebarItems,
  activeSidebarId,
  notificationCount,
  onLanguageChange,
  onThemeToggle,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onCompanySettingsClick,
  onBillingClick,
  onSignOut,
  onSidebarItemClick,
  // Status Bar Props
  isOnline = true,
  activeUsers,
  databaseStatus = 'connected',
  lastSync,
  version,
  environment,
  systemStatus = 'operational',
  statusMessage,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Apply theme class to html element
  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  // Apply RTL/LTR direction
  useEffect(() => {
    const html = document.documentElement;
    if (language === 'ar') {
      html.setAttribute('dir', 'rtl');
      html.classList.add('dir-rtl');
      html.classList.remove('dir-ltr');
    } else {
      html.setAttribute('dir', 'ltr');
      html.classList.add('dir-ltr');
      html.classList.remove('dir-rtl');
    }
  }, [language]);

  // Close mobile sidebar when clicking on an item
  const handleSidebarItemClick = (item: SidebarItem) => {
    onSidebarItemClick(item);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        companyLogo={companyLogo}
        companyName={companyName}
        breadcrumbs={breadcrumbs}
        userName={userName}
        userRole={userRole}
        userAvatar={userAvatar}
        language={language}
        theme={theme}
        notificationCount={notificationCount}
        onLanguageChange={onLanguageChange}
        onThemeToggle={onThemeToggle}
        onNotificationClick={onNotificationClick}
        onProfileClick={onProfileClick}
        onSettingsClick={onSettingsClick}
        onCompanySettingsClick={onCompanySettingsClick}
        onBillingClick={onBillingClick}
        onSignOut={onSignOut}
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isMobile={isMobile}
      />

      <div className="flex h-[calc(100vh-6rem)]">
        {/* VS Code Style Sidebar */}
        <VSCodeSidebar
          items={sidebarItems || []}
          activeItemId={activeSidebarId}
          userRole={userRole}
          language={language}
          onItemClick={handleSidebarItemClick}
        />

        {/* Main Content with consistent padding */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="h-full p-6">
            {children}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar
        language={language}
        isOnline={isOnline}
        activeUsers={activeUsers}
        databaseStatus={databaseStatus}
        lastSync={lastSync}
        version={version}
        environment={environment}
        systemStatus={systemStatus}
        customMessage={statusMessage}
      />
    </div>
  );
};