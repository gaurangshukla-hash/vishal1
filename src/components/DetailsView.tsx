import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { Save, ChevronLeft, Plus, Edit2, Download, Trash2, Copy, Search, Globe, Mail, Phone, ExternalLink } from 'lucide-react';

interface DetailsViewProps {
  title: string;
  theme: 'light' | 'dark';
}

export function DetailsView({ title, theme }: DetailsViewProps) {
  const [activeTab, setActiveTab] = useState('General Info');
  const [showAddForm, setShowAddForm] = useState(false);

  const tabs = [
    'General Info', 'Docs', 'Billing', 'Vendor Trunk', 'Customer Trunk'
  ];

  const sections: Record<string, any> = {
    'General Info': [
      {
        title: 'GENERAL INFORMATION',
        fields: [
          { label: 'Name', value: 'ABC' },
          { label: 'Alias', value: 'ABC' },
          { label: 'Type', value: 'Reciprocal' },
          { label: 'Category', value: 'Tier 1' },
          { label: 'Business Company', value: 'Breelink LLC' },
          { label: 'Status', value: 'Active', type: 'status' },
          { label: 'Bind Alert', value: 'Enabled' },
          { label: 'Credit Alert', value: 'Enabled' },
          { label: 'Credit Alert Percentage', value: 'Notice (75) Warning (90) Critical (100)' },
          { label: 'User', value: 'a.yehya gabs (109)' },
        ]
      },
      {
        title: 'ADDRESS INFORMATION',
        fields: [
          { label: 'Address Line 1', value: 'ABC Address' },
          { label: 'Address Line 2', value: '' },
          { label: 'City', value: '' },
          { label: 'State', value: '' },
          { label: 'Country', value: '' },
          { label: 'ZIP/PIN Code', value: '' },
          { label: 'Website', value: '' },
          { label: 'Fax', value: '' },
          { label: 'Registration Number', value: '' },
        ]
      },
      {
        title: 'CONTACT INFORMATION',
        isFullWidth: true,
        contacts: [
          { type: 'Commercial Contact', name: '', phone: '', email: 'a.yehya@gabsgroup.com' },
          { type: 'Technical Contact', name: '', phone: '', email: 'support@breelink.com,sachin594516@gmail.com' },
          { type: 'Rates Contact', name: '', phone: '', email: 'a.yehya@gabsgroup.com' },
          { type: 'Finance Contact', name: '', phone: '', email: 'a.yehya@gabsgroup.com' },
        ]
      }
    ],
    'Billing': [
      {
        title: 'Customer Billing Information',
        fields: [
          { label: 'Customer Balance', value: 'EUR 2,056.831140' },
          { label: 'Currency', value: 'EUR' },
          { label: 'Billing Cycle', value: 'Monthly - Net 15' },
          { label: 'Timezone', value: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
          { label: 'Billing Type', value: 'Postpaid' },
          { label: 'Credit Limit', value: '1,000.000000' },
          { label: 'Opening Balance', value: '0.000000' },
          { label: 'Auto Invoicing', value: 'Enabled' },
          { label: 'Description', value: '' },
          { label: 'Updated By', value: 'breelink support' },
          { label: 'Updated Time', value: '2025-12-31 10:01:52' },
        ]
      },
      {
        title: 'Vendor Billing Information',
        fields: [
          { label: 'Vendor Balance', value: 'EUR -23,796.810000' },
          { label: 'Currency', value: 'EUR' },
          { label: 'Billing Cycle', value: 'Monthly - Net 15' },
          { label: 'Timezone', value: '(GMT +5:30) Bombay, Calcutta, Madras, New Delhi' },
          { label: 'Opening Balance', value: '0.000000' },
        ]
      },
      {
        title: 'Beneficiary Information',
        hasEdit: true,
        fields: [
          { label: 'Beneficiary Name', value: 'Adarsh' },
          { label: 'Beneficiary Address', value: 'Adarsh House' },
          { label: 'Beneficiary Bank', value: 'Adarsh Bank' },
          { label: 'Beneficiary Bank Address', value: 'Adarsh Bank Address' },
          { label: 'Currency', value: 'EUR' },
          { label: 'Beneficiary Account Number', value: 'ABC' },
          { label: 'IBAN', value: '9638 5555 6666 66666' },
          { label: 'Swift Code', value: 'ABT25455' },
          { label: 'Wallet Address', value: '' },
        ]
      }
    ]
  };

  const currentSections = sections[activeTab] || [];

  const handleBack = () => {
    if (showAddForm) {
      setShowAddForm(false);
    }
  };

  const renderTable = (headers: string[], actions?: string[]) => {
    const data = headers.includes('TRUNK ID') ? [
      { id: '89', name: 'Digiwhilff_DIR_IN', user: 'DigiWhDIR', cat: 'DIRECT', rule: 'ABC Direct TRG', proto: 'SMPP', tps: '100', status: 'Active', updated: 'Admin User' },
      { id: '87', name: 'Trunk_cliente_itelvox', user: 'cliente_itelvox', cat: 'DIRECT', rule: 'ABC Direct TRG', proto: 'HTTP', tps: '5', status: 'Active', updated: 'Francisco Cieza' },
    ] : [];

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-end gap-2">
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
          {actions && actions.map(action => (
            <button key={action} className={cn(
              "px-3 py-1 text-white text-[11px] font-bold rounded flex items-center gap-1.5",
              action === 'Edit' ? "bg-[#5cb85c] hover:bg-green-600" : 
              action === 'Clone' ? "bg-[#428bca] hover:bg-blue-600" :
              action === 'View' ? "bg-[#428bca] hover:bg-blue-600" :
              "bg-zinc-500"
            )}>
              {action}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-4 py-2 w-10">
                  <input type="checkbox" className="rounded border-zinc-300 dark:border-zinc-600" />
                </th>
                {headers.map(h => (
                  <th key={h} className="px-4 py-2 text-[10px] font-black uppercase text-zinc-500 tracking-wider border-r border-zinc-200 dark:border-zinc-800 last:border-r-0 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {h}
                      <input type="text" placeholder="Search" className="w-full px-2 py-1 text-[10px] font-normal border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 outline-none" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((row, i) => (
                <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2"><input type="checkbox" /></td>
                  <td className="px-4 py-2 text-[11px] text-[#428bca] font-bold">{row.id}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.name}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.user}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.cat}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.rule}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.proto}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.tps}</td>
                  <td className="px-4 py-2 text-[11px] font-medium text-emerald-600 font-bold">{row.status}</td>
                  <td className="px-4 py-2 text-[11px] font-medium">{row.updated}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={headers.length + 1} className="px-4 py-8 text-center text-[11px] text-zinc-400 italic">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAddForm = () => (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-md animate-in zoom-in-95 duration-300">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Enterprise / {activeTab} <span className="font-normal text-zinc-400">/ Add</span></h3>
        <div className="flex gap-2">
          <button onClick={() => setShowAddForm(false)} className="px-4 py-1.5 bg-[#428bca] text-white text-[11px] font-bold rounded hover:bg-blue-600 shadow-sm transition-all">Save</button>
          <button onClick={() => setShowAddForm(false)} className="px-4 py-1.5 bg-[#d9534f] text-white text-[11px] font-bold rounded hover:bg-red-600 shadow-sm transition-all">Cancel</button>
        </div>
      </div>
      <div className="p-6 space-y-8">
        {/* General Information */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">General Information</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Trunk Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none focus:border-brand-500 transition-colors" />
            </div>
            <div className="space-y-1.5 text-[11px] font-bold text-zinc-500">
              <label className="uppercase tracking-tighter block mb-2">Protocol <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold"><input name="proto" type="radio" className="w-4 h-4" defaultChecked /> <span className="text-zinc-800 dark:text-zinc-200">SMPP</span></label>
                <label className="flex items-center gap-2 cursor-pointer font-normal"><input name="proto" type="radio" className="w-4 h-4" /> <span className="text-zinc-600 dark:text-zinc-400">HTTP</span></label>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Translation Rule Group</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none">
                <option>Select</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Billing Type</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none">
                <option>Submit</option>
                <option>DLR</option>
              </select>
            </div>
            <div className="space-y-1.5 text-[11px] font-bold text-zinc-500">
              <label className="uppercase tracking-tighter block mb-2">Status <span className="text-red-500">*</span></label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold"><input name="status" type="radio" className="w-4 h-4 text-emerald-500" defaultChecked /> <span className="text-emerald-600">Active</span></label>
                <label className="flex items-center gap-2 cursor-pointer font-normal"><input name="status" type="radio" className="w-4 h-4" /> <span className="text-zinc-600 dark:text-zinc-400">Inactive</span></label>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Bind Type</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" defaultValue="AUTO">
                <option>AUTO</option>
                <option>MANUAL</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">HLR Rule Group</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none">
                <option>Select</option>
              </select>
            </div>
            <div className="flex items-center gap-8 pt-4">
               <label className="flex items-center gap-2 text-[11px] font-medium text-zinc-600 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded" /> Consider HLR Rate</label>
               <label className="flex items-center gap-2 text-[11px] font-medium text-zinc-600 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded" /> Service Type Routing</label>
               <label className="flex items-center gap-2 text-[11px] font-medium text-zinc-600 cursor-pointer"><input type="checkbox" className="w-4 h-4 rounded" /> Part Wise Routing</label>
            </div>
          </div>
        </div>

        {/* Connection */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">Connection</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Host Name <span className="text-red-500">*</span></label>
              <input type="text" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Username <span className="text-red-500">*</span></label>
              <input type="text" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Password <span className="text-red-500">*</span></label>
              <div className="flex h-9 border border-zinc-200 dark:border-zinc-700 rounded overflow-hidden">
                <input type="password" underline="none" className="flex-1 px-3 bg-white dark:bg-zinc-800 text-[12px] border-none outline-none" />
                <button className="px-3 bg-brand-500 text-white"><Save className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Max Connections</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" defaultValue="1">
                {[1,2,3,4,5,10,20].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">DLR Push URL</label>
              <input type="text" placeholder="http://" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">MO Push URL</label>
              <input type="text" placeholder="http://" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
          </div>
        </div>

        {/* Limitation */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">Limitation</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">TPS <span className="text-red-500">*</span></label>
              <input type="text" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Customer Overflow Buffer</label>
              <input type="text" defaultValue="0" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
            <div className="space-y-1.5 text-[11px] font-bold text-zinc-500">
               <label className="uppercase tracking-tighter block mb-2">Loop Detection <span className="text-red-500">*</span></label>
               <div className="flex gap-4">
                 <label className="flex items-center gap-2 cursor-pointer font-normal text-zinc-600"><input name="loop" type="radio" /> Active</label>
                 <label className="flex items-center gap-2 cursor-pointer font-bold text-[#f08080]"><input name="loop" type="radio" defaultChecked /> Inactive</label>
               </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Default Coding</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none">
                <option>GSM 7 bit(0)</option>
                <option>Unicode(8)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Rate Table List */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">Rate Table List</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Category <span className="text-red-500">*</span></label>
                <div className="border border-zinc-200 dark:border-zinc-700 rounded p-4 space-y-2 bg-zinc-50/30">
                   {['DIRECT', 'HQ', 'SIM', 'WHS'].map(cat => (
                     <label key={cat} className="flex items-center gap-2 text-[11px] cursor-pointer">
                       <input type="radio" name="cat_select" defaultChecked={cat==='DIRECT'} /> {cat}
                     </label>
                   ))}
                   <div className="pt-2 text-[10px] text-zinc-400">Total Record(s) 11</div>
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Rate Table <span className="text-red-500">*</span></label>
                <div className="border border-zinc-200 dark:border-zinc-700 rounded flex flex-col h-[180px] bg-white dark:bg-zinc-800">
                   <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                      <input type="text" placeholder="Search" className="w-full px-2 py-1.5 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] outline-none" />
                   </div>
                   <div className="flex-1 overflow-auto p-2 space-y-1">
                      {['GABS_DIR_IN (23)', 'Demo test rate (24)', 'Hasan_DIR_IN (25)', 'Hasan_DIR_out (26)'].map(rate => (
                        <label key={rate} className="flex items-center gap-2 text-[11px] p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 rounded cursor-pointer">
                          <input type="checkbox" className="w-3.5 h-3.5" /> {rate}
                        </label>
                      ))}
                   </div>
                   <div className="p-2 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-[#428bca]">
                      Selected 0 of 60
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Express Vendor Selection */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">Express Vendor Selection</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Vendor Trunk</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none">
                <option>Select Vendor Trunk</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter flex items-center gap-1">Margin <span className="text-blue-500 cursor-help underline decoration-dotted">?</span></label>
              <input type="text" defaultValue="0.000000" className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#f0f2f5] dark:bg-black/20 font-sans">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm z-10">
        <div className="flex items-center gap-3">
          {!showAddForm && (
            <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-white/10 rounded-full transition-colors text-zinc-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200">{title}</h2>
          
          <div className="flex items-center gap-2 ml-4">
            <select 
              defaultValue="ABC - ABC (38)"
              className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-3 py-1.5 text-[12px] font-bold text-[#333] dark:text-zinc-300 outline-none min-w-[200px] shadow-sm focus:ring-2 focus:ring-[#428bca]/20"
            >
              <option>ABC - ABC (38)</option>
              <option>TeleOSS - TOS (109)</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 text-[11px] font-bold uppercase tracking-wider">
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => { setActiveTab(tab); setShowAddForm(false); }}
              className={cn(
                "hover:text-[#428bca] transition-all duration-200 cursor-pointer pb-0.5",
                activeTab === tab ? "text-[#428bca] border-b-2 border-[#428bca]" : "text-zinc-500"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        {showAddForm ? renderAddForm() : (
          <div className="space-y-4">
            {activeTab === 'Docs' && renderTable(['INFO ID', 'NAME', 'DOWNLOAD FILE', 'CREATED BY', 'CREATED TIME'])}
            {activeTab === 'Vendor Trunk' && renderTable(['TRUNK ID', 'TRUNK NAME', 'USERNAME', 'PRODUCT', 'SUPPLIER CATEGORY', 'TRANSLATION RULE GROUP', 'PROTOCOL', 'TPS', 'STATUS', 'UPDATED BY'], ['View', 'Edit', 'Clone', 'Delete', 'Rate History'])}
            {activeTab === 'Customer Trunk' && renderTable(['TRUNK ID', 'TRUNK NAME', 'USERNAME', 'PRODUCT', 'PRODUCT ASSIGN', 'TRANSLATION RULE GROUP', 'PROTOCOL', 'TPS', 'STATUS', 'UPDATED BY'], ['Edit', 'Clone', 'View', 'Send Rate', 'Send Tech Info', 'Delete History', 'Clear'])}
            
            {(activeTab === 'General Info' || activeTab === 'Billing') && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {currentSections.map((section: any, idx: number) => (
                  <div key={idx} className={cn("bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-sm animate-in fade-in slide-in-from-top-2 duration-500", section.isFullWidth && "xl:col-span-2")}>
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-[#f8f9fa] dark:bg-zinc-800/30 flex justify-between items-center">
                      <h3 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">{section.title}</h3>
                      <div className="flex gap-2">
                        {section.hasEdit && (
                          <button className="px-2 py-1 bg-[#428bca] text-white text-[10px] font-bold rounded-sm flex items-center gap-1 hover:bg-blue-600 shadow transition-all">
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                        )}
                        {activeTab === 'General Info' && idx === 0 && (
                           <>
                            <button onClick={() => setShowAddForm(true)} className="px-3 py-1 bg-[#428bca] text-white text-[10px] font-bold rounded-sm hover:bg-blue-600 shadow transition-all flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Add
                            </button>
                            <button className="px-3 py-1 bg-[#5cb85c] text-white text-[10px] font-bold rounded-sm hover:bg-green-600 shadow transition-all flex items-center gap-1">
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                           </>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      {section.fields ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                          {section.fields.map((field: any, fIdx: number) => (
                            <div key={fIdx} className="flex flex-col gap-1 border-b border-zinc-50 dark:border-zinc-800/50 pb-2 hover:bg-zinc-50/50 dark:hover:bg-white/5 transition-colors group">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight group-hover:text-zinc-500 transition-colors">{field.label}</span>
                              <span className={cn(
                                "text-[12px] font-bold text-zinc-800 dark:text-zinc-100",
                                field.type === 'status' && "text-emerald-600"
                              )}>
                                {field.value || '-'}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : section.contacts ? (
                        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                          {section.contacts.map((contact: any, cIdx: number) => (
                            <div key={cIdx} className="py-6 first:pt-0 last:pb-0">
                               <h5 className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 mb-4">{contact.type}</h5>
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Name</span>
                                    <div className="h-9 w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-sm"></div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Phone</span>
                                    <div className="h-9 w-full bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-sm flex items-center px-3 text-zinc-300 underline decoration-dotted"><Phone className="w-3 h-3 mr-2" /> (empty)</div>
                                  </div>
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">Email</span>
                                    <div className="h-auto min-h-[36px] w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-sm text-[11px] text-[#428bca] font-medium break-all flex items-center justify-between group cursor-pointer hover:border-brand-500 transition-all">
                                      {contact.email}
                                      <Mail className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                               </div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
