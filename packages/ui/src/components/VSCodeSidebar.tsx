import React, { useState } from 'react';
import {
  Building2,
  Users,
  Map,
  UserCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
} from '../icons';

export interface SidebarItem {
  id: string;
  label: string;
  labelAr?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  children?: SidebarItem[];
  roleAccess?: Array<'super_admin' | 'admin' | 'staff'>;
}

interface VSCodeSidebarProps {
  items?: SidebarItem[];
  activeItemId?: string;
  userRole: 'super_admin' | 'admin' | 'staff';
  language: 'en' | 'ar';
  onItemClick: (item: SidebarItem) => void;
}

const defaultItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/dashboard',
    children: [
      {
        id: 'dashboard-overview',
        label: 'Overview',
        labelAr: 'نظرة عامة',
        icon: BarChart3,
        href: '/dashboard/overview',
      },
      {
        id: 'dashboard-analytics',
        label: 'Analytics',
        labelAr: 'التحليلات',
        icon: TrendingUp,
        href: '/dashboard/analytics',
      },
    ],
  },
  {
    id: 'properties',
    label: 'Property Inventory',
    labelAr: 'المخزون العقاري',
    icon: Building2,
    href: '/properties',
  },
  {
    id: 'leads',
    label: 'Leads & Clients',
    labelAr: 'العملاء المحتملون',
    icon: Users,
    href: '/leads',
  },
  {
    id: 'map',
    label: 'Map Overlays',
    labelAr: 'خريطة العقارات',
    icon: Map,
    href: '/map',
  },
  {
    id: 'developers',
    label: 'Developers',
    labelAr: 'المطورون',
    icon: UserCheck,
    href: '/developers',
  },
  {
    id: 'reports',
    label: 'Reports',
    labelAr: 'التقارير',
    icon: FileText,
    href: '/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    labelAr: 'الإعدادات',
    icon: Settings,
    href: '/settings',
    roleAccess: ['super_admin', 'admin'],
  },
];

export const VSCodeSidebar: React.FC<VSCodeSidebarProps> = ({
  items = defaultItems,
  activeItemId,
  userRole,
  language,
  onItemClick,
}) => {
  // Use defaultItems if items is empty or undefined
  const sidebarItems = items && items.length > 0 ? items : defaultItems;
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(activeItemId || null);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']); // Dashboard expanded by default

  const hasAccess = (item: SidebarItem) => {
    if (!item.roleAccess) return true;
    return item.roleAccess.includes(userRole);
  };

  const getLabel = (item: SidebarItem) => {
    return language === 'ar' && item.labelAr ? item.labelAr : item.label;
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.children && item.children.length > 0) {
      // Toggle expansion for items with children
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      );
    } else {
      // Select item and trigger callback for items without children
      setSelectedItem(item.id);
      onItemClick(item);
    }
  };

  const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

  return (
    <div className="flex h-full">
      {/* Primary Sidebar - Icon Rail (Always Visible) */}
      <div className="w-14 bg-surface border-r border-border flex flex-col">
        {/* Navigation Icons */}
        <nav className="flex-1 pt-4">
          <div className="space-y-2 px-2">
            {sidebarItems.filter(hasAccess).map((item) => {
              const isActive = selectedItem === item.id || activeItemId === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`
                    relative flex h-10 w-10 items-center justify-center rounded-md
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-500/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                      : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                    }
                  `}
                  title={getLabel(item)}
                >
                  {item.id === 'dashboard' ? <LayoutDashboard className="h-5 w-5" /> :
                   item.id === 'properties' ? <Building2 className="h-5 w-5" /> :
                   item.id === 'leads' ? <Users className="h-5 w-5" /> :
                   item.id === 'map' ? <Map className="h-5 w-5" /> :
                   item.id === 'developers' ? <UserCheck className="h-5 w-5" /> :
                   item.id === 'reports' ? <FileText className="h-5 w-5" /> :
                   item.id === 'settings' ? <Settings className="h-5 w-5" /> :
                   <span className="text-xs font-bold">{item.label.substring(0, 2).toUpperCase()}</span>}
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-0.5 bg-blue-500 rounded-r" />
                  )}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Toggle Button at Bottom */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-all duration-200"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Secondary Sidebar - Expandable Panel */}
      <div 
        className={`
          bg-surface border-r border-border
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'w-64' : 'w-0'}
        `}
      >
        <div className="w-64 h-full flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">
              M3Core CRM
            </h2>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-3">
              {sidebarItems.filter(hasAccess).map((item) => {
                const isActive = selectedItem === item.id || activeItemId === item.id;
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = isItemExpanded(item.id);
                
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`
                        w-full flex items-center px-3 py-2 text-sm font-medium rounded-md
                        transition-all duration-200
                        ${isActive 
                          ? 'bg-blue-500/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                          : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                        }
                      `}
                    >
                      {item.id === 'dashboard' ? <LayoutDashboard className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       item.id === 'properties' ? <Building2 className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       item.id === 'leads' ? <Users className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       item.id === 'map' ? <Map className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       item.id === 'developers' ? <UserCheck className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       item.id === 'reports' ? <FileText className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       item.id === 'settings' ? <Settings className="flex-shrink-0 mr-3 h-5 w-5" /> :
                       null}
                      <span className="flex-1 text-left">{getLabel(item)}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {hasChildren && (
                        <ChevronDown 
                          className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    
                    {/* Submenu */}
                    {hasChildren && isExpanded && item.children && (
                      <div className="mt-1 ml-4 space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = selectedItem === child.id || activeItemId === child.id;
                          return (
                            <button
                              key={child.id}
                              onClick={() => {
                                setSelectedItem(child.id);
                                onItemClick(child);
                              }}
                              className={`
                                w-full flex items-center px-3 py-1.5 text-sm rounded-md
                                transition-all duration-200
                                ${isChildActive 
                                  ? 'bg-blue-500/20 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                                  : 'text-text-muted hover:bg-surface-hover hover:text-text-primary'
                                }
                              `}
                            >
                              {child.id === 'dashboard-overview' ? <BarChart3 className="flex-shrink-0 mr-2 h-4 w-4" /> :
                               child.id === 'dashboard-analytics' ? <TrendingUp className="flex-shrink-0 mr-2 h-4 w-4" /> :
                               null}
                              <span className="flex-1 text-left">{getLabel(child)}</span>
                              {child.badge && child.badge > 0 && (
                                <span className="ml-auto px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-border">
            <div className="flex items-center px-3 py-2">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">JD</span>
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-text-primary">John Doe</p>
                <p className="text-xs text-text-muted">super_admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};