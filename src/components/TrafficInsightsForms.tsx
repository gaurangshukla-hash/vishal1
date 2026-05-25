import React from 'react';
import { X, Search, Check, Square, Info, ChevronDown, RotateCcw, Activity, Target, ShieldAlert, Zap, Globe, Smartphone, ArrowRight, Download, History, PlayCircle, Eye, Clock, TrendingDown, Save, Server } from 'lucide-react';
import { cn } from '../lib/utils';

import { SpecializedReportForm } from './SpecializedReports';

interface SectionFormProps {
  title: string;
  theme: 'light' | 'dark';
  onBack?: () => void;
}

interface ModalFormProps {
  onClose: () => void;
  theme: 'light' | 'dark';
}

export function TrafficInsightsFormView({ title, theme }: SectionFormProps) {
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [simulationHistory, setSimulationHistory] = React.useState<any[]>([]);

  // TCP Dump States
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [showCaptureResults, setShowCaptureResults] = React.useState(false);
  const [packetsCaptured, setPacketsCaptured] = React.useState(0);
  const [captureSize, setCaptureSize] = React.useState(0);

  // Network Diag States
  const [isExecutingDiag, setIsExecutingDiag] = React.useState(false);
  const [showDiagResults, setShowDiagResults] = React.useState(false);
  const [diagConsole, setDiagConsole] = React.useState<string[]>([]);

  const [simulationStep, setSimulationStep] = React.useState(0);
  const [simulationLog, setSimulationLog] = React.useState<string[]>([]);
  const [socketSlider, setSocketSlider] = React.useState(50); // 0-100 for visual split

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    setSimulationLog(['Initializing simulation engine...', 'Connecting to Primary Trunk...']);
    
    const logs = [
      'Authenticating SMPP credentials...',
      'Targeting MCC: 404 MNC: 10 (India)',
      'Analyzing LCOR (Least Cost Routing) table...',
      `Checking Carrier Bind status... (${socketSlider > 50 ? 'UP' : 'DOWN'} mode)`,
      `Verifying socket availability... (Total: 10)`,
      'Computing margin and delivery prediction...',
      'Simulation Complete.'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setSimulationLog(prev => [...prev, logs[i]]);
        setSimulationStep(Math.round(((i + 1) / logs.length) * 100));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setShowResult(true);
          const totalSockets = 10;
          const connected = Math.floor(totalSockets * (socketSlider / 100));
          const disconnected = totalSockets - connected;
          
          const newSim = {
            id: Date.now(),
            trunk: 'Alpha-System-IN (1)',
            mccmnc: '40410',
            senderId: 'TELEOSS',
            dest: '919876543210',
            route: 'GlobalConnect_Premium',
            supplierTitle: 'Premium Tier Global (Level 1)',
            bindMode: `Transceiver (${socketSlider > 50 ? 'UP' : 'DOWN'})`,
            sockets: { connected, disconnected, total: totalSockets },
            buy: 0.0125,
            sell: 0.0155,
            margin: 0.0030,
            status: 'Profit',
            time: new Date().toLocaleTimeString()
          };
          setSimulationHistory(prev => [newSim, ...prev]);
        }, 800);
      }
    }, 400);
  };

  const handleStartCapture = () => {
    setIsCapturing(true);
    setPacketsCaptured(0);
    setCaptureSize(0);
    
    const interval = setInterval(() => {
      setPacketsCaptured(prev => {
        if (prev >= 1240) {
          clearInterval(interval);
          setIsCapturing(false);
          setShowCaptureResults(true);
          return prev;
        }
        return prev + Math.floor(Math.random() * 50) + 10;
      });
      setCaptureSize(prev => prev + parseFloat((Math.random() * 2.5).toFixed(2)));
    }, 100);
  };

  const handleExecuteDiag = () => {
    setIsExecutingDiag(true);
    setDiagConsole(['Searching for target path...', 'Establishing connection to 8.8.8.8...']);
    
    const steps = [
      'Pinging 8.8.8.8 with 32 bytes of data:',
      'Reply from 8.8.8.8: bytes=32 time=14ms TTL=117',
      'Reply from 8.8.8.8: bytes=32 time=12ms TTL=117',
      'Reply from 8.8.8.8: bytes=32 time=13ms TTL=117',
      'Ping statistics for 8.8.8.8:',
      'Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)',
      'Approximate round trip times in milli-seconds:',
      'Minimum = 12ms, Maximum = 14ms, Average = 13ms',
      'Diagnosis Complete. Analyzing results...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setDiagConsole(prev => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsExecutingDiag(false);
          setShowDiagResults(true);
        }, 800);
      }
    }, 400);
  };

  const effectiveTitle = title.includes(' / ') ? title.split(' / ').pop()! : title;

  if (effectiveTitle === 'Negative Margin Report' || effectiveTitle === 'Negative margin report') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-red-50/30 dark:bg-red-900/10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white">
                     <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-black uppercase text-red-600 dark:text-red-400 tracking-[0.2em]">Negative Margin Discovery</h3>
                    <p className="text-[9px] text-red-500/60 font-bold uppercase tracking-widest leading-none mt-0.5">Critical: Buying Price higher than Selling Price</p>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button className="px-6 py-2 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-black transition-all">Export Critical List</button>
                 <button className="px-6 py-2 bg-white border border-zinc-200 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-50 transition-all">Refresh Audit</button>
               </div>
            </div>

            <div className="p-10">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                  {[
                    { label: 'Critical Routes', value: '12', color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Avg Loss/SMS', value: '$0.0042', color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Daily Est. Loss', value: '$452.00', color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Accountable Trunks', value: '4', color: 'text-zinc-600', bg: 'bg-zinc-50' }
                  ].map((stat, i) => (
                    <div key={i} className={cn("p-5 rounded-2xl border flex flex-col", stat.bg, stat.color === 'text-red-600' ? 'border-red-100' : 'border-zinc-100')}>
                       <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-2">{stat.label}</span>
                       <span className="text-2xl font-black italic tracking-tighter">{stat.value}</span>
                    </div>
                  ))}
               </div>

               <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-[11px]">
                     <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                        <tr>
                           <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Target Country</th>
                           <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400">Customer Trunk</th>
                           <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Selling Price</th>
                           <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Buying Price</th>
                           <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-right">Negative Margin</th>
                           <th className="px-6 py-4 font-black uppercase tracking-widest text-zinc-400 text-center">Auto-Guard Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-bold">
                        {[
                          { country: 'United States', trunk: 'TRNK_US_AGG', sell: 0.00500, buy: 0.01200, margin: -0.00700, status: 'BLOCKED' },
                          { country: 'United Kingdom', trunk: 'TRNK_UK_RET', sell: 0.00650, buy: 0.00750, margin: -0.00100, status: 'ACTIVE' },
                          { country: 'Germany', trunk: 'TRNK_EU_WHS', sell: 0.00850, buy: 0.01100, margin: -0.00250, status: 'BLOCKED' },
                          { country: 'India', trunk: 'TRNK_IN_DIR', sell: 0.01200, buy: 0.01250, margin: -0.00050, status: 'ALERTED' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-red-50/30 transition-colors">
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                   <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                   <span className="uppercase">{row.country}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 font-mono text-zinc-500 italic">{row.trunk}</td>
                             <td className="px-6 py-4 text-right font-mono text-zinc-800">${row.sell.toFixed(5)}</td>
                             <td className="px-6 py-4 text-right font-mono text-zinc-800">${row.buy.toFixed(5)}</td>
                             <td className="px-6 py-4 text-right font-mono text-red-600">
                                <div className="flex items-center justify-end gap-1">
                                   <ArrowRight className="w-3 h-3 rotate-45" />
                                   <span>${row.margin.toFixed(5).replace('-', '')}</span>
                                </div>
                             </td>
                             <td className="px-6 py-4 text-center">
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                  row.status === 'BLOCKED' ? "bg-red-500 text-white border-red-600" : 
                                  row.status === 'ALERTED' ? "bg-amber-500 text-white border-amber-600" :
                                  "bg-white text-zinc-400 border-zinc-200"
                                )}>
                                   {row.status}
                                </span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    );
  }

  if (effectiveTitle === 'Route Simulator') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Activity className="w-48 h-48" />
          </div>

          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-300 tracking-[0.2em]">Live Route Simulator</h3>
            </div>
            {!showResult ? (
              <button 
                onClick={handleSimulate}
                disabled={isSimulating}
                className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSimulating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <PlayCircle className="w-3.5 h-3.5" />}
                {isSimulating ? 'Simulating Path...' : 'Execute Simulation'}
              </button>
            ) : (
              <button 
                onClick={() => setShowResult(false)}
                className="px-6 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 transition-all"
              >
                Modify Parameters
              </button>
            )}
          </div>

          {!showResult ? (
            <div className="p-8 space-y-10 relative">
              {isSimulating && (
                <div className="absolute inset-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-12">
                   <div className="w-full max-w-lg space-y-12">
                      <div className="flex items-center justify-between relative">
                         <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                               <Smartphone className="w-8 h-8" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Client App</span>
                         </div>

                         <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 relative mx-4">
                            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-around">
                               {[0, 1, 2].map(i => (
                                 <div 
                                   key={i} 
                                   className="w-2 h-2 rounded-full bg-blue-500 animate-ping"
                                   style={{ animationDelay: `${i * 400}ms` }}
                                 />
                               ))}
                            </div>
                         </div>

                         <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 animate-pulse">
                               <Server className="w-8 h-8" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">TeleOSS Engine</span>
                         </div>

                         <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800 relative mx-4">
                             <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-around">
                               {[0, 1, 2].map(i => (
                                 <div 
                                   key={i} 
                                   className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"
                                   style={{ animationDelay: `${(i * 400) + 600}ms` }}
                                 />
                               ))}
                            </div>
                         </div>

                         <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                               <Globe className="w-8 h-8" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Carrier Path</span>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <div className="space-y-1">
                               <h4 className="text-xl font-black text-zinc-800 dark:text-zinc-100 italic tracking-tighter">Executing Simulation...</h4>
                               <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{simulationLog[simulationLog.length - 1]}</p>
                            </div>
                            <span className="text-2xl font-black text-blue-500 font-mono tracking-tighter">{simulationStep}%</span>
                         </div>
                         <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-700">
                            <div 
                              className="h-full bg-[#428bca] transition-all duration-300 shadow-[0_0_10px_rgba(66,139,202,0.5)]" 
                              style={{ width: `${simulationStep}%` }}
                            />
                         </div>
                      </div>

                      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700 max-h-32 overflow-hidden relative">
                         <div className="space-y-1.5 grayscale opacity-50">
                            {simulationLog.map((log, i) => (
                              <div key={i} className="flex gap-3 text-[10px] font-mono">
                                 <span className="text-zinc-300">[{10 + i}:{20 + i}:00]</span>
                                 <span className="text-zinc-600 dark:text-zinc-400">{log}</span>
                              </div>
                            ))}
                         </div>
                         <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-50 dark:from-zinc-800 flex items-center justify-center">
                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                         </div>
                      </div>
                   </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Socket Connection Priority (UP/DOWN)</label>
                      <span className="text-[10px] font-black text-blue-500 font-mono tracking-widest">{socketSlider > 50 ? 'UP MODE (Active Transceiver)' : 'DOWN MODE (Standby Receiver)'}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={cn("text-[10px] font-black uppercase", socketSlider <= 50 ? "text-blue-500" : "text-zinc-400")}>STANDBY (DOWN)</span>
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         value={socketSlider} 
                         onChange={(e) => setSocketSlider(parseInt(e.target.value))}
                         className="flex-1 accent-blue-500 h-1.5 bg-blue-200 dark:bg-blue-900/30 rounded-full appearance-none cursor-pointer"
                       />
                       <span className={cn("text-[10px] font-black uppercase", socketSlider > 50 ? "text-blue-500" : "text-zinc-400")}>ACTIVE (UP)</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest border-t border-blue-100 dark:border-blue-900/20 pt-3">
                       <span>Sockets: 10 Total</span>
                       <span className="text-blue-500 font-mono">{socketSlider}% Weight</span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                       <div className="text-center p-2 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                          <p className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase">Connected</p>
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono italic">{Math.floor(10 * (socketSlider / 100))} UP</p>
                       </div>
                       <div className="text-center p-2 bg-rose-500/10 dark:bg-rose-500/20 rounded-lg border border-rose-500/30">
                          <p className="text-[8px] font-black text-rose-600 dark:text-rose-400 uppercase">Disconnected</p>
                          <p className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono italic">{10 - Math.floor(10 * (socketSlider / 100))} DOWN</p>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Customer Trunk Connection <span className="text-red-500">*</span></label>
                    <select className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold focus:border-[#428bca] outline-none transition-all">
                      <option>Select Customer Trunk</option>
                      <option>Alpha-System-IN (1)</option>
                      <option>Aakash_DIR_IN (2)</option>
                      <option>Gurleen_DIR_IN (3)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Target Receiver Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                      <input type="text" placeholder="+91 98765 43210" className="w-full h-10 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold focus:border-[#428bca] outline-none transition-all placeholder:font-normal" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Source TON <span className="text-red-500">*</span></label>
                      <select className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none">
                        <option>Alpha (5)</option>
                        <option>Intl (1)</option>
                        <option>Unknown (0)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Source NPI <span className="text-red-500">*</span></label>
                      <select className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none">
                        <option>ISDN (1)</option>
                        <option>Unknown (0)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1 flex items-center justify-between">
                      Sender ID Overwrite
                      <span className="text-[8px] bg-blue-50 dark:bg-blue-900/20 text-blue-500 px-1.5 py-0.5 rounded">Optional</span>
                    </label>
                    <input type="text" placeholder="e.g. TELEOSS" className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold focus:border-[#428bca] outline-none transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">MCC-MNC Code</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                         <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                         <input type="text" placeholder="40410" className="w-full h-10 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono font-bold focus:border-[#428bca] outline-none" />
                      </div>
                      <button className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-blue-500 transition-colors border border-zinc-200 dark:border-zinc-700">
                        <Info className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Dest TON <span className="text-red-500">*</span></label>
                      <select className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none">
                        <option>Intl (1)</option>
                        <option>Unknown (0)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1">Dest NPI <span className="text-red-500">*</span></label>
                      <select className="w-full h-10 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-xl text-xs font-bold outline-none">
                        <option>ISDN (1)</option>
                        <option>Unknown (0)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] ml-1 block mb-2">Simulation Sample Message</label>
                <textarea 
                  rows={3} 
                  placeholder="Simulation Test Message: Verification code 1234. Ignore if not requested."
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-medium focus:border-[#428bca] outline-none transition-all resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 animate-in zoom-in-95 duration-500 space-y-10">
              <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Target className="w-32 h-32 text-emerald-600" />
                </div>
                
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">Route Computed</span>
                          <span className="text-xs font-black text-emerald-600 tracking-widest uppercase">Success</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selected Carrier</span>
                             <div className="flex items-center gap-3">
                               <span className="text-xl font-black text-zinc-800 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                                  {simulationHistory[0]?.route || 'GlobalConnect_Premium'} <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                               </span>
                               <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                 <Server className="w-2.5 h-2.5" /> Supplier Title: {simulationHistory[0]?.supplierTitle || 'Main Premium'}
                               </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-8">
                       <div className="text-center">
                         <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Buy Rate</p>
                         <p className="text-lg font-black text-red-500 font-mono tracking-tighter">${simulationHistory[0]?.buy.toFixed(5) || '0.01250'}</p>
                       </div>
                       <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800 mt-2" />
                       <div className="text-center">
                         <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Sell Rate</p>
                         <p className="text-lg font-black text-blue-500 font-mono tracking-tighter">${simulationHistory[0]?.sell.toFixed(5) || '0.01550'}</p>
                       </div>
                       <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800 mt-2" />
                       <div className="text-center">
                         <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Profit Margin</p>
                         <p className="text-lg font-black text-emerald-500 font-mono tracking-tighter">+${simulationHistory[0]?.margin.toFixed(5) || '0.00300'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Translation Applied', value: 'Rule: Intl_Format (Modified)', color: 'text-amber-500' },
                      { 
                        label: 'Bind Mode (Up/Down)', 
                        value: simulationHistory[0]?.bindMode || 'Transceiver (Up)', 
                        color: 'text-blue-500',
                        icon: <Activity className="w-3 h-3 inline mr-1" />
                      },
                      { 
                        label: 'Connection Sockets', 
                        value: `${simulationHistory[0]?.sockets?.connected || 4} Connected | ${simulationHistory[0]?.sockets?.disconnected || 0} Disconnected`, 
                        color: 'text-emerald-500',
                        icon: <Server className="w-3 h-3 inline mr-1" />
                      },
                      { label: 'Priority Level', value: 'High (10)', color: 'text-blue-500' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/40 dark:bg-zinc-900/40 p-4 rounded-2xl border border-white/50 backdrop-blur-sm">
                         <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">{item.label}</p>
                         <p className={cn("text-[11px] font-black uppercase tracking-tight flex items-center", item.color)}>
                           {item.value}
                         </p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/20 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Comprehensive Decision Log
                </h4>
                <div className="space-y-4">
                  {[
                    { step: 'Ingress Validation', detail: 'Received +919876543210 from Alpha-System-IN. Auth successful.', status: 'Valid' },
                    { step: 'Translation Logic', detail: 'MCC 404, MNC 10 identified (Reliance Jio India). Global NPI rule applied.', status: 'Transformed' },
                    { step: 'Rate Lookup', detail: 'Searching pricing for 40410. Client: $0.0155 | Target Vendor: $0.0125.', status: 'Match' },
                    { step: 'Anti-Loss Check', detail: 'Margin computed: +19.4%. Passing security checkpoint.', status: 'Secure' },
                    { step: 'Path Selection', detail: 'LCOR (Least Cost + Quality) algorithm selected GlobalConnect as Primary.', status: 'Finalized' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 hover:bg-white dark:hover:bg-zinc-900 transition-colors rounded-xl group">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 shadow-sm shadow-blue-500/50 group-hover:scale-150 transition-transform" />
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-tighter">{log.step}</p>
                          <p className="text-[10px] text-zinc-400 font-medium italic">{log.detail}</p>
                       </div>
                       <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded tracking-widest">{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SIMULATION HISTORY REPORT */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
           <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <History className="w-4 h-4 text-zinc-400" />
                 <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-widest">Recent Simulation Logs</h4>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase hover:underline">
                 <Download className="w-3.5 h-3.5" /> Export History
              </button>
           </div>
           <div className="overflow-x-auto text-left">
              <table className="w-full text-left text-[11px]">
                 <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest">Timestamp</th>
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest">Trunk / Connection</th>
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest">Target / Result</th>
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest">Route / Supplier / Bind</th>
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest text-right">Margin (%)</th>
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest text-center">Status</th>
                       <th className="px-6 py-4 font-black text-zinc-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-bold">
                    {simulationHistory.length > 0 ? simulationHistory.map(row => (
                      <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 font-mono text-zinc-400 text-[10px]">{row.time}</td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-zinc-700 dark:text-zinc-300 uppercase tracking-tighter text-[10px]">{row.trunk}</span>
                              <span className="text-[9px] text-zinc-400 font-mono">ID: {row.id.substring(0,8)}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-zinc-800 dark:text-zinc-200">{row.dest}</span>
                              <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase">{row.mccmnc}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                              <span className="text-[#428bca] uppercase italic font-black tracking-tight">{row.route}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-1 rounded border border-zinc-200 dark:border-zinc-700">{row.supplierTitle}</span>
                                <span className={cn("text-[9px] font-bold px-1 rounded", row.bindMode?.includes('UP') ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : "text-amber-500 bg-amber-50 dark:bg-amber-500/10")}>{row.bindMode}</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right text-emerald-600 font-mono">+{((row.margin/row.sell)*100).toFixed(1)}%</td>
                        <td className="px-6 py-4 text-center">
                           <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">Profitable</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-500">
                              <Eye className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 uppercase font-black tracking-widest opacity-30">No simulations performed in this session.</td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/20 p-6 rounded-3xl flex items-start gap-5">
           <ShieldAlert className="w-10 h-10 text-amber-600 shrink-0 mt-1 opacity-40" />
           <div className="space-y-2">
              <h5 className="text-[11px] font-black text-amber-700 uppercase tracking-[0.2em]">Simulation Insight</h5>
              <p className="text-xs text-amber-600/80 font-bold leading-relaxed italic">
                 The simulator uses cached pricing data and real-time routing logic. 
                 If a route is showing negative margin, please verify the "Negative Margin Control" settings for the specific trunk before traffic execution.
              </p>
           </div>
        </div>
      </div>
    );
  }

  if (effectiveTitle === 'Network Diagnosis') {
    if (showDiagResults) {
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
             <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Activity className="w-5 h-5 text-blue-500" />
                   <h3 className="text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-300 tracking-[0.2em]">Diagnostic Health Report</h3>
                </div>
                <div className="flex gap-3">
                   <button className="px-5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase rounded-lg border hover:bg-zinc-200 transition-all font-mono">Download Logs</button>
                   <button onClick={() => setShowDiagResults(false)} className="px-5 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase rounded-lg shadow-lg hover:bg-blue-600 transition-all">New Diagnosis</button>
                </div>
             </div>
             
             <div className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Latency (Avg)', value: '13.2 ms', status: 'Excellent', color: 'text-emerald-500' },
                     { label: 'Packet Loss', value: '0.00%', status: 'No Dropped', color: 'text-emerald-500' },
                     { label: 'Jitter', value: '1.4 ms', status: 'Stable', color: 'text-emerald-500' },
                     { label: 'Route Hops', value: '8 Hops', status: 'Direct', color: 'text-blue-500' }
                   ].map((item, i) => (
                     <div key={i} className="bg-zinc-50 dark:bg-zinc-800/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-700">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <h4 className="text-xl font-black text-zinc-800 dark:text-zinc-100">{item.value}</h4>
                        <span className={cn("text-[8px] font-black uppercase", item.color)}>{item.status}</span>
                     </div>
                   ))}
                </div>

                <div className="bg-zinc-950 rounded-2xl p-6 font-mono text-[11px] text-green-500 border border-zinc-800 shadow-2xl">
                   <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-4">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="text-zinc-400 font-bold">RAW OUTPUT LOGS</span>
                   </div>
                   <div className="space-y-1.5 custom-scrollbar max-h-64 overflow-auto">
                      {diagConsole.map((line, i) => (
                        <div key={i} className="flex gap-3">
                           <span className="text-zinc-700 w-4">{i + 1}</span>
                           <span>{line}</span>
                        </div>
                      ))}
                      <div className="flex gap-2 text-zinc-500 mt-4">
                         <span>$</span>
                         <span className="animate-pulse">_</span>
                      </div>
                   </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-6 rounded-2xl flex items-start gap-5">
                   <Info className="w-10 h-10 text-blue-400 shrink-0 mt-1" />
                   <div className="space-y-2">
                      <h5 className="text-[11px] font-black text-blue-700 uppercase tracking-[0.2em]">Network recommendation</h5>
                      <p className="text-xs text-blue-600/80 font-bold leading-relaxed italic">
                        The connection to 8.8.8.8 is highly stable with minimal jitter. No anomalies detected in the route path. 
                        MTU optimization is currently active for this interface.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Activity className="w-5 h-5 text-[#428bca]" />
             <h3 className="text-[11px] font-black uppercase text-zinc-500 tracking-widest">NETWORK DIAGNOSIS TOOLS</h3>
          </div>
          <button 
            onClick={handleExecuteDiag}
            disabled={isExecutingDiag}
            className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isExecutingDiag ? <RotateCcw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
            {isExecutingDiag ? 'Diagnosing...' : 'Execute Audit'}
          </button>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Tool Selection <span className="text-red-500">*</span></label>
                <select className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#428bca] transition-all">
                  <option>Ping (ICMP Echo)</option>
                  <option>Trace Route (Path Discovery)</option>
                  <option>MTR (Real-time Traceroute)</option>
                  <option>NSLookup (DNS Verify)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Destination Target <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input type="text" placeholder="e.g. 8.8.8.8 or google.com" className="w-full h-11 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-[#428bca] outline-none transition-all placeholder:font-normal" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Communication Protocol</label>
                <div className="flex gap-3">
                   {['ICMP', 'TCP', 'UDP'].map(p => (
                     <label key={p} className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl cursor-pointer hover:bg-zinc-100 transition-colors">
                        <input type="radio" name="protocol" defaultChecked={p === 'ICMP'} className="w-4 h-4 accent-[#428bca]" />
                        <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">{p}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Packet Count</label>
                    <input type="number" defaultValue={5} className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold font-mono outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Size (Bytes)</label>
                    <input type="number" defaultValue={64} className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold font-mono outline-none" />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Timeout Duration (ms)</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                   <input type="number" defaultValue={1000} className="w-full h-11 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold font-mono focus:ring-4 focus:ring-blue-500/10 focus:border-[#428bca] outline-none transition-all" />
                </div>
              </div>
              <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-900/20 flex gap-3">
                 <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                 <p className="text-[9px] text-amber-700/70 font-medium leading-relaxed italic">
                    Note: ICMP traffic may be rate-limited by some carriers. 
                    Switch to TCP/UDP for more accurate firewall bypass testing.
                 </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                 <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">REAL-TIME CONSOLE OUTPUT</h4>
                 <div className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-[8px] text-zinc-500 font-bold uppercase">Ready</div>
              </div>
              {isExecutingDiag && (
                <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> EXECUTING COMMAND...
                </span>
              )}
            </div>
            <div className="w-full h-64 bg-zinc-950 rounded-2xl p-6 font-mono text-[11px] text-green-400 overflow-auto border border-zinc-800 shadow-inner custom-scrollbar relative">
              <div className="space-y-1">
                 <div className="flex gap-2 mb-2 text-zinc-600 font-bold text-[10px] border-b border-zinc-900 pb-2">
                    <Server className="w-3.5 h-3.5" /> <span>DIAGNOSTIC SYSTEM v4.0.2</span>
                 </div>
                 {diagConsole.map((line, i) => (
                    <div key={i} className="flex gap-2">
                       <span className="text-zinc-700">{'>'}</span>
                       <span>{line}</span>
                    </div>
                 ))}
                 <div className="flex gap-2">
                    <span className="text-zinc-600">user@teleoss:~$</span>
                    <span className="animate-pulse">_</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveTitle === 'Failed DLR Search') {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">FAILURE ANALYSIS FILTERS</h3>
          <div className="flex gap-2">
            <button className="px-6 py-1 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Search</button>
            <button className="px-6 py-1 bg-[#5cb85c] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-green-600 transition-all">Export</button>
          </div>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">From Date <span className="text-red-500">*</span> :</label>
                <input type="datetime-local" defaultValue="2026-04-30T00:00:00" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">To Date <span className="text-red-500">*</span> :</label>
                <input type="datetime-local" defaultValue="2026-04-30T23:59:59" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">Customer Msg ID :</label>
                <input type="text" placeholder="Comma separated list" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <FormRow label="Customer Enterprise" labelSize="min-w-[150px]">
                <MultiSelect options={['ABC (38)', 'Abc1 (72)', 'abcd (70)', 'Adarsh Enterprise (63)']} count={83} />
              </FormRow>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">Error Code :</label>
                <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                  <option>All Errors</option>
                  <option>UNDELIV (Undeliverable)</option>
                  <option>EXPIRED (Message Expired)</option>
                  <option>REJECTD (Message Rejected)</option>
                  <option>DELETED (Message Deleted)</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">Customer IP :</label>
                <input type="text" placeholder="e.g. 192.168.1.1" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <div className="flex items-center gap-4">
                <label className="text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono min-w-[150px] text-right">Vendor ID :</label>
                <input type="text" placeholder="Vendor ID" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
              </div>
              <FormRow label="Customer Trunk" labelSize="min-w-[150px]">
                <MultiSelect options={['Aakash_DIR_IN (2)', 'Aakash_DIR_out (60)', 'abcd_test2C_ANI_TR (63)', 'abcd_testC (62)']} count={85} />
              </FormRow>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (effectiveTitle === 'TCP Dump') {
    if (showCaptureResults) {
      return (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-300 tracking-[0.2em]">Pcap Analysis Summary</h3>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-5 py-2 bg-[#5cb85c] text-white text-[10px] font-black uppercase rounded-lg shadow-lg hover:bg-green-600 transition-all flex items-center gap-2">
                       <Download className="w-3.5 h-3.5" /> Download PCAP
                    </button>
                    <button onClick={() => setShowCaptureResults(false)} className="px-5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-black uppercase rounded-lg border hover:bg-zinc-200 transition-all">New Capture</button>
                 </div>
              </div>

              <div className="p-8 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl">
                       <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Packets</p>
                       <h4 className="text-3xl font-black text-emerald-700 tracking-tighter">{packetsCaptured}</h4>
                       <p className="text-[10px] text-emerald-600/60 font-bold">Captured in 5.2s</p>
                    </div>
                    <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl">
                       <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Data Volume</p>
                       <h4 className="text-3xl font-black text-blue-700 tracking-tighter">{captureSize.toFixed(2)} MB</h4>
                       <p className="text-[10px] text-blue-600/60 font-bold">Avg flow: 2.1 Mbps</p>
                    </div>
                    <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 p-6 rounded-2xl">
                       <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Interface</p>
                       <h4 className="text-3xl font-black text-zinc-800 dark:text-zinc-100 tracking-tighter italic">eth0</h4>
                       <p className="text-[10px] text-zinc-400 font-bold tracking-widest">MTU: 1500</p>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Activity className="w-4 h-4" /> Top Traffic Flows (Talkers)
                    </h4>
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                       <table className="w-full text-left text-[11px]">
                          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                             <tr>
                                <th className="px-6 py-4 font-black uppercase text-zinc-400 tracking-widest">Source IP</th>
                                <th className="px-6 py-4 font-black uppercase text-zinc-400 tracking-widest text-center italic">Direction</th>
                                <th className="px-6 py-4 font-black uppercase text-zinc-400 tracking-widest">Destination IP</th>
                                <th className="px-6 py-4 font-black uppercase text-zinc-400 tracking-widest text-right">Packets</th>
                                <th className="px-6 py-4 font-black uppercase text-zinc-400 tracking-widest text-right">Size</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-bold">
                             {[
                               { src: '192.168.1.10', dst: '10.0.0.5', pkts: '542', size: '245 KB', color: 'text-blue-500' },
                               { src: '10.0.0.5', dst: '192.168.1.10', pkts: '412', size: '180 KB', color: 'text-emerald-500' },
                               { src: '192.168.1.45', dst: '8.8.8.8', pkts: '124', size: '42 KB', color: 'text-zinc-500' },
                               { src: '192.168.1.10', dst: '1.1.1.1', pkts: '82', size: '12 KB', color: 'text-zinc-500' },
                             ].map((row, i) => (
                               <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                                  <td className="px-6 py-4 font-mono text-zinc-700 dark:text-zinc-300">{row.src}</td>
                                  <td className="px-6 py-4 text-center">
                                     <ArrowRight className="w-3.5 h-3.5 mx-auto text-zinc-300" />
                                  </td>
                                  <td className="px-6 py-4 font-mono text-zinc-700 dark:text-zinc-300">{row.dst}</td>
                                  <td className="px-6 py-4 text-right">{row.pkts}</td>
                                  <td className={cn("px-6 py-4 text-right", row.color)}>{row.size}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>

                 <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-6 rounded-2xl flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                       <h5 className="text-[11px] font-black text-amber-700 uppercase tracking-widest mb-1">Anomaly Detection</h5>
                       <p className="text-xs text-amber-600/80 font-bold italic leading-relaxed">
                          Potential retransmissions detected on outbound flow to 10.0.0.5. Current latency variation: 12ms. 
                          This may indicate upstream carrier congestion.
                       </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
             </div>
             <h3 className="text-[11px] font-black uppercase text-zinc-500 tracking-[0.2em]">TCP DUMP CAPTURE ENGINE</h3>
          </div>
          <button 
            onClick={handleStartCapture}
            disabled={isCapturing}
            className="px-8 py-2 bg-zinc-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isCapturing ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            {isCapturing ? 'Capturing Packets...' : 'Start Global Capture'}
          </button>
        </div>
        <div className="p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-10 text-left">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Traffic Filter (BPF Expression)</label>
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                   <input type="text" placeholder="e.g. host 192.168.1.1 and port 80" className="w-full h-11 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold font-mono focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Network Interface</label>
                <select className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none cursor-pointer">
                  <option>eth0 (Primary Public)</option>
                  <option>eth1 (Internal LAN)</option>
                  <option>lo (Loopback)</option>
                  <option>any (Mixed Mode)</option>
                </select>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Max Packet Limit</label>
                    <input type="number" defaultValue={100} className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold font-mono outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Snaplen (Bytes)</label>
                    <input type="number" defaultValue={65535} className="w-full h-11 px-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold font-mono outline-none" />
                 </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Output Filename</label>
                <div className="relative">
                   <Download className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                   <input type="text" defaultValue={`audit_log_${new Date().getTime()}.pcap`} className="w-full h-11 pl-12 pr-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center justify-between mb-6">
               <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">LIVE CAPTURE MONITOR</h4>
               {isCapturing && (
                 <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                       <div className="w-1 h-3 bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-1 h-5 bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-1 h-2 bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                       <div className="w-1 h-4 bg-blue-500 animate-bounce" style={{ animationDelay: '450ms' }} />
                    </div>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Listening...</span>
                 </div>
               )}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
                      <Zap className="w-24 h-24" />
                   </div>
                   <div className="space-y-1 relative z-10">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Packets</span>
                      <h5 className="text-4xl font-black text-zinc-800 dark:text-zinc-100 font-mono tracking-tighter">{packetsCaptured}</h5>
                   </div>
                   <div className="text-right flex flex-col gap-1 relative z-10">
                      <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">Live Stream</span>
                      <span className="text-[10px] font-bold text-zinc-400 italic">Frames/sec: 142</span>
                   </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between group overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform text-blue-500">
                      <Globe className="w-24 h-24" />
                   </div>
                   <div className="space-y-1 relative z-10">
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payload Size</span>
                      <h5 className="text-4xl font-black text-zinc-800 dark:text-zinc-100 font-mono tracking-tighter">{captureSize.toFixed(1)} <span className="text-lg">MB</span></h5>
                   </div>
                   <div className="text-right flex flex-col gap-1 relative z-10">
                      <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">Storage Sync</span>
                      <span className="text-[10px] font-bold text-zinc-400 italic">Available: 4.2 GB</span>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function ReportFormView({ title, theme, onBack }: SectionFormProps) {
  const [showColumns, setShowColumns] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('Customer');
  
  const effectiveTitle = title.includes(' / ') ? title.split(' / ').pop()! : title;

  const specializedReports = [
    'Client Message Log', 'Supplier Message Log', 'Client Summary', 'Supplier Summary',
    'CDR Summary', 'Client Success Summary', 'Supplier Success Summary',
    'Routing Wise Fail Summary', 'Bilateral Report', 
    'Inbound Audit Log', 'Outbound Audit Log', 
    'Inbound TPS Detail', 'Outbound TPS Detail',
    'Inbound DLR Resend', 'Customized DLR Inbound', 'Schedule DLR Inbound',
    'DLR Status Report', 'DLR Advance Search Report Client', 'DLR Advance Search Report Supplier', 'DLR Analysis Report',
    'Country-Supplier Rate Analysis', 'Rate Analysis Report', 'Supplier Rate Sheet', 'Supplier Auto Rate Sheet Report',
    'Email Notification Report', 'Top Users', 'Negative Margin Report'
  ];

  const trafficInsightReports = ['Route Simulator', 'TCP Dump', 'Network Diagnosis'];

  if (specializedReports.includes(effectiveTitle)) {
    return <SpecializedReportForm title={title} theme={theme} onBack={onBack} />;
  }

  if (trafficInsightReports.includes(effectiveTitle)) {
    return <TrafficInsightsFormView title={title} theme={theme} />;
  }

  if (effectiveTitle === 'Analytics Report') {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{title}</h3>
          <div className="flex items-center gap-2">
             <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600">Search</button>
             <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600">Export Top</button>
             <button className="px-5 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600">Export Bottom</button>
          </div>
        </div>
        <div className="p-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                 <FormRow label="Period">
                    <select className="flex-1 px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                      <option>Daily</option>
                      <option>Monthly</option>
                    </select>
                 </FormRow>
                 <FormRow label="From Date" required>
                    <input type="date" defaultValue="2026-04-30" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" />
                 </FormRow>
                 <FormRow label="To Date" required>
                    <input type="date" defaultValue="2026-04-30" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" />
                 </FormRow>
              </div>
              <div className="space-y-4">
                 <FormRow label="From Hour">
                    <select className="flex-1 px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                      {Array.from({ length: 24 }, (_, i) => <option key={i}>{i.toString().padStart(2, '0')}</option>)}
                    </select>
                 </FormRow>
                 <FormRow label="To Hour">
                    <select className="flex-1 px-3 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-xs" defaultValue="23">
                      {Array.from({ length: 24 }, (_, i) => <option key={i}>{i.toString().padStart(2, '0')}</option>)}
                    </select>
                 </FormRow>
              </div>
              <div className="space-y-4">
                 <FormRow label="Analytics Type">
                    <MultiSelect options={['Customer', 'Vendor', 'Trunk', 'Product']} count={4} />
                 </FormRow>
                 <FormRow label="Product">
                    <MultiSelect options={['SMS', 'Short-Code', 'OTT']} count={12} />
                 </FormRow>
                 <FormRow label="Enterprise">
                    <MultiSelect options={['Alpha (38)', 'Beta (72)', 'Gamma (70)']} count={150} />
                 </FormRow>
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (effectiveTitle === 'Schedule Report') {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300 min-h-[400px]">
        <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{title} <span className="text-zinc-400 font-normal">/ Add</span></h3>
          <div className="flex gap-2">
            <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all flex items-center gap-2">
              <Save className="w-3.5 h-3.5" /> Save
            </button>
            <button className="px-6 py-1.5 bg-[#555] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-zinc-600 transition-all">Back</button>
          </div>
        </div>
        <div className="p-10 space-y-6">
           <div className="max-w-4xl mx-auto space-y-6">
              <FormRow label="Name" required>
                 <input type="text" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" />
              </FormRow>
              <FormRow label="REPORT TEMPLATE" required>
                 <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                    <option>Select</option>
                    <option>Daily Traffic Report</option>
                    <option>Vendor Performance</option>
                 </select>
              </FormRow>
              <FormRow label="Frequency" required>
                 <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                 </select>
              </FormRow>
              <FormRow label="Start Date" required>
                 <input type="date" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs" />
              </FormRow>
              <FormRow label="Delivery Method">
                 <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-bold"><input type="checkbox" className="w-4 h-4" /> Email</label>
                    <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-bold"><input type="checkbox" className="w-4 h-4" /> FTP</label>
                 </div>
              </FormRow>
           </div>
        </div>
      </div>
    );
  }

  const mockData = [
    { period: '2026-04-30', att: '1,245,000', del: '1,182,750 (95%)', fail: '62,250 (5%)', bill: '1,200,000', cost: '$2,400.00', margin: '$360.00 (15%)' },
    { period: '2026-04-29', att: '1,150,000', del: '1,092,500 (95%)', fail: '57,500 (5%)', bill: '1,100,000', cost: '$2,200.00', margin: '$330.00 (15%)' },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900">
        <h3 className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowColumns(!showColumns)}
              className="px-4 py-1.5 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2 transition-all"
            >
              Column Selection <span className="bg-[#428bca] text-white px-1 rounded text-[8px]">27</span> <ChevronDown className="w-3 h-3" />
            </button>
            {showColumns && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl z-50 p-2 max-h-64 overflow-auto animate-in fade-in slide-in-from-top-2 border-t-2 border-t-[#428bca]">
                {['Attempts', 'Successfull', 'Billable(Customer)', 'Billable(Vendor)', 'Submitted'].map(col => (
                  <label key={col} className="flex items-center gap-2 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded cursor-pointer text-[10px] font-medium">
                    <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#428bca]" />
                    {col}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button className="px-6 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all">Go</button>
        </div>
      </div>

      <div className="p-0 space-y-px">
        {/* Search Criteria Block */}
        <section className="p-10 border-b border-zinc-100 dark:border-zinc-800">
           <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">SEARCH CRITERIA</h4>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6">
              <div className="space-y-4">
                 <FormRow label="Timezone">
                    <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500">
                      <option>(GMT) Western Europe Time, London, Lisbon, Casablanca</option>
                    </select>
                 </FormRow>
                 <FormRow label="From Date" required>
                    <div className="flex-1 flex gap-2">
                       <input type="date" defaultValue="2026-04-30" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                       <select className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                          {Array.from({ length: 24 }, (_, i) => <option key={i}>{i.toString().padStart(2, '0')}</option>)}
                       </select>
                    </div>
                 </FormRow>
                 <FormRow label="To Date" required>
                    <div className="flex-1 flex gap-2">
                       <input type="date" defaultValue="2026-04-30" className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                       <select defaultValue="23" className="w-24 px-2 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                          {Array.from({ length: 24 }, (_, i) => <option key={i}>{i.toString().padStart(2, '0')}</option>)}
                       </select>
                    </div>
                 </FormRow>

                 {title === 'Usage Enterprise' && (
                   <>
                    <FormRow label="Enterprise Type">
                       <div className="flex items-center gap-4 py-1">
                          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                             <input type="radio" name="ent_type" className="accent-[#428bca]" defaultChecked /> Customer
                          </label>
                          <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                             <input type="radio" name="ent_type" className="accent-[#428bca]" /> Vendor
                          </label>
                       </div>
                    </FormRow>
                    <FormRow label="Enterprise">
                       <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                          <option>Select</option>
                       </select>
                    </FormRow>
                    <FormRow label="Trunk">
                       <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                          <option>Select</option>
                       </select>
                    </FormRow>
                   </>
                 )}

                 {title === 'Master Grouping' && (
                    <FormRow label="Level">
                       <MultiSelect 
                          options={['Date', 'Hour', 'Customer', 'Customer Trunk', 'Customer IP Address', 'Customer Destination', 'Customer Country']} 
                          count={12}
                       />
                    </FormRow>
                 )}
              </div>

              <div className="space-y-4">
                 {title === 'Usage Enterprise' && (
                   <>
                    <FormRow label="MCCMNC">
                       <textarea rows={3} placeholder="Comma separated..." className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                    </FormRow>
                    <FormRow label="Account Manager">
                       <MultiSelect 
                          options={['a b (47)', 'A demo A demo (143)', 'A J (118)', 'a.yehya gabs (109)']} 
                          count={142}
                       />
                    </FormRow>
                   </>
                 )}
                 <FormRow label="Type">
                    <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs">
                       <option>Select</option>
                    </select>
                 </FormRow>
              </div>
           </div>
        </section>

        {/* Search Information Block */}
        {title === 'Master Grouping' && (
           <section className="p-10">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">SEARCH INFORMATION</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="space-y-4 col-span-1 md:col-span-2">
                    <FormRow label="Search info" labelSize="min-w-[100px]">
                       <textarea rows={4} placeholder="Comma separated..." className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:border-blue-500" />
                    </FormRow>
                 </div>
                 <div className="hidden lg:block"></div>
                 <div className="space-y-4">
                    <FormRow label="Customer" labelSize="min-w-[100px]">
                       <select className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs outline-none focus:border-blue-500">
                          <option>Select</option>
                       </select>
                    </FormRow>
                    <FormRow label="Vendor" labelSize="min-w-[100px]">
                       <select className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs outline-none focus:border-blue-500">
                          <option>Select</option>
                       </select>
                    </FormRow>
                    <FormRow label="Customer IP" labelSize="min-w-[100px]">
                       <input type="text" placeholder="Customer IP" className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs outline-none focus:border-blue-500" />
                    </FormRow>
                 </div>

                 <div className="space-y-4">
                    <FormRow label="Trunk" labelSize="min-w-[100px]">
                       <select className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs outline-none focus:border-blue-500">
                          <option>Select</option>
                       </select>
                    </FormRow>
                    <FormRow label="Trunk" labelSize="min-w-[100px]">
                       <select className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs outline-none focus:border-blue-500">
                          <option>Select</option>
                       </select>
                    </FormRow>
                    <FormRow label="Vendor IP" labelSize="min-w-[100px]">
                       <input type="text" placeholder="Vendor IP" className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded text-xs outline-none focus:border-blue-500" />
                    </FormRow>
                 </div>

                 <div className="space-y-4">
                    <FormRow label="Destination" labelSize="min-w-[100px]">
                       <div className="flex-1 flex gap-px">
                          <select className="w-24 px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-l text-xs outline-none">
                             <option>equals</option>
                             <option>contains</option>
                          </select>
                          <input type="text" placeholder="Destination" className="flex-1 px-2 py-1.5 bg-zinc-50 border border-zinc-200 text-xs outline-none focus:border-blue-500" />
                          <input type="text" placeholder="MCCMNC" className="w-24 px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-r text-xs outline-none focus:border-blue-500" />
                       </div>
                    </FormRow>
                    <FormRow label="Destination" labelSize="min-w-[100px]">
                       <div className="flex-1 flex gap-px">
                          <select className="w-24 px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-l text-xs outline-none">
                             <option>equals</option>
                             <option>contains</option>
                          </select>
                          <input type="text" placeholder="Destination" className="flex-1 px-2 py-1.5 bg-zinc-50 border border-zinc-200 text-xs outline-none focus:border-blue-500" />
                          <input type="text" placeholder="MCCMNC" className="w-24 px-2 py-1.5 bg-zinc-50 border border-zinc-200 rounded-r text-xs outline-none focus:border-blue-500" />
                       </div>
                    </FormRow>
                 </div>
              </div>

              {title === 'Master Grouping' && (
                <div className="mt-8 max-w-sm">
                   <FormRow label="Customer Account Manager" labelSize="min-w-[200px]">
                      <MultiSelect 
                         options={['a b (47)', 'A demo A demo (143)', 'A J (118)', 'a.yehya gabs (109)']} 
                         count={142}
                      />
                   </FormRow>
                </div>
              )}
           </section>
        )}
      </div>
    </div>
  );
}

function FormRow({ label, required, labelSize = "min-w-[150px]", children }: { label: string; required?: boolean; labelSize?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <label className={cn("text-[11px] font-black uppercase text-zinc-400 tracking-wider font-mono text-right", labelSize)}>
        {label} {required && <span className="text-red-500 font-bold">*</span>} :
      </label>
      {children}
    </div>
  );
}

function MultiSelect({ options, count }: { options: string[], count: number }) {
  return (
    <div className="flex-1 border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
      <div className="max-h-24 overflow-auto p-1 bg-white dark:bg-zinc-900 custom-scrollbar">
        {options.map(item => (
          <label key={item} className="flex items-center gap-2 text-[10px] text-zinc-600 dark:text-zinc-500 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-1 rounded">
            <input type="checkbox" className="w-3 h-3 accent-[#428bca]" />
            {item}
          </label>
        ))}
      </div>
      <div className="bg-zinc-50 dark:bg-zinc-800 p-1 flex items-center gap-1 border-t border-zinc-200 dark:border-zinc-700">
        <input type="text" placeholder="Search" className="flex-1 px-2 py-1 text-[10px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 outline-none rounded" />
        <div className="px-2 text-[9px] font-bold text-zinc-400 whitespace-nowrap">Selected 0 of {count}</div>
        <button className="px-2 py-1 bg-[#428bca] text-white rounded shadow-sm hover:bg-blue-600"><Check className="w-2.5 h-2.5" /></button>
        <button className="px-2 py-1 bg-[#428bca] text-white rounded shadow-sm hover:bg-blue-600"><Square className="w-2.5 h-2.5" /></button>
      </div>
    </div>
  );
}


export function DLRRequestForm({ onClose, theme }: ModalFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">DLR DOWNLOAD REQUEST</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'REPORT NAME', type: 'text' },
          { label: 'FORMAT', type: 'select', options: ['CSV', 'Excel', 'Text'] },
          { label: 'FROM DATE', type: 'datetime-local' },
          { label: 'TO DATE', type: 'datetime-local' },
          { label: 'ENTERPRISE', type: 'select', options: ['All', 'ABC', 'TeleOSS'] },
          { label: 'TRUNK', type: 'select', options: ['All', 'Trunk 1', 'Trunk 2'] },
        ].map((field) => (
          <div key={field.label} className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{field.label}</label>
            {field.type === 'select' ? (
              <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                {field.options?.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            ) : field.type === 'datetime-local' ? (
              <input type="datetime-local" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            ) : (
              <input type="text" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
            )}
          </div>
        ))}
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-blue-600 transition-all active:scale-95">Request</button>
      </div>
    </div>
  );
}

export function AddDLRTemplateForm({ onClose, theme }: ModalFormProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">ADD DLR TEMPLATE</h3>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">TEMPLATE NAME</label>
            <input type="text" className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">DELIMITER</label>
            <select className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              <option>Comma (,)</option>
              <option>Pipe (|)</option>
              <option>Tab (\t)</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">AVAILABLE FIELDS</label>
          <div className="h-48 overflow-auto border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 bg-zinc-50 dark:bg-zinc-800">
             {['Msg ID', 'Sender ID', 'DNID', 'Status', 'Submit Date', 'Done Date', 'Error Code', 'MCCMNC', 'Rate', 'Cost'].map(f => (
               <label key={f} className="flex items-center gap-2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded cursor-pointer text-xs">
                 <input type="checkbox" className="w-3.5 h-3.5" />
                 <span>{f}</span>
               </label>
             ))}
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Cancel</button>
        <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-blue-600 transition-all active:scale-95">Save</button>
      </div>
    </div>
  );
}
