import React from 'react';
import { cn } from '../lib/utils';
import { Save, X, Info, AlertCircle, Upload, Download, Mail, FileText, CheckCircle2, RotateCcw } from 'lucide-react';

interface FormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function AddTransactionForm({ onClose, theme, isEdit, data }: FormProps & { isEdit?: boolean, data?: any }) {
  const [entType, setEntType] = React.useState<'Customer' | 'Vendor'>(data?.['Enterprise Type'] === 'Vendor' ? 'Vendor' : 'Customer');
  const [enterprise, setEnterprise] = React.useState(data?.['Enterprise Name'] || '');
  const [baseAmount, setBaseAmount] = React.useState(data?.['Amount']?.toString() || '');
  const [bankFees, setBankFees] = React.useState('0.00');
  const [totalNet, setTotalNet] = React.useState(0);

  const [invoiceNo, setInvoiceNo] = React.useState(data?.['Invoice Number'] || '');
  const [currency, setCurrency] = React.useState(data?.['Currency'] || 'USD');
  const [payStatus, setPayStatus] = React.useState<'Full' | 'Partial' | 'Unpaid'>(data?.['Payment Status'] || 'Full');

  const [mockDetails, setMockDetails] = React.useState<{label1: string, val1: string, label2: string, val2: string, label3: string, val3: string} | null>(null);

  React.useEffect(() => {
    if (enterprise) {
      if (entType === 'Customer') {
        setMockDetails({
          label1: 'Credit Limit', val1: (Math.random() * 50000 + 10000).toFixed(2),
          label2: 'Current Debt', val2: (Math.random() * 5000).toFixed(2),
          label3: 'Monthly Usage', val3: (Math.random() * 12000).toFixed(2)
        });
      } else {
        setMockDetails({
          label1: 'Total Payable', val1: (Math.random() * 8000).toFixed(2),
          label2: 'Pending Invoices', val2: Math.floor(Math.random() * 10).toString(),
          label3: 'Avg Settlement', val3: '7.5 Days'
        });
      }
    } else {
      setMockDetails(null);
    }
  }, [enterprise, entType]);

  const customerList = ['ABC Corp (38)', 'XYZ Telecom (102)', 'Global SMS (55)'];
  const vendorList = ['TeleOSS Vendor (1)', 'Direct Routes Ltd (20)', 'Carrier Prime (99)'];
  const currentList = entType === 'Customer' ? customerList : vendorList;

  React.useEffect(() => {
    const amt = parseFloat(baseAmount) || 0;
    const fees = parseFloat(bankFees) || 0;
    setTotalNet(amt - fees);
  }, [baseAmount, bankFees]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 lg:max-w-4xl w-full mx-auto">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{isEdit ? 'Edit' : 'Add'} Transaction</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
        {mockDetails && (
          <div className="flex gap-4 p-5 bg-[#428bca]/5 border border-[#428bca]/20 rounded-2xl animate-in fade-in slide-in-from-top-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Info className="w-12 h-12 text-[#428bca]" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-1.5 tracking-wider">{mockDetails.label1}</p>
              <p className="text-xl font-black text-[#428bca] tracking-tight">${mockDetails.val1}</p>
            </div>
            <div className="flex-1 border-x border-[#428bca]/10 px-6">
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-1.5 tracking-wider">{mockDetails.label2}</p>
              <p className="text-xl font-black text-zinc-700 dark:text-zinc-300 tracking-tight">
                {entType === 'Vendor' ? mockDetails.val2 : `$${mockDetails.val2}`}
              </p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] font-black uppercase text-zinc-400 mb-1.5 tracking-wider">{mockDetails.label3}</p>
              <p className="text-xl font-black text-emerald-500 tracking-tight">
                {entType === 'Vendor' ? mockDetails.val3 : `$${mockDetails.val3}`}
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Enterprise Type <span className="text-red-500">*</span></label>
            <div className="flex gap-4 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <label className="flex items-center gap-2 cursor-pointer text-[12px] font-bold">
                <input 
                  type="radio" 
                  name="ent_type" 
                  className="w-4 h-4 text-[#428bca]" 
                  checked={entType === 'Customer'} 
                  onChange={() => { if(!isEdit) { setEntType('Customer'); setEnterprise(''); } }}
                  disabled={isEdit}
                />
                <span className={cn(entType === 'Customer' ? "text-[#428bca]" : "text-zinc-500")}>Customer</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-[12px] font-bold">
                <input 
                  type="radio" 
                  name="ent_type" 
                  className="w-4 h-4 text-[#428bca]" 
                  checked={entType === 'Vendor'} 
                  onChange={() => { if(!isEdit) { setEntType('Vendor'); setEnterprise(''); } }}
                  disabled={isEdit}
                />
                <span className={cn(entType === 'Vendor' ? "text-[#428bca]" : "text-zinc-500")}>Vendor</span>
              </label>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Enterprise Name <span className="text-red-500">*</span></label>
            <select 
              value={enterprise}
              onChange={(e) => setEnterprise(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
              disabled={isEdit}
            >
              <option value="">Select {entType}</option>
              {currentList.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
              {isEdit && !currentList.includes(enterprise) && <option value={enterprise}>{enterprise}</option>}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider flex items-center gap-1.5">
               Mode of Payment <span className="text-red-500">*</span>
            </label>
            <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20">
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Online Payment</option>
              <option>Wire Transfer</option>
              <option>Credit Card</option>
              <option>Cheque</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Payment Status <span className="text-red-500">*</span></label>
            <select 
              value={payStatus}
              onChange={(e) => setPayStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
            >
               <option value="Full">Full Paid</option>
               <option value="Partial">Partial Paid</option>
               <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#428bca] tracking-wider font-extrabold underline">Invoice Number <span className="text-red-500">*</span></label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="e.g. INV-2024-001" 
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-[#428bca]/40 dark:border-[#428bca]/20 rounded-md text-[12px] font-black outline-none focus:ring-2 focus:ring-[#428bca]/20" 
              />
              <p className="text-[9px] text-[#428bca] mt-1 italic font-bold">Compulsory for all payments including CASH</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Currency</label>
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none"
            >
               <option>USD</option>
               <option>EUR</option>
               <option>GBP</option>
               <option>INR</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Amount Paid <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400 uppercase">{currency}</span>
              <input 
                type="number" 
                placeholder="0.00" 
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                className="w-full pl-12 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-black outline-none focus:border-[#428bca]" 
              />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Description / Wholesale Remarks</label>
            <textarea className="w-full h-20 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] outline-none resize-none" placeholder="Enter transaction details (e.g. Invoice matching, volume period)..."></textarea>
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
             <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono flex items-center gap-2">
               Evidence / Proof Attachment 
               <Info className="w-3 h-3 text-blue-500" />
             </label>
             <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center group hover:border-[#428bca] transition-all cursor-pointer bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-zinc-300 group-hover:text-[#428bca] transition-colors" />
                  <span className="text-[10px] font-bold text-zinc-400 group-hover:text-[#428bca]">Drop bank confirmation or click to upload PDF/Image</span>
                </div>
             </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button 
          onClick={() => {
            alert(isEdit ? 'Transaction updated successfully!' : 'Transaction submitted successfully!');
            onClose();
          }}
          disabled={!enterprise || !baseAmount || !invoiceNo}
          className={cn(
            "px-10 py-2 text-white text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg transition-all flex items-center gap-2",
            (!enterprise || !baseAmount || !invoiceNo) ? "bg-zinc-400 cursor-not-allowed" : "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/20"
          )}
        >
          <Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Submit'} Transaction
        </button>
      </div>
    </div>
  );
}

export function AddCurrencyForm({ onClose, theme, isEdit, data }: FormProps & { isEdit?: boolean, data?: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-top-4 duration-300">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-[#428bca]/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{isEdit ? 'Edit' : 'Add'} Currency</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Currency Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. US Dollar" defaultValue={data?.['Currency Name'] || ''} className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">ISO Code <span className="text-red-500">*</span></label>
            <input type="text" placeholder="USD" defaultValue={data?.['ISO Code'] || ''} className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Currency Symbol</label>
            <input type="text" placeholder="$" defaultValue={data?.['Symbol'] || ''} className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Status</label>
            <select defaultValue={data?.['Status'] || 'Active'} className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button onClick={onClose} className="px-10 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded shadow-md hover:bg-blue-600 transition-all">{isEdit ? 'Update' : 'Submit'}</button>
      </div>
    </div>
  );
}

export function GenerateInvoiceRequestForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in duration-300">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca]/5">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Generate Invoice Request</h3>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Enterprise <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none">
              <option>Select Enterprise</option>
              <option>ABC (38)</option>
              <option>TeleOSS (109)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Frequency</label>
            <select className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Custom</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">From Date <span className="text-red-500">*</span></label>
            <input type="date" className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">To Date <span className="text-red-500">*</span></label>
            <input type="date" className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider text-zinc-400">Timezone</label>
            <select className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none">
              <option>(GMT) UTC</option>
              <option>(GMT+05:30) Mumbai, Kolkata</option>
            </select>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button className="px-10 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded shadow-md hover:bg-blue-600 transition-all flex items-center gap-2">
           Generate
        </button>
      </div>
    </div>
  );
}

export function AddCurrencyExchangeForm({ onClose, theme, isEdit, data }: FormProps & { isEdit?: boolean, data?: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{isEdit ? 'Edit' : 'Add'} Currency Exchange</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Source Currency <span className="text-red-500">*</span></label>
            <select defaultValue={data?.['Source Currency'] || 'USD - US Dollar'} className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold">
               <option>USD - US Dollar</option>
               <option>EUR - Euro</option>
               <option>GBP - British Pound</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Target Currency <span className="text-red-500">*</span></label>
            <select defaultValue={data?.['Target Currency'] || 'INR - Indian Rupee'} className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold">
               <option>INR - Indian Rupee</option>
               <option>EUR - Euro</option>
               <option>AED - UAE Dirham</option>
            </select>
          </div>
        </div>

        <div className="p-6 bg-blue-50/30 dark:bg-blue-500/5 rounded-3xl border border-blue-100/50 dark:border-blue-900/20 space-y-4">
           <div className="flex items-center justify-between border-b border-blue-100/50 dark:border-blue-900/20 pb-3">
              <h4 className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Rate Configuration</h4>
              <div className="flex bg-blue-100/50 dark:bg-blue-950/30 p-1 rounded-lg">
                 <button className="px-3 py-1 text-[9px] font-black uppercase rounded bg-white dark:bg-blue-500 text-blue-600 dark:text-white shadow-sm">Manual</button>
                 <button className="px-3 py-1 text-[9px] font-black uppercase text-blue-500/50">Auto-Update</button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Bank Rate (Base)</label>
                 <div className="relative">
                    <input type="number" step="0.0001" defaultValue={data?.['Rate'] || "82.4501"} className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-black text-blue-600 font-mono outline-none" />
                    <span className="absolute right-3 top-2.5 text-[9px] font-bold text-zinc-400">1 USD =</span>
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Exchange Spread (%)</label>
                 <input type="number" step="0.01" defaultValue="1.50" className="w-full px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-black text-amber-500 font-mono outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2 p-4 bg-zinc-900 dark:bg-black rounded-2xl border border-zinc-800 flex items-center justify-between">
                 <div>
                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Final Customer Sell Rate</p>
                    <p className="text-lg font-black text-emerald-500 font-mono">83.6868 <span className="text-[10px] text-zinc-600 font-bold ml-1">INR / USD</span></p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Rounding</p>
                    <select className="bg-transparent text-[10px] font-black text-zinc-400 outline-none border-none cursor-pointer">
                       <option>4 Decimal Points</option>
                       <option>2 Decimal Points</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Effective From</label>
            <input type="datetime-local" className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest font-mono">Sync Interval</label>
            <select className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none font-bold">
               <option>Sync Every 1 Hour</option>
               <option>Daily at 00:00</option>
               <option>Manual Only</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-100/50 dark:border-amber-900/30">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
            Changing exchange rates will immediately impact <span className="font-black">Active Route Profits</span> and <span className="font-black">Customer Balances</span>. Previous transactions will remain unchanged.
          </p>
        </div>
      </div>

      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors font-sans">Discard</button>
        <button onClick={onClose} className="px-10 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 font-sans">{isEdit ? 'Update Rate' : 'Activate Rate'}</button>
      </div>
    </div>
  );
}

export function AddBillingCycleForm({ onClose, theme, isEdit, data }: FormProps & { isEdit?: boolean, data?: any }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{isEdit ? 'Edit' : 'Add'} Billing Cycle</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Name <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. Monthly" defaultValue={data?.['Cycle Name'] || ''} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Usage Days <span className="text-red-500">*</span></label>
            <input type="number" placeholder="30" defaultValue={data?.['Usage Days'] || '30'} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Due Days <span className="text-red-500">*</span></label>
            <input type="number" placeholder="15" defaultValue={data?.['Due Days'] || '15'} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Billing Type</label>
            <select defaultValue={data?.['Type'] || 'Prepaid'} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9">
              <option>Prepaid</option>
              <option>Postpaid</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px) font-black uppercase text-zinc-400 tracking-wider">Week Day</label>
            <select defaultValue={data?.['Week Day'] || 'Monday'} className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9">
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
              <option>Saturday</option>
              <option>Sunday</option>
            </select>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button onClick={onClose} className="px-10 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2">
          <Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

const vendorsList = ['TeleOSS Carrier', 'Airtel Carrier', 'Global Voice LLC', 'Tata Communications', 'Orange Carrier'];

const accountsMapByVendor: Record<string, { id: string, name: string }[]> = {
  'TeleOSS Carrier': [
    { id: 'VAC-1092-TOS-01', name: 'Premium Interconnect' },
    { id: 'VAC-1092-TOS-02', name: 'Wholesale Inbound' },
    { id: 'VAC-1092-TOS-03', name: 'Standard Backup' }
  ],
  'Airtel Carrier': [
    { id: 'VAC-4402-ART-01', name: 'Direct ASIA Interconnect' },
    { id: 'VAC-4402-ART-02', name: 'Airtel Retail Link' }
  ],
  'Global Voice LLC': [
    { id: 'VAC-9911-GLV-01', name: 'US Ground Delivery' },
    { id: 'VAC-9911-GLV-02', name: 'Global Transit Gateway' }
  ],
  'Tata Communications': [
    { id: 'VAC-3301-TAT-01', name: 'Tata Core Gateway' },
    { id: 'VAC-3301-TAT-02', name: 'Tata Wholesale Link' }
  ],
  'Orange Carrier': [
    { id: 'VAC-1192-ORA-01', name: 'Orange FR HQ Link' },
    { id: 'VAC-1192-ORA-02', name: 'Orange Retail Hub' }
  ]
};

export function AddVendorInvoiceForm({ onClose, theme, isEdit, data }: FormProps & { isEdit?: boolean, data?: any }) {
  const [vendorName, setVendorName] = React.useState(data?.['Enterprise Name'] || '');
  const [vendorAccount, setVendorAccount] = React.useState(data?.['Vendor Account'] || '');
  const [vendorTrunk, setVendorTrunk] = React.useState(data?.['Vendor Trunk'] || 'Trunk 1 (Premium)');
  const [invoiceNo, setInvoiceNo] = React.useState(data?.['Invoice Number'] || `VEN-2026-${Math.floor(Math.random() * 89999) + 10000}`);
  const [invoiceDate, setInvoiceDate] = React.useState(data?.['Invoice Date'] || new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = React.useState(data?.['Invoice From Date'] || '2026-04-01');
  const [endDate, setEndDate] = React.useState(data?.['Invoice To Date'] || '2026-04-30');
  const [frequency, setFrequency] = React.useState('Monthly');
  const [amount, setAmount] = React.useState(data?.['Charge Amount']?.toString() || '34500.00');
  const [tax, setTax] = React.useState(data?.['Tax / VAT Amount']?.toString() || '0.00');
  const [total, setTotal] = React.useState(0);
  const [volume, setVolume] = React.useState(data?.['Charge Volume']?.toString() || '3500000');
  const [currency, setCurrency] = React.useState('USD');
  const [payTerms, setPayTerms] = React.useState('Net 7');
  const [reconStatus, setReconStatus] = React.useState('Not Started');
  const [remarks, setRemarks] = React.useState('');

  const handleVendorChange = (val: string) => {
    setVendorName(val);
    setVendorAccount('');
  };

  React.useEffect(() => {
    setTotal((parseFloat(amount) || 0) + (parseFloat(tax) || 0));
  }, [amount, tax]);

  // Handle dynamic presets when vendorAccount changes
  React.useEffect(() => {
    if (!vendorName || !vendorAccount) return;
    
    let baseVolume = 3500000;
    let baseRate = 0.0055;
    let taxAmount = 0.00;
    
    if (vendorAccount.includes('Premium') || vendorAccount.includes('Core-1') || vendorAccount === 'Premium Interconnect') {
      baseVolume = 4800000;
      baseRate = 0.0078;
      taxAmount = 150.00;
    } else if (vendorAccount.includes('Wholesale') || vendorAccount.includes('WHS') || vendorAccount === 'Wholesale Inbound') {
      baseVolume = 12500000;
      baseRate = 0.0035;
      taxAmount = 350.00;
    } else if (vendorAccount.includes('Direct') || vendorAccount.includes('ASIA') || vendorAccount === 'Direct ASIA Interconnect') {
      baseVolume = 9200000;
      baseRate = 0.0042;
      taxAmount = 250.00;
    } else if (vendorAccount.includes('FR') || vendorAccount.includes('HQ') || vendorAccount === 'Orange FR HQ Link') {
      baseVolume = 6300000;
      baseRate = 0.0068;
      taxAmount = 180.00;
    } else {
      baseVolume = Math.floor(Math.random() * 2000000) + 1500000;
      baseRate = 0.0050;
      taxAmount = 0.00;
    }

    setVolume(baseVolume.toString());
    setAmount((baseVolume * baseRate).toFixed(2));
    setTax(taxAmount.toFixed(2));
  }, [vendorName, vendorAccount]);

  const handleSubmit = () => {
    if (!vendorName || !vendorAccount || !amount) {
      alert('Please fill required fields (Vendor Name, Vendor Account, and Charge Amount)');
      return;
    }

    const activeAccountObj = (accountsMapByVendor[vendorName] || []).find(va => va.name === vendorAccount);
    const resolvedAccountId = activeAccountObj ? activeAccountObj.id : 'N/A';

    alert(
      `============== VENDOR INVOICE ENTRY SUCCESS ==============\n\n` +
      `✔ Vendor Name       : ${vendorName}\n` +
      `✔ Vendor Account    : ${vendorAccount}\n` +
      `✔ Resolved Acct ID  : ${resolvedAccountId}\n` +
      `✔ Trunk Segment     : ${vendorTrunk}\n` +
      `✔ Invoice Number    : ${invoiceNo}\n` +
      `✔ Invoiced Date     : ${invoiceDate}\n` +
      `✔ Invoiced Volume   : ${parseFloat(volume).toLocaleString()} SMS\n` +
      `✔ Base Amount       : $${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `✔ Surcharge Tax     : $${parseFloat(tax).toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `✔ Net Payable Sum   : $${total.toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `✔ Ledger Terms      : ${payTerms}\n` +
      `✔ CDR Recon         : ${reconStatus}\n` +
      `✔ Status Message    : ${remarks ? remarks : '[No Remarks Entered]'}\n\n` +
      `Vendor invoice entry successfully recorded in ledger db!`
    );
    onClose();
  };

  const activeAccountObj = (accountsMapByVendor[vendorName] || []).find(va => va.name === vendorAccount);
  const resolvedAccountId = activeAccountObj ? activeAccountObj.id : 'N/A';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 lg:max-w-4xl w-full mx-auto">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{isEdit ? 'Edit' : 'Add'} Vendor Invoice</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
        {!(vendorName && vendorAccount) ? (
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 font-sans text-center flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/25 flex items-center justify-center text-[#428bca]">
              <Info className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h5 className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">Awaiting Vendor Account Selection</h5>
              <p className="text-xs text-zinc-500 max-w-[460px] mx-auto leading-relaxed">
                Please select a **Vendor** and then choose one of their **Carrier Accounts** to load real-time traffic offsets and base pricing.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-300 slide-in-from-top-2 flex gap-6 items-center">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-left font-mono">
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Resolved Account ID</p>
                <p className="text-xs font-bold text-zinc-850 dark:text-zinc-100">{resolvedAccountId}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Carrier Link</p>
                <p className="text-xs font-bold text-zinc-850 dark:text-zinc-100">{vendorName}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Base SMS Rate</p>
                <p className="text-xs font-black text-[#5cb85c]">${vendorAccount.includes('Premium') || vendorAccount.includes('Core-1') || vendorAccount === 'Premium Interconnect' ? '0.0078' : vendorAccount.includes('Wholesale') || vendorAccount.includes('WHS') || vendorAccount === 'Wholesale Inbound' ? '0.0035' : '0.0050'} / SMS</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Auto Calculated Total</p>
                <p className="text-xs font-black text-[#428bca]">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Vendor Name <span className="text-red-500">*</span></label>
            <select 
              value={vendorName}
              onChange={(e) => handleVendorChange(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select Vendor</option>
              {vendorsList.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-sans">Vendor Account Name <span className="text-red-500">*</span></label>
            <select 
              value={vendorAccount}
              onChange={(e) => setVendorAccount(e.target.value)}
              disabled={!vendorName}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 focus:ring-2 focus:ring-blue-500/20 font-sans disabled:opacity-50 disabled:bg-zinc-100 dark:disabled:bg-zinc-800"
            >
              <option value="">{vendorName ? "Select Vendor Account Name" : "Select Vendor first..."}</option>
              {(accountsMapByVendor[vendorName] || []).map(va => (
                <option key={va.name} value={va.name}>{va.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Vendor Trunk <span className="text-red-500">*</span></label>
            <select 
              value={vendorTrunk}
              onChange={(e) => setVendorTrunk(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9"
            >
              <option>Trunk 1 (Premium)</option>
              <option>Trunk 2 (Wholesale)</option>
              <option>Trunk 3 (Direct Route)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Number <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="e.g. VEN-2024-001" 
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 text-blue-600 font-mono font-bold" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Date <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-mono" 
            />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Start Date <span className="text-red-500">*</span></label>
             <input 
               type="date" 
               value={startDate}
               onChange={(e) => setStartDate(e.target.value)}
               className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-mono" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice End Date <span className="text-red-500">*</span></label>
             <input 
               type="date" 
               value={endDate}
               onChange={(e) => setEndDate(e.target.value)}
               className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-mono" 
             />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Frequency</label>
            <select 
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9"
            >
              <option>Monthly</option>
              <option>Weekly</option>
              <option>Daily</option>
              <option>Bimonthly</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Charge Amount (Base) <span className="text-red-500">*</span></label>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-85 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-mono" 
            />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Tax / VAT Amount</label>
             <input 
               type="number" 
               placeholder="0.00" 
               value={tax}
               onChange={(e) => setTax(e.target.value)}
               className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-85 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-mono" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-[#428bca] tracking-wider font-bold">Total Payable Amount</label>
             <input 
               type="number" 
               value={total.toFixed(2)}
               readOnly
               className="w-full px-3 py-2 bg-[#428bca]/15 border border-[#428bca]/30 rounded-md text-[12px] font-black text-[#428bca] outline-none h-9 font-mono" 
             />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Wholesale Charge Volume (SMS)</label>
             <input 
               type="number" 
               placeholder="0" 
               value={volume}
               onChange={(e) => setVolume(e.target.value)}
               className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-85 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-mono" 
             />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Currency</label>
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 font-semibold"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>INR</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono flex items-center gap-2">
               Payment Terms <span className="text-red-500">*</span>
               <Info className="w-3 h-3 text-blue-500" />
            </label>
            <select 
              value={payTerms}
              onChange={(e) => setPayTerms(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9"
            >
              <option>Net 7</option>
              <option>Net 15</option>
              <option>Net 30</option>
              <option>Immediate / Prepayment</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">CDR Recon Status</label>
            <select 
              value={reconStatus}
              onChange={(e) => setReconStatus(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9 text-purple-600"
            >
              <option>Not Started</option>
              <option>Matched (Auto)</option>
              <option>Matched (Manual)</option>
              <option>Disputed (Volume Mismatch)</option>
              <option>Disputed (Price Mismatch)</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2 lg:col-span-3">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Dispute / Adjusted Remarks</label>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-20 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] outline-none resize-none font-medium" 
              placeholder="Enter any discrepancy details (e.g. System count: 1.2M, Vendor count: 1.25M)..."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-[#d9534f] hover:text-red-700 transition-colors">Cancel</button>
        <button 
          onClick={handleSubmit}
          disabled={!vendorName || !vendorAccount || !amount}
          className={cn(
            "px-10 py-2 text-white text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg transition-all flex items-center gap-2",
            (!vendorName || !vendorAccount || !amount) ? "bg-zinc-400 cursor-not-allowed" : "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/20"
          )}
        >
          <Save className="w-4 h-4" /> {isEdit ? 'Update' : 'Submit'} Invoice
        </button>
      </div>
    </div>
  );
}

export function InvoiceRequestForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Invoice Request</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Enterprise <span className="text-red-500">*</span></label>
            <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9">
              <option>Select Enterprise</option>
              <option>ABC Corp</option>
              <option>TeleOSS</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Date <span className="text-red-500">*</span></label>
            <input type="date" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none h-9" />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button className="px-10 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-md shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2">
          Submit Request
        </button>
      </div>
    </div>
  );
}

export function ActionConfirmationModal({ onClose, title, actionName }: FormProps & { title: string, actionName: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 max-w-md w-full mx-auto">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{title}</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Save className="w-8 h-8 text-[#428bca]" />
        </div>
        <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Are you sure you want to proceed with <span className="text-[#428bca]">{actionName.toLowerCase()}</span>?</p>
        <p className="text-[11px] text-zinc-400">This action will be processed and logged in the system.</p>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-center gap-3">
        <button onClick={onClose} className="px-8 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">No, Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all active:scale-95">Yes, Proceed</button>
      </div>
    </div>
  );
}

function ConfigurationRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-4 py-2 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
      <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[130px] md:text-right md:pt-1.5 shrink-0">
        {label} :
      </label>
      <div className="flex-1 w-full flex items-center">
        {children}
      </div>
    </div>
  );
}

export function AutoSendSOAConfigForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-4xl w-full text-left font-sans">
      <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-bold text-[#428bca]">SOA</span>
          <span className="text-zinc-400">/ Auto Send Config</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-6 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded shadow hover:bg-blue-600 flex items-center gap-2 uppercase transition-all">
            <Save className="w-3 h-3" /> Save
          </button>
          <button onClick={onClose} className="px-6 py-1 bg-[#d9534f] text-white text-[11px] font-bold rounded shadow hover:bg-red-600 transition-all uppercase">
            Cancel
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
        <div className="border border-blue-100 dark:border-blue-900/30 bg-blue-50/20 dark:bg-blue-500/5 rounded p-4 space-y-2">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase text-[#428bca] tracking-widest border-b border-blue-100 dark:border-blue-900/30 pb-1 mb-2">
              <Info className="w-3 h-3" /> Target Customers
           </div>
           <ConfigurationRow label="Config Method">
              <div className="flex gap-4">
                 <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                    <input type="radio" name="method" defaultChecked /> Single Customer
                 </label>
                 <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                    <input type="radio" name="method" /> Bulk Selection
                 </label>
              </div>
           </ConfigurationRow>
           <ConfigurationRow label="Select Customer(s)">
              <div className="flex-1 space-y-2">
                 <select className="w-full h-24 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" multiple defaultValue={["ABC Corp (38)"]}>
                    <option>ABC Corp (38)</option>
                    <option>XYZ Telecom (102)</option>
                    <option>Global SMS (55)</option>
                    <option>Internal Test (09)</option>
                 </select>
                 <p className="text-[9px] font-bold text-zinc-400 italic">Hold Ctrl for multiple selection</p>
              </div>
           </ConfigurationRow>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
           <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">SENDING PARAMETERS</h3>
           </div>
           <div className="p-6 space-y-4">
              <ConfigurationRow label="Enable Auto Send">
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
              </ConfigurationRow>
              <ConfigurationRow label="Frequency">
                 <select className="flex-1 max-w-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" defaultValue="Weekly">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                 </select>
              </ConfigurationRow>
              <ConfigurationRow label="Send On">
                 <select className="flex-1 max-w-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" defaultValue="Monday">
                    <option>Monday</option>
                    <option>1st of Month</option>
                    <option>Last Day of Month</option>
                 </select>
              </ConfigurationRow>
              <ConfigurationRow label="Time of Day">
                 <input type="time" defaultValue="09:00" className="flex-1 max-w-xs px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </ConfigurationRow>
              <ConfigurationRow label="Condition">
                 <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                       <input type="checkbox" defaultChecked /> Only if negative balance
                    </label>
                    <label className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                       <input type="checkbox" /> Include detailed usage file
                    </label>
                 </div>
              </ConfigurationRow>
              <ConfigurationRow label="Recipients">
                 <div className="flex-1 space-y-2">
                    <div className="flex gap-4">
                       <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 cursor-pointer">
                          <input type="checkbox" defaultChecked /> Account Manager
                       </label>
                       <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 cursor-pointer">
                          <input type="checkbox" defaultChecked /> Customer Billing Email
                       </label>
                    </div>
                    <input type="text" placeholder="Additional Emails (Comma separated)" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                 </div>
              </ConfigurationRow>
              <ConfigurationRow label="Email Template">
                 <textarea rows={4} className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500 font-mono" defaultValue={`Dear Customer,\n\nPlease find attached the Statement of Account for your reference.\n\nRegards,\nFinance Team`} />
              </ConfigurationRow>
           </div>
        </div>
      </div>
    </div>
  );
}

export function AddChargesCalculatorForm({ onClose, theme }: FormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-4xl w-full mx-auto">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Charges Calculator</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Enterprise</label>
                  <select className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                     <option>Select Enterprise</option>
                     <option>ABC Corp (38)</option>
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">From Date</label>
                     <input type="date" className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">To Date</label>
                     <input type="date" className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none" />
                  </div>
               </div>
               <button className="w-full py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20">
                  Calculate Now
               </button>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 text-white space-y-6">
               <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest border-b border-zinc-800 pb-2">Calculation Summary</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-zinc-400">Total SMS Usage</span>
                     <span className="text-sm font-black font-mono tracking-tighter">1,245,670</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-zinc-400">Base Revenue</span>
                     <span className="text-sm font-black font-mono tracking-tighter text-emerald-400">$12,456.70</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-zinc-800 pt-4">
                     <span className="text-xs font-medium text-zinc-400">Estimated Fees</span>
                     <span className="text-sm font-black font-mono tracking-tighter text-amber-400">$186.85 (1.5%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-medium text-zinc-400">Tax/VAT</span>
                     <span className="text-sm font-black font-mono tracking-tighter text-blue-400">$622.84 (5%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-800 -mx-6 px-6 py-4 mt-2">
                     <span className="text-sm font-black uppercase tracking-widest text-zinc-400">TOTAL CHARGE</span>
                     <span className="text-2xl font-black font-mono text-emerald-500">$13,266.39</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Close</button>
        <button onClick={onClose} className="px-10 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2">
           Download PDF
        </button>
      </div>
    </div>
  );
}

export function SOAPreviewModal({ onClose, theme, data }: FormProps & { data?: any }) {
   const enterpriseName = data?.['ENTERPRISE NAME'] || data?.['Customer'] || data?.['Enterprise'] || 'ABC Telecom Solutions Ltd';
   const revenue = data?.['REVENUE'] || data?.['Balance'] || '$14,450.00';
   const usage = data?.['TOTAL SMS'] || data?.['Delivered'] || '1,245,670';

   const [sendState, setSendState] = React.useState<'idle' | 'sending' | 'sent'>('idle');

   const handleSend = () => {
      setSendState('sending');
      setTimeout(() => {
         setSendState('sent');
         setTimeout(() => {
            onClose();
         }, 1500);
      }, 2000);
   };

   return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-w-5xl w-full mx-auto">
         <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Statement of Account Preview</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                <Download className="w-3 h-3" /> PDF Export
              </button>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
         </div>
         
         <div className="p-10 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar font-sans text-left">
            <div className="flex justify-between items-start">
               <div className="space-y-4 text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#428bca] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20">T</div>
                    <div className="space-y-1">
                       <h2 className="text-2xl font-black tracking-tight text-zinc-800 dark:text-zinc-100 uppercase text-left">TeleOSS Wholesale</h2>
                       <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest text-left">Connectivity & SMS Solutions</p>
                    </div>
                  </div>
               </div>
               <div className="text-right space-y-2">
                  <div className="inline-block px-4 py-1 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-2">Statement</div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Document Ref</p>
                  <p className="text-lg font-black font-mono text-zinc-800 dark:text-zinc-100 uppercase">SOA/2024/WH/{Math.floor(Math.random() * 9000) + 1000}</p>
                  <p className="text-[10px] font-bold text-[#428bca] uppercase tracking-tighter">Period: 01 May 2024 - {new Date().toLocaleDateString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Client Information</h4>
                  <div className="space-y-1">
                    <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">{enterpriseName}</p>
                    <p className="text-xs font-bold text-zinc-500 uppercase">Account Manager: wholesale_support@teleoss.co</p>
                    <p className="text-[11px] font-medium text-zinc-400">VAT Registration: GB-99283746<br />Currency: USD - US Dollar</p>
                  </div>
               </div>
               <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-700">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-4">Account Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold text-zinc-500 uppercase">Opening Balance</span>
                       <span className="text-sm font-black font-mono">$2,450.00</span>
                    </div>
                    <div className="flex justify-between items-center text-red-500">
                       <span className="text-[10px] font-bold uppercase">Total Traffic Charges</span>
                       <span className="text-sm font-black font-mono">+$8,250.00</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-500">
                       <span className="text-[10px] font-bold uppercase">Payments Received</span>
                       <span className="text-sm font-black font-mono">-$5,000.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-zinc-200 dark:border-zinc-700">
                       <span className="text-[11px] font-black text-zinc-800 dark:text-zinc-100 uppercase">Closing Balance</span>
                       <span className="text-xl font-black font-mono text-[#428bca]">{revenue}</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#428bca]"></span>
                     <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Transaction Audit Trail</h4>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Showing last 2 activities</div>
               </div>
               <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                       <tr>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider">Date</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider">Reference No.</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider text-center">Activity Type</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider text-right">Debit (Charge)</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider text-right">Credit (Payment)</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase text-[#428bca] tracking-wider text-right">Running Balance</th>
                       </tr>
                    </thead>
                    <tbody className="text-[11px] divide-y divide-zinc-50 dark:divide-zinc-800/50">
                       <tr className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-zinc-500 uppercase">01 May 2024</td>
                          <td className="px-6 py-4 font-black font-mono text-zinc-800 dark:text-zinc-200">INV/WH/{usage.toString().slice(0, 5)}</td>
                          <td className="px-6 py-4 text-center"><span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded text-[9px] font-black uppercase">Traffic Usage</span></td>
                          <td className="px-6 py-4 text-right font-black text-rose-500">$8,250.00</td>
                          <td className="px-6 py-4 text-right font-bold text-zinc-300">-</td>
                          <td className="px-6 py-4 text-right font-black text-zinc-800 dark:text-white">$10,700.00</td>
                       </tr>
                       <tr className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-zinc-500 uppercase">05 May 2024</td>
                          <td className="px-6 py-4 font-black font-mono text-zinc-800 dark:text-zinc-200">TR/PAY/88273645</td>
                          <td className="px-6 py-4 text-center"><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[9px] font-black uppercase">Bank Receipt</span></td>
                          <td className="px-6 py-4 text-right font-bold text-zinc-300">-</td>
                          <td className="px-6 py-4 text-right font-black text-emerald-500">$5,000.00</td>
                          <td className="px-6 py-4 text-right font-black text-zinc-800 dark:text-white">{revenue}</td>
                       </tr>
                    </tbody>
                 </table>
               </div>
            </div>

            {/* ACCOUNT-WISE SHARED CREDIT CONSUMPTION BREAKDOWN */}
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#428bca]"></span>
                     <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-[#428bca] text-left">Sub-account Shared Credit Balances</h4>
                  </div>
                  <span className="text-[9px] font-black uppercase text-[#428bca] bg-blue-50/55 dark:bg-blue-950/20 px-3 py-1 rounded-lg border border-blue-100 dark:border-blue-900/30 font-mono">Master Customer Shared Credit: $10,000.00</span>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-zinc-100 dark:border-zinc-800/60 rounded-xl p-4 bg-zinc-50/10 hover:border-blue-200 transition-all text-left">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase">DIR_IN_01 (Retail SMS Account)</p>
                           <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">SMPP Gateway</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-black uppercase">Active</span>
                     </div>
                     <div className="flex justify-between items-center mt-3 text-xs border-t border-dashed border-zinc-100 dark:border-zinc-800/60 pt-2 font-sans">
                        <span className="text-zinc-400 font-bold">Credit Limit Basis:</span>
                        <span className="font-bold text-zinc-600 dark:text-zinc-300 font-mono">Shared Customer limit</span>
                     </div>
                     <div className="flex justify-between items-center mt-1 text-xs font-sans">
                        <span className="text-zinc-400 font-bold">Credit Limit Consumed:</span>
                        <span className="font-black text-rose-500 font-mono">$3,200.00</span>
                     </div>
                  </div>

                  <div className="border border-zinc-100 dark:border-zinc-800/60 rounded-xl p-4 bg-zinc-50/10 hover:border-blue-200 transition-all text-left">
                     <div className="flex justify-between items-start">
                        <div>
                           <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase">DIR_IN_02 (OTP Alert Gateway)</p>
                           <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">HTTP REST Client</p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-black uppercase">Active</span>
                     </div>
                     <div className="flex justify-between items-center mt-3 text-xs border-t border-dashed border-zinc-100 dark:border-zinc-800/60 pt-2 font-sans">
                        <span className="text-zinc-400 font-bold">Credit Limit Basis:</span>
                        <span className="font-bold text-zinc-600 dark:text-zinc-300 font-mono">Shared Customer limit</span>
                     </div>
                     <div className="flex justify-between items-center mt-1 text-xs font-sans">
                        <span className="text-zinc-400 font-bold">Credit Limit Consumed:</span>
                        <span className="font-black text-rose-500 font-mono">$1,800.00</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-amber-600 tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" /> Important Wholesale Terms
                </div>
                <p className="text-[10px] font-medium text-amber-800/70 leading-relaxed italic">
                  Wholesale payments are subject to <span className="font-bold underline">Net-7 terms</span>. Any discrepancies in volume must be reported as a "Dispute" within 48 hours of SOA generation. Reconciliation with TeleOSS CDRs is required for all billing disputes exceeding 0.5% tolerance.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-[#428bca]/5 border border-[#428bca]/10">
                 <div className="flex justify-between items-end h-full">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Authorized Signatory</p>
                       <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 italic font-mono">/David Miller/</p>
                       <p className="text-[8px] font-bold text-zinc-400 uppercase">Head of Wholesale Finance</p>
                    </div>
                    <div className="text-right">
                       <CheckCircle2 className="w-8 h-8 text-blue-500 opacity-20" />
                    </div>
                 </div>
              </div>
            </div>
         </div>

         <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-left">
            <div className="flex items-center gap-2 text-amber-600">
               <AlertCircle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest italic">Electronic Statement - No Signature Required</span>
            </div>
            <div className="flex gap-3">
               <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Close Preview</button>
               <button 
                  onClick={handleSend} 
                  disabled={sendState !== 'idle'}
                  className={cn(
                    "px-10 py-2 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 font-black min-w-[200px] justify-center",
                    sendState === 'idle' ? "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/20" : 
                    sendState === 'sending' ? "bg-zinc-500 cursor-wait" : "bg-emerald-500"
                  )}
               >
                  {sendState === 'idle' && <><Mail className="w-4 h-4" /> Send SOA Now</>}
                  {sendState === 'sending' && <><RotateCcw className="w-4 h-4 animate-spin" /> Dispatching...</>}
                  {sendState === 'sent' && <><CheckCircle2 className="w-4 h-4" /> Sent Successfully</>}
               </button>
            </div>
         </div>
      </div>
   );
}

export function InvoicePreviewModal({ onClose, theme, data }: FormProps & { data?: any }) {
   const enterpriseName = data?.['ENTERPRISE NAME'] || data?.['Customer'] || data?.['Enterprise'] || 'ABC Telecom Solutions Ltd';
   const revenue = data?.['REVENUE'] || data?.['Amount'] || '$17,061.45';
   const usage = data?.['TOTAL SMS'] || data?.['Delivered'] || '1,894,000';
   const invoiceNo = data?.['Invoice No'] || data?.['ID'] || 'INV/WHOLE/2024-81';

   const [sendState, setSendState] = React.useState<'idle' | 'sending' | 'sent'>('idle');

   const handleSend = () => {
      setSendState('sending');
      setTimeout(() => {
         setSendState('sent');
         setTimeout(() => {
            onClose();
         }, 1500);
      }, 2000);
   };

   return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-400 max-w-5xl w-full mx-auto text-left">
         <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center text-left">
            <div className="flex items-center gap-2">
               <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Invoice Document</h3>
               <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full">Draft Preview</span>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
               <X className="w-5 h-5" />
            </button>
         </div>
         
         <div className="p-12 space-y-12 max-h-[80vh] overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900 font-sans text-left">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center text-emerald-500 shadow-2xl">
                     <Zap className="w-8 h-8 fill-emerald-500" />
                  </div>
                  <div className="text-left font-black">
                     <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 leading-none text-left">TELEOSS GATEWAY</h2>
                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mt-1 ml-0.5 text-left">Enterprise Connectivity</p>
                  </div>
               </div>
               <div className="text-right">
                  <h1 className="text-5xl font-black text-zinc-100 dark:text-zinc-800/50 uppercase tracking-tighter absolute right-12 top-24 pointer-events-none text-right">INVOICE</h1>
                  <div className="space-y-1 relative z-10 text-right">
                     <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest text-right">Tax Invoice No</p>
                     <p className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-right">{invoiceNo}</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-12 text-left">
               <div className="space-y-4 text-left">
                  <div className="space-y-1 border-l-4 border-[#428bca] pl-4 text-left">
                     <p className="text-[10px] font-black uppercase text-[#428bca] tracking-widest text-left">Billed To</p>
                     <p className="text-lg font-black text-zinc-800 dark:text-zinc-100 text-left">{enterpriseName}</p>
                     <p className="text-[11px] font-bold text-zinc-500 leading-relaxed uppercase text-left">
                        {enterpriseName}'s Official Address,<br />
                        Business District, Unit 09F<br />
                        VAT: {Math.random().toString(36).substring(7).toUpperCase()}
                     </p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-700 text-left">
                  <div className="space-y-1 text-left">
                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest text-left">Issue Date</p>
                     <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 text-left">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 text-left">
                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest text-left">Due Date</p>
                     <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 text-left">{new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1 text-left">
                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest text-left">Currency</p>
                     <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 text-left">USD - US Dollar</p>
                  </div>
                  <div className="space-y-1 text-left">
                     <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest text-left">Billing Cycle</p>
                     <p className="text-xs font-black text-emerald-500 uppercase text-left">{data?.['Billing Cycle'] || 'Postpaid'}</p>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b-2 border-zinc-900 dark:border-zinc-100 text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                        <th className="py-4 text-left">Description</th>
                        <th className="py-4 text-center">Volume (SMS)</th>
                        <th className="py-4 text-center">Rate</th>
                        <th className="py-4 text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="text-[12px] font-bold text-zinc-800 dark:text-zinc-100">
                     <tr className="border-b border-zinc-50 dark:border-zinc-800/50">
                        <td className="py-6 text-left">
                           <p className="font-black uppercase tracking-tight text-left">Wholesale Premium Termination</p>
                           <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1 text-left">Routes: Global_Premium_Direct | Period: {new Date().toLocaleString('default', { month: 'long' })}</p>
                        </td>
                        <td className="py-6 text-center font-mono">{usage}</td>
                        <td className="py-6 text-center font-mono">$0.00850</td>
                        <td className="py-6 text-right font-black font-mono">{revenue}</td>
                     </tr>
                     <tr className="border-b border-zinc-50 dark:border-zinc-800/50 text-left">
                        <td className="py-6 text-left">
                           <p className="font-black uppercase tracking-tight text-left">Technical Maintenance Fee</p>
                           <p className="text-[9px] font-bold text-zinc-500 uppercase mt-1 text-left">Platform Support Tier 1</p>
                        </td>
                        <td className="py-6 text-center font-mono">1</td>
                        <td className="py-6 text-center font-mono">$0.00</td>
                        <td className="py-6 text-right font-black font-mono">$0.00</td>
                     </tr>
                  </tbody>
               </table>
            </div>

            {/* SUB-ACCOUNT TRAFFIC AND CREDIT CONSUMPTION ANALYSIS */}
            <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#428bca]"></span>
                     <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-[#428bca] text-left">Sub-Account Segmental Billing & Credit Draws</p>
                  </div>
                  <span className="text-[9px] font-black uppercase text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1 rounded-lg border border-zinc-100 dark:border-zinc-800 font-mono">Shared Master Customer Pool</span>
               </div>
               
               <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50/10">
                  <table className="w-full text-left border-collapse text-[11px]">
                     <thead className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-800">
                        <tr>
                           <th className="px-6 py-3 font-black text-zinc-500 uppercase tracking-widest text-[9px]">Account name (Trunk code)</th>
                           <th className="px-6 py-3 font-black text-zinc-500 uppercase tracking-widest text-[9px] text-center">Invoiced Traffic (SMS)</th>
                           <th className="px-6 py-3 font-black text-zinc-500 uppercase tracking-widest text-[9px] text-right">Invoiced Amount</th>
                           <th className="px-6 py-3 font-black text-zinc-500 uppercase tracking-widest text-[9px] text-right">Sub-Account Credit Used</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                        <tr className="hover:bg-zinc-50/20 transition-all">
                           <td className="px-6 py-3 font-bold text-zinc-800 dark:text-zinc-200">DIR_IN_01 (Retail SMS Account)</td>
                           <td className="px-6 py-3 text-center font-mono font-medium">1,212,160</td>
                           <td className="px-6 py-3 text-right font-mono font-bold">$10,919.33</td>
                           <td className="px-6 py-3 text-right font-black text-rose-500 font-mono">$3,200.00</td>
                        </tr>
                        <tr className="hover:bg-zinc-50/20 transition-all">
                           <td className="px-6 py-3 font-bold text-zinc-800 dark:text-zinc-200">DIR_IN_02 (OTP Alert Gateway)</td>
                           <td className="px-6 py-3 text-center font-mono font-medium">681,840</td>
                           <td className="px-6 py-3 text-right font-mono font-bold">$6,142.12</td>
                           <td className="px-6 py-3 text-right font-black text-rose-500 font-mono">$1,800.00</td>
                        </tr>
                        <tr className="bg-zinc-50/30 font-bold dark:bg-zinc-800/10">
                           <td className="px-6 py-3 text-[#428bca]">Customer Shared Totals</td>
                           <td className="px-6 py-3 text-center font-mono">1,894,000</td>
                           <td className="px-6 py-3 text-right font-mono text-zinc-800 dark:text-zinc-100">{revenue}</td>
                           <td className="px-6 py-3 text-right font-black text-rose-500 font-mono">$5,000.00</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="flex justify-end pt-8">
               <div className="w-72 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                     <span className="uppercase tracking-widest text-left">Sub Total</span>
                     <span className="font-mono text-zinc-900 dark:text-zinc-100">{revenue}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-zinc-400">
                     <span className="uppercase tracking-widest text-left">VAT (0%)</span>
                     <span className="font-mono text-zinc-900 dark:text-zinc-100">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#428bca]/5 p-4 rounded-2xl border border-[#428bca]/20 mt-4">
                     <div className="text-left">
                        <span className="text-[10px] font-black uppercase text-[#428bca] tracking-widest block">Grand Total</span>
                        <span className="text-[9px] font-bold text-zinc-400 uppercase italic">Inclusive of all taxes & usage</span>
                     </div>
                     <span className="text-xl font-black font-mono text-[#428bca]">{revenue}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-left">
               <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-700 text-left">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-3 text-left">Bank Details for Wire Transfer</p>
                  <div className="space-y-3 text-left">
                     <div className="space-y-1 text-left">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase text-left">Bank Name</p>
                        <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 uppercase text-left">HDFC BANK (Wholesale Branch)</p>
                     </div>
                     <div className="space-y-1 text-left">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase text-left">Account Number / IBAN</p>
                        <p className="text-xs font-black font-mono text-zinc-800 dark:text-zinc-100 tracking-widest text-left">8827364500921288</p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 text-left">
                           <p className="text-[10px] font-bold text-zinc-500 uppercase text-left">SWIFT/BIC</p>
                           <p className="text-xs font-black font-mono text-zinc-800 dark:text-zinc-100 text-left">HDFC0000123</p>
                        </div>
                        <div className="space-y-1 text-left">
                           <p className="text-[10px] font-bold text-zinc-500 uppercase text-left">Currency</p>
                           <p className="text-xs font-black font-mono text-[#428bca] text-left">USD</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800 flex flex-col justify-center items-center gap-4 relative overflow-hidden group border-2 border-emerald-500/20">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all">
                     <CheckCircle2 className="w-24 h-24 text-emerald-500" />
                  </div>
                  <div className="text-center group-hover:scale-105 transition-transform">
                     <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-2">Net Status</p>
                     <h3 className="text-3xl font-black text-white tracking-widest uppercase">Cleared</h3>
                     <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">Verified by Wholesale Audit</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="px-8 py-6 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-left">
            <div className="flex flex-col gap-1">
               <div className="flex gap-2">
                  <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Download PDF">
                     <Download className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                  </button>
                  <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" title="Print Invoice">
                     <Save className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
                  </button>
               </div>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Recipient: accounting@{enterpriseName.toLowerCase().replace(/\s/g, '')}.com</p>
            </div>
            <div className="flex gap-3">
               <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Discard</button>
               <button 
                  onClick={handleSend}
                  disabled={sendState !== 'idle'}
                  className={cn(
                    "px-10 py-2 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2 font-black min-w-[200px] justify-center",
                    sendState === 'idle' ? "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/20" : 
                    sendState === 'sending' ? "bg-zinc-500 cursor-wait" : "bg-emerald-500"
                  )}
               >
                  {sendState === 'idle' && <><Mail className="w-4 h-4" /> Finalize & Send</>}
                  {sendState === 'sending' && <><RotateCcw className="w-4 h-4 animate-spin" /> Dispatching...</>}
                  {sendState === 'sent' && <><CheckCircle2 className="w-4 h-4" /> Sent to Client</>}
               </button>
            </div>
         </div>
      </div>
   );
}

export function VendorInvoicePreviewModal({ onClose, theme, data }: FormProps & { data?: any }) {
   const enterpriseName = data?.['VENDER'] || data?.['Vendor'] || data?.['Enterprise'] || 'Direct Carrier Networks';
   const amount = data?.['CHARGE AMOUNT'] || data?.['Total'] || '$8,940.00';
   const invoiceNo = data?.['INVOICE NUMBER'] || data?.['Ref'] || `VEN-${Math.floor(Math.random() * 89999) + 10000}`;

   return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-w-5xl w-full mx-auto text-left">
         <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center text-left">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Vendor Invoice Verification</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
               <X className="w-5 h-5" />
            </button>
         </div>
         
         <div className="p-10 space-y-10 max-h-[80vh] overflow-y-auto custom-scrollbar font-sans text-left">
            <div className="flex justify-between items-start">
               <div className="space-y-4 text-left">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                     <FileText className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5 text-left">
                     <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest text-left">Vendor Name</p>
                     <h2 className="text-xl font-black tracking-tight text-zinc-800 dark:text-zinc-100 uppercase text-left">{enterpriseName}</h2>
                  </div>
               </div>
               <div className="text-right space-y-1">
                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest text-right">Invoice Ref</p>
                  <p className="text-lg font-black font-mono text-zinc-800 dark:text-zinc-100 uppercase tracking-tight text-right">{invoiceNo}</p>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Dated: {data?.['INVOICE DATE'] || new Date().toLocaleDateString()}</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-700 text-left">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1 text-left">Billing Period</p>
                  <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 text-left">
                     {data?.['START DATE'] || '2024-05-01'} to {data?.['END DATE'] || '2024-05-31'}
                  </p>
               </div>
               <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700 text-left">
                  <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1 text-left">Charge Type</p>
                  <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 text-left">SMS HUBBING TERMINATION</p>
               </div>
               <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 text-left">
                  <p className="text-[9px] font-black uppercase text-zinc-505 tracking-widest mb-1 text-left">Total Amount</p>
                  <p className="text-lg font-black font-mono text-white text-left">{amount}</p>
               </div>
            </div>

            <div className="space-y-6 text-left">
               <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#428bca]"></span>
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest text-left">Line Item Breakdown</h4>
               </div>
               <div className="border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden text-left">
                  <table className="w-full text-left">
                     <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                        <tr>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider text-left">Service</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider text-center">Volume</th>
                           <th className="px-6 py-4 text-[10px] font-black uppercase text-zinc-400 tracking-wider text-right">Price</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50 text-[11px] font-bold">
                        <tr>
                           <td className="px-6 py-4 text-left">Global SMS Termination (Direct)</td>
                           <td className="px-6 py-4 text-center text-zinc-500 font-mono">{data?.['CHARGE VOLUME'] || '980,230'}</td>
                           <td className="px-6 py-4 text-right font-black font-mono">{amount}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-center text-left">
               <div className="w-10 h-10 bg-white dark:bg-zinc-900 rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <div className="text-left">
                  <p className="text-xs font-black text-blue-900 dark:text-blue-100 text-left">Matching System Records</p>
                  <p className="text-[10px] font-bold text-blue-700/70 text-left">Internal CDR matches vendor reported volume within 0.2% tolerance.</p>
               </div>
            </div>
         </div>

         <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-left">
            <div className="flex items-center gap-2 text-zinc-400">
               <Info className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-widest italic font-sans text-left">Internal verification will mark this invoice as "Ready for Payment"</span>
            </div>
            <div className="flex gap-3">
               <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Back</button>
               <button 
                  onClick={onClose}
                  className="px-10 py-2 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2 font-black min-w-[200px] justify-center shadow-emerald-500/20"
               >
                  <CheckCircle2 className="w-4 h-4" /> Approve & Post
               </button>
            </div>
         </div>
       </div>
    );
}

export function AddCustomerInvoiceForm({ onClose, theme }: FormProps) {
  const [invoiceNo, setInvoiceNo] = React.useState(`INV-2026-${Math.floor(Math.random() * 89999) + 10000}`);
  const [customerName, setCustomerName] = React.useState('');
  const [customerAccount, setCustomerAccount] = React.useState('');
  const [enterpriseType] = React.useState('customer');
  const [invoiceType, setInvoiceType] = React.useState('Standard');
  const [billingType, setBillingType] = React.useState('Postpaid');
  
  const [invoiceDate, setInvoiceDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [usageStart, setUsageStart] = React.useState('2026-04-01');
  const [usageEnd, setUsageEnd] = React.useState('2026-04-30');
  const [dueDate, setDueDate] = React.useState('2026-05-15');

  const [openingBalance, setOpeningBalance] = React.useState('12500.00');
  const [usageCharges, setUsageCharges] = React.useState('35000.00');
  const [closingBalance, setClosingBalance] = React.useState('47500.00');
  const [amount, setAmount] = React.useState('47500.00');

  const [emailStatus, setEmailStatus] = React.useState('Sent');
  const [status, setStatus] = React.useState('Unpaid');
  
  const [chargeDetails, setChargeDetails] = React.useState('3,500,000 Volume @ $0.0100 / DLR 96.4%');

  const [sendPdf, setSendPdf] = React.useState(true);
  const [includeCdr, setIncludeCdr] = React.useState(true);
  const [isCalculating, setIsCalculating] = React.useState(false);

  const customersList = [
    'ABC Corp', 
    'XYZ Telecom', 
    'Global SMS', 
    'Digital SMS Solutions', 
    'SkyReach SMS', 
    'Airtel Business'
  ];

  const accountsMapByCustomer: Record<string, { id: string, name: string }[]> = {
    'ABC Corp': [
      { id: 'ACC-9201-ABC-01', name: 'Primary Account' },
      { id: 'ACC-9201-ABC-02', name: 'Wholesale' },
      { id: 'ACC-9201-ABC-03', name: 'Europe' }
    ],
    'XYZ Telecom': [
      { id: 'ACC-3402-XYZ-01', name: 'Direct Routing' },
      { id: 'ACC-3402-XYZ-02', name: 'Prepaid Asia' }
    ],
    'Global SMS': [
      { id: 'ACC-4491-GLB-01', name: 'USD Hub' },
      { id: 'ACC-4491-GLB-02', name: 'EUR Hub' }
    ],
    'Digital SMS Solutions': [
      { id: 'ACC-1102-DIG-01', name: 'Standard' }
    ],
    'SkyReach SMS': [
      { id: 'ACC-5521-SKY-01', name: 'Retail' },
      { id: 'ACC-5521-SKY-02', name: 'International' }
    ],
    'Airtel Business': [
      { id: 'ACC-8821-ART-01', name: 'Enterprise' },
      { id: 'ACC-8821-ART-02', name: 'Direct Carrier Interconnect' }
    ]
  };

  const handleCustomerChange = (val: string) => {
    setCustomerName(val);
    setCustomerAccount(val ? 'Combined Accounts' : '');
  };

  const getCombinedMetricsOfCustomer = (custName: string) => {
    const accounts = accountsMapByCustomer[custName] || [
      { id: `ACC-1002-${custName.substring(0,3).toUpperCase()}-01`, name: 'Direct Retail' },
      { id: `ACC-1002-${custName.substring(0,3).toUpperCase()}-02`, name: 'Wholesale Hub' }
    ];

    let totalVolume = 0;
    let totalOpeningBalance = 0;
    let totalUsageCharges = 0;
    
    const accountWiseDetails = accounts.map((acct) => {
      let baseVolume = 3500000;
      let baseRate = 0.0100;
      let dlr = '96.4%';
      let opBal = 0.00;

      if (custName === 'ABC Corp') {
        if (acct.name === 'Wholesale' || acct.name.includes('Wholesale')) {
          baseVolume = 17500300;
          baseRate = 0.0032;
          dlr = '98.5%';
          opBal = 0.00;
        } else if (acct.name === 'Europe' || acct.name.includes('Europe')) {
          baseVolume = 6200150;
          baseRate = 0.0045;
          dlr = '97.2%';
          opBal = 2450.00;
        } else {
          baseVolume = 12450890;
          baseRate = 0.0038;
          dlr = '98.1%';
          opBal = 450.00;
        }
      } else if (custName === 'XYZ Telecom') {
        if (acct.name === 'Direct Routing' || acct.name.includes('Direct Routing')) {
          baseVolume = 10450000;
          baseRate = 0.0050;
          dlr = '97.4%';
          opBal = 500.00;
        } else {
          baseVolume = 8940120;
          baseRate = 0.0055;
          dlr = '96.8%';
          opBal = 1200.00;
        }
      } else if (custName === 'Global SMS') {
        if (acct.name === 'USD Hub' || acct.name.includes('USD')) {
          baseVolume = 4200000;
          baseRate = 0.0090;
          dlr = '95.9%';
          opBal = 150.00;
        } else {
          baseVolume = 3100000;
          baseRate = 0.0095;
          dlr = '96.4%';
          opBal = 100.00;
        }
      } else {
        const h = acct.name.charCodeAt(0) % 3;
        if (h === 0) {
          baseVolume = 4500000;
          baseRate = 0.0065;
          dlr = '97.1%';
          opBal = 350.00;
        } else if (h === 1) {
          baseVolume = 3200000;
          baseRate = 0.0078;
          dlr = '96.2%';
          opBal = 120.00;
        } else {
          baseVolume = 1800000;
          baseRate = 0.0090;
          dlr = '95.5%';
          opBal = 0.00;
        }
      }

      const usage = baseVolume * baseRate;
      totalVolume += baseVolume;
      totalOpeningBalance += opBal;
      totalUsageCharges += usage;

      return {
        id: acct.id,
        name: acct.name,
        volume: baseVolume,
        rate: baseRate,
        dlr,
        openingBalance: opBal,
        usageCharges: usage,
        closingBalance: opBal + usage
      };
    });

    return {
      totalVolume,
      totalOpeningBalance,
      totalUsageCharges,
      totalClosingBalance: totalOpeningBalance + totalUsageCharges,
      accountWiseDetails
    };
  };

  // Auto-calculation logic for balances
  React.useEffect(() => {
    const op = parseFloat(openingBalance) || 0;
    const us = parseFloat(usageCharges) || 0;
    const cl = op + us;
    setClosingBalance(cl.toFixed(2));
    setAmount(cl.toFixed(2));
  }, [openingBalance, usageCharges]);

  // Handle dynamic presets when customer is selected
  React.useEffect(() => {
    if (!customerName) return;
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const metrics = getCombinedMetricsOfCustomer(customerName);
      setOpeningBalance(metrics.totalOpeningBalance.toFixed(2));
      setUsageCharges(metrics.totalUsageCharges.toFixed(2));
      setChargeDetails(`${metrics.totalVolume.toLocaleString()} Combined SMS Volume`);
      setIsCalculating(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [customerName]);

  const handleCreateAndSend = () => {
    if (!customerName || !invoiceNo) {
      alert('Please fill in all mandatory fields: Customer Name and Invoice Number.');
      return;
    }

    const emailTarget = `billing@${customerName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'customer'}.com`;
    const metrics = getCombinedMetricsOfCustomer(customerName);
    
    let alertMsg = `============== COMBINED CUSTOMER INVOICE SUCCESS ==============\n\n` + 
      `Invoice Number    : ${invoiceNo}\n` +
      `Customer Name     : ${customerName}\n` +
      `Invoice Type      : ${invoiceType}\n` +
      `Billing Type      : ${billingType}\n` +
      `Invoice Date      : ${invoiceDate}\n` +
      `Usage Period      : ${usageStart} to ${usageEnd}\n` +
      `Due Date          : ${dueDate}\n` +
      `Consolidated Vol  : ${metrics.totalVolume.toLocaleString()} Total Vol\n` +
      `Opening Balance   : $${parseFloat(openingBalance).toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `Usage Charges     : $${parseFloat(usageCharges).toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `Closing Balance   : $${parseFloat(closingBalance).toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `Invoice Due Sum   : $${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
      `Email Status      : ${emailStatus}\n` +
      `Ledger Status     : ${status}\n\n` +
      `----------------- Account-wise Breakdown -----------------\n`;

    metrics.accountWiseDetails.forEach(d => {
      alertMsg += `• ${d.name} (${d.id}): ${d.volume.toLocaleString()} SMS | $${d.usageCharges.toLocaleString(undefined, {minimumFractionDigits: 2})} Usage | $${d.openingBalance.toLocaleString(undefined, {minimumFractionDigits: 2})} Op Balance\n`;
    });

    alertMsg += `\n--------------------- Financial Integrity Check ---------------------\n`;

    if (sendPdf) {
      alertMsg += `✔ [DISPATCH] PDF mailing sent to customer inbox: ${emailTarget}\n`;
    }
    if (includeCdr) {
      alertMsg += `✔ [CDR ATTACHMENT] Sub-account CDR volume logs appended successfully.\n`;
    }
    
    alertMsg += `\n✔ Customer Invoice synchronized with Ledger (Combined account details recorded).`;
    alert(alertMsg);
    onClose();
  };

  const activeCustomerAccountObj = (accountsMapByCustomer[customerName] || [])[0];
  const resolvedCustomerAccountId = activeCustomerAccountObj ? activeCustomerAccountObj.id : 'N/A';

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200 lg:max-w-5xl w-full mx-auto text-left font-sans">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
           <FileText className="w-4 h-4 text-[#428bca]" />
           <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Create Customer Invoice</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar text-left font-sans">
        {!customerName ? (
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-700 font-sans text-center flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/25 flex items-center justify-center text-[#428bca]">
              <Info className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h5 className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wider">Awaiting Customer Selection</h5>
              <p className="text-xs text-zinc-500 max-w-[460px] mx-auto leading-relaxed">
                Please select a **Customer** to load consolidated real-time traffic offsets and combined balances across all accounts.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-500/20 rounded-2xl animate-in fade-in duration-300 slide-in-from-top-2 flex flex-col gap-5">
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">Carrier Consolidated Invoice Summary</h4>
                <p className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5">{customerName} Shared Customer Pool</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-left font-mono border-t border-emerald-500/10 pt-4">
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block mb-1">Charge Volume Ref</span>
                <span className="text-[11px] font-bold text-emerald-600 truncate block">{isCalculating ? 'Computing details...' : chargeDetails}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block mb-1">Consolidated Usage Due</span>
                <span className="text-sm font-black text-zinc-800 dark:text-zinc-200 tracking-tight block">{isCalculating ? 'Computing...' : `$${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block mb-1">Combined Bal Offset</span>
                <span className="text-sm font-black text-rose-600 tracking-tight block">{isCalculating ? 'Computing...' : `$${parseFloat(openingBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-zinc-400 tracking-wider block mb-1">Final Reconciled Closing</span>
                <span className="text-sm font-black text-[#428bca] tracking-tight block">{isCalculating ? 'Computing...' : `$${parseFloat(closingBalance).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}</span>
              </div>
            </div>

            {/* ACCOUNT-WISE TRAFFIC & USAGE TABLE */}
            <div className="space-y-2 pt-4 border-t border-dashed border-emerald-500/10 text-left">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-[#428bca] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#428bca]" />
                Account-Wise Traffic & Balanced Distribution
              </h5>
              <div className="border border-zinc-150 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-[#428bca]/5 font-black text-zinc-400 text-[8px] uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-800">
                    <tr>
                      <th className="px-3 py-2">Billing Account ID & Name</th>
                      <th className="px-3 py-2 text-center">Invoiced Traffic (SMS)</th>
                      <th className="px-3 py-2 text-center">Avg Rate</th>
                      <th className="px-3 py-2 text-right">Opening Balance</th>
                      <th className="px-3 py-2 text-right">Invoiced Usage Due</th>
                      <th className="px-3 py-2 text-right">Closing sum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 font-bold text-zinc-700 dark:text-zinc-300">
                    {getCombinedMetricsOfCustomer(customerName).accountWiseDetails.map((ac) => (
                      <tr key={ac.id} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10">
                        <td className="px-3 py-2.5">
                          <span className="font-bold text-zinc-800 dark:text-zinc-100">{ac.name}</span>
                          <span className="text-[8px] font-semibold text-zinc-400 font-mono block mt-0.5">{ac.id}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-mono">{ac.volume.toLocaleString()}</td>
                        <td className="px-3 py-2.5 text-center font-mono text-[#428bca]">${ac.rate.toFixed(4)}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-zinc-500">${ac.openingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-emerald-600">${ac.usageCharges.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        <td className="px-3 py-2.5 text-right font-mono text-zinc-900 dark:text-zinc-200">${ac.closingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#428bca]/5 dark:bg-blue-950/10 font-black text-zinc-900 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-800">
                      <td className="px-3 py-2 text-[#428bca]">Consolidated Shared Pool</td>
                      <td className="px-3 py-2 text-center font-mono">{getCombinedMetricsOfCustomer(customerName).totalVolume.toLocaleString()}</td>
                      <td className="px-3 py-2 text-center font-mono">-</td>
                      <td className="px-3 py-2 text-right font-mono text-zinc-500">${getCombinedMetricsOfCustomer(customerName).totalOpeningBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="px-3 py-2 text-right font-mono text-emerald-600">${getCombinedMetricsOfCustomer(customerName).totalUsageCharges.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="px-3 py-2 text-right font-mono text-[#428bca]">${getCombinedMetricsOfCustomer(customerName).totalClosingBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Section 1: Core Entity Info */}
          <div className="bg-zinc-50/50 dark:bg-zinc-850/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#428bca] border-b pb-2 mb-4">1. Carrier Entity Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 md:col-span-4">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Customer Name <span className="text-red-500">*</span></label>
                <select 
                  value={customerName}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]"
                >
                  <option value="">Select customer target...</option>
                  {customersList.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Invoice Number <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca] font-mono text-blue-600" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Invoice Type</label>
                <select 
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value)}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]"
                >
                  <option>Standard</option>
                  <option>Credit Note</option>
                  <option>Debit Note</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Billing Type</label>
                <select 
                  value={billingType}
                  onChange={(e) => setBillingType(e.target.value)}
                  className="w-full px-2 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]"
                >
                  <option>Postpaid</option>
                  <option>Prepaid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Invoice Dates & Period */}
          <div className="bg-zinc-50/50 dark:bg-zinc-850/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/85">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#428bca] border-b pb-2 mb-4">2. Statement Dates & Period</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Invoice Date</label>
                <input 
                  type="date" 
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Payment Due Date</label>
                <input 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Usage Start Date</label>
                <input 
                  type="date" 
                  value={usageStart}
                  onChange={(e) => setUsageStart(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Usage End Date</label>
                <input 
                  type="date" 
                  value={usageEnd}
                  onChange={(e) => setUsageEnd(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
            </div>
          </div>

          {/* Section 3: Ledger Configuration */}
          <div className="bg-zinc-50/50 dark:bg-zinc-850/20 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#428bca] border-b pb-2 mb-4">3. Financial Ledger Bounds</h4>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Charge Details Summary Description</label>
              <input 
                type="text" 
                value={chargeDetails}
                onChange={(e) => setChargeDetails(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Opening Bal ($)</label>
                <input 
                  type="number" 
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Usage Chgs ($)</label>
                <input 
                  type="number" 
                  value={usageCharges}
                  onChange={(e) => setUsageCharges(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono text-zinc-800 dark:text-zinc-100 focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Closing Bal ($)</label>
                <input 
                  type="number" 
                  value={closingBalance}
                  onChange={(e) => setClosingBalance(e.target.value)}
                  className="w-full px-2 py-1.5 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 text-zinc-650 rounded-md text-[12px] font-bold outline-none font-mono" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Invoice Amt ($)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-mono text-emerald-600 focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]" 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Email Status</label>
                <select 
                  value={emailStatus}
                  onChange={(e) => setEmailStatus(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-semibold text-blue-600 focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]"
                >
                  <option>Sent</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Ledger Status</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-[#100%] px-2 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-[12px] font-bold outline-none font-semibold text-zinc-700 dark:text-zinc-350 focus:ring-2 focus:ring-[#428bca]/10 focus:border-[#428bca]"
                >
                  <option>Unpaid</option>
                  <option>Paid</option>
                  <option>Void</option>
                  <option>Dispute</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dispatch details & check options */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl border border-zinc-105 dark:border-zinc-800/80 space-y-3 text-left">
           <label className="flex items-center gap-2 cursor-pointer text-left">
             <input 
               type="checkbox" 
               checked={sendPdf} 
               onChange={() => setSendPdf(!sendPdf)}
               className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-555" 
             />
             <span className="text-[11px] font-bold text-zinc-650 dark:text-zinc-300 flex items-center gap-1 text-left">
               <Mail className="w-3.5 h-3.5 text-zinc-400" /> Dispatch PDF Statement auto-mail copy upon creation
             </span>
           </label>
           <label className="flex items-center gap-2 cursor-pointer text-left">
             <input 
               type="checkbox" 
               checked={includeCdr} 
               onChange={() => setIncludeCdr(!includeCdr)}
               className="w-4 h-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500" 
             />
             <span className="text-[11px] font-bold text-zinc-650 dark:text-zinc-300 flex items-center gap-1 text-left">
               <FileText className="w-3.5 h-3.5 text-zinc-400" /> Compile and attach segmented Excel CDR traffic logs (Net-Audit compliant)
             </span>
           </label>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 text-left">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-[#d9534f] hover:text-red-700 transition-colors">Cancel</button>
        <button 
          onClick={handleCreateAndSend}
          disabled={!customerName || !customerAccount || isCalculating}
          className={cn(
            "px-8 py-2 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2",
            (!customerName || !customerAccount || isCalculating) ? "bg-zinc-400 cursor-not-allowed" : "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/20"
          )}
        >
          <Save className="w-4 h-4" /> Create & Dispatch Invoice
        </button>
      </div>
    </div>
  );
}

export function BilateralNettingModal({ onClose, theme, data }: FormProps & { data?: any }) {
  const enterpriseName = data?.['ENTERPRISE NAME'] || 'ABC Corp';
  
  // Parse balances safely or fallback to realistic numbers
  const creditRaw = parseFloat((data?.['TOTAL CREDIT'] || '$45,800.00').replace(/[^0-9.-]/g, '')) || 45800.00;
  const debitRaw = parseFloat((data?.['TOTAL DEBIT'] || '$31,200.00').replace(/[^0-9.-]/g, '')) || 31200.00;

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [nettingAmount, setNettingAmount] = React.useState(Math.min(creditRaw, debitRaw)); // offset the smaller one completely
  const [netSettlement, setNetSettlement] = React.useState(creditRaw - Math.min(creditRaw, debitRaw));

  const handleApplyNetting = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      const nettingId = `NET-${Math.floor(Math.random() * 89999) + 10000}`;
      alert(`============== BILATERAL NETTING AGREEMENT SUCCESS ==============\n\n` +
            `Netting ID      : ${nettingId}\n` +
            `Partner Entity   : ${enterpriseName}\n` +
            `Customer Receivables: $${creditRaw.toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
            `Vendor Payables  : $${debitRaw.toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
            `Offset Netted Sum: $${nettingAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}\n` +
            `Net Outstanding   : $${netSettlement.toLocaleString(undefined, {minimumFractionDigits: 2})}\n\n` +
            `✔ Outstanding vendor/customer balances have been mutually matched and offset.\n` +
            `✔ Added netting ledger entry to Statement of Account (SOA).\n` +
            `✔ Dispatched mutual settlement approval protocol to billing agent.`);
      onClose();
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 w-full max-w-3xl font-sans text-left">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex justify-between items-center font-sans">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">Bilateral Netting Settlement Engine</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto font-sans">
        <div className="p-4 bg-[#428bca]/5 border border-[#428bca]/15 rounded-xl flex items-start gap-3">
          <Info className="w-4 h-4 text-[#428bca] mt-0.5 shrink-0" />
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Wholesale SMS carriers operate mutual traffic streams (acting as both customer and supplier). <strong>Bilateral Netting</strong> mutually offsets reciprocal obligations, leaving only a single net balance to settle via bank wire - conserving treasury reserves.
          </p>
        </div>

        {/* Company Header */}
        <div>
          <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono block mb-1">Partner Carrier Entity</span>
          <h2 className="text-2xl font-black text-zinc-800 dark:text-zinc-100 uppercase">{enterpriseName}</h2>
          <p className="text-xs text-zinc-500 font-semibold mt-0.5">Billing Protocol Term: Net-7 bilateral offset reconciliation</p>
        </div>

        {/* Balance Match Visualization Grid */}
        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono block">Customer Account</span>
            <p className="text-[10px] text-zinc-400 uppercase mt-1">Their Traffic to us (Receivables)</p>
            <p className="text-2xl font-black text-emerald-600 font-mono mt-3">
              ${creditRaw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 font-mono block">Vendor Account</span>
            <p className="text-[10px] text-zinc-400 uppercase mt-1">Our Traffic to them (Payables)</p>
            <p className="text-2xl font-black text-rose-600 font-mono mt-3">
              ${debitRaw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Offset Calculator Controls */}
        <div className="bg-zinc-50 dark:bg-zinc-800/40 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-4">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Offset Reconciliation Configuration</h4>
          
          <div className="grid grid-cols-2 gap-6 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-semibold text-zinc-500">Mutually Netted Offset Amount ($)</label>
              <input 
                type="number" 
                max={Math.min(creditRaw, debitRaw)}
                value={nettingAmount} 
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setNettingAmount(val);
                  setNetSettlement(creditRaw - val);
                }}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs outline-none font-mono font-bold text-[#428bca]" 
              />
            </div>
            <div className="text-zinc-500 text-xs font-semibold leading-relaxed pb-2">
              (Maximum permitted offset matches smaller exposure limit: <strong className="text-zinc-700 dark:text-zinc-300 font-mono">${Math.min(creditRaw, debitRaw).toLocaleString()}</strong>)
            </div>
          </div>
        </div>

        {/* Expected Netting Output Summary */}
        <div className="p-5 bg-zinc-900 text-white rounded-2xl border border-zinc-800/80 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expected Reconciled Balances sheet</span>
            <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold uppercase rounded font-mono">Net outstanding: Receivables</span>
          </div>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between font-sans">
              <span className="text-zinc-400">Total Mutual Exposure Before Netting:</span>
              <span className="font-mono text-zinc-300">${(creditRaw + debitRaw).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400 font-sans">Offset Deductions sum:</span>
              <span className="font-mono text-emerald-400">-${(nettingAmount * 2).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-1 font-sans">
              <span className="text-sm font-bold">New Net Outstanding Balance remaining:</span>
              <span className="text-xl font-black font-mono text-[#428bca]">${netSettlement.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 font-sans">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-[#d9534f] hover:text-red-700 transition-colors">Cancel</button>
        <button 
          onClick={handleApplyNetting}
          disabled={isProcessing}
          className={cn(
            "px-8 py-2 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center gap-2",
            isProcessing ? "bg-zinc-400 cursor-wait" : "bg-[#428bca] hover:bg-blue-600 shadow-blue-500/20"
          )}
        >
          {isProcessing ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              Reconciling Ledger...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Execute Mutual Offset & Settle
            </>
          )}
        </button>
      </div>
    </div>
  );
}
