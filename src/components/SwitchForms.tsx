import React from 'react';
import { X, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface FormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function AddTranslationRuleForm({ onClose, theme }: FormProps) {
  const [activeTab, setActiveTab] = React.useState('General');

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full max-h-[90vh] flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">ADD TRANSLATION RULE</h3>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Save</button>
          <button onClick={onClose} className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all">Cancel</button>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors ml-2">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* General Information */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">GENERAL INFORMATION</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">NAME <span className="text-red-500">*</span></label>
              <input type="text" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">TYPE</label>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="radio" name="type" className="accent-[#428bca]" /> Ingress</label>
                <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="radio" name="type" className="accent-[#428bca]" /> Egress</label>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">IS CONTINUE</label>
              <div className="flex items-center gap-4 py-2">
                <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="radio" name="continue" className="accent-[#428bca]" /> Yes</label>
                <label className="flex items-center gap-2 text-xs cursor-pointer"><input type="radio" name="continue" className="accent-[#428bca]" defaultChecked /> No</label>
              </div>
            </div>
          </div>
        </div>

        {/* Match Pattern */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">MATCH PATTERN</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              { label: 'Sender ID', rightLabel: 'Sender ID Action', rightOptions: ['Match', 'Not Match'] },
              { label: 'Receiver ID', rightLabel: 'Receiver ID Action', rightOptions: ['Match', 'Not Match'] },
              { label: 'MCCMNC', rightLabel: 'MCCMNC Action', rightOptions: ['Match', 'Not Match'] },
              { label: 'Message Body Text', rightLabel: 'Message Body Action', rightOptions: ['Match', 'Not Match'] },
              { label: 'Sender ID List', type: 'select', rightLabel: 'Sender ID List Action', rightOptions: ['Match', 'Not Match'] },
              { label: 'Receiver ID List', type: 'select', rightLabel: 'Receiver ID List Action', rightOptions: ['Match', 'Not Match'] },
            ].map((field) => (
              <React.Fragment key={field.label}>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{field.label}</label>
                  {field.type === 'select' ? (
                    <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"><option>Select</option></select>
                  ) : (
                    <input type="text" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                  )}
                </div>
                <div className="flex flex-col gap-2 justify-center pt-4">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase text-zinc-400 min-w-[120px]">{field.rightLabel} :</span>
                    {field.rightOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-2 text-xs cursor-pointer">
                        <input type="radio" name={`${field.label}_action`} className="accent-[#428bca]" defaultChecked={opt === 'Match'} /> {opt}
                      </label>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">VERDICT</h4>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {[
              { label: 'Sender ID conversion type', options: ['Select', 'Translation', 'Static'] },
              { label: 'Sender ID', placeholder: 'SenderID' },
              { label: 'Receiver ID conversion type', options: ['Select', 'Translation', 'Static'] },
              { label: 'Receiver ID', placeholder: 'DestinationID' },
              { label: 'Sender TON', options: ['Select'] },
              { label: 'Sender NPI', options: ['Select'] },
              { label: 'Destination TON', options: ['Select'] },
              { label: 'Destination NPI', options: ['Select'] },
              { label: 'Billing Type', options: ['Select', 'Attempt', 'Success'] },
              { label: 'Registered Delivery', options: ['Select'] },
              { label: 'DLR Status & Error Code Convert', placeholder: 'Received | Send (Comma Separated)' },
              { label: 'Action', options: ['Allow', 'Block'] },
              { label: 'PEID (DLT)', placeholder: '' },
              { label: 'Template ID (DLT)', placeholder: '' },
              { label: 'Regex Pattern', placeholder: '' },
              { label: 'Regex Index', options: ['Select'] },
              { label: 'Message Text', placeholder: 'Search|Replace' },
              { label: 'MSG Template', type: 'textarea' },
              { label: 'Rule Logic', type: 'textarea', placeholder: 'Complex pattern matching or conditions...' },
            ].map((field) => (
              <div key={field.label} className={cn("flex flex-col gap-2", field.type === 'textarea' ? "md:col-span-2" : "")}>
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{field.label}</label>
                {field.options ? (
                  <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    {field.options.map(opt => <option key={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea rows={2} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono" />
                ) : (
                  <input type="text" placeholder={field.placeholder} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Advance Settings */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center group cursor-pointer">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">ADVANCE SETTINGS</h4>
            <Plus className="w-3 h-3 text-zinc-400" />
          </div>
          <div className="p-6">
             <div className="border-l-2 border-[#428bca]/20 pl-4 space-y-6">
                <h5 className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">LENGTH RESTRICTION</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['Sender ID Min Length', 'Sender ID Max Length', 'Receiver ID Min Length', 'Receiver ID Max Length'].map(f => (
                    <div key={f} className="flex flex-col gap-2">
                       <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{f} <span className="text-red-500">*</span></label>
                       <input type="number" defaultValue={f.includes('Max') ? 40 : 0} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationPopup({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-lg w-full">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Customer Send Rate Information</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Date <span className="text-red-500">*</span></label>
          <input type="datetime-local" defaultValue="2026-04-30T00:00" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
        </div>
        <div className="flex justify-center gap-3 pt-4">
          <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all active:scale-95">Send Email</button>
          <button onClick={onClose} className="px-8 py-2 bg-zinc-500 text-white text-[11px] font-black uppercase tracking-widest rounded shadow hover:bg-zinc-600 transition-all active:scale-95 border-b-2 border-zinc-700">Close</button>
        </div>
      </div>
    </div>
  );
}

export function AddNumberListForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 w-full max-w-4xl">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">ADD NUMBER LIST</h3>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Save</button>
          <button onClick={onClose} className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all">Cancel</button>
        </div>
      </div>
      <div className="p-8 space-y-8">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">GENERAL INFORMATION</h4>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-8">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">NAME <span className="text-red-500">*</span> :</label>
              <input type="text" className="max-w-md w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            </div>
            <div className="flex items-center gap-8">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">TYPE <span className="text-red-500">*</span> :</label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs cursor-pointer font-bold text-zinc-600 dark:text-zinc-400"><input type="radio" name="num_type" className="accent-[#428bca]" /> Random</label>
                <label className="flex items-center gap-2 text-xs cursor-pointer font-bold text-zinc-600 dark:text-zinc-400"><input type="radio" name="num_type" className="accent-[#428bca]" /> Tag</label>
                <label className="flex items-center gap-2 text-xs cursor-pointer font-bold text-zinc-600 dark:text-zinc-400"><input type="radio" name="num_type" className="accent-[#428bca]" /> Sender ID Template</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
