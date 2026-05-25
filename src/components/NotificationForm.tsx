import React from 'react';
import { X, Save, Bell, Mail, MessageSquare, Globe, Plus, Trash2, AlertCircle, Square } from 'lucide-react';
import { cn } from '../lib/utils';

interface NotificationFormProps {
  onClose: () => void;
  theme?: 'light' | 'dark';
}

const NOTIFICATION_TYPES = [
  { id: 'rate_change', label: 'Rate Change Notification', icon: Bell },
  { id: 'low_balance', label: 'Low Balance Alert', icon: AlertCircle },
  { id: 'route_quality', label: 'Route Quality (SR/DLR)', icon: Globe },
  { id: 'margin_safeguard', label: 'Margin Safeguard Alert', icon: AlertCircle },
  { id: 'traffic_anomaly', label: 'Traffic Volume Spike/Drop', icon: Globe },
  { id: 'latency_alert', label: 'High Latency / DLR Delay', icon: Bell },
  { id: 'system_health', label: 'System Health Notification', icon: Bell },
  { id: 'mccmnc_monitor', label: 'MCCMNC Specific Monitor', icon: Globe },
];

const CONFIG_MODELS: Record<string, { metrics: string[], operators: string[], units: string[], defaultConditions: any[] }> = {
  rate_change: {
    metrics: ['Rate Update Count', 'Specific Destination Rate', 'Bulk Rate Upload', 'New Destination Added', 'Rate Increase %', 'Rate Decrease %'],
    operators: ['>', 'Changes By %', 'Effective Within', 'Increased By', 'Decreased By'],
    units: ['Rates', '%', 'Days', '$', 'per SMS'],
    defaultConditions: [{ metric: 'Rate Update Count', operator: '>', value: '100', unit: 'Rates' }]
  },
  low_balance: {
    metrics: ['Available Balance', 'Credit Limit Usage', 'Daily Spend', 'Days Remaining', 'Balance Velocity'],
    operators: ['<', '>', '=', 'Below %', 'Drop in last 1hr'],
    units: ['USD', '%', 'Days', 'USD/hr'],
    defaultConditions: [{ metric: 'Available Balance', operator: '<', value: '100', unit: 'USD' }]
  },
  route_quality: {
    metrics: ['Success Rate (SR)', 'DLR Ratio', 'Avg PDD (Latency)', 'ASR', 'Error 404 Count', 'Error 50x Count', 'MO Submission Rate'],
    operators: ['<', '>', 'Drops By %', 'Below Average', 'Spikes By %', 'Consecutive Failures >'],
    units: ['%', 'ms', 'Count', 'Failures'],
    defaultConditions: [{ metric: 'Success Rate (SR)', operator: '<', value: '45', unit: '%' }]
  },
  margin_safeguard: {
    metrics: ['Profit Margin', 'Cost Per SMS', 'Selling Price', 'Revenue Drop', 'Negative Margin Routes'],
    operators: ['<', '>', 'Negative', 'Decreased By %', 'Alert on Any Negative'],
    units: ['%', '$', 'USD', 'Routes'],
    defaultConditions: [{ metric: 'Profit Margin', operator: '<', value: '2', unit: '%' }]
  },
  traffic_anomaly: {
    metrics: ['Current TPS', 'Total Volume', 'Concurrent Sessions', 'Retry Count', 'Submission Spike', 'DLR Queue Depth'],
    operators: ['Spikes By %', 'Drops By %', '>', '<', 'Double vs Prev Hour', 'Zero Traffic Detected'],
    units: ['%', 'TPS', 'Count', 'SMS'],
    defaultConditions: [{ metric: 'Total Volume', operator: 'Drops By %', value: '30', unit: '%' }]
  },
  latency_alert: {
    metrics: ['DLR Latency', 'API Response Time', 'MO-MT Delay', 'Network Delay', 'Handshake Time'],
    operators: ['>', 'Higher Than Avg', 'Consistently >', 'Increasing Trend'],
    units: ['ms', 'sec', '%'],
    defaultConditions: [{ metric: 'DLR Latency', operator: '>', value: '5000', unit: 'ms' }]
  },
  system_health: {
    metrics: ['CPU Usage', 'Memory Usage', 'Disk I/O', 'Queue Depth', 'Active Threads', 'DB Connections'],
    operators: ['>', 'Critical For', 'Reached Threshold', 'OOM Predicted'],
    units: ['%', 'MB/s', 'Units', 'Connections'],
    defaultConditions: [{ metric: 'CPU Usage', operator: '>', value: '90', unit: '%' }]
  },
  mccmnc_monitor: {
    metrics: ['Success Rate', 'Volume', 'Blocked Count', 'Latency', 'DLR Failure %'],
    operators: ['<', '>', 'Zero Traffic', 'Outage Detected', 'Route Down'],
    units: ['%', 'Count', 'ms'],
    defaultConditions: [{ metric: 'Success Rate', operator: '<', value: '10', unit: '%' }]
  }
};

export function NotificationForm({ onClose, theme }: NotificationFormProps) {
  const [activeType, setActiveType] = React.useState('route_quality');
  const [channels, setChannels] = React.useState(['Email', 'Dashboard Strike']);
  
  const currentModel = CONFIG_MODELS[activeType] || CONFIG_MODELS.route_quality;
  const [conditions, setConditions] = React.useState(currentModel.defaultConditions);

  React.useEffect(() => {
    setConditions(currentModel.defaultConditions);
  }, [activeType, currentModel.defaultConditions]);

  const addCondition = () => {
    setConditions([...conditions, { 
      metric: currentModel.metrics[0], 
      operator: currentModel.operators[0], 
      value: '0', 
      unit: currentModel.units[0] 
    }]);
  };

  const removeCondition = (idx: number) => {
    setConditions(conditions.filter((_, i) => i !== idx));
  };

  const toggleChannel = (channel: string) => {
    setChannels(prev => 
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  return (
    <div className={cn(
      "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 w-full max-w-5xl max-h-[90vh] flex flex-col",
      theme === 'dark' ? 'dark' : ''
    )}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300">Detailed Notification Configuration</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Configure events and delivery channels</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-6 py-1.5 bg-brand-500 text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-brand-600 transition-all flex items-center gap-2">
            <Save className="w-3.5 h-3.5" /> Save Configuration
          </button>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Sidebar - Types */}
        <div className="w-64 border-r border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 overflow-auto p-4 space-y-1">
          <label className="px-3 text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-2 block">Notification Event Types</label>
          {NOTIFICATION_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left group",
                activeType === type.id 
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20" 
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              )}
            >
              <type.icon className={cn("w-4 h-4", activeType === type.id ? "text-white" : "text-zinc-400 group-hover:text-zinc-600")} />
              <span className="text-xs font-bold font-mono tracking-tight">{type.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 bg-zinc-50/10 dark:bg-zinc-900/10">
          <div className="max-w-3xl mx-auto space-y-10">
            
            {/* General Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] whitespace-nowrap">Source Configuration</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Notification Name</label>
                  <input 
                    type="text" 
                    defaultValue={`${NOTIFICATION_TYPES.find(t => t.id === activeType)?.label} - Wholesale`}
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Trunk Type Filter</label>
                  <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                    <option>All Trunks</option>
                    <option>Customer Trunks Only</option>
                    <option>Vendor Trunks Only</option>
                    <option>Direct Connections</option>
                  </select>
                </div>
              </div>

              {(activeType === 'route_quality' || activeType === 'mccmnc_monitor' || activeType === 'latency_alert') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Target MCCMNC / Country</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 404, 40401, 234"
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Monitoring Interval</label>
                    <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                      <option>Last 1 Minute (Reactive)</option>
                      <option>Last 5 Minutes (Stabilized)</option>
                      <option>Last 15 Minutes</option>
                      <option>Hourly Aggregation</option>
                    </select>
                  </div>
                </div>
              )}

              {activeType === 'low_balance' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Currency</label>
                    <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                      <option>USD - United States Dollar</option>
                      <option>EUR - Euro</option>
                      <option>GBP - British Pound</option>
                      <option>INR - Indian Rupee</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Auto-Topup Link (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="https://billing.portal.com/topup"
                      className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold"
                    />
                  </div>
                </div>
              )}

              {activeType === 'system_health' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Server ID / Cluster</label>
                    <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                      <option>All Systems</option>
                      <option>Gateway Cluster A</option>
                      <option>DB Node 01</option>
                      <option>Web Facing Cluster</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Reboot Policy</label>
                    <div className="flex gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                       <button className="flex-1 py-1 text-[9px] font-black uppercase rounded bg-brand-500 text-white">Manual Only</button>
                       <button className="flex-1 py-1 text-[9px] font-black uppercase rounded bg-white dark:bg-zinc-900 text-zinc-400">Auto Heal</button>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Smart Trigger Rules Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] whitespace-nowrap text-amber-500">Trigger Conditions (Thresholds)</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="space-y-3">
                {conditions.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center bg-white dark:bg-zinc-800 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700 animate-in slide-in-from-left-2">
                    <select className="flex-1 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] font-bold">
                      <option>{item.metric}</option>
                      {currentModel.metrics.filter(m => m !== item.metric).map(m => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                    <select className="w-24 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] font-bold">
                      <option>{item.operator}</option>
                      {currentModel.operators.filter(o => o !== item.operator).map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <div className="relative w-32">
                      <input 
                        type="text" 
                        defaultValue={item.value}
                        className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[11px] font-black text-brand-500 font-mono"
                      />
                      <select className="absolute right-1 top-1 text-[9px] bg-transparent font-black text-zinc-400 border-none outline-none">
                        <option>{item.unit}</option>
                        {currentModel.units.filter(u => u !== item.unit).map(u => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={() => removeCondition(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={addCondition}
                  className="w-full py-3 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-400 hover:border-brand-500/30 hover:text-brand-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Trigger Logic (AND)
                </button>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-500/5 rounded-xl border border-blue-500/10">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                <p className="text-[10px] font-bold text-blue-600/80">Alert will fire only when ALL conditions above are met within the Monitoring Interval.</p>
              </div>
            </section>

            {/* Advanced Remediation Actions */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.3em] whitespace-nowrap">Auto-Remediation Actions (Advanced)</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Automated Route Response</h5>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">System will automatically execute these steps on alert</p>
                  </div>
                  <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <button className="px-3 py-1 text-[9px] font-black uppercase rounded bg-white dark:bg-zinc-800 shadow-sm text-brand-500">Disabled</button>
                    <button className="px-3 py-1 text-[9px] font-black uppercase text-zinc-400 hover:text-zinc-600">Enabled</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-between group hover:border-brand-500/30 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                           <Globe className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">Switch to Backup</p>
                           <p className="text-[9px] font-medium text-zinc-500">Auto-route to 2nd Best Profit</p>
                        </div>
                     </div>
                     <Square className="w-4 h-4 text-zinc-300" />
                  </div>

                  <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl flex items-center justify-between group hover:border-rose-500/30 transition-all cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                           <AlertCircle className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-[11px] font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-200">Block Trunk/IP</p>
                           <p className="text-[9px] font-medium text-zinc-500">Halt submission immediately</p>
                        </div>
                     </div>
                     <Square className="w-4 h-4 text-zinc-300" />
                  </div>
                </div>
              </div>
            </section>

            {/* Severity & Escalation Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] whitespace-nowrap">Throttle & Suppression</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Alert Suppression (Mute)</label>
                  <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                    <option>No Throttling (Every Match)</option>
                    <option>Max 1 Alert per 5 Mins</option>
                    <option>Max 1 Alert per 30 Mins</option>
                    <option>Max 1 Alert per 1 Hour</option>
                    <option>Once per Day</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Trigger After N Cycles</label>
                  <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                    <option>Immediately on first match</option>
                    <option>After 3 consecutive matches</option>
                    <option>After 5 matches in 15 mins</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] whitespace-nowrap">Severity & Escalation</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Alert Severity</label>
                  <div className="flex gap-2">
                    {[
                      { label: 'Critical', color: 'rose' },
                      { label: 'Warning', color: 'amber' },
                      { label: 'Info', color: 'blue' }
                    ].map(s => (
                      <button 
                        key={s.label} 
                        className={cn(
                          "flex-1 py-2 text-[10px] font-black uppercase rounded-lg border-2 transition-all",
                          s.label === 'Warning' 
                            ? `border-${s.color}-500 bg-${s.color}-500/5 text-${s.color}-500` 
                            : `border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-${s.color}-500/20 hover:text-${s.color}-500`
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Escalation Policy</label>
                  <select className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold">
                    <option>No Escalation</option>
                    <option>Escalate after 30 mins to Admin</option>
                    <option>Escalate after 1 hour to Management</option>
                    <option>Immediate Notification to NOC Head</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Delivery Channels */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] whitespace-nowrap">Channels & Recipients</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Email', icon: Mail, color: 'blue' },
                  { name: 'SMS', icon: MessageSquare, color: 'emerald' },
                  { name: 'Dashboard Strike', icon: Bell, color: 'rose' },
                  { name: 'Webhook', icon: Globe, color: 'amber' }
                ].map(channel => (
                  <button
                    key={channel.name}
                    onClick={() => toggleChannel(channel.name)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                      channels.includes(channel.name)
                        ? `border-brand-500 bg-brand-500/5`
                        : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-white dark:bg-zinc-800/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      channels.includes(channel.name) ? "bg-brand-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    )}>
                      <channel.icon className="w-4 h-4" />
                    </div>
                    <span className={cn("text-xs font-black uppercase tracking-wider font-mono", channels.includes(channel.name) ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-400 group-hover:text-zinc-600")}>
                      {channel.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Recipient Groups / Emails</label>
                <div className="flex flex-wrap gap-2 p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                  {['NOC Team', 'Account Manager', 'Finance Head', 'support@abc-corp.com'].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 border border-zinc-200 dark:border-zinc-600">
                      {tag} <Trash2 className="w-3 h-3 cursor-pointer hover:text-rose-500" />
                    </span>
                  ))}
                  <button className="px-3 py-1 bg-brand-500/10 text-brand-500 rounded-lg text-[9px] font-black uppercase flex items-center gap-2 border border-brand-500/20 hover:bg-brand-500/20">
                    <Plus className="w-3 h-3" /> Add Recipient
                  </button>
                </div>
              </div>
            </section>

            {/* Template Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
                <h4 className="text-[10px] font-black uppercase text-brand-500 tracking-[0.3em] whitespace-nowrap">Template Configuration</h4>
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Message Subject</label>
                  <input 
                    type="text" 
                    defaultValue="Important: [EVENT_TYPE] Notification for [ENTERPRISE_NAME]"
                    className="w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest font-mono">Body Template</label>
                    <div className="flex gap-2">
                      {['[DATE]', '[TIME]', '[VALUE]', '[LIMIT]'].map(tag => (
                        <button key={tag} className="text-[8px] font-black text-brand-500 hover:bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20 transition-all">{tag}</button>
                      ))}
                    </div>
                  </div>
                  <textarea 
                    rows={6} 
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono"
                    defaultValue={`Dear [ENTERPRISE_NAME],

This is an automated notification to inform you that a [EVENT_TYPE] has occurred on [DATE] at [TIME].

Details:
Current Value: [VALUE]
Trigger Limit: [LIMIT]

Please take necessary actions.

Regards,
TeleOSS Support Team`}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase text-zinc-400 hover:text-zinc-600 transition-colors">Discard Changes</button>
        <button onClick={onClose} className="px-10 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-brand-500/25">Initialize Alert Rule</button>
      </div>
    </div>
  );
}
