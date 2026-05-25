import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { MenuOption } from '../types';
import { NAVIGATION, NavItem, NavSubItem } from '../lib/navigation';

interface NavbarProps {
  currentMenu: string;
  onMenuChange: (menu: string) => void;
  theme: 'light' | 'dark';
}

export function Navbar({ currentMenu, onMenuChange, theme }: NavbarProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className={cn(
      "hidden lg:flex items-center gap-1 px-4 h-12 transition-colors",
      theme === 'light' ? "bg-white border-zinc-100" : "bg-zinc-950 border-zinc-800"
    )}>
      {NAVIGATION.map((item) => (
        <div 
          key={item.id} 
          className="relative group h-full"
          onMouseEnter={() => setActiveDropdown(item.id)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            onClick={() => onMenuChange(item.id)}
            className={cn(
              "flex items-center gap-1 h-full px-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 relative",
              currentMenu === item.id
                ? "text-brand-500 bg-brand-500/5"
                : theme === 'light' ? "text-zinc-600 hover:text-brand-500" : "text-zinc-400 hover:text-brand-500"
            )}
          >
            {item.label}
            {item.items && <ChevronDown className="w-3 h-3 opacity-50 transition-transform duration-300 group-hover:rotate-180" />}
            <span className={cn(
              "absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 transition-all duration-300",
              currentMenu === item.id ? "w-full" : "w-0 group-hover:w-full"
            )} />
          </button>

          {item.items && activeDropdown === item.id && (
            <div className={cn(
              "absolute top-full left-0 w-56 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-[100] rounded-b-md slide-in-right",
              theme === 'dark' ? "text-white" : "text-black"
            )}>
              {item.items.map((subItem) => (
                <div key={subItem.id} className="relative group/sub">
                  <button
                    onClick={() => onMenuChange(subItem.label)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-brand-500 transition-all duration-300 flex items-center justify-between hover:translate-x-1",
                      theme === 'light' ? "text-zinc-600" : "text-zinc-400"
                    )}
                  >
                    {subItem.label}
                    {subItem.items && <ChevronDown className="w-3 h-3 -rotate-90 opacity-50 transition-transform duration-300 group-hover/sub:rotate-0" />}
                  </button>

                  {/* Second level dropdown */}
                  {subItem.items && (
                    <div className="absolute top-0 left-full w-56 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl hidden group-hover/sub:block rounded-md ml-[1px] slide-in-right">
                      {subItem.items.map((deepItem) => (
                        <button
                          key={deepItem.id}
                          onClick={() => onMenuChange(deepItem.label)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-brand-500 transition-all duration-300 hover:translate-x-1",
                            theme === 'light' ? "text-zinc-600" : "text-zinc-400"
                          )}
                        >
                          {deepItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
