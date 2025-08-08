import React from 'react';
import { 
  Globe, 
  Wifi, 
  WifiOff, 
  Database, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Activity
} from 'lucide-react';

interface StatusBarProps {
  language: 'en' | 'ar';
  isOnline?: boolean;
  activeUsers?: number;
  databaseStatus?: 'connected' | 'disconnected' | 'syncing';
  lastSync?: Date;
  version?: string;
  environment?: 'development' | 'staging' | 'production';
  systemStatus?: 'operational' | 'degraded' | 'down';
  customMessage?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  language,
  isOnline = true,
  activeUsers = 0,
  databaseStatus = 'connected',
  lastSync,
  version = '1.0.0',
  environment = 'production',
  systemStatus = 'operational',
  customMessage
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return language === 'en' ? 'Just now' : 'الآن';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return language === 'en' ? `${mins}m ago` : `منذ ${mins} دقيقة`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return language === 'en' ? `${hours}h ago` : `منذ ${hours} ساعة`;
    }
    const days = Math.floor(diff / 86400);
    return language === 'en' ? `${days}d ago` : `منذ ${days} يوم`;
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'operational': return 'text-green-600 dark:text-green-400';
      case 'degraded': return 'text-yellow-600 dark:text-yellow-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-text-muted';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'operational': return <CheckCircle className="w-3 h-3" />;
      case 'degraded': return <AlertCircle className="w-3 h-3" />;
      case 'down': return <XCircle className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getDatabaseIcon = () => {
    switch (databaseStatus) {
      case 'connected': return <Database className="w-3 h-3 text-green-600 dark:text-green-400" />;
      case 'syncing': return <Database className="w-3 h-3 text-yellow-600 dark:text-yellow-400 animate-pulse" />;
      case 'disconnected': return <Database className="w-3 h-3 text-red-600 dark:text-red-400" />;
      default: return <Database className="w-3 h-3 text-text-muted" />;
    }
  };

  const getEnvironmentColor = () => {
    switch (environment) {
      case 'development': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'staging': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'production': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-surface text-text-secondary';
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-8 bg-surface border-t border-border flex items-center px-4 text-xs z-40">
      <div className="flex items-center gap-4 flex-1">
        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-green-600 dark:text-green-400" />
              <span className="text-text-secondary">
                {language === 'en' ? 'Online' : 'متصل'}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-600 dark:text-red-400" />
              <span className="text-text-secondary">
                {language === 'en' ? 'Offline' : 'غير متصل'}
              </span>
            </>
          )}
        </div>

        {/* Database Status */}
        <div className="flex items-center gap-1.5">
          {getDatabaseIcon()}
          <span className="text-text-secondary">
            {language === 'en' ? 'Database' : 'قاعدة البيانات'}
            {databaseStatus === 'syncing' && (
              <span className="ml-1">
                {language === 'en' ? '(Syncing...)' : '(مزامنة...)'}
              </span>
            )}
          </span>
        </div>

        {/* Active Users */}
        {activeUsers > 0 && (
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-text-muted" />
            <span className="text-text-secondary">
              {activeUsers} {language === 'en' ? 'Active' : 'نشط'}
            </span>
          </div>
        )}

        {/* Last Sync */}
        {lastSync && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-text-muted" />
            <span className="text-text-secondary">
              {language === 'en' ? 'Synced' : 'تمت المزامنة'}: {formatTime(lastSync)}
            </span>
          </div>
        )}

        {/* Custom Message */}
        {customMessage && (
          <div className="flex-1 text-center">
            <span className="text-text-secondary">{customMessage}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* System Status */}
        <div className={`flex items-center gap-1.5 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-xs">
            {systemStatus === 'operational' && (language === 'en' ? 'All Systems Operational' : 'جميع الأنظمة تعمل')}
            {systemStatus === 'degraded' && (language === 'en' ? 'Degraded Performance' : 'أداء منخفض')}
            {systemStatus === 'down' && (language === 'en' ? 'System Down' : 'النظام متوقف')}
          </span>
        </div>

        {/* Environment Badge */}
        {environment !== 'production' && (
          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEnvironmentColor()}`}>
            {environment.toUpperCase()}
          </span>
        )}

        {/* Version */}
        <div className="flex items-center gap-1 text-text-muted">
          <Globe className="w-3 h-3" />
          <span className="text-xs">v{version}</span>
        </div>
      </div>
    </div>
  );
};