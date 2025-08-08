import React from 'react';
import {
  Home,
  Building2,
  Users,
  Map,
  UserCheck,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  labelAr?: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  children?: SidebarItem[];
  roleAccess?: Array<'super_admin' | 'admin' | 'staff'>;
}

interface SidebarProps {
  items: SidebarItem[];
  activeItemId?: string;
  userRole: 'super_admin' | 'admin' | 'staff';
  isCollapsed: boolean;
  isMobile?: boolean;
  isOpen?: boolean;
  language: 'en' | 'ar';
  onItemClick: (item: SidebarItem) => void;
  onToggleCollapse: () => void;
  onClose?: () => void;
}

const defaultItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    icon: <Home className="h-5 w-5" />,
    href: '/dashboard',
  },
  {
    id: 'properties',
    label: 'Property Inventory',
    labelAr: 'المخزون العقاري',
    icon: <Building2 className="h-5 w-5" />,
    href: '/properties',
  },
  {
    id: 'leads',
    label: 'Leads & Clients',
    labelAr: 'العملاء المحتملون',
    icon: <Users className="h-5 w-5" />,
    href: '/leads',
  },
  {
    id: 'map',
    label: 'Map Overlays',
    labelAr: 'خريطة العقارات',
    icon: <Map className="h-5 w-5" />,
    href: '/map',
  },
  {
    id: 'developers',
    label: 'Developers',
    labelAr: 'المطورون',
    icon: <UserCheck className="h-5 w-5" />,
    href: '/developers',
  },
  {
    id: 'reports',
    label: 'Reports',
    labelAr: 'التقارير',
    icon: <FileText className="h-5 w-5" />,
    href: '/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    labelAr: 'الإعدادات',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
    roleAccess: ['super_admin', 'admin'],
    children: [
      {
        id: 'company',
        label: 'Company',
        labelAr: 'الشركة',
        icon: <Building2 className="h-4 w-4" />,
        href: '/settings/company',
        roleAccess: ['super_admin', 'admin'],
      },
      {
        id: 'users',
        label: 'Users',
        labelAr: 'المستخدمون',
        icon: <Users className="h-4 w-4" />,
        href: '/settings/users',
        roleAccess: ['super_admin', 'admin'],
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultItems,
  activeItemId,
  userRole,
  isCollapsed,
  isMobile = false,
  isOpen = true,
  language,
  onItemClick,
  onToggleCollapse,
  onClose,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const hasAccess = (item: SidebarItem) => {
    if (!item.roleAccess) return true;
    return item.roleAccess.includes(userRole);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getLabel = (item: SidebarItem) => {
    return language === 'ar' && item.labelAr ? item.labelAr : item.label;
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    if (!hasAccess(item)) return null;

    const isActive = activeItemId === item.id;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onItemClick(item);
            }
          }}
          className={`
            w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
            ${isActive ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'hover:bg-surface-hover text-text-primary'}
            ${level > 0 ? 'pl-10' : ''}
          `}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{getLabel(item)}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
            </>
          )}
        </button>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <>
      {/* Toggle Button (Desktop only) */}
      {!isMobile && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 z-10 h-6 w-6 bg-surface border border-border rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3 text-text-primary" />
          ) : (
            <ChevronLeft className="h-3 w-3 text-text-primary" />
          )}
        </button>
      )}

      {/* Mobile Close Button */}
      {isMobile && onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-4 p-2 hover:bg-surface-hover rounded-lg transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5 text-text-primary" />
        </button>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => renderItem(item))}
      </nav>
    </>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`
            fixed left-0 top-16 bottom-8 z-40 bg-surface border-r border-border
            transition-transform duration-200 lg:hidden
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            ${isCollapsed ? 'w-16' : 'w-64'}
          `}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside
      className={`
        relative hidden lg:flex flex-col bg-surface border-r border-border
        transition-all duration-200
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      {sidebarContent}
    </aside>
  );
};