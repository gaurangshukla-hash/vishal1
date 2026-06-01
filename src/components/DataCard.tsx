import React from 'react';
import { Gauge, LineChart } from 'lucide-react';
import { cn } from '../lib/utils';

interface DataCardProps {
  title: string;
  value: string | number;
  hasPlus?: boolean;
  onClick?: () => void;
  onGraphClick?: (e: React.MouseEvent) => void;
  onSpeedometerClick?: (e: React.MouseEvent) => void;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  hasPlus,
  onClick,
  onGraphClick,
  onSpeedometerClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 md:p-5 rounded-xl md:rounded-[2rem] border border-zinc-200 dark:border-zinc-900 bg-white dark:bg-night-bg shadow-sm relative group transition-all duration-500 overflow-hidden',
        onClick ? 'cursor-pointer hover:shadow-2xl hover:shadow-brand-500/10 active:scale-[0.98] hover:border-brand-500/30' : ''
      )}
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors duration-500" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div className="space-y-1">
            <h4 className="text-[9px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] leading-tight">
              {title}
            </h4>
            <div className="h-0.5 w-4 bg-brand-500/30 rounded-full group-hover:w-8 transition-all duration-500" />
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            {onSpeedometerClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeedometerClick(e);
                }}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/10"
                title="View Speedometer"
              >
                <Gauge className="w-3.5 md:w-4 h-3.5 md:h-4" />
              </button>
            )}
            {onGraphClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onGraphClick(e);
                }}
                className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/10"
                title="View Line Chart"
              >
                <LineChart className="w-3.5 md:w-4 h-3.5 md:h-4" />
              </button>
            )}
            {hasPlus && (
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-brand-500/10 flex items-center justify-center">
                <span className="text-brand-500 font-black text-lg md:text-xl leading-none">+</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-baseline gap-1">
          <div className="text-2xl md:text-4xl font-black text-zinc-950 dark:text-white font-display tracking-tighter group-hover:translate-x-1 transition-transform duration-500">
            {value}
          </div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-1 md:mb-2" />
        </div>
      </div>
      
      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
