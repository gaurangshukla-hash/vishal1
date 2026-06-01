import React, { useState, useEffect } from 'react';
import { Sun, Moon, Clock, Settings2, Users, LogOut, Bell, User as UserIcon, X, Menu } from 'lucide-react';
import { cn, getTimeRangeDisplay } from './lib/utils';
import { TIME_OPTIONS, MAIN_TABS, TECHNICAL_SUB_TABS, COMMERCIAL_SUB_TABS, COMMON_SUB_TABS } from './constants';
import { DashboardState, MainTab, TimeOption, TechnicalSubTab, CommercialSubTab, User, MenuOption, Notification } from './types';
import { TechnicalView } from './components/TechnicalView';
import { CommercialView } from './components/CommercialView';
import { BindView } from './components/BindView';
import { TopListView } from './components/TopListView';
import { Login } from './components/Login';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DataTableView } from './components/DataTableView';
import { SectionView } from './components/SectionView';
import { useDraggableScroll } from './hooks/useDraggableScroll';

const STORAGE_KEY = 'teleoss-dashboard-state';

const SALES_EXECUTIVES = [
  { id: 'all', name: 'Team / Overall' },
  { id: 'salesexecutive1', name: 'Sales Executive 1' },
  { id: 'salesexecutive2', name: 'Sales Executive 2' },
];

export default function App() {
  const scrollRef = useDraggableScroll();
  const timeScrollRef = useDraggableScroll();
  const subTabScrollRef = useDraggableScroll();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeStrike, setActiveStrike] = useState<Notification | null>(null);

  const [state, setState] = useState<DashboardState>(() => {
    const defaults: DashboardState = {
      time: '1 Hour',
      mainTab: 'Technical',
      technicalSubTab: 'Supplier',
      commercialSubTab: 'Customers',
      theme: 'light',
      user: null as any,
      currentMenu: 'Dashboard',
    };
    
    const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaults,
          ...parsed,
          user: parsed.user || null,
          currentMenu: parsed.currentMenu || 'Dashboard',
        };
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return defaults;
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [state]);

  // Handle striking notifications
  useEffect(() => {
    const messages = [
      { title: 'System Alert', message: 'TPS Spike detected in Carrier route', type: 'warning' },
      { title: 'Sale Success', message: 'New order completed for Client Alpha', type: 'success' },
      { title: 'Bandwidth Info', message: 'Current peak hit 1.2 GBPS', type: 'info' },
      { title: 'Security', message: 'Failed login attempt via NOC portal', type: 'error' },
      { title: 'Supplier Update', message: 'Rates updated for Global Connect', type: 'info' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const msg = messages[Math.floor(Math.random() * messages.length)];
        const newNotif: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          ...msg as any,
          timestamp: new Date(),
          read: false
        };
        setNotifications(prev => [newNotif, ...prev].slice(0, 50));
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateState = (updates: Partial<DashboardState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleLogin = (user: User) => {
    let initialMainTab: MainTab = 'Technical';
    const initialTechSub: TechnicalSubTab = 'Supplier';
    let initialCommSub: CommercialSubTab = 'Customers';
    
    if (user.role === 'SalesHead') {
      initialMainTab = 'Commercials';
    } else if (user.role === 'SalesExecutive') {
      initialMainTab = 'Commercials';
      initialCommSub = 'Top Countries';
    } else if (user.role === 'NOC') {
      initialMainTab = 'Technical';
    }

    updateState({ 
      user, 
      mainTab: initialMainTab,
      technicalSubTab: initialTechSub,
      commercialSubTab: initialCommSub,
      selectedExecutiveId: user.role === 'SalesHead' ? 'all' : undefined,
      currentMenu: 'Dashboard'
    });
  };

  const handleLogout = () => {
    updateState({ user: null });
  };

  if (!state.user) {
    return <Login onLogin={handleLogin} />;
  }

  const role = state.user.role;

  const visibleMainTabs = MAIN_TABS.filter(tab => {
    if (role === 'Admin') return true;
    if (role === 'SalesHead') return tab === 'Commercials';
    if (role === 'SalesExecutive') return true;
    if (role === 'NOC') return tab === 'Technical';
    return false;
  });

  const visibleTechnicalSubTabs = TECHNICAL_SUB_TABS.filter(sub => {
    if (role === 'Admin' || role === 'NOC') return true;
    return false;
  });

  const visibleCommercialSubTabs = COMMERCIAL_SUB_TABS.filter(sub => {
    if (role === 'Admin' || role === 'SalesHead' || role === 'SalesExecutive') return true;
    return false;
  });

  const currentSubTabs = state.mainTab === 'Technical' ? visibleTechnicalSubTabs : visibleCommercialSubTabs;

  return (
    <div className={cn(
      "min-h-screen bg-white dark:bg-night-bg text-zinc-900 dark:text-white transition-colors duration-500 font-sans selection:bg-brand-500/30",
      state.theme === 'dark' ? 'dark' : ''
    )}>
      {/* Top Bar */}
      <header className={cn(
        "h-16 flex items-center justify-between px-4 sticky top-0 z-50 transition-colors duration-500",
        state.theme === 'light' 
          ? "bg-white border-b border-zinc-200 shadow-sm" 
          : "bg-black border-b border-zinc-800"
      )}>
        <div className="flex items-center gap-2 md:gap-4 h-full">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-zinc-500 hover:text-red-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <img 
            src="https://teleoss.com/wp-content/uploads/2022/03/TeleOSS-Logo-1.png" 
            alt="Logo" 
            className="h-10 md:h-12 w-auto object-contain py-1"
            referrerPolicy="no-referrer"
          />
          
          <Navbar 
            currentMenu={state.currentMenu} 
            onMenuChange={(menu) => updateState({ currentMenu: menu })} 
            theme={state.theme} 
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 md:gap-2 mr-1 md:mr-4">
            <button
              onClick={() => updateState({ theme: state.theme === 'light' ? 'dark' : 'light' })}
              className={cn(
                "p-1.5 md:p-2 rounded-lg transition-all",
                state.theme === 'light' ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-zinc-800 text-white hover:bg-zinc-700"
              )}
            >
              {state.theme === 'light' ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                if (!isNotificationOpen) markAllAsRead();
              }}
              className={cn(
                "relative p-1 transition-all",
                state.theme === 'light' ? "text-zinc-500 hover:text-zinc-900" : "text-white/70 hover:text-white"
              )}
            >
              <Bell className={cn("w-4 h-4 md:w-5 md:h-5")} />
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-black items-center justify-center text-[8px] font-black text-white p-0.5">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </div>
              )}
            </button>

            {/* Notification Panel */}
            {isNotificationOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationOpen(false)} />
                <div className="absolute right-0 mt-3 w-80 max-h-[400px] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 p-2 custom-scrollbar">
                  <div className="flex items-center justify-between p-3 border-b border-zinc-100 dark:border-zinc-800 mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Notifications</h3>
                    <span className="text-[8px] bg-brand-500/10 text-brand-500 px-1.5 py-0.5 rounded font-bold">{notifications.length} Total</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-zinc-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] uppercase font-bold tracking-widest">No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                          <div className="flex items-center justify-between mb-1">
                            <span className={cn(
                              "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                              n.type === 'error' && "bg-red-500/10 text-red-500",
                              n.type === 'warning' && "bg-amber-500/10 text-amber-500",
                              n.type === 'success' && "bg-emerald-500/10 text-emerald-500",
                              n.type === 'info' && "bg-blue-500/10 text-blue-500"
                            )}>
                              {n.type}
                            </span>
                            <span className="text-[8px] text-zinc-400 font-mono">
                              {n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-zinc-900 dark:text-white mb-0.5">{n.title}</h4>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className={cn(
            "flex items-center gap-1.5 md:gap-3 pl-2 md:pl-4 border-l",
            state.theme === 'light' ? "border-zinc-200" : "border-white/10"
          )}>
            <div className="text-right hidden md:block">
              <p className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                state.theme === 'light' ? "text-zinc-900" : "text-white"
              )}>{state.user.name}</p>
              <p className={cn(
                "text-[8px] uppercase tracking-widest",
                state.theme === 'light' ? "text-zinc-400" : "text-white/50"
              )}>{state.user.role}</p>
            </div>
            <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center border-2 border-white/20 shadow-sm transition-transform hover:scale-105">
              <span className="text-xs font-bold text-white uppercase">{state.user.name.charAt(0)}</span>
            </div>
            <button 
              onClick={handleLogout}
              className={cn(
                "transition-colors",
                state.theme === 'light' ? "text-zinc-400 hover:text-red-500" : "text-white/50 hover:text-red-400"
              )}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar 
          currentMenu={state.currentMenu}
          onMenuChange={(menu) => updateState({ currentMenu: menu })}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isCollapsed={false}
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {state.currentMenu === 'Dashboard' ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              <div className="bg-white dark:bg-night-bg p-3 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-night-bg rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <Clock className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{getTimeRangeDisplay(state.time)}</span>
                  </div>
                  
                  <div className="flex bg-zinc-100 dark:bg-night-bg p-1 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-x-auto no-scrollbar">
                    {TIME_OPTIONS.map(option => (
                      <button
                        key={option}
                        onClick={() => updateState({ time: option })}
                        className={cn(
                          "px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md transition-all whitespace-nowrap",
                          state.time === option
                            ? "bg-white dark:bg-black text-brand-500 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-600"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-1 bg-zinc-100 dark:bg-night-bg p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    {visibleMainTabs.map(tab => (
                      <button
                        key={tab}
                        onClick={() => updateState({ mainTab: tab })}
                        className={cn(
                          "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest",
                          state.mainTab === tab
                            ? "bg-white dark:bg-black text-brand-500 shadow-sm"
                            : "text-zinc-400 hover:text-zinc-600"
                        )}
                      >
                        {tab === 'Technical' ? <Settings2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className={cn("flex flex-col gap-2 w-full")}>
                    <div 
                      className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center lg:flex-wrap"
                      ref={subTabScrollRef}
                    >
                      {currentSubTabs.filter(sub => !COMMON_SUB_TABS.includes(sub)).map(sub => (
                        <button
                          key={sub}
                          onClick={() => updateState(state.mainTab === 'Technical' ? { technicalSubTab: sub as TechnicalSubTab } : { commercialSubTab: sub as CommercialSubTab })}
                          className={cn(
                            "px-4 py-1.5 text-[9px] font-bold rounded-lg transition-all uppercase tracking-widest border whitespace-nowrap",
                            (state.mainTab === 'Technical' ? state.technicalSubTab === sub : state.commercialSubTab === sub)
                              ? "bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20"
                              : "bg-zinc-50 dark:bg-night-bg text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-brand-500/50"
                          )}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-t border-zinc-100 dark:border-zinc-800/50 w-[calc(100%+2rem)] -mx-4 px-4 sm:w-full sm:mx-0 sm:px-0 sm:justify-center mt-1 lg:flex-wrap">
                      {currentSubTabs.filter(sub => COMMON_SUB_TABS.includes(sub)).map(sub => (
                        <button
                          key={sub}
                          onClick={() => updateState(state.mainTab === 'Technical' ? { technicalSubTab: sub as TechnicalSubTab } : { commercialSubTab: sub as CommercialSubTab })}
                          className={cn(
                            "px-4 py-1.5 text-[9px] font-bold rounded-lg transition-all uppercase tracking-widest border flex items-center gap-1.5 whitespace-nowrap",
                            (state.mainTab === 'Technical' ? state.technicalSubTab === sub : state.commercialSubTab === sub)
                              ? "bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/20"
                              : "bg-amber-50/50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30 hover:border-amber-400/50"
                          )}
                        >
                          <div className={cn("w-1 h-1 rounded-full", (state.mainTab === 'Technical' ? state.technicalSubTab === sub : state.commercialSubTab === sub) ? "bg-white" : "bg-amber-500")} />
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {role === 'SalesHead' && state.mainTab === 'Commercials' && (
                <div className="flex items-center gap-3 bg-brand-500/5 p-3 rounded-xl border border-brand-500/10">
                  <Users className="w-4 h-4 text-brand-500" />
                  <select
                    value={state.selectedExecutiveId || 'all'}
                    onChange={(e) => updateState({ selectedExecutiveId: e.target.value })}
                    className="bg-white dark:bg-night-bg border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    {SALES_EXECUTIVES.map(exec => (
                      <option key={exec.id} value={exec.id}>{exec.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div key={`${state.mainTab}-${state.mainTab === 'Technical' ? state.technicalSubTab : state.commercialSubTab}-${state.selectedExecutiveId}`}>
                {state.mainTab === 'Technical' && (
                  <div className="space-y-6">
                    {(state.technicalSubTab === 'Supplier' || state.technicalSubTab === 'Customer') ? (
                      <TechnicalView subTab={state.technicalSubTab as 'Supplier' | 'Customer'} time={state.time} />
                    ) : (
                      <>
                        {(state.technicalSubTab === 'Top Countries') && <TopListView type="Countries" time={state.time} user={state.user} />}
                        {(state.technicalSubTab === 'Top Products') && <TopListView type="Products" time={state.time} user={state.user} />}
                        {(state.technicalSubTab === 'Top Customers') && <TopListView type="Customers" time={state.time} user={state.user} />}
                        {(state.technicalSubTab === 'Top Suppliers') && <TopListView type="Suppliers" time={state.time} user={state.user} />}
                      </>
                    )}
                  </div>
                )}

                {state.mainTab === 'Commercials' && (
                  <div className="space-y-6">
                    {['Customers', 'Suppliers', 'Netting', 'Margin'].includes(state.commercialSubTab) ? (
                      <CommercialView 
                        subTab={state.commercialSubTab as any} 
                        time={state.time} 
                        selectedExecutiveId={state.selectedExecutiveId}
                      />
                    ) : state.commercialSubTab === 'Business' ? (
                      <TechnicalView subTab="Business" time={state.time} />
                    ) : (
                      <>
                        {(state.commercialSubTab === 'Top Countries') && <TopListView type="Countries" time={state.time} user={state.user} />}
                        {(state.commercialSubTab === 'Top Products') && <TopListView type="Products" time={state.time} user={state.user} />}
                        {(state.commercialSubTab === 'Top Customers') && <TopListView type="Customers" time={state.time} user={state.user} />}
                        {(state.commercialSubTab === 'Top Suppliers') && <TopListView type="Suppliers" time={state.time} user={state.user} />}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <SectionView menu={state.currentMenu} theme={state.theme} />
          )}
          
          <footer className={cn(
            "py-2 px-4 text-[10px] flex justify-between items-center transition-colors duration-500",
            state.theme === 'light' 
              ? "bg-zinc-50 text-zinc-400 border-t border-zinc-200" 
              : "bg-black text-white/30 border-t border-zinc-900"
          )}>
            <span>© Copyright 2025 Teleoss Software Pvt. Ltd. All Rights Reserved</span>
            <span className="uppercase font-bold tracking-widest">Client-Portal</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
