import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, Reorder } from 'motion/react';
import { 
  X, Search, Check, Square, Plus, Download, Upload, Info, 
  Zap, Play, Shield, List, Users, Phone, Type, Globe,
  ArrowRight, ArrowLeft, Save, RotateCcw, RefreshCw, Filter, Trash2, Edit2, Copy, Send, Settings, Landmark,
  ChevronRight, ChevronDown, ChevronUp, Database, Hash, Clock, Eye, FileCode, CheckCircle2, Settings2, Globe2, BarChart3, History, User, ShieldCheck, Timer, AlertCircle,
  Puzzle, ArrowDownLeft, ArrowUpRight, Activity
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function RateTableForm({ onClose, theme, isEdit, data, isVendor }: { onClose: () => void; theme: 'light' | 'dark'; isEdit?: boolean; data?: any; isVendor?: boolean }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 w-full max-w-2xl font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{isEdit ? 'EDIT' : 'ADD'} {isVendor ? 'VENDOR' : 'CUSTOMER'} RATE TABLE</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {isVendor && (
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Select Vendor <span className="text-red-500">*</span></label>
            <select className="px-3 py-2 w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold">
               <option>Select Vendor...</option>
               <option>Alpha System</option>
               <option>Global Hub</option>
               <option>TeleOSS</option>
            </select>
          </div>
        )}
        {[
          { label: 'RATE TABLE NAME', type: 'text', value: data?.['NAME'] || data?.['Name'] || '' },
          { label: isVendor ? 'VENDOR ACCOUNT CATEGORY' : 'PRODUCT CATEGORY', type: 'select', options: ['Select', 'DIRECT', 'HQ', 'SIM', 'WHS', 'International', 'Local Premium'], value: data?.['PRODUCT CATEGORY'] || data?.['Product Category'] || '' },
          { label: 'CURRENCY', type: 'select', options: ['USD', 'EUR', 'INR', 'GBP'], value: data?.['CURRENCY'] || data?.['Currency'] || 'USD' },
          { label: 'BILLING INCREMENT', type: 'select', options: ['1/1 (Per Second)', '6/6 (Six Seconds)', '1/6 (One/Six)', '1/1 (Per Msg)'], value: data?.['BILLING_INCREMENT'] || '1/1 (Per Msg)' },
          { label: 'RATE PRECISION (DECIMALS)', type: 'select', options: ['4', '5', '6', '7'], value: data?.['PRECISION'] || '6' },
          { label: 'EFFECTIVE DATE', type: 'date', value: data?.['EFFECTIVE_DATE'] || new Date().toISOString().split('T')[0] },
          { label: 'DESCRIPTION', type: 'textarea', value: data?.['DESCRIPTION'] || data?.['Description'] || '', fullWidth: true },
          { label: 'STATUS', type: 'select', options: ['Active', 'Inactive'], value: data?.['STATUS'] || data?.['Status'] || 'Active' },
        ].map((field) => (
          <div key={field.label} className={cn("flex flex-col gap-2", field.fullWidth ? "md:col-span-2" : "")}>
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{field.label}</label>
            {field.type === 'select' ? (
              <select defaultValue={field.value} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold">
                {field.options?.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea defaultValue={field.value} rows={3} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold" />
            ) : (
              <input 
                type={field.type}
                defaultValue={field.value}
                className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/20 focus:border-[#428bca] transition-all font-bold"
              />
            )}
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-blue-600 transition-all active:scale-95">Save Changes</button>
      </div>
    </div>
  );
}

export function ImportRateTableForm({ onClose, theme, isVendor }: { onClose: () => void; theme: 'light' | 'dark'; isVendor?: boolean }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Import {isVendor ? 'Vendor' : 'Customer'} Rate Table</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Select Rate Table <span className="text-red-500">*</span></label>
            <select className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold">
              <option>Select Table...</option>
              {isVendor ? (
                <>
                  <option>Alpha Vendor WHS</option>
                  <option>Global LCR Vendor</option>
                </>
              ) : (
                <>
                  <option>Standard Customer Rates</option>
                  <option>Premium Customer Rates</option>
                </>
              )}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Currency</label>
            <select className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold">
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Import File (CSV/XLSX) <span className="text-red-500">*</span></label>
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-zinc-50/30 dark:bg-zinc-800/10 hover:border-[#428bca]/50 transition-all cursor-pointer group">
             <div className="w-14 h-14 bg-[#428bca]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
               <Upload className="w-6 h-6 text-[#428bca]" />
             </div>
             <div className="text-center">
               <p className="text-xs font-black uppercase tracking-wider text-zinc-500">Drag & drop pricing file here</p>
               <p className="text-[10px] text-zinc-400 mt-1">or click to browse from computer</p>
             </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <p className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400">Import Guidelines</p>
            <ul className="text-[10px] font-medium text-blue-500 leading-relaxed list-disc ml-4">
              <li>Header row must contain: COUNTRY, MCCMNC, RATE, EFFECTIVE_DATE</li>
              <li>Date format should be YYYY-MM-DD</li>
              <li>Large files may take up to 2 minutes to process</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors font-sans">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-600 transition-all active:scale-95 font-sans">Start Import</button>
      </div>
    </div>
  );
}

export function RateTableRatesView({ onClose, rateTableName }: { onClose: () => void; rateTableName: string }) {
  const [rates, setRates] = useState([
    { country: 'India', mccmnc: '40401', network: 'Airtel', rate: '0.0012', effective: '2024-05-01', updated: '2024-05-01 10:30' },
    { country: 'India', mccmnc: '40405', network: 'Reliance', rate: '0.0011', effective: '2024-05-01', updated: '2024-05-01 10:30' },
    { country: 'UK', mccmnc: '23415', network: 'Vodafone', rate: '0.0055', effective: '2024-04-15', updated: '2024-04-15 09:00' },
    { country: 'UAE', mccmnc: '42402', network: 'Etisalat', rate: '0.0120', effective: '2024-05-10', updated: '2024-05-10 11:45' },
    { country: 'Greece', mccmnc: '20201', network: 'Cosmote', rate: '0.0050', effective: '2024-01-01', updated: '2024-01-01 12:00' },
    { country: 'Germany', mccmnc: '26202', network: 'Vodafone', rate: '0.0048', effective: '2024-05-01', updated: '2024-05-01 14:15' },
  ]);

  const [filterText, setFilterText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [newMccmnc, setNewMccmnc] = useState('');
  const [newNetwork, setNewNetwork] = useState('');
  const [newRate, setNewRate] = useState('');
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingRate, setEditingRate] = useState('');

  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleAddRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountry || !newMccmnc || !newNetwork || !newRate) {
      alert("All fields are required to add a carrier rate.");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const timestamp = today + " " + new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    const item = {
      country: newCountry,
      mccmnc: newMccmnc,
      network: newNetwork,
      rate: parseFloat(newRate).toFixed(4),
      effective: today,
      updated: timestamp
    };

    setRates([item, ...rates]);
    setIsAdding(false);
    setNewCountry('');
    setNewMccmnc('');
    setNewNetwork('');
    setNewRate('');
    showNotification(`Added new rate for ${item.country} ${item.network} (${item.mccmnc}) at $${item.rate}`);
  };

  const handleEditClick = (idx: number, currentRate: string) => {
    setEditingIndex(idx);
    setEditingRate(currentRate);
  };

  const handleSaveEdit = (idx: number) => {
    const updatedRates = [...rates];
    const oldRate = updatedRates[idx].rate;
    updatedRates[idx].rate = parseFloat(editingRate).toFixed(4);
    updatedRates[idx].updated = new Date().toISOString().split('T')[0] + " " + new Date().toTimeString().split(' ')[0].substring(0, 5);
    
    setRates(updatedRates);
    setEditingIndex(null);
    showNotification(`Updated carrier rate from $${oldRate} to $${updatedRates[idx].rate}`);
  };

  const handleDeleteRate = (idx: number) => {
    const target = rates[idx];
    if (confirm(`Are you sure you want to delete the rate for ${target.country} ${target.network}?`)) {
      setRates(rates.filter((_, i) => i !== idx));
      showNotification(`Deleted rate rule for ${target.country} (${target.mccmnc})`);
    }
  };

  const handleExportRates = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Country,MCCMNC,Network,Rate,Effective Date,Last Updated\n"
        + rates.map(r => `"${r.country}","${r.mccmnc}","${r.network}",${r.rate},"${r.effective}","${r.updated}"`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `rates_${rateTableName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showNotification(`Successfully exported ${rates.length} rates to CSV!`);
    }, 1200);
  };

  const filteredRates = rates.filter(r => 
    r.country.toLowerCase().includes(filterText.toLowerCase()) ||
    r.mccmnc.includes(filterText) ||
    r.network.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-5xl w-full flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Rate Table Content Manager</h3>
          <span className="text-[10px] font-bold text-zinc-400">TABLE: {rateTableName}</span>
        </div>
        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-lg border border-emerald-200/50 animate-bounce">
              {successMsg}
            </div>
          )}
          <button 
            onClick={() => setIsAdding(!isAdding)} 
            className="px-4 py-1.5 bg-[#5cb85c] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-green-600 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> {isAdding ? "Close Form" : "Add Rate Row"}
          </button>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Quick Add Form */}
        {isAdding && (
          <form onSubmit={handleAddRate} className="p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-800 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-3 items-end animate-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Country</label>
              <input 
                type="text" 
                required
                placeholder="e.g. India" 
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">MCCMNC Link</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 40445" 
                value={newMccmnc}
                onChange={(e) => setNewMccmnc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Carrier / Network</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Airtel" 
                value={newNetwork}
                onChange={(e) => setNewNetwork(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Decimal Rate ($)</label>
              <input 
                type="number" 
                step="0.0001"
                required
                placeholder="e.g. 0.0035" 
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-1.5 bg-[#428bca] hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow transition-all duration-300 flex items-center justify-center gap-1 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Append Rate
            </button>
          </form>
        )}

        <div className="flex gap-2 mb-4">
          <div className="flex h-9 flex-1">
            <input 
              type="text" 
              placeholder="Search by country name, MCCMNC, or operator network..." 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="flex-1 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-l text-xs outline-none focus:border-blue-500" 
            />
            {filterText && (
              <button 
                onClick={() => setFilterText('')}
                className="px-3 bg-zinc-50 dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-zinc-650"
              >
                Clear
              </button>
            )}
            <div className="px-6 bg-[#428bca] text-white flex items-center text-[10px] font-black uppercase tracking-widest rounded-r">
              <Search className="w-3.5 h-3.5 mr-1" /> SQL Search
            </div>
          </div>
          <button 
            onClick={handleExportRates}
            disabled={isExporting}
            className="px-6 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Exporting...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Export Rates CSS
              </>
            )}
          </button>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden h-[400px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f9fa] dark:bg-zinc-800 sticky top-0 shadow-sm z-10">
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                {['Country', 'MCCMNC', 'Network', 'Rate ($)', 'Effective Date', 'Last Updated', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredRates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-xs text-zinc-405 font-mono italic">
                    ⚠ No active rate mapping matched your query criteria.
                  </td>
                </tr>
              ) : (
                filteredRates.map((row, idxOriginal) => {
                  // Find exact index in original rates array to update properly
                  const idx = rates.findIndex(r => r.mccmnc === row.mccmnc && r.network === row.network);
                  const isEditing = editingIndex === idx;

                  return (
                    <tr key={idxOriginal} className="text-[10px] hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="px-5 py-3 font-bold text-zinc-700 dark:text-zinc-300 font-sans tracking-tight">{row.country}</td>
                      <td className="px-5 py-3 font-mono text-zinc-500 text-[11px] font-black">{row.mccmnc}</td>
                      <td className="px-5 py-3 text-zinc-650 dark:text-zinc-400 font-black uppercase">{row.network}</td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <span className="text-zinc-400 font-mono">$</span>
                            <input 
                              type="number" 
                              step="0.0001"
                              className="w-20 px-2 py-1 bg-white dark:bg-zinc-950 border border-[#428bca] rounded font-mono font-bold text-[#428bca]"
                              value={editingRate}
                              onChange={(e) => setEditingRate(e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="font-mono font-black text-[#428bca] text-[12px] tracking-tighter">${row.rate}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-zinc-500 italic font-semibold">{row.effective}</td>
                      <td className="px-5 py-3 text-zinc-400 font-mono text-[9px]">{row.updated}</td>
                      <td className="px-5 py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSaveEdit(idx)}
                              className="text-[9px] font-black uppercase text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 px-2 py-1 rounded border border-emerald-200"
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingIndex(null)}
                              className="text-[9px] font-black uppercase text-zinc-400 hover:underline px-2 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2.5">
                            <button 
                              onClick={() => handleEditClick(idx, row.rate)}
                              className="text-[9px] font-black uppercase text-[#428bca] hover:bg-[#428bca]/5 px-2 py-1 rounded flex items-center gap-1 border border-transparent hover:border-[#428bca]/10 transition-colors"
                            >
                              <Edit2 className="w-2.5 h-2.5" /> Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteRate(idx)}
                              className="text-[9px] font-black uppercase text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-2 py-1 rounded flex items-center gap-1 border border-transparent hover:border-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-2.5 h-2.5" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
        <div className="text-[10px] font-bold text-zinc-400 uppercase italic">Showing {filteredRates.length} of {rates.length} custom-routed rates</div>
        <button onClick={onClose} className="px-8 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95">Close View</button>
      </div>
    </div>
  );
}

export function LCRRequestForm({ onClose, theme }: FormProps) {
  const handleRequestSubmit = () => {
    alert(
      `================ LCR PIPELINE TRIGGERS ================\n\n` +
      `✔ Service Status: ONLINE & DISPATCHED\n` +
      `✔ Engine Target  : Smart LCR (Least Cost Routing)\n` +
      `✔ Verification   : Passed MCCMNC integrity validation\n\n` +
      `--------------------------------------------------------\n` +
      `The routing optimizer is now compiling active carrier grids.\n` +
      `Optimized pathways will propagate to signaling nodes within 45 seconds.\n\n` +
      `LCR request submitted successfully!`
    );
    onClose();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full max-h-[90vh] flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">LCR REQUEST</h3>
        <div className="flex items-center gap-3">
          <button onClick={handleRequestSubmit} className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Request</button>
          <button onClick={onClose} className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all">Cancel</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right pt-2">MCCMNC :</label>
              <div className="flex-1 space-y-2">
                <textarea rows={3} placeholder="MCCMNC code matches start with & separate by comma" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5" />
                  Include inactive entities
                </label>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right pt-2">Product Category <span className="text-red-500">*</span> :</label>
              <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                <div className="max-h-32 overflow-auto p-2 space-y-1 bg-white dark:bg-zinc-900">
                  {['DIRECT', 'HQ', 'SIM', 'WHS', 'International', 'Local Premium'].map(item => (
                    <label key={item} className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-1 rounded">
                      <input type="checkbox" className="w-3.5 h-3.5" />
                      {item}
                    </label>
                  ))}
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800 p-1 flex gap-px">
                  <input type="text" placeholder="Search" className="flex-1 px-2 py-1 text-[10px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 outline-none" />
                  <button className="px-2 py-1 bg-[#428bca] text-white text-[9px] font-bold uppercase flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Check All</button>
                  <button className="px-2 py-1 bg-[#428bca] text-white text-[9px] font-bold uppercase flex items-center gap-1"><Square className="w-2.5 h-2.5" /> Uncheck All</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Customer Trunk :</label>
              <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                <option>Select</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Offset :</label>
              <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                <option>Select</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Minimum Rate :</label>
              <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">ASR(t) % :</label>
              <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right pt-2">Vendor Trunk :</label>
              <div className="flex-1 space-y-2">
                <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                  <div className="max-h-32 overflow-auto p-2 space-y-1 bg-white dark:bg-zinc-900">
                    {['Alpha-System-OUT (1)', 'Aakash_DIR_OUT (2)', 'Gurleen_DIR_OUT (3)', 'Kevin_DIR_OUT (4)'].map(item => (
                      <label key={item} className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-1 rounded">
                        <input type="checkbox" className="w-3.5 h-3.5" />
                        {item}
                      </label>
                    ))}
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-1 flex gap-px">
                    <input type="text" placeholder="Search" className="flex-1 px-2 py-1 text-[10px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 outline-none" />
                    <button className="px-2 py-1 bg-[#428bca] text-white text-[9px] font-bold uppercase flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Check All</button>
                    <button className="px-2 py-1 bg-[#428bca] text-white text-[9px] font-bold uppercase flex items-center gap-1"><Square className="w-2.5 h-2.5" /> Uncheck All</button>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5" defaultChecked />
                  Match with MCCMNC Unique Codes
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Margin (%) :</label>
              <input type="text" placeholder="Margin(%)" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">Maximum Rate :</label>
              <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[120px] text-right">DLR(t) % :</label>
              <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AddReRatingForm({ onClose, theme }: FormProps) {
  const [description, setDescription] = useState('Late billing rate updates dispute settlement for April 2026 traffic segment');
  const [enterpriseType, setEnterpriseType] = useState<'Customer' | 'Vendor'>('Customer');
  const [targetAccount, setTargetAccount] = useState('Alpha-System-IN(97)');
  const [selectedMccmncs, setSelectedMccmncs] = useState<string[]>(['202001 - Greece, Cosmote', '202005 - Greece, Vodafone']);
  const [mccmncQuery, setMccmncQuery] = useState('');
  
  const [startDate, setStartDate] = useState('2026-04-01T00:00');
  const [endDate, setEndDate] = useState('2026-04-30T23:59');
  
  const [originalRate, setOriginalRate] = useState('0.0055');
  const [correctedRate, setCorrectedRate] = useState('0.0042');
  const [rateTable, setRateTable] = useState('Tvoice_DIR_IN(91)');
  const [useRateTable, setUseRateTable] = useState(false);
  const [senderId, setSenderId] = useState('');
  const [requestedBy, setRequestedBy] = useState('Billing Specialist [Admin]');
  const [dontPost, setDontPost] = useState(false);

  // Simulation outputs
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [smsVolume, setSmsVolume] = useState(2450000);
  const [mccmncBreakdown, setMccmncBreakdown] = useState<any[]>([]);

  const customersList = ['Alpha-System-IN(97)', 'Notify_HQ_IN(96)', 'Notify_DIR_IN(95)', 'Tvoice_DIR_IN(94)', 'ABC Corp Svc', 'XYZ Teleports'];
  const vendorsList = ['CheapCarrier-VND', 'AirRoute-Transit', 'QuickDeliver-SMS', 'GlobalTrunk-Carrier'];
  
  const allMccmncs = [
    '202001 - Greece, Cosmote',
    '202005 - Greece, Vodafone',
    '234030 - United Kingdom, EE',
    '404045 - India, Airtel',
    '262002 - Germany, Vodafone',
    '525001 - Singapore, Singtel',
    '655010 - South Africa, MTN'
  ];

  const rateTables = ['Notify_HQ_IN(94)', 'Notify_DIR_IN(93)', 'Tvoice_HQ_IN(92)', 'Tvoice_DIR_IN(91)'];

  // Toggle selection for checkboxes
  const toggleMccmnc = (item: string) => {
    if (selectedMccmncs.includes(item)) {
      setSelectedMccmncs(selectedMccmncs.filter(c => c !== item));
    } else {
      setSelectedMccmncs([...selectedMccmncs, item]);
    }
  };

  const handleCheckAll = () => {
    setSelectedMccmncs(allMccmncs);
  };

  const handleUncheckAll = () => {
    setSelectedMccmncs([]);
  };

  const filteredMccmncs = allMccmncs.filter(m => 
    m.toLowerCase().includes(mccmncQuery.toLowerCase())
  );

  const runReRatingCalculation = () => {
    setIsSimulating(true);
    setHasSimulated(false);
    
    setTimeout(() => {
      // Dynamic random but clean deterministic values based on selections
      const codeCount = Math.max(1, selectedMccmncs.length);
      const totalVolume = selectedMccmncs.length === 0 ? 0 : codeCount * (Math.floor(Math.random() * 400000) + 650000);
      
      const origR = parseFloat(originalRate) || 0.0050;
      const corrR = parseFloat(correctedRate) || 0.0040;
      
      const list = selectedMccmncs.map((code, idx) => {
        const codeVol = Math.floor(totalVolume / codeCount) + (idx * 25000);
        const originalCostRaw = codeVol * origR;
        const reRatedCostRaw = codeVol * corrR;
        const diffRaw = originalCostRaw - reRatedCostRaw; // (+) is credit note to client
        
        return {
          code,
          volume: codeVol,
          originalPrice: origR,
          correctedPrice: corrR,
          originalCost: originalCostRaw,
          reRatedCost: reRatedCostRaw,
          delta: diffRaw
        };
      });

      setSmsVolume(totalVolume);
      setMccmncBreakdown(list);
      setIsSimulating(false);
      setHasSimulated(true);
    }, 700);
  };

  // Perform calculations for summary cards
  const totalOriginalCost = mccmncBreakdown.reduce((sum, item) => sum + item.originalCost, 0);
  const totalReRatedCost = mccmncBreakdown.reduce((sum, item) => sum + item.reRatedCost, 0);
  // Re-rating delta.
  // If Customer: original cost was billed high, corrected is lower -> we OWE them money (refund/credit note of (Original - Corrected))
  // If Vendor: original cost was paid high, corrected is lower -> they OWE us money (debit adjustment of (Original - Corrected))
  const deltaValue = totalOriginalCost - totalReRatedCost;

  const handleCommitToLedger = () => {
    if (dontPost) {
      alert(`✔ Re-Rating Log successfully registered under ID: RE-2026-${Math.floor(Math.random() * 89999) + 10000}.\n\n(Posting bypassed as selected)`);
      onClose();
      return;
    }

    const noteType = deltaValue >= 0 ? 'CREDIT NOTE' : 'DEBIT ADJUSTMENT';
    const transactionId = `TXN-RE-${Math.floor(Math.random() * 8999) + 1000}`;
    
    const summaryMsg = `============== COMMIT RE-RATIFICATION LEDGER ==============\n\n` +
      `Request Status : COMMITTED & APPROVED\n` +
      `Entity Scope : [${enterpriseType}] - ${targetAccount}\n` +
      `CDR Interval : ${startDate.replace('T', ' ')} to ${endDate.replace('T', ' ')}\n` +
      `Total Audited Volumes: ${smsVolume.toLocaleString()} Bulk Segments\n\n` +
      `-------------------- Accounting Summary --------------------\n` +
      `Original Invoiced Value : $${totalOriginalCost.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}\n` +
      `Re-Rated Corrected Value: $${totalReRatedCost.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}\n` +
      `Calculated Adjustment  : $${Math.abs(deltaValue).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}\n` +
      `Assigned Document      : ${noteType} (${transactionId})\n\n` +
      `------------------------------------------------------------\n` +
      `✔ [DATABASE LEDGER] Balance sheet & credit buffers updated in real-time.\n` +
      `✔ [SOA RECONCILIATION] Added transaction row to current active billing cycle Statement of Account.\n` +
      `✔ [E-MAIL] Document generated and dispatched to: finance@${targetAccount.toLowerCase().split('-')[0].replace(/[^a-z0-9]/g, '')}.com\n\n` +
      `Rating reconciliation committed seamlessly!`;

    alert(summaryMsg);
    onClose();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-w-7xl w-full max-h-[95vh] flex flex-col font-sans">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">SMS Ingress Re-Rating Unit</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            disabled={!hasSimulated || isSimulating}
            onClick={handleCommitToLedger} 
            className={cn(
              "px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded shadow transition-all",
              hasSimulated ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500 cursor-not-allowed"
            )}
          >
            Post Adjustment
          </button>
          <button onClick={onClose} className="px-5 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-zinc-200 transition-all">Cancel</button>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors ml-1">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Inputs Panel */}
          <div className="lg:col-span-5 space-y-6 text-left border-r border-zinc-100 dark:border-zinc-800/50 pr-8">
            <div className="p-4 bg-[#428bca]/5 border border-[#428bca]/15 rounded-2xl flex items-start gap-3">
              <Info className="w-4 h-4 text-[#428bca] mt-0.5 shrink-0" />
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium animate-pulse">
                Re-rating allows carriers to retroactively reprice historical SMS traffic. Useful for dispute settlements, late operator price adjustments, or correcting signaling deck billing errors.
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Job Description / Billing Log</label>
              <textarea 
                rows={2} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/15" 
              />
            </div>

            {/* Enterprise type & selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Enterprise Type</label>
                <div className="flex bg-zinc-50 dark:bg-zinc-800 p-1.5 rounded-lg gap-2 border border-zinc-200/50 dark:border-zinc-700">
                  <button 
                    type="button"
                    onClick={() => { setEnterpriseType('Customer'); setTargetAccount(customersList[0]); }}
                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all", enterpriseType === 'Customer' ? "bg-white dark:bg-zinc-900 shadow-sm text-[#428bca]" : "text-zinc-400")}
                  >
                    Customer
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setEnterpriseType('Vendor'); setTargetAccount(vendorsList[0]); }}
                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all", enterpriseType === 'Vendor' ? "bg-white dark:bg-zinc-900 shadow-sm text-[#428bca]" : "text-zinc-400")}
                  >
                    Vendor
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Select Account</label>
                <select 
                  value={targetAccount}
                  onChange={(e) => setTargetAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/15"
                >
                  {enterpriseType === 'Customer' 
                    ? customersList.map(c => <option key={c} value={c}>{c}</option>)
                    : vendorsList.map(v => <option key={v} value={v}>{v}</option>)
                  }
                </select>
              </div>
            </div>

            {/* Date Range Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Start Date</label>
                <input 
                  type="datetime-local" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/15" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">End Date</label>
                <input 
                  type="datetime-local" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#428bca]/15" 
                />
              </div>
            </div>

            {/* Ingress MCCMNC filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono flex justify-between">
                <span>Targets Country Segment (MCCMNC)</span>
                <span className="text-zinc-500 font-normal">Selected {selectedMccmncs.length}</span>
              </label>
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 flex flex-col">
                <div className="max-h-32 overflow-y-auto p-3 space-y-1.5">
                  {filteredMccmncs.map(item => (
                    <label key={item} className="flex items-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 p-1.5 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedMccmncs.includes(item)}
                        onChange={() => toggleMccmnc(item)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-[#428bca] focus:ring-0" 
                      />
                      <span className="font-semibold">{item}</span>
                    </label>
                  ))}
                  {filteredMccmncs.length === 0 && (
                    <p className="text-xs text-zinc-400 text-center py-2">No matching country codes</p>
                  )}
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-900/60 p-2 flex gap-1 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="relative flex-1">
                    <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input 
                      type="text" 
                      placeholder="Search code / country..." 
                      value={mccmncQuery}
                      onChange={(e) => setMccmncQuery(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[11px] font-medium outline-none focus:ring-1 focus:ring-[#428bca]/25" 
                    />
                  </div>
                  <button type="button" onClick={handleCheckAll} className="px-2.5 py-1 bg-[#428bca] hover:bg-blue-600 text-white text-[10px] font-bold uppercase rounded transition-colors">All</button>
                  <button type="button" onClick={handleUncheckAll} className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold uppercase rounded transition-colors">None</button>
                </div>
              </div>
            </div>

            {/* Rate Adjustment Settings: override vs table lookup */}
            <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-left space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Rates Lookup Style</label>
                <div className="flex gap-2">
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer font-bold text-zinc-600 dark:text-zinc-300">
                    <input 
                      type="radio" 
                      checked={!useRateTable} 
                      onChange={() => setUseRateTable(false)} 
                      className="accent-[#428bca]" 
                    />
                    Manual overrides
                  </label>
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer font-bold text-zinc-600 dark:text-zinc-300">
                    <input 
                      type="radio" 
                      checked={useRateTable} 
                      onChange={() => setUseRateTable(true)} 
                      className="accent-[#428bca]" 
                    />
                    Rate Table sync
                  </label>
                </div>
              </div>

              {!useRateTable ? (
                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-extrabold uppercase text-zinc-400">Orig Segment Rate ($)</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      value={originalRate}
                      onChange={(e) => setOriginalRate(e.target.value)}
                      className="px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-xs outline-none" 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-extrabold uppercase text-zinc-400">Corrected Rate ($)</label>
                    <input 
                      type="number" 
                      step="0.0001"
                      value={correctedRate}
                      onChange={(e) => setCorrectedRate(e.target.value)}
                      className="px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-xs outline-none" 
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 animate-in fade-in duration-200">
                  <label className="text-[9px] font-extrabold uppercase text-zinc-400">Select Correction Source Rate Table</label>
                  <select 
                    value={rateTable}
                    onChange={(e) => {
                      setRateTable(e.target.value);
                      if (e.target.value.includes('91')) { setOriginalRate('0.0055'); setCorrectedRate('0.0039'); }
                      else if (e.target.value.includes('92')) { setOriginalRate('0.0049'); setCorrectedRate('0.0041'); }
                      else { setOriginalRate('0.0055'); setCorrectedRate('0.0045'); }
                    }}
                    className="px-2.5 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-xs outline-none focus:ring-1 focus:ring-[#428bca]"
                  >
                    {rateTables.map(rt => <option key={rt} value={rt}>{rt}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Sender and administrative variables */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-zinc-400">Sender ID Rule (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. ALL_TRAFFIC" 
                  value={senderId}
                  onChange={(e) => setSenderId(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none" 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-extrabold uppercase text-zinc-400">Requested Person</label>
                <input 
                  type="text" 
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none" 
                />
              </div>
            </div>

            {/* Action checkbox and run triggers */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer pt-1 text-left">
                <input 
                  type="checkbox" 
                  checked={dontPost}
                  onChange={() => setDontPost(!dontPost)}
                  className="w-4 h-4 rounded border-zinc-300 text-[#428bca] focus:ring-0" 
                />
                <span className="text-[11px] font-bold text-zinc-500 flex items-center gap-1 text-left">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Bypassing credit ledger injection (dry run)
                </span>
              </label>

              <button 
                type="button" 
                onClick={runReRatingCalculation}
                disabled={selectedMccmncs.length === 0 || isSimulating}
                className={cn(
                  "w-full py-3 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2",
                  selectedMccmncs.length === 0 
                  ? "bg-zinc-400 cursor-not-allowed" 
                  : "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/15"
                )}
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    Querying Carrier CDR Log Database...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 shrink-0" />
                    Simulate & Calculate Re-Rating Delta
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Calculations Results Display Panel */}
          <div className="lg:col-span-7 h-full flex flex-col justify-between">
            {!hasSimulated ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center bg-zinc-50 dark:bg-zinc-950/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8">
                <Clock className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mb-4 animate-bounce" />
                <h4 className="text-sm font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">Calculation Engine Idle</h4>
                <p className="text-xs text-zinc-400 max-w-sm mt-1.5">
                  Set target accounts, select MCCMNCS codes, specify rates, then trigger calculation to audit billing delta difference before posting.
                </p>
              </div>
            ) : (
              <div className="space-y-6 text-left animate-in fade-in duration-200">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">Simulated CDR Scan Results</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Audited <span className="font-bold text-zinc-800 dark:text-zinc-100">{smsVolume.toLocaleString()} segments</span> successfully over selected period.
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-md">
                    Scan OK
                  </div>
                </div>

                {/* Main Billing Grid */}
                <div className="grid grid-cols-3 gap-4 text-left">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200/50 dark:border-zinc-700 flex flex-col justify-between">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider text-left">Original Billed Sum</p>
                    <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 font-mono mt-2 text-left">
                      ${totalOriginalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200/50 dark:border-zinc-700 flex flex-col justify-between">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider text-left">Corrected Cost Sum</p>
                    <p className="text-lg font-black text-[#428bca] font-mono mt-2 text-left">
                      ${totalReRatedCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl border flex flex-col justify-between text-left",
                    deltaValue >= 0 
                      ? "bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-500/20 " 
                      : "bg-rose-50/50 dark:bg-rose-950/10 border-rose-500/20"
                  )}>
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-wider flex justify-between text-left">
                      Adjustments Bal
                      {deltaValue >= 0 ? (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </p>
                    <div>
                      <p className={cn("text-lg font-black font-mono mt-2 text-left", deltaValue >= 0 ? "text-emerald-600" : "text-rose-600")}>
                        {deltaValue >= 0 ? '-' : '+'}${Math.abs(deltaValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase text-left block">
                        {deltaValue >= 0 ? 'Credit Note Obligation' : 'Debit Adjustment Surcharge'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub CDR table details */}
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 text-left">
                  <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-left">
                    <h5 className="text-[10px] font-black uppercase text-zinc-700 dark:text-zinc-300 tracking-wider font-mono text-left">Deduplicated MCCMNC Ingress Audit Grid</h5>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-48 overflow-y-auto custom-scrollbar text-left">
                    {mccmncBreakdown.map((item, idx) => (
                      <div key={idx} className="p-4 grid grid-cols-12 gap-2 text-xs items-center hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors text-left font-sans">
                        <div className="col-span-4 font-bold text-zinc-800 dark:text-zinc-200 leading-snug text-left">
                          {item.code.split(' - ')[0]}
                          <span className="block text-[10px] text-zinc-400 font-medium text-left">{item.code.split(' - ')[1]}</span>
                        </div>
                        <div className="col-span-2 font-mono text-[11px] text-zinc-500 text-left">
                          {item.volume.toLocaleString()} SMS
                        </div>
                        <div className="col-span-3 text-[10px] font-medium leading-none text-zinc-500 text-left">
                          <span className="block text-left">Orig Rate: <span className="font-bold font-mono text-zinc-700 dark:text-zinc-300">${item.originalPrice.toFixed(4)}</span></span>
                          <span className="block mt-1 text-left">Corr Rate: <span className="font-bold font-mono text-[#428bca]">${item.correctedPrice.toFixed(4)}</span></span>
                        </div>
                        <div className="col-span-3 text-right">
                          <span className="block font-mono font-bold text-[11px] text-zinc-700 dark:text-zinc-300 text-right">
                            Diff: {item.delta >= 0 ? '-' : '+'}${Math.abs(item.delta).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <span className={cn("text-[9px] font-bold uppercase text-right block", item.delta >= 0 ? "text-emerald-500" : "text-rose-500")}>
                            {item.delta >= 0 ? 'Credit' : 'Surcharge'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Accounting Confirmation Summary banner */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700/80 p-5 space-y-3 text-left">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider text-left">Statement of Account (SOA) Reconciliation Details</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium text-left">
                     Dispatched PDF file and credit log sheet will automatically align with Statement of Account ledger row for <span className="font-bold underline text-zinc-800 dark:text-zinc-100">{targetAccount}</span>. This adjustments amount will reconcile starting balances in next Billing period.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ViewReRating({ onClose, data }: { onClose: () => void; data: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-7xl w-full max-h-[95vh] flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">RE-RATING INFORMATION</h3>
        <div className="flex items-center gap-3">
          <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Approve</button>
          <button className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all">Reject</button>
          <button onClick={onClose} className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Back</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-8 space-y-12">
        <div className="grid grid-cols-2 gap-12 text-left">
          {/* Left Column */}
          <div className="space-y-4">
            {[
              { label: 'Re-Rating ID', value: data?.['RE-RATING ID'] || '24' },
              { label: 'Enterprise Type', value: data?.['Enterprise Type'] || 'Customer' },
              { label: 'Customer List', value: '2' },
              { label: 'Reprocess Reason', value: 'Rate Correction' },
            ].map(item => (
              <div key={item.label} className="grid grid-cols-2 gap-4">
                <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right">{item.label} :</span>
                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{item.value}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
               <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right">Priority :</span>
               <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">P1</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right px-20">Start Date :</span>
               <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">2026-01-09 00:00:00</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right">Request Status :</span>
               <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded w-fit uppercase">Approved</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {[
              { label: 'Description', value: data?.['Description'] || 'Rate Correction Jan' },
              { label: 'Rate Table List', value: '4' },
              { label: 'Requested By', value: data?.['Requested By'] || 'Admin' },
            ].map(item => (
              <div key={item.label} className="grid grid-cols-2 gap-4">
                <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right">{item.label} :</span>
                <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">{item.value}</span>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
               <span className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right">End Date :</span>
               <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">2026-01-09 23:59:59</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <h4 className="text-[12px] font-black uppercase text-[#428bca] border-b-2 border-[#428bca] pb-1 w-fit">Re-Rating Summary</h4>
           <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#f8f9fa] dark:bg-zinc-800 font-sans">
                    <tr>
                       {['ENTERPRISE NAME', 'TOTAL DLR', 'AMOUNT', 'TRANSACTION STATUS', 'ACTION'].map(h => (
                         <th key={h} className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-200 dark:border-zinc-700 last:border-r-0">{h}</th>
                       ))}
                    </tr>
                 </thead>
                 <tbody>
                    <tr>
                       <td colSpan={5} className="px-3 py-10 text-center text-[11px] font-bold text-zinc-400">No data available in table</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

export function AddIMAPAccountForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <Mail className="w-4 h-4 text-[#428bca]" />
           <h3 className="text-[12px] font-bold text-[#428bca] uppercase tracking-wider">Add IMAP Account</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="col-span-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest pb-1 border-b border-zinc-100 dark:border-zinc-800">General Configuration</h4>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Account Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. Gmail - Sales" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca] focus:ring-1 focus:ring-[#428bca]/20" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Mail Provider</label>
            <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
              <option>Gmail</option>
              <option>Outlook / Office 365</option>
              <option>Yahoo</option>
              <option>Custom IMAP</option>
            </select>
          </div>
          
          <div className="col-span-2 mt-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest pb-1 border-b border-zinc-100 dark:border-zinc-800">IMAP Server Settings</h4>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">IMAP Server Host <span className="text-red-500">*</span></label>
            <input type="text" placeholder="imap.gmail.com" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">IMAP Port <span className="text-red-500">*</span></label>
            <input type="text" placeholder="993" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Encryption Type</label>
            <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
              <option>SSL/TLS</option>
              <option>STARTTLS</option>
              <option>None</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Check Interval (Mins)</label>
            <input type="number" defaultValue="5" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>

          <div className="col-span-2 mt-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest pb-1 border-b border-zinc-100 dark:border-zinc-800">Authentication & Sync</h4>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Auth Email / Username <span className="text-red-500">*</span></label>
            <input type="email" placeholder="example@gmail.com" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">App Password / Secret <span className="text-red-500">*</span></label>
            <input type="password" placeholder="••••••••••••" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Target Folder</label>
            <input type="text" placeholder="INBOX" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
          <div className="col-span-2">
             <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-[#428bca]" />
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Mark processed emails as Read</span>
             </label>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#428bca] hover:bg-[#428bca]/5 rounded-lg transition-colors border border-[#428bca]/20 font-sans">Test Connection</button>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Cancel</button>
          <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans">Save Account</button>
        </div>
      </div>
    </div>
  );
}

export function AddFileTemplateForm({ onClose, theme }: FormProps) {
  const [fileType, setFileType] = useState('XLSX');
  
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-4xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <FileCode className="w-4 h-4 text-[#428bca]" />
           <h3 className="text-[12px] font-bold text-[#428bca] uppercase tracking-wider">Add File Template</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 grid grid-cols-3 gap-6">
        {/* Basic Config */}
        <div className="col-span-3 grid grid-cols-3 gap-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Template Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. Alpha Vendor XLSX" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">File Format</label>
            <select 
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]"
            >
              <option>XLSX</option>
              <option>CSV</option>
              <option>TXT</option>
              <option>XLS</option>
            </select>
          </div>
           {/* SMS Wholesale Specific Fields */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Routing Type</label>
            <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
              <option>Direct</option>
              <option>Aggregator</option>
              <option>Mixed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Date Format</label>
            <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
              <option>YYYY-MM-DD</option>
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD HH:mm:ss</option>
            </select>
          </div>
          {fileType === 'CSV' && (
             <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Delimiter</label>
                <input type="text" placeholder="," className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
             </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Billing Increment</label>
             <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
              <option>1/1 (Per Second)</option>
              <option>6/6 (Six Seconds)</option>
              <option>1/6 (One/Six)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Header Skip Rows</label>
            <input type="number" defaultValue="1" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
           <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Footer Skip Rows</label>
            <input type="number" defaultValue="0" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
          </div>
        </div>

        {/* Column Mapping Section */}
        <div className="col-span-3 pt-2">
           <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Column Mappings
           </h4>
           <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              {[
                { label: 'MCC', placeholder: 'Col A or 0' },
                { label: 'MNC', placeholder: 'Col B or 1' },
                { label: 'MCCMNC', placeholder: 'Col C' },
                { label: 'Country Name', placeholder: 'Col D' },
                { label: 'Network Name', placeholder: 'Col E' },
                { label: 'Rate (Price)', placeholder: 'Col F' },
                { label: 'Currency', placeholder: 'Col G' },
                { label: 'Effective Date', placeholder: 'Col H' },
                { label: 'Quality / Grade', placeholder: 'Col I' },
                { label: 'MCCMNC Description', placeholder: 'Col J' },
              ].map(mapping => (
                <div key={mapping.label} className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-bold text-zinc-500 uppercase">{mapping.label}</label>
                   <input type="text" placeholder={mapping.placeholder} className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] outline-none focus:border-[#428bca]" />
                </div>
              ))}
           </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#428bca] hover:bg-[#428bca]/5 rounded-lg transition-colors border border-[#428bca]/20 font-sans mr-auto">Auto Detect from Sample</button>
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans">Save Template</button>
      </div>
    </div>
  );
}

export function SupplierRateLookupPopup({ supplierName, onClose, accountName, productName, category, onAdd }: { supplierName: string; accountName?: string; productName?: string; category?: string; onClose: () => void; onAdd?: (acc: any) => void }) {
  const mockRates = [
    { 
      country: 'India', 
      mccmnc: '40401', 
      sellingPrice: '0.0055', 
      ratePlanTable: 'Premium_WHS_IN', 
      buyingPrice: '0.0042', 
      supplierAccount: 'Alpha_IND_Direct', 
      supplierName: 'Alpha Telecom', 
      productName: 'Enterprise_SMS_IN', 
      productCategory: 'DIRECT', 
      netMargin: '23.6', 
      status: 'Active' 
    },
    { 
      country: 'United Kingdom', 
      mccmnc: '23415', 
      sellingPrice: '0.0150', 
      ratePlanTable: 'Standard_UK', 
      buyingPrice: '0.0120', 
      supplierAccount: 'Hub_UK_Direct', 
      supplierName: 'Global Hub', 
      productName: 'Enterprise_SMS_UK', 
      productCategory: 'HQ', 
      netMargin: '20.0', 
      status: 'Active' 
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-6xl w-full flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex flex-col text-left">
          <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Advanced Rate Intelligence</h3>
          <span className="text-[10px] font-bold text-zinc-400">CONTEXT: {supplierName}{accountName ? ` / ${accountName}` : ''}</span>
        </div>
        <div className="flex items-center gap-3">
          {onAdd && (
            <button 
              onClick={() => onAdd({ vendor: supplierName, account: accountName || supplierName })}
              className="px-4 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add to Route
            </button>
          )}
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex gap-2 mb-4">
          <div className="flex h-9 flex-1">
             <input type="text" placeholder="Filter by Country, MCCMNC, Product or Supplier..." className="flex-1 px-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-l text-xs outline-none" />
             <button className="px-4 bg-[#428bca] text-white rounded-r text-[10px] font-black uppercase">Deep Scan</button>
          </div>
          <button className="px-4 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-black uppercase text-zinc-500 hover:bg-zinc-50 flex items-center gap-2 transition-all">
             <Download className="w-3.5 h-3.5" /> Intelligence Export
          </button>
        </div>

        <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead className="bg-[#f8f9fa] dark:bg-zinc-800 sticky top-0 z-10">
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                {[
                  'Country', 
                  'MCC-MNC', 
                  'Selling price', 
                  'Rate plan table', 
                  'Buying price', 
                  'Supplier account', 
                  'Supplier name', 
                  'Product name', 
                  'Product category', 
                  'Net Margin (%)', 
                  'Status'
                ].map(h => (
                  <th key={h} className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {mockRates.map((row, i) => (
                <tr key={i} className="text-[10px] hover:bg-[#428bca]/5 transition-colors group">
                  <td className="px-4 py-3 font-black text-zinc-900 dark:text-zinc-100 uppercase">{row.country}</td>
                  <td className="px-4 py-3 font-mono font-bold text-zinc-500">{row.mccmnc}</td>
                  <td className="px-4 py-3 font-mono font-black text-emerald-600">${row.sellingPrice}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-bold">{row.ratePlanTable}</td>
                  <td className="px-4 py-3 font-mono font-black text-[#428bca]">${row.buyingPrice}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-bold">{row.supplierAccount}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{row.supplierName}</td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 font-bold italic">{row.productName}</td>
                  <td className="px-4 py-3">
                     <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded text-[8px] font-black">{row.productCategory}</span>
                  </td>
                  <td className="px-4 py-3">
                     <span className={cn(
                       "px-2 py-1 rounded text-[9px] font-black",
                       parseFloat(row.netMargin) > 20 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                     )}>
                        {row.netMargin}%
                     </span>
                  </td>
                  <td className="px-4 py-3">
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black uppercase text-zinc-400">{row.status}</span>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-8 py-2 bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-black transition-all">Close Pipeline View</button>
      </div>
    </div>
  );
}

export function BulkRateUpdateForm({ onClose, theme }: FormProps) {
  const [action, setAction] = useState('Set Fixed Rate');
  const [value, setValue] = useState('0.0050');
  const [mccmncFilter, setMccmncFilter] = useState('');
  const [autoUpdateCustAlerts, setAutoUpdateCustAlerts] = useState(true);
  const [notifyCustomers, setNotifyCustomers] = useState(true);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewChanges = () => {
    // Generate simulated changes base on current variables
    const val = parseFloat(value) || 0.0010;
    const baseList = [
      { country: 'India Airtel', mccmnc: '40401', prevRate: 0.0012 },
      { country: 'India Jio', mccmnc: '40405', prevRate: 0.0011 },
      { country: 'UK Vodafone', mccmnc: '23415', prevRate: 0.0055 },
      { country: 'UAE Etisalat', mccmnc: '42402', prevRate: 0.0120 },
    ];

    const results = baseList.map(item => {
      let revised = 0;
      if (action === 'Set Fixed Rate') {
        revised = val;
      } else if (action === 'Increase by Value') {
        revised = item.prevRate + val;
      } else if (action === 'Decrease by Value') {
        revised = Math.max(0.0001, item.prevRate - val);
      } else { // Apply Percentage Margin
        revised = item.prevRate * (1 + val / 100);
      }

      const diff = revised - item.prevRate;
      const pct = (diff / item.prevRate) * 100;

      return {
        ...item,
        revisedRate: revised.toFixed(4),
        prevRateStr: item.prevRate.toFixed(4),
        percent: pct.toFixed(1),
        isIncrease: diff >= 0
      };
    });

    setPreviewRows(results);
    setShowPreview(true);
  };

  const handleApply = () => {
    alert(
      `================ BULK RATING PIPELINE SUCCESS ================\n\n` +
      `✔ Applied Action : ${action}\n` +
      `✔ Revision Delta : ${value}\n` +
      `✔ Affected Hubs  : 2 Rate Tables\n` +
      `✔ Target Range   : ${mccmncFilter ? `MCCMNC [${mccmncFilter}]` : 'Global Decks'}\n\n` +
      `--------------------- E-Mail Notification logs ---------------------\n` +
      `${notifyCustomers ? `✔ Generated personalized pricing tables.\n✔ Sent revised deck alerts to 42 Customer Billing departments.\n` : 'Bypassed client notifications.\n'}` +
      `--------------------------------------------------------------------\n\n` +
      `Bulk rates propagation successfully synchronized!`
    );
    onClose();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-4xl w-full flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">BULK RATE UPDATE & MARGIN</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh]">
        {/* Step 1: Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="w-5 h-5 bg-[#428bca] text-white flex items-center justify-center rounded-full text-[8px]">1</span>
            Target Selection
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Rate Table(s)</label>
              <select multiple defaultValue={["GABS_DIR_IN (23)"]} className="w-full h-32 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                <option>GABS_DIR_IN (23)</option>
                <option>Hasan_DIR_IN (25)</option>
                <option>Global_WHS (30)</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Filter by MCCMNC</label>
                <input 
                  type="text" 
                  value={mccmncFilter}
                  onChange={(e) => setMccmncFilter(e.target.value)}
                  placeholder="e.g. 404, 405 (Empty for all)" 
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" 
                />
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded" 
                    checked={autoUpdateCustAlerts}
                    onChange={(e) => setAutoUpdateCustAlerts(e.target.checked)}
                  />
                  <span className="text-[11px] font-bold text-zinc-600">Update related Customer Rates automatically</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Rate Logic */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="w-5 h-5 bg-[#428bca] text-white flex items-center justify-center rounded-full text-[8px]">2</span>
            Update Logic
          </div>
          <div className="grid grid-cols-3 gap-6">
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Action</label>
                <select 
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none"
                >
                  <option>Set Fixed Rate</option>
                  <option>Increase by Value</option>
                  <option>Decrease by Value</option>
                  <option>Apply Percentage Margin</option>
                </select>
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Value / Margin</label>
                <input 
                  type="number" 
                  step="0.0001" 
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-mono" 
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase">Effective From</label>
                <input type="datetime-local" className="w-[#95%] px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" defaultValue="2026-05-20T12:00" />
             </div>
          </div>
        </div>

        {/* Step 3: Notification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <span className="w-5 h-5 bg-[#428bca] text-white flex items-center justify-center rounded-full text-[8px]">3</span>
            Customer Notifications
          </div>
          <div className="bg-amber-50/50 dark:bg-amber-500/5 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30 space-y-4">
             <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifyCustomers} 
                    onChange={(e) => setNotifyCustomers(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600" 
                  />
                  <span className="text-[11px] font-black text-amber-700 uppercase">Notify Customers about these changes</span>
                </label>
             </div>
             {notifyCustomers && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                     <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                       <input type="checkbox" defaultChecked /> Attach Updated Rate File
                     </label>
                     <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                       <input type="checkbox" defaultChecked /> Include Difference Analysis
                     </label>
                  </div>
                  <textarea rows={3} className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-amber-200 dark:border-zinc-700 rounded text-[11px] outline-none" defaultValue={`Dear Customer,\n\nPlease find attached the updated rates for your account effective from [Date].\n\n- Standard Bulk SMS rates revised.`} />
                </>
             )}
          </div>
        </div>

        {/* Simulated Preview Section */}
        {showPreview && (
          <div className="space-y-4 border border-zinc-100 dark:border-zinc-800 p-4 rounded-xl animate-in slide-in-from-bottom-2">
            <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b pb-2">Difference Analysis Output</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-[9px] uppercase font-black text-zinc-500">
                    <th className="p-2">Country Target</th>
                    <th className="p-2 text-center">MCCMNC</th>
                    <th className="p-2 text-right">Current ($)</th>
                    <th className="p-2 text-right">Proposed ($)</th>
                    <th className="p-2 text-right">Change (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                  {previewRows.map((p, i) => (
                    <tr key={i} className="text-[11px] hover:bg-zinc-50 dark:hover:bg-zinc-800/10 font-mono">
                      <td className="p-2 font-sans font-bold text-zinc-700 dark:text-zinc-300">{p.country}</td>
                      <td className="p-2 text-center text-zinc-500">{p.mccmnc}</td>
                      <td className="p-2 text-right text-zinc-400">${p.prevRateStr}</td>
                      <td className="p-2 text-right text-blue-600 font-bold">${p.revisedRate}</td>
                      <td className={`p-2 text-right font-bold ${p.isIncrease ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {p.isIncrease ? '↑' : '↓'} {p.percent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={handlePreviewChanges} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-[#428bca] border border-blue-100 hover:bg-blue-50/20 rounded-lg">Preview Changes</button>
        <button onClick={handleApply} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-blue-605 active:scale-95 transition-all">Apply & Send</button>
      </div>
    </div>
  );
}

export const ProductDNAView = (props: any) => {
  const {
    showSupplierPopup,
    contentCondition,
    contentText,
    revenueSetting,
    minQualityDlr,
    asrThreshold,
    lcrPolicyName,
    lcrPolicyType,
    lcrRuleName,
    lcrRuleRemarks,
    lcrSmsAttribute,
    lcrSmsCondition,
    lcrSmsValue,
    lcrFromTime,
    lcrToTime,
    lcrRemarks,
    productRules,
    onClose,
    productName,
    failoverNodes,
    assignedRegions,
    mccmncMatrix,
    currency,
    routingStrategy,
    purchasePrice,
    sellingPrice
  } = props;
  
  const [prefix, setPrefix] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [activeSection, setActiveSection] = useState('01');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const sections = [
    { id: '01', title: 'Product DNA' },
    { id: '04', title: 'Carrier Mesh' },
    { id: '05', title: 'Operator Node' },
    { id: '06', title: 'Market Logic' },
    { id: '07', title: 'LCR Intelligence' },
    { id: '09', title: 'Compliance' },
    { id: '10', title: 'LCR Policies' },
    { id: '11', title: 'Filter Topology' },
    { id: '12', title: 'Rule Matrix' }
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAnalyze = () => {
    if (!prefix) return;
    setIsAnalyzing(true);
    setShowSuggestion(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowSuggestion(true);
    }, 1500);
  };
  
  return (
    <div className="bg-zinc-50 dark:bg-black w-full min-h-screen fixed inset-0 z-50 overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-300">
         {/* Top Branding Bar */}
         <div className="px-10 py-6 bg-zinc-900 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-[#428bca] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 rotate-3">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white italic">{productName || 'PRODUCT_GENOME_ANALYSIS'}</h2>
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Biometric Product DNA & Routing Sequence View</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Topology Live</span>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                    <X className="w-6 h-6 text-white/50" />
                </button>
            </div>
         </div>

         <div className="flex-1 flex overflow-hidden">
            {/* Left Sticky Navigation */}
            <div className="w-72 bg-zinc-950 border-r border-white/5 p-8 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
                <div className="space-y-12">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-4 border-l-2 border-zinc-800">Sequence Map</p>
                      <div className="space-y-2">
                         {sections.map(section => (
                            <button 
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={cn(
                                    "w-full text-left px-5 py-3.5 rounded-2xl transition-all flex items-center justify-between group",
                                    activeSection === section.id 
                                        ? "bg-[#428bca] text-white shadow-xl shadow-blue-500/20 translate-x-2" 
                                        : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                                )}
                            >
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest italic",
                                    activeSection === section.id ? "opacity-100" : "opacity-60"
                                )}>
                                    {section.id} | {section.title}
                                </span>
                                {activeSection === section.id ? <ArrowRight className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl space-y-3">
                        <Zap className="w-5 h-5 text-amber-500" />
                        <p className="text-[11px] font-black text-zinc-300 uppercase tracking-tighter">AI Insight</p>
                        <p className="text-[10px] font-bold text-zinc-500 italic leading-relaxed uppercase tracking-tighter">
                            Topology suggests 3% growth in delivery performance by enabling LCR prime node failover on sequence 05.
                        </p>
                   </div>
                </div>
            </div>

            {/* Right Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative px-12 py-12 scroll-smooth" ref={scrollRef}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
                <div className="max-w-5xl mx-auto space-y-20 relative z-10 pb-32">
                    {/* Section 01: Product Identity Node */}
                    <section id="section-01" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-[#428bca] rounded-full" />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">01 | PRODUCT IDENTITY & GENOME</h3>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono italic">Product DNA Alias</p>
                                    <p className="text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter uppercase italic">{productName}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="px-5 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Currency</p>
                                        <p className="text-sm font-black text-[#428bca]">{currency}</p>
                                    </div>
                                    <div className="px-5 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                                        <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">Market Segment</p>
                                        <p className="text-sm font-black text-purple-500 italic">Wholesale Prime</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-2 group transition-all hover:border-[#428bca]/50">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Global Status</p>
                                    <p className="text-xl font-black text-white italic">PROVISIONED</p>
                                    <div className="w-2 h-2 bg-[#428bca] rounded-full animate-pulse" />
                                </div>
                                <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-2 group transition-all hover:border-emerald-500/50">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Routing Ready</p>
                                    <p className="text-xl font-black text-white italic">OPTIMIZED</p>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 04: Carrier Mesh Reach */}
                    <section id="section-04" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">04 | CARRIER CONNECTIVITY MESH</h3>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 space-y-8 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {assignedRegions?.map((reg: any) => (
                                    <div key={reg.country} className="p-6 bg-white dark:bg-zinc-800 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 space-y-3 relative group">
                                        <div className="flex justify-between items-start">
                                            <Globe2 className="w-5 h-5 text-[#428bca]" />
                                            <span className="text-[8px] font-black text-zinc-400 italic">SECURE_NODE</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase">{reg.country}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 mt-1">{reg.codes?.length || 0} Carriers Bound</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {reg.codes?.slice(0, 3).map((code: string) => (
                                                <span key={code} className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900 rounded-md text-[8px] font-mono text-zinc-500 border border-zinc-100 dark:border-zinc-800">{code}</span>
                                            ))}
                                            {reg.codes?.length > 3 && <span className="text-[8px] font-black text-[#428bca] ml-1">+{reg.codes.length - 3}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 05: Operator Node Chain */}
                    <section id="section-05" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">05 | OPERATOR NODE FAILOVER CHAIN</h3>
                        </div>
                        <div className="bg-zinc-950 p-10 rounded-[3rem] border border-[#428bca]/10 space-y-12 relative overflow-hidden text-left">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#428bca]/5 blur-[120px] rounded-full" />
                            
                            <div className="space-y-6 relative z-10">
                                {failoverNodes?.map((node: any, idx: number) => (
                                    <div key={`${node.vendor}-${node.account}`} className="flex items-center gap-8 group">
                                        <div className="flex flex-col items-center gap-4 relative">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all shadow-xl",
                                                node.isPrimary 
                                                    ? "bg-[#428bca] text-white scale-110 shadow-blue-500/20" 
                                                    : "bg-zinc-900 text-zinc-500 border border-white/5"
                                            )}>
                                                {node.isPrimary ? <Zap className="w-6 h-6 fill-white" /> : idx + 1}
                                            </div>
                                            {idx < failoverNodes.length - 1 && (
                                                <div className="w-0.5 h-16 bg-gradient-to-b from-zinc-800 to-transparent" />
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 p-8 bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-[2rem] flex justify-between items-center group-hover:bg-zinc-900 transition-all shadow-2xl relative">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-lg font-black text-white italic">{node.account}</h4>
                                                    <span className="px-3 py-1 bg-white/5 text-zinc-500 rounded-full text-[8px] font-black uppercase tracking-widest">{node.vendor}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic">
                                                    {node.isPrimary ? 'Primary Optimized Route' : `Failover Tier ${node.priority} Node`}
                                                </p>
                                            </div>
                                            
                                            <div className="flex items-center gap-12 text-right">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Holding Time</p>
                                                    <p className="text-sm font-black text-amber-500 italic">{node.holdingTime}s</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Weighting</p>
                                                    <p className="text-sm font-black text-emerald-500 italic">{node.weighting}%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Section 06: Market Pricing Logic */}
                    <section id="section-06" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">06 | MARKET PRICING & FINANCIAL TOPOLOGY</h3>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3.5rem] border border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-16 items-center text-left">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase italic">Routing Strategy</p>
                                    <p className="text-2xl font-black text-[#428bca] italic leading-tight uppercase tracking-tighter">{revenueSetting || 'LCR_DLR_OPTIMIZED'}</p>
                                </div>
                                <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl space-y-1">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase italic">Financial Mode</p>
                                    <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase italic">DYNAMIC_MARGIN_ADJUST</p>
                                </div>
                            </div>
                            
                            <div className="md:col-span-2 grid grid-cols-2 gap-10">
                                <div className="p-10 bg-zinc-950 rounded-[3rem] border border-zinc-900 space-y-4 group transition-all hover:border-emerald-500/30">
                                    <div className="flex justify-between items-center">
                                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Buy Rate</p>
                                         <ArrowDownLeft className="w-5 h-5 text-emerald-500/50" />
                                    </div>
                                    <p className="text-4xl font-black text-white italic tracking-tighter font-mono">${purchasePrice || '0.00000'}</p>
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase italic">Effective Network Cost</p>
                                </div>
                                <div className="p-10 bg-zinc-950 rounded-[3rem] border border-zinc-900 space-y-4 group transition-all hover:border-[#428bca]/30 shadow-2xl">
                                    <div className="flex justify-between items-center">
                                         <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Sell Rate</p>
                                         <ArrowUpRight className="w-5 h-5 text-[#428bca]/50" />
                                    </div>
                                    <p className="text-4xl font-black text-[#428bca] italic tracking-tighter font-mono">${sellingPrice || '0.00000'}</p>
                                    <p className="text-[9px] font-bold text-zinc-600 uppercase italic">Proposed Wholesale Exit</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 07: LCR Analysis Intelligence */}
                    <section id="section-07" className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">07 | LCR DYNAMICS & ROUTE INTELLIGENCE</h3>
                        </div>
                        <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 text-left">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                {[
                                    { label: 'Quality Threshold', value: '98.5%', icon: ShieldCheck, color: 'text-emerald-500' },
                                    { label: 'Fail Rate Limit', value: '1.5%', icon: Activity, color: 'text-rose-500' },
                                    { label: 'Node Rotation', value: '300s', icon: RotateCcw, color: 'text-amber-500' },
                                    { label: 'Auto Scaling', value: 'ON', icon: Zap, color: 'text-[#428bca]' }
                                ].map(stat => (
                                    <div key={stat.label} className="p-8 bg-white dark:bg-zinc-800 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-4 shadow-sm group hover:-translate-y-1 transition-all">
                                        <stat.icon className={cn("w-6 h-6", stat.color)} />
                                        <div>
                                            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 italic">{stat.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

        {/* Section 9: Content Wise Information */}
        <section id="section-09" className="space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-zinc-400 rounded-full" />
              <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500">09 | CONTENT RIGIDITY & COMPLIANCE</h3>
           </div>

           <div className="bg-zinc-50 dark:bg-zinc-900 p-10 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
               <div className="space-y-6">
                  <div className="flex flex-col gap-1">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono">REJECTION LOGIC</p>
                     <p className="text-xs font-bold text-zinc-400 italic">Static content filtering and pattern matching</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {['REGEX_ANALYSIS', 'ALPHANUM_ONLY', 'PATTERN_LOCK'].map(tag => (
                        <span key={tag} className="px-4 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[9px] font-black text-zinc-400 tracking-widest uppercase">
                           {tag}
                        </span>
                     ))}
                  </div>
                  <div className="p-6 bg-white dark:bg-zinc-800 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 space-y-3 shadow-sm group">
                     <div className="flex items-center justify-between">
                        <p className="text-[11px] font-black text-rose-500 uppercase flex items-center gap-2">
                           <Shield className="w-4 h-4" /> REJECTION FILTER
                        </p>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase italic">Active Policy</span>
                     </div>
                     <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                        <p className="text-[9px] font-black text-rose-400 uppercase tracking-tighter">CONDITION: {contentCondition}</p>
                        <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-mono break-all leading-relaxed">
                           {contentText || 'NO CONTENT REJECTION BLOCK DEFINED.'}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono text-left">COMPLIANCE METRICS</p>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2 group hover:border-rose-500/50 transition-all">
                        <Timer className="w-6 h-6 text-rose-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div>
                           <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">STRICTNESS</p>
                           <p className="text-xl font-black text-rose-500 tracking-tighter">HEAVY</p>
                        </div>
                     </div>
                     <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2 group hover:border-[#428bca]/50 transition-all">
                        <Zap className="w-6 h-6 text-[#428bca] opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div>
                           <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">DLR FEED</p>
                           <p className="text-xl font-black text-[#428bca] tracking-tighter">ENABLED</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Section 10: LCR Information */}
         <section id="section-10" className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-zinc-900 dark:bg-white rounded-full" />
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white">10 | LCR INTELLIGENCE & POLICIES</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
               <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] space-y-6">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">10.1 | SELECTION STRATEGY</p>
                     <div className="p-6 bg-[#428bca] text-white rounded-3xl shadow-xl shadow-[#428bca]/20 text-center space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-[0.2em]">{revenueSetting}</h4>
                        <p className="text-[9px] font-bold text-white/70 italic uppercase">Global Selector Logic</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                           <p className="text-[8px] font-black text-zinc-400 uppercase">Min DLR</p>
                           <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">{minQualityDlr}%</p>
                        </div>
                        <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-center">
                           <p className="text-[8px] font-black text-zinc-400 uppercase">Min ASR</p>
                           <p className="text-lg font-black text-zinc-900 dark:text-zinc-100">{asrThreshold}%</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-2 p-8 bg-zinc-900 text-white rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full space-y-8">
                     <div className="flex justify-between items-start">
                        <div className="space-y-1">
                           <h4 className="text-lg font-black uppercase tracking-tight">Rules Based Price Discovery</h4>
                           <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Real-time Topo Matching</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                           <Zap className="w-6 h-6" />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                           <div className="space-y-2 text-left">
                              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Target Prefix</label>
                              <input 
                                 type="text" 
                                 value={prefix}
                                 onChange={(e) => setPrefix(e.target.value)}
                                 placeholder="e.g. 404... or 310..."
                                 className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black outline-none focus:border-amber-500 transition-all font-mono"
                              />
                           </div>
                           <button 
                             onClick={handleAnalyze}
                             className="w-full py-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl active:scale-95 transition-all"
                           >Discover Optimal Source</button>
                        </div>

                        <div className="p-6 bg-black/40 rounded-[2rem] border border-white/5 min-h-[140px] flex flex-col justify-center text-left">
                           {showSuggestion ? (
                              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
                                 <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">Solution Identified</p>
                                 <p className="text-[11px] font-bold text-zinc-300 leading-relaxed italic">
                                    Optimal route for {prefix} is <span className="text-white font-black not-italic uppercase">Direct_Prime_Node</span> at <span className="text-emerald-500 font-mono tracking-tighter not-italic">$0.00312</span>
                                 </p>
                              </div>
                           ) : (
                              <div className="text-center opacity-30 space-y-2 py-4">
                                 <BarChart3 className="w-8 h-8 mx-auto" />
                                 <p className="text-[8px] font-black uppercase tracking-widest">Awaiting Simulation Data</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Section 11: Others Information */}
         <section id="section-11" className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
               <div className="w-1.5 h-6 bg-[#428bca] rounded-full" />
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#428bca]">11 | FILTER TOPOLOGY & EXTENSIONS</h3>
            </div>
            
            <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
               <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-2 border-l-2 border-[#428bca] pl-5">
                        <p className="text-[10px] font-black text-zinc-400 uppercase font-mono tracking-tighter">LCR POLICY</p>
                        <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase">{lcrPolicyName || 'MESH_DEFAULT_01'}</p>
                     </div>
                     <div className="space-y-2 border-l-2 border-rose-500 pl-5">
                        <p className="text-[10px] font-black text-zinc-400 uppercase font-mono tracking-tighter">ACTION MODE</p>
                        <p className={cn(
                           "text-sm font-black uppercase italic",
                           lcrPolicyType === 'Allow' ? "text-emerald-500" : "text-rose-500"
                        )}>{lcrPolicyType || 'RESTRICT'}</p>
                     </div>
                  </div>

                  <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-6 shadow-2xl relative overflow-hidden group">
                     <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <p className="text-[10px] font-black text-[#428bca] uppercase tracking-widest">Active Verification DNS</p>
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                     </div>
                     
                     <div className="space-y-4">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                           <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Rule Reference</p>
                           <p className="text-xs font-black text-white">{lcrRuleName || 'STANDARD_FILTER_01'}</p>
                        </div>
                        <div className="flex items-start gap-3 p-5 bg-white/5 rounded-2xl border border-white/5">
                           <Info className="w-4 h-4 text-[#428bca] shrink-0 mt-0.5" />
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Rule Heuristics</p>
                              <p className="text-[10px] font-bold text-zinc-400 italic leading-relaxed">{lcrRuleRemarks || 'Global product policy inherited from parent mesh group.'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-zinc-800 space-y-6">
                     <p className="text-[10px] font-black text-[#428bca] uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4" /> Attributes Audit
                     </p>
                     <div className="space-y-5">
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-500">
                              <span>{lcrSmsAttribute}</span>
                              <span className="text-emerald-500 italic">{lcrSmsCondition}</span>
                           </div>
                           <div className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-[9px] text-zinc-400 break-all leading-loose">
                              VAL: {lcrSmsValue || 'WILDCARD_MATCH'}
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-500">
                              <span>Temporal Constraint</span>
                              <span className="text-amber-500 italic">Within Window</span>
                           </div>
                           <div className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5 text-[9px] text-zinc-400 font-mono">
                              <span className="flex-1 text-center">[{lcrFromTime || '00:00'}]</span>
                              <span className="opacity-20">→</span>
                              <span className="flex-1 text-center">[{lcrToTime || '23:59'}]</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="p-8 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-3">
                        <Edit2 className="w-4 h-4 text-zinc-100 group-hover:text-[#428bca] transition-colors" />
                     </div>
                     <p className="text-[10px] font-black text-zinc-400 uppercase mb-3">Genome Remarks</p>
                     <p className="text-[11px] font-bold text-zinc-600 italic leading-relaxed">
                        {lcrRemarks || 'Comprehensive product genome view providing deep visibility into routing, financial, and compliance topology.'}
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* Section 12: Rule Matrix information */}
         <section id="section-12" className="space-y-6 pb-12">
            <div className="flex items-center gap-3 text-left">
               <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
               <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-900 dark:text-white italic">12 | LOGIC RULE MATRIX</h3>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl text-left">
               <table className="w-full text-left border-collapse">
                   <thead className="bg-zinc-50/50 dark:bg-zinc-800/50 text-left">
                       <tr>
                           <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Priority</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Rule Name</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Logic Type</th>
                           <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Status</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-left">
                       {productRules?.map((rule: any) => (
                           <tr key={rule.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                               <td className="px-8 py-5">
                                   <span className="px-3 py-1 bg-zinc-900 text-white text-[10px] font-black rounded-lg">{rule.priority}</span>
                               </td>
                               <td className="px-8 py-5">
                                   <div className="flex flex-col text-left">
                                       <p className="text-[12px] font-black text-zinc-900 dark:text-zinc-100 uppercase italic leading-tight">{rule.name}</p>
                                       <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5 font-mono italic">UID: {rule.id}-{Math.random().toString(36).substr(2, 4)}</p>
                                   </div>
                               </td>
                               <td className="px-8 py-5">
                                   <span className={cn(
                                       "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/20",
                                       rule.type === 'Direct' ? "bg-blue-500/5 text-blue-500" : "bg-purple-500/5 text-purple-500"
                                   )}>
                                       {rule.type}
                                   </span>
                               </td>
                               <td className="px-8 py-5 text-left">
                                   <div className="flex items-center gap-2">
                                       <div className={cn("w-1.5 h-1.5 rounded-full", rule.status === 'Active' ? "bg-emerald-500" : "bg-rose-500")} />
                                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400">{rule.status}</span>
                                   </div>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
            </div>
         </section>

                </div>
            </div>
         </div>

      {/* Global Action Rack */}
      <div className="p-10 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex justify-between items-center relative z-20 shrink-0">
         <div className="flex items-center gap-6">
            <div className="flex -space-x-3">
               {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-400 shadow-xl overflow-hidden"><User className="w-5 h-5" /></div>)}
            </div>
            <div>
               <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Shared DNA Protocol</p>
               <p className="text-[9px] font-bold text-zinc-400 italic">Configuration visible to global routing nodes</p>
            </div>
         </div>
         
         <div className="flex gap-4">
            <button onClick={() => window.print()} className="px-8 py-4 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 text-[11px] font-black uppercase tracking-widest rounded-[1.5rem] border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Download Blueprint
            </button>
            <button 
              onClick={onClose}
              className="px-12 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.5rem] shadow-2xl hover:scale-[1.03] transition-all flex items-center gap-3 active:scale-95"
            >
              CLOSE DNA VIEW
            </button>
         </div>
      </div>
      
      {/* Detail Popup Overlay */}
      {showSupplierPopup && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70 backdrop-blur-md p-6 font-sans">
           <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
           >
              {/* Popup Header */}
              <div className="px-10 py-8 bg-zinc-900 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#428bca]/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 bg-[#428bca] rounded-2xl flex items-center justify-center shadow-2xl rotate-3">
                       <Landmark className="w-8 h-8 text-white" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black uppercase tracking-[0.2em]">{showSupplierPopup.name} NODE PROFILE</h4>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">GENOMIC SEQUENCE: {showSupplierPopup.account}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => setShowSupplierPopup(null)}
                   className="p-4 hover:bg-white/10 rounded-3xl transition-all group relative z-10"
                 >
                    <X className="w-8 h-8 text-white/50 group-hover:text-rose-500 transition-colors" />
                 </button>
              </div>

              {/* Popup Content */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-zinc-50/50 dark:bg-zinc-950/50">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
                    {/* Stats & Core Info */}
                    <div className="lg:col-span-2 space-y-10">
                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {[
                            { label: 'Latency', value: '42ms', icon: Timer, color: 'text-emerald-500' },
                            { label: 'Quality', value: '99.2%', icon: CheckCircle2, color: 'text-[#428bca]' },
                            { label: 'TPS Cap', value: '500', icon: Zap, color: 'text-amber-500' },
                            { label: 'Uptime', value: '99.99%', icon: Shield, color: 'text-indigo-500' }
                          ].map(stat => (
                            <div key={stat.label} className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center gap-1">
                               <stat.icon className={cn("w-4 h-4 mb-1", stat.color)} />
                               <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{stat.label}</p>
                               <p className="text-sm font-black text-zinc-800 dark:text-zinc-100 italic">{stat.value}</p>
                            </div>
                          ))}
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center justify-between px-2">
                             <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#428bca] font-mono">Topology Distribution</h5>
                             <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                                Real-time Grid Active
                             </div>
                          </div>
                          <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-xl">
                             <table className="w-full text-left border-collapse font-sans">
                                <thead className="bg-zinc-50 dark:bg-zinc-950">
                                   <tr>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-widest">Region</th>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-widest">MCCMNC</th>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-widest">Live Rate</th>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase text-zinc-400 italic tracking-widest">Status</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                   {[
                                     { c: 'United States', m: '310-120', r: '0.0042', s: 'OPTIMAL' },
                                     { c: 'United Kingdom', m: '234-10', r: '0.0150', s: 'STABLE' },
                                     { c: 'India', m: '404-01', r: '0.0011', s: 'OPTIMAL' },
                                     { c: 'Singapore', m: '525-01', r: '0.0085', s: 'STABLE' }
                                   ].map((row, idx) => (
                                     <tr key={idx} className="group hover:bg-[#428bca]/5 transition-all">
                                       <td className="px-8 py-4">
                                          <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-100 uppercase">{row.c}</p>
                                       </td>
                                       <td className="px-8 py-4">
                                          <p className="text-[11px] font-mono font-black text-[#428bca]">{row.m}</p>
                                       </td>
                                       <td className="px-8 py-4 tabular-nums">
                                          <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">${row.r}</p>
                                       </td>
                                       <td className="px-8 py-4">
                                          <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded italic">
                                             {row.s}
                                          </span>
                                       </td>
                                     </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                       </div>
                    </div>

                    {/* Routing Details Sidebar */}
                    <div className="space-y-6">
                       <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-8 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                             <Settings2 className="w-24 h-24 text-white" />
                          </div>
                          
                          <div className="space-y-2 relative z-10 text-left">
                             <p className="text-[9px] font-black text-[#428bca] uppercase tracking-widest">Routing Assignment</p>
                             <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-bold text-white uppercase italic">
                                   Role: {showSupplierPopup.details?.isPrimary ? 'PRIMARY_MASTER' : 'FAILOVER_SLAVE'}
                                </p>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 relative z-10">
                             <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5 space-y-1 text-left">
                                <p className="text-[8px] font-black text-zinc-500 uppercase">Priority Index</p>
                                <p className="text-lg font-black text-white">{showSupplierPopup.details?.priority !== undefined ? showSupplierPopup.details.priority + 1 : '1'}</p>
                             </div>
                             <div className="p-4 bg-zinc-800 rounded-2xl border border-white/5 space-y-1 text-left">
                                <p className="text-[8px] font-black text-zinc-500 uppercase">Holding Time</p>
                                <p className="text-lg font-black text-rose-500 font-mono italic">{showSupplierPopup.details?.holdingTime || '0'}s</p>
                             </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
                             <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold text-zinc-500 uppercase tracking-widest">Load Balancing</span>
                                <span className="font-black text-[#428bca] uppercase">{showSupplierPopup.details?.weighting || '100'}% Share</span>
                             </div>
                             <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold text-zinc-500 uppercase tracking-widest">Bind Protocol</span>
                                <span className="font-black text-emerald-500 uppercase italic underline decoration-emerald-500/20">SMPP v3.4</span>
                             </div>
                             <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold text-zinc-500 uppercase tracking-widest">Throughput</span>
                                <span className="font-black text-amber-500 uppercase tabular-nums">250 SMS/s</span>
                             </div>
                          </div>

                          <button 
                            onClick={() => setShowSupplierPopup(null)}
                            className="w-full py-5 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20 relative z-10"
                          >
                             DISMISS NODE DATA
                          </button>
                       </div>

                       <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 space-y-2 text-left">
                          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">System Fingerprint</p>
                          <p className="text-[8px] font-mono text-zinc-500 break-all leading-relaxed">
                             SHA256: 8f2a1b9c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export function SMSProductViewDetails({ data }: { data: any }) {
  const [showMccmncPopup, setShowMccmncPopup] = React.useState<string | null>(null);

  const getMccMncForCountry = (country: string) => {
    const mockData: Record<string, string[]> = {
      'India': ['404-10 (Airtel)', '404-01 (Vodafone)', '405-800 (Reliance JIO)'],
      'USA': ['310-260 (T-Mobile)', '310-410 (AT&T)', '311-480 (Verizon)'],
      'UK': ['234-15 (Vodafone)', '234-10 (O2)', '234-20 (EE)'],
      'American Samoa': ['544-11 (BlueSky)'],
      'Andorra': ['213-03 (Andorra Telecom)']
    };
    return mockData[country] || ['No specific codes found'];
  };

  return (
    <div className="p-8 space-y-6 text-sm relative">
      <h2 className="text-xl font-black uppercase tracking-widest text-[#428bca]">Product Detailed View</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400">Product Name</p>
            <p className="font-bold text-lg">{data?.['Product Name'] || 'N/A'}</p>
        </div>
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400">Product Category</p>
            <p className="font-bold text-lg">{data?.['Category'] || 'N/A'}</p>
        </div>
        <div className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400">Currency Code</p>
            <p className="font-bold text-lg">{data?.['Currency'] || 'N/A'}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase text-zinc-400">Selected Countries</p>
        <div className="flex gap-2 flex-wrap">
          {(data?.['Country'] || '').split(',').map((c: string) => {
            const country = c.trim();
            if (!country) return null;
            return (
              <span 
                key={country}
                onClick={() => setShowMccmncPopup(country)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-xs cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-1.5"
              >
                {country}
                <Info className="w-3 h-3 opacity-50" />
              </span>
            );
          })}
          {!data?.['Country'] && "N/A"}
        </div>
      </div>

      {showMccmncPopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#428bca]">MCC/MNC: {showMccmncPopup}</h3>
              <button onClick={() => setShowMccmncPopup(null)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <div className="p-6 max-h-[300px] overflow-y-auto">
              <div className="space-y-2">
                {getMccMncForCountry(showMccmncPopup).map((code, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                    <span className="font-mono font-black text-blue-600 dark:text-blue-400">{code.split(' ')[0]}</span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{code.split(' ').slice(1).join(' ') || 'General'}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
              <button onClick={() => setShowMccmncPopup(null)} className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all">Close Details</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase text-zinc-400">Failover Routing</p>
        <div className="bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Primary Supplier: <span className="text-[#428bca]">{data?.['failoverNodes']?.[0]?.vendor || 'N/A'}</span></p>
          <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-1">Secondary Supplier: <span className="text-[#428bca]">{data?.['failoverNodes']?.[1]?.vendor || 'N/A'}</span></p>
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase text-zinc-400">Users/Rules Information</p>
        <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl font-mono text-[11px] text-zinc-500">
          {data?.usersRuleInfo || 'No specific assignment info available'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {[
          { label: 'Sender ID Assignment', value: data?.senderIdAssignments },
          { label: 'Mobile No Assignment', value: data?.mobileNoAssignments },
          { label: 'Content Information', value: data?.contentInfo },
          { label: 'LCR Information', value: data?.lcrInformation },
          { label: 'Others', value: data?.othersInfo }
        ].map(item => (
          <div key={item.label} className="space-y-2">
            <p className="text-[10px] font-black uppercase text-zinc-400">{item.label}</p>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl min-h-[40px] flex items-center">{item.value || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const vendorsData: Record<string, { accounts: { name: string, category: string, quality: number, rate: number }[] }> = {
  'Alpha Telecom': { accounts: [
    { name: 'Alpha_Direct_US', category: 'DIRECT', quality: 99, rate: 0.0042 },
    { name: 'Alpha_HQ_UK', category: 'HQ', quality: 98, rate: 0.0150 },
    { name: 'Alpha_Transactional', category: 'DIRECT', quality: 95, rate: 0.0039 }
  ] },
  'Global Hub': { accounts: [
    { name: 'Hub_Premium_EU', category: 'International', quality: 92, rate: 0.0220 },
    { name: 'Hub_Marketing_Asia', category: 'International', quality: 85, rate: 0.0180 },
    { name: 'Hub_WHS_Global', category: 'WHS', quality: 80, rate: 0.0090 }
  ] },
  'Teleoss Node': { accounts: [
    { name: 'Teleoss_Main', category: 'SIM', quality: 90, rate: 0.0050 },
    { name: 'Teleoss_Retail_Backup', category: 'Retail', quality: 75, rate: 0.0045 },
    { name: 'Teleoss_SIM_Node', category: 'SIM', quality: 88, rate: 0.0048 }
  ] },
  'Connect Wave': { accounts: [
    { name: 'Wave_DIR_AUS', category: 'DIRECT', quality: 97, rate: 0.0120 },
    { name: 'Wave_Local_UAE', category: 'Local Premium', quality: 94, rate: 0.0450 }
  ] },
  'Orbit SMS': { accounts: [
    { name: 'Orbit_GL_Node', category: 'Global', quality: 82, rate: 0.0110 },
    { name: 'Orbit_Safe_Route', category: 'Restricted', quality: 91, rate: 0.0140 }
  ] }
};

const countries: Record<string, string[]> = {
  'United States': ['310-020', '310-120', '310-150', '310-260', '310-410'],
  'United Kingdom': ['234-10', '234-15', '234-20', '234-30'],
  'India': ['404-01', '404-10', '404-20', '404-45', '405-800'],
  'United Arab Emirates': ['424-02', '424-03'],
  'Australia': ['505-01', '505-02'],
  'Canada': ['302-220', '302-370'],
  'Germany': ['262-01', '262-02'],
  'France': ['208-01', '208-10'],
  'Singapore': ['525-01', '525-02'],
  'Japan': ['440-01', '440-10']
};

const categories = ['DIRECT', 'HQ', 'SIM', 'WHS', 'International', 'Local Premium', 'Retail', 'Global', 'Restricted'];

const REGIONS_DATA: Record<string, string[]> = {
  'Africa': ['Egypt', 'Nigeria', 'South Africa', 'Kenya', 'Morocco', 'Algeria'],
  'Asia': ['India', 'China', 'Japan', 'Singapore', 'United Arab Emirates', 'Saudi Arabia', 'Vietnam', 'Thailand'],
  'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland'],
  'Americas': ['United States', 'Canada', 'Brazil', 'Mexico', 'Argentina', 'Colombia'],
  'Oceania': ['Australia', 'New Zealand', 'Fiji']
};

export function SMSWholesaleProductForm({ 
  onClose, 
  theme, 
  isEdit, 
  isViewOnly, 
  data,
  standalone = true,
  activeTab: propActiveTab
}: { 
  onClose: () => void; 
  theme: 'light' | 'dark'; 
  isEdit?: boolean; 
  isViewOnly?: boolean; 
  data?: any; 
  standalone?: boolean;
  activeTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(propActiveTab || 'BASIC');
  const [productName, setProductName] = useState(data?.['Product Name'] || "Enterprise Direct SMS");
  const [currency, setCurrency] = useState(data?.Currency || 'USD');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['DIRECT']);
  const [purchasePrice, setPurchasePrice] = useState(data?.Rate || '0.0045');
  const [sellingPrice, setSellingPrice] = useState(data?.['Selling Price'] || '0.0055');
  const [assignedRegions, setAssignedRegions] = useState<{country: string, codes: string[]}[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [provisionedCountries, setProvisionedCountries] = useState<string[]>([]);
  const [routingMode, setRoutingMode] = useState<'AUTO' | 'MANUAL' | 'SINGLE'>('AUTO');
  const [globalHoldingTime, setGlobalHoldingTime] = useState(10);
  const [singleSupplierAccount, setSingleSupplierAccount] = useState<any>(null);
  const [marginMode, setMarginMode] = useState<'PERCENT' | 'FIXED' | 'CUSTOM'>('PERCENT');
  const [marginValue, setMarginValue] = useState('15');
  const [expandedRegion, setExpandedRegion] = useState<string | null>('Asia');
  const [isAutoOptimizing, setIsAutoOptimizing] = useState(false);
  const [tempSelectedCountries, setTempSelectedCountries] = useState<string[]>([]);
  const [countryAssignments, setCountryAssignments] = useState<Record<string, { primary: any, failovers: any[], buying: string, selling: string }>>({});
  const [selectedVendor, setSelectedVendor] = useState(data?.Vendor || '');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [mccmncMatrix, setMccmncMatrix] = useState<Record<string, string[]>>({});
  const [showMccmncPopup, setShowMccmncPopup] = useState<string | null>(null);
  const [tempCodes, setTempCodes] = useState<string[]>([]);
  const [activeCountryFocus, setActiveCountryFocus] = useState<string | null>(null);
  const [showPricePopup, setShowPricePopup] = useState<string | null>(null);
  const [lcrSubTab, setLcrSubTab] = useState('RESTRICTED');
  const [tabs, setTabs] = useState(['BASIC', 'USERS', 'SENDER ID', 'MOBILE NO', 'CONTENT', 'LCR', 'OTHER']);
  const [routingStrategy, setRoutingStrategy] = useState('QUALITY_FIRST');
  const [lcrEnabled, setLcrEnabled] = useState(false);
  const [failoverErrors, setFailoverErrors] = useState(['EXPIRED', 'UNDELIV', 'REJECTD']);
  const [asrThreshold, setAsrThreshold] = useState(15);
  const [dlrThreshold, setDlrThreshold] = useState(40);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState(2);
  const [lcrSearchPrefix, setLcrSearchPrefix] = useState('');
  const [lcrSearchType, setLcrSearchType] = useState('MCCMNC');
  const [lcrSearchDepth, setLcrSearchDepth] = useState('5');
  const [isLcrScanning, setIsLcrScanning] = useState(false);
  const [revenueSetting, setRevenueSetting] = useState('No Loss');
  const [minProfitPercent, setMinProfitPercent] = useState('5');
  const [maxLossPercent, setMaxLossPercent] = useState('2');
  const [targetProfitPercent, setTargetProfitPercent] = useState('10');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isCreated, setIsCreated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Identity, 2: Config, 3: Matrix
  const [minQualityDlr, setMinQualityDlr] = useState(70);
  const [lcrComparisonResults, setLcrComparisonResults] = useState<{vendor: string, account: string, rate: number, quality: number, status: string}[]>([]);
  const [failoverNodes, setFailoverNodes] = useState<{vendor: string, account: string, priority: number, status: string, holdingTime: number, weighting: number, isPrimary: boolean}[]>(
    (data?.failoverNodes || []).map((n: any, i: number) => ({ ...n, isPrimary: i === 0 }))
  );
  const [showSupplierPopup, setShowSupplierPopup] = useState<{name: string, account: string} | null>(null);
  const [selectedAccountForNode, setSelectedAccountForNode] = useState('');
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('01');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [assignedUsers, setAssignedUsers] = useState('');
  const [assignedSenderIds, setAssignedSenderIds] = useState('');
  const [assignedMobileNumbers, setAssignedMobileNumbers] = useState('');
  const [productRules, setProductRules] = useState<any[]>([
    { 
      id: '1', 
      name: 'Alpha Premium India Route', 
      type: 'Direct', 
      priority: 1, 
      status: 'Active',
      country: 'India',
      mccmnc: '404-45',
      supplier: 'Teleoss Node',
      supplierAccount: 'Teleoss_Main',
      dlrThreshold: 85,
      asrThreshold: 35,
      senderIdRule: 'Allow',
      senderIdValue: '',
      actionType: 'Force Route',
      limitTps: '100'
    },
    { 
      id: '2', 
      name: 'Vendor Failover Rule', 
      type: 'Failover', 
      priority: 2, 
      status: 'Active',
      country: 'United Kingdom',
      mccmnc: 'All',
      supplier: 'Global Hub',
      supplierAccount: 'Hub_WHS_Global',
      dlrThreshold: 75,
      asrThreshold: 20,
      senderIdRule: 'Allow',
      senderIdValue: '',
      actionType: 'Failover Block',
      limitTps: '50'
    }
  ]);
  const [newRuleName, setNewRuleName] = useState('New Custom Routing Rule');
  const [newRuleType, setNewRuleType] = useState('Direct');
  const [newRuleCountry, setNewRuleCountry] = useState('All');
  const [newRuleMccmnc, setNewRuleMccmnc] = useState('All');
  const [newRuleSupplier, setNewRuleSupplier] = useState('All');
  const [newRuleSupplierAcc, setNewRuleSupplierAcc] = useState('All');
  const [newRuleDlr, setNewRuleDlr] = useState(70);
  const [newRuleAsr, setNewRuleAsr] = useState(15);
  const [newRuleSenderIdRule, setNewRuleSenderIdRule] = useState<'Allow' | 'Block' | 'Overwrite'>('Allow');
  const [newRuleSenderIdVal, setNewRuleSenderIdVal] = useState('');
  const [newRuleActionType, setNewRuleActionType] = useState('Force Route');
  const [newRuleLimitTps, setNewRuleLimitTps] = useState('100');
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [contentCondition, setContentCondition] = useState('Does not contains');
  const [contentText, setContentText] = useState('');
  const [lcrPolicyName, setLcrPolicyName] = useState('');
  const [lcrPolicyType, setLcrPolicyType] = useState('Allow'); // 'Allow' or 'Deny'
  const [lcrRemarks, setLcrRemarks] = useState('');
  const [lcrRuleName, setLcrRuleName] = useState('');
  const [lcrSelectedSuppliers, setLcrSelectedSuppliers] = useState<string[]>([]);
  const [lcrSendingService, setLcrSendingService] = useState('');
  const [lcrRuleRemarks, setLcrRuleRemarks] = useState('');
  const [lcrCriteriaAttribute, setLcrCriteriaAttribute] = useState('Client');
  const [lcrCriteriaCondition, setLcrCriteriaCondition] = useState('Equals');
  const [lcrSelectedUser, setLcrSelectedUser] = useState('');
  const [lcrSmsAttribute, setLcrSmsAttribute] = useState('Source SenderId');
  const [lcrSmsCondition, setLcrSmsCondition] = useState('Contains');
  const [lcrSmsValue, setLcrSmsValue] = useState('');
  const [lcrTimeAttribute, setLcrTimeAttribute] = useState('Queue Time');
  const [lcrTimeCondition, setLcrTimeCondition] = useState('Time Range');
  const [lcrFromTime, setLcrFromTime] = useState('');
  const [lcrToTime, setLcrToTime] = useState('');
  const [mccmncSearch, setMccmncSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedAccountsForChain, setSelectedAccountsForChain] = useState<string[]>([]);
  const [prefix, setPrefix] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      const sections = ['01', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      for (const id of sections) {
        const el = document.getElementById(`edit-section-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = scrollContainerRef.current.getBoundingClientRect();
          if (rect.top >= containerRect.top && rect.top <= containerRect.top + 200) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(`edit-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const resetForm = () => {
    setSelectedVendor('');
    setSelectedAccountForNode('');
    setFailoverNodes([]);
    setSelectedCountries([]);
    setMccmncMatrix({});
    setAssignedRegions([]);
    setPurchasePrice('0.0045');
    setSellingPrice('0.0055');
    setCurrency('USD');
    setRoutingStrategy('QUALITY_FIRST');
  };

  const handleGeminiOptimize = async () => {
    setIsGeminiLoading(true);
    // Simulate Gemini AI optimization
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRoutingStrategy('PERFORMANCE_LCR');
    setSellingPrice((parseFloat(purchasePrice) * 1.15).toFixed(4));
    setIsGeminiLoading(false);
  };

  const optimizeRouting = useCallback(async (manualCountries?: any) => {
    // Determine which list to use, prioritizing manual input if it's an array
    const listToProcess = Array.isArray(manualCountries) ? manualCountries : provisionedCountries;
    
    if (listToProcess.length === 0) return;

    setIsAutoOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const category = selectedCategories[0];
    const available = Object.entries(vendorsData).flatMap(([v, info]) => 
      info.accounts.filter(acc => acc.category === category).map(acc => ({ vendor: v, ...acc }))
    ).sort((a, b) => a.rate - b.rate);

    if (available.length > 0) {
      const bestRate = available[0].rate;
      
      setCountryAssignments(prev => {
        const newAssignments = { ...prev };
        listToProcess.forEach(country => {
          const nodes = available.slice(0, 3).map((acc, i) => ({
            vendor: acc.vendor,
            account: acc.name,
            priority: i,
            status: 'Active',
            holdingTime: i < 2 ? globalHoldingTime : 0,
            weighting: 100,
            isPrimary: i === 0,
            rate: acc.rate
          }));

          let calculatedSelling = '0.0000';
          if (marginMode === 'PERCENT') {
             calculatedSelling = (bestRate * (1 + parseFloat(marginValue)/100)).toFixed(4);
          } else if (marginMode === 'FIXED') {
             calculatedSelling = (bestRate + parseFloat(marginValue)).toFixed(4);
          } else {
             calculatedSelling = (bestRate * 1.1).toFixed(4);
          }

          newAssignments[country] = {
            primary: nodes[0],
            failovers: nodes.slice(1),
            buying: bestRate.toString(),
            selling: calculatedSelling
          };
        });
        return newAssignments;
      });
    }
    setIsAutoOptimizing(false);
  }, [provisionedCountries, selectedCategories, marginMode, marginValue, globalHoldingTime]);

  const applySingleSupplier = (account: any) => {
    if (!account) return;
    setSingleSupplierAccount(account);
    setCountryAssignments(prev => {
      const newAssignments = { ...prev };
      provisionedCountries.forEach(country => {
        const nodes = [{
          vendor: account.vendor,
          account: account.name,
          priority: 0,
          status: 'Active',
          holdingTime: 0,
          weighting: 100,
          isPrimary: true,
          rate: account.rate
        }];

        let calculatedSelling = '0.0000';
        if (marginMode === 'PERCENT') {
           calculatedSelling = (account.rate * (1 + parseFloat(marginValue)/100)).toFixed(4);
        } else if (marginMode === 'FIXED') {
           calculatedSelling = (account.rate + parseFloat(marginValue)).toFixed(4);
        } else {
           calculatedSelling = (account.rate * 1.1).toFixed(4);
        }

        newAssignments[country] = {
          primary: nodes[0],
          failovers: [],
          buying: account.rate.toString(),
          selling: calculatedSelling
        };
      });
      return newAssignments;
    });
  };

  const applyGlobalMargin = (mode: 'PERCENT' | 'FIXED' | 'CUSTOM', value: string) => {
    if (mode === 'CUSTOM') return;
    setCountryAssignments(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(country => {
        const buyingVal = parseFloat(next[country].buying);
        if (!isNaN(buyingVal)) {
          if (mode === 'PERCENT') {
            next[country].selling = (buyingVal * (1 + (parseFloat(value) || 0)/100)).toFixed(4);
          } else if (mode === 'FIXED') {
            next[country].selling = (buyingVal + (parseFloat(value) || 0)).toFixed(4);
          }
        }
      });
      return next;
    });
  };

  useEffect(() => {
    if (routingMode === 'AUTO' && provisionedCountries.length > 0) {
      const timer = setTimeout(() => {
        optimizeRouting(provisionedCountries);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [routingMode, provisionedCountries, optimizeRouting]);

  const handleAssignCountries = () => {
    setProvisionedCountries(tempSelectedCountries);
    setAssignedRegions(tempSelectedCountries.map(c => ({ country: c, codes: ['*'] })));
    
    if (routingMode === 'AUTO') {
      optimizeRouting(tempSelectedCountries);
    }
    
    setSuccessMsg(`${tempSelectedCountries.length} Countries Assigned Successfully`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (isViewOnly && activeTab === 'BASIC') {
    return <ProductDNAView {...{
      data,
      isViewOnly,
      productName,
      currency,
      routingStrategy,
      purchasePrice,
      sellingPrice,
      failoverNodes,
      productRules,
      contentCondition,
      contentText,
      revenueSetting,
      minQualityDlr,
      asrThreshold,
      lcrPolicyName,
      lcrPolicyType,
      lcrRuleName,
      lcrRuleRemarks,
      lcrSmsAttribute,
      lcrSmsCondition,
      lcrSmsValue,
      lcrFromTime,
      lcrToTime,
      lcrRemarks,
      onClose,
      assignedRegions,
      mccmncMatrix
    }} />;
  }

  const handleAnalyze = () => {
    setShowSuggestion(true);
  };

  const handleDeleteRule = (id: string) => {
    setProductRules(prev => prev.filter(r => r.id !== id));
    setSuccessMsg('Rule removed successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const toggleRuleStatus = (id: string) => {
    setProductRules(prev => prev.map(r => 
      r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r
    ));
    setSuccessMsg('Rule status updated successfully');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const runLcrScan = () => {
    if (!lcrSearchPrefix) return;
    setIsLcrScanning(true);
    // Simulate real-time supplier rate lookup with 5th depth results
    setTimeout(() => {
       setLcrComparisonResults([
          { vendor: 'Alpha System', account: 'Alpha_DIR_OUT', rate: 0.0038, quality: 98, status: 'PROFITABLE', param: lcrSearchPrefix },
          { vendor: 'Global Hub', account: 'GH_WHS_NODE_1', rate: 0.0042, quality: 92, status: 'STABLE', param: lcrSearchPrefix },
          { vendor: 'TeleOSS', account: 'TOSS_PREMIUM', rate: 0.0045, quality: 99, status: 'QUALITY_MATCH', param: lcrSearchPrefix },
          { vendor: 'Nexmo B.', account: 'NX_RETAIL', rate: 0.0051, quality: 85, status: 'LOW_MARGIN', param: lcrSearchPrefix },
          { vendor: 'Connect Wave', account: 'CW_PRIMARY', rate: 0.0035, quality: 96, status: 'BEST_RATE', param: lcrSearchPrefix },
       ].sort((a, b) => a.rate - b.rate));
       setIsLcrScanning(false);
    }, 800);
  };

  const handleAddRule = () => {
    let ruleName = '';
    
    if (activeTab === 'BASIC') {
      ruleName = `Product Binding: ${productName}`;
    } else if (activeTab === 'OTHER') {
      if (lcrSubTab === 'RESTRICTED' && lcrRuleName) ruleName = `Restricted Service: ${lcrRuleName}`;
      else if (lcrSubTab === 'CLIENT' && lcrSelectedUser) ruleName = `Client Attribute: ${lcrSelectedUser}`;
      else if (lcrSubTab === 'SMS' && lcrSmsValue) ruleName = `SMS Content Pattern: ${lcrSmsValue.substring(0, 15)}...`;
      else if (lcrSubTab === 'TIME' && lcrFromTime) ruleName = `Time Window: ${lcrFromTime}-${lcrToTime}`;
    } else if (activeTab === 'RULES') {
      ruleName = newRuleName || `Rule: ${newRuleCountry} (${newRuleMccmnc})`;
    }

    // If no specific criteria name is generated and we aren't explicitly in the RULES tab (adding a generic node)
    if (!ruleName && activeTab !== 'RULES') {
      setSuccessMsg('Add some parameters for rules');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      return;
    }

    const newId = (productRules.length + 1).toString();
    const newRuleObj = {
      id: newId,
      name: ruleName || `Logic Rule Matrix Node ${newId}`,
      type: activeTab === 'RULES' ? newRuleType : (productRules.length % 2 === 0 ? 'Direct' : 'Failover'),
      priority: productRules.length + 1,
      status: 'Active',
      country: activeTab === 'RULES' ? newRuleCountry : 'All',
      mccmnc: activeTab === 'RULES' ? newRuleMccmnc : 'All',
      supplier: activeTab === 'RULES' ? newRuleSupplier : 'All',
      supplierAccount: activeTab === 'RULES' ? newRuleSupplierAcc : 'All',
      dlrThreshold: activeTab === 'RULES' ? newRuleDlr : 70,
      asrThreshold: activeTab === 'RULES' ? newRuleAsr : 15,
      senderIdRule: activeTab === 'RULES' ? newRuleSenderIdRule : 'Allow',
      senderIdValue: activeTab === 'RULES' ? newRuleSenderIdVal : '',
      actionType: activeTab === 'RULES' ? newRuleActionType : 'Force Route',
      limitTps: activeTab === 'RULES' ? newRuleLimitTps : '100'
    };

    setProductRules(prev => [...prev, newRuleObj]);
    setIsCreated(true);
    setCurrentStep(3);
    setSuccessMsg(isCreated ? 'New Rule Node Added to Matrix' : 'Product Created & Rule Added');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset inputs
    setNewRuleName('New Custom Routing Rule');
    setNewRuleType('Direct');
    setNewRuleCountry('All');
    setNewRuleMccmnc('All');
    setNewRuleSupplier('All');
    setNewRuleSupplierAcc('All');
    setNewRuleDlr(70);
    setNewRuleAsr(15);
    setNewRuleSenderIdRule('Allow');
    setNewRuleSenderIdVal('');
    setNewRuleActionType('Force Route');
    setNewRuleLimitTps('100');
    setIsAddingRule(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'BASIC':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left pb-10">
            {/* 1. Core Identity & Strategy */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
               <div className="xl:col-span-3 space-y-6">
                  <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm space-y-6">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                           <Type className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Product Identity</h4>
                           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Define core identifiers and commercial anchor</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono flex items-center gap-2">
                              Product Name <span className="text-red-500">*</span>
                           </label>
                           <input 
                              type="text" 
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                              className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black shadow-inner focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
                              placeholder="e.g. Premium Wholesale Direct"
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Category</label>
                              <div className="relative group">
                                 <select 
                                    value={selectedCategories[0]}
                                    onChange={(e) => setSelectedCategories([e.target.value])}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500/5"
                                 >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Currency</label>
                              <div className="relative group">
                                 <select 
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black appearance-none cursor-pointer focus:ring-4 focus:ring-blue-500/5"
                                 >
                                    <option>USD</option>
                                    <option>EUR</option>
                                    <option>GBP</option>
                                    <option>INR</option>
                                 </select>
                                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* 2. Region-Based Global Reach */}
                  <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-emerald-500/10 rounded-2xl">
                              <Globe className="w-5 h-5 text-emerald-500" />
                           </div>
                           <div>
                              <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Global Reach Selection</h4>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Select regions or individual countries to assign</p>
                           </div>
                        </div>
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full">
                           {tempSelectedCountries.length} Pending • {provisionedCountries.length} Assigned
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Region List */}
                        <div className="space-y-3">
                           <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2 px-1">Regions</p>
                           <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                              {Object.keys(REGIONS_DATA).map(region => {
                                 const regionCountries = REGIONS_DATA[region];
                                 const isAllSelected = regionCountries.every(c => tempSelectedCountries.includes(c));
                                 const isPartiallySelected = regionCountries.some(c => tempSelectedCountries.includes(c)) && !isAllSelected;
                                 
                                 return (
                                    <div 
                                       key={region}
                                       className={cn(
                                          "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                          expandedRegion === region 
                                             ? "bg-[#428bca]/5 border-[#428bca]/30" 
                                             : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-800 hover:border-[#428bca]/30"
                                       )}
                                       onClick={() => setExpandedRegion(region)}
                                    >
                                       <div className="flex items-center gap-4">
                                          <div 
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                if (isAllSelected) {
                                                   setTempSelectedCountries(prev => prev.filter(c => !regionCountries.includes(c)));
                                                } else {
                                                   setTempSelectedCountries(prev => {
                                                      const unique = new Set([...prev, ...regionCountries]);
                                                      return Array.from(unique);
                                                   });
                                                }
                                             }}
                                             className={cn(
                                                "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                                                isAllSelected ? "bg-emerald-500 border-emerald-500" : isPartiallySelected ? "bg-emerald-500/30 border-emerald-500" : "border-zinc-300 dark:border-zinc-600"
                                             )}
                                          >
                                             {isAllSelected && <Check className="w-4 h-4 text-white" />}
                                             {isPartiallySelected && <div className="w-2.5 h-0.5 bg-emerald-500 rounded-full" />}
                                          </div>
                                          <div className="flex flex-col">
                                             <span className="text-[11px] font-black uppercase tracking-tight">{region}</span>
                                             <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">
                                                {regionCountries.filter(c => tempSelectedCountries.includes(c)).length} / {regionCountries.length} Countries
                                             </span>
                                          </div>
                                       </div>
                                       <ChevronRight className={cn("w-4 h-4 text-zinc-400 transition-transform", expandedRegion === region && "rotate-90 text-[#428bca]")} />
                                    </div>
                                 );
                              })}
                           </div>
                        </div>

                        {/* Country Detail Selection */}
                        <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 min-h-[300px] flex flex-col">
                           {expandedRegion ? (
                              <div className="space-y-4 h-full flex flex-col">
                                 <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-3">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#428bca]">{expandedRegion} Countries</h5>
                                    <button 
                                       onClick={() => {
                                          const regionCountries = REGIONS_DATA[expandedRegion];
                                          const isAllSelected = regionCountries.every(c => tempSelectedCountries.includes(c));
                                          if (isAllSelected) {
                                             setTempSelectedCountries(prev => prev.filter(c => !regionCountries.includes(c)));
                                          } else {
                                             setTempSelectedCountries(prev => Array.from(new Set([...prev, ...regionCountries])));
                                          }
                                       }}
                                       className="text-[9px] font-black uppercase text-emerald-500 hover:underline"
                                    >
                                       {REGIONS_DATA[expandedRegion].every(c => tempSelectedCountries.includes(c)) ? 'Deselect All' : 'Select All'}
                                    </button>
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-y-auto max-h-[200px] pr-2 custom-scrollbar flex-1">
                                    {REGIONS_DATA[expandedRegion].map(country => {
                                       const isSelected = tempSelectedCountries.includes(country);
                                       return (
                                          <div 
                                             key={country}
                                             onClick={() => {
                                                if (isSelected) {
                                                   setTempSelectedCountries(prev => prev.filter(c => c !== country));
                                                } else {
                                                   setTempSelectedCountries(prev => [...prev, country]);
                                                }
                                             }}
                                             className={cn(
                                                "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3",
                                                isSelected ? "bg-white dark:bg-zinc-900 border-[#428bca] shadow-sm" : "bg-transparent border-transparent hover:bg-white/50"
                                             )}
                                          >
                                             <div className={cn(
                                                "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                                                isSelected ? "bg-[#428bca] border-[#428bca]" : "border-zinc-300 dark:border-zinc-700"
                                             )}>
                                                {isSelected && <Check className="w-3 h-3 text-white" />}
                                             </div>
                                             <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase truncate">{country}</span>
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>
                           ) : (
                              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                                 <Globe className="w-10 h-10 text-zinc-400" />
                                 <p className="text-[10px] font-black font-mono uppercase tracking-widest">Select a Region to assign carriers</p>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex flex-wrap gap-1.5 max-w-2xl">
                           {provisionedCountries.length > 0 ? (
                              provisionedCountries.slice(0, 10).map(c => (
                                 <span key={c} className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[8px] font-black uppercase border border-emerald-500/20 shadow-sm animate-in zoom-in">
                                    {c}
                                 </span>
                              ))
                           ) : (
                              <span className="text-[9px] font-bold text-zinc-400 uppercase italic">No countries assigned yet...</span>
                           )}
                           {provisionedCountries.length > 10 && (
                              <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded-lg text-[8px] font-black uppercase">
                                 +{provisionedCountries.length - 10} More
                              </span>
                           )}
                        </div>
                        <button 
                           onClick={handleAssignCountries}
                           disabled={tempSelectedCountries.length === 0}
                           className={cn(
                              "px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95",
                              tempSelectedCountries.length > 0 
                                 ? "bg-[#428bca] text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600" 
                                 : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                           )}
                        >
                           <Zap className="w-4 h-4" /> Finalize & Assign Selection
                        </button>
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  {/* 3. Routing Intelligence Choice: Removed as per previous request to hide the "black box" but we need the table below it, so we keep the container but hide the specific box if needed. Actually the user wants "Auto LCR, Manual, Single Supplier" which are already in the table header. So I will keep this container but hide the specific old box if still there. */}
                  
                  {/* 4. Commercial Strategy & Route Mesh */}
                  {provisionedCountries.length > 0 && (
                     <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-[#428bca]/10 rounded-2xl">
                                 <Zap className="w-5 h-5 text-[#428bca]" />
                              </div>
                              <div>
                                 <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Routing Mesh Details</h4>
                                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Configure supplier assignment rules and pricing matrix</p>
                              </div>
                           </div>
                           
                           {/* Assignment Rules Selection & Global Margin */}
                           <div className="flex flex-wrap items-center gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-[1.5rem] border border-zinc-200/50 dark:border-zinc-700/50 ml-auto">
                              <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl">
                                 <button 
                                    onClick={() => setRoutingMode('AUTO')}
                                    className={cn(
                                       "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                       routingMode === 'AUTO' ? "bg-white dark:bg-zinc-700 text-[#428bca] shadow-sm" : "text-zinc-500 hover:text-zinc-600"
                                    )}
                                 >Auto LCR</button>
                                 <button 
                                    onClick={() => setRoutingMode('MANUAL')}
                                    className={cn(
                                       "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                       routingMode === 'MANUAL' ? "bg-white dark:bg-zinc-700 text-[#428bca] shadow-sm" : "text-zinc-500 hover:text-zinc-600"
                                    )}
                                 >Manual</button>
                                 <button 
                                    onClick={() => setRoutingMode('SINGLE')}
                                    className={cn(
                                       "px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
                                       routingMode === 'SINGLE' ? "bg-white dark:bg-zinc-700 text-[#428bca] shadow-sm" : "text-zinc-500 hover:text-zinc-600"
                                    )}
                                 >Single Supplier</button>
                              </div>

                              <div className="h-8 w-[1px] bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />

                              {routingMode === 'AUTO' && (
                                 <div className="flex items-center gap-2 bg-[#428bca]/5 border border-[#428bca]/20 px-3 py-2 rounded-xl text-center">
                                    <span className="text-[8px] font-black text-[#428bca] uppercase">Hold:</span>
                                    <input 
                                       type="number"
                                       value={globalHoldingTime}
                                       onChange={(e) => setGlobalHoldingTime(parseInt(e.target.value) || 0)}
                                       className="w-10 bg-transparent text-[10px] font-black text-[#428bca] outline-none border-none p-0 h-auto text-center"
                                    />
                                    <span className="text-[8px] font-black text-[#428bca] uppercase">s</span>
                                 </div>
                              )}
                              
                              {routingMode === 'SINGLE' && (
                                 <div className="relative">
                                    <select 
                                       onChange={(e) => {
                                          const [v, accName] = e.target.value.split('|');
                                          const acc = vendorsData[v]?.accounts.find(a => a.name === accName);
                                          if (acc) applySingleSupplier({ vendor: v, ...acc });
                                       }}
                                       className="pl-3 pr-8 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[9px] font-black uppercase appearance-none cursor-pointer focus:ring-2 focus:ring-[#428bca]/20"
                                    >
                                       <option value="">Select Supplier</option>
                                       {Object.entries(vendorsData).flatMap(([v, info]) => 
                                          info.accounts.filter(acc => acc.category === selectedCategories[0]).map(acc => (
                                             <option key={`${v}|${acc.name}`} value={`${v}|${acc.name}`}>
                                                {v} - {acc.name} (${acc.rate})
                                             </option>
                                          ))
                                       )}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                                 </div>
                              )}

                              <div className="h-8 w-[1px] bg-zinc-300 dark:bg-zinc-700" />

                              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 px-3 py-2 rounded-xl">
                                 <span className="text-[8px] font-black text-amber-600 uppercase">Sales Price Setup:</span>
                                 <div className="flex items-center gap-1">
                                    {marginMode !== 'CUSTOM' && (
                                       <input 
                                          type="number"
                                          value={marginValue}
                                          onChange={(e) => {
                                             setMarginValue(e.target.value);
                                             applyGlobalMargin(marginMode, e.target.value);
                                          }}
                                          className="w-10 bg-transparent text-[10px] font-black text-amber-700 outline-none border-none p-0 h-auto text-center"
                                       />
                                    )}
                                    <select 
                                       value={marginMode}
                                       onChange={(e) => {
                                          const mode = e.target.value as any;
                                          setMarginMode(mode);
                                          applyGlobalMargin(mode, marginValue);
                                       }}
                                       className="bg-transparent text-[9px] font-black text-amber-600 uppercase outline-none border-none cursor-pointer"
                                    >
                                       <option value="PERCENT">% Margin</option>
                                       <option value="FIXED">Fixed Margin</option>
                                       <option value="CUSTOM">Manual</option>
                                    </select>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Assignment Table Matrix with enhanced scrolling */}
                        <div className="overflow-auto rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-2xl max-h-[70vh] custom-scrollbar bg-white dark:bg-zinc-950">
                           <table className="w-full border-collapse text-left min-w-[1200px]">
                              <thead className="sticky top-0 z-20">
                                 <tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                                       <div className="flex items-center gap-2">
                                          <Globe className="w-3 h-3" />
                                          <span>Country</span>
                                       </div>
                                    </th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                                       <div className="flex items-center gap-2">
                                          <Network className="w-3 h-3" />
                                          <span>Routing Intelligence (Primary + Failovers)</span>
                                       </div>
                                    </th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                                       <div className="flex items-center gap-2">
                                          <DollarSign className="w-3 h-3" />
                                          <span>Buying Rate</span>
                                       </div>
                                    </th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                                       <div className="flex items-center gap-2">
                                          <BarChart3 className="w-3 h-3" />
                                          <span>Sales Margin Rule</span>
                                       </div>
                                    </th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-zinc-50 dark:bg-zinc-900 text-right pr-20">
                                       <div className="flex items-center justify-end gap-2 text-right">
                                          <Zap className="w-3 h-3" />
                                          <span>Final Sales Price</span>
                                       </div>
                                    </th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center bg-zinc-50 dark:bg-zinc-900">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                 {provisionedCountries.map(country => {
                                    const assignment = countryAssignments[country];
                                    return (
                                       <tr key={country} className="hover:bg-zinc-50/50 dark:hover:bg-[#428bca]/5 transition-all group border-l-4 border-l-transparent hover:border-l-[#428bca]">
                                          <td className="px-8 py-6">
                                             <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-[11px] text-zinc-600 dark:text-zinc-400 group-hover:bg-[#428bca] group-hover:text-white transition-colors">
                                                   {country.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[12px] font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100">{country}</span>
                                                   <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Active Link</span>
                                                </div>
                                             </div>
                                          </td>
                                          <td className="px-8 py-6">
                                             {assignment ? (
                                                <div className="space-y-3">
                                                   {/* Primary */}
                                                   <div className="flex items-center gap-3">
                                                      <div className="p-1 px-2 bg-[#428bca]/10 rounded-lg border border-[#428bca]/20">
                                                         <span className="text-[8px] font-black text-[#428bca] uppercase italic">PRI</span>
                                                      </div>
                                                      <div className="flex flex-col">
                                                         <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">{assignment.primary.account}</span>
                                                         <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">{assignment.primary.vendor}</span>
                                                      </div>
                                                   </div>
                                                   {/* Failovers */}
                                                   {assignment.failovers && assignment.failovers.length > 0 && (
                                                      <div className="flex items-center gap-2 pl-1">
                                                         <div className="w-[2px] h-8 bg-zinc-200 dark:bg-zinc-800 mx-2" />
                                                         <div className="flex flex-col gap-1.5">
                                                            {assignment.failovers.map((f: any, idx: number) => (
                                                               <div key={idx} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                                                  <div className="w-4 h-4 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[8px] font-bold">
                                                                     {idx + 1}
                                                                  </div>
                                                                  <span className="text-[9px] font-bold text-zinc-500 truncate max-w-[150px]">{f.account}</span>
                                                                  <span className="text-[8px] font-bold text-zinc-400 tracking-tighter">(${f.rate})</span>
                                                               </div>
                                                            ))}
                                                         </div>
                                                      </div>
                                                   )}
                                                </div>
                                             ) : (
                                                <div className="flex items-center gap-2 text-zinc-300 italic">
                                                   <AlertCircle className="w-3.5 h-3.5" />
                                                   <span className="text-[10px] font-bold uppercase tracking-widest">Routing Pending</span>
                                                </div>
                                             )}
                                          </td>
                                          <td className="px-8 py-6">
                                             {assignment ? (
                                                <div className="flex items-center gap-3">
                                                   <div className="flex flex-col">
                                                      <span className="text-[13px] font-black font-mono text-emerald-500 tracking-tighter">
                                                         ${parseFloat(assignment.buying).toFixed(4)}
                                                      </span>
                                                      <span className="text-[8px] font-bold text-emerald-500/50 uppercase tracking-widest">Cost/SMS</span>
                                                   </div>
                                                   <button 
                                                      onClick={() => setShowSupplierPopup({ name: assignment.primary.vendor, account: assignment.primary.account })}
                                                      className="p-2 hover:bg-[#428bca]/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                   >
                                                      <Eye className="w-4 h-4 text-[#428bca]" />
                                                   </button>
                                                </div>
                                             ) : (
                                                <span className="text-[11px] font-black text-zinc-200 tracking-widest">---.----</span>
                                             )}
                                          </td>
                                          <td className="px-8 py-6">
                                             <div className="flex items-center gap-3">
                                                <div className={cn(
                                                   "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                                                   marginMode === 'PERCENT' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                                   marginMode === 'FIXED' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                                   "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                                                )}>
                                                   {marginMode === 'PERCENT' ? `${marginValue}%` :
                                                    marginMode === 'FIXED' ? `$${marginValue}` :
                                                    'Manual'}
                                                </div>
                                                <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800" />
                                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Rule Base</span>
                                             </div>
                                          </td>
                                          <td className="px-8 py-6 text-right pr-20">
                                             <div className="inline-block text-right">
                                                {assignment ? (
                                                   <div className="flex flex-col items-end">
                                                      {marginMode === 'CUSTOM' ? (
                                                         <div className="relative group/input">
                                                            <div className="absolute inset-0 bg-[#428bca]/5 blur-xl rounded-full opacity-0 group-hover/input:opacity-100 transition-opacity" />
                                                            <div className="relative flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 focus-within:border-[#428bca] rounded-2xl px-4 py-2 transition-all shadow-sm">
                                                               <span className="text-[11px] font-black text-[#428bca] italic">$</span>
                                                               <input 
                                                                  type="number"
                                                                  step="0.0001"
                                                                  value={assignment.selling}
                                                                  onChange={(e) => {
                                                                     const val = e.target.value;
                                                                     setCountryAssignments(prev => ({
                                                                        ...prev,
                                                                        [country]: {
                                                                           ...prev[country],
                                                                           selling: val
                                                                        }
                                                                     }));
                                                                  }}
                                                                  className="w-24 bg-transparent text-[14px] font-black font-mono text-zinc-900 dark:text-zinc-100 outline-none text-right"
                                                               />
                                                            </div>
                                                         </div>
                                                      ) : (
                                                         <span className="text-[16px] font-black font-mono text-zinc-900 dark:text-zinc-100 tracking-tighter bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 rounded-2xl shadow-inner border border-zinc-100 dark:border-zinc-700/50">
                                                            ${parseFloat(assignment.selling).toFixed(4)}
                                                         </span>
                                                      )}
                                                      <span className="text-[8px] font-black text-[#428bca] uppercase tracking-[0.2em] mt-2">Active Price</span>
                                                   </div>
                                                ) : (
                                                   <span className="text-[14px] font-black text-zinc-200 tracking-widest">---.----</span>
                                                )}
                                             </div>
                                          </td>
                                          <td className="px-8 py-6 text-center">
                                             <button 
                                                onClick={() => {
                                                   setSelectedCountry(country);
                                                   if (routingMode === 'MANUAL') {
                                                      setActiveCountryFocus(country);
                                                   }
                                                }}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-[#428bca] hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
                                             >
                                                <Settings2 className="w-3.5 h-3.5" />
                                                <span>Adjust</span>
                                             </button>
                                          </td>
                                       </tr>
                                    );
                                 })}
                              </tbody>
                           </table>
                        </div>


                        {/* Detail Modal / Panel for Manual Selection */}
                        {activeCountryFocus && (
                           <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl p-8 border border-[#428bca]/20 animate-in zoom-in duration-300 space-y-6">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#428bca] text-white rounded-xl flex items-center justify-center">
                                       <Globe className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <h5 className="text-[14px] font-black uppercase tracking-widest">Manual Carrier Assignment: {activeCountryFocus}</h5>
                                       <p className="text-[9px] font-bold text-zinc-400 uppercase">Select primary and failover routes for this node</p>
                                    </div>
                                 </div>
                                 <button onClick={() => setActiveCountryFocus(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors">
                                    <X className="w-4 h-4" />
                                 </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                                 {Object.entries(vendorsData).flatMap(([v, info]) => 
                                    info.accounts.filter(acc => acc.category === selectedCategories[0]).map(acc => (
                                       <div 
                                          key={`${v}|${acc.name}`}
                                          className="p-5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl shadow-sm hover:border-[#428bca]/40 transition-all group flex flex-col justify-between gap-4"
                                       >
                                          <div className="flex items-center justify-between">
                                             <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-zinc-900 dark:text-zinc-100">{acc.name}</span>
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{v}</span>
                                             </div>
                                             <button 
                                                onClick={() => setShowSupplierPopup({ name: v, account: acc.name })}
                                                className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
                                             >
                                                <Eye className="w-4 h-4" />
                                             </button>
                                          </div>
                                          
                                          <div className="flex items-center justify-between pt-2 border-t border-zinc-50 dark:border-zinc-800">
                                             <div>
                                                <p className="text-[8px] font-black text-zinc-400 uppercase mb-0.5 tracking-widest">Rate</p>
                                                <p className="text-[13px] font-black text-emerald-500 font-mono tracking-tighter">${acc.rate}</p>
                                             </div>
                                             <button 
                                                onClick={() => {
                                                   const nodes = [{
                                                      vendor: v,
                                                      account: acc.name,
                                                      priority: 0,
                                                      status: 'Active',
                                                      holdingTime: 0,
                                                      weighting: 100,
                                                      isPrimary: true,
                                                      rate: acc.rate
                                                   }];
                                                   
                                                   let calculatedSelling = '0.0000';
                                                   if (marginMode === 'PERCENT') {
                                                      calculatedSelling = (acc.rate * (1 + parseFloat(marginValue)/100)).toFixed(4);
                                                   } else if (marginMode === 'FIXED') {
                                                      calculatedSelling = (acc.rate + parseFloat(marginValue)).toFixed(4);
                                                   }

                                                   setCountryAssignments(prev => ({
                                                      ...prev,
                                                      [activeCountryFocus]: {
                                                         primary: nodes[0],
                                                         failovers: [],
                                                         buying: acc.rate.toString(),
                                                         selling: calculatedSelling
                                                      }
                                                   }));
                                                   setActiveCountryFocus(null);
                                                   setSuccessMsg(`Route assigned to ${activeCountryFocus}`);
                                                   setShowSuccess(true);
                                                   setTimeout(() => setShowSuccess(false), 2000);
                                                }}
                                                className="px-6 py-2 bg-zinc-900 dark:bg-zinc-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#428bca] transition-all active:scale-95"
                                             >
                                                Assign
                                             </button>
                                          </div>
                                       </div>
                                    ))
                                 )}
                              </div>
                           </div>
                        )}
                     </div>
                  )}

                  {/* DELETED: Commercial Strategy / Sales Point */}
                  <div className="hidden">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-2xl">
                           <BarChart3 className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Commercial Strategy</h4>
                           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Define pricing anchors and net margins</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl gap-1">
                           {[
                              { id: 'PERCENT', label: 'Fixed % Margin' },
                              { id: 'FIXED', label: 'Fixed Amount' },
                              { id: 'CUSTOM', label: 'Custom Value' }
                           ].map(mode => (
                              <button 
                                 key={mode.id}
                                 onClick={() => setMarginMode(mode.id as any)}
                                 className={cn(
                                    "flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all",
                                    marginMode === mode.id ? "bg-white dark:bg-zinc-900 text-[#428bca] shadow-md" : "text-zinc-400"
                                 )}
                              >{mode.label}</button>
                           ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Buying Price (Avg)</label>
                              <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px] font-bold font-mono">$</span>
                                 <input 
                                    type="text" 
                                    readOnly 
                                    value={purchasePrice}
                                    className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-[11px] font-black text-blue-500 font-mono"
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                                 {marginMode === 'PERCENT' ? 'Margin Percentage' : marginMode === 'FIXED' ? 'Add-on Amount' : 'Net Margin'}
                              </label>
                              <div className="relative">
                                 <input 
                                    type="number" 
                                    value={marginValue}
                                    onChange={(e) => {
                                       setMarginValue(e.target.value);
                                       if (marginMode === 'PERCENT') {
                                          setSellingPrice((parseFloat(purchasePrice) * (1 + parseFloat(e.target.value)/100)).toFixed(4));
                                       } else if (marginMode === 'FIXED') {
                                          setSellingPrice((parseFloat(purchasePrice) + parseFloat(e.target.value)).toFixed(4));
                                       }
                                    }}
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-[11px] font-black text-amber-600 focus:ring-4 focus:ring-amber-500/5 transition-all outline-none"
                                 />
                                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px] font-bold">{marginMode === 'PERCENT' ? '%' : '$'}</span>
                              </div>
                           </div>
                        </div>

                        <div className="p-5 bg-[#428bca]/5 rounded-3xl border border-[#428bca]/20 flex items-center justify-between group">
                           <div className="space-y-1">
                              <h5 className="text-[10px] font-black text-[#428bca] uppercase tracking-widest group-hover:translate-x-1 duration-300">Target Selling Rate</h5>
                              <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Unified across all link points</p>
                           </div>
                           <div className="text-right">
                              <div className="text-xl font-black text-zinc-900 dark:text-zinc-100 flex items-baseline gap-1 font-mono">
                                 <span className="text-[12px] opacity-30">$</span>
                                 {sellingPrice}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* INTEGRATED: Commercial Strategy Mapping */}
            <div className="grid grid-cols-1 gap-6 hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#428bca]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#428bca]/10 transition-all duration-1000" />
               
               <div className="space-y-2 relative z-10 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <Landmark className="w-5 h-5 text-[#428bca]" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-[12px] font-black text-white uppercase tracking-[0.2em]">
                      Operator Node Management & Failover Strategy
                    </h4>
                  </div>
                </div>
                <div className="h-0.5 w-16 bg-[#428bca] rounded-full" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-0 relative z-10">
                 {/* Left Column: Selection */}
                 <div className="lg:col-span-12 space-y-3 text-left">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase text-[#428bca] tracking-widest font-mono text-left block">1. Supplier Selection</label>
                       <div className="relative group/select">
                          <select 
                            value={selectedVendor}
                            onChange={(e) => {
                              setSelectedVendor(e.target.value);
                              setSelectedAccountForNode('');
                            }}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black outline-none focus:border-[#428bca] appearance-none cursor-pointer hover:bg-white/10 transition-all"
                          >
                             <option value="" className="bg-zinc-900">Select Global Vendor...</option>
                             {Object.keys(vendorsData).map((v) => <option key={v} value={v} className="bg-zinc-900">{v}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                       </div>
                    </div>

                    <div className={cn(
                      "space-y-4 transition-all duration-700",
                      selectedVendor ? "opacity-100 translate-y-0" : "opacity-20 pointer-events-none translate-y-2"
                    )}>
                       <div className="flex justify-between items-center pr-1">
                          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">2. Assign Account Node</label>
                       </div>
                       
                        <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 text-left custom-scrollbar">
                           {selectedVendor && vendorsData[selectedVendor]?.accounts
                             .filter(acc => acc.category === selectedCategories[0])
                             .sort((a, b) => {
                                if (b.quality !== a.quality) return b.quality - a.quality;
                                return a.rate - b.rate;
                             })
                             .map(acc => (
                             <div 
                               key={acc.name}
                               onClick={() => {
                                  if (selectedAccountsForChain.includes(acc.name)) {
                                     setSelectedAccountsForChain(selectedAccountsForChain.filter(a => a !== acc.name));
                                  } else {
                                     setSelectedAccountsForChain([...selectedAccountsForChain, acc.name]);
                                  }
                               }}
                               className={cn(
                                 "p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group/acc",
                                 selectedAccountsForChain.includes(acc.name)
                                   ? "bg-[#428bca] border-[#428bca] text-white shadow-lg" 
                                   : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                               )}
                             >
                                <div className="flex items-center gap-3">
                                   <div className={cn(
                                     "w-7 h-7 rounded-lg flex items-center justify-center transition-colors border",
                                     selectedAccountsForChain.includes(acc.name) ? "bg-white/20 border-white/10" : "bg-white/5 border-white/10"
                                   )}>
                                      <Users className="w-3.5 h-3.5" />
                                   </div>
                                   <div className="flex flex-col text-left">
                                      <div className="flex items-center gap-2">
                                         <span className="text-[11px] font-black tracking-tight">{acc.name}</span>
                                         <span className="text-[8px] font-black text-emerald-500 px-1 bg-emerald-500/10 rounded">{acc.quality}% Q</span>
                                      </div>
                                      <span className={cn(
                                        "text-[8px] font-bold uppercase tracking-widest text-left",
                                        selectedAccountsForChain.includes(acc.name) ? "text-white/60" : "text-zinc-500"
                                      )}>${acc.rate} · {acc.category}</span>
                                   </div>
                                </div>
                                <div className="flex items-center gap-3">
                                   <button onClick={(e) => {
                                     e.stopPropagation();
                                     setShowSupplierPopup({ name: selectedVendor, account: acc.name });
                                   }} className={cn(
                                      "p-1 rounded-md transition-colors",
                                      selectedAccountsForChain.includes(acc.name) ? "hover:bg-white/20 text-white" : "hover:bg-white/10 text-zinc-500"
                                   )}>
                                      <Eye className="w-3.5 h-3.5" />
                                   </button>
                                   {selectedAccountsForChain.includes(acc.name) ? (
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                   ) : (
                                      <Square className="w-4 h-4 text-white/10" />
                                   )}
                                </div>
                             </div>
                           ))}
                        </div>


                       <button 
                         disabled={selectedAccountsForChain.length === 0}
                         onClick={() => {
                           if (selectedAccountsForChain.length === 0) return;
                           const exists = failoverNodes.find(n => n.vendor === selectedVendor && n.account === 'NONE_SURELY');
                           setFailoverNodes(prev => {
                              const combined = [...prev];
                              selectedAccountsForChain.forEach(accName => {
                                 if(!combined.find(n => n.vendor === selectedVendor && n.account === accName)) {
                                    const isInitialPrimary = combined.length === 0;
                                    combined.push({
                                       vendor: selectedVendor,
                                       account: accName,
                                       priority: isInitialPrimary ? 0 : (combined.length > 0 ? Math.max(...combined.map(n => n.priority)) + 1 : 1),
                                       status: 'Active',
                                       holdingTime: isInitialPrimary ? 0 : 3,
                                       weighting: 100,
                                       isPrimary: isInitialPrimary
                                    });
                                 }
                              });
                              return combined.sort((a, b) => a.priority - b.priority);
                           });
                           setSelectedAccountsForChain([]);
                         }}
                         className={cn(
                           "w-full py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-3",
                           selectedAccountsForChain.length > 0
                             ? "bg-[#428bca] text-white hover:bg-blue-600 shadow-xl" 
                             : "bg-white/5 text-zinc-700 grayscale cursor-not-allowed"
                         )}
                       >
                          <Plus className="w-4 h-4" /> Add {selectedAccountsForChain.length} account{selectedAccountsForChain.length !== 1 ? 's' : ''} to Routing Chain
                       </button>
                    </div>
                 </div>

                 {/* Right Column: Active Chain */}
                 <div className="lg:col-span-7 bg-white/5 rounded-[1.5rem] border border-white/5 p-4 flex flex-col text-left">
                    <div className="flex justify-between items-center mb-3">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-[#428bca] font-mono flex items-center gap-2">
                          <Database className="w-3.5 h-3.5" /> Routing Architecture Pipeline
                       </h5>
                       <span className="text-[8px] font-bold text-zinc-600 uppercase tabular-nums">{failoverNodes.length} Linked Nodes</span>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[350px] min-h-[300px] pr-1 space-y-2">
                       {failoverNodes.length > 0 ? failoverNodes.map((node, idx) => (
                         <div key={`${node.vendor}-${node.account}`} className="p-2 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-1.5 group animate-in slide-in-from-right-3">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-2">
                                  <div className={cn(
                                    "w-5 h-5 rounded flex items-center justify-center text-[9px] font-black",
                                    node.isPrimary ? "bg-[#428bca] text-white" : "bg-zinc-800 text-zinc-400"
                                  )}>
                                     {node.isPrimary ? 'P' : node.priority}
                                  </div>
                                  <div className="flex flex-col text-left">
                                     <span className="text-[10px] font-black text-white">{node.account}</span>
                                     <span className="text-[7px] font-bold text-zinc-600 uppercase">
                                        {node.isPrimary ? 'Primary Active Route' : `Failover Sequence ${node.priority}`}
                                     </span>
                                  </div>
                               </div>
                               <div className="flex items-center gap-1">
                                  <div className="flex flex-col gap-0.5">
                                     <button 
                                       onClick={() => {
                                         if (idx === 0) return;
                                         const next = [...failoverNodes];
                                         const current = { ...next[idx] };
                                         const above = { ...next[idx-1] };
                                         next[idx] = above;
                                         next[idx-1] = current;
                                         setFailoverNodes(next);
                                       }}
                                       disabled={idx === 0}
                                       className="p-0.5 hover:bg-white/10 rounded transition-colors text-zinc-600 hover:text-white disabled:opacity-20 flex items-center justify-center"
                                     >
                                        <ChevronUp className="w-2.5 h-2.5" />
                                     </button>
                                     <button 
                                       onClick={() => {
                                         if (idx === failoverNodes.length - 1) return;
                                         const next = [...failoverNodes];
                                         const current = { ...next[idx] };
                                         const below = { ...next[idx+1] };
                                         next[idx] = below;
                                         next[idx+1] = current;
                                         setFailoverNodes(next);
                                       }}
                                       disabled={idx === failoverNodes.length - 1}
                                       className="p-0.5 hover:bg-white/10 rounded transition-colors text-zinc-600 hover:text-white disabled:opacity-20 flex items-center justify-center"
                                     >
                                        <ChevronDown className="w-2.5 h-2.5" />
                                     </button>
                                  </div>
                                  <button 
                                   onClick={() => setFailoverNodes(prev => prev.filter(p => !(p.vendor === node.vendor && p.account === node.account)))}
                                   className="p-1 text-zinc-600 hover:text-rose-500 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                               </div>
                            </div>
                             <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-white/5">
                               <div className="space-y-0.5 col-span-2">
                                  <div className="text-[7px] font-black uppercase text-zinc-600 mb-1">Account Role</div>
                                  <select 
                                    value={node.isPrimary ? 'Primary' : 'Secondary'}
                                    onChange={(e) => {
                                      const isPrimary = e.target.value === 'Primary';
                                      let next = [...failoverNodes];
                                      const nIdx = next.findIndex(n => n.vendor === node.vendor && n.account === node.account);
                                      if (nIdx > -1) {
                                         if (isPrimary) {
                                            // Make others secondary
                                            next = next.map(n => ({ ...n, isPrimary: false, priority: n.priority === 0 ? 1 : n.priority }));
                                            next[nIdx].isPrimary = true;
                                            next[nIdx].priority = 0;
                                         } else {
                                            next[nIdx].isPrimary = false;
                                            if (next[nIdx].priority === 0) next[nIdx].priority = 1;
                                            if (next[nIdx].holdingTime === 0) next[nIdx].holdingTime = 3;
                                         }
                                         setFailoverNodes(next.sort((a, b) => a.priority - b.priority));
                                      }
                                    }}
                                    className="w-full px-2 py-1 bg-zinc-800 border border-white/5 rounded text-[10px] text-white outline-none focus:border-[#428bca] appearance-none cursor-pointer"
                                  >
                                    <option value="Primary">Primary</option>
                                    <option value="Secondary">Secondary</option>
                                  </select>
                               </div>

                               <div className="space-y-0.5">
                                  <div className="flex justify-between text-[7px] font-black uppercase text-zinc-600">
                                     <span>Holding Time (Sec)</span>
                                     <span className="text-[#428bca]">{node.holdingTime}s</span>
                                  </div>
                                  <input 
                                     type="number" 
                                     value={node.holdingTime}
                                     onChange={(e) => {
                                        const next = [...failoverNodes];
                                        const nIdx = next.findIndex(n => n.vendor === node.vendor && n.account === node.account);
                                        if (nIdx > -1) {
                                           next[nIdx].holdingTime = parseInt(e.target.value) || 0;
                                           setFailoverNodes(next);
                                        }
                                     }}
                                     className="w-full px-2 py-1 bg-zinc-800 border border-white/5 rounded text-[10px] text-white outline-none focus:border-[#428bca]"
                                  />
                               </div>

                               {!node.isPrimary ? (
                                  <div className="space-y-0.5">
                                      <div className="flex justify-between text-[7px] font-black uppercase text-zinc-600">
                                         <span>Priority (1-5)</span>
                                         <span className="text-[#428bca]">{node.priority}</span>
                                      </div>
                                      <select 
                                         value={node.priority}
                                         onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            const next = [...failoverNodes];
                                            const nIdx = next.findIndex(n => n.vendor === node.vendor && n.account === node.account);
                                            if (nIdx > -1) {
                                               next[nIdx].priority = val;
                                               // Auto-sort priority wise
                                               setFailoverNodes([...next].sort((a, b) => a.priority - b.priority));
                                            }
                                         }}
                                         className="w-full px-2 py-1 bg-zinc-800 border border-white/5 rounded text-[10px] text-white outline-none focus:border-[#428bca] appearance-none cursor-pointer"
                                      >
                                        {[1, 2, 3, 4, 5].map(p => (
                                          <option key={p} value={p}>{p}</option>
                                        ))}
                                      </select>
                                   </div>
                               ) : (
                                 <div className="pt-1 flex items-center justify-center gap-2 bg-[#428bca]/10 rounded border border-[#428bca]/20 py-2">
                                    <Zap className="w-3 h-3 text-[#428bca]" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#428bca]">Primary Active</span>
                                 </div>
                               )}
                            </div>

                         </div>
                       )) : (
                         <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-50 py-20 gap-2">
                            <RotateCcw className="w-8 h-8" />
                            <p className="text-[9px] font-black uppercase tracking-widest">No active routing chain</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'USERS':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left pb-6">
            {/* Strategy Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Globe className="w-5 h-5 text-[#428bca]" />
                </div>
                <h4 className="text-[12px] font-black text-[#428bca] uppercase tracking-widest">
                  User Access Management
                </h4>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-[#428bca] to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
               {/* Selection Logic */}
               <div className="xl:col-span-4 space-y-6">
                 <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-6 shadow-inner">
                   <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">User Condition</label>
                      <div className="relative group/select">
                        <select className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-[#428bca]/5 focus:border-[#428bca] transition-all appearance-none cursor-pointer">
                           <option>Equals</option>
                           <option>Contains</option>
                           <option>Not Contains</option>
                           <option>Not Equals</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">Assigned Users</label>
                      <textarea 
                        rows={4}
                        value={assignedUsers}
                        onChange={(e) => setAssignedUsers(e.target.value)}
                        placeholder="List of assigned users will appear here..."
                        className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-[#428bca]/5 focus:border-[#428bca] transition-all placeholder:text-zinc-300 resize-none"
                      />
                   </div>
                 </div>
               </div>

               {/* Result Area */}
               <div className="xl:col-span-8 space-y-6">
                  <div className="w-full h-full min-h-[300px] border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-6 p-8 text-center group transition-all duration-700 shadow-inner">
                     <div className="relative">
                        <div className="absolute inset-0 bg-[#428bca]/10 rounded-full blur-2xl animate-pulse" />
                        <div className="relative w-24 h-24 bg-white dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                           <Users className="w-10 h-10 text-zinc-200 group-hover:text-[#428bca] transition-colors" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-300 group-hover:text-zinc-400">No Users Assigned</p>
                        <p className="text-[10px] font-bold text-zinc-400 max-w-[300px] leading-relaxed mx-auto italic">Use the selector on the left to associate user accounts with this SMS product.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-6">
                <button 
                  onClick={() => setActiveTab('BASIC')}
                  className="px-12 py-5 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all"
                >
                  PREVIOUS
                </button>
                <button 
                  onClick={() => setActiveTab('SENDER ID')}
                  className="px-16 py-5 bg-[#428bca] text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95"
                >
                  Next: Identity Guards <ArrowRight className="w-5 h-5" />
                </button>
            </div>
          </div>
        );
      case 'SENDER ID':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Type className="w-5 h-5 text-[#428bca]" />
                </div>
                <h4 className="text-[12px] font-black text-[#428bca] uppercase tracking-widest">
                  Sender ID Signature Guard
                </h4>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-[#428bca] to-transparent rounded-full shadow-[0_5px_15px_rgba(66,139,202,0.3)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                 <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-6 shadow-inner">
                    <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">Senderid Condition</label>
                       <div className="relative group/select">
                          <select className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-black text-xs outline-none focus:ring-4 focus:ring-[#428bca]/5 appearance-none cursor-pointer transition-all">
                            <option>Equals</option>
                            <option>Contains</option>
                            <option>Not Contains</option>
                            <option>Not Equals</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">Assigned Sender IDs</label>
                       <textarea 
                         rows={4}
                         value={assignedSenderIds}
                         onChange={(e) => setAssignedSenderIds(e.target.value)}
                         placeholder="Example: GOOGLE, MY_BRAND..."
                         className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-black text-xs outline-none focus:ring-4 focus:ring-[#428bca]/5 transition-all resize-none"
                       />
                       <p className="text-[9px] font-bold text-zinc-400 italic font-mono uppercase tracking-tighter">Note : File format in CSV like (Senderid,Condition)..</p>
                    </div>

                    <div className="pt-0">
                       <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#428bca] hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                         <Upload className="w-3.5 h-3.5" /> Choose a file
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-zinc-900 rounded-2xl text-white space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white/5 rounded-xl">
                          <Shield className="w-6 h-6 text-blue-400" />
                       </div>
                       <div>
                          <h5 className="text-[12px] font-black uppercase tracking-widest text-blue-400">KYC Compliance</h5>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight mt-0.5">Regulatory Binding Requirements</p>
                       </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-[10px] font-bold text-zinc-400 italic leading-relaxed">
                         "Associating a specific Sender ID profile with this product enforces routing only for verified brand signatures. Non-compliant traffic will be automatically rejected at the gateway."
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-4">
                <button onClick={() => setActiveTab('USERS')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all font-sans">BACK</button>
                <button onClick={() => setActiveTab('MOBILE NO')} className="px-10 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 font-sans">Next: Contact Filtering <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        );
      case 'MOBILE NO':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Phone className="w-5 h-5 text-[#428bca]" />
                </div>
                <h4 className="text-[12px] font-black text-[#428bca] uppercase tracking-widest">
                  Mobile Number Filtering
                </h4>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-[#428bca] to-transparent rounded-full shadow-[0_5px_15px_rgba(66,139,202,0.3)]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                 <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-6 shadow-inner">
                    <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">Mobile Number Condition</label>
                       <div className="relative group/select">
                          <select className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-black text-xs outline-none focus:ring-4 focus:ring-[#428bca]/5 appearance-none cursor-pointer transition-all">
                            <option>Equals</option>
                            <option>Contains</option>
                            <option>Not Contains</option>
                            <option>Not Equals</option>
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                       <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider font-mono">Assigned Mobile Numbers</label>
                       <textarea 
                         rows={4}
                         value={assignedMobileNumbers}
                         onChange={(e) => setAssignedMobileNumbers(e.target.value)}
                         placeholder="Example: 9198XXXXXXXX, 44XXXXXXXXXX..."
                         className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-black text-xs outline-none focus:ring-4 focus:ring-[#428bca]/5 transition-all resize-none"
                       />
                       <p className="text-[9px] font-bold text-zinc-400 italic">Note : File format in CSV like (MobileNo,Condition)..</p>
                    </div>

                    <div className="pt-0">
                       <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase tracking-widest text-[#428bca] hover:scale-[1.02] active:scale-95 transition-all shadow-sm">
                         <Upload className="w-4 h-4" /> Choose a file
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="p-6 bg-emerald-900 rounded-2xl text-white space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full" />
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white/5 rounded-xl">
                          <Check className="w-6 h-6 text-emerald-400" />
                       </div>
                       <div>
                          <h5 className="text-[12px] font-black uppercase tracking-widest text-emerald-400">Destination Validation</h5>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight mt-0.5">E.164 Global Compliance</p>
                       </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                       <p className="text-[10px] font-bold text-zinc-200 italic leading-relaxed">
                         "Filtering by mobile number allows for precise targeting or blocking of specific MSISDN ranges. This is critical for testing environments or strictly regulated outbound campaigns."
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-4">
                <button onClick={() => setActiveTab('SENDER ID')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all font-sans">BACK</button>
                <button onClick={() => setActiveTab('CONTENT')} className="px-10 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 font-sans">Next: Message Content <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        );
      case 'CONTENT':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <FileCode className="w-5 h-5 text-[#428bca]" />
                </div>
                <h4 className="text-[12px] font-black text-[#428bca] uppercase tracking-widest">
                  Message Content Rules
                </h4>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-[#428bca] to-transparent rounded-full" />
            </div>

            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-100 dark:border-zinc-800 rounded-3xl space-y-6">
               <div className="flex items-start gap-4">
                  <Info className="w-4 h-4 text-[#428bca] mt-0.5" />
                  <p className="text-[11px] font-bold text-zinc-500 italic">
                    Note* : Please select file in XLS format (Content separated by ;)
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Content condition</label>
                        <select 
                          value={contentCondition}
                          onChange={(e) => setContentCondition(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-[#428bca]/5 transition-all"
                        >
                          <option>Does not contains</option>
                          <option>Contains</option>
                          <option>Equals</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Input Content</label>
                        <textarea 
                          rows={6}
                          value={contentText}
                          onChange={(e) => setContentText(e.target.value)}
                          placeholder="Enter keywords or phrases to match..."
                          className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-[#428bca]/5 transition-all resize-none"
                        />
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50 gap-4">
                        <div className="w-12 h-12 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                           <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                           <button className="px-6 py-2.5 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/20">
                              Choose a file
                           </button>
                           <p className="text-[9px] font-bold text-zinc-400 mt-2 flex items-center justify-center gap-1">
                             <Download className="w-3 h-3" /> XLS Template
                           </p>
                        </div>
                     </div>

                     <button className="w-full py-4 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                        <Save className="w-4 h-4" /> Save Content Rules
                     </button>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <h5 className="text-[11px] font-black uppercase text-[#428bca] tracking-widest">Routing Details - defaultPlan</h5>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-bold text-zinc-400">Items per page:</span>
                     <select className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border-none text-[9px] font-black rounded-lg">
                        <option>10</option>
                        <option>25</option>
                        <option>50</option>
                     </select>
                  </div>
               </div>

               <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead className="bg-zinc-50 dark:bg-zinc-900">
                        <tr className="border-b border-zinc-200 dark:border-zinc-800">
                           {['Sr.No.', 'Service Name', 'Holding Time', 'Weightage', 'Up', 'Details', 'Action'].map(h => (
                             <th key={h} className="px-6 py-3 text-[9px] font-black uppercase text-zinc-400 tracking-wider border-r border-zinc-100 dark:border-zinc-800 last:border-r-0">{h}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-100 dark:divide-zinc-800">
                        <tr>
                           <td colSpan={7} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center gap-2 text-zinc-300">
                                 <Database className="w-8 h-8 opacity-20" />
                                 <p className="text-[10px] font-black uppercase tracking-widest italic font-mono">No records found</p>
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>

               <div className="flex items-center justify-between px-2 pt-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase italic">Total 0 Records Found</p>
                  <div className="flex items-center gap-1">
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-[#428bca] transition-all"><ArrowLeft className="w-4 h-4" /></button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#428bca] text-white text-[10px] font-black">1</button>
                     <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-[#428bca] transition-all"><ArrowRight className="w-4 h-4" /></button>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-4">
                <button onClick={() => setActiveTab('MOBILE NO')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all font-sans">BACK</button>
                <button onClick={() => setActiveTab('LCR')} className="px-10 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 font-sans">Next: LCR Comparison <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        );
      case 'LCR':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-xl">
                  <Landmark className="w-5 h-5 text-emerald-500" />
                </div>
                <h4 className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">
                  LCR Optimization & Price Discovery
                </h4>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-emerald-500 to-transparent rounded-full shadow-[0_5px_15px_rgba(16,185,129,0.3)]" />
            </div>

            <div className="bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-8">
               <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                       lcrEnabled ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "bg-zinc-100 text-zinc-400"
                     )}>
                        <BarChart3 className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-100">Live price comparison</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Compare delivery quality and pricing across all suppliers</p>
                     </div>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer" onClick={() => setLcrEnabled(!lcrEnabled)}>
                    <div className={cn(
                      "w-14 h-7 rounded-full transition-colors relative",
                      lcrEnabled ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                    )}>
                       <div className={cn(
                         "absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                         lcrEnabled ? "translate-x-7" : "translate-x-0"
                       )} />
                    </div>
                  </div>
               </div>

               {/* Revenue Settings (Screenshot based) */}
               <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 px-1">
                     <Shield className="w-4 h-4 text-[#d9534f]" />
                     <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Revenue Selection Setting</label>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                     {['No Loss', 'Only Profit', 'Limited Loss', 'Targeted Profit'].map((option) => (
                        <label key={option} className="flex items-center gap-3 cursor-pointer group">
                           <div className="relative flex items-center justify-center">
                              <input 
                                 type="radio" 
                                 name="revenueSetting"
                                 value={option}
                                 checked={revenueSetting === option}
                                 onChange={(e) => setRevenueSetting(e.target.value)}
                                 className="sr-only"
                              />
                              <div className={cn(
                                 "w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center",
                                 revenueSetting === option ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-400"
                              )}>
                                 {revenueSetting === option && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm" />}
                              </div>
                           </div>
                           <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest",
                              revenueSetting === option ? "text-emerald-500" : "text-zinc-500"
                           )}>{option}</span>
                        </label>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-left-2 duration-300">
                     {(revenueSetting === 'Only Profit' || revenueSetting === 'Targeted Profit') && (
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Min Profit (%)</label>
                           <div className="relative">
                              <input 
                                 type="number" 
                                 value={minProfitPercent}
                                 onChange={(e) => setMinProfitPercent(e.target.value)}
                                 className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">%</span>
                           </div>
                        </div>
                     )}
                     {revenueSetting === 'Limited Loss' && (
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Max Loss (%)</label>
                           <div className="relative">
                              <input 
                                 type="number" 
                                 value={maxLossPercent}
                                 onChange={(e) => setMaxLossPercent(e.target.value)}
                                 className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-rose-500/5 transition-all"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">%</span>
                           </div>
                        </div>
                     )}
                     {revenueSetting === 'Targeted Profit' && (
                        <div className="space-y-2">
                           <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Target Profit (%)</label>
                           <div className="relative">
                              <input 
                                 type="number" 
                                 value={targetProfitPercent}
                                 onChange={(e) => setTargetProfitPercent(e.target.value)}
                                 className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                              />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">%</span>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Advanced Wholesale LCR Controls */}
               <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 px-1">
                     <Settings2 className="w-4 h-4 text-emerald-500" />
                     <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Wholesale LCR Controls</label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Min Quality</span>
                           <span className="text-[10px] font-black text-emerald-500">{minQualityDlr}% DLR</span>
                        </div>
                        <input 
                           type="range" 
                           min="0" 
                           max="100" 
                           value={minQualityDlr}
                           onChange={(e) => setMinQualityDlr(parseInt(e.target.value))}
                           className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                     </div>
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Auto-Switch Strategy</span>
                        <select className="w-full bg-transparent border-none text-[10px] font-black text-zinc-800 dark:text-zinc-100 outline-none p-0 cursor-pointer">
                           <option>Aggressive Cost (LCR)</option>
                           <option>Quality Balanced</option>
                           <option>Premium Direct Only</option>
                        </select>
                     </div>
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Max Retry Path</span>
                        <div className="flex items-center gap-3">
                           <input type="number" defaultValue={3} className="w-full bg-transparent border-none text-[12px] font-black text-[#428bca] outline-none p-0" />
                           <RotateCcw className="w-3 h-3 text-zinc-300" />
                        </div>
                     </div>
                     <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
                        <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Scan Mode</span>
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black text-zinc-800 dark:text-zinc-100 uppercase">Real-time</span>
                           <div className="w-8 h-4 bg-emerald-500 rounded-full relative shadow-inner">
                              <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* LCR Price Discovery Tool */}
               <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono px-1">Discover Best Rates by MCCMNC / Prefix / Country</label>
                  <div className="flex gap-3">
                     <select 
                        value={lcrSearchType}
                        onChange={(e) => setLcrSearchType(e.target.value)}
                        className="px-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black uppercase outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                     >
                        <option>MCCMNC</option>
                        <option>Prefix</option>
                        <option>Country</option>
                     </select>
                     <div className="relative flex-1">
                        <Globe2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                           type="text" 
                           value={lcrSearchPrefix}
                           onChange={(e) => setLcrSearchPrefix(e.target.value)}
                           placeholder={`Enter ${lcrSearchType}...`}
                           className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-black outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm" 
                        />
                     </div>
                     <button 
                       onClick={runLcrScan}
                       disabled={isLcrScanning}
                       className="px-8 py-3.5 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-emerald-500/20 active:scale-95"
                     >
                        {isLcrScanning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        {isLcrScanning ? 'Comparing...' : 'Compare Suppliers'}
                     </button>
                  </div>

                  {lcrComparisonResults.length > 0 && (
                     <div className="mt-2 border border-zinc-200 dark:border-zinc-700 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 animate-in slide-in-from-top-4 duration-500 shadow-xl">
                        <table className="w-full text-left border-collapse">
                           <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                                 <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Type</th>
                                 <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Search Param</th>
                                 <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Supplier Account</th>
                                 <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Buy Rate</th>
                                 <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Quality (DLR%)</th>
                                 <th className="px-6 py-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center">Outcome</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                              {lcrComparisonResults.map((res: any, i: number) => (
                                 <tr key={i} className={cn("group hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-colors cursor-pointer", i === 0 && "bg-emerald-50/30 dark:bg-emerald-500/5")}>
                                    <td className="px-6 py-4">
                                       <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[8px] font-black uppercase text-zinc-500">{res.type || 'MCCMNC'}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[10px] font-black text-[#428bca] uppercase tracking-tighter">{res.param}</td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px]",
                                            i === 0 ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                          )}>
                                             {i + 1}
                                          </div>
                                          <div>
                                             <p className="text-[10px] font-black text-zinc-800 dark:text-zinc-100 uppercase">{res.vendor}</p>
                                             <p className="text-[8px] font-bold text-zinc-400 font-mono tracking-tighter italic">{res.account}</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-[11px] font-black text-emerald-500">${res.rate.toFixed(4)}</td>
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-3">
                                          <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden w-16">
                                             <div className={cn(
                                               "h-full transition-all duration-1000",
                                               res.quality > 95 ? "bg-emerald-500" : res.quality > 90 ? "bg-blue-500" : "bg-amber-500"
                                             )} style={{ width: `${res.quality}%` }} />
                                          </div>
                                          <span className="text-[10px] font-black tabular-nums text-zinc-500">{res.quality}%</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                       <span className={cn(
                                         "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest inline-block border",
                                         res.status === 'PROFITABLE' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                                         res.status === 'QUALITY_MATCH' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                         "bg-zinc-100 text-zinc-500 border-zinc-200 dark:border-zinc-700"
                                       )}>{res.status}</span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-4">
                <button onClick={() => setActiveTab('CONTENT')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all font-sans">BACK</button>
                <button onClick={() => setActiveTab('OTHER')} className="px-10 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95 font-sans">Next: Advanced Filters <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        );
      case 'OTHER':
        return (
          <div className="space-y-8 animate-in fade-in duration-500 text-left pb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#d9534f]/10 rounded-xl">
                  <Filter className="w-5 h-5 text-[#d9534f]" />
                </div>
                <h4 className="text-[12px] font-black text-[#d9534f] uppercase tracking-widest">
                  Other
                </h4>
              </div>
              <div className="h-1 w-16 bg-gradient-to-r from-[#d9534f] to-transparent rounded-full shadow-[0_5px_15px_rgba(217,83,79,0.3)]" />
            </div>

            {/* Manage LCR Filter Rules (Screenshot 3-12) */}
            <div className="space-y-6">
               <div className="border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-950 shadow-sm flex flex-col">
                  {/* Internal Tabs */}
                  <div className="flex border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900">
                     {[
                       { id: 'RESTRICTED', label: 'RESTRICTED SUPPLIERS/SERVICES' },
                       { id: 'CLIENT', label: 'CLIENT ATTRIBUTE' },
                       { id: 'SMS', label: 'SMS ATTRIBUTES' },
                       { id: 'TIME', label: 'TIME ATTRIBUTES' }
                     ].map(tab => (
                       <button 
                         key={tab.id}
                         onClick={() => setLcrSubTab(tab.id)}
                         className={cn(
                           "px-6 py-4 text-[9px] font-black uppercase tracking-widest transition-all relative",
                           lcrSubTab === tab.id ? "text-[#428bca]" : "text-zinc-400 hover:text-zinc-600"
                         )}
                       >
                          {tab.label}
                          {lcrSubTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#428bca]" />}
                       </button>
                     ))}
                  </div>

                  {/* Sub-tab Content */}
                  <div className="p-8">
                     {lcrSubTab === 'RESTRICTED' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Rule Name <span className="text-red-500">*</span></label>
                                 <input 
                                   type="text" 
                                   value={lcrRuleName}
                                   onChange={(e) => setLcrRuleName(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Remarks</label>
                                 <textarea 
                                   rows={3} 
                                   value={lcrRuleRemarks}
                                   onChange={(e) => setLcrRuleRemarks(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500 resize-none" 
                                 />
                              </div>
                           </div>
                           <div className="space-y-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Select Supplier <span className="text-red-500">*</span></label>
                                 <select className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500">
                                    <option>Select Supplier*</option>
                                    <option>Alpha System</option>
                                    <option>Connect Wave</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Sending Service <span className="text-red-500">*</span></label>
                                 <select className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500">
                                    <option>Sending Service*</option>
                                    <option>Service A</option>
                                    <option>Service B</option>
                                 </select>
                              </div>
                              <div className="pt-2">
                                 <button onClick={handleAddRule} className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">Add Criteria Rule</button>
                              </div>
                           </div>
                        </div>
                     )}

                     {lcrSubTab === 'CLIENT' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Criteria Attributes</label>
                                 <select 
                                   value={lcrCriteriaAttribute}
                                   onChange={(e) => setLcrCriteriaAttribute(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                 >
                                    <option>Client</option>
                                    <option>User Id</option>
                                    <option>Plan</option>
                                    <option>Plan Name</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Criteria Condition</label>
                                 <select 
                                   value={lcrCriteriaCondition}
                                   onChange={(e) => setLcrCriteriaCondition(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                 >
                                    <option>Equals</option>
                                    <option>Does not equal</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Select User</label>
                                 <select 
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                 >
                                    <option>Select User</option>
                                    <option>Admin</option>
                                    <option>User 1</option>
                                 </select>
                              </div>
                           </div>
                           <button onClick={handleAddRule} className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">Add Criteria Rule</button>
                        </div>
                     )}

                     {lcrSubTab === 'SMS' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                              <div className="space-y-6">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Criteria Attributes</label>
                                    <select 
                                      value={lcrSmsAttribute}
                                      onChange={(e) => setLcrSmsAttribute(e.target.value)}
                                      className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                    >
                                       <option>Source SenderId</option>
                                       <option>Destination Mobile No.</option>
                                       <option>SMS Content</option>
                                       <option>Destination Country</option>
                                       <option>Destination Country Name</option>
                                       <option>Destination Operator</option>
                                       <option>Destination Operator Name</option>
                                       <option>Prefix</option>
                                       <option>MCC or MCCMNC</option>
                                       <option>SMS Type</option>
                                    </select>
                                 </div>
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Criteria Condition</label>
                                    <select 
                                      value={lcrSmsCondition}
                                      onChange={(e) => setLcrSmsCondition(e.target.value)}
                                      className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                    >
                                       <option>Contains</option>
                                       <option>Equals</option>
                                       <option>Starts With</option>
                                       <option>Ends With</option>
                                    </select>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Input Values</label>
                                 <textarea 
                                    rows={5} 
                                    value={lcrSmsValue}
                                    onChange={(e) => setLcrSmsValue(e.target.value)}
                                    placeholder="Enter values separated by Comma(,) or Semicolon(;)..."
                                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500 resize-none"
                                 />
                                 <p className="text-[9px] font-bold text-zinc-400 italic">Note: Multiple values can be separated by Comma(,) or Semicolon(;).</p>
                              </div>
                           </div>
                           <button onClick={handleAddRule} className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">Add Criteria Rule</button>
                        </div>
                     )}

                     {lcrSubTab === 'TIME' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Criteria Attributes</label>
                                 <select 
                                   value={lcrTimeAttribute}
                                   onChange={(e) => setLcrTimeAttribute(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                 >
                                    <option>Queue Time</option>
                                    <option>Routing Time</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Criteria Condition</label>
                                 <select 
                                   value={lcrTimeCondition}
                                   onChange={(e) => setLcrTimeCondition(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                                 >
                                    <option>Time Range</option>
                                    <option>Date Range</option>
                                    <option>Restricted Days</option>
                                 </select>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">From Time</label>
                                 <input 
                                   type="time" 
                                   value={lcrFromTime}
                                   onChange={(e) => setLcrFromTime(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">To Time</label>
                                 <input 
                                   type="time" 
                                   value={lcrToTime}
                                   onChange={(e) => setLcrToTime(e.target.value)}
                                   className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-black outline-none focus:border-blue-500" 
                                 />
                              </div>
                           </div>
                           <button onClick={handleAddRule} className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95">Add Criteria Rule</button>
                        </div>
                     )}

                     {/* Removed Add Rule and Close buttons as per request */}
                  </div>
                </div>
             </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-end gap-4">
               <button onClick={() => setActiveTab('LCR')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-all font-sans">BACK</button>
               <button onClick={onClose} className="px-10 py-3 bg-[#d9534f] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-rose-700 transition-all flex items-center gap-2 active:scale-95 font-sans">Finish Setup <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        );
      case 'RULES':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 italic">Rule Matrix for {productName}</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Multi-Parameter Policy Enforcement Engine</p>
              </div>
              {!isViewOnly && (
                <button 
                  onClick={() => setIsAddingRule(!isAddingRule)}
                  className="px-6 py-2.5 bg-[#428bca] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-600 active:scale-95 flex items-center gap-2"
                >
                  <Plus className={cn("w-4 h-4 transition-transform", isAddingRule && "rotate-45")} />
                  {isAddingRule ? 'Collapse Form' : 'Create Custom Rule'}
                </button>
              )}
            </div>

            {/* EXPANDABLE RULE SETUP FORM */}
            {isAddingRule && (
              <div className="p-8 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="border-b border-zinc-200 dark:border-zinc-700 pb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[#428bca] flex items-center gap-2">
                    <Settings2 className="w-4 h-4" /> Rule Parameters Configuration
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Specify matching criteria and downstream actions for routing logic</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Rule Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Rule Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                      placeholder="e.g. High Priority India Airtel Route"
                    />
                  </div>

                  {/* Logic Type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Logic Type</label>
                    <select 
                      value={newRuleType}
                      onChange={(e) => setNewRuleType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                    >
                      <option value="Direct">Direct</option>
                      <option value="Failover">Failover</option>
                      <option value="Quota">Quota / Weight Distribution</option>
                      <option value="Content Rule">Sms Content Block</option>
                    </select>
                  </div>

                  {/* Country Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Target Country <span className="text-red-400">*</span></label>
                    <select 
                      value={newRuleCountry}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewRuleCountry(val);
                        // Default first code or All
                        if (val !== 'All' && countries[val]) {
                          setNewRuleMccmnc(countries[val][0]);
                        } else {
                          setNewRuleMccmnc('All');
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                    >
                      <option value="All">All Countries (Global Default)</option>
                      {Object.keys(countries).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* MCCMNC */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">MCC-MNC Mapping <span className="text-red-400">*</span></label>
                    {newRuleCountry === 'All' ? (
                      <input 
                        type="text"
                        value={newRuleMccmnc}
                        onChange={(e) => setNewRuleMccmnc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca]"
                        placeholder="e.g. All, 404-45"
                      />
                    ) : (
                      <select 
                        value={newRuleMccmnc}
                        onChange={(e) => setNewRuleMccmnc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                      >
                        <option value="All">All Carriers</option>
                        {countries[newRuleCountry]?.map(code => (
                          <option key={code} value={code}>{code}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Supplier Vendor Selection */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Supplier (Vendor)</label>
                    <select 
                      value={newRuleSupplier}
                      onChange={(e) => {
                        const ver = e.target.value;
                        setNewRuleSupplier(ver);
                        if (ver !== 'All' && vendorsData[ver]) {
                          setNewRuleSupplierAcc(vendorsData[ver].accounts[0].name);
                        } else {
                          setNewRuleSupplierAcc('All');
                        }
                      }}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                    >
                      <option value="All">All (LCR Dynamic Auto Select)</option>
                      {Object.keys(vendorsData).map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Supplier Account */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Supplier Account Trunk</label>
                    {newRuleSupplier === 'All' ? (
                      <select disabled className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-zinc-400">
                        <option value="All">LCR Auto Decision</option>
                      </select>
                    ) : (
                      <select 
                        value={newRuleSupplierAcc}
                        onChange={(e) => setNewRuleSupplierAcc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                      >
                        {vendorsData[newRuleSupplier]?.accounts.map(acc => (
                          <option key={acc.name} value={acc.name}>{acc.name} (${acc.rate.toFixed(4)} rate)</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* QoS Minimum DLR */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Min DLR Threshold (%)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range"
                        min="10"
                        max="99"
                        value={newRuleDlr}
                        onChange={(e) => setNewRuleDlr(parseInt(e.target.value))}
                        className="flex-1 focus:ring-0"
                      />
                      <span className="w-12 text-center text-xs font-black font-mono px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-lg">{newRuleDlr}%</span>
                    </div>
                  </div>

                  {/* QoS Minimum ASR */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Min ASR Threshold (%)</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="range"
                        min="5"
                        max="80"
                        value={newRuleAsr}
                        onChange={(e) => setNewRuleAsr(parseInt(e.target.value))}
                        className="flex-1 focus:ring-0"
                      />
                      <span className="w-12 text-center text-xs font-black font-mono px-2 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-750 rounded-lg">{newRuleAsr}%</span>
                    </div>
                  </div>

                  {/* Action policy */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Action Policy</label>
                    <select 
                      value={newRuleActionType}
                      onChange={(e) => setNewRuleActionType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                    >
                      <option value="Force Route">Force Route Specific Trunk</option>
                      <option value="Failover Block">Trigger Failover Code blocks</option>
                      <option value="Surcharge Markup">Apply Surcharge</option>
                      <option value="Speed Cap TPS">Throttling Speed Rate</option>
                      <option value="Dynamic LCR">Fallback to Dynamic LCR</option>
                    </select>
                  </div>

                  {/* Speed caps Limit TPS */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Limit Throughput (TPS)</label>
                    <input 
                      type="number"
                      value={newRuleLimitTps}
                      onChange={(e) => setNewRuleLimitTps(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca]"
                      placeholder="e.g. 100"
                    />
                  </div>

                  {/* Sender ID rule type */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">SenderID Security Rule</label>
                    <select 
                      value={newRuleSenderIdRule}
                      onChange={(e) => setNewRuleSenderIdRule(e.target.value as any)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#428bca] transition-all"
                    >
                      <option value="Allow">Allow Any SenderID</option>
                      <option value="Block">Block Numeric SenderIDs (Anti-Spoofing)</option>
                      <option value="Overwrite">Force Overwrite SenderID</option>
                    </select>
                  </div>

                  {/* Overwrite value */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Force Overwrite SenderID Value</label>
                    <input 
                      type="text"
                      disabled={newRuleSenderIdRule !== 'Overwrite'}
                      value={newRuleSenderIdVal}
                      onChange={(e) => setNewRuleSenderIdVal(e.target.value)}
                      className={cn(
                        "w-full px-4 py-2.5 border rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5",
                        newRuleSenderIdRule === 'Overwrite' 
                          ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-750 focus:border-[#428bca]"
                          : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                      )}
                      placeholder="e.g. INFOSMS"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <button 
                    onClick={() => setIsAddingRule(false)}
                    className="px-6 py-2.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddRule}
                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]"
                  >
                    Save & Deploy Rule Node
                  </button>
                </div>
              </div>
            )}

            {/* RULE MATRIX TABLE LIST */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8f9fa] dark:bg-zinc-800/60 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Priority</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Rule Scope & Parameters</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Route Type</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Downstream Target</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">QoS / Traffic Checks</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em]">Status</th>
                      <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic tracking-[0.2em] text-center">Action Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                    {productRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors group">
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-zinc-900 border border-zinc-850 text-white text-[10.5px] font-mono font-black rounded-lg">{rule.priority}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1 text-left">
                            <p className="text-[12px] font-black text-zinc-900 dark:text-zinc-100 uppercase italic">{rule.name}</p>
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/10 text-[#428bca] text-[8.5px] font-extrabold uppercase rounded">
                                Country: {rule.country || 'Global'}
                              </span>
                              <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-900/10 text-amber-600 text-[8.5px] font-mono font-bold rounded">
                                MCCMNC: {rule.mccmnc || 'All'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            rule.type === 'Direct' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                          )}>
                            {rule.type || 'Custom'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-left">
                          <div className="space-y-1">
                            {rule.supplier && rule.supplier !== 'All' ? (
                              <>
                                <span className="text-[10.5px] font-extrabold text-zinc-700 dark:text-zinc-200 uppercase block leading-none">{rule.supplierAccount || rule.supplier}</span>
                                <span className="text-[8.5px] text-zinc-400 font-bold uppercase tracking-widest block">{rule.actionType || 'Force Route'}</span>
                              </>
                            ) : (
                              <span className="text-[11px] italic text-zinc-400 font-bold block">Dynamic Least Cost (LCR) decision</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-left">
                          <div className="space-y-1 font-mono text-[9px] font-bold text-zinc-500">
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Min DLR: {rule.dlrThreshold ?? 70}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>Min ASR: {rule.asrThreshold ?? 15}%</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>Speed Limit: {rule.limitTps ?? 100} TPS</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-1.5">
                            <span className={cn("w-1.5 h-1.5 rounded-full", rule.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-zinc-400")} />
                            <span className="text-[9.5px] font-black uppercase tracking-widest text-zinc-650 dark:text-zinc-400">{rule.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button 
                              onClick={() => {
                                setSuccessMsg(`Checking route live parameters for: ${rule.name}. QoS verified.`);
                                setShowSuccess(true);
                                setTimeout(() => setShowSuccess(false), 4000);
                              }}
                              className="p-2.5 bg-zinc-50 hover:bg-[#428bca]/5 dark:bg-zinc-800 text-zinc-500 hover:text-[#428bca] rounded-xl transition-all"
                              title="Test Parameters"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => toggleRuleStatus(rule.id)}
                              className={cn(
                                "p-2.5 rounded-xl transition-all font-mono font-black text-[9px] flex items-center gap-1",
                                rule.status === 'Active' 
                                  ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/20" 
                                  : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 dark:bg-zinc-800"
                              )}
                              title={rule.status === 'Active' ? 'Deactivate' : 'Activate'}
                            >
                              {rule.status === 'Active' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              <span>{rule.status === 'Active' ? 'ACTIVE' : 'MUTED'}</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteRule(rule.id)}
                              className="p-2.5 bg-zinc-50 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-xl transition-all"
                              title="Delete Rule"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {productRules.length === 0 && (
                <div className="p-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto opacity-50">
                    <Settings2 className="w-8 h-8 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-zinc-400 uppercase tracking-widest italic">Awaiting Logic Definitions</p>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">No active parameter rules detected for this product engine.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-[#428bca]/5 border border-[#428bca]/20 rounded-[2.5rem] space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-[#428bca]" />
                <h4 className="text-xs font-black uppercase tracking-widest text-[#428bca]">Smart Rule Insights</h4>
              </div>
              <p className="text-[11px] font-bold text-zinc-500 italic leading-relaxed">
                Rules are executed sequentially based on priority. The first matching rule will determine the terminal routing logic and billing markup of SMS traffic.
                <span className="text-[#428bca] font-black ml-2 uppercase not-italic">Tip: Use higher priority for premium/direct routes to skip general LCR calculations.</span>
              </p>
            </div>
          </div>
        );
      default:
        return null;

    }
  };

  const formContent = (
    <motion.div 
      initial={standalone ? { opacity: 0, scale: 0.98, y: 30 } : {}}
      animate={standalone ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] overflow-hidden w-full flex flex-col font-sans shadow-[0_50px_150px_-30px_rgba(0,0,0,0.7)] border-t-[8px] border-t-[#428bca]",
        standalone ? "max-w-[98vw] h-[95vh]" : "h-full w-full"
      )}
    >
        {/* Futuristic Header Section */}
        <div className="px-8 py-5 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-6 text-left">
            <div className="relative group">
              <div className="absolute -inset-2 bg-blue-500/20 rounded-2xl blur-lg group-hover:bg-blue-500/40 transition-all duration-700" />
              <div className="relative w-14 h-14 bg-[#428bca] rounded-xl flex items-center justify-center shadow-[0_10px_30px_-10px_rgba(66,139,202,0.6)] transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <Zap className="w-7 h-7 fill-white text-white" />
              </div>
            </div>
            <div className="space-y-1 text-left">
              <h3 className="text-xl font-black uppercase tracking-[0.4em] text-zinc-900 dark:text-zinc-100">
                {isViewOnly ? 'Product Visualizer' : (isCreated ? 'Rule Matrix Manager' : 'Product Blueprint Engine')}
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase rounded-full border border-emerald-100 dark:border-emerald-800">
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  {isCreated ? 'Product Active' : 'Drafting Environment'}
                </div>
                <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.1em]">Revision 2.45 • Smart Lifecycle Enabled</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            {/* Status Grid */}
            <div className="hidden lg:flex gap-8 text-right">
              <div className="space-y-0.5">
                <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Active Routes</div>
                <div className="text-[11px] font-mono font-black text-[#428bca]">581 / 600</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Global Latency</div>
                <div className="text-[11px] font-mono font-black text-[#428bca]">42ms</div>
              </div>
            </div>
            
            {onClose && (
              <button onClick={onClose} className="text-zinc-400 hover:text-red-500 hover:rotate-90 transition-all duration-700 p-3 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-2xl group">
                <X className="w-8 h-8 group-active:scale-75" />
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 px-10 pt-6 border-b border-zinc-100 dark:border-zinc-800 bg-[#fcfcfc] dark:bg-zinc-900/50 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'BASIC') setCurrentStep(1);
                else if (tab === 'RULES') setCurrentStep(3);
                else setCurrentStep(2);
              }}
              className={cn(
                "px-8 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-t-2xl border-t border-x",
                activeTab === tab
                  ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 border-b-transparent dark:border-b-transparent text-[#428bca] shadow-[0_-5px_20px_rgba(0,0,0,0.02)] z-10"
                  : "bg-zinc-50 dark:bg-zinc-800 border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              )}
              style={{ marginBottom: activeTab === tab ? '-1px' : '0' }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-10 bg-white dark:bg-zinc-900 scroll-smooth relative">
          {renderTabContent()}

          {/* Success Notification Popup */}
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-10 right-10 z-[200] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-[0_15px_40px_rgba(16,185,129,0.3)] flex items-center gap-4 border border-emerald-400"
            >
              <div className="p-2 bg-white/20 rounded-xl">
                 <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-black uppercase tracking-widest text-emerald-50">Operation Successful</span>
                 <span className="text-[13px] font-bold">{successMsg}</span>
              </div>
              <button onClick={() => setShowSuccess(false)} className="ml-4 hover:rotate-90 transition-transform">
                 <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
        {/* Industrial Action Footer */}
        <div className="px-10 py-6 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center backdrop-blur-2xl shrink-0">
          <button onClick={() => setActiveTab('RULES')} className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition-all bg-emerald-600 rounded-2xl active:scale-95 shadow-sm flex items-center gap-2">
            {isViewOnly ? 'CLOSE PREVIEW' : (
              <>
                RULES
                <span className="bg-white text-emerald-600 px-1.5 py-0.5 rounded-full text-[8px] font-black">{productRules.length}</span>
              </>
            )}
          </button>
          
          <div className="flex gap-6 items-center">
             <div className="text-right hidden sm:block">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-0.5">Configuration Integrity</div>
                <div className="text-[9px] font-black text-[#428bca] uppercase italic tracking-widest">{isViewOnly ? 'Read-Only Mode' : 'Awaiting Rules Execution'}</div>
             </div>
             
             <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800" />
             
             {!isViewOnly && (
               <button className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all active:scale-95">
                 STAGE CHANGES
               </button>
             )}
             
             <button 
               onClick={handleAddRule} 
               disabled={!isEdit && !productName && !isViewOnly}
               className={cn(
                  "group relative px-12 py-3 text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-3",
                  (!isEdit && !productName && !isViewOnly) 
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-50" 
                    : "bg-[#428bca] text-white"
               )}
             >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                {isViewOnly ? <Check className="w-5 h-5 relative" /> : (isCreated ? <Plus className="w-5 h-5 relative" /> : <Zap className="w-5 h-5 relative" />)}
                <span className="relative">{isViewOnly ? 'CONFIRM & EXIT' : (isCreated || isEdit ? 'ADD LOGIC RULE' : 'CREATE SMS PRODUCT')}</span>
             </button>
          </div>
        </div>

        {/* INTEGRATED: Supplier/Account Detail Popup Overlay */}
        {showSupplierPopup && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-6">
             <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-4xl overflow-hidden"
             >
                <div className="px-10 py-6 bg-zinc-900 text-white flex justify-between items-center border-b border-white/5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#428bca] rounded-2xl flex items-center justify-center shadow-lg">
                         <Landmark className="w-6 h-6 text-white" />
                      </div>
                      <div>
                         <h4 className="text-[15px] font-black uppercase tracking-widest">{showSupplierPopup.name} Account Profile</h4>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Global Routing Node: {showSupplierPopup.account}</p>
                      </div>
                   </div>
                   <button onClick={() => setShowSupplierPopup(null)} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
                      <X className="w-6 h-6" />
                   </button>
                </div>

                <div className="p-10 grid grid-cols-3 gap-8 overflow-y-auto max-h-[60vh] custom-scrollbar text-left font-sans">
                   <div className="col-span-2 space-y-8">
                      <div className="grid grid-cols-2 gap-6 text-left">
                         {[
                           { label: 'Connection Status', value: 'Active / Bound' },
                           { label: 'Quality Score', value: '98.5%' },
                           { label: 'Avg Latency', value: '1.2s' },
                           { label: 'Success Rate', value: '99.2%' }
                         ].map(stat => (
                           <div key={stat.label} className="p-5 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-left flex flex-col">
                              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
                              <p className="text-[13px] font-black text-zinc-800 dark:text-zinc-100 tracking-tight">{stat.value}</p>
                           </div>
                         ))}
                      </div>
                      
                      <div className="space-y-4 text-left">
                         <div className="flex items-center justify-between">
                           <h5 className="text-[12px] font-black uppercase tracking-widest text-[#428bca] font-mono">Live Rates Topology</h5>
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[9px] font-black uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Real-time Feed
                           </div>
                         </div>
                         <div className="border border-zinc-100 dark:border-zinc-800 rounded-[2rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                               <thead className="bg-zinc-50 dark:bg-zinc-950">
                                  <tr>
                                     <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic">Country</th>
                                     <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic">MCCMNC</th>
                                     <th className="px-6 py-4 text-[9px] font-black uppercase text-zinc-400 italic">Rate</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                                  {[
                                    { c: 'United States', m: '310120', r: '0.00425' },
                                    { c: 'United Kingdom', m: '23401', r: '0.01550' },
                                    { c: 'India', m: '40401', r: '0.00115' },
                                    { c: 'United Arab Emirates', m: '42402', r: '0.04500' }
                                  ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-[#428bca]/5 transition-colors">
                                      <td className="px-6 py-4 text-[11px] font-black">{row.c}</td>
                                      <td className="px-6 py-4 text-[11px] font-mono font-bold text-[#428bca]">{row.m}</td>
                                      <td className="px-6 py-4 text-[11px] font-black tabular-nums">${row.r}</td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>
                      </div>
                   </div>

                   <div className="col-span-1 space-y-6 sticky top-0">
                      <div className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 space-y-6 shadow-xl">
                         <div className="flex flex-col gap-1 items-center py-4 border-b border-zinc-200 dark:border-zinc-700 mb-4">
                            <span className="text-[10px] font-black text-[#428bca] uppercase tracking-widest">Global Base Rate</span>
                            <span className="text-4xl font-black tabular-nums text-emerald-500 font-mono tracking-tighter">$0.00425</span>
                         </div>
                         <div className="space-y-4 pt-4">
                            <div className="flex justify-between text-[11px]">
                               <span className="font-bold text-zinc-500 uppercase">Latency</span>
                               <span className="font-black text-emerald-500">28ms</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                               <span className="font-bold text-zinc-500 uppercase">Uptime</span>
                               <span className="font-black text-[#428bca]">99.98%</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                               <span className="font-bold text-zinc-500 uppercase">Category</span>
                               <span className="font-black text-[#428bca]">{selectedCategories[0]}</span>
                            </div>
                         </div>
                         <button 
                           onClick={() => {
                             setPurchasePrice('0.00425');
                             setShowSupplierPopup(null);
                           }}
                           className="w-full py-5 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                         >
                           Apply To This Product
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
        
        {/* Price Popup Overlay */}
        {showPricePopup && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl overflow-hidden"
            >
              <div className="px-8 py-5 bg-[#428bca] text-white flex justify-between items-center">
                <div className="flex flex-col">
                  <h5 className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Landmark className="w-4 h-4" /> Supplier Rate Sheet
                  </h5>
                  <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-1">Account: {showPricePopup}</span>
                </div>
                <button onClick={() => setShowPricePopup(null)} className="text-white hover:rotate-90 transition-all duration-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                         <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Country</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">MCCMNC</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400">Buying Rate</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                         {[
                           { c: 'United States', m: '310120', r: '0.0050' },
                           { c: 'United Kingdom', m: '23401', r: '0.0120' },
                           { c: 'India', m: '40401', r: '0.0018' },
                           { o: 'Global Average', m: '---', r: '0.00425' }
                         ].map((row, idx) => (
                           <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer">
                              <td className="px-6 py-4 text-xs font-bold">{(row as any).c || (row as any).o}</td>
                              <td className="px-6 py-4 text-xs font-mono font-bold text-[#428bca]">{row.m}</td>
                              <td className="px-6 py-4 text-xs font-black tabular-nums">${row.r}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                <div className="mt-8 flex justify-end">
                   <button 
                     onClick={() => {
                       setPurchasePrice('0.00425');
                       setShowPricePopup(null);
                     }}
                     className="px-10 py-4 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                   >
                     Assign Global Average Rate
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    );

    if (!standalone) return formContent;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl" 
          onClick={onClose} 
        />
        {formContent}
      </div>
    );
}

export function SMSWholesaleSwitchForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-amber-50/50 dark:bg-amber-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-amber-600">SMS Switch Config</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Switch Name', placeholder: 'Internal SMS Node' },
            { label: 'Switch Type', type: 'select', options: ['Internal', 'Cloud Hub', 'External Partner'] },
            { label: 'Host / IP', placeholder: '10.0.0.5' },
            { label: 'Port', placeholder: '2775' },
            { label: 'Protocol', type: 'select', options: ['SMPP v3.4', 'SMPP v5.0', 'HTTP/REST', 'SIP'] },
            { label: 'TPS Limit', placeholder: '500' },
            { label: 'Connect Timeout (ms)', placeholder: '3000' },
            { label: 'Status', type: 'select', options: ['Active', 'In Maintenance', 'Disabled'] },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1.5 text-left">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{field.label}</label>
              {field.type === 'select' ? (
                <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold">
                  {field.options?.map(opt => <option key={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="text" placeholder={field.placeholder} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold outline-none" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors font-sans">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-amber-600 transition-all font-sans">Deploy Switch</button>
      </div>
    </div>
  );
}

export function MarginRuleForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full flex flex-col">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-emerald-50/50 dark:bg-emerald-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600">Smart Margin Rules</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
           <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Rule Name</label>
              <input type="text" placeholder="e.g. Asia Standard Margin" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-emerald-500" />
           </div>
           <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase">Applicable On</label>
              <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                 <option>Customer Trunk</option>
                 <option>Global Wholesale</option>
                 <option>Specific MCCMNC</option>
              </select>
           </div>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-lg border border-zinc-100 dark:border-zinc-800 space-y-4">
           <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Pricing Strategy</span>
              <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded">Active</span>
           </div>
           <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase">Calculation Type</label>
                 <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                       <input type="radio" name="calc" defaultChecked /> Fixed Margin Add-on
                    </label>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                       <input type="radio" name="calc" /> Percentage Markup (%)
                    </label>
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-bold text-zinc-400 uppercase">Value</label>
                 <div className="relative">
                    <input type="number" step="0.0001" defaultValue="0.0050" className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none pr-8" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-400 underline">$</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-3">
           <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-emerald-500" /> Auto-Trigger Actions
           </label>
           <div className="space-y-2">
              <label className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded hover:bg-zinc-50 transition-colors cursor-pointer">
                 <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-700">Auto-Update Customer Rates</span>
                    <span className="text-[9px] text-zinc-400">Recalculate rates instantly when vendor prices change</span>
                 </div>
                 <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              </label>
              <label className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded hover:bg-zinc-50 transition-colors cursor-pointer">
                 <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-zinc-700">Email Notification to Customers</span>
                    <span className="text-[9px] text-zinc-400">Send updated rate table file automatically</span>
                 </div>
                 <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              </label>
           </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-emerald-700">Save Rule</button>
      </div>
    </div>
  );
}

export function AddAutoUploadRuleForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-4xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
           <RotateCcw className="w-4 h-4 text-[#428bca]" />
           <h3 className="text-[12px] font-bold text-[#428bca] uppercase tracking-wider">Add Auto Upload Rule</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-8 grid grid-cols-2 gap-x-10 gap-y-8">
        {/* Left Side: Connection & Target */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Rule Identification & Target</h4>
           <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Rule Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="e.g. Alpha Vendor Auto Update" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Vendor</label>
                    <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
                      <option>Alpha System</option>
                      <option>Global Hub</option>
                      <option>TeleOSS</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Vendor Trunk</label>
                    <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
                      <option>All Trunks</option>
                      <option>Alpha_DIR_OUT</option>
                      <option>Alpha_WHS_OUT</option>
                    </select>
                 </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">IMAP Mail Account <span className="text-red-500">*</span></label>
                <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
                  <option>Select IMAP Account...</option>
                  <option>Sales IMAP (Gmail)</option>
                  <option>Support IMAP (Outlook)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">File Template <span className="text-red-500">*</span></label>
                <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
                  <option>Select Template...</option>
                  <option>XLSX General Template</option>
                  <option>CSV Standard Format</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Target Rate Table <span className="text-red-500">*</span></label>
                <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]">
                  <option>Select Rate Table...</option>
                  <option>Standard Vendor Pricing</option>
                </select>
              </div>
           </div>
        </div>

        {/* Right Side: Filters & Controls */}
        <div className="space-y-6">
           <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Filter & Processing Logic</h4>
           <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Sender Email Filter</label>
                <input type="text" placeholder="e.g. rates@alphasytem.com" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Subject Contains</label>
                <input type="text" placeholder="e.g. Rate Sheet, Pricing Update" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
              </div>
               <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Attachment Filter (Regex)</label>
                <input type="text" placeholder="e.g. .*rate.*\.xlsx" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
              </div>
              
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 space-y-3">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-[#428bca]" />
                    <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Auto-Apply rates after upload</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-[#428bca]" />
                    <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Notify Admin on successful processing</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-rose-500" defaultChecked />
                    <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Notify Admin on failure</span>
                 </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Global Margin Override (%)</label>
                <input type="number" step="0.1" placeholder="e.g. 5.0" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]" />
              </div>
           </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans">Activate Rule</button>
      </div>
    </div>
  );
}
