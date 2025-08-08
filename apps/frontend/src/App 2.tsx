import { useState } from 'react';
import { MasterLayout } from '@m3core/ui';
import type { SidebarItem } from '@m3core/ui';
import { useAppStore } from './stores/useAppStore';
import './App.css';

function App() {
  const { 
    theme, 
    language, 
    setTheme, 
    setLanguage,
    notificationCount 
  } = useAppStore();
  
  // Mock data for status bar
  const [lastSync] = useState(new Date());
  const [activeUsers] = useState(12);
  
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    theme === 'system' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme as 'light' | 'dark'
  );

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  const handleSidebarItemClick = (item: SidebarItem) => {
    console.log('Sidebar item clicked:', item);
    // Handle navigation here - integrate with React Router
  };

  return (
    <MasterLayout
      companyName="M3Core CRM"
      companyLogo="/logo-192x192.png"
      userName="John Doe"
      userRole="super_admin"
      language={language}
      theme={currentTheme}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Overview' }
      ]}
      notificationCount={notificationCount}
      onLanguageChange={setLanguage}
      onThemeToggle={handleThemeToggle}
      onNotificationClick={() => console.log('Notifications clicked')}
      onProfileClick={() => console.log('Profile clicked')}
      onSettingsClick={() => console.log('Settings clicked')}
      onCompanySettingsClick={() => console.log('Company settings clicked')}
      onBillingClick={() => console.log('Billing clicked')}
      onSignOut={() => console.log('Sign out clicked')}
      onSidebarItemClick={handleSidebarItemClick}
      // Status Bar Props
      isOnline={true}
      activeUsers={activeUsers}
      databaseStatus="connected"
      lastSync={lastSync}
      version="1.0.0"
      environment="development"
      systemStatus="operational"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {language === 'en' ? 'Welcome to M3Core CRM' : 'مرحباً بك في M3Core CRM'}
          </h1>
          <p className="text-text-secondary">
            {language === 'en' 
              ? 'Your comprehensive real estate CRM solution'
              : 'حل إدارة علاقات العملاء الشامل للعقارات'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Properties', value: '152', change: '+12%' },
            { label: 'Leads', value: '89', change: '+23%' },
            { label: 'Deals', value: '24', change: '+8%' },
            { label: 'Revenue', value: '$1.2M', change: '+18%' },
          ].map((stat, index) => (
            <div key={index} className="bg-surface rounded-lg p-6 border border-border">
              <p className="text-text-secondary text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary mb-2">{stat.value}</p>
              <p className="text-green-600 text-sm">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: language === 'en' ? 'Add Property' : 'إضافة عقار', icon: '🏠' },
              { label: language === 'en' ? 'New Lead' : 'عميل جديد', icon: '👤' },
              { label: language === 'en' ? 'Create Deal' : 'إنشاء صفقة', icon: '💼' },
              { label: language === 'en' ? 'View Reports' : 'عرض التقارير', icon: '📊' },
            ].map((action, index) => (
              <button
                key={index}
                className="p-4 bg-background hover:bg-surface-hover rounded-lg border border-border transition-colors"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <p className="text-text-primary text-sm">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {language === 'en' ? 'Recent Activity' : 'النشاط الأخير'}
          </h2>
          <div className="space-y-3">
            {[
              { time: '2 hours ago', action: 'New lead added: Sarah Johnson' },
              { time: '5 hours ago', action: 'Property updated: Downtown Apartment' },
              { time: '1 day ago', action: 'Deal closed: Villa Marina Bay' },
              { time: '2 days ago', action: 'Report generated: Q4 Sales' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <p className="text-text-primary">{activity.action}</p>
                <p className="text-text-muted text-sm">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}

export default App
