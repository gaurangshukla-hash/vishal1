import React from 'react';
import { motion } from 'motion/react';

interface SpeedometerProps {
  value: number;
  title: string;
}

export const Speedometer: React.FC<SpeedometerProps> = ({ value, title }) => {
  const rotation = (value / 100) * 180 - 90;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-night-bg rounded-[3rem] border border-zinc-200 dark:border-zinc-900 shadow-2xl">
      <h3 className="text-sm font-black text-zinc-400 uppercase tracking-widest mb-8">{title}</h3>
      <div className="relative w-64 h-32 overflow-hidden">
        {/* Gauge Background */}
        <div className="absolute inset-0 w-64 h-64 border-[16px] border-zinc-100 dark:border-night-bg rounded-full" />
        
        {/* Gauge Progress */}
        <svg className="absolute inset-0 w-64 h-64 -rotate-180" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="132 264"
            className="text-brand-500"
            style={{ strokeDashoffset: 132 - (value / 100) * 132 }}
          />
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-24 bg-brand-500 origin-bottom rounded-full shadow-lg"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
          style={{ marginLeft: '-2px' }}
        />
        
        {/* Center Point */}
        <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-zinc-900 dark:bg-white rounded-full -translate-x-1/2 translate-y-1/2 border-4 border-brand-500 shadow-xl" />
      </div>
      
      <div className="mt-8 text-center">
        <motion.span 
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-zinc-900 dark:text-white font-mono"
        >
          {value}
        </motion.span>
        <span className="text-xl font-black text-brand-500 ml-2 font-mono">TPS</span>
      </div>
    </div>
  );
};
