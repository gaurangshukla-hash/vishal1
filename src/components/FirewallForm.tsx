import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, Save, RotateCcw, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface FirewallFormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function FirewallForm({ onClose, theme }: FirewallFormProps) {
  const [expandedSections, setExpandedSections] = useState({
    template: true,
    condition: true
  });

  const [conditions, setConditions] = useState<any[]>([]);
  const [toggles, setToggles] = useState({
    status: true,
    storeIt: true,
    deductCredit: false
  });

  const toggleSection = (section: 'template' | 'condition') => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-5xl w-full flex flex-col font-sans">
      <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#0073aa] dark:text-blue-400">Add Firewall Template</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-1 border-b-2 border-red-500 mx-5 mt-2"></div>

      <div className="p-6 space-y-4 overflow-y-auto max-h-[85vh]">
        
        {/* Template Details Section */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded">
          <button 
            onClick={() => toggleSection('template')}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-2 text-[12px] font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800"
          >
            {expandedSections.template ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Template Details
          </button>
          
          {expandedSections.template && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1 outline-none text-xs focus:border-[#428bca] transition-colors" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Description <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1 outline-none text-xs focus:border-[#428bca] transition-colors" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Select Request Type <span className="text-red-500">*</span></label>
                <select className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1 outline-none text-xs appearance-none">
                  <option>Select Type</option>
                  <option>HTTP</option>
                  <option>SMPP</option>
                </select>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500 font-medium">Status</span>
                  <button onClick={() => setToggles(t => ({...t, status: !t.status}))}>
                    {toggles.status ? <ToggleRight className="w-8 h-8 text-green-600" /> : <ToggleLeft className="w-8 h-8 text-zinc-300" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500 font-medium">Store It</span>
                  <button onClick={() => setToggles(t => ({...t, storeIt: !t.storeIt}))}>
                    {toggles.storeIt ? <ToggleRight className="w-8 h-8 text-green-600" /> : <ToggleLeft className="w-8 h-8 text-zinc-300" />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-500 font-medium">Deduct Credit</span>
                  <button onClick={() => setToggles(t => ({...t, deductCredit: !t.deductCredit}))}>
                    {toggles.deductCredit ? <ToggleRight className="w-8 h-8 text-green-600" /> : <ToggleLeft className="w-8 h-8 text-zinc-300" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Start Date</label>
                <input type="text" defaultValue="04-05-2026 15:54" className="w-full border border-zinc-200 dark:border-zinc-800 rounded px-3 py-1.5 bg-white dark:bg-zinc-800 outline-none text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">End Date</label>
                <input type="text" defaultValue="05-05-2026 15:54" className="w-full border border-zinc-200 dark:border-zinc-800 rounded px-3 py-1.5 bg-white dark:bg-zinc-800 outline-none text-xs" />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[11px] text-zinc-500 font-medium">Remarks</label>
                <textarea rows={3} className="w-full border border-zinc-200 dark:border-zinc-800 rounded px-3 py-1.5 bg-white dark:bg-zinc-800 outline-none text-xs resize-none" placeholder="Remarks"></textarea>
              </div>
            </div>
          )}
        </div>

        {/* Condition Details Section */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded">
          <button 
            onClick={() => toggleSection('condition')}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 flex items-center gap-2 text-[12px] font-bold text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800"
          >
            {expandedSections.condition ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            Condition Details
          </button>
          
          {expandedSections.condition && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 font-medium">Select Type <span className="text-red-500">*</span></label>
                  <select className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1 outline-none text-xs">
                    <option>Mobile</option>
                    <option>Senderid</option>
                    <option>Message Content</option>
                    <option>Country</option>
                    <option>Operator</option>
                    <option>Fail Attempts</option>
                    <option>Interval</option>
                    <option>Interval Type</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 font-medium">Select Condition <span className="text-red-500">*</span></label>
                  <select className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1 outline-none text-xs">
                    <option>Equals</option>
                    <option>Does Not Equals</option>
                    <option>Begins With</option>
                    <option>End With</option>
                    <option>Contains</option>
                    <option>Does Not Contains</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-zinc-500 font-medium">Value</label>
                  <input type="text" className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1 outline-none text-xs" />
                </div>
                <button className="bg-red-500 text-white px-4 py-1.5 rounded-sm text-xs font-bold hover:bg-red-600 transition-colors w-fit">Add</button>
              </div>

              <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                <table className="w-full text-[11px] text-left">
                  <thead className="bg-[#f5f5f5] dark:bg-zinc-800 text-[#0073aa] dark:text-blue-400 font-bold">
                    <tr>
                      <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700 w-16">Sr.No.</th>
                      <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700">Type</th>
                      <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700">Condition</th>
                      <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700">Value</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-zinc-400 italic">No records found</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-[#f5f5f5] dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
                    <tr>
                      <td colSpan={5} className="px-4 py-1.5 font-bold text-zinc-500 italic">Total 0 records found</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={onClose} className="bg-red-500 text-white px-10 py-1.5 rounded-sm text-[11px] font-bold hover:bg-red-600 transition-colors">Back</button>
          <button className="bg-red-500 text-white px-10 py-1.5 rounded-sm text-[11px] font-bold hover:bg-red-600 transition-colors">Add</button>
        </div>
      </div>
    </div>
  );
}
