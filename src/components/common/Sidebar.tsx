import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Building2,
  Briefcase,
  Compass,
  Cpu,
  Handshake,
  FileBarChart,
  History,
  ShieldAlert,
  Settings,
  UserPlus,
  CheckSquare,
  ListTodo,
  UserCircle2,
  X,
  Layers,
} from 'lucide-react';
import { UserSession } from '../../types';
import { PermissionService, NavItemKey } from '../../services/permissionService';
import { UniGrovaLogo } from './UniGrovaLogo';

interface SidebarProps {
  session: UserSession;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  pendingApprovalsCount: number;
  pendingOnboardingCount: number;
}

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  category: 'core' | 'management' | 'governance';
}

export const Sidebar: React.FC<SidebarProps> = ({
  session,
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  pendingApprovalsCount,
  pendingOnboardingCount,
}) => {
  const allNavItems: NavItemConfig[] = [
    // Core
    { key: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'core' },
    { key: 'strategic', label: 'Strategic Planning', icon: Compass, category: 'core' },
    { key: 'technology', label: 'Technology & Cloud', icon: Cpu, category: 'core' },
    { key: 'projects', label: 'Projects & Ventures', icon: Briefcase, category: 'core' },
    
    // Management
    { key: 'employees', label: 'Employee Directory', icon: Users, category: 'management' },
    { key: 'idcards', label: 'ID Card System', icon: CreditCard, category: 'management' },
    {
      key: 'onboarding',
      label: 'Employee Onboarding',
      icon: UserPlus,
      category: 'management',
      badge: pendingOnboardingCount > 0 ? pendingOnboardingCount : undefined,
    },
    { key: 'operations', label: 'Operations & Depts', icon: Building2, category: 'management' },
    { key: 'tasks', label: 'Internal Tasks', icon: ListTodo, category: 'management' },
    { key: 'partnerships', label: 'Partnerships & Scaling', icon: Handshake, category: 'management' },

    // Governance & Logs
    {
      key: 'approvals',
      label: 'Approval Center',
      icon: CheckSquare,
      category: 'governance',
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { key: 'reports', label: 'Reports & Analytics', icon: FileBarChart, category: 'governance' },
    { key: 'activity', label: 'System Activity Logs', icon: History, category: 'governance' },
    { key: 'executives', label: 'Executive Governance', icon: ShieldAlert, category: 'governance' },
    { key: 'settings', label: 'System Settings', icon: Settings, category: 'governance' },
    { key: 'profile', label: 'Profile & Face Lock', icon: UserCircle2, category: 'governance' },
  ];

  // Filter items strictly based on role permissions
  const permittedItems = allNavItems.filter((item) =>
    PermissionService.canAccess(session.role, item.key)
  );

  const coreItems = permittedItems.filter((i) => i.category === 'core');
  const managementItems = permittedItems.filter((i) => i.category === 'management');
  const governanceItems = permittedItems.filter((i) => i.category === 'governance');

  const renderNavGroup = (title: string, items: NavItemConfig[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-5">
        <h5 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          {title}
        </h5>
        <div className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectTab(item.key);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Close Button */}
        <div>
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <UniGrovaLogo size="md" variant="full" />
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Officer Context Badge */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                    Role Partition
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-700">
                    {session.officerId}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">
                  {session.role.replace('_', ' ')} DASHBOARD
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {renderNavGroup('Architecture & Overview', coreItems)}
          {renderNavGroup('Administration & Operations', managementItems)}
          {renderNavGroup('Governance, Audit & Security', governanceItems)}
        </div>

        {/* Bottom: System Specs Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>UGMS v2.4 Enterprise</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold font-mono">
              Online
            </span>
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 tracking-tight truncate">
            UniGrova Multi-Venture Cloud
          </p>
        </div>
      </aside>
    </>
  );
};
