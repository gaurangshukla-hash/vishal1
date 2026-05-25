import React from 'react';
import { X, Save, RotateCcw, Edit2, ArrowLeft, Zap, Plus, History } from 'lucide-react';
import { cn } from '../lib/utils';

interface FormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function AddRouteRuleGroupForm({ onClose, theme, editData }: FormProps & { editData?: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full">
      <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-bold text-[#428bca]">Route / Route Rule Group</span>
          <span className="text-zinc-400">/ {editData ? 'Edit' : 'Add'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-6 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded shadow hover:bg-blue-600 flex items-center gap-2 uppercase transition-all">
            <Save className="w-3 h-3" /> Save
          </button>
          <button onClick={onClose} className="px-6 py-1 bg-[#d9534f] text-white text-[11px] font-bold rounded shadow hover:bg-red-600 flex items-center gap-2 uppercase transition-all">
            Cancel
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
          <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
             <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">GENERAL INFORMATION</h3>
          </div>
          <div className="p-8 space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-[#428bca] tracking-wider font-mono min-w-[150px] text-left">Route Rule Group <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                defaultValue={editData?.['Group Name'] || ''}
                className="flex-1 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ViewRouteRuleGroup({ onClose, data }: { onClose: () => void; data: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full text-left">
      <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-bold text-[#428bca]">Route / Route Rule Group</span>
          <span className="text-zinc-400">/ View</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-6 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded shadow hover:bg-blue-600 flex items-center gap-2 uppercase transition-all">
            <Edit2 className="w-3 h-3" /> Edit
          </button>
          <button onClick={onClose} className="px-6 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded shadow hover:bg-blue-600 flex items-center gap-2 uppercase transition-all">
            Back
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
          <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
             <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">GENERAL INFORMATION</h3>
          </div>
          <div className="p-10 space-y-4">
             {[
               { label: 'Route Rule Group', value: data?.['Group Name'] || 'Ruta Reseller' },
               { label: 'Updated Time', value: data?.['Updated Time'] || '2026-03-13 03:14:06' },
               { label: 'Updated By', value: data?.['Updated By'] || 'Francisco Cieza' },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-10">
                 <div className="w-48 text-right text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono">
                   {item.label} :
                 </div>
                 <div className="text-[11px] font-bold text-[#428bca]">
                   {item.value}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddRouteRuleForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full text-left">
      <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-bold text-[#428bca]">Route / Route Rule</span>
          <span className="text-zinc-400">/ Add</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-6 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded shadow hover:bg-blue-600 flex items-center gap-2 uppercase transition-all">
            <Save className="w-3 h-3" /> Save
          </button>
          <button onClick={onClose} className="px-6 py-1 bg-[#d9534f] text-white text-[11px] font-bold rounded shadow hover:bg-red-600 flex items-center gap-2 uppercase transition-all">
            Cancel
          </button>
        </div>
      </div>

      <div className="p-6 h-[70vh] overflow-auto custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
              <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">GENERAL INFORMATION</h3>
              </div>
              <div className="p-6 space-y-4">
                <FormRow label="Name" required>
                  <input type="text" className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                </FormRow>
                <FormRow label="Product Category" required>
                  <select className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                    <option>Select</option>
                  </select>
                </FormRow>
                <FormRow label="Priority" required>
                  <input type="text" className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                </FormRow>
                <FormRow label="Route Type" required>
                  <select className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                    <option>LCR</option>
                    <option>Preference</option>
                  </select>
                </FormRow>
                <FormRow label="Primary Vendor">
                  <select className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                    <option>Select Vendor (For Preference)</option>
                    <option>V_ASIA_DIRECT</option>
                    <option>V_GLOBAL_HUB</option>
                  </select>
                </FormRow>
                <FormRow label="Start Time" required>
                  <input type="time" defaultValue="00:00:00" className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                </FormRow>
                <FormRow label="Stop Time" required>
                  <input type="time" defaultValue="23:59:59" className="flex-1 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                </FormRow>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
              <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">CRITERIA</h3>
              </div>
              <div className="p-6 space-y-4">
                <FormRow label="Customer Enterprise">
                  <div className="flex-1 h-32 border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800 overflow-auto p-2">
                    {['Enterprise A', 'Enterprise B'].map(e => (
                      <label key={e} className="flex items-center gap-2 text-xs p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5" />
                        <span>{e}</span>
                      </label>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="MCCMNC">
                  <div className="flex-1 h-24 border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800 overflow-auto p-2">
                    {['India (404)', 'USA (310)'].map(m => (
                      <label key={m} className="flex items-center gap-2 text-xs p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5" />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="Target Product">
                  <div className="flex-1 h-24 border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-800 overflow-auto p-2">
                    {['Premium Direct', 'Standard LCR', 'Economy WHS'].map(p => (
                      <label key={p} className="flex items-center gap-2 text-xs p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded cursor-pointer">
                        <input type="checkbox" className="w-3.5 h-3.5" />
                        <span>{p}</span>
                      </label>
                    ))}
                  </div>
                </FormRow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DynamicRoutingForm({ onClose, theme, trunk }: FormProps & { trunk?: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-blue-50/50 dark:bg-blue-800/10 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">DYNAMIC ROUTING ENGINE CONFIGURATION</h3>
          <span className="text-[10px] font-bold text-zinc-400 mt-0.5">MANAGE REAL-TIME TRAFFIC FLOW & FAILOVER {trunk ? `FOR ${trunk.name}` : ''}</span>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh] text-left">
        {/* Engine Intelligence Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-800/20 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800">
           <div className="space-y-1.5 md:col-span-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Target Customers</label>
              <select className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-bold" defaultValue={trunk?.name || 'All Wholesale Customers'}>
                 <option>All Wholesale Customers</option>
                 <option>Direct Enterprise Clients</option>
                 {trunk && <option value={trunk.name}>Specific: {trunk.name}</option>}
                 {!trunk && <option>Specific: Aakash_DIR_IN</option>}
              </select>
           </div>
           <div className="space-y-1.5 md:col-span-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Product</label>
              <select className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-bold">
                 <option>Premium Direct (High Quality)</option>
                 <option>Standard LCR</option>
                 <option>Economy WHS</option>
              </select>
           </div>
           <div className="space-y-1.5 md:col-span-1">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Routing Optimization</label>
              <select className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-bold text-amber-600">
                 <option>Hybrid: Margin + Quality (Recommended)</option>
                 <option>Aggressive LCR (Price Only)</option>
                 <option>Quality Guard (DLR Priority)</option>
                 <option>Manual Fixed Override</option>
              </select>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Strategy Section */}
           <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                 <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
                       <Zap className="w-4 h-4 text-amber-500" /> Vendor Priority & Smart Distribution
                    </h4>
                    <div className="flex gap-4">
                       <span className="text-[9px] font-bold text-zinc-400 uppercase">Avg Delay: <span className="text-zinc-700 dark:text-zinc-300">142ms</span></span>
                       <span className="text-[9px] font-bold text-zinc-400 uppercase">System Uptime: <span className="text-emerald-500">99.99%</span></span>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    {[
                      { name: 'V_ASIA_PREMIUM (201)', rate: '0.0051', priority: '1', weight: '60%', dlr: '98.2%', status: 'Active' },
                      { name: 'V_GLOBAL_WHS (305)', rate: '0.0048', priority: '2', weight: '40%', dlr: '92.1%', status: 'Active' },
                      { name: 'V_DIRECT_IN (101)', rate: '0.0055', priority: '3', weight: '0%', dlr: '99.5%', status: 'Standby' }
                    ].map((v, i) => (
                      <div key={i} className="group flex flex-col p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-[#428bca] transition-all bg-white dark:bg-zinc-900 shadow-sm">
                         <div className="flex items-center gap-4">
                           <div className="w-8 h-8 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center font-black text-xs text-zinc-400 group-hover:text-[#428bca]"># {i + 1}</div>
                           <div className="flex-1">
                              <div className="flex items-center gap-3">
                                 <span className="text-[11px] font-black text-zinc-800 dark:text-zinc-100 uppercase">{v.name}</span>
                                 <span className={cn(
                                   "px-1.5 py-0.5 text-[8px] font-black rounded uppercase",
                                   v.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                 )}>{v.status}</span>
                              </div>
                              <div className="flex gap-4 mt-1.5">
                                 <span className="text-[9px] font-bold text-zinc-400 uppercase">Base Rate: <span className="text-zinc-700 dark:text-zinc-300 font-mono">${v.rate}</span></span>
                                 <span className="text-[9px] font-black text-blue-500 uppercase">DLR Real-time: {v.dlr}</span>
                              </div>
                           </div>
                           <div className="flex gap-4">
                              <div className="w-20">
                                 <label className="text-[8px] font-black text-zinc-400 uppercase block mb-1">Priority</label>
                                 <input type="text" defaultValue={v.priority} className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] font-black text-center text-[#428bca]" />
                              </div>
                              <div className="w-20">
                                 <label className="text-[8px] font-black text-zinc-400 uppercase block mb-1">Weight %</label>
                                 <input type="text" defaultValue={v.weight} className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] font-black text-center" />
                              </div>
                           </div>
                         </div>
                         
                         {/* Vendor Level Failover Settings (Advanced) */}
                         <div className="mt-3 pt-3 border-t border-zinc-50 dark:border-zinc-800 grid grid-cols-3 gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2">
                               <input type="checkbox" defaultChecked className="w-3 h-3" />
                               <span className="text-[9px] font-bold text-zinc-400 uppercase whitespace-nowrap">Auto-Bypass on DLR Drop</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <input type="checkbox" className="w-3 h-3" />
                               <span className="text-[9px] font-bold text-zinc-400 uppercase whitespace-nowrap">Throttle Peak Loads</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <input type="checkbox" className="w-3 h-3" />
                               <span className="text-[9px] font-bold text-zinc-400 uppercase whitespace-nowrap">Enforce Max Latency</span>
                            </div>
                         </div>
                      </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#428bca] hover:border-[#428bca] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Inject New Vendor Into Routing Pool
                    </button>
                 </div>
              </div>
           </div>

           {/* Failover Logic Section */}
           <div className="space-y-6">
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl space-y-6">
                 <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                    <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] italic">Failover Engine</h4>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[8px] font-black text-emerald-500 uppercase">Live Optimizer</span>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Primary Failover Policy</label>
                       <select className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-xs text-white outline-none font-bold">
                          <option>Waterfall: Sequential Preference</option>
                          <option>Broadcast: Parallel (Fastest Wins)</option>
                          <option>Sticky: Target Locked</option>
                          <option>Round Robin: Balanced Load</option>
                       </select>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Global DLR Threshold (%)</label>
                       <div className="flex items-center gap-3">
                          <input type="range" min="50" max="100" defaultValue="85" className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#428bca]" />
                          <span className="text-xs font-black text-[#428bca] w-8">85%</span>
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <label className="text-[9px] font-bold text-zinc-400 uppercase">Trigger Event Codes</label>
                       <div className="flex flex-wrap gap-2 pt-1">
                          {['404 (Unreach)', '486 (Busy)', '503 (Limit)', '500 (Fail)'].map(code => (
                             <span key={code} className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[8px] font-black rounded border border-zinc-700 hover:border-[#428bca] transition-colors">{code}</span>
                          ))}
                          <button className="flex items-center justify-center w-6 h-6 bg-[#428bca] text-white rounded text-xs hover:bg-blue-600 transition-all">+</button>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-zinc-800">
                    <div className="flex flex-col gap-3">
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-4 h-4 rounded border-2 border-zinc-600 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                             <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">Enable Intelligent Redelivery</span>
                             <span className="text-[8px] text-zinc-500 font-bold">Auto-retry on transient errors (Max 3)</span>
                          </div>
                       </label>
                       
                       <label className="flex items-center gap-3 cursor-pointer group">
                          <div className="w-4 h-4 rounded border-2 border-zinc-600 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                             <div className="w-2 h-2 bg-amber-500 rounded-sm"></div>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">Margin Protection Gate</span>
                             <span className="text-[8px] text-zinc-500 font-bold">Never failover to negative margin routes</span>
                          </div>
                       </label>
                    </div>
                 </div>
              </div>

              <div className="p-6 bg-[#428bca]/5 rounded-xl border border-[#428bca]/20 space-y-3">
                 <h5 className="text-[10px] font-black text-[#428bca] uppercase tracking-widest flex items-center gap-2">
                    <History className="w-3.5 h-3.5" /> Stability Metric
                 </h5>
                 <p className="text-[9px] text-zinc-500 font-bold uppercase leading-relaxed">
                    This routing configuration has achieved a <span className="text-emerald-500 font-black">94.2% Stability Index</span> over the last 24 hours. No manual intervention required.
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/80 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-tight italic">
           Routing Algorithm: <span className="text-zinc-600 dark:text-zinc-300">Weighted Quality-LCR Hybrid v4.2</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Discard Draft</button>
          <button onClick={onClose} className="px-10 py-2.5 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2">
            <Save className="w-4 h-4" /> Deploy Routing Rules
          </button>
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-[11px] font-black uppercase text-[#428bca] tracking-wider font-mono min-w-[150px] text-left">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
