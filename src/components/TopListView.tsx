import React, { useState, useEffect } from 'react';
import { ExpandableTable } from './ExpandableTable';
import { MOCK_COUNTRIES, MOCK_PRODUCTS, MOCK_CLIENTS, MOCK_SUPPLIERS, TIME_OPTIONS } from '../constants';
import { TimeOption, User } from '../types';
import { cn, getTimeMultiplier, generateGraphData } from '../lib/utils';
import { LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import { Popup } from './Popup';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, AreaChart, Area } from 'recharts';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface TopListViewProps {
  type: 'Countries' | 'Products' | 'Customers' | 'Suppliers';
  time: TimeOption;
  user: User;
}

export const TopListView: React.FC<TopListViewProps> = ({ type, time: globalTime, user }) => {
  const graphScrollRef = useDraggableScroll();
  const [graphPopup, setGraphPopup] = useState<{ title: string; data: any[]; localTime: TimeOption } | null>(null);
  const [chartType, setChartType] = useState<'Line' | 'Bar' | 'Area'>('Line');
  const [tick, setTick] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const m = getTimeMultiplier(globalTime);

  const generateHierarchy = React.useCallback(function gh(name: string, id: string, level: number): any {
    const base = Math.floor((Math.random() * 10000 * m) / (level + 1));
    const received = base;
    const sent = Math.floor(base * 0.95);
    const delivered = Math.floor(base * 0.85);
    const sparkData = generateGraphData(12, globalTime);
    
    // Only expansion for Customers and Suppliers
    const canExpand = (type === 'Customers' || type === 'Suppliers') && level < 2;
    
    return {
      id,
      data: { name, received, sent, delivered, sparkData },
      children: !canExpand ? undefined : () => {
        if (type === 'Customers') {
          if (level === 0) return ['Account Alpha', 'Account Beta', 'Account Gamma'].map((a, i) => gh(a, `${id}-a-${i}`, level + 1));
          if (level === 1) return MOCK_COUNTRIES.slice(0, 3).map((c, i) => gh(c.name, `${id}-c-${i}`, level + 1));
        }
        if (type === 'Suppliers') {
          if (level === 0) return ['Account 1', 'Account 2'].map((a, i) => gh(a, `${id}-a-${i}`, level + 1));
          if (level === 1) return MOCK_COUNTRIES.slice(0, 3).map((c, i) => gh(c.name, `${id}-c-${i}`, level + 1));
        }
        return [];
      }
    };
  }, [globalTime, m, type]);

  useEffect(() => {
    let dataPool = [];
    if (type === 'Countries') dataPool = MOCK_COUNTRIES;
    else if (type === 'Products') dataPool = MOCK_PRODUCTS;
    else if (type === 'Customers') dataPool = MOCK_CLIENTS.slice(0, 10);
    else if (type === 'Suppliers') dataPool = MOCK_SUPPLIERS.slice(0, 10);

    let baseData = dataPool;
    if (user.role === 'SalesExecutive') {
      const seed = user.id === 'salesexecutive1' ? 0 : 3;
      baseData = baseData.slice(seed, seed + 3);
    }

    setData(baseData.map((item, i) => generateHierarchy(item.name, `top-${i}`, 0)));
  }, [globalTime, type, user.role, user.id, generateHierarchy]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      
      if (globalTime === 'Live') {
        setData(prev => prev.map(item => ({
          ...item,
          data: {
            ...item.data,
            received: Math.floor(item.data.received * (1 + (Math.random() * 0.02 - 0.01))),
            sent: Math.floor(item.data.sent * (1 + (Math.random() * 0.02 - 0.01))),
            delivered: Math.floor(item.data.delivered * (1 + (Math.random() * 0.02 - 0.01)))
          }
        })));
      }

      setGraphPopup(prev => {
        if (prev && prev.localTime === 'Live') {
          return { ...prev, data: generateGraphData(24, 'Live') };
        }
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [globalTime]);


  const columns = [
    { header: type === 'Countries' ? 'Country' : type === 'Products' ? 'Product' : type === 'Customers' ? 'Customer' : 'Supplier', key: 'name' },
    { header: 'Received SMS', key: 'received', render: (val: number) => val.toLocaleString() },
    { header: 'Sent SMS', key: 'sent', render: (val: number) => val.toLocaleString() },
    { header: 'Delivered SMS', key: 'delivered', render: (val: number) => val.toLocaleString() },
    { 
      header: 'Trend', 
      key: 'trend', 
      render: (_, row: any) => (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setGraphPopup({ 
              title: `${row.name} Performance Trend`, 
              data: row.sparkData || generateGraphData(24, globalTime),
              localTime: globalTime
            });
          }}
          className="p-1.5 bg-brand-500/10 text-brand-500 rounded-lg hover:bg-brand-500/20 transition-colors"
          title="View Trend"
        >
          <TrendingUp className="w-4 h-4" />
        </button>
      ) 
    },
  ];

  return (
    <div className="space-y-3 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 bg-white dark:bg-night-bg p-3 md:p-6 rounded-lg md:rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-0.5 md:space-y-1">
          <h2 className="text-sm md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-[0.1em]">
            Top 10 {type}
          </h2>
          <div className="h-0.5 md:h-1 w-6 md:w-12 bg-brand-500 rounded-full" />
        </div>
        <div className="flex items-center gap-1.5 md:gap-3 px-2 md:px-4 py-1 md:py-2 bg-brand-500/10 rounded-md md:rounded-xl border border-brand-500/20 w-fit">
          <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-[7px] md:text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.1em] md:tracking-[0.2em]">Performance Leaderboard</span>
        </div>
      </div>
      
      <ExpandableTable 
        columns={columns} 
        data={data as any} 
      />

      <Popup
        isOpen={!!graphPopup}
        onClose={() => setGraphPopup(null)}
        title={graphPopup?.title || ''}
      >
        <div className="h-[300px] md:h-[450px] w-full bg-white dark:bg-night-bg rounded-2xl md:rounded-[3rem] p-3 md:p-10 border border-zinc-200 dark:border-zinc-900 shadow-2xl relative group overflow-hidden">
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
                <div className="ml-auto flex items-center gap-2">
                  <select 
                    value={graphPopup?.localTime}
                    onChange={(e) => {
                      const newTime = e.target.value as TimeOption;
                      setGraphPopup(prev => prev ? { ...prev, localTime: newTime, data: generateGraphData(24, newTime) } : null);
                    }}
                    className="bg-zinc-100 dark:bg-night-bg text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-zinc-200/50 dark:border-zinc-700/50 focus:outline-none"
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <div className="flex bg-zinc-100 dark:bg-night-bg rounded-lg p-0.5 md:p-1 border border-zinc-200/50 dark:border-zinc-700/50">
                {(['Line', 'Bar', 'Area'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={cn(
                      "px-2 md:px-3 py-0.5 md:py-1 rounded-md text-[7px] md:text-[8px] font-black uppercase tracking-widest transition-all",
                      chartType === type 
                        ? "bg-brand-500 text-white shadow-lg" 
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
            
            <div className="flex-1 min-h-0 overflow-x-auto draggable-scroll no-scrollbar" ref={graphScrollRef}>
              <div className="min-w-[500px] lg:min-w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                {chartType === 'Line' ? (
                  <LineChart data={graphPopup?.data || []}>
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
                    <Line name="Received" type="monotone" dataKey="received" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                    <Line name="Sent" type="monotone" dataKey="sent" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                    <Line name="Delivered" type="monotone" dataKey="delivered" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                  </LineChart>
                ) : chartType === 'Bar' ? (
                  <BarChart data={graphPopup?.data || []}>
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
                    <Bar name="Received" dataKey="received" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                    <Bar name="Sent" dataKey="sent" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                    <Bar name="Delivered" dataKey="delivered" fill="#f59e0b" radius={[4, 4, 0, 0]} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                  </BarChart>
                ) : (
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
                    <Area name="Received" type="monotone" dataKey="received" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={3} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                    <Area name="Sent" type="monotone" dataKey="sent" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                    <Area name="Delivered" type="monotone" dataKey="delivered" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={3} animationDuration={graphPopup?.localTime === 'Live' ? 0 : 2000} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Popup>
    </div>
  );
};
