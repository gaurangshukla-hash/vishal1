import React, { useState, useEffect } from 'react';
import { ExpandableTable } from './ExpandableTable';
import { MOCK_CLIENTS, MOCK_SUPPLIERS, TIME_OPTIONS } from '../constants';
import { TimeOption } from '../types';
import { cn, getTimeMultiplier, generateGraphData, getTimeRangeDisplay } from '../lib/utils';
import { LineChart as LineChartIcon, TrendingUp, Calendar, Zap, Download, RotateCcw, ShieldCheck } from 'lucide-react';
import { Popup } from './Popup';
import { DynamicRoutingForm } from './RouteForms';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface CommercialViewProps {
  subTab: 'Customers' | 'Suppliers' | 'Netting' | 'Margin' | 'Business';
  time: TimeOption;
  selectedExecutiveId?: string;
}

export const CommercialView: React.FC<CommercialViewProps> = ({ subTab, time, selectedExecutiveId }) => {
  const graphScrollRef = useDraggableScroll();
  const [graphPopup, setGraphPopup] = useState<{ title: string; data: any[]; localTime: TimeOption } | null>(null);
  const [routingModalCustomer, setRoutingModalCustomer] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'Line' | 'Bar' | 'Area'>('Line');
  const [nettingPeriod, setNettingPeriod] = useState<'Monthly' | 'Overall'>('Monthly');
  const [selectedNettingCustomer, setSelectedNettingCustomer] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setGraphPopup(prev => {
        if (prev && prev.localTime === 'Live') {
          return { ...prev, data: generateGraphData(24, 'Live') };
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  // Increase multiplier for Overall netting view
  const baseMultiplier = getTimeMultiplier(time);
  const liveFactor = time === 'Live' ? (1 + (Math.sin(tick * 0.5) * 0.02)) : 1;
  
  // For Netting and Margin, we use a fixed multiplier so time selection doesn't affect them
  const isNettingOrMargin = subTab === 'Netting' || subTab === 'Margin';
  const m = isNettingOrMargin 
    ? (subTab === 'Netting' && nettingPeriod === 'Overall' ? 120 : 10) 
    : baseMultiplier * liveFactor;

  const CUSTOMER_START_DATES: Record<string, string> = {
    'Global Connect Ltd': 'Mar 15, 2024',
    'Skyline Telecom': 'May 20, 2024',
    'Nexus SMS Solutions': 'Aug 10, 2024',
    'Prime Communications': 'Nov 05, 2024',
    'Vortex Networks': 'Feb 12, 2025'
  };

  const getColumns = () => {
    if (subTab === 'Netting') {
      return [
        { 
          header: 'Customer Name', 
          key: 'name',
          render: (val: string) => (
            <button 
              onClick={(e) => {
                e.stopPropagation(); // Prevent any parent row click effects
                if (nettingPeriod === 'Overall') {
                  setSelectedNettingCustomer(val);
                }
              }}
              className={cn(
                "text-left font-bold transition-colors relative z-10",
                nettingPeriod === 'Overall' ? "text-brand-500 hover:text-brand-600 underline decoration-brand-500/30 underline-offset-4" : "text-zinc-900 dark:text-white"
              )}
            >
              {val}
            </button>
          )
        },
        { header: 'Customer Billing', key: 'custBilling', render: (val: number) => '$' + val.toLocaleString() },
        { header: 'Provider Billing', key: 'provBilling', render: (val: number) => '$' + val.toLocaleString() },
        { 
          header: 'Netting (Diff)', 
          key: 'netting', 
          render: (val: number) => (
            <span className={val >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>
              {val >= 0 ? '+' : ''}${val.toLocaleString()}
            </span>
          )
        },
      ];
    }
    if (subTab === 'Margin') {
      return [
        { header: 'Employee Name', key: 'name' },
        { header: 'Buying Amt', key: 'buying', render: (val: number) => '$' + val.toLocaleString() },
        { header: 'Sales Amt', key: 'sales', render: (val: number) => '$' + val.toLocaleString() },
        { 
          header: 'Margin', 
          key: 'margin', 
          render: (val: number) => (
            <span className="text-emerald-500 font-bold">
              ${val.toLocaleString()}
            </span>
          )
        },
      ];
    }
    return [
      { header: subTab === 'Customers' ? 'Customers' : 'Suppliers', key: 'name' },
      { header: 'Attempts', key: 'attempts', render: (val: number) => val.toLocaleString() },
      { header: 'Successful', key: 'successful', render: (val: number) => val.toLocaleString() },
      { header: 'Billable (C)', key: 'billableC', render: (val: number) => val.toLocaleString() },
      { header: 'ASR %', key: 'asr' },
      { header: 'Delivered', key: 'delivered', render: (val: number) => val.toLocaleString() },
      { header: 'Total SMS Units', key: 'totalUnits', render: (val: number) => val.toLocaleString() },
      { 
        header: 'Trend', 
        key: 'trend', 
        render: (_, row: any) => (
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setGraphPopup({ 
                  title: `${row.name} Performance Trend`, 
                  data: row.sparkData || generateGraphData(24, time),
                  localTime: time
                });
              }}
              className="p-1.5 bg-brand-500/10 text-brand-500 rounded-lg hover:bg-brand-500/20 transition-colors"
                title="View Trend"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        ) 
      },
    ];
  };

  const data = React.useMemo(() => {
    const generateMockRow = (name: string, id: string, type: string): any => {
      let rand = Math.random();
      if (subTab === 'Netting' || subTab === 'Margin') {
        let hash = 0;
        const seedStr = name + id + subTab + (subTab === 'Netting' ? nettingPeriod : '');
        for (let i = 0; i < seedStr.length; i++) {
          hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        rand = 0.3 + (Math.abs(Math.sin(hash)) * 0.6);
      }
      const base = Math.floor(rand * 10000 * m);
      
      if (subTab === 'Netting') {
        const custBilling = base * 10;
        const provBilling = base * 8;
        const netting = custBilling - provBilling;
        return {
          id,
          data: { name, custBilling, provBilling, netting },
          children: undefined
        };
      }

      if (subTab === 'Margin') {
        const sales = base * 12;
        const buying = base * 9;
        const margin = sales - buying;
        return {
          id,
          data: { name, buying, sales, margin },
          children: () => {
            if (type === 'salesperson') return MOCK_CLIENTS.slice(0, 3).map((c, i) => generateMockRow(c.name, `${id}-c-${i}`, 'client'));
            if (type === 'client') return ['Premium Route', 'Direct Route'].map((p, i) => generateMockRow(p, `${id}-p-${i}`, 'product'));
            if (type === 'product') return ['USA', 'UK', 'India'].map((c, i) => generateMockRow(c, `${id}-country-${i}`, 'country'));
            return [];
          }
        };
      }

      return {
        id,
        data: {
          name,
          attempts: base,
          successful: Math.floor(base * 0.8),
          billableC: Math.floor(base * 0.7),
          asr: (Math.random() * 40 + 40).toFixed(2) + '%',
          delivered: Math.floor(base * 0.45),
          totalUnits: Math.floor(base * 1.2),
          sparkData: generateGraphData(12, time),
        },
        children: type === 'finalnode' ? undefined : () => {
          if (type === 'customer') {
            return ['Account 1', 'Account 2'].map((a, i) => generateMockRow(a, `${id}-a-${i}`, 'customeraccount'));
          }
          if (type === 'customeraccount') {
            return ['USA', 'UK', 'India'].map((c, i) => generateMockRow(c, `${id}-country-${i}`, 'customercountry'));
          }
          if (type === 'customercountry') {
            return MOCK_SUPPLIERS.slice(0, 2).map((s, i) => generateMockRow(s.name, `${id}-s-${i}`, 'finalnode'));
          }
          if (type === 'supplier') {
            return ['Account 1', 'Account 2'].map((a, i) => generateMockRow(a, `${id}-a-${i}`, 'supplieraccount'));
          }
          if (type === 'supplieraccount') {
            return ['USA', 'UK', 'India'].map((c, i) => generateMockRow(c, `${id}-country-${i}`, 'country'));
          }
          return [];
        }
      };
    };

    let result = [];
    if (subTab === 'Netting') {
      const entities = [
        { name: 'Global Connect Ltd', id: 'net-1' },
        { name: 'Skyline Telecom', id: 'net-2' },
        { name: 'Nexus SMS Solutions', id: 'net-3' },
        { name: 'Prime Communications', id: 'net-4' },
        { name: 'Vortex Networks', id: 'net-5' }
      ];
      result = entities.map((e) => generateMockRow(e.name, e.id, 'entity'));
    } else if (subTab === 'Margin') {
      const salespersons = ['John Smith', 'Sarah Wilson'];
      result = salespersons.map((s, i) => generateMockRow(s, `sp-${i}`, 'salesperson'));
    } else if (subTab === 'Customers') {
      result = MOCK_CLIENTS.slice(0, 5).map(c => generateMockRow(c.name, c.id, 'customer'));
    } else {
      result = MOCK_SUPPLIERS.slice(0, 5).map(s => generateMockRow(s.name, s.id, 'supplier'));
    }

    if (selectedExecutiveId && selectedExecutiveId !== 'all') {
      const seed = selectedExecutiveId === 'salesexecutive1' ? 0 : 5;
      return result.slice(seed, seed + 5);
    }

    return result;
  }, [subTab, time, m, selectedExecutiveId, nettingPeriod]);

  const handleExport = () => {
    if (!data || data.length === 0) return;
    
    // Extract column keys and headers (excluding 'Trend' action column)
    const activeColumns = columns.filter(col => col.header !== 'Trend' && col.key !== 'trend');
    const headers = activeColumns.map(col => col.header).join(',');
    
    // Extract row data
    const rows = data.map(item => {
      return activeColumns
        .map(col => {
          const val = item.data[col.key];
          if (val === undefined || val === null) return '';
          // Ensure string values with commas are quoted
          if (typeof val === 'string') {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(',');
    });
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${subTab}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = getColumns();

  return (
    <div className="space-y-3 md:space-y-8">
      {subTab === 'Netting' && (
        <div className="bg-white dark:bg-black p-2.5 md:p-4 rounded-lg md:rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5 md:gap-4 relative group overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-brand-500/10 transition-colors duration-700" />
          
          <div className="relative z-10 flex items-center gap-2.5 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-500/10 rounded-lg md:rounded-xl flex items-center justify-center border border-brand-500/20 shadow-lg shadow-brand-500/5">
              <Calendar className="w-4 md:w-5 h-4 md:h-5 text-brand-500" />
            </div>
            <div className="space-y-0">
              <h3 className="text-[8px] md:text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] md:tracking-[0.15em]">
                {selectedNettingCustomer ? `${selectedNettingCustomer} Period` : 'Netting Report Period'}
              </h3>
              <div className="flex items-center gap-1 md:gap-1.5">
                <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[10px] md:text-sm font-black text-zinc-900 dark:text-white font-mono tracking-tight">
                  {nettingPeriod === 'Monthly' ? (
                    `${new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString([], { month: 'short', day: 'numeric' })} - ${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}`
                  ) : (
                    selectedNettingCustomer 
                      ? `${CUSTOMER_START_DATES[selectedNettingCustomer] || 'Jan 01, 2024'} - ${new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : `Jan 01, 2024 - ${new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full lg:w-auto">
            <div className="flex bg-zinc-100 dark:bg-zinc-950 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 w-full lg:w-auto transition-colors">
              <button
                onClick={() => {
                  setNettingPeriod('Monthly');
                  setSelectedNettingCustomer(null);
                }}
                className={cn(
                  "flex-1 lg:flex-none px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md transition-all duration-300",
                  nettingPeriod === 'Monthly'
                    ? "bg-white dark:bg-black text-brand-500 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setNettingPeriod('Overall')}
                className={cn(
                  "flex-1 lg:flex-none px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-md transition-all duration-300",
                  nettingPeriod === 'Overall'
                    ? "bg-white dark:bg-black text-brand-500 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                )}
              >
                Overall
              </button>
            </div>
            
            <div className="hidden xl:block text-right border-l border-zinc-200 dark:border-zinc-800 pl-3">
              <p className="text-[8px] uppercase tracking-[0.1em] font-black text-zinc-400 dark:text-zinc-500">Status</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-500" />
                <p className="text-[9px] font-black text-zinc-900 dark:text-white uppercase tracking-wider">Settlement Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-black p-4 md:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
          <div className="space-y-0.5">
            <h2 className="text-lg md:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-[0.1em]">
              {subTab} Reports
            </h2>
            <div className="h-1 w-10 bg-brand-500 rounded-full" />
          </div>
          <div className="flex items-center gap-2 group/header-actions">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all font-black text-[9px] uppercase tracking-widest shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 rounded-lg border border-brand-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[9px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em]">Indepth Analysis</span>
            </div>
          </div>
        </div>
        
        <ExpandableTable 
          columns={columns} 
          data={data as any} 
        />
        </div>
        <Popup
        isOpen={!!graphPopup}
        onClose={() => setGraphPopup(null)}
        title={graphPopup?.title || ''}
      >
        <div className="h-[300px] md:h-[450px] w-full bg-white dark:bg-black rounded-2xl md:rounded-[3rem] p-3 md:p-10 border border-zinc-200 dark:border-zinc-900 shadow-2xl relative group overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-brand-500/5 rounded-full blur-3xl -mr-24 md:-mr-32 -mt-24 md:-mt-32 group-hover:bg-brand-500/10 transition-colors duration-700" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-10">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-brand-500/10 rounded-lg md:rounded-2xl flex items-center justify-center border border-brand-500/20">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-brand-500" />
              </div>
              <div>
                <span className="text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.25em] block mb-0.5 md:mb-1">{graphPopup?.localTime} window</span>
                <span className="text-xs md:text-lg font-black text-zinc-900 dark:text-white uppercase tracking-[0.1em]">{graphPopup?.title} ({graphPopup?.localTime})</span>
              </div>
            </div>
            
            <div className="flex-1 min-h-0 overflow-x-auto draggable-scroll no-scrollbar" ref={graphScrollRef}>
              <div className="min-w-[500px] lg:min-w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphPopup?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: '16px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      align="right" 
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    />
                    <Area name="Attempts" type="monotone" dataKey="attempts" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} animationDuration={time === 'Live' ? 0 : 2000} />
                    <Area name="Successful" type="monotone" dataKey="successful" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} animationDuration={time === 'Live' ? 0 : 2000} />
                    <Area name="Delivered" type="monotone" dataKey="delivered" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={3} animationDuration={time === 'Live' ? 0 : 2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};
