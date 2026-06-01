import React from 'react';
import { Search, Info, RotateCcw, Download, Calendar, ArrowRightLeft, TrendingUp, TrendingDown, FileText, Mail, AlertCircle, CheckCircle, Smartphone, Globe, Landmark, Users, List, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ReportFormProps {
  title: string;
  theme: 'light' | 'dark';
  onBack?: () => void;
}

function useDragScroll() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [startY, setStartY] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [scrollTop, setScrollTop] = React.useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ref.current.offsetLeft);
    setStartY(e.pageY - ref.current.offsetTop);
    setScrollLeft(ref.current.scrollLeft);
    setScrollTop(ref.current.scrollTop);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const y = e.pageY - ref.current.offsetTop;
    const walkX = (x - startX) * 2; 
    const walkY = (y - startY) * 2;
    ref.current.scrollLeft = scrollLeft - walkX;
    ref.current.scrollTop = scrollTop - walkY;
  };

  return { 
    ref, 
    onMouseDown, 
    onMouseUp, 
    onMouseLeave, 
    onMouseMove, 
    isDragging 
  };
}

export function SpecializedReportForm({ title, theme, onBack }: ReportFormProps) {
  const effectiveTitle = title.includes(' / ') ? title.split(' / ').pop()! : title;

  const renderForm = () => {
    switch (effectiveTitle) {
      case 'Client Message Log':
      case 'Supplier Message Log':
        return <MessageLogForm title={effectiveTitle} />;
      case 'Client Summary':
      case 'Supplier Summary':
        return <SummaryReportForm title={effectiveTitle} />;
      case 'CDR Summary':
        return <CDRSummaryForm />;
      case 'Client Success Summary':
      case 'Supplier Success Summary':
        return <SuccessSummaryForm title={effectiveTitle} />;
      case 'Routing Wise Fail Summary':
        return <RoutingFailSummaryForm />;
      case 'Bilateral Report':
        return <BilateralReportForm onBack={onBack} />;
      case 'Inbound Audit Log':
      case 'Outbound Audit Log':
        return <AuditLogForm title={effectiveTitle} />;
      case 'Inbound TPS Detail':
      case 'Outbound TPS Detail':
        return <TPSDetailForm title={effectiveTitle} />;
      case 'Inbound DLR Resend':
        return <DLRResendForm />;
      case 'Customized DLR Inbound':
        return <CustomizedDLRForm />;
      case 'Schedule DLR Inbound':
        return <ScheduleDLRForm />;
      case 'DLR Status Report':
        return <DLRStatusReportForm />;
      case 'DLR Advance Search Report Client':
      case 'DLR Advance Search Report Supplier':
        return <DLRAdvanceSearchForm title={effectiveTitle} />;
      case 'DLR Analysis Report':
        return <DLRAnalysisReportForm />;
      case 'Country-Supplier Rate Analysis':
        return <CountrySupplierRateAnalysisForm />;
      case 'Rate Analysis Report':
        return <RateAnalysisReportForm />;
      case 'Supplier Rate Sheet':
        return <SupplierRateSheetForm />;
      case 'Supplier Auto Rate Sheet Report':
        return <SupplierAutoRateSheetForm />;
      case 'Email Notification Report':
        return <NotificationReportForm />;
      case 'Negative Margin Report':
        return <NegativeMarginReportForm />;
      case 'Top Users':
        return <TopUsersReportForm />;
      default:
        return <div className="p-10 text-center text-zinc-500 font-bold uppercase tracking-widest">Form for "{effectiveTitle}" in progress...</div>;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300 h-full flex flex-col">
      <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{title}</h3>
        <div className="flex items-center gap-2">
          {onBack && (
            <button 
              onClick={onBack}
              className="px-6 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600 transition-all font-mono"
            >
              Back
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderForm()}
      </div>
    </div>
  );
}

function FormRow({ label, required, children, inline = true, labelSize = "min-w-[140px]" }: { label: string; required?: boolean; children: React.ReactNode; inline?: boolean; labelSize?: string }) {
  return (
    <div className={cn("flex gap-2", inline ? "items-center" : "flex-col items-start gap-1")}>
      <label className={cn("text-[11px] font-bold text-zinc-500 dark:text-zinc-400 tracking-tight text-right font-mono uppercase whitespace-nowrap", labelSize)}>
        {label} {required && <span className="text-red-500">*</span>} :
      </label>
      <div className="flex-1 w-full">
        {children}
      </div>
    </div>
  );
}

function DLRStatusReportForm() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
        <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Search className="w-4 h-4 text-red-500" />
             <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">DLR Status Report</span>
          </div>
          <span className="text-[10px] text-zinc-400">Total 0 records found</span>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-[10px] border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Sr.No.</th>
                <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Supplier</th>
                <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Service Name</th>
                <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Mobile No</th>
                <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Supplier Message Id</th>
                <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Packet Text</th>
                <th className="px-3 py-2">Total Duplicate</th>
              </tr>
            </thead>
            <tbody>
               <tr>
                 <td colSpan={7} className="px-4 py-10 text-center text-zinc-400 bg-white dark:bg-zinc-950 italic">No records to display</td>
               </tr>
            </tbody>
          </table>
        </div>
        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between font-mono">
           <div className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded cursor-pointer hover:bg-red-600 uppercase font-black tracking-widest">CSV</div>
           <div className="flex items-center gap-2">
             <div className="flex border rounded-sm overflow-hidden text-[10px]">
               <div className="px-2 py-0.5 bg-zinc-100 border-r text-zinc-400">First</div>
               <div className="px-2 py-0.5 bg-zinc-100 border-r text-zinc-400">Prev</div>
               <div className="px-3 py-0.5 bg-white text-blue-500 font-bold border-r">1</div>
               <div className="px-2 py-0.5 bg-zinc-100 border-r text-zinc-400">Next</div>
               <div className="px-2 py-0.5 bg-zinc-100 text-zinc-400">Last</div>
             </div>
             <select className="text-[10px] border rounded-sm bg-white px-1">
               <option>500</option>
             </select>
           </div>
        </div>
      </div>
    </div>
  );
}

function DLRAdvanceSearchForm({ title }: { title: string }) {
  const isSupplier = title.includes('Supplier');
  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-lg overflow-hidden">
        <div className="px-4 py-2 border-b border-red-500 bg-white dark:bg-zinc-900 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
           DLR Advance Search Report
        </div>
        <div className="p-6 space-y-4">
           {isSupplier ? (
             <FormRow label="Select Supplier" required labelSize="min-w-[120px]">
                <select className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"><option>ALL</option></select>
             </FormRow>
           ) : (
             <FormRow label="User" required labelSize="min-w-[120px]">
                <select className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"><option>ALL</option></select>
             </FormRow>
           )}
           <FormRow label="Report Type" required labelSize="min-w-[120px]">
              <select className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"><option>DR Receive Time</option></select>
           </FormRow>
           <div className="grid grid-cols-2 gap-4">
              <FormRow label="From Date" labelSize="min-w-[120px]">
                 <input type="date" className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs" />
              </FormRow>
              <FormRow label="To Date" labelSize="min-w-[60px]">
                 <input type="date" className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs" />
              </FormRow>
           </div>
           {!isSupplier && (
             <FormRow label="Select Plan" labelSize="min-w-[120px]">
                <select className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"><option>Select</option></select>
             </FormRow>
           )}
           <FormRow label="Sending Service" labelSize="min-w-[120px]">
              <select className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"><option>Select</option></select>
           </FormRow>
           <FormRow label="Precision" required labelSize="min-w-[120px]">
              <select className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded text-xs"><option>TWO</option></select>
           </FormRow>
           
           <div className="flex justify-center gap-4 pt-6 border-t border-zinc-100 mt-6">
              <button className="px-10 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600">Back</button>
              <button className="px-10 py-1.5 bg-[#d9534f] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-red-600">Search</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function DLRAnalysisReportForm() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white border border-zinc-200 rounded shadow-sm">
        <div className="p-2 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
           DLR Analysis Report
        </div>
        <div className="p-4 flex items-center gap-8">
           <Search className="w-5 h-5 text-red-500 shrink-0" />
           <div className="flex gap-4 items-center">
              <FormRow label="Duration" required labelSize="min-w-[60px]">
                 <select className="px-3 py-1 bg-white border border-zinc-200 rounded text-xs w-48">
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                    <option>This Week</option>
                 </select>
              </FormRow>
              <FormRow label="Report Type" required labelSize="min-w-[80px]">
                 <select className="px-3 py-1 bg-white border border-zinc-200 rounded text-xs w-48">
                    <option>Operator Wise</option>
                    <option>Service Wise</option>
                    <option>Circle Wise</option>
                    <option>Service and Operator Wise</option>
                    <option>Circle and Operator Wise</option>
                    <option>Service and Circle Wise</option>
                 </select>
              </FormRow>
              <button className="px-5 py-1.5 border border-zinc-300 bg-zinc-50 hover:bg-zinc-100 rounded text-[10px] font-bold">Search</button>
           </div>
        </div>
        <div className="overflow-x-auto border-t border-zinc-200">
           <table className="w-full text-left text-[10px] border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-200 font-bold text-zinc-500">
                 <tr>
                    <th className="px-4 py-2 border-r border-zinc-200">DLR Analysis Report</th>
                    <th className="px-4 py-2 border-r border-zinc-200 text-blue-500 text-center">Delivered</th>
                    <th className="px-4 py-2 border-r border-zinc-200 text-blue-500 text-center">Not Delivered</th>
                    <th className="px-4 py-2 border-r border-zinc-200 text-blue-500 text-center">Not Available</th>
                    <th className="px-4 py-2 border-r border-zinc-200 text-blue-500 text-center">Blocked</th>
                    <th className="px-4 py-2 border-r border-zinc-200 text-blue-500 text-center">Rejected</th>
                    <th className="px-4 py-2 text-blue-500 text-center">Other</th>
                 </tr>
              </thead>
              <tbody>
                 <tr className="bg-zinc-50/50">
                    <td className="px-4 py-1.5 border-r border-zinc-200">Sr.No. Total</td>
                    <td className="px-4 py-1.5 border-r border-zinc-200"></td>
                    <td className="px-4 py-1.5 border-r border-zinc-200"></td>
                    <td className="px-4 py-1.5 border-r border-zinc-200"></td>
                    <td className="px-4 py-1.5 border-r border-zinc-200"></td>
                    <td className="px-4 py-1.5 border-r border-zinc-200"></td>
                    <td className="px-4 py-1.5"></td>
                 </tr>
              </tbody>
           </table>
        </div>
        <div className="p-2 border-t flex items-center justify-between text-[9px] bg-zinc-50">
           <div className="flex gap-2">
              <span className="bg-red-500 text-white px-2 py-0.5 rounded font-bold cursor-pointer">CSV</span>
              <span className="bg-red-500 text-white px-2 py-0.5 rounded font-bold cursor-pointer">Excel</span>
           </div>
           <div className="flex items-center gap-1">
              <button className="px-1 border bg-white disabled:opacity-50" disabled>&lt;&lt;</button>
              <button className="px-1 border bg-white disabled:opacity-50" disabled>&lt;</button>
              <span className="px-2 bg-blue-500 text-white rounded">1</span>
              <button className="px-1 border bg-white disabled:opacity-50" disabled>&gt;</button>
              <button className="px-1 border bg-white disabled:opacity-50" disabled>&gt;&gt;</button>
              <select className="ml-2 border"><option>500</option></select>
           </div>
        </div>
      </div>
    </div>
  );
}

function CountrySupplierRateAnalysisForm() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white border border-zinc-200 rounded">
        <div className="p-2 border-b border-zinc-200 bg-white/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
           Country-Supplier Rate Analysis
        </div>
        <div className="p-4 bg-zinc-50/30 text-[10px] text-zinc-500 italic border-b flex items-center justify-between">
           Note: If service wise rate is available then service rate will display and applied, if not then supplier rate will display and applied.
           <button className="p-1 hover:bg-zinc-200 rounded"><RotateCcw className="w-3 h-3" /></button>
        </div>
        <div className="p-4 flex items-center flex-wrap gap-x-8 gap-y-4 border-b">
           <FormRow label="Select Supplier" inline labelSize="min-w-0">
             <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Supplier</option></select>
           </FormRow>
           <FormRow label="Sending Service" inline labelSize="min-w-0">
             <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Sending Service</option></select>
           </FormRow>
           <FormRow label="Select Country" inline labelSize="min-w-0">
             <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Country</option></select>
           </FormRow>
           <FormRow label="Select Operator" inline labelSize="min-w-0">
             <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Operator</option></select>
           </FormRow>
           <button className="px-6 py-1 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest">Search</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-[10px] border-collapse">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-blue-500 font-bold uppercase">
                 <tr>
                    <th className="px-4 py-2 border-r">Country <span className="text-zinc-300">↕</span></th>
                    <th className="px-4 py-2">Operator <span className="text-zinc-300">↕</span></th>
                 </tr>
              </thead>
              <tbody className="divide-y text-zinc-600">
                 <tr className="hover:bg-zinc-50">
                    <td className="px-4 py-2 border-r">
                       Afghanistan<br/><span className="text-[9px] text-zinc-400 font-mono">(ISO CODE: AFG)</span>
                    </td>
                    <td className="px-4 py-2 font-mono">
                       Afghanistan_ROSHAN<br/><span className="text-[9px] text-zinc-400">(MCC: 412, MNC: 20)</span>
                    </td>
                 </tr>
                 <tr className="hover:bg-zinc-50">
                    <td className="px-4 py-2 border-r">
                       Afghanistan<br/><span className="text-[9px] text-zinc-400 font-mono">(ISO CODE: AFG)</span>
                    </td>
                    <td className="px-4 py-2 font-mono">
                       Afghanistan_AREEBA (... <br/><span className="text-[9px] text-zinc-400">(MCC: 412, MNC: 40)</span>
                    </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

function RateAnalysisReportForm() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white border border-zinc-200 rounded shadow-sm">
        <div className="p-2 border-b border-zinc-200 bg-white/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
           Rate Analysis Report
        </div>
        <div className="p-4 bg-zinc-50/50 text-[10px] text-zinc-500 italic space-y-1">
           <p>Note:</p>
           <p>1) If service wise rate is available then service rate will display and applied, if not then supplier rate will display and applied.</p>
           <p>2) Default rate is not include in this list, SMS may be sent with default price if override rate not found.</p>
           <p>3) All rate shown are in system currency</p>
        </div>
        <div className="p-4 border-t flex flex-wrap gap-4 items-center">
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Supplier</option></select>
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Sending Service</option></select>
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Country</option></select>
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Operator</option></select>
           <button className="px-10 py-1 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest">Search</button>
        </div>
        <div className="p-4 border-t space-y-4 bg-zinc-50/20">
           <div className="flex items-center gap-8">
              <span className="text-[10px] font-bold text-blue-500 uppercase cursor-pointer underline underline-offset-4">Row/Column Options</span>
              <div className="flex gap-2">
                 {['Country', 'Country Code', 'MCC', 'MNC', 'Supplier'].map(opt => (
                   <span key={opt} className="px-4 py-1 bg-white border border-zinc-200 rounded text-[10px] text-zinc-500 font-mono shadow-sm">{opt}</span>
                 ))}
              </div>
           </div>
           <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-zinc-500 uppercase min-w-[80px]">Data Field</span>
                 <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs flex-1"><option>Minimum</option></select>
                 <div className="px-8 py-1.5 border bg-white rounded text-[10px] font-mono shadow-sm">Service</div>
              </div>
           </div>
           <div className="pt-4 flex gap-4">
              <div className="px-8 py-1.5 border bg-white rounded text-[10px] font-mono shadow-sm">Operator</div>
           </div>
        </div>
        <div className="p-4 border-t flex justify-center gap-4">
           <button className="px-10 py-1.5 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest shadow-md">Back</button>
        </div>
      </div>
    </div>
  );
}

function SupplierRateSheetForm() {
  return (
    <div className="p-4 space-y-4">
      <div className="bg-white border border-zinc-200 rounded shadow-sm">
        <div className="p-2 border-b border-zinc-200 bg-white/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
           Supplier Rate Sheet
        </div>
        <div className="p-4 bg-zinc-50/50 text-[10px] text-zinc-500 italic border-b">
           Note: If service wise rate is available then service rate will display and applied, if not then supplier rate will display and applied.
        </div>
        <div className="p-4 flex flex-wrap gap-4 items-center bg-white border-b">
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Supplier</option></select>
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Sending Service</option></select>
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Country</option></select>
           <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Select Operator</option></select>
           <button className="px-8 py-1 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest">Search</button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left text-[10px] border-collapse">
              <thead className="bg-[#f2f2f2] dark:bg-zinc-900 border-b border-zinc-200 text-blue-500 font-bold uppercase">
                 <tr>
                    <th className="px-4 py-2 border-r">Supplier <span className="text-zinc-300 shrink-0">↕</span></th>
                    <th className="px-4 py-2 border-r">Service <span className="text-zinc-300 shrink-0">↕</span></th>
                    <th className="px-4 py-2 border-r">Country <span className="text-zinc-300 shrink-0">↕</span></th>
                    <th className="px-4 py-2 border-r">Operator <span className="text-zinc-300 shrink-0">↕</span></th>
                    <th className="px-4 py-2">Rate</th>
                 </tr>
              </thead>
              <tbody className="bg-white dark:bg-zinc-950 divide-y divide-zinc-100 dark:divide-zinc-800">
                 <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-zinc-400 italic">Total 0 records found</td>
                 </tr>
              </tbody>
           </table>
        </div>
        <div className="p-3 bg-zinc-50 border-t flex items-center justify-between">
           <div className="bg-red-600 text-white text-[9px] px-4 py-1 rounded font-black uppercase tracking-widest cursor-pointer shadow">Export</div>
           <button className="px-10 py-1.5 bg-red-600 text-white rounded text-[10px] font-bold uppercase tracking-widest shadow">Back</button>
        </div>
      </div>
    </div>
  );
}

function SupplierAutoRateSheetForm() {
  return (
    <div className="p-4 space-y-4">
       <div className="bg-white border border-zinc-200 rounded">
          <div className="p-2 border-b border-zinc-200 bg-white/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
             Supplier Auto Rate Sheet Report
          </div>
          <div className="p-3 border-b flex items-center gap-3">
             <Search className="w-4 h-4 text-red-500" />
          </div>
          <div className="p-0 overflow-x-auto">
             <div className="p-2 bg-[#f9f9f9] border-b text-[10px] font-bold text-blue-400 underline underline-offset-4 cursor-pointer">
                List of Process File
             </div>
             <table className="w-full text-left text-[10px] border-collapse bg-white divide-y">
                <thead className="bg-[#f2f2f2] border-b border-zinc-200 text-blue-500 font-bold uppercase">
                   <tr>
                      <th className="px-3 py-2 border-r">Sr.No.</th>
                      <th className="px-3 py-2 border-r">Supplier Rate <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">File Name <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">File Status <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Total Record <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Updated Record <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Failed Record <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Time <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Remarks</th>
                      <th className="px-3 py-2">Action</th>
                   </tr>
                </thead>
                <tbody>
                   <tr><td colSpan={10} className="px-4 py-6 text-center text-zinc-400 italic">No records found</td></tr>
                </tbody>
             </table>
          </div>
          <div className="p-2 border-t flex items-center justify-between text-[9px] bg-zinc-50 font-mono">
             <div className="flex gap-2">
                <button className="bg-red-500 text-white px-2 py-0.5 rounded font-black tracking-widest">CSV</button>
                <span className="text-zinc-400 py-0.5">Total 0 Records Found</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="flex border rounded overflow-hidden">
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&lt;&lt;</button>
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&lt;</button>
                 <span className="px-2 bg-blue-500 text-white font-bold">1</span>
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&gt;</button>
                 <button className="px-1 bg-zinc-100/50" disabled>&gt;&gt;</button>
               </div>
               <select className="border rounded px-1"><option>10</option></select>
             </div>
          </div>
          <div className="p-3 border-t bg-zinc-100/30">
             <button className="px-10 py-1 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow">Back</button>
          </div>
       </div>
    </div>
  );
}

function NotificationReportForm() {
  return (
    <div className="p-4 space-y-4">
       <div className="bg-white border border-zinc-200 rounded">
          <div className="p-2 border-b border-zinc-200 bg-white/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Email Notification Report
          </div>
          <div className="p-3 border-b flex items-center gap-3">
             <Search className="w-4 h-4 text-red-500" />
          </div>
          <div className="p-0 overflow-x-auto">
             <div className="p-2 bg-[#f9f9f9] border-b text-[10px] font-bold text-blue-400 underline underline-offset-4 cursor-pointer">
                List of Notification
             </div>
             <table className="w-full text-left text-[10px] border-collapse bg-white divide-y">
                <thead className="bg-[#f2f2f2] border-b border-zinc-200 text-blue-500 font-bold uppercase">
                   <tr>
                      <th className="px-3 py-2 border-r">Sr. No.</th>
                      <th className="px-3 py-2 border-r">User Id <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">From Address <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">To Address <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">subject <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">content</th>
                      <th className="px-3 py-2 border-r">Status</th>
                      <th className="px-3 py-2 border-r">Generated Time <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Modified Time <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2 border-r">Remarks</th>
                      <th className="px-3 py-2">Actions</th>
                   </tr>
                </thead>
                <tbody>
                   <tr><td colSpan={11} className="px-4 py-8 text-center text-zinc-400 italic">No records found</td></tr>
                </tbody>
             </table>
          </div>
          <div className="p-2 border-t flex items-center justify-between text-[9px] bg-zinc-50 font-mono">
             <span className="text-zinc-400">Total 0 records found</span>
             <div className="flex items-center gap-2">
               <div className="flex border rounded overflow-hidden">
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&lt;&lt;</button>
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&lt;</button>
                 <span className="px-2 bg-blue-500 text-white font-bold">1</span>
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&gt;</button>
                 <button className="px-1 bg-zinc-100/50" disabled>&gt;&gt;</button>
               </div>
               <select className="border rounded px-1"><option>500</option></select>
             </div>
          </div>
       </div>
    </div>
  );
}

function TopUsersReportForm() {
  return (
    <div className="p-4 space-y-4">
       <div className="bg-white border border-zinc-200 rounded">
          <div className="p-2 border-b border-zinc-200 bg-white/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
             Top Users
          </div>
          <div className="p-4 space-y-4">
             <div className="flex flex-wrap gap-x-8 gap-y-4 items-center">
                <FormRow label="Type" required inline labelSize="min-w-0">
                   <select className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs min-w-[200px]"><option>Today</option></select>
                </FormRow>
                <FormRow label="From Date" inline labelSize="min-w-0">
                   <input type="date" className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs" />
                </FormRow>
                <FormRow label="To Date" inline labelSize="min-w-0">
                   <input type="date" className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs" />
                </FormRow>
                <FormRow label="User Limit" inline labelSize="min-w-0">
                   <input type="number" defaultValue={10} className="px-3 py-1 bg-white border border-zinc-300 rounded text-xs w-24" />
                </FormRow>
                <button className="px-8 py-1.5 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow">Search</button>
             </div>
          </div>
          <div className="p-0 overflow-x-auto">
             <div className="p-2 bg-[#f9f9f9] border-t border-b text-[10px] font-bold text-blue-400 underline underline-offset-4 cursor-pointer">
                Top Users
             </div>
             <table className="w-full text-left text-[10px] border-collapse bg-white divide-y">
                <thead className="bg-[#f2f2f2] border-b border-zinc-200 text-blue-500 font-bold uppercase">
                   <tr>
                      <th className="px-3 py-2 border-r">Sr.No</th>
                      <th className="px-3 py-2 border-r">User Name <span className="text-zinc-300">↕</span></th>
                      <th className="px-3 py-2">Total Usage</th>
                   </tr>
                </thead>
                <tbody>
                   <tr><td colSpan={3} className="px-4 py-10 text-center text-zinc-400 italic">No records found</td></tr>
                </tbody>
             </table>
          </div>
          <div className="p-2 border-t flex items-center justify-between text-[9px] bg-zinc-50 font-mono">
             <div className="flex gap-2">
                <button className="bg-red-500 text-white px-2 py-0.5 rounded font-black tracking-widest shadow">CSV</button>
                <button className="bg-red-500 text-white px-2 py-0.5 rounded font-black tracking-widest shadow">Excel</button>
                <span className="text-zinc-400 py-0.5 ml-2">Total 0 Records Found</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="flex border rounded overflow-hidden">
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&lt;&lt;</button>
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&lt;</button>
                 <span className="px-2 bg-blue-500 text-white font-bold">1</span>
                 <button className="px-1 border-r bg-zinc-100/50" disabled>&gt;</button>
                 <button className="px-1 bg-zinc-100/50" disabled>&gt;&gt;</button>
               </div>
               <select className="border rounded px-1"><option>500</option></select>
             </div>
          </div>
          <div className="p-3 border-t bg-zinc-100/30">
             <button className="px-10 py-1 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-widest shadow">Back</button>
          </div>
       </div>
    </div>
  );
}

function MessageLogForm({ title }: { title: string }) {
  const isClient = title.includes('Client');
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">Search Information</h4>
        <div className="flex gap-2">
          <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 flex items-center gap-1.5">
            <Search className="w-3 h-3" /> Search
          </button>
          <button className="px-5 py-1.5 bg-[#5cb85c] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-green-600 flex items-center gap-1.5">
            <Download className="w-3 h-3" /> Export
          </button>
          <button className="px-5 py-1.5 bg-zinc-500 text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-zinc-600 flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
        <div className="space-y-4">
          <FormRow label={isClient ? "Select User" : "Select Supplier"}>
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Select</option>
            </select>
          </FormRow>
          <FormRow label="Select Plan">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Select</option>
            </select>
          </FormRow>
          <FormRow label="Sending Service">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Select</option>
            </select>
          </FormRow>
          <FormRow label="Mobile No">
             <div className="flex gap-1">
               <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                 <option>equals</option>
                 <option>contains</option>
                 <option>starts with</option>
               </select>
               <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
             </div>
          </FormRow>
          <FormRow label="Message">
             <div className="flex gap-1">
               <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                 <option>equals</option>
                 <option>contains</option>
               </select>
               <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
             </div>
          </FormRow>
          <FormRow label="Status">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Any</option>
              <option>Delivered</option>
              <option>Failed</option>
              <option>Sent</option>
            </select>
          </FormRow>
        </div>

        <div className="space-y-4">
          <FormRow label="Sender ID">
             <div className="flex gap-1">
               <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                 <option>equals</option>
                 <option>contains</option>
               </select>
               <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
             </div>
          </FormRow>
          <FormRow label="Message ID">
             <div className="flex gap-1">
                <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                   <option>equals</option>
                </select>
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
             </div>
          </FormRow>
          <FormRow label="Client Msg Id">
             <div className="flex gap-1">
                <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                   <option>equals</option>
                </select>
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
             </div>
          </FormRow>
          <FormRow label="Supplier Msg Id">
             <div className="flex gap-1">
                <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                   <option>equals</option>
                </select>
                <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
             </div>
          </FormRow>
          <FormRow label="Message Type">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Any</option>
              <option>GSM</option>
              <option>Unicode</option>
              <option>Flash</option>
            </select>
          </FormRow>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <FormRow label="From Queue Date" required>
          <div className="flex gap-1">
            <input type="datetime-local" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04T00:00" />
          </div>
        </FormRow>
        <FormRow label="To Queue Date" required>
          <div className="flex gap-1">
            <input type="datetime-local" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04T23:59" />
          </div>
        </FormRow>
      </div>

      <div className="flex justify-end pt-4 italic text-[10px] text-zinc-400">
        * Maximum 31 days data can be searched at a time.
      </div>
    </div>
  );
}

function SummaryReportForm({ title }: { title: string }) {
  const isClient = title.includes('Client');
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">Search Information</h4>
        <div className="flex gap-2">
          <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 flex items-center gap-1.5">
            <Search className="w-3 h-3" /> Search
          </button>
          <button className="px-5 py-1.5 bg-[#5cb85c] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-green-600 flex items-center gap-1.5">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
        <div className="space-y-4">
          <FormRow label={isClient ? "Select User" : "Select Supplier"}>
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Select</option>
            </select>
          </FormRow>
          <FormRow label="Summary Type">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Date Wise</option>
              <option>Country Wise</option>
              <option>Sender ID Wise</option>
            </select>
          </FormRow>
          <FormRow label="Mobile Number">
            <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
          </FormRow>
        </div>
        <div className="space-y-4">
          <FormRow label="Message">
            <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
          </FormRow>
          <FormRow label="Sender ID">
            <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
          </FormRow>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <FormRow label="From Date" required>
          <input type="date" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04" />
        </FormRow>
        <FormRow label="To Date" required>
          <input type="date" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04" />
        </FormRow>
      </div>
    </div>
  );
}

function CDRSummaryForm() {
  return (
    <div className="p-6 space-y-6">
       <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">CDR Reports</h4>
          <div className="flex gap-2">
            <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 flex items-center gap-1.5">
               <Search className="w-3 h-3" /> Search
            </button>
            <button className="px-2 py-1.5 bg-green-500 text-white rounded shadow hover:bg-green-600 transition-all font-bold text-[10px] px-4">
              <Download className="w-3.5 h-3.5 inline mr-1" /> CSV
            </button>
          </div>
       </div>
       <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden bg-white dark:bg-zinc-950">
          <table className="w-full text-left text-[11px]">
             <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">#</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">User</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Attempts</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Delivered</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Failed</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Ratio</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                   <td colSpan={6} className="px-4 py-8 text-center text-zinc-400 italic font-medium">No results found. Adjust your search filters.</td>
                </tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}

function SuccessSummaryForm({ title }: { title: string }) {
  const isClient = title.includes('Client');
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">Search Criteria</h4>
        <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 flex items-center gap-1.5">
          <Search className="w-3 h-3" /> Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6">
        <div className="space-y-4">
          <FormRow label={isClient ? "Select User" : "Select Supplier"}>
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Select</option>
            </select>
          </FormRow>
          <FormRow label="Select Report Type">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Date Wise</option>
              <option>User Wise</option>
            </select>
          </FormRow>
        </div>
        <div className="space-y-4">
          <FormRow label="Select Value Type">
            <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
              <option>Percentage (%)</option>
              <option>Absolute Count</option>
            </select>
          </FormRow>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <FormRow label="From Date" required>
          <input type="date" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04" />
        </FormRow>
        <FormRow label="To Date" required>
          <input type="date" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04" />
        </FormRow>
      </div>
    </div>
  );
}

function RoutingFailSummaryForm() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">Routing Fail Analysis</h4>
        <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 flex items-center gap-1.5">
          <Search className="w-3 h-3" /> Search
        </button>
      </div>

      <div className="max-w-2xl space-y-4">
        <FormRow label="Select Plan">
          <select className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
            <option>Select</option>
          </select>
        </FormRow>
        <div className="grid grid-cols-2 gap-4">
          <FormRow label="From Date" required>
            <input type="date" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04" />
          </FormRow>
          <FormRow label="To Date" required>
            <input type="date" className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="2026-05-04" />
          </FormRow>
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden bg-white dark:bg-zinc-950 mt-8 shadow-sm">
          <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-zinc-500">Top Failed Routes</span>
            <button className="p-1 text-zinc-400 hover:text-zinc-600"><RotateCcw className="w-3 h-3" /></button>
          </div>
          <table className="w-full text-left text-[11px]">
             <thead className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Route</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Error Code</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Attempts</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Last Occurrence</th>
                </tr>
             </thead>
             <tbody>
                <tr><td colSpan={4} className="px-4 py-10 text-center text-zinc-400 italic">Analytical data pending execution.</td></tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}

const RAW_BILATERAL_DATA = [
  { 
    id: 1, date: '01 / 24', custInv: 'INV-C-24-001', customerMsgs: '1,250,400', customerBilling: 8450.25, 
    vendInv: 'INV-V-24-990', vendorMsgs: '980,300', vendorBilling: 6310.10,
    payableBy: 'Customer', paymentStatus: 'Paid', paymentDate: '2024-02-15', pendingAmount: 0,
    paymentAmount: 2140.15,
    fullDate: '2024-01-01'
  },
  { 
    id: 2, date: '02 / 24', custInv: 'INV-C-24-042', customerMsgs: '980,200', customerBilling: 5320.50, 
    vendInv: 'INV-V-24-102', vendorMsgs: '1,145,600', vendorBilling: 7450.80,
    payableBy: 'Vendor', paymentStatus: 'Partially Paid', paymentDate: '2024-03-20', pendingAmount: 1130.30,
    paymentAmount: 1000.00,
    fullDate: '2024-02-01'
  },
  { 
    id: 3, date: '03 / 24', custInv: 'INV-C-24-088', customerMsgs: '2,835,600', customerBilling: 18890.75, 
    vendInv: 'INV-V-24-150', vendorMsgs: '445,200', vendorBilling: 3120.40,
    payableBy: 'Customer', paymentStatus: 'Unpaid', paymentDate: '-', pendingAmount: 15770.35,
    paymentAmount: 0,
    fullDate: '2024-03-01'
  },
  { 
    id: 4, date: '04 / 24', custInv: 'INV-C-24-115', customerMsgs: '750,800', customerBilling: 4210.30, 
    vendInv: 'INV-V-24-210', vendorMsgs: '1,850,400', vendorBilling: 9560.90,
    payableBy: 'Vendor', paymentStatus: 'Paid', paymentDate: '2024-05-10', pendingAmount: 0,
    paymentAmount: 5350.60,
    fullDate: '2024-04-01'
  },
  { 
    id: 5, date: '05 / 24', custInv: 'INV-C-24-150', customerMsgs: '1,950,400', customerBilling: 12640.20, 
    vendInv: 'INV-V-24-305', vendorMsgs: '1,420,100', vendorBilling: 8430.20,
    payableBy: 'Customer', paymentStatus: 'Processing', paymentDate: '-', pendingAmount: 4210.00,
    paymentAmount: 0,
    fullDate: '2024-05-01'
  },
];

function BilateralReportForm({ onBack }: { onBack?: () => void }) {
    const [searching, setSearching] = React.useState(false);
    const [showResults, setShowResults] = React.useState(false);
    const [selectedSupplier, setSelectedSupplier] = React.useState('');
    const [fromDate, setFromDate] = React.useState('');
    const [toDate, setToDate] = React.useState('');
    const [soaStatus, setSoaStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = React.useState<string | null>(null);
    const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
    const [filterPayableBy, setFilterPayableBy] = React.useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = React.useState('');
    const { 
      ref: scrollRef, 
      onMouseDown, 
      onMouseUp, 
      onMouseLeave, 
      onMouseMove, 
      isDragging 
    } = useDragScroll();

    const handleSearch = () => {
      if (!selectedSupplier) {
        setError('Please select a Bilateral Partner to continue.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setError(null);
      setSearching(true);
      setTimeout(() => {
        setSearching(false);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    };

    const bilateralData = (() => {
      let filtered = RAW_BILATERAL_DATA.filter(item => item.paymentStatus !== 'Paid');
      
      if (fromDate) {
        filtered = filtered.filter(item => new Date(item.fullDate) >= new Date(fromDate));
      }
      if (toDate) {
        filtered = filtered.filter(item => new Date(item.fullDate) <= new Date(toDate));
      }
      
      if (filterPayableBy) {
        filtered = filtered.filter(item => item.payableBy === filterPayableBy);
      }
      if (filterPaymentStatus) {
        filtered = filtered.filter(item => item.paymentStatus === filterPaymentStatus);
      }

      return filtered;
    })();

    const toggleRow = (idx: number) => {
      if (selectedRows.includes(idx)) {
        setSelectedRows(selectedRows.filter(i => i !== idx));
      } else {
        setSelectedRows([...selectedRows, idx]);
      }
    };

    const toggleAll = () => {
      if (selectedRows.length === bilateralData.length) {
        setSelectedRows([]);
      } else {
        setSelectedRows(bilateralData.map((_, i) => i));
      }
    };

    const totalCustomer = bilateralData.reduce((acc, curr) => acc + curr.customerBilling, 0);
    const totalVendor = bilateralData.reduce((acc, curr) => acc + curr.vendorBilling, 0);
    const netBalance = totalCustomer - totalVendor;
    const threshold = 1000;
    const isOverThreshold = Math.abs(netBalance) > threshold || totalCustomer > threshold || totalVendor > threshold;

    const handleSendSOA = () => {
      if (selectedRows.length === 0) {
        alert('Please select at least one month to send SOA.');
        return;
      }
      setSoaStatus('sending');
      setTimeout(() => {
        setSoaStatus('sent');
        setTimeout(() => setSoaStatus('idle'), 3000);
      }, 2000);
    };

    if (showResults) {
      return (
        <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Notification Header */}
           {isOverThreshold && (
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between shadow-sm"
             >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600">
                     <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400">Credit Limit Alpha Notification</h5>
                    <p className="text-[10px] text-amber-600/80 font-bold uppercase tracking-tighter">Bilateral billing reached ${threshold}+. Sales Department has been notified via Email.</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[9px] font-black bg-amber-500 text-white px-2 py-0.5 rounded uppercase">Urgent Action</span>
               </div>
             </motion.div>
           )}

           {/* Metrics Grid */}
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-sm group hover:border-blue-500/50 transition-all">
                 <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Customer Revenue (Inbound)</p>
                 <div className="flex items-end justify-between">
                    <h3 className="text-xl font-black text-emerald-600">${totalCustomer.toFixed(2)}</h3>
                    <TrendingUp className="w-5 h-5 text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <p className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Total SMS: 767,400</p>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700 shadow-sm group hover:border-red-500/50 transition-all">
                 <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Vendor Cost (Outbound)</p>
                 <div className="flex items-end justify-between">
                    <h3 className="text-xl font-black text-red-500">${totalVendor.toFixed(2)}</h3>
                    <TrendingDown className="w-5 h-5 text-red-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <p className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Total SMS: 620,600</p>
              </div>
              <div className="bg-[#428bca]/5 p-5 rounded-2xl border border-[#428bca]/20 shadow-sm col-span-1 md:col-span-2 relative overflow-hidden">
                 <div className="relative z-10">
                   <p className="text-[9px] font-black text-[#428bca] uppercase tracking-widest mb-1">Net Bilateral Settlement Assessment</p>
                   <div className="flex items-end gap-3">
                      <h3 className={cn("text-2xl font-black italic", netBalance >= 0 ? "text-emerald-600" : "text-red-500")}>
                        {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
                      </h3>
                       <div className="mb-1 text-[10px] font-bold uppercase text-[#428bca] flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                             <span className="opacity-50">Payable to:</span> 
                             <span className="font-black text-[11px]">{netBalance >= 0 ? 'Teleoss (Admin)' : (selectedSupplier || 'Partner')}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                             <span className="opacity-50">Settlement Action:</span> 
                             <span className="font-black text-zinc-500">
                                {netBalance >= 0 
                                  ? `${selectedSupplier || 'Partner'} pays difference to Admin` 
                                  : `Admin pays difference to ${selectedSupplier || 'Partner'}`
                                }
                             </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[8px] opacity-60">
                             <span className="italic">Based on netting of Sales ($ {totalCustomer.toFixed(2)}) vs Purchase ($ {totalVendor.toFixed(2)})</span>
                          </div>
                       </div>
                   </div>
                 </div>
                 <ArrowRightLeft className="absolute -right-4 -bottom-4 w-24 h-24 text-[#428bca]/5" />
              </div>
           </div>

           {/* Results Table */}
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                       <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-700 dark:text-zinc-200">Monthly Netting Ledger Log</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <button 
                     onClick={handleSendSOA}
                     disabled={soaStatus !== 'idle'}
                     className={cn(
                       "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                       soaStatus === 'idle' && "bg-[#428bca] text-white hover:bg-blue-600",
                       soaStatus === 'sending' && "bg-zinc-200 text-zinc-500 cursor-wait",
                       soaStatus === 'sent' && "bg-emerald-500 text-white"
                     )}
                   >
                     {soaStatus === 'idle' && <><Mail className="w-3.5 h-3.5" /> Send SOA {selectedRows.length > 0 && `(${selectedRows.length})`}</>}
                     {soaStatus === 'sending' && <RotateCcw className="w-3.5 h-3.5 animate-spin" />}
                     {soaStatus === 'sent' && <><CheckCircle className="w-3.5 h-3.5" /> SOA Sent Successfully</>}
                   </button>
                   <button className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                      <Download className="w-4 h-4 text-zinc-500" />
                   </button>
                 </div>
              </div>
              <div 
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onMouseMove={onMouseMove}
                className={cn(
                  "overflow-x-auto select-none cursor-grab active:cursor-grabbing custom-scrollbar",
                  isDragging && "cursor-grabbing"
                )}
              >
                 <table className="w-full text-left text-[11px] border-collapse min-w-[1400px]">
                    <thead>
                       <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                          <th className="px-6 py-4 w-10">
                             <div className="flex items-center justify-center">
                                <input 
                                  type="checkbox" 
                                  checked={selectedRows.length === bilateralData.length && bilateralData.length > 0}
                                  onChange={toggleAll}
                                  className="w-4 h-4 rounded border-zinc-300 text-[#428bca] focus:ring-[#428bca]"
                                />
                             </div>
                          </th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Transaction (MM / YY)</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Customer Invoice number</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Customer MSGS</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">CUSTOMER BILLING (SALES)</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Vendor Invoice number</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Vendor MSGS</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Vendor BILLING (SALES)</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Monthly Netting</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">
                             <div className="flex flex-col gap-1.5">
                                <span>Payable By</span>
                                <select 
                                  value={filterPayableBy}
                                  onChange={(e) => setFilterPayableBy(e.target.value)}
                                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1 py-0.5 text-[9px] font-bold outline-none ring-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px] bg-[right_0.3rem_center] bg-no-repeat pr-4 w-full"
                                >
                                   <option value="">All</option>
                                   <option value="Customer">Customer</option>
                                   <option value="Vendor">Vendor</option>
                                </select>
                             </div>
                          </th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-center">
                             <div className="flex flex-col gap-1.5 items-center">
                                <span>Payment Status</span>
                                <select 
                                  value={filterPaymentStatus}
                                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                                  className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1 py-0.5 text-[9px] font-bold outline-none ring-0 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:8px] bg-[right_0.3rem_center] bg-no-repeat pr-4 w-full"
                                >
                                   <option value="">Any</option>
                                   <option value="Unpaid">Unpaid</option>
                                   <option value="Partially Paid">Partially Paid</option>
                                   <option value="Processing">Processing</option>
                                </select>
                             </div>
                          </th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Payment Amount</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Payment Date</th>
                          <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Pending Amount</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                       {bilateralData.map((row, idx) => (
                         <tr key={idx} className={cn(
                            "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group",
                            selectedRows.includes(idx) && "bg-blue-50/50 dark:bg-blue-900/10"
                         )}>
                            <td className="px-6 py-4 text-center">
                               <input 
                                 type="checkbox" 
                                 checked={selectedRows.includes(idx)}
                                 onChange={() => toggleRow(idx)}
                                 className="w-4 h-4 rounded border-zinc-300 text-[#428bca] focus:ring-[#428bca]"
                               />
                            </td>
                            <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap">{row.date}</td>
                            <td className="px-6 py-4 font-mono text-zinc-500 whitespace-nowrap">{row.custInv}</td>
                            <td className="px-6 py-4 font-mono text-[#428bca] whitespace-nowrap">{row.customerMsgs}</td>
                            <td className="px-6 py-4 font-black text-emerald-600 whitespace-nowrap">${row.customerBilling.toFixed(2)}</td>
                            <td className="px-6 py-4 font-mono text-zinc-500 whitespace-nowrap">{row.vendInv}</td>
                            <td className="px-6 py-4 font-mono text-zinc-500 whitespace-nowrap">{row.vendorMsgs}</td>
                            <td className="px-6 py-4 font-black text-red-500 whitespace-nowrap">${row.vendorBilling.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <span className={cn(
                                 "px-3 py-1 rounded-full text-[10px] font-black",
                                 (row.customerBilling - row.vendorBilling) >= 0 
                                   ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" 
                                   : "bg-red-50 text-red-600 dark:bg-red-900/20"
                               )}>
                                 ${(row.customerBilling - row.vendorBilling).toFixed(2)}
                               </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                               <div className="flex flex-col">
                                  <span className={cn(
                                    "text-[10px] font-black uppercase",
                                    row.payableBy === 'Customer' ? "text-emerald-600" : "text-red-500"
                                  )}>
                                    {row.payableBy}
                                  </span>
                                  <span className="text-[8px] text-zinc-400 font-bold uppercase">{row.payableBy === 'Customer' ? '(Us)' : '(Supplier)'}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-center whitespace-nowrap">
                               <span className={cn(
                                 "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter",
                                 row.paymentStatus === 'Paid' ? "bg-emerald-100 text-emerald-700" :
                                 row.paymentStatus === 'Partially Paid' ? "bg-amber-100 text-amber-700" :
                                 row.paymentStatus === 'Processing' ? "bg-blue-100 text-blue-700" :
                                 "bg-red-100 text-red-700"
                               )}>
                                 {row.paymentStatus}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-right font-black text-blue-600 whitespace-nowrap">
                               ${row.paymentAmount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-zinc-400 text-[10px] whitespace-nowrap">{row.paymentDate}</td>
                            <td className="px-6 py-4 text-right font-black text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
                               ${row.pendingAmount.toFixed(2)}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                    <tfoot className="bg-zinc-50 dark:bg-zinc-800/50 font-black">
                       <tr>
                          <td className="px-6 py-4">-</td>
                          <td className="px-6 py-4 uppercase tracking-tighter">Total Period Performance</td>
                          <td colSpan={2} className="px-6 py-4">-</td>
                          <td className="px-6 py-4 text-emerald-600 text-sm">${totalCustomer.toFixed(2)}</td>
                          <td colSpan={2} className="px-6 py-4">-</td>
                          <td className="px-6 py-4 text-red-600 text-sm">${totalVendor.toFixed(2)}</td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col items-start border-l-2 pl-4 border-zinc-200 dark:border-zinc-700">
                                <span className={cn("text-sm", netBalance >= 0 ? "text-emerald-600" : "text-red-500")}>
                                   ${Math.abs(netBalance).toFixed(2)} {netBalance >= 0 ? 'CR' : 'DR'}
                                </span>
                                <span className="text-[8px] uppercase opacity-40">Cumulative Netting</span>
                             </div>
                          </td>
                          <td colSpan={5} className="px-6 py-4 text-right tracking-widest opacity-30 text-[9px]">
                             TELEOSS SETTLEMENT AUDIT ENGINE v2.4.5
                          </td>
                       </tr>
                    </tfoot>
                 </table>
              </div>
           </div>

           <div className="flex justify-center">
              <button 
                onClick={() => setShowResults(false)}
                className="px-12 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-200 transition-all border border-zinc-200 dark:border-zinc-700 shadow-inner"
              >
                Reset Report & Search Again
              </button>
           </div>
        </div>
      );
    }

    return (
      <div className="p-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <ArrowRightLeft className="w-32 h-32 rotate-12" />
           </div>

            <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-8 relative z-10">
              <div className="flex items-center gap-4">
                 <button 
                   onClick={onBack}
                   className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors border border-zinc-200 dark:border-zinc-700 shadow-sm"
                   title="Go back to list"
                 >
                    <RotateCcw className="w-5 h-5" />
                 </button>
                 <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-xl shadow-brand-500/20">
                    <ArrowRightLeft className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-base font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-widest leading-none mb-1">Bilateral Settlement Analysis</h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Unified Ledger for Partners acting as both Customer & Vendor</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 text-[10px] font-bold uppercase"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}
                <button 
                  onClick={handleSearch}
                  disabled={searching}
                  className="px-10 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2 group/btn disabled:opacity-50 disabled:cursor-wait"
                >
                   {searching ? (
                     <RotateCcw className="w-4 h-4 animate-spin" />
                   ) : (
                     <><Search className="w-4 h-4 group-hover/btn:scale-125 transition-transform" /> Generate Ledger</>
                   )}
                </button>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1 flex items-center gap-2">
                    <Users className="w-3 h-3 text-[#428bca]" /> Select Bilateral Partner <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={selectedSupplier}
                    onChange={(e) => setSelectedSupplier(e.target.value)}
                    className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1.2rem_center] bg-no-repeat transition-all"
                  >
                    <option value="">Choose a Partner</option>
                    <option value="ABC Telecom Bilateral">ABC Telecom Bilateral</option>
                    <option value="Global SMS Bilateral">Global SMS Bilateral</option>
                    <option value="Teleoss Tech Partner">Teleoss Tech Partner</option>
                    <option value="Breelink Bilateral">Breelink Bilateral</option>
                  </select>
                </div>

                <div className="p-6 bg-blue-50/50 dark:bg-zinc-800/50 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                   <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                         <Info className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                         <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Bilateral Rule Engine</h6>
                         <p className="text-[9px] text-zinc-500 leading-relaxed font-medium">Bilateral settlement subtracts the purchase amounts from the revenue amounts. Netting is done against a single partner identity regardless of account separation.</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-[#428bca]" /> From Date
                    </label>
                    <input 
                      type="date" 
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1 flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-[#428bca]" /> To Date
                    </label>
                    <input 
                      type="date" 
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono" 
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl">
                   <p className="text-[9px] text-amber-600 font-bold uppercase leading-tight italic">
                     Note: If dates are left blank, the report will be generated from the contract start date to the current date.
                   </p>
                </div>
              </div>
           </div>

           <div className="flex justify-center pt-8 border-t border-zinc-100 dark:border-zinc-800 italic text-[10px] text-zinc-400 font-medium">
             TeleOSS Bilateral Engine v2.4.5 • Verified Settlement Algorithms Active
           </div>
        </div>
      </div>
    );
}

function AuditLogForm({ title }: { title: string }) {
    const isInbound = title.toLowerCase().includes('inbound');
    return (
      <div className="p-6 space-y-8">
         <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">
               {isInbound ? 'Inbound' : 'Outbound'} System Audit filters
            </h4>
            <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all flex items-center gap-2">
               <Search className="w-3.5 h-3.5" /> Filter Log
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
               {!isInbound && (
                 <FormRow label="Sending Service">
                    <select className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs"><option>Select</option></select>
                 </FormRow>
               )}
               {isInbound ? (
                 <FormRow label="Select Plan">
                    <select className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs"><option>Select</option></select>
                 </FormRow>
               ) : (
                 <FormRow label="Select Supplier">
                    <select className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs"><option>Select</option></select>
                 </FormRow>
               )}
               <FormRow label="Select User">
                  <select className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs"><option>Select</option></select>
               </FormRow>
               <FormRow label="Bind Mode">
                  <select className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs"><option>All</option></select>
               </FormRow>
            </div>
            <div className="space-y-4">
               <FormRow label="Apikey">
                  <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs" />
               </FormRow>
               <FormRow label="Command Id">
                  <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs" />
               </FormRow>
               <FormRow label="Request Type">
                  <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs" />
               </FormRow>
            </div>
            <div className="space-y-4">
               <FormRow label="Response Type">
                  <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs" />
               </FormRow>
               <FormRow label="Error Code">
                  <input type="text" className="w-full px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs" />
               </FormRow>
               <div className="grid grid-cols-2 gap-2">
                  <FormRow label="From" labelSize="min-w-[50px] font-mono"><input type="date" className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-[10px]" /></FormRow>
                  <FormRow label="To" labelSize="min-w-[30px] font-mono"><input type="date" className="w-full px-2 py-1 bg-zinc-50 border border-zinc-200 rounded text-[10px]" /></FormRow>
               </div>
            </div>
         </div>
      </div>
    );
}

function TPSDetailForm({ title }: { title: string }) {
    const isInbound = title.toLowerCase().includes('inbound');
    return (
      <div className="p-8 space-y-10">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-500/10 rounded flex items-center justify-center text-blue-500">
                <Search className="w-4 h-4" />
             </div>
             <div>
                <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-tight">
                  {isInbound ? 'Inbound' : 'Outbound'} TPS Performance Analysis
                </h4>
                <p className="text-[10px] text-zinc-400 font-medium">Real-time throughput analysis and bottleneck identification</p>
             </div>
          </div>
          <button className="px-10 py-2.5 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-xl hover:bg-blue-600 hover:-translate-y-px active:translate-y-0 transition-all">Generate Report</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
           <div className="space-y-6">
              <FormRow label={isInbound ? "Select User" : "Select Supplier"} required>
                 <select className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-4 focus:ring-blue-500/10">
                    <option>Select</option>
                 </select>
              </FormRow>
              {!isInbound && (
                <FormRow label="Sending Service">
                   <select className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-4 focus:ring-blue-500/10">
                      <option>Select Service</option>
                   </select>
                </FormRow>
              )}
              <div className="grid grid-cols-2 gap-6">
                 <FormRow label="From Date" required inline={false}>
                    <input type="datetime-local" className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" />
                 </FormRow>
                 <FormRow label="To Date" required inline={false}>
                    <input type="datetime-local" className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" />
                 </FormRow>
              </div>
           </div>
           <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <FormRow label="Min TPS" inline={false}>
                    <input type="number" defaultValue={0} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" />
                 </FormRow>
                 <FormRow label="Max TPS" inline={false}>
                    <input type="number" defaultValue={100} className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs" />
                 </FormRow>
              </div>
              <FormRow label="Interval">
                 <select className="w-full px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs">
                    <option>1 Minute</option>
                    <option>5 Minutes</option>
                    <option>1 Hour</option>
                 </select>
              </FormRow>
           </div>
        </div>
      </div>
    );
}

function DLRResendForm() {
  return (
    <div className="p-6 space-y-6">
       <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">DLR Re-Processing Tool</h4>
          <div className="flex gap-2">
            <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600">Search</button>
            <button className="px-5 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-emerald-600">Re-Send Selected</button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-50 dark:bg-zinc-800/30 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <FormRow label="User" labelSize="min-w-[80px]">
             <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>All</option></select>
          </FormRow>
          <FormRow label="Source" labelSize="min-w-[80px]">
             <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>API</option><option>SMPP</option></select>
          </FormRow>
          <div className="flex gap-2">
             <input type="date" className="flex-1 px-2 py-1.5 border border-zinc-200 rounded text-[10px]" />
             <input type="date" className="flex-1 px-2 py-1.5 border border-zinc-200 rounded text-[10px]" />
          </div>
       </div>

       <div className="mt-4 border border-zinc-200 dark:border-zinc-800 rounded-sm overflow-hidden bg-white dark:bg-zinc-950">
          <table className="w-full text-left text-[11px]">
             <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                   <th className="px-4 py-2 w-10"><input type="checkbox" /></th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Request ID</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">User</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Total Count</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Success</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Failure</th>
                   <th className="px-4 py-2 font-bold text-zinc-600 dark:text-zinc-400">Action</th>
                </tr>
             </thead>
             <tbody>
                <tr><td colSpan={7} className="px-4 py-10 text-center text-zinc-400 italic">No DLR re-send requests for current selection.</td></tr>
             </tbody>
          </table>
       </div>
    </div>
  );
}

function CustomizedDLRForm() {
  return (
    <div className="p-6 space-y-6">
       <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l-2 border-red-500 pl-2">Custom Report Generation</h4>
          <button className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 shadow-lg">Download File</button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
             <FormRow label="User" inline={false} labelSize="text-left">
                <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>Select</option></select>
             </FormRow>
             <FormRow label="Plan" inline={false} labelSize="text-left">
                <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>Select</option></select>
             </FormRow>
          </div>
          <div className="space-y-4">
             <FormRow label="Supplier" inline={false} labelSize="text-left">
                <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>Select</option></select>
             </FormRow>
             <FormRow label="Service" inline={false} labelSize="text-left">
                <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>Select</option></select>
             </FormRow>
          </div>
          <div className="space-y-4">
             <FormRow label="Status" inline={false} labelSize="text-left">
                <select className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs"><option>All</option></select>
             </FormRow>
             <FormRow label="From" inline={false} labelSize="text-left">
                <input type="date" className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs" />
             </FormRow>
          </div>
          <div className="space-y-4">
             <FormRow label="To" inline={false} labelSize="text-left">
                <input type="date" className="w-full px-3 py-1.5 border border-zinc-200 rounded text-xs" />
             </FormRow>
          </div>
       </div>

       <div className="mt-8 border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/20 p-4 rounded text-[10px] text-zinc-500 font-medium">
          Note: This tool allows generation of large volume DLR datasets into localized downloadable archives. 
          Please ensure filters are specific to avoid timeouts.
       </div>
    </div>
  );
}

function NegativeMarginReportForm() {
  const [searching, setSearching] = React.useState(false);
  const [showResults, setShowResults] = React.useState(false);
  const [filters, setFilters] = React.useState({
    customer: '',
    vendor: '',
    destination: '',
    fromDate: '',
    toDate: ''
  });

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      setShowResults(true);
    }, 1200);
  };

  const mockLossData = [
    { 
      id: 1, 
      country: 'Afghanistan', 
      operator: 'Roshan', 
      mccmnc: '41220', 
      volume: 45200, 
      custRate: 0.1250, 
      vendRate: 0.1480, 
      client: 'Alpha Global', 
      supplier: 'GlobalConnect',
      loss: -1039.60,
      lossPercent: -18.4
    },
    { 
      id: 2, 
      country: 'Pakistan', 
      operator: 'Jazz', 
      mccmnc: '41001', 
      volume: 125400, 
      custRate: 0.0420, 
      vendRate: 0.0485, 
      client: 'Beta SMS', 
      supplier: 'QuickRoute',
      loss: -815.10,
      lossPercent: -15.5
    },
    { 
      id: 3, 
      country: 'Nigeria', 
      operator: 'MTN', 
      mccmnc: '62130', 
      volume: 85200, 
      custRate: 0.0880, 
      vendRate: 0.0920, 
      client: 'Gamma Tech', 
      supplier: 'DirectAfrica',
      loss: -340.80,
      lossPercent: -4.5
    },
    { 
      id: 4, 
      country: 'Brazil', 
      operator: 'Vivo', 
      mccmnc: '72406', 
      volume: 58000, 
      custRate: 0.2100, 
      vendRate: 0.2350, 
      client: 'Delta Solutions', 
      supplier: 'LatamSMS',
      loss: -1450.00,
      lossPercent: -11.9
    },
    { 
      id: 5, 
      country: 'Somalia', 
      operator: 'Hormuud', 
      mccmnc: '63701', 
      volume: 12000, 
      custRate: 0.1550, 
      vendRate: 0.1980, 
      client: 'Alpha Global', 
      supplier: 'GlobalConnect',
      loss: -516.00,
      lossPercent: -27.7
    },
  ];

  if (showResults) {
    return (
      <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-500" /> Negative Margin Route Analysis
            </h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">IDENTIFIED {mockLossData.length} VULNERABLE ROUTES WITH NEGATIVE PROFITABILITY</p>
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-emerald-700 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => setShowResults(false)}
              className="px-5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 transition-all"
            >
              Modify Search
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/20">
             <p className="text-[9px] font-black text-red-600/60 uppercase tracking-widest mb-1">Total Estimated Loss</p>
             <h3 className="text-2xl font-black text-red-600">-$4,161.60</h3>
             <div className="mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">Urgent: Routing Audit Required</span>
             </div>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700">
             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Avg. Loss per Route</p>
             <h3 className="text-2xl font-black text-zinc-700 dark:text-zinc-300">15.6%</h3>
             <p className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Across {mockLossData.length} destinations</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700">
             <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Impacted Traffic Vol</p>
             <h3 className="text-2xl font-black text-zinc-700 dark:text-zinc-300">325,800</h3>
             <p className="text-[8px] text-zinc-400 font-bold uppercase mt-1">Total messages under-rated</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-[11px] border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Destination</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-center">MCCMNC</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Client Account</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Supplier / Gateway</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Volume</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Buy Rate (Vendor)</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Sell Rate (Client)</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right text-red-500">Loss Amount</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-center">Criticality</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {mockLossData.map((row) => (
                  <tr key={row.id} className="hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{row.country}</span>
                        <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-tighter">{row.operator}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-zinc-500">{row.mccmnc}</td>
                    <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap uppercase tracking-tighter text-[10px]">{row.client}</td>
                    <td className="px-6 py-4 font-bold text-zinc-600 dark:text-zinc-400 whitespace-nowrap uppercase tracking-tighter text-[10px]">{row.supplier}</td>
                    <td className="px-6 py-4 text-right font-mono text-zinc-600">{row.volume.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">${row.vendRate.toFixed(4)}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[#428bca]">${row.custRate.toFixed(4)}</td>
                    <td className="px-6 py-4 text-right font-black text-red-600 whitespace-nowrap">
                       ${row.loss.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={cn(
                         "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                         Math.abs(row.lossPercent) > 15 
                           ? "bg-red-600 text-white shadow-sm" 
                           : "bg-red-100 text-red-700"
                       )}>
                         {row.lossPercent.toFixed(1)}% LOSS
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-50 dark:bg-zinc-800/50 font-black">
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-right uppercase tracking-[0.2em] text-[10px] text-zinc-400">Aggregate Periodic Loss Value</td>
                  <td className="px-6 py-4 text-right text-red-600 text-sm font-black italic">-$4,161.60</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 p-4 rounded-xl flex items-start gap-4">
           <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
           <div className="space-y-1">
              <h5 className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Business Recommendation</h5>
              <p className="text-[9px] text-amber-600/80 font-medium leading-relaxed italic">
                Detected route rate discrepancies often occur after supplier rate updates. 
                Please cross-check the current "Supplier Rate Sheet" against active client selling plans. 
                Consider enabling "Profit-Lock Routing" to automatically block routes with negative margins.
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 pointer-events-none">
          <TrendingDown className="w-64 h-64" />
        </div>

        <div className="p-10 space-y-10 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-2xl shadow-red-500/30">
               <TrendingDown className="w-8 h-8" />
            </div>
            <div>
               <h4 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-[0.2em]">Negative Margin Discovery</h4>
               <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-tight">Audit system loss points by identifying routes where Purchase &gt; Revenue</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1 flex items-center gap-2">
                   <Users className="w-3 h-3 text-red-500" /> Target Client Group
                </label>
                <select 
                  value={filters.customer}
                  onChange={(e) => setFilters({...filters, customer: e.target.value})}
                  className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-mono appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1.2rem_center] bg-no-repeat"
                >
                  <option value="">Search All Clients</option>
                  <option value="1">Alpha Global Solutions</option>
                  <option value="2">Beta SMS Wholesale</option>
                  <option value="3">Gamma Telecom</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1 flex items-center gap-2">
                   <Smartphone className="w-3 h-3 text-red-500" /> Specific Destination
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. Afghanistan or 41220"
                    value={filters.destination}
                    onChange={(e) => setFilters({...filters, destination: e.target.value})}
                    className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all pl-12"
                  />
                  <Globe className="w-4 h-4 text-zinc-400 absolute left-5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1">Period From</label>
                    <input 
                      type="date" 
                      className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-mono" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1">Period To</label>
                    <input 
                      type="date" 
                      className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-mono" 
                    />
                  </div>
               </div>

               <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block ml-1 flex items-center gap-2">
                   <Landmark className="w-3 h-3 text-red-500" /> Supplier Filter
                </label>
                <select className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-500/10 transition-all font-mono appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1.2rem_center] bg-no-repeat">
                  <option value="">Compare All Suppliers</option>
                  <option value="1">GlobalConnect Direct</option>
                  <option value="2">QuickRoute Wholesale</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center gap-3 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                  This report will query live routing logs and price definitions to find matches where <span className="font-black text-red-600">Client Sale Price &lt; Supplier Buy Price</span>. 
                  High-volume routes are prioritized.
                </p>
             </div>
             
             <button 
               onClick={handleSearch}
               disabled={searching}
               className="w-full py-5 bg-red-600 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
             >
               {searching ? (
                 <RotateCcw className="w-5 h-5 animate-spin" />
               ) : (
                 <><Search className="w-5 h-5" /> Generate Margin Audit</>
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
