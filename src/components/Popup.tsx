import React from 'react';
import { X } from 'lucide-react';

interface PopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const Popup: React.FC<PopupProps> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500 animate-in fade-in"
        onClick={onClose}
      ></div>
      
      {/* Content */}
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-night-bg rounded-2xl md:rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-zinc-200 dark:border-zinc-900 flex flex-col transition-all duration-500 transform animate-in zoom-in-95 slide-in-from-bottom-10"
      >
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 p-4 md:p-10 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-night-bg">
          <div className="space-y-1">
            <h3 className="text-sm md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-[0.1em] md:tracking-[0.25em] leading-tight">
              {title}
            </h3>
            <div className="h-0.5 md:h-1 w-8 md:w-12 bg-brand-500 rounded-full" />
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 md:p-3 rounded-lg md:rounded-2xl bg-zinc-100 dark:bg-night-bg hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-all duration-300 active:scale-90 border border-zinc-200 dark:border-zinc-700 group shrink-0"
          >
            <X className="w-4 md:w-6 h-4 md:h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Body */}
        <div className="relative z-10 p-2 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
