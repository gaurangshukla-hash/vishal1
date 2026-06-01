import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  DollarSign, 
  Package, 
  Settings, 
  Search, 
  BarChart3, 
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  GitBranch
} from 'lucide-react';
import { cn } from '../lib/utils';
import { MenuOption } from '../types';
import { NAVIGATION } from '../lib/navigation';

interface SidebarProps {
  currentMenu: MenuOption;
  onMenuChange: (menu: MenuOption) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  className?: string;
}

interface MenuItem {
  id: MenuOption;
  label: string;
  icon: React.ElementType;
  hasDropdown?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'Enterprise', label: 'Enterprise', icon: Building2 },
  { id: 'Finance', label: 'Finance', icon: DollarSign, hasDropdown: true },
  { id: 'Rate', label: 'Rate', icon: TrendingUp, hasDropdown: true },
  { id: 'Routing', label: 'Routing', icon: GitBranch, hasDropdown: true },
  { id: 'Product', label: 'Product', icon: Package, hasDropdown: true },
  { id: 'SMS Services', label: 'SMS Services', icon: Settings, hasDropdown: true },
  { id: 'Report', label: 'Report', icon: BarChart3, hasDropdown: true },
  { id: 'Admin', label: 'Admin', icon: ShieldCheck, hasDropdown: true },
];

export function Sidebar({ currentMenu, onMenuChange, isOpen, onClose, isCollapsed, className }: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    if (isCollapsed) return; // Don't expand if collapsed
    setExpandedMenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white dark:bg-night-bg border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 transform lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "w-20" : "w-64",
        className
      )}>
        <div className="h-full flex flex-col">
          {/* Logo Area (Hidden on desktop if top bar has it, but good for mobile) */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 lg:hidden flex items-center justify-between">
            <img 
              src="https://teleoss.com/wp-content/uploads/2022/03/TeleOSS-Logo-1.png" 
              alt="Logo" 
              className="h-8 w-auto"
              referrerPolicy="no-referrer"
            />
            <button onClick={onClose} className="p-2 text-zinc-500">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
            <ul className="space-y-1">
              {MENU_ITEMS.map((item) => {
                const isActive = currentMenu === item.id;
                const isExpanded = expandedMenus[item.id] && !isCollapsed;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        if (item.hasDropdown && !isCollapsed) {
                          toggleExpand(item.id);
                        } else {
                          onMenuChange(item.id);
                          if (window.innerWidth < 1024) onClose();
                        }
                      }}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "w-full flex items-center rounded-lg transition-all duration-200 group",
                        isCollapsed ? "justify-center px-0 py-3" : "justify-between px-3 py-2.5",
                        isActive 
                          ? "text-red-600 bg-red-50 dark:bg-red-500/10 font-bold" 
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-black hover:text-red-600 dark:hover:text-red-500"
                      )}
                    >
                      <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-3")}>
                        <item.icon className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-red-600" : "text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-500"
                        )} />
                        {!isCollapsed && <span className={cn("text-sm tracking-tight transition-colors", isActive ? "text-red-600" : "text-zinc-600 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500")}>{item.label}</span>}
                      </div>
                      {!isCollapsed && item.hasDropdown && (
                        isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Dropdown items from navigation data */}
                    {!isCollapsed && item.hasDropdown && isExpanded && (
                      <ul className="mt-1 ml-11 space-y-1 border-l border-zinc-200 dark:border-zinc-900 transition-colors">
                        {NAVIGATION.find(n => n.id === item.id)?.items?.map(sub => (
                          <li key={sub.id}>
                            <button 
                              onClick={() => {
                                onMenuChange(sub.label as any);
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-zinc-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                              {sub.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
            <div className={cn(
              "text-[10px] text-zinc-400 font-bold uppercase tracking-widest transition-all",
              isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            )}>
              Client Portal
            </div>
            {isCollapsed && <div className="text-[10px] text-zinc-400 font-bold">CP</div>}
          </div>
        </div>
      </aside>
    </>
  );
}
