import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Check, ChevronDown, ChevronRight, Calculator, 
  Settings2, Globe, Database, HelpCircle, Save, 
  Layers, Edit2, Zap, ListFilter, TrendingUp, Eye, Search, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SMSProductMateFormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

const REGIONS = {
  'Europe': ['UK', 'Germany', 'France', 'Italy', 'Spain'],
  'USA': ['USA North', 'USA South', 'USA East', 'USA West'],
  'Africa': ['Nigeria', 'Egypt', 'South Africa', 'Kenya', 'Morocco'],
  'Asia': ['India', 'Pakistan', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Indonesia', 'Thailand']
};

// Stable MCCMNC map to prevent codes from changing on re-render
const STABLE_MCCMNC: Record<string, string[]> = {
  'India': ['404-01', '404-10', '404-20', '405-025', '405-800'],
  'Pakistan': ['410-01', '410-02', '410-03', '410-04'],
  'Nepal': ['429-01', '429-02'],
  'UK': ['234-10', '234-15', '234-20', '234-30', '234-33'],
  'Germany': ['262-01', '262-02', '262-03'],
  'France': ['208-01', '208-10', '208-20'],
  'Italy': ['222-01', '222-10', '222-88'],
  'Spain': ['214-01', '214-03', '214-07'],
  'USA North': ['310-001', '310-002', '310-003'],
  'USA South': ['310-410', '310-150', '311-480'],
  'USA East': ['310-260', '310-200'],
  'USA West': ['311-180', '310-030'],
  'Nigeria': ['621-20', '621-30', '621-50'],
  'Egypt': ['602-01', '602-02'],
  'South Africa': ['655-01', '655-07', '655-10'],
  'Kenya': ['639-02', '639-03'],
  'Morocco': ['604-01', '604-00'],
  'Bangladesh': ['470-01', '470-03'],
  'Sri Lanka': ['413-01', '413-02'],
  'Indonesia': ['510-01', '510-10', '510-11'],
  'Thailand': ['520-01', '520-03']
};

const getMCCMNCForCountry = (country: string) => {
  return STABLE_MCCMNC[country] || [`${999}-01`, `${999}-02` ];
};

const SUPPLIER_DATA = [
  { id: 's1', name: 'Alpha Telecom', accounts: [
    { name: 'Alpha_Direct', category: 'Direct', rate: 0.0012 },
    { name: 'Alpha_Wholesale', category: 'Wholesale', rate: 0.0010 },
    { name: 'Alpha_Premium', category: 'Premium', rate: 0.0018 }
  ]},
  { id: 's2', name: 'Global Hub', accounts: [
    { name: 'GH_Direct', category: 'Direct', rate: 0.0015 },
    { name: 'GH_Standard', category: 'Wholesale', rate: 0.0013 }
  ]},
  { id: 's3', name: 'TeleOSS', accounts: [
    { name: 'TOSS_Wholesale', category: 'Wholesale', rate: 0.0011 },
    { name: 'TOSS_Premium', category: 'Premium', rate: 0.0016 }
  ]},
  { id: 's4', name: 'Nexmo', accounts: [
    { name: 'NXM_Direct', category: 'Direct', rate: 0.0018 },
    { name: 'NXM_Wholesale', category: 'Wholesale', rate: 0.0016 }
  ]}
];

const ALL_ACCOUNTS = SUPPLIER_DATA.flatMap(s => s.accounts.map(a => ({ ...a, supplierId: s.id, supplierName: s.name })));

const SUPPLIERS = ALL_ACCOUNTS.map((a, i) => ({
  id: `s${i}`,
  name: a.supplierName,
  account: a.name,
  rate: a.rate,
  quality: a.category === 'Premium' ? 'Premium' : 'High',
  category: a.category
}));

const MOCK_RATE_TABLES = [
  { id: 'rt1', name: 'Standard_Global_Rates_2026', currency: 'USD', lastUpdated: '2026-05-01', category: 'Wholesale' },
  { id: 'rt2', name: 'Premium_Direct_Asia_Plan', currency: 'USD', lastUpdated: '2026-04-15', category: 'Direct' },
  { id: 'rt3', name: 'Eco_Wholesale_Europe_V2', currency: 'EUR', lastUpdated: '2026-05-10', category: 'Wholesale' },
  { id: 'rt4', name: 'Africa_Regional_Bilateral', currency: 'USD', lastUpdated: '2026-05-12', category: 'Premium' },
];

const MOCK_RATE_TABLE_DATA: Record<string, any[]> = {
  'rt1': [
    { country: 'United States', mccmnc: '310-410', rate: 0.0055 },
    { country: 'United Kingdom', mccmnc: '234-10', rate: 0.0070 },
    { country: 'India', mccmnc: '404-01', rate: 0.0125 },
  ],
  'rt2': [
    { country: 'India', mccmnc: '404-01', rate: 0.0150 },
    { country: 'Indonesia', mccmnc: '510-01', rate: 0.0095 },
    { country: 'Thailand', mccmnc: '520-01', rate: 0.0088 },
  ],
  'rt3': [
    { country: 'Germany', mccmnc: '262-01', rate: 0.0090 },
    { country: 'France', mccmnc: '208-01', rate: 0.0082 },
    { country: 'Italy', mccmnc: '222-01', rate: 0.0095 },
  ],
  'rt4': [
    { country: 'Nigeria', mccmnc: '621-20', rate: 0.0110 },
    { country: 'Egypt', mccmnc: '602-01', rate: 0.0098 },
    { country: 'South Africa', mccmnc: '655-01', rate: 0.0105 },
  ]
};

interface CountryRow {
  country: string;
  mccmnc: string;
  supplierAccount: string;
  buyingPrice: number;
  salesPrice: number;
  failover1: string;
  failover2: string;
  priceBuying1: number;
  priceBuying2: number;
  isManualSalesPrice?: boolean;
  rateTableName?: string;
}

// --- Sub-components for Cleaner Structure ---
interface SavedRule {
  id: string;
  type: string;
  tab: string;
  description: string;
  details: any;
}

function RuleDetails({ rule }: { rule: SavedRule }) {
  const d = rule.details;
  if (rule.tab === 'Basic') {
    return (
      <div className="space-y-1 mt-1">
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[9px] font-black uppercase text-zinc-400">Settings:</span>
          <span className="text-[10px] font-bold text-zinc-500">{d.category} | {d.currency}</span>
        </div>
        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800/50">
           <span className="text-[9px] font-black uppercase text-zinc-400">Pricing:</span>
           <span className="text-[10px] font-bold text-brand-500">{d.salesMode} ({d.marginValue}{d.salesMode.includes('%') ? '%' : d.currency})</span>
        </div>
        <div className="flex items-center justify-between gap-1.5">
           <span className="text-[9px] font-black uppercase text-zinc-400">Coverage:</span>
           <span className="text-[10px] font-bold text-zinc-500">{d.countriesCount} countries</span>
        </div>
      </div>
    );
  }
  if (rule.tab === 'SUPPLIERS/SERVICES NAME') {
    return (
      <div className="space-y-1 mt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black uppercase text-zinc-400">Condition:</span>
          <span className="text-[10px] font-bold text-zinc-500">{d.supplierCondition}</span>
        </div>
        <div className="flex items-start gap-1.5">
          <span className="text-[9px] font-black uppercase text-zinc-400 mt-0.5">Categories:</span>
          <div className="flex flex-wrap gap-1">
            {d.selectedCategories?.map((c: string) => (
              <span key={c} className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex items-start gap-1.5">
          <span className="text-[9px] font-black uppercase text-zinc-400 mt-0.5">Accounts:</span>
          <span className="text-[10px] font-bold text-zinc-500 line-clamp-2">{d.selectedAccounts?.join(', ')}</span>
        </div>
      </div>
    );
  }
  if (rule.tab === 'CLIENT ATTRIBUTE') {
    return (
      <div className="mt-1 flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-zinc-500">{d.clientAttr}</span>
        <span className="text-[9px] font-black uppercase text-zinc-400">{d.clientCond}</span>
        <span className="text-[10px] font-black text-brand-500">{d.clientVal}</span>
      </div>
    );
  }
  if (rule.tab === 'SMS ATTRIBUTES') {
    return (
      <div className="mt-1 space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-zinc-500">{d.smsAttr}</span>
          <span className="text-[9px] font-black uppercase text-zinc-400">{d.smsCond}</span>
        </div>
        <p className="text-[10px] font-bold text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 line-clamp-2">
          {d.smsInput}
        </p>
      </div>
    );
  }
  if (rule.tab === 'TIME ATTRIBUTES') {
    return (
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[10px] font-bold text-zinc-500">{d.timeAttr}</span>
        <span className="text-[9px] font-black uppercase text-brand-500 bg-brand-500/5 px-2 py-0.5 rounded-full">{d.timeCond}</span>
        <span className="text-[10px] font-bold text-zinc-400">{d.timeFrom} - {d.timeTo}</span>
      </div>
    );
  }
  return null;
}

function SelectionSummaryMatrix({ 
  checkedCountries, 
  selectedMCCMNCs, 
  category, 
  assignedCountries 
}: { 
  checkedCountries: string[], 
  selectedMCCMNCs: Record<string, string[]>, 
  category: string,
  assignedCountries: CountryRow[]
}) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/20 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8 space-y-6 animate-in fade-in duration-700">
       <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-brand-500/10 rounded-xl flex items-center justify-center">
                <Globe className="w-4 h-4 text-brand-500" />
             </div>
             <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Product Genome Snapshot</h4>
                <p className="text-[9px] font-bold text-zinc-400 uppercase">Live configuration matrix</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Nodes</p>
                <p className="text-sm font-black text-brand-500">{checkedCountries.length}</p>
             </div>
             <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />
             <div className="text-right">
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Category</p>
                <p className="text-sm font-black text-zinc-900 dark:text-white">{category}</p>
             </div>
          </div>
       </div>

       <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
             <thead className="bg-white/50 dark:bg-zinc-900/50 sticky top-0 z-10">
                <tr>
                   <th className="px-4 py-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Country</th>
                   <th className="px-4 py-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">MCCMNC Points</th>
                   <th className="px-4 py-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">Supplier Baseline</th>
                   <th className="px-4 py-2 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-right">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {checkedCountries.length > 0 ? (
                  checkedCountries.map(c => {
                    const codes = selectedMCCMNCs[c] || [];
                    const allCodes = getMCCMNCForCountry(c);
                    const countrySuppliers = SUPPLIERS.filter(s => s.category === category);
                    return (
                      <tr key={c} className="group hover:bg-white dark:hover:bg-zinc-900 transition-all">
                         <td className="px-4 py-3">
                            <div className="flex flex-col">
                               <span className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase">{c}</span>
                               <span className="text-[9px] font-bold text-zinc-400 italic">Target Category: {category}</span>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <div className="flex flex-col items-center gap-1">
                               <div className="flex gap-1 flex-wrap justify-center max-w-[150px]">
                                  {codes.slice(0, 5).map(code => (
                                    <span key={code} className="text-[8px] font-bold bg-brand-500/5 text-brand-500 px-1 rounded border border-brand-500/10">{code}</span>
                                  ))}
                                  {codes.length > 5 && <span className="text-[8px] font-bold text-zinc-400">+{codes.length - 5}</span>}
                               </div>
                               <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{codes.length} / {allCodes.length} CONNECTED</span>
                            </div>
                         </td>
                         <td className="px-4 py-3">
                            <div className="flex flex-col items-center gap-2">
                               <div className="flex justify-center -space-x-1.5">
                                  {countrySuppliers.slice(0, 4).map((s) => (
                                    <div 
                                      key={s.id} 
                                      title={`${s.name} (${s.account})`}
                                      className="w-10 h-10 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-help overflow-hidden"
                                    >
                                       <span className="text-[10px] font-black text-brand-500 leading-none">{s.name[0]}</span>
                                       <span className="text-[6px] font-bold text-zinc-400 truncate w-full text-center px-0.5">{s.account}</span>
                                    </div>
                                  ))}
                                  {countrySuppliers.length > 4 && (
                                    <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[8px] font-black text-zinc-400">
                                      +{countrySuppliers.length - 4}
                                    </div>
                                  )}
                               </div>
                               <span className="text-[8px] font-black uppercase text-zinc-400 tracking-tighter">{countrySuppliers.length} active terminals</span>
                            </div>
                         </td>
                         <td className="px-4 py-3 text-right">
                            <span className={cn(
                              "px-2 py-0.5 text-[8px] font-black uppercase rounded-lg",
                              codes.length > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500"
                            )}>
                              {codes.length > 0 ? 'Verified' : 'Pending'}
                            </span>
                         </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                     <td colSpan={4} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                           <Layers className="w-10 h-10" />
                           <p className="text-[10px] font-black uppercase tracking-widest italic">No configuration found in memory grid</p>
                        </div>
                     </td>
                  </tr>
                )}
             </tbody>
          </table>
       </div>
    </div>
  );
}

function FiltersTabContent({ setActiveTab, savedRules, onAddRule, onNext, onSave, checkedCountries, selectedMCCMNCs, category, assignedCountries }: { 
  setActiveTab: (t: string) => void; 
  savedRules: SavedRule[];
  onAddRule: (rule: Omit<SavedRule, 'id'>) => void;
  onNext: () => void;
  onSave: () => void;
  checkedCountries: string[];
  selectedMCCMNCs: Record<string, string[]>;
  category: string;
  assignedCountries: CountryRow[];
}) {
  const [innerTab, setInnerTab] = useState('SUPPLIERS/SERVICES NAME');
  
  // Suppliers/Services Name State
  const [supplierCondition, setSupplierCondition] = useState('Includes');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Direct', 'Wholesale']);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  // Client Attribute State
  const [clientAttr, setClientAttr] = useState('Client');
  const [clientCond, setClientCond] = useState('Equals');
  const [clientVal, setClientVal] = useState('Select Value');

  // SMS Attributes State
  const [smsAttr, setSmsAttr] = useState('Source SenderId');
  const [smsCond, setSmsCond] = useState('Contains');
  const [smsInput, setSmsInput] = useState('');

  // Time Attributes State
  const [timeAttr, setTimeAttr] = useState('Queue Time');
  const [timeCond, setTimeCond] = useState('Time Range');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');

  const INNER_TABS = [
    'SUPPLIERS/SERVICES NAME', 
    'CLIENT ATTRIBUTE', 
    'SMS ATTRIBUTES', 
    'TIME ATTRIBUTES'
  ];

  const filteredSuppliers = useMemo(() => {
    return SUPPLIER_DATA.map(s => ({
      ...s,
      accounts: s.accounts.filter(a => selectedCategories.includes(a.category))
    })).filter(s => s.accounts.length > 0);
  }, [selectedCategories]);

  const handleAddRule = () => {
    let description = '';
    let details = {};

    if (innerTab === 'SUPPLIERS/SERVICES NAME') {
      description = `${supplierCondition}: ${selectedAccounts.length} accounts`;
      details = { supplierCondition, selectedCategories, selectedAccounts };
    } else if (innerTab === 'CLIENT ATTRIBUTE') {
      description = `${clientAttr} ${clientCond} ${clientVal}`;
      details = { clientAttr, clientCond, clientVal };
    } else if (innerTab === 'SMS ATTRIBUTES') {
      description = `${smsAttr} ${smsCond} [${smsInput}]`;
      details = { smsAttr, smsCond, smsInput };
    } else if (innerTab === 'TIME ATTRIBUTES') {
      description = `${timeAttr} ${timeCond} ${timeFrom} to ${timeTo}`;
      details = { timeAttr, timeCond, timeFrom, timeTo };
    }

    onAddRule({
      type: 'Logic Rule',
      tab: innerTab,
      description,
      details
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-12">
      <div className="flex items-center gap-1 border-b border-zinc-100 dark:border-zinc-800 overflow-x-auto no-scrollbar">
        {INNER_TABS.map(tab => (
          <button 
            key={tab}
            onClick={() => setInnerTab(tab)}
            className={cn(
              "px-4 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative",
              innerTab === tab ? "text-brand-500" : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            {tab}
            {innerTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 space-y-8 min-h-[450px] shadow-sm relative">
        {innerTab === 'SUPPLIERS/SERVICES NAME' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Supplier Condition</label>
                  <select 
                    value={supplierCondition}
                    onChange={(e) => setSupplierCondition(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all appearance-none cursor-pointer"
                  >
                    <option>Includes</option>
                    <option>Does not contain</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Select Supplier & Accounts <span className="text-red-500">*</span></label>
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-zinc-500">Categories</span>
                       <div className="flex gap-4">
                          {['Direct', 'Wholesale', 'Premium'].map(cat => (
                            <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                               <input 
                                 type="checkbox" 
                                 checked={selectedCategories.includes(cat)}
                                 onChange={(e) => {
                                   if (e.target.checked) setSelectedCategories(prev => [...prev, cat]);
                                   else setSelectedCategories(prev => prev.filter(c => c !== cat));
                                 }}
                                 className="w-3.5 h-3.5 accent-brand-500" 
                               />
                               <span className="text-[9px] font-black uppercase text-zinc-400 group-hover:text-zinc-600">{cat}</span>
                            </label>
                          ))}
                       </div>
                    </div>
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                      {filteredSuppliers.map(sup => {
                        const accNames = sup.accounts.map(a => a.name);
                        const isAllSelected = accNames.every(name => selectedAccounts.includes(name));
                        
                        return (
                          <div key={sup.id} className="space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-1">
                              <span className="text-[10px] font-black text-brand-500 uppercase tracking-tighter">{sup.name}</span>
                              <button 
                                onClick={() => {
                                  if (isAllSelected) setSelectedAccounts(prev => prev.filter(n => !accNames.includes(n)));
                                  else setSelectedAccounts(prev => Array.from(new Set([...prev, ...accNames])));
                                }}
                                className="text-[8px] font-black uppercase text-zinc-400 hover:text-brand-500 transition-colors"
                              >
                                {isAllSelected ? 'Deselect All' : 'Select All'}
                              </button>
                            </div>
                            <div className="space-y-2 pl-2">
                               {sup.accounts.map(acc => (
                                 <label key={acc.name} className="flex items-center gap-3 cursor-pointer group">
                                   <input 
                                     type="checkbox" 
                                     checked={selectedAccounts.includes(acc.name)}
                                     onChange={(e) => {
                                       if (e.target.checked) setSelectedAccounts(prev => [...prev, acc.name]);
                                       else setSelectedAccounts(prev => prev.filter(n => n !== acc.name));
                                     }}
                                     className="w-4 h-4 accent-brand-500" 
                                   />
                                   <span className="text-xs font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-brand-500 transition-colors">{acc.name}</span>
                                 </label>
                               ))}
                            </div>
                          </div>
                        );
                      })}
                      {filteredSuppliers.length === 0 && (
                        <div className="col-span-full py-8 text-center text-[10px] font-bold text-zinc-400 italic">No suppliers found for selected categories</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl space-y-3">
                   <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Configuration Note</span>
                   </div>
                   <p className="text-[10px] font-bold text-zinc-500 leading-relaxed italic">
                      Select individual accounts to apply independent routing rules. Category selection will auto-filter available suppliers above.
                   </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {innerTab === 'CLIENT ATTRIBUTE' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Criteria Attributes</label>
                <select 
                  value={clientAttr}
                  onChange={(e) => setClientAttr(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                >
                  <option>Client</option>
                  <option>User Id</option>
                  <option>Plan</option>
                  <option>Plan Name</option>
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Criteria Condition</label>
                <select 
                  value={clientCond}
                  onChange={(e) => setClientCond(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                >
                  <option>Equals</option>
                  <option>Includes</option>
                  <option>Does not contain</option>
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Select Value</label>
                <select 
                  value={clientVal}
                  onChange={(e) => setClientVal(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                >
                  <option>Select Value</option>
                  <option>Global User</option>
                  <option>Wholesale Client</option>
                  <option>Enterprise Client</option>
                </select>
             </div>
          </div>
        )}

        {innerTab === 'SMS ATTRIBUTES' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Criteria Attributes</label>
                  <select 
                    value={smsAttr}
                    onChange={(e) => setSmsAttr(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  >
                    <option>Source SenderId</option>
                    <option>Destination Mobile No.</option>
                    <option>SMS Content</option>
                    <option>Destination Country</option>
                    <option>Destination Operator</option>
                    <option>Prefix</option>
                    <option>MCC or MCCMNC</option>
                    <option>SMS Type</option>
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Criteria Condition</label>
                  <select 
                    value={smsCond}
                    onChange={(e) => setSmsCond(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                  >
                    <option>Contains</option>
                    <option>Equals</option>
                    <option>Starts with</option>
                    <option>Does not contain</option>
                  </select>
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Input Values</label>
               <textarea 
                 value={smsInput}
                 onChange={(e) => setSmsInput(e.target.value)}
                 className="w-full h-32 px-4 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-medium outline-none resize-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all" 
                 placeholder="Enter values separated by commas..." 
               />
               <p className="text-[9px] font-bold text-zinc-400 italic mt-1 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1 rounded w-fit">Note: Multiple values can be separated by Comma(,) or Semicolon(;).</p>
            </div>
          </div>
        )}

        {innerTab === 'TIME ATTRIBUTES' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Criteria Attributes</label>
                <select 
                  value={timeAttr}
                  onChange={(e) => setTimeAttr(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                >
                  <option>Queue Time</option>
                  <option>Routing Time</option>
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">Criteria Condition</label>
                <select 
                  value={timeCond}
                  onChange={(e) => setTimeCond(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
                >
                  <option>Time Range</option>
                  <option>Date Range</option>
                  <option>Restricted Days</option>
                </select>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">From Time</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={timeFrom}
                    onChange={(e) => setTimeFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all" 
                  />
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-1">To Time</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={timeTo}
                    onChange={(e) => setTimeTo(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all" 
                  />
                </div>
             </div>
          </div>
        )}

        <div className="absolute bottom-6 right-8">
           <button 
             onClick={handleAddRule}
             className="px-8 py-3 bg-brand-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-brand-500/20 hover:scale-[1.03] transition-all flex items-center gap-2"
           >
             <Zap className="w-3.5 h-3.5" />
             Add Logic Rule
           </button>
        </div>
      </div>

      {/* Saved Rules List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
           <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Added Rules & Criteria</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {savedRules.map(rule => (
             <div key={rule.id} className="bg-zinc-50/50 dark:bg-zinc-800/30 p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-3 group hover:border-brand-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-black uppercase tracking-widest text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded">{rule.tab}</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onAddRule(rule)} // This is just a placeholder logic, usually delete and re-add
                      className="p-1.5 text-zinc-300 hover:text-brand-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="p-1.5 text-zinc-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] font-black text-zinc-600 dark:text-zinc-300 leading-tight">{rule.description}</p>
                  <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/50">
                    <RuleDetails rule={rule} />
                  </div>
                </div>
             </div>
           ))}
           {savedRules.length === 0 && (
             <div className="col-span-full py-12 flex flex-col items-center justify-center text-zinc-400 gap-2 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem]">
                <Zap className="w-6 h-6 opacity-20" />
                <p className="text-[10px] font-bold italic uppercase tracking-tighter">No rules added yet...</p>
             </div>
           )}
        </div>
      </div>

      <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/20 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-inner">
        <button 
          onClick={() => setActiveTab('Basic')}
          className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back
        </button>
        <div className="flex gap-4">
           <button 
             onClick={onSave}
             className="px-10 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-zinc-300 transition-all shadow-sm"
           >
             Save
           </button>
           <button 
             onClick={onNext}
             className="px-12 py-3 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-brand-500/20 hover:scale-[1.03] transform transition-all"
           >
             Next
           </button>
        </div>
      </div>
    </div>
  );
}

const calculateSalesPriceForMode = (buyingPrice: number, mode: string, marginVal: string, currency: string) => {
  const val = parseFloat(marginVal) || 0;
  if (mode === '% Margin') {
    return buyingPrice * (1 + val / 100);
  } else if (mode === 'Fixed Margin') {
    return buyingPrice + val;
  }
  return buyingPrice;
};

export function SMSProductMateForm({ onClose, theme }: SMSProductMateFormProps) {
  // --- Tab Management ---
  const TABS = ['Basic', 'Filters', 'Important'];
  const [activeTab, setActiveTab] = useState('Basic');
  const [savedRules, setSavedRules] = useState<SavedRule[]>([]);
  const [showRulesSummary, setShowRulesSummary] = useState(false);

  const handleAddRule = (rule: Omit<SavedRule, 'id'>) => {
    const newRule = { ...rule, id: Math.random().toString(36).substr(2, 9) };
    setSavedRules(prev => [...prev, newRule]);
  };

  const handleSaveProduct = () => {
    // Collect all data for saving
    const productData = {
      name: productName,
      category,
      currency,
      countries: assignedCountries,
      logicRules: savedRules
    };
    console.log('Saving Product:', productData);
    // Notification logic would go here
    // If we had a backend, we would call an API here
  };

  const handleSaveBasicSettings = () => {
    if (!productName) {
       return;
    }
    const description = `${productName} (${category}) Configuration`;
    const details = {
      name: productName,
      category,
      currency,
      salesMode,
      marginValue,
      supplyMode,
      countriesCount: assignedCountries.length
    };
    
    // Replace existing Basic rule if any, or add new
    setSavedRules(prev => {
      const filtered = prev.filter(r => r.tab !== 'Basic');
      return [...filtered, {
        id: 'basic-config-' + Date.now(),
        type: 'Basic Configuration',
        tab: 'Basic',
        description,
        details
      }];
    });
  };

  // --- Header State ---
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Wholesale');
  const [currency, setCurrency] = useState('USD');

  // --- Region/Country/MCCMNC State ---
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [checkedCountries, setCheckedCountries] = useState<string[]>([]);
  const [selectedMCCMNCs, setSelectedMCCMNCs] = useState<Record<string, string[]>>({});
  const [assignedCountries, setAssignedCountries] = useState<CountryRow[]>([]);
  const [mccmncEditCountry, setMccmncEditCountry] = useState<string | null>(null);

  // --- Configuration State ---
  const [supplyMode, setSupplyMode] = useState<'Auto LCR' | 'Manual' | 'Single Supplier'>('Auto LCR');
  const [salesMode, setSalesMode] = useState<'% Margin' | 'Fixed Margin' | 'Manual' | 'Customer Rate Table'>('% Margin');
  const [marginValue, setMarginValue] = useState<string>('5');
  const [selectedRateTable, setSelectedRateTable] = useState<string>('');
  const [selectedSingleSupplier, setSelectedSingleSupplier] = useState<string>('');
  const [showFailover, setShowFailover] = useState(true);
  const [showRateTablePreview, setShowRateTablePreview] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // --- List States ---
  const [showSupplierPopup, setShowSupplierPopup] = useState(false);
  const [activeSupplierInPopup, setActiveSupplierInPopup] = useState<string | null>(null);
  const [selectedSuppliersForTab, setSelectedSuppliersForTab] = useState<string[]>([]);
  const [assignedSupplierAccounts, setAssignedSupplierAccounts] = useState<string[]>([]);
  const [supplierPriceView, setSupplierPriceView] = useState<{ account: string, country: string, mccmnc: string } | null>(null);

  // --- LCR Insight State ---
  const [lcrDetailRow, setLcrDetailRow] = useState<CountryRow | null>(null);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Derived pagination data
  const totalPages = Math.ceil(assignedCountries.length / rowsPerPage);
  const paginatedRows = assignedCountries.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tableRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tableRef.current) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Slow/speed factor
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  // --- Standalone LCR Search State ---
  const [searchCountry, setSearchCountry] = useState('');
  const [searchMccmnc, setSearchMccmnc] = useState('');
  const [standaloneLcrVisible, setStandaloneLcrVisible] = useState(false);
  const [standaloneLcrData, setStandaloneLcrData] = useState<{country: string, mccmnc: string, buyers: any[]}>({ country: '', mccmnc: '', buyers: [] });

  const handleStandaloneLcrSearch = () => {
    if (!searchCountry || !searchMccmnc) return;
    const bestBuyers = getTopSuppliersForCombination(searchCountry, searchMccmnc).slice(0, 5);
    setStandaloneLcrData({
      country: searchCountry,
      mccmnc: searchMccmnc,
      buyers: bestBuyers
    });
    setStandaloneLcrVisible(true);
  };

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    const countriesInRegion = REGIONS[region as keyof typeof REGIONS] || [];
    
    // Auto-select all countries in the region by default
    setCheckedCountries(prev => {
      const otherRegionsCountries = prev.filter(c => !countriesInRegion.includes(c));
      const next = [...otherRegionsCountries, ...countriesInRegion];
      return next;
    });

    // Sync MCCMNCs
    setSelectedMCCMNCs(prev => {
      const next = { ...prev };
      countriesInRegion.forEach(c => {
         if (!next[c]) next[c] = getMCCMNCForCountry(c);
      });
      return next;
    });
  };

  // --- Helpers ---
  const getTopSuppliersForCombination = (country: string, mccmnc: string) => {
    // Deterministic shuffle based on country + mccmnc to simulate real LCR discovery
    const seed = `${country}-${mccmnc}-${category}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }
    
    // Filter by product category for LCR logic
    const filteredSuppliers = SUPPLIERS.filter(s => s.category === category);
    const source = filteredSuppliers.length > 0 ? filteredSuppliers : SUPPLIERS;

    return [...source].map(s => ({
      ...s,
      // Add a small deterministic variance to rates for simulation
      effectiveRate: s.rate + (Math.abs((hash * s.id.length) % 100) / 100000)
    })).sort((a, b) => a.effectiveRate - b.effectiveRate);
  };

  const handleSalesModeChange = (mode: '% Margin' | 'Fixed Margin' | 'Manual' | 'Customer Rate Table') => {
    setSalesMode(mode);
    if (mode === 'Customer Rate Table' && selectedRateTable) {
      applyRateTablePricing(selectedRateTable);
    } else {
      setAssignedCountries(prev => prev.map(row => ({
        ...row,
        salesPrice: mode === 'Manual' ? row.salesPrice : calculateSalesPriceForMode(row.buyingPrice, mode, marginValue, currency),
        isManualSalesPrice: mode === 'Manual',
        rateTableName: undefined
      })));
    }
  };

  const applyRateTablePricing = (tableId: string) => {
    const table = MOCK_RATE_TABLES.find(t => t.id === tableId);
    const tableData = MOCK_RATE_TABLE_DATA[tableId] || [];
    
    setAssignedCountries(prev => prev.map(row => {
      const rateEntry = tableData.find(d => d.country === row.country && d.mccmnc === row.mccmnc);
      return {
        ...row,
        salesPrice: rateEntry ? rateEntry.rate : row.salesPrice,
        rateTableName: table?.name
      };
    }));
  };

  const handleMarginChange = (val: string) => {
    setMarginValue(val);
    if (salesMode !== 'Manual') {
      setAssignedCountries(prev => prev.map(row => ({
        ...row,
        salesPrice: calculateSalesPriceForMode(row.buyingPrice, salesMode, val, currency),
      })));
    }
  };

  const calculateSalesPrice = (buyingPrice: number) => {
    return calculateSalesPriceForMode(buyingPrice, salesMode, marginValue, currency);
  };

  const handleSupplyModeChange = (mode: 'Auto LCR' | 'Manual' | 'Single Supplier') => {
    setSupplyMode(mode);
    if (mode === 'Auto LCR') {
      setAssignedCountries(prev => prev.map(row => {
        const top = getTopSuppliersForCombination(row.country, row.mccmnc);
        return {
          ...row,
          supplierAccount: top[0].account,
          failover1: top[1].account,
          failover2: top[2].account
        };
      }));
    } else if (mode === 'Single Supplier' && selectedSingleSupplier) {
      updateRowsForSingleSupplier(selectedSingleSupplier);
    }
  };

  const updateRowsForSingleSupplier = (supId: string) => {
    const sup = SUPPLIERS.find(s => s.id === supId);
    if (sup) {
      setAssignedCountries(prev => prev.map(row => ({
        ...row,
        supplierAccount: sup.account,
        buyingPrice: sup.rate,
        salesPrice: calculateSalesPrice(sup.rate),
        failover1: '-',
        failover2: '-'
      })));
    }
  };
  const handleAssignCountries = () => {
    const newRows: CountryRow[] = [];

    checkedCountries.forEach(country => {
      const selectedCodes = selectedMCCMNCs[country] || [];
      selectedCodes.forEach(mccmnc => {
        const top = getTopSuppliersForCombination(country, mccmnc);
        const primary = top[0];
        const f1 = top[1];
        const f2 = top[2];

        const buying = (primary as any).effectiveRate || primary.rate;
        const sales = calculateSalesPrice(buying);

        newRows.push({
          country,
          mccmnc,
          supplierAccount: supplyMode === 'Single Supplier' && selectedSingleSupplier 
            ? SUPPLIERS.find(s => s.id === selectedSingleSupplier)?.account || primary.account
            : primary.account,
          buyingPrice: buying,
          salesPrice: sales,
          failover1: f1.account,
          failover2: f2.account,
          priceBuying1: (f1 as any).effectiveRate || f1.rate,
          priceBuying2: (f2 as any).effectiveRate || f2.rate,
          isManualSalesPrice: salesMode === 'Manual'
        });
      });
    });

    setAssignedCountries(newRows);
    
    // Smooth scroll to results table
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className={cn(
      "w-full max-w-6xl mx-auto h-[90vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 font-sans",
      theme === 'dark' ? "dark" : ""
    )}>
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Create SMS Product</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">New Wholesale Traffic Routing Profile</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
          <X className="w-5 h-5 text-zinc-400" />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="px-6 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                  activeTab === tab 
                    ? "text-brand-500" 
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-500 rounded-full" 
                  />
                )}
              </button>
            ))}
          </div>
          
          <div className="hidden lg:flex items-center gap-3 ml-4">
             <button 
               onClick={() => setShowRulesSummary(true)}
               className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-800 text-[10px] font-black uppercase text-zinc-400 hover:bg-zinc-100 transition-colors"
             >
               <Settings2 className="w-3 h-3" />
               RULES ({savedRules.length})
             </button>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {activeTab === 'Basic' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-12">
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 shadow-sm border border-zinc-100 dark:border-zinc-800 space-y-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                      Product Identity <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                        <Layers className="w-5 h-5 text-white" />
                      </div>
                      <input 
                        type="text" 
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full pl-20 pr-8 py-6 bg-white dark:bg-zinc-800 border-2 border-brand-500/30 rounded-[2rem] text-sm font-black text-zinc-900 dark:text-white placeholder:text-zinc-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all uppercase tracking-widest"
                        placeholder="E.G. ALPHA_CONNECT_DIRECT_USA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Traffic Category</label>
                      <div className="relative group">
                        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-brand-500/30 transition-all cursor-pointer">
                          <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-700">
                            <Database className="w-6 h-6 text-brand-500/80" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[13px] font-black uppercase tracking-tight text-zinc-900 dark:text-white">{category || 'Select Category'}</h4>
                            <p className="text-[10px] font-bold text-zinc-400 italic">Standard bulk traffic rates</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-zinc-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <select 
                          value={category}
                          onChange={(e) => {
                            const newCat = e.target.value;
                            setCategory(newCat);
                            // Clear state on category change as requested - full restore
                            setCheckedCountries([]);
                            setSelectedMCCMNCs({});
                            setAssignedCountries([]);
                            setAssignedSupplierAccounts([]);
                            setSavedRules([]); // Clear rules too
                            setSelectedRegion(null);
                            setCurrentPage(1);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                          <option value="Direct">Direct</option>
                          <option value="Wholesale">Wholesale</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-zinc-400 tracking-widest">Settlement Currency</label>
                      <div className="relative group">
                        <div className="flex items-center gap-4 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 hover:border-brand-500/30 transition-all cursor-pointer">
                          <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm border border-zinc-100 dark:border-zinc-700">
                            <span className="text-xl font-black text-brand-500/80">{currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$'}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[13px] font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                              {currency === 'USD' ? 'US Dollar (USD)' : currency === 'EUR' ? 'Euro (EUR)' : 'Pound Sterling (GBP)'}
                            </h4>
                            <p className="text-[10px] font-bold text-zinc-400 italic">Global Settlement Standard</p>
                          </div>
                          <ChevronDown className="w-5 h-5 text-zinc-300 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <select 
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

        {/* Section 2: Country Selection System - ONLY in Important Tab */}
        {activeTab === 'Important' && (
          <>
            <div className="space-y-8 animate-in slide-in-from-top duration-500">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-zinc-50 dark:bg-zinc-800/10 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-inner">
              {/* Region Sidebar */}
              <div className="md:col-span-3 space-y-4">
                <div className="flex items-center gap-2 px-2 pb-2 border-b border-zinc-200 dark:border-zinc-700">
                  <Globe className="w-4 h-4 text-brand-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">Region</span>
                </div>
                <div className="space-y-1">
                  {Object.keys(REGIONS).map(region => (
                    <button 
                      key={region}
                      onClick={() => handleRegionSelect(region)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all",
                        selectedRegion === region 
                          ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                          : "text-zinc-500 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/30"
                      )}
                    >
                      {region}
                      <ChevronRight className={cn("w-3.5 h-3.5", selectedRegion === region ? "opacity-100" : "opacity-0")} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Countries */}
              <div className="md:col-span-6 space-y-4 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 relative">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detailed Countries</span>
                    <HelpCircle className="w-3 h-3 text-zinc-300" />
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (selectedRegion) {
                          const codes = REGIONS[selectedRegion as keyof typeof REGIONS] || [];
                          setCheckedCountries(prev => {
                            const next = Array.from(new Set([...prev, ...codes]));
                            // Sync MCCMNCs
                            setSelectedMCCMNCs(mNext => {
                              const updated = { ...mNext };
                              codes.forEach(c => {
                                if (!updated[c]) updated[c] = getMCCMNCForCountry(c);
                              });
                              return updated;
                            });
                            return next;
                          });
                        }
                      }}
                      className="text-[9px] font-black uppercase text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 px-2 py-0.5 rounded transition-colors"
                    >
                      Select All
                    </button>
                    <div className="w-px h-2.5 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
                    <button 
                      onClick={() => {
                        if (selectedRegion) {
                          const codes = REGIONS[selectedRegion as keyof typeof REGIONS] || [];
                          setCheckedCountries(prev => {
                            const next = prev.filter(c => !codes.includes(c));
                            // Sync MCCMNCs
                            setSelectedMCCMNCs(mNext => {
                              const updated = { ...mNext };
                              codes.forEach(c => delete updated[c]);
                              return updated;
                            });
                            return next;
                          });
                        }
                      }}
                      className="text-[9px] font-black uppercase text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2 py-0.5 rounded transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-44 overflow-y-auto no-scrollbar content-start">
                  {selectedRegion ? (
                    REGIONS[selectedRegion as keyof typeof REGIONS].map(country => {
                      const mccs = getMCCMNCForCountry(country);
                      const selectedCount = selectedMCCMNCs[country]?.length || 0;
                      const isChecked = checkedCountries.includes(country);
                      return (
                        <div key={country} className={cn(
                          "group relative flex items-center gap-3 p-2 rounded-xl transition-all border border-transparent",
                          isChecked 
                            ? "bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-100 dark:border-zinc-800" 
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        )}>
                          <label className="relative flex items-center cursor-pointer p-1 -m-1 z-10 shrink-0">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const val = e.target.checked;
                                setCheckedCountries(prev => {
                                   if (val) return [...prev, country];
                                   return prev.filter(c => c !== country);
                                });
                                // Sync MCCMNCs
                                setSelectedMCCMNCs(prev => {
                                   const next = { ...prev };
                                   if (val) next[country] = getMCCMNCForCountry(country);
                                   else delete next[country];
                                   return next;
                                });
                              }}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center transition-all peer-checked:bg-brand-500 peer-checked:border-brand-500">
                              <Check className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform" />
                            </div>
                          </label>
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0 cursor-pointer" onClick={() => {
                            if (!isChecked) {
                               setCheckedCountries(prev => [...prev, country]);
                            }
                            setMccmncEditCountry(country);
                          }}>
                            <span className={cn(
                              "text-xs font-bold truncate transition-colors",
                              isChecked ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 group-hover:text-zinc-500"
                            )}>{country}</span>
                            <span className={cn(
                              "text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 transition-colors",
                              isChecked 
                                ? (selectedCount === mccs.length ? "text-brand-500" : "text-amber-500") 
                                : "text-zinc-300"
                            )}>
                              {selectedCount}/{mccs.length} MCCMNC
                              <Edit2 className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2 opacity-50">
                      <Database className="w-8 h-8" />
                      <p className="text-[10px] font-black tracking-widest uppercase">Select a region first</p>
                    </div>
                  )}
                </div>

                {/* MCCMNC Selection Popup Overlay */}
                <AnimatePresence>
                   {mccmncEditCountry && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-20 bg-white dark:bg-zinc-900 rounded-2xl border border-brand-500/30 shadow-2xl flex flex-col p-4"
                     >
                        <div className="flex items-center justify-between mb-4">
                           <h5 className="text-[10px] font-black uppercase text-brand-500 tracking-widest flex items-center gap-2">
                             <ListFilter className="w-3.5 h-3.5" />
                             {mccmncEditCountry} MCCMNC Selection
                           </h5>
                           <button onClick={() => setMccmncEditCountry(null)} className="p-1 hover:bg-zinc-100 rounded">
                             <X className="w-4 h-4 text-zinc-400" />
                           </button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                           <div className="flex items-center gap-2 mb-2 p-1 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                             <button 
                               onClick={() => {
                                 const all = getMCCMNCForCountry(mccmncEditCountry);
                                 setSelectedMCCMNCs(prev => ({ ...prev, [mccmncEditCountry]: all }));
                               }}
                               className="flex-1 py-1.5 text-[9px] font-black text-brand-500 uppercase hover:bg-white dark:hover:bg-zinc-800 rounded transition-all border border-brand-500/10"
                             >
                               Select All
                             </button>
                             <button 
                               onClick={() => {
                                 setSelectedMCCMNCs(prev => ({ ...prev, [mccmncEditCountry]: [] }));
                               }}
                               className="flex-1 py-1.5 text-[9px] font-black text-zinc-400 uppercase hover:bg-white dark:hover:bg-zinc-800 rounded transition-all border border-zinc-200 dark:border-zinc-700"
                             >
                               Clear All
                             </button>
                           </div>
                           {getMCCMNCForCountry(mccmncEditCountry).map(code => (
                             <label key={code} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 cursor-pointer">
                                <input 
                                  type="checkbox"
                                  checked={(selectedMCCMNCs[mccmncEditCountry] || []).includes(code)}
                                  onChange={(e) => {
                                    const current = selectedMCCMNCs[mccmncEditCountry] || [];
                                    if (e.target.checked) setSelectedMCCMNCs(prev => ({ ...prev, [mccmncEditCountry]: [...current, code] }));
                                    else setSelectedMCCMNCs(prev => ({ ...prev, [mccmncEditCountry]: current.filter(c => c !== code) }));
                                  }}
                                  className="w-3.5 h-3.5 accent-brand-500"
                                />
                                <span className="text-xs font-bold text-zinc-600">{code}</span>
                             </label>
                           ))}
                        </div>
                        <button 
                          onClick={() => setMccmncEditCountry(null)}
                          className="mt-4 w-full py-2 bg-brand-500 text-white text-[10px] font-black uppercase rounded-xl"
                        >
                          Apply Codes
                        </button>
                     </motion.div>
                   )}
                </AnimatePresence>
              </div>

              {/* Action Center */}
              <div className="md:col-span-3 flex flex-col justify-center items-center gap-4">
                <button 
                  onClick={handleAssignCountries}
                  disabled={checkedCountries.length === 0}
                  className={cn(
                    "w-full py-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-xl",
                    checkedCountries.length > 0 
                      ? "bg-brand-500 text-white shadow-brand-500/20 hover:bg-brand-600" 
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-50"
                  )}
                >
                  <Zap className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Assign Countries</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 w-full justify-between">
                   <span className="text-[9px] font-black uppercase text-zinc-500 whitespace-nowrap">Failover Logic</span>
                   <button 
                     onClick={() => setShowFailover(!showFailover)}
                     className={cn(
                       "w-10 h-5 rounded-full transition-all relative",
                       showFailover ? "bg-brand-500" : "bg-zinc-300 dark:bg-zinc-700"
                     )}
                   >
                     <div className={cn(
                       "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
                       showFailover ? "right-0.5" : "left-0.5"
                     )} />
                   </button>
                </div>
              </div>
            </div>

            {/* Section 3: Pricing Rules & Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Supply Logic */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <Settings2 className="w-4 h-4 text-brand-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">For Supplies (Vendor)</span>
                </div>
                <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  {(['Auto LCR', 'Manual', 'Single Supplier'] as const).map(mode => (
                    <button 
                       key={mode}
                       onClick={() => handleSupplyModeChange(mode)}
                       className={cn(
                         "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                         supplyMode === mode 
                           ? "bg-white dark:bg-zinc-900 text-brand-500 shadow-sm" 
                           : "text-zinc-500 hover:text-zinc-700"
                       )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {supplyMode === 'Single Supplier' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-4 bg-zinc-50 dark:bg-zinc-800/20 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-2"
                    >
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Select Supplier Account</label>
                      <select 
                        value={selectedSingleSupplier}
                        onChange={(e) => {
                          setSelectedSingleSupplier(e.target.value);
                          updateRowsForSingleSupplier(e.target.value);
                        }}
                        className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none"
                      >
                        <option value="">Choose Supplier...</option>
                        {SUPPLIERS.filter(s => s.category === category).map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.account})</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                  {supplyMode === 'Auto LCR' && (
                    <motion.p 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[10px] font-bold text-zinc-400 italic px-4"
                    >
                      System will automatically pick the best price supplier and failovers for each country.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Sales Logic */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <Calculator className="w-4 h-4 text-brand-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">For Sales Price (Customer)</span>
                </div>
                <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                  {(['% Margin', 'Fixed Margin', 'Manual', 'Customer Rate Table'] as const).map(mode => (
                    <button 
                      key={mode}
                      onClick={() => handleSalesModeChange(mode)}
                      className={cn(
                        "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        salesMode === mode 
                          ? "bg-white dark:bg-zinc-900 text-brand-500 shadow-sm" 
                          : "text-zinc-500 hover:text-zinc-700"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <AnimatePresence mode="wait">
                  {salesMode !== 'Manual' && salesMode !== 'Customer Rate Table' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex gap-4 items-center bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                          {salesMode === '% Margin' ? 'Enter % Margin' : 'Enter Fixed Amount Margin'}
                        </label>
                        <div className="relative">
                          <input 
                            type="number"
                            value={marginValue}
                            onChange={(e) => handleMarginChange(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                            {salesMode === '% Margin' ? '%' : currency}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {salesMode === 'Customer Rate Table' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex gap-4 items-end bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="flex-1 space-y-2">
                        <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block">Select {category} Rate Table</label>
                        <select 
                          value={selectedRateTable}
                          onChange={(e) => {
                            setSelectedRateTable(e.target.value);
                            applyRateTablePricing(e.target.value);
                          }}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none ring-offset-white focus:ring-2 focus:ring-brand-500/20 transition-all"
                        >
                          <option value="">Choose Rate Table...</option>
                          {MOCK_RATE_TABLES.filter(rt => rt.category === category).map(rt => (
                            <option key={rt.id} value={rt.id}>{rt.name} ({rt.currency})</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => setShowRateTablePreview(true)}
                        disabled={!selectedRateTable}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors disabled:opacity-50"
                        title="Preview Rate Table"
                      >
                        <Eye className="w-4 h-4 text-brand-500" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Section 4: Result Table */}
            <div className="space-y-4 pt-4 relative">
              {/* Standalone LCR Search Bar */}
              <div className="flex flex-col sm:flex-row items-end gap-4 p-5 bg-brand-500/5 dark:bg-brand-500/10 rounded-[2rem] border border-brand-500/20 mb-6">
                 <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black uppercase text-brand-600 dark:text-brand-400 tracking-widest flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Quick LCR Country
                    </label>
                    <select 
                      value={searchCountry}
                      onChange={(e) => {
                        setSearchCountry(e.target.value);
                        const mccs = getMCCMNCForCountry(e.target.value);
                        setSearchMccmnc(mccs[0] || '');
                      }}
                      className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-brand-500/20 rounded-xl text-xs font-bold outline-none"
                    >
                      <option value="">Select Country...</option>
                      {Object.values(REGIONS).flat().sort().map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                 </div>
                 <div className="flex-1 space-y-2">
                    <label className="text-[9px] font-black uppercase text-brand-600 dark:text-brand-400 tracking-widest flex items-center gap-2">
                      <Database className="w-3 h-3" /> MCCMNC Code
                    </label>
                    <select 
                      value={searchMccmnc}
                      onChange={(e) => setSearchMccmnc(e.target.value)}
                      className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-brand-500/20 rounded-xl text-xs font-bold outline-none"
                    >
                      <option value="">Select Code...</option>
                      {searchCountry && getMCCMNCForCountry(searchCountry).map(cc => (
                        <option key={cc} value={cc}>{cc}</option>
                      ))}
                    </select>
                 </div>
                 <button 
                   onClick={handleStandaloneLcrSearch}
                   disabled={!searchCountry || !searchMccmnc}
                   className="h-9 px-8 bg-brand-500 text-white text-[10px] font-black uppercase rounded-xl shadow-lg shadow-brand-500/30 hover:bg-brand-600 disabled:opacity-30 disabled:cursor-not-allowed group transition-all"
                 >
                   <span className="flex items-center gap-2">
                     <TrendingUp className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                     LCR
                   </span>
                 </button>
              </div>

              {/* LCR Insight Table Result Integration */}
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Product Genome Matrix</h4>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Rows:</span>
                      <select 
                        value={rowsPerPage}
                        onChange={(e) => {
                          setRowsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-0.5 text-[9px] font-bold outline-none"
                      >
                        {[10, 20, 50, 100].map(val => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase italic">Showing {assignedCountries.length} nodes</span>
                 </div>
              </div>

              <div 
                className={cn(
                  "overflow-x-auto rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm relative custom-scrollbar select-none",
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
                ref={tableRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead className="bg-zinc-50 dark:bg-zinc-800">
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Countries</th>
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Category</th>
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">MCCMNC</th>
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Supplies Account</th>
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-[#428bca]">Buying Price</th>
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Sales Price</th>
                      <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                      {salesMode === 'Customer Rate Table' && (
                        <th className="px-3 py-2.5 text-[9px] font-black text-[#428bca] uppercase tracking-widest">Rate Table</th>
                      )}
                      {showFailover && (
                        <>
                          <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Failover 1</th>
                          <th className="px-3 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Failover 2</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                    {paginatedRows.length > 0 ? (
                      paginatedRows.map((row, pIdx) => {
                        const realIdx = (currentPage - 1) * rowsPerPage + pIdx;
                        return (
                          <tr key={`${row.country}-${row.mccmnc}`} className="hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group">
                            <td className="px-3 py-2 font-black text-zinc-900 dark:text-zinc-100 text-[11px] italic">{row.country}</td>
                            <td className="px-3 py-2">
                               <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[9px] font-black uppercase text-zinc-500 rounded-md border border-zinc-200 dark:border-zinc-700">
                                  {category}
                               </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-[10px] font-bold text-zinc-400">{row.mccmnc}</td>
                            <td className="px-3 py-2">
                              {supplyMode === 'Manual' ? (
                                <div className="flex items-center gap-2">
                                  <select 
                                    value={row.supplierAccount}
                                    onChange={(e) => {
                                      const sup = SUPPLIERS.find(s => s.account === e.target.value);
                                      setAssignedCountries(prev => {
                                        const next = [...prev];
                                        const realIdx = (currentPage - 1) * rowsPerPage + pIdx;
                                        next[realIdx] = { 
                                          ...next[realIdx], 
                                          supplierAccount: e.target.value,
                                          buyingPrice: sup?.rate || row.buyingPrice,
                                          salesPrice: salesMode === 'Manual' ? next[realIdx].salesPrice : calculateSalesPrice(sup?.rate || row.buyingPrice)
                                        };
                                        return next;
                                      });
                                    }}
                                    className="bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-2 py-1 text-[10px] font-bold outline-none flex-1 max-w-[150px]"
                                  >
                                    {SUPPLIER_DATA.filter(sup => sup.accounts.some(a => a.category === category)).map(sup => (
                                      <optgroup label={sup.name} key={sup.id}>
                                        {sup.accounts.filter(a => a.category === category).map(acc => (
                                          <option key={acc.name} value={acc.name}>
                                            {acc.name} ({acc.category})
                                          </option>
                                        ))}
                                      </optgroup>
                                    ))}
                                  </select>
                                  <button 
                                    onClick={() => setSupplierPriceView({ account: row.supplierAccount, country: row.country, mccmnc: row.mccmnc })}
                                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-brand-500 transition-colors"
                                    title="View Prices"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">{row.supplierAccount}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                               <button 
                                 onClick={() => setLcrDetailRow(row)}
                                 className="flex items-center gap-2 font-mono text-[11px] font-black text-[#428bca] hover:text-brand-600 transition-colors group/lcr"
                               >
                                 ${row.buyingPrice.toFixed(4)}
                                 <TrendingUp className="w-3 h-3 opacity-0 group-hover/lcr:opacity-100 group-hover/lcr:translate-x-0.5 transition-all -translate-x-1" />
                               </button>
                            </td>
                            <td className="px-3 py-2">
                              {row.isManualSalesPrice ? (
                                <input 
                                  type="number"
                                  value={row.salesPrice}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0;
                                    setAssignedCountries(prev => {
                                      const next = [...prev];
                                      next[realIdx].salesPrice = val;
                                      return next;
                                    });
                                  }}
                                  className="w-20 px-2 py-0.5 bg-brand-500/5 border border-brand-500/20 rounded font-mono text-[11px] font-black outline-none focus:border-brand-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-black text-emerald-600">${row.salesPrice.toFixed(4)}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                               <span className="px-2 py-0.5 bg-emerald-500/5 text-emerald-600 text-[8px] font-black uppercase rounded border border-emerald-500/10">Active</span>
                            </td>
                            {salesMode === 'Customer Rate Table' && (
                              <td className="px-3 py-2">
                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-[#428bca] text-[10px] font-black uppercase rounded border border-blue-100 dark:border-blue-900/40">
                                  {row.rateTableName || 'Basic Table'}
                                </span>
                              </td>
                            )}
                            {showFailover && (
                              <>
                                <td className="px-3 py-2">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-zinc-500 truncate max-w-[100px]">{row.failover1}</span>
                                    <span className="text-[8px] font-mono text-zinc-400">${(row as any).priceBuying1?.toFixed(4) || '0.0000'}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-zinc-500 truncate max-w-[100px]">{row.failover2}</span>
                                    <span className="text-[8px] font-mono text-zinc-400">${(row as any).priceBuying2?.toFixed(4) || '0.0000'}</span>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={showFailover ? 10 : 7} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3 opacity-20">
                            <Layers className="w-12 h-12" />
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">No node configuration found. Assign countries to start engine.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {assignedCountries.length > rowsPerPage && (
                <div className="flex items-center justify-between px-2 pt-2">
                   <span className="text-[9px] font-bold text-zinc-400 uppercase italic">
                     Page {currentPage} of {totalPages}
                   </span>
                   <div className="flex items-center gap-2">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-1.5 text-zinc-400 hover:text-brand-500 disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, i, arr) => (
                          <React.Fragment key={p}>
                            {i > 0 && arr[i-1] !== p - 1 && <span className="text-zinc-300 text-[9px]">...</span>}
                            <button 
                              onClick={() => setCurrentPage(p)}
                              className={cn(
                                "w-6 h-6 rounded-lg text-[9px] font-black uppercase transition-all",
                                currentPage === p ? "bg-brand-500 text-white" : "text-zinc-500 hover:bg-zinc-100"
                              )}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-1.5 text-zinc-400 hover:text-brand-500 disabled:opacity-20 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
              {/* Section 5: Summary & Rules Info */}
              <div className="p-6 bg-zinc-950 rounded-[2.5rem] border border-white/5 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1 h-3 bg-brand-500 rounded-full" />
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Logic Rules Summary</p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
                    <div className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-lg shadow-emerald-500/50" />
                       <p className="text-[10px] font-medium text-white/70 italic leading-relaxed">
                         {salesMode === '% Margin' ? 'Margin logic enabled: System adds ' + marginValue + '% to buying price' : 
                          salesMode === 'Fixed Margin' ? 'Fixed profit logic: System adds ' + marginValue + ' ' + currency + ' to buying price' :
                          'Manual pricing enabled: You can set sales price per-country node.'}
                       </p>
                    </div>
                    <div className="flex items-start gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shadow-lg shadow-brand-500/50" />
                       <p className="text-[10px] font-medium text-white/70 italic leading-relaxed">
                         {supplyMode === 'Auto LCR' ? 'Routing intelligence: System discovers LCR Best Price (Buying Price) and failover nodes dynamically.' :
                          supplyMode === 'Manual' ? 'Manual Routing: Supplier selection is enabled for each country node.' :
                          'Flat routing: Single supplier selection applied globally to all nodes.'}
                       </p>
                    </div>
                 </div>
              </div>
            </>
        )}

        <div className="flex justify-between items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <button 
              onClick={() => {
                if (activeTab === 'Basic') onClose();
                else if (activeTab === 'Filters') setActiveTab('Basic');
                else setActiveTab('Filters');
              }}
              className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              {activeTab === 'Basic' ? 'Cancel' : 'Back'}
            </button>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (activeTab === 'Basic') handleSaveBasicSettings();
                  else handleSaveProduct();
                }}
                className="px-10 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all active:scale-95"
              >
                Save
              </button>
              {activeTab === 'Basic' ? (
                <button 
                  onClick={() => {
                   if (productName) {
                      setActiveTab('Filters');
                   }
                }}
                  className="px-10 py-3 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/20 hover:scale-[1.02] transform transition-all active:scale-95 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : activeTab === 'Filters' ? (
                 <button 
                  onClick={() => setActiveTab('Important')}
                  className="px-10 py-3 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/20 hover:scale-[1.02] transform transition-all active:scale-95"
                >
                  Next
                </button>
              ) : (
                <button 
                  onClick={() => {
                    handleSaveProduct();
                    onClose();
                  }}
                  className="px-10 py-3 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/20 hover:scale-[1.02] transform transition-all active:scale-95"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
          {activeTab === 'Filters' && (
            <FiltersTabContent 
              setActiveTab={setActiveTab} 
              savedRules={savedRules}
              onAddRule={handleAddRule}
              onSave={handleSaveProduct}
              onNext={() => {
                setActiveTab('Important');
              }}
              checkedCountries={checkedCountries}
              selectedMCCMNCs={selectedMCCMNCs}
              category={category}
              assignedCountries={assignedCountries}
            />
          )}

          {!TABS.includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-4">
                <Settings2 className="w-8 h-8 text-zinc-400" />
              </div>
              <h4 className="text-sm font-black uppercase text-zinc-900 dark:text-white mb-2">Module Under Development</h4>
              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest max-w-[240px]">
                The configuration for {activeTab} is currently being mapped to the global matrix.
              </p>
              <button 
                onClick={() => setActiveTab('Basic')}
                className="mt-6 text-[10px] font-black uppercase text-brand-500 hover:underline"
              >
                Back to Basic Tab
              </button>
            </div>
          )}
        </div>
      </div>
      {/* End Content Area */}

      {/* Global Modals Area */}
      <AnimatePresence>
         {lcrDetailRow && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setLcrDetailRow(null)}
                className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm shadow-xl"
             />
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
             >
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                         <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">LCR Insight Depth</h4>
                         <p className="text-[9px] font-bold text-zinc-400 uppercase">{lcrDetailRow.country} • {lcrDetailRow.mccmnc}</p>
                      </div>
                   </div>
                   <button onClick={() => setLcrDetailRow(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full">
                     <X className="w-4 h-4" />
                   </button>
                </div>
                <div className="p-6 space-y-4">
                   <p className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-2">Available Market Suppliers (Top 5 Levels)</p>
                   <div className="space-y-2">
                      {getTopSuppliersForCombination(lcrDetailRow.country, lcrDetailRow.mccmnc).slice(0, 5).map((sup, i) => (
                         <div key={sup.id} className={cn(
                           "flex items-center justify-between p-3 rounded-2xl border transition-all",
                           i === 0 ? "bg-brand-500/5 border-brand-500/20" : "bg-zinc-50 dark:bg-zinc-800/50 border-transparent hover:border-zinc-200"
                         )}>
                            <div className="flex items-center gap-3">
                               <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-[9px] font-bold">
                                  {i + 1}
                               </div>
                               <div>
                                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{sup.name}</p>
                                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{sup.account} • Quality: {sup.quality}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-mono">
                                 ${((sup as any).effectiveRate || sup.rate).toFixed(4)}
                               </p>
                               {i === 0 && <span className="text-[8px] font-black text-emerald-500 uppercase">Selected Node</span>}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 text-center">
                   <p className="text-[9px] font-bold text-zinc-400 italic uppercase tracking-tighter">Prices revised from real-time global rate cards</p>
                </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {standaloneLcrVisible && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setStandaloneLcrVisible(false)}
                className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm shadow-xl"
             />
             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
             >
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-brand-500 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-white" />
                      <div>
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Market Intelligence Lookup</h4>
                         <p className="text-[9px] font-bold text-white/70 uppercase">{standaloneLcrData.country} • {standaloneLcrData.mccmnc}</p>
                      </div>
                   </div>
                   <button onClick={() => setStandaloneLcrVisible(false)} className="p-2 hover:bg-white/10 rounded-full text-white">
                     <X className="w-4 h-4" />
                   </button>
                </div>
                <div className="p-6 space-y-4">
                   <div className="space-y-2">
                      {standaloneLcrData.buyers.map((sup, i) => (
                         <div key={sup.id} className={cn(
                           "flex items-center justify-between p-3 rounded-2xl border transition-all",
                           i === 0 ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : "bg-zinc-50 dark:bg-zinc-800/50 border-transparent"
                         )}>
                            <div className="flex items-center gap-3">
                               <span className="text-[9px] font-black text-zinc-400">{i + 1}</span>
                               <div>
                                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{sup.name}</p>
                                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">{sup.account}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-mono">${(sup.effectiveRate || sup.rate).toFixed(4)}</p>
                               {i === 0 && <span className="text-[8px] font-black text-emerald-500 uppercase italic">LCR Best Price (Buying Price)</span>}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
                <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 text-center">
                   <button 
                     onClick={() => setStandaloneLcrVisible(false)}
                     className="text-[10px] font-black uppercase text-brand-500 hover:scale-105 transition-transform"
                   >
                     Close Analysis
                   </button>
                </div>
             </motion.div>
           </div>
         )}
      </AnimatePresence>

      <AnimatePresence>
        {showSupplierPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowSupplierPopup(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col h-[70vh]"
            >
              <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-brand-500 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white leading-none mb-1">
                      {activeSupplierInPopup 
                        ? SUPPLIER_DATA.find(s => s.id === activeSupplierInPopup)?.name 
                        : 'Select Supplier'}
                    </h3>
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-tighter">
                      {activeSupplierInPopup ? 'Choose Accounts' : 'Supplier Directory'}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowSupplierPopup(false)} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                {!activeSupplierInPopup ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SUPPLIER_DATA.filter(s => s.accounts.some(a => a.category === category)).map(s => (
                      <button 
                        key={s.id}
                        onClick={() => setActiveSupplierInPopup(s.id)}
                        className="w-full text-left p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 hover:border-brand-500/50 hover:bg-white dark:hover:bg-zinc-750 transition-all flex items-center justify-between group"
                      >
                        <div className="space-y-1">
                          <span className="text-sm font-black uppercase text-zinc-900 dark:text-zinc-100 group-hover:text-brand-500 transition-colors">{s.name}</span>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase">{s.accounts.filter(a => a.category === category).length} Accounts Available</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-4">
                      <button 
                        onClick={() => setActiveSupplierInPopup(null)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 hover:text-brand-500 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Back to Suppliers
                      </button>
                      
                      {activeSupplierInPopup && (() => {
                        const sup = SUPPLIER_DATA.find(s => s.id === activeSupplierInPopup);
                        const allAccountNames = sup?.accounts.filter(a => a.category === category).map(a => a.name) || [];
                        const isAllSelected = allAccountNames.length > 0 && allAccountNames.every(name => assignedSupplierAccounts.includes(name));
                        
                        return (
                          <button 
                            onClick={() => {
                              if (isAllSelected) {
                                setAssignedSupplierAccounts(prev => prev.filter(n => !allAccountNames.includes(n)));
                              } else {
                                setAssignedSupplierAccounts(prev => Array.from(new Set([...prev, ...allAccountNames])));
                              }
                            }}
                            className="px-4 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase rounded-lg hover:bg-brand-500 hover:text-white transition-all"
                          >
                            {isAllSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        );
                      })()}
                    </div>

                    {[...new Set(SUPPLIER_DATA.find(s => s.id === activeSupplierInPopup)?.accounts.filter(a => a.category === category).map(a => a.category))].map(cat => (
                      <div key={cat} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 bg-white dark:bg-zinc-900 px-3">{cat}</span>
                          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {SUPPLIER_DATA.find(s => s.id === activeSupplierInPopup)?.accounts.filter(a => a.category === category && a.category === cat).map(acc => (
                            <label 
                              key={acc.name} 
                              className={cn(
                                "flex flex-col gap-2 p-5 rounded-3xl border cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group",
                                assignedSupplierAccounts.includes(acc.name)
                                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/30"
                                  : "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-brand-500/30"
                              )}
                              onClick={(e) => {
                                e.preventDefault();
                                setAssignedSupplierAccounts(prev => 
                                  prev.includes(acc.name) ? prev.filter(n => n !== acc.name) : [...prev, acc.name]
                                );
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                                  acc.category === category ? "bg-brand-500 text-white" : "bg-zinc-100 dark:bg-zinc-700 text-zinc-400"
                                )}>
                                  {acc.category}
                                </span>
                                <div className={cn(
                                  "w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all",
                                  assignedSupplierAccounts.includes(acc.name)
                                    ? "bg-emerald-500 border-emerald-500"
                                    : "border-zinc-200 dark:border-zinc-700"
                                )}>
                                  {assignedSupplierAccounts.includes(acc.name) && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                              <span className="text-sm font-black text-zinc-900 dark:text-zinc-100 mt-1">{acc.name}</span>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
                                 <span className="text-[10px] font-bold text-zinc-400">Rate:</span>
                                 <span className="text-xs font-black text-brand-500 font-mono">${acc.rate.toFixed(4)}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                 <p className="text-[10px] font-medium text-zinc-400 italic">Select individual accounts or use Select All. Selected accounts will populate for the current product.</p>
                 <button 
                   onClick={() => setShowSupplierPopup(false)}
                   className="px-10 py-3 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-500/20 hover:scale-[1.03] transition-all"
                 >
                   Confirm Selection
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supplier Price View Popup */}
      <AnimatePresence>
        {supplierPriceView && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSupplierPriceView(null)}
              className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl p-8 border border-zinc-200 dark:border-zinc-800 text-center space-y-6"
            >
              <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-8 h-8 text-brand-500" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Pricing for Node</h3>
                <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">{supplierPriceView.country} • {supplierPriceView.mccmnc}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-[2rem] space-y-4 border border-zinc-100 dark:border-zinc-800 shadow-inner">
                <div className="flex flex-col gap-1 items-center">
                   <span className="text-[10px] font-black uppercase text-zinc-400">{supplierPriceView.account}</span>
                   <span className="text-4xl font-black text-brand-500 font-mono">
                     ${(SUPPLIERS.find(s => s.account === supplierPriceView.account)?.rate || 0).toFixed(4)}
                   </span>
                   <span className="text-[9px] font-bold text-zinc-400 uppercase italic">Latest Rate Card Price</span>
                </div>
              </div>
              <button 
                onClick={() => setSupplierPriceView(null)}
                className="w-full py-3 bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all"
              >
                Close View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rate Table Selection Preview Modal */}
      <AnimatePresence>
        {showRateTablePreview && selectedRateTable && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRateTablePreview(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                    <ListFilter className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">
                      {MOCK_RATE_TABLES.find(t => t.id === selectedRateTable)?.name}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Rate Plan Preview</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRateTablePreview(false)}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Country</th>
                      <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">MCCMNC</th>
                      <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {(MOCK_RATE_TABLE_DATA[selectedRateTable] || []).map((pRow, i) => (
                      <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">{pRow.country}</td>
                        <td className="px-4 py-3 font-mono text-[11px] text-zinc-400">{pRow.mccmnc}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-black text-brand-500">${pRow.rate.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                <button 
                  onClick={() => setShowRateTablePreview(false)}
                  className="px-8 py-2 bg-brand-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-brand-600 transition-all"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rules Summary Popup */}
      <AnimatePresence>
        {showRulesSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRulesSummary(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col max-h-[80vh]"
            >
               <div className="px-8 py-6 bg-brand-500 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-white">
                    <Settings2 className="w-5 h-5" />
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest">Logic Rules Summary</h4>
                      <p className="text-[10px] font-bold opacity-70 uppercase tracking-tighter">{savedRules.length} Active Configurations</p>
                    </div>
                  </div>
                  <button onClick={() => setShowRulesSummary(false)} className="p-2 hover:bg-white/20 rounded-full text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                  {savedRules.length === 0 ? (
                    <div className="py-12 text-center text-zinc-400 space-y-2">
                       <Zap className="w-8 h-8 mx-auto opacity-20" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No custom rules configured yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedRules.map((rule, idx) => (
                        <div key={rule.id} className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] border border-zinc-100 dark:border-zinc-700 flex flex-col gap-4">
                           <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center text-xs font-black text-brand-500 shadow-sm">
                                  {idx + 1}
                                </div>
                                <div className="space-y-0.5">
                                   <span className="text-[9px] font-black uppercase text-brand-500 tracking-widest bg-brand-500/5 px-2 py-0.5 rounded-full">{rule.tab}</span>
                                   <p className="text-sm font-black text-zinc-700 dark:text-zinc-200">{rule.description}</p>
                                </div>
                              </div>
                              <button 
                                onClick={() => setSavedRules(prev => prev.filter(r => r.id !== rule.id))}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                           </div>
                           <div className="pl-14 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50">
                              <RuleDetails rule={rule} />
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>

               <div className="p-8 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-end">
                  <button 
                    onClick={() => setShowRulesSummary(false)}
                    className="px-8 py-3 bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
                  >
                    Close Rules
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
