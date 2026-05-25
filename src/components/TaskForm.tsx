import React from 'react';
import { cn } from '../lib/utils';
import { X, Save, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export const TaskForm: React.FC<TaskFormProps> = ({ onClose, theme }) => {
  return (
    <div className={cn(
      "w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800",
      theme === 'dark' ? 'dark' : ''
    )}>
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tight">Create New Task</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Configure System Operation</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Task Name</label>
            <input 
              type="text" 
              placeholder="e.g., Monthly Report Generation"
              className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Task Type</label>
            <select className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold">
              <option>System Operation</option>
              <option>Finance Export</option>
              <option>Database Cleanup</option>
              <option>Support Ticket Sync</option>
              <option>Rate Update</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Priority Level</label>
            <select className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-black text-rose-500">
              <option value="Urgent">Urgent - Immediate Action</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low - Deferred</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Description & Payload</label>
            <textarea 
              rows={3}
              placeholder="Details about the task execution..." 
              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            ></textarea>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-900/30 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-700 dark:text-amber-500 font-bold uppercase leading-relaxed">
            High and Urgent tasks are prioritized in the execution queue and may preempt lower priority tasks based on available system resources.
          </p>
        </div>
      </div>

      <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase text-zinc-400 hover:text-zinc-600 transition-colors">Cancel</button>
        <button className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-blue-500/25">Initialize Task</button>
      </div>
    </div>
  );
};
