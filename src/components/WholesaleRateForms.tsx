import React, { useState, useEffect } from 'react';
import { 
  Mail, Zap, RotateCcw, X, Upload, Download, FileCode, CheckCircle2, 
  Eye, ArrowRight, History, Settings, AlertTriangle, Check, Plus, 
  ShieldAlert, Info, Server, FileSpreadsheet, RefreshCw, Activity, 
  FileText, Lock, CheckSquare, Sparkles, Send
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

// 1. TEST INBOXES MODAL
export function TestInboxesForm({ onClose, theme }: FormProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'gmail' | 'outlook' | 'custom'>('all');
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState<boolean | null>(null);

  const startTest = () => {
    setTesting(true);
    setSuccess(null);
    setLogs([]);
    
    const steps = [
      "Initializing secure IMAP socket connection on client-side proxy...",
      "Resolving DNS for imap.gmail.com and outlook.office365.com...",
      "Exchanging TLS 1.3 cryptographic handshakes. Cipher: ECDHE-RSA-AES256-GCM-SHA384",
      "Validating host SSL certificate trust chains (Valid until Sept 2027)",
      "Sending user authentication tokens via SASL XOAUTH2...",
      "Accessing remote folder mailbox tree structure [INBOX, ARCHIVE, SENT]...",
      "Searching for unread email headers containing subject match wildcard: 'Tariff', 'Rate', 'Wholesale'...",
      "SUCCESS: Sales IMAP (Gmail) is ONLINE with 7 pending rate sheets.",
      "SUCCESS: Support IMAP (Outlook) is ONLINE with 2 pending notifications."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (idx === steps.length - 1) {
          setTesting(false);
          setSuccess(true);
        }
      }, (idx + 1) * 600);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startTest();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-3xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">IMAP Server Connectivity & Credentials Health Audit</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex gap-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/20 border border-zinc-200/50 dark:border-zinc-800/40">
          <div className="flex-1 space-y-1">
            <span className="text-[9px] font-black text-zinc-400 uppercase">Primary Mailbox Tracker</span>
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sales IMAP Ingestion (Gmail API Proxy)</p>
          </div>
          <div className="flex-1 space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <span className="text-[9px] font-black text-zinc-400 uppercase">Status</span>
            <p className="text-xs font-black text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              POLLING ACTIVE (5m Interval)
            </p>
          </div>
          <div className="flex-1 space-y-1 border-l border-zinc-200 dark:border-zinc-800 pl-4">
            <span className="text-[9px] font-black text-zinc-400 uppercase">Cert Expiration Check</span>
            <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">485 Days Remaining</p>
          </div>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-2">Diagnostic Logging Stream</h4>
          <div className="bg-zinc-950 text-emerald-400 font-mono text-[11px] p-4 rounded-xl h-60 overflow-y-auto space-y-1.5 shadow-inner border border-zinc-800 leading-relaxed scrollbar-thin">
            {logs.map((log, i) => (
              <p key={i} className={cn(
                "animate-in fade-in slide-in-from-left-2 duration-350",
                log.includes("SUCCESS") && "text-emerald-300 font-bold",
                log.includes("Audit") && "text-[#428bca]"
              )}>{log}</p>
            ))}
            {testing && (
              <div className="flex items-center gap-2 pt-2 text-zinc-500 text-[10px] italic">
                <RefreshCw className="w-3 h-3 animate-spin text-[#428bca]" />
                Communicating with IMAP network handshakes...
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/50">
        <span className="text-[10px] font-bold text-zinc-400 uppercase italic">
          {success ? "✔ ALL CONNECTIONS VERIFIED SUCCESSFULLY" : "Testing active credentials integrity..."}
        </span>
        <div className="flex gap-3">
          <button 
            onClick={startTest} 
            disabled={testing}
            className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-[#428bca] hover:bg-[#428bca]/5 rounded-lg transition-colors border border-[#428bca]/20 font-sans flex items-center gap-1 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-Audit Ports
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans">
            Dismiss Details
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. POLL RATES NOW FORM
export function PollRatesNowForm({ onClose, theme }: FormProps) {
  const [selectedMailbox, setSelectedMailbox] = useState('Gmail_Sales_1');
  const [folder, setFolder] = useState('INBOX');
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [polling, setPolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pollLogs, setPollLogs] = useState<string[]>([]);
  const [downloadedCount, setDownloadedCount] = useState<number | null>(null);

  const startPolling = () => {
    setPolling(true);
    setProgress(0);
    setPollLogs([]);
    setDownloadedCount(null);

    const stages = [
      { p: 10, log: "Initializing background cron sync trigger..." },
      { p: 30, log: `Authenticating into [${selectedMailbox}] targeting folder [${folder}]...` },
      { p: 55, log: "Querying envelope headers for attachments ending in (.xlsx, .xls, .csv)..." },
      { p: 75, log: "Discovered matching email: 'URGENT: Tariff updates 2026' from 'rates@breelink-global.com'." },
      { p: 90, log: "Buffering attachment: 'rate_sheet_may20.xlsx' into Cloud storage ingestion folder..." },
      { p: 100, log: "Sync job complete! Found 256 rates row entries processed successfully." }
    ];

    stages.forEach((st, idx) => {
      setTimeout(() => {
        setProgress(st.p);
        setPollLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${st.log}`]);
        if (st.p === 100) {
          setPolling(false);
          setDownloadedCount(256);
        }
      }, (idx + 1) * 900);
    });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Manual Inbound Rate Ingress Job Poller</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Select Mailbox Source</label>
            <select 
              value={selectedMailbox}
              onChange={(e) => setSelectedMailbox(e.target.value)}
              disabled={polling}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold outline-none"
            >
              <option value="Gmail_Sales_1">Sales IMAP (Gmail Inbox)</option>
              <option value="Outlook_Support">Custom Carrier Rate Inbound (Outlook)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Inbound Server Folder</label>
            <input 
              type="text" 
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              disabled={polling}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono outline-none"
            />
          </div>
          <div className="col-span-2 p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Unread Rate Emails Only</span>
              <span className="text-[9px] text-zinc-400">Ignore already processed tariff spreadsheets</span>
            </div>
            <input 
              type="checkbox" 
              checked={unreadOnly} 
              onChange={() => setUnreadOnly(!unreadOnly)}
              disabled={polling} 
              className="w-4.5 h-4.5 rounded text-[#428bca]" 
            />
          </div>
        </div>

        {polling || pollLogs.length > 0 ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-zinc-400">
                <span>Polling Progress</span>
                <span className="font-mono text-[#428bca]">{progress}%</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#428bca] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-zinc-950 text-amber-400 font-mono text-[10px] p-4 rounded-xl h-40 overflow-y-auto space-y-1 scrollbar-thin">
              {pollLogs.map((log, i) => (
                <p key={i} className="animate-in fade-in slide-in-from-left-2">{log}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/20">
            <Zap className="w-8 h-8 text-amber-500 animate-pulse mx-auto mb-3" />
            <p className="text-xs font-medium text-zinc-500 max-w-sm mx-auto">Click "Trigger IMAP Check" to query the live servers instantly and pull down raw ratesheets to update your router config.</p>
          </div>
        )}

        {downloadedCount && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div>
              <h5 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Ingress Success</h5>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-500">Reparsed <strong>{downloadedCount}</strong> carriers and successfully link mapped onto Alpha Carrier wholesale tariff engine!</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} disabled={polling} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Cancel</button>
        <button 
          onClick={startPolling} 
          disabled={polling}
          className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans flex items-center gap-1.5 disabled:opacity-50"
        >
          {polling ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          Trigger IMAP Check
        </button>
      </div>
    </div>
  );
}

// 3. TEST PARSE FORMAT FORM (Sandbox)
export function TestParseFormatForm({ onClose, theme }: FormProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('FT_whs_standard');
  const [testing, setTesting] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const mockFileProcess = (name: string, size: string) => {
    setTesting(true);
    setFileDetails({ name, size });
    setScanResult(null);

    setTimeout(() => {
      setTesting(false);
      setScanResult({
        rowSkipped: 1,
        mccMapped: "Col A (Index 0)",
        mncMapped: "Col B (Index 1)",
        mccmncCode: "Concat formula [Col A + Col B]",
        rateMapped: "Col F (Index 5)",
        currencyDetected: "USD",
        parsedRows: 118,
        successCount: 115,
        failedCount: 3,
        details: [
          { row: 14, mccmnc: "23410", error: "Duplicate MCCMNC skip override" },
          { row: 41, mccmnc: "unknown-90", error: "Invalid MNC value: non-numeric string detected" },
          { row: 99, mccmnc: "310410", error: "Irregular pricing value: negative rate -$0.012" }
        ]
      });
    }, 1800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      mockFileProcess(f.name, (f.size / 1024).toFixed(1) + " KB");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-4xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Automated File Parsing Sandbox Analyzer</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pb-1 border-b border-zinc-100 dark:border-zinc-800">Verification Target</h4>
          
          <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2">
            <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Select Parsing Template Schema</label>
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none"
            >
              <option value="FT_whs_standard">Standard Customer Rates (XLSX)</option>
              <option value="FT_vendor_whs">Alpha Vendor Wholesale Layout (CSV)</option>
              <option value="FT_intl_plan">International Carrier Rate Sheet (TXT)</option>
            </select>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => {
              mockFileProcess("carrier_rates_may_2026.xlsx", "42.4 KB");
            }}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group",
              dragActive ? "border-[#428bca] bg-[#428bca]/5" : "border-zinc-200 dark:border-zinc-800 hover:border-[#428bca] hover:bg-zinc-50 dark:hover:bg-zinc-800/20"
            )}
          >
            <Upload className={cn("w-8 h-8 opacity-40 transition-transform duration-300 group-hover:-translate-y-1 text-[#428bca]", dragActive && "animate-bounce")} />
            <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Drag & drop rates file or Click to load</span>
            <span className="text-[9px] text-zinc-400 italic">Supports .XLSX, .CSV, .TXT up to 5MB</span>
          </div>

          {fileDetails && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300 truncate">{fileDetails.name}</p>
                <p className="text-[9px] text-zinc-400 font-mono font-bold uppercase">{fileDetails.size}</p>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-3 space-y-6 border-l border-zinc-100 dark:border-zinc-800 md:pl-8">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest pb-1 border-b border-zinc-100 dark:border-zinc-800">MAPPED TARGET AUDIT FEEDBACK</h4>
          
          {testing && (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#428bca] animate-spin" />
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Scanning Columns & Formats...</p>
            </div>
          )}

          {!testing && !scanResult && (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <Eye className="w-8 h-8 opacity-30 mb-2" />
              <p className="text-xs font-medium">Please drag a tariff file or load a sample sheet to trigger structural pattern scanning.</p>
            </div>
          )}

          {!testing && scanResult && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-250">
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-lg flex justify-between">
                  <span className="text-zinc-400 font-bold uppercase text-[9px]">Row Bypass:</span>
                  <span className="font-mono font-black">{scanResult.rowSkipped} (Header)</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-lg flex justify-between">
                  <span className="text-zinc-400 font-bold uppercase text-[9px]">Currency Status:</span>
                  <span className="font-mono font-black text-emerald-500">{scanResult.currencyDetected}</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-lg flex justify-between">
                  <span className="text-zinc-400 font-bold uppercase text-[9px]">Parsed Rows:</span>
                  <span className="font-mono font-black text-blue-600">{scanResult.parsedRows}</span>
                </div>
                <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 rounded-lg flex justify-between">
                  <span className="text-zinc-400 font-bold uppercase text-[9px]">Validation Pass:</span>
                  <span className="font-mono font-black text-emerald-600">{scanResult.successCount} / {scanResult.parsedRows}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Structural Mappings</span>
                <table className="w-full text-[10px] border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
                  <thead className="bg-zinc-50 dark:bg-zinc-800/60 font-black uppercase text-zinc-400 text-left">
                    <tr>
                      <th className="px-3 py-1.5">Fields</th>
                      <th className="px-3 py-1.5">Parsed Location</th>
                      <th className="px-3 py-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850 font-medium">
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-zinc-650 dark:text-zinc-350">MCC</td>
                      <td className="px-3 py-1.5 font-mono">{scanResult.mccMapped}</td>
                      <td className="px-3 py-1.5 text-emerald-500 font-bold">✔ MATCHED</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-zinc-650 dark:text-zinc-350">MNC</td>
                      <td className="px-3 py-1.5 font-mono">{scanResult.mncMapped}</td>
                      <td className="px-3 py-1.5 text-emerald-500 font-bold">✔ MATCHED</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-zinc-650 dark:text-zinc-350">MCCMNC Output</td>
                      <td className="px-3 py-1.5 font-mono text-blue-500">{scanResult.mccmncCode}</td>
                      <td className="px-3 py-1.5 text-emerald-500 font-bold">✔ MATCHED</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-1.5 font-bold text-zinc-650 dark:text-zinc-350">Decimal Rate</td>
                      <td className="px-3 py-1.5 font-mono">{scanResult.rateMapped}</td>
                      <td className="px-3 py-1.5 text-emerald-500 font-bold">✔ MATCHED</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block text-rose-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Error Overrides Bypassed ({scanResult.failedCount})
                </span>
                <div className="max-h-24 bg-rose-50/40 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-lg p-2.5 space-y-1.5 overflow-y-auto font-mono text-[9px] text-zinc-500">
                  {scanResult.details.map((d: any, i: number) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-rose-500 font-bold">Row {d.row}:</span>
                      <span>MCCMNC {d.mccmnc} - <strong className="text-rose-600 dark:text-rose-400">{d.error}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Close Sandbox</button>
        <button 
          onClick={() => {
            alert("File parser layout configuration changes updated! Assigned mapping directly onto rule 'Daily Ingestion'.");
            onClose();
          }}
          disabled={!scanResult} 
          className="px-8 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-emerald-700 transition-all font-sans disabled:opacity-50"
        >
          Inject Mappings
        </button>
      </div>
    </div>
  );
}

// 4. CHECK RULES MATCH FORM
export function CheckRulesMatchForm({ onClose, theme }: FormProps) {
  const [sender, setSender] = useState('rates@breelink-global.com');
  const [subject, setSubject] = useState('Daily Rates Upload Sheet');
  const [extension, setExtension] = useState('.xlsx');
  const [matching, setMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>(null);

  const testMatch = () => {
    setMatching(true);
    setMatchResult(null);

    setTimeout(() => {
      setMatching(false);
      if (sender.includes('breelink') || subject.toLowerCase().includes('rate')) {
        setMatchResult({
          matched: true,
          ruleName: "Daily Rates Inbound Ingestion",
          vendorTrunk: "VT_001 (V_ASIA_PREMIUM)",
          fileTemplate: "Standard XLSX Format Template",
          targetTable: "Standard Customer Rates Table",
          markupApplied: "Standard cost + 1.5% markup buffer",
          alertWebhook: "Enabled (Slack Notification -> #channel-billing)"
        });
      } else {
        setMatchResult({
          matched: false,
          ruleName: null,
          error: "No matching auto ingestion rule matches the criteria. The system will hold the email for admin validation."
        });
      }
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Automated Ingestion Route Rules Pattern Simulator</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 space-y-2">
          <h4 className="text-[11px] font-black text-[#428bca] uppercase tracking-widest flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Concept Verification
          </h4>
          <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
            Specify the incoming email attributes to simulate which IMAP parsing trigger templates and rate calculations will automatically activate upon incoming email receipt from wholesale partners.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Sender Address (Match)</label>
              <input 
                type="text" 
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Subject Keywords (Check)</label>
              <input 
                type="text" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">File Attachment Suffix</label>
            <input 
              type="text" 
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono outline-none"
            />
          </div>
        </div>

        {matching && (
          <div className="p-8 text-center bg-zinc-50/40 dark:bg-zinc-800/20 rounded-xl space-y-2.5">
            <RefreshCw className="w-6 h-6 animate-spin text-[#428bca] mx-auto" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Running pattern matches against whitelisted directories...</p>
          </div>
        )}

        {!matching && matchResult && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {matchResult.matched ? (
              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5 font-bold" />
                  <span className="text-xs font-black uppercase tracking-widest">Rule Trigger Matched</span>
                </div>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-[11px] border-t border-emerald-100/50 dark:border-emerald-900/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400 uppercase text-[9px]">Matched Rule:</span>
                    <strong className="text-zinc-800 dark:text-zinc-300 font-bold">{matchResult.ruleName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 uppercase text-[9px]">Trunk Destination:</span>
                    <strong className="text-zinc-800 dark:text-zinc-300 font-bold">{matchResult.vendorTrunk}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 uppercase text-[9px]">Format Template:</span>
                    <strong className="text-zinc-800 dark:text-zinc-300 font-bold">{matchResult.fileTemplate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400 uppercase text-[9px]">Destination Table:</span>
                    <strong className="text-zinc-800 dark:text-zinc-300 font-bold">{matchResult.targetTable}</strong>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-zinc-400 uppercase text-[9px]">Ingress Calculator Markup Applied:</span>
                    <strong className="text-emerald-600 font-bold">{matchResult.markupApplied}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[11px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-widest">NO AUTOMATED RULE MATCHED</h5>
                  <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">{matchResult.error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Close</button>
        <button 
          onClick={testMatch} 
          disabled={matching}
          className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans"
        >
          Check Patterns Map
        </button>
      </div>
    </div>
  );
}

// 5. FORCE RUN RULE INGESTION FORM
export function ForceRunRuleIngestionForm({ onClose, theme }: FormProps) {
  const [selectedRule, setSelectedRule] = useState('Daily Rates');
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [stepsLogs, setStepsLogs] = useState<string[]>([]);

  const runAll = () => {
    setRunning(true);
    setActiveStep(1);
    setStepsLogs([]);

    const timeline = [
      { text: "Logging manually triggered event ID WHS-749.", step: 1 },
      { text: "Bypassing cron polling delay interval successfully.", step: 1 },
      { text: "Connected to Gmail server: imap.gmail.com:993", step: 2 },
      { text: "Scanning unread emails from rates@breelink-global.com.", step: 2 },
      { text: "Attachment identified: 'rates_breelink_row_202605.xlsx' (359 KB)", step: 2 },
      { text: "Initiating stream download buffer context...", step: 3 },
      { text: "Parsed target rule column mappings successfully -> 256 rows decoded.", step: 3 },
      { text: "Checking for margin limits variance on India direct prefix +91...", step: 4 },
      { text: "Applied +1.5% markup override to all 256 active entries.", step: 4 },
      { text: "Injecting parsed rates directly into Customer Rate Table standard category...", step: 5 },
      { text: "Engine Rating Tables updated! All 256 trunk routes are live with revised tariffs.", step: 5 }
    ];

    let t = 0;
    timeline.forEach((item, idx) => {
      setTimeout(() => {
        setStepsLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${item.text}`]);
        setActiveStep(item.step);
        if (idx === timeline.length - 1) {
          setRunning(false);
          setActiveStep(6);
        }
      }, t += 600);
    });
  };

  const steps = [
    { label: "Check Imap", num: 1 },
    { label: "Fetch Email", num: 2 },
    { label: "Parse Sheet", num: 3 },
    { label: "Apply Margin", num: 4 },
    { label: "Update Engine", num: 5 }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-3xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Manual Auto Ingestion Override Controller</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Choose Ingestion Rule Target <span className="text-red-500">*</span></label>
          <select 
            value={selectedRule}
            onChange={(e) => setSelectedRule(e.target.value)}
            disabled={running}
            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]"
          >
            <option value="Daily Rates">Daily Rates (Matches BreeLink Auto Rule)</option>
            <option value="Direct Ingest">Direct Carriers Import Rule (Matches Alpha Vendor WHS)</option>
          </select>
        </div>

        {activeStep > 0 && (
          <div className="space-y-6 border border-zinc-100 dark:border-zinc-800 p-5 rounded-xl bg-zinc-50/20">
            {/* Step Indicators */}
            <div className="flex justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-100 dark:bg-zinc-800 -translate-y-1/2 z-0" />
              {steps.map((st, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 relative z-10">
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-mono transition-colors",
                    activeStep > st.num ? "bg-emerald-500 text-white" : activeStep === st.num ? "bg-[#428bca] text-white animate-pulse" : "bg-zinc-100 dark:bg-zinc-805 text-zinc-400"
                  )}>
                    {activeStep > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
                  </div>
                  <span className={cn(
                    "text-[8px] font-black uppercase tracking-wider text-center",
                    activeStep === st.num ? "text-[#428bca]" : "text-zinc-400"
                  )}>{st.label}</span>
                </div>
              ))}
            </div>

            <div className="bg-zinc-950 text-emerald-400 font-mono text-[10px] p-4 rounded-xl h-44 overflow-y-auto space-y-1 scrollbar-thin shadow-inner border border-zinc-800">
              {stepsLogs.map((log, i) => (
                <p key={i} className="animate-in fade-in slide-in-from-left-2">{log}</p>
              ))}
            </div>
          </div>
        )}

        {activeStep === 6 && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <CheckSquare className="w-6 h-6 text-emerald-500" />
            <div>
              <h5 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Sync Integrity Benched Successfully</h5>
              <p className="text-[10px] text-zinc-500 leading-normal">Successfully synchronized 256 parsed wholesale rates directly mapped dynamically. Check the Customer Rate Tables for live verification.</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} disabled={running} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Close Drawer</button>
        <button 
          onClick={runAll} 
          disabled={running}
          className="px-8 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-emerald-700 transition-all font-sans flex items-center gap-1.5"
        >
          {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <PlayIcon className="w-3.5 h-3.5" />}
          Force Rule Ingestion
        </button>
      </div>
    </div>
  );
}

// Helper SVG Icon for play button
function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={props.className} {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

// 6. FORCE REPAIR & RE-PROCESS FORM
export function ForceRepairProcessForm({ onClose, theme }: FormProps) {
  const [targetId, setTargetId] = useState('FL-401');
  const [offsetOverride, setOffsetOverride] = useState('5');
  const [bypassing, setBypassing] = useState(true);
  const [fixing, setFixing] = useState(false);
  const [repaired, setRepaired] = useState(false);

  const performRepair = () => {
    setFixing(true);
    setRepaired(false);

    setTimeout(() => {
      setFixing(false);
      setRepaired(true);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Malformed Sheet Repair & Influx playground</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3 p-4 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/35 rounded-xl text-rose-800 dark:text-rose-400">
          <ShieldAlert className="w-8 h-8 shrink-0 text-rose-500" />
          <div className="text-[11px]">
            <p className="font-black uppercase tracking-wider">Failure Registered: {targetId}</p>
            <p className="text-zinc-500 leading-normal mt-0.5">Auto ingestion template verification failed for file "rate_sheet_corrupt.xlsx" on Rule "Daily Rates" due to error: <strong>Missing Column Index 5 (MCCMNC)</strong>.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5Col font-sans">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Target Failure ID</label>
            <input 
              type="text" 
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Force Column Offset Override</label>
            <select 
              value={offsetOverride} 
              onChange={(e) => setOffsetOverride(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none"
            >
              <option value="5">Read MCCMNC from column Index 6 (Col G)</option>
              <option value="4">Read MCCMNC from column Index 5 (Col F)</option>
              <option value="7">Deduce MCCMNC from Country & Network name</option>
            </select>
          </div>
          <div className="col-span-2 p-3 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg border border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">Bypass Invalid MNCs and Append Empty</span>
              <span className="text-[9px] text-zinc-400">Skip problematic rows instead of terminating the process</span>
            </div>
            <input 
              type="checkbox" 
              checked={bypassing} 
              onChange={() => setBypassing(!bypassing)}
              className="w-4.5 h-4.5 rounded text-[#428bca]" 
            />
          </div>
        </div>

        {fixing && (
          <div className="p-6 text-center bg-zinc-50/50 dark:bg-zinc-800/20 rounded-xl space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-rose-500 mx-auto" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Reconstructing row indexes and compiling rate cells...</p>
          </div>
        )}

        {repaired && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <Check className="w-5 h-5 text-emerald-500" />
            <div>
              <h5 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Repair Completed</h5>
              <p className="text-[10px] text-zinc-500 leading-normal">Bypassed missing column headers, scanned 254 matching prefixes, and applied 1.5% markup override. Injected rates in table "Standard Customer Rates" successfully!</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Close</button>
        <button 
          onClick={performRepair} 
          disabled={fixing}
          className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans"
        >
          Fix & Re-Ingest Draft
        </button>
      </div>
    </div>
  );
}

// 7. DIAGNOSTIC RECOMMENDATIONS FORM
export function DiagnosticRecommendationsForm({ onClose, theme }: FormProps) {
  const [fixedRecs, setFixedRecs] = useState<number[]>([]);

  const applyInstantFix = (id: number) => {
    setFixedRecs(prev => [...prev, id]);
  };

  const recs = [
    {
      id: 1,
      title: "Add backup MCCMNC descriptions translation filter",
      desc: "If an incoming sheet has MCCMNC column missing, fallback to parsing Country & Network strings to look up numerical codes from MCCMNC unique codes dictionary.",
      type: "Template Fix",
      impact: "High Ingestion Integrity"
    },
    {
      id: 2,
      title: "Set default auto-increment billing to 1/1 for wholesale trunks",
      desc: "Prevents fractional rounding mismatches with carrier tiers that leads to billing template rejection under auto upload failed log queues.",
      type: "Rate Influx Rule",
      impact: "Decreased Disputes (-15%)"
    },
    {
      id: 3,
      title: "Whitelisting incoming email addresses via Regex filter mapping",
      desc: "Enforce strict match criteria on rule 'Daily Rates' so that only attachments originating from verified supplier NOC emails are parsed.",
      type: "Security & Anti-Spam",
      impact: "Zero False Positives"
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-3xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Automated AI Inbound Ingestion Diagnostic Recommendations</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
        {recs.map((rec) => {
          const isFixed = fixedRecs.includes(rec.id);
          return (
            <div key={rec.id} className="p-4 bg-zinc-50/50 dark:bg-zinc-800/40 border border-zinc-150 dark:border-zinc-805 rounded-xl flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center shrink-0 text-[#428bca]">
                <Settings className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-200 leading-snug">{rec.title}</h4>
                  <span className="text-[8px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-805 rounded-full font-black text-zinc-500 dark:text-zinc-400 shrink-0 uppercase tracking-widest">{rec.type}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold">{rec.desc}</p>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">{rec.impact}</span>
                  {isFixed ? (
                    <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Fixed
                    </span>
                  ) : (
                    <button 
                      onClick={() => applyInstantFix(rec.id)}
                      className="text-[9px] font-black uppercase tracking-widest text-white bg-[#428bca] px-3 py-1 rounded shadow-sm hover:bg-blue-600 transition-all font-sans"
                    >
                      Fix Instantly
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans">
          Dismiss Recommendations
        </button>
      </div>
    </div>
  );
}

// 8. AUDIT SYNC INTEGRITY FORM
export function AuditSyncIntegrityForm({ onClose, theme }: FormProps) {
  const [auditing, setAuditing] = useState(false);
  const [complete, setComplete] = useState(false);

  const triggerAudit = () => {
    setAuditing(true);
    setComplete(false);

    setTimeout(() => {
      setAuditing(false);
      setComplete(true);
    }, 1400);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-2xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Wholesale Rate Sync Compliance & Ingress Health Audit</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 space-y-6">
        <p className="text-[11px] text-zinc-500 leading-relaxed">
          Executes real-time structural audits comparing source supplier sheets against link-mapped rating tables. Checks pricing variance, MCCMNC duplicates, and filters out problematic outliers.
        </p>

        {auditing && (
          <div className="p-8 text-center bg-zinc-50/40 dark:bg-zinc-800/20 rounded-xl space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#428bca] mx-auto" />
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest animate-pulse">Scanning DB rating engines & currency exchange spreads...</p>
          </div>
        )}

        {complete && (
          <div className="space-y-4 animate-in fade-in duration-200 text-xs">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-905 rounded-xl space-y-2.5">
              <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">Compliance Audit Successful</span>
              <p className="text-[10px] text-zinc-500">Source Sheet verified against Standard Rating Rules benchmarks. Details:</p>
              <div className="grid grid-cols-2 gap-4 border-t border-emerald-150 dark:border-emerald-900/30 pt-2 text-[10px] font-mono leading-relaxed text-zinc-650 dark:text-zinc-400">
                <div>- Parsed update rows: 256</div>
                <div>- Min/Max bounds check: PASSED</div>
                <div>- Double prefix conflicts: 0 detected</div>
                <div>- Negative rates blocked: 0 rows</div>
                <div className="col-span-2 text-emerald-600 font-bold">- Currency match (USD Base): 100% compliant</div>
              </div>
            </div>
          </div>
        )}

        {!auditing && !complete && (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <Activity className="w-7 h-7 text-[#428bca] mx-auto mb-2 animate-pulse" />
            <p className="text-[10px] text-zinc-500 max-w-sm mx-auto p-2">Initiate audit verify checks to confirm pricing tables match system-wide commercial benchmarks.</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Close</button>
        <button 
          onClick={triggerAudit} 
          disabled={auditing}
          className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans"
        >
          Audit Ingress Sync
        </button>
      </div>
    </div>
  );
}

// 9. DISPATCH INBOUND NOTICES FORM
export function DispatchInboundNoticesForm({ onClose, theme }: FormProps) {
  const [subject, setSubject] = useState('Offered Pricing Tariff Sheet Revision - May 2026');
  const [notifying, setNotifying] = useState(false);
  const [complete, setComplete] = useState(false);

  const sendEmails = () => {
    setNotifying(true);
    setComplete(false);

    setTimeout(() => {
      setNotifying(false);
      setComplete(true);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-w-3xl w-full text-left font-sans">
      <div className="px-5 py-3 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#428bca]" />
          <h3 className="text-[12px] font-black text-[#428bca] uppercase tracking-wider">Revised Traffic Price Dispatcher</h3>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors"><X className="w-5 h-5" /></button>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Mail Subject Line <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:border-[#428bca]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Recipients List</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg min-h-[38px] items-center">
              <span className="text-[9px] font-black uppercase bg-zinc-200 dark:bg-zinc-700 text-zinc-650 dark:text-zinc-300 px-2 py-0.5 rounded flex items-center gap-1">ABC Corp NOC <X className="w-2.5 h-2.5" /></span>
              <span className="text-[9px] font-black uppercase bg-zinc-200 dark:bg-zinc-700 text-zinc-650 dark:text-zinc-300 px-2 py-0.5 rounded flex items-center gap-1">BreeLink Bills <X className="w-2.5 h-2.5" /></span>
              <button className="text-[8px] font-black text-[#428bca] uppercase hover:underline ml-1">+ Custom Add</button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Revise Sheet File Attachment</label>
            <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono font-bold text-zinc-500 flex items-center justify-between">
              <span>Full_Wholesale_RateSheet.xlsx</span>
              <span className="text-emerald-500 text-[10px]">Verified (356 KB)</span>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Email Template Body Preview</label>
            <textarea 
              readOnly
              className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-mono leading-relaxed outline-none h-24"
              value={`Dear Wholesale Carrier Partners,\n\nPlease find attached the revised commercial tariff sheet representing our bulk offered pricing routes effective 2026-05-25.\n\nChanges apply automatically in rating system records. In case of discrepancies, contact billing NOC within 48 hours.\n\nWarm regards,\nTeleOSS SMS Wholesale Ingress Team`}
            />
          </div>
        </div>

        {notifying && (
          <div className="p-6 text-center bg-zinc-50/50 dark:bg-zinc-800/20 rounded-xl space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#428bca] mx-auto" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Broadcasting commercial updates to partner wholesale SMTP routers...</p>
          </div>
        )}

        {complete && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <Send className="w-5 h-5 text-emerald-500" />
            <div>
              <h5 className="text-[11px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Revision Emails Dispatched</h5>
              <p className="text-[10px] text-zinc-500 leading-normal">Notices successfully received by outbound SMTP gateways. Audited and recorded under NOC Mail logs.</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-800/50">
        <button onClick={onClose} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 font-sans">Close</button>
        <button 
          onClick={sendEmails} 
          disabled={notifying}
          className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all font-sans flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" /> Broadcast Ratesheet
        </button>
      </div>
    </div>
  );
}
