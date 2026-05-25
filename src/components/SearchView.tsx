import React from 'react';
import { Search, RotateCcw, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { DataTableView } from './DataTableView';

interface SearchViewProps {
  title: string;
  theme: 'light' | 'dark';
}

export function SearchView({ title, theme }: SearchViewProps) {
  const [showResults, setShowResults] = React.useState(false);

  let fields = [
    { label: 'Enterprise', type: 'select', options: ['All', 'ABC', 'TeleOSS'] },
    { label: 'Trunk', type: 'select', options: ['All', 'Trunk 1', 'Trunk 2'] },
    { label: 'From Date', type: 'date' },
    { label: 'To Date', type: 'date' },
    { label: 'Status', type: 'select', options: ['All', 'Success', 'Failed'] },
  ];

  if (title === 'SOA') {
    fields = [
      { label: 'Enterprise', type: 'select', options: ['Select', 'ABC', 'TeleOSS'] },
      { label: 'Invoice Type', type: 'select', options: ['All', 'Auto', 'Manual'] },
      { label: 'From Date', type: 'date' },
      { label: 'To Date', type: 'date' },
    ];
  }

  if (title === 'Charges Calculator') {
    fields = [
      { label: 'Enterprise', type: 'select', options: ['Select All', 'ABC', 'TeleOSS'] },
      { label: 'Period From', type: 'date' },
      { label: 'Period To', type: 'date' },
    ];
  }

  if (title === 'Master Report') {
    fields = [
      { label: 'Report By', type: 'select', options: ['None', 'Date', 'Day', 'Month', 'Year', 'Enterprise', 'Customer Trunk', 'Vendor Enterprise', 'Vendor Trunk', 'MCCMNC', 'Destination'] },
      { label: 'Timezone', type: 'select', options: ['(GMT) UTC', '(GMT+05:30) Mumbai, Kolkata'] },
      { label: 'Enterprise Type', type: 'radio', options: ['Customer', 'Vendor'] },
      { label: 'Enterprise', type: 'multiselect', options: ['ABC (38)', 'Abc1 (72)', 'abcd (70)'] },
      { label: 'Trunk', type: 'multiselect', options: ['Aakash_DIR_IN (2)', 'Aakash_DIR_out (60)'] },
      { label: 'MCCMNC', type: 'multiselect', options: ['202 - Greece, All Networks', '202001 - Greece, Cosmote'] },
      { label: 'Account Manager', type: 'multiselect', options: ['a b (47)', 'A demo A demo (143)'] },
      { label: 'Type', type: 'select', options: ['Select', 'SMS', 'Voice'] },
    ];
  }

  if (title === 'Customize') {
    fields = [
      { label: 'Timezone', type: 'select', options: ['(GMT) UTC', '(GMT+05:30) Mumbai, Kolkata'] },
      { label: 'From Date', type: 'datetime-local' },
      { label: 'To Date', type: 'datetime-local' },
      { label: 'Level 1', type: 'select', options: ['Date', 'Day', 'Month'] },
      { label: 'Level 2', type: 'select', options: ['Select', 'Enterprise', 'Trunk'] },
      { label: 'Level 3', type: 'select', options: ['Select', 'Enterprise', 'Trunk'] },
      { label: 'Type', type: 'select', options: ['Select', 'SMS', 'Voice'] },
      { label: 'Customer', type: 'select', options: ['Select', 'ABC', 'XYZ'] },
      { label: 'Trunk', type: 'select', options: ['Select', 'Trunk A', 'Trunk B'] },
      { label: 'Destination', type: 'text' },
      { label: 'Vendor', type: 'select', options: ['Select', 'ABC', 'XYZ'] },
      { label: 'Vendor Trunk', type: 'select', options: ['Select', 'Trunk A', 'Trunk B'] },
      { label: 'Vendor Destination', type: 'text' },
      { label: 'Customer IP', type: 'text' },
      { label: 'Vendor IP', type: 'text' },
    ];
  }

  if (title === 'Negative Margin Report') {
    fields = [
      { label: 'Timezone', type: 'select', options: ['(GMT) UTC', '(GMT+05:30) Mumbai, Kolkata'] },
      { label: 'From Date', type: 'datetime-local' },
      { label: 'To Date', type: 'datetime-local' },
      { label: 'Type', type: 'select', options: ['Select', 'SMS', 'Voice'] },
      { label: 'Customer', type: 'select', options: ['Select', 'ABC', 'XYZ'] },
      { label: 'Trunk', type: 'select', options: ['Select', 'Trunk A', 'Trunk B'] },
      { label: 'Destination', type: 'text' },
      { label: 'Vendor', type: 'select', options: ['Select', 'ABC', 'XYZ'] },
      { label: 'Vendor Trunk', type: 'select', options: ['Select', 'Trunk A', 'Trunk B'] },
      { label: 'Vendor Destination', type: 'text' },
    ];
  }

  if (title === 'Bilateral Report') {
    fields = [
      { label: 'Timezone', type: 'select', options: ['(GMT) UTC', '(GMT+05:30) Mumbai, Kolkata'] },
      { label: 'From Date', type: 'datetime-local' },
      { label: 'To Date', type: 'datetime-local' },
      { label: 'Enterprise', type: 'select', options: ['Select', 'ABC', 'XYZ'] },
      { label: 'Type', type: 'select', options: ['Select', 'SMS', 'Voice'] },
    ];
  }

  if (title === 'Analytics Report') {
    fields = [
      { label: 'Period', type: 'select', options: ['Minute', 'Hour', 'Day', 'Month'] },
      { label: 'From Hour', type: 'select', options: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) },
      { label: 'To Hour', type: 'select', options: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')) },
    ];
  }

  if (title === 'Usage Enterprise') {
    fields = [
      { label: 'Timezone', type: 'select', options: ['(GMT) UTC', '(GMT+05:30) Mumbai, Kolkata'] },
      { label: 'From Date', type: 'datetime-local' },
      { label: 'To Date', type: 'datetime-local' },
      { label: 'Enterprise', type: 'select', options: ['Select All', 'ABC', 'TeleOSS'] },
    ];
  }

  if (title === 'DLR Search') {
    fields = [
      { label: 'From Date', type: 'datetime-local' },
      { label: 'To Date', type: 'datetime-local' },
      { label: 'Sender ID', type: 'text' },
      { label: 'DNID', type: 'text' },
      { label: 'DLR Template', type: 'select', options: ['Select', 'Default', 'Detailed'] },
      { label: 'Customer Msg ID', type: 'text' },
      { label: 'Vendor Msg ID', type: 'text' },
      { label: 'Customer Enterprise', type: 'select', options: ['All', 'ABC', 'TeleOSS'] },
      { label: 'Customer Trunk', type: 'select', options: ['All', 'Trunk 1', 'Trunk 2'] },
      { label: 'Customer MCCMNC', type: 'select', options: ['All', '20201 - Greece', '40445 - India'] },
      { label: 'Vendor Enterprise', type: 'select', options: ['All', 'ABC', 'TeleOSS'] },
      { label: 'Vendor Trunk', type: 'select', options: ['All', 'Trunk 1', 'Trunk 2'] },
      { label: 'Vendor MCCMNC', type: 'select', options: ['All', '20201 - Greece', '40445 - India'] },
      { label: 'Cause Code', type: 'text' },
      { label: 'Message Status', type: 'select', options: ['All', 'DELIVRD', 'EXPIRED', 'DELETED'] },
      { label: 'Type', type: 'select', options: ['All', 'SMS', 'Voice'] },
    ];
  }

  if (title === 'Failed DLR Search') {
    fields = [
      { label: 'From Date', type: 'datetime-local' },
      { label: 'To Date', type: 'datetime-local' },
      { label: 'Customer IP', type: 'text' },
      { label: 'Customer Msg ID', type: 'text' },
      { label: 'Error Code', type: 'text' },
      { label: 'Customer Enterprise', type: 'select', options: ['All', 'ABC', 'TeleOSS'] },
      { label: 'Customer Trunk', type: 'select', options: ['All', 'Trunk 1', 'Trunk 2'] },
    ];
  }

  if (title === 'Route Simulator') {
    fields = [
      { label: 'Customer Trunk ID', type: 'select', options: ['Select', 'Trunk 1', 'Trunk 2'] },
      { label: 'Sender ID', type: 'text' },
      { label: 'Receiver ID', type: 'text' },
      { label: 'MCCMNC', type: 'text' },
      { label: 'Source TON', type: 'select', options: ['unknown(0)', 'international(1)', 'national(2)'] },
      { label: 'Source NPI', type: 'select', options: ['unknown(0)', 'ISDN(1)'] },
      { label: 'Dest TON', type: 'select', options: ['unknown(0)', 'international(1)', 'national(2)'] },
      { label: 'Dest NPI', type: 'select', options: ['unknown(0)', 'ISDN(1)'] },
      { label: 'Service Type Routing', type: 'select', options: ['Select', 'Type A', 'Type B'] },
      { label: 'PEID (DLT)', type: 'text' },
      { label: 'Template ID (DLT)', type: 'text' },
      { label: 'Message Text', type: 'text' },
    ];
  }

  if (title === 'Business Analysis') {
    fields = [
      { label: 'Business Analysis For', type: 'select', options: ['Customer', 'Vendor'] },
      { label: 'MCCMNC', type: 'text' },
      { label: 'Enterprise', type: 'select', options: ['All', 'ABC', 'TeleOSS'] },
    ];
  }

  return (
    <div className="flex-1 overflow-auto p-4 bg-zinc-50 dark:bg-black/20 custom-scrollbar">
      <div className="mb-4">
        <h2 className="text-sm font-bold uppercase text-zinc-500">{title}</h2>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
        <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase text-zinc-500">GENERAL INFORMATION</h3>
          <button className="text-[9px] font-black uppercase text-brand-500 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fields.map((field, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">{field.label}</label>
                {field.type === 'select' ? (
                  <select className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] outline-none transition-colors">
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'multiselect' ? (
                  <div className="w-full h-32 overflow-auto bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded p-2 text-[11px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-2 p-1 border-b border-zinc-200 dark:border-zinc-700">
                        <input type="text" placeholder="Search..." className="flex-1 bg-transparent border-none outline-none text-[10px]" />
                      </div>
                      <div className="flex gap-2 mb-2">
                        <button className="text-[9px] bg-[#428bca] text-white px-2 py-0.5 rounded">Check All</button>
                        <button className="text-[9px] bg-[#428bca] text-white px-2 py-0.5 rounded">Uncheck All</button>
                      </div>
                      {field.options?.map(opt => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 p-1 rounded">
                          <input type="checkbox" className="w-3 h-3" />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : field.type === 'radio' ? (
                  <div className="flex items-center gap-4 py-2">
                    {field.options?.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer text-[11px]">
                        <input type="radio" name={field.label} className="w-3.5 h-3.5" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <input 
                    type={field.type} 
                    className="w-full px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] outline-none transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center">
            {title === 'Route Simulator' && (
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">Coding</span>
                  <span className="text-xs font-bold text-[#428bca]">GSM7</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">SMS per message</span>
                  <span className="text-xs font-bold text-[#428bca]">0 SMS</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase">Message size</span>
                  <span className="text-xs font-bold text-[#428bca]">0 chars (0 bits)</span>
                </div>
              </div>
            )}
            <div className="flex-1" />
            <div className="flex gap-2">
              {['Master Report', 'Customize', 'Negative Margin Report'].includes(title) && (
                <button className="px-4 py-1.5 bg-[#428bca] text-white text-[10px] font-bold rounded hover:bg-blue-600 transition-colors uppercase">
                  Column Selection
                </button>
              )}
              {title === 'Analytics Report' && (
                <>
                  <button onClick={() => setShowResults(true)} className="px-4 py-1.5 bg-[#428bca] text-white text-[10px] font-bold rounded hover:bg-blue-600 transition-colors uppercase">Search</button>
                  <button onClick={() => setShowResults(true)} className="px-4 py-1.5 bg-[#428bca] text-white text-[10px] font-bold rounded hover:bg-blue-600 transition-colors flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                  <button className="px-4 py-1.5 bg-[#428bca] text-white text-[10px] font-bold rounded hover:bg-blue-600 transition-colors uppercase">Export Top</button>
                  <button className="px-4 py-1.5 bg-[#428bca] text-white text-[10px] font-bold rounded hover:bg-blue-600 transition-colors uppercase">Export Bottom</button>
                </>
              )}
              {title !== 'Analytics Report' && (
                <button 
                  onClick={() => setShowResults(true)}
                  className="px-6 py-1.5 bg-[#428bca] text-white text-[11px] font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-600 shadow-sm transition-colors uppercase tracking-widest"
                >
                  {['Master Report', 'Customize', 'Negative Margin Report', 'Bilateral Report', 'Route Simulator'].includes(title) ? 'Go' : (
                    <>
                      <Search className="w-3.5 h-3.5" /> Search
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showResults ? (
        <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
           {/* In dynamic app, we'd pass columns, but we can reuse DataTableView if we define columns for these search views too */}
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
             <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 flex justify-between items-center">
               <h3 className="text-[10px] font-black uppercase text-zinc-500">Search Results</h3>
               <button onClick={() => setShowResults(false)} className="text-[10px] font-bold text-[#428bca] hover:underline uppercase">Back to Search</button>
             </div>
             <div className="p-0">
               {/* 
                  Since SearchView can't easily access tableConfig from SectionView (prop drilling or lifting state needed),
                  we can define local defaults or just use the title for mock data.
               */}
               <DataTableView title={title} columns={[]} theme={theme} />
             </div>
           </div>
        </div>
      ) : (
        <>
          {title === 'Customize' && (
            <div className="mt-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                <h3 className="text-[10px] font-black uppercase text-zinc-500">SEARCH INFORMATION</h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                 {/* Complex information grids can be added here if needed, but summary is enough */}
              </div>
            </div>
          )}

          <div className="mt-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded transition-colors overflow-hidden">
            <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <h3 className="text-[10px] font-black uppercase text-zinc-500">Report Results</h3>
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Search className="w-8 h-8 opacity-20" />
              <p className="text-[11px] font-bold uppercase tracking-widest">No data to display. Please search above.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
