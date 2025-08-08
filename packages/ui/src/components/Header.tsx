import React, { useState } from 'react';
import {
  Search,
  Globe,
  Sun,
  Moon,
  Bell,
  User,
  Settings,
  Building,
  CreditCard,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  companyLogo?: string;
  companyName: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  userName: string;
  userRole: 'super_admin' | 'admin' | 'staff';
  userAvatar?: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  notificationCount?: number;
  onLanguageChange: (lang: 'en' | 'ar') => void;
  onThemeToggle: () => void;
  onNotificationClick: () => void;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onCompanySettingsClick?: () => void;
  onBillingClick?: () => void;
  onSignOut: () => void;
  onMenuToggle: () => void;
  isMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  companyLogo,
  companyName,
  breadcrumbs = [],
  userName,
  userRole,
  userAvatar,
  language,
  theme,
  notificationCount = 0,
  onLanguageChange,
  onThemeToggle,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onCompanySettingsClick,
  onBillingClick,
  onSignOut,
  onMenuToggle,
  isMobile = false,
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface border-b border-border">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          {isMobile && (
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-text-primary" />
            </button>
          )}
          
          <a href="/" className="flex items-center gap-2">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="h-8 w-auto" />
            ) : (
              <div className="h-8 w-8 bg-primary-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {companyName.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            {!isMobile && (
              <span className="font-semibold text-text-primary">{companyName}</span>
            )}
          </a>

          {/* Breadcrumbs */}
          {!isMobile && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm">
              <span className="text-text-muted">/</span>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-text-secondary hover:text-primary-500 transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-text-primary">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-text-muted">/</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Center Section - Search */}
        {!isMobile && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
              <input
                type="search"
                placeholder={language === 'en' ? 'Search...' : 'بحث...'}
                className="w-full h-10 pl-10 pr-4 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'ar' : 'en')}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Toggle language"
          >
            <div className="flex items-center gap-1">
              <Globe className="h-5 w-5 text-text-primary" />
              <span className="text-xs font-medium text-text-primary">
                {language.toUpperCase()}
              </span>
            </div>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-text-primary" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 hover:bg-surface-hover rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-text-primary" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-surface-hover rounded-lg transition-colors"
              aria-label="Profile menu"
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {getUserInitials(userName)}
                  </span>
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-text-secondary" />
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-20">
                  {/* Profile Overview */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      {userAvatar ? (
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-medium">
                            {getUserInitials(userName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-text-primary">{userName}</p>
                        <p className="text-sm text-text-secondary capitalize">
                          {userRole.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onProfileClick();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors"
                    >
                      <User className="h-4 w-4 text-text-secondary" />
                      <span className="text-text-primary">
                        {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        onSettingsClick();
                        setProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors"
                    >
                      <Settings className="h-4 w-4 text-text-secondary" />
                      <span className="text-text-primary">
                        {language === 'en' ? 'Settings' : 'الإعدادات'}
                      </span>
                    </button>

                    {(userRole === 'super_admin' || userRole === 'admin') && onCompanySettingsClick && (
                      <button
                        onClick={() => {
                          onCompanySettingsClick();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors"
                      >
                        <Building className="h-4 w-4 text-text-secondary" />
                        <span className="text-text-primary">
                          {language === 'en' ? 'Company Settings' : 'إعدادات الشركة'}
                        </span>
                      </button>
                    )}

                    {userRole === 'super_admin' && onBillingClick && (
                      <button
                        onClick={() => {
                          onBillingClick();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors"
                      >
                        <CreditCard className="h-4 w-4 text-text-secondary" />
                        <span className="text-text-primary">
                          {language === 'en' ? 'Billing' : 'الفواتير'}
                        </span>
                      </button>
                    )}

                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        onClick={() => {
                          onSignOut();
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{language === 'en' ? 'Sign Out' : 'تسجيل الخروج'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};