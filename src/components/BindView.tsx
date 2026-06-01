import React, { useState, useEffect } from 'react';
import { DataCard } from './DataCard';
import { Popup } from './Popup';
import { MOCK_CLIENTS, MOCK_SUPPLIERS } from '../constants';
import { TimeOption, User } from '../types';
import { cn, getTimeMultiplier, generateGraphData } from '../lib/utils';
import { LineChart as LineChartIcon, TrendingUp } from 'lucide-react';
import { Sparkline } from './Sparkline';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, BarChart, Bar } from 'recharts';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface BindViewProps {
  type: 'Client' | 'Provider';
  time: TimeOption;
  user: User;
}

export const BindView: React.FC<BindViewProps> = ({ type, time, user }) => {
  const graphScrollRef = useDraggableScroll();
  const [popupContent, setPopupContent] = useState<{ title: string; data: any[] } | null>(null);
  const [graphPopup, setGraphPopup] = useState<{ title: string; data: any[]; localTime: TimeOption } | null>(null);
  const [chartType, setChartType] = useState<'Line' | 'Bar' | 'Area'>('Area');
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

  const m = getTimeMultiplier(time);
  const liveFactor = time === 'Live' ? (1 + (Math.sin(tick * 0.5) * 0.02)) : 1;
  let data = type === 'Client' ? MOCK_CLIENTS : MOCK_SUPPLIERS;

  // Filter data for SalesExecutive to show "own" data
  if (user.role === 'SalesExecutive') {
    const seed = user.id === 'salesexecutive1' ? 0 : 3;
    data = data.slice(seed, seed + 3);
  }

  const connectedCount = Math.floor(data.filter(d => d.status === 'connected').length * (m * 0.05 + 0.95) * liveFactor);
  const disconnectedCount = Math.max(0, data.length - connectedCount);
  const avgUptime = (data.reduce((acc, d) => acc + parseFloat(d.uptime), 0) / data.length * liveFactor).toFixed(2);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <DataCard 
          title="Connected Sockets" 
          value={connectedCount} 
          onGraphClick={() => setGraphPopup({ title: `${type} Connected Sockets Trend`, data: generateGraphData(24, time), localTime: time })}
          onClick={() => setPopupContent({ 
            title: `${type}-wise Connected Sockets`, 
            data: data.filter(d => d.status === 'connected').map(d => ({ 
              name: d.name, 
              'Connected Sockets': Math.floor(Math.random() * 5) + 1, 
              'Uptime %': d.uptime + '%',
              sparkData: generateGraphData(12, time)
            })) 
          })} 
        />
        <DataCard 
          title="Disconnected Sockets" 
          value={disconnectedCount} 
          onGraphClick={() => setGraphPopup({ title: `${type} Disconnected Sockets Trend`, data: generateGraphData(24, time), localTime: time })}
          onClick={() => setPopupContent({ 
            title: `${type}-wise Disconnected Sockets`, 
            data: data.filter(d => d.status === 'disconnected').map(d => ({ 
              name: d.name, 
              'Disconnected Sockets': Math.floor(Math.random() * 3) + 1, 
              'Downtime %': (100 - parseFloat(d.uptime)).toFixed(2) + '%',
              sparkData: generateGraphData(12, time)
            })) 
          })} 
        />
        <DataCard 
          title="Uptime %" 
          value={avgUptime + '%'} 
          onGraphClick={() => setGraphPopup({ title: `${type} Uptime Trend`, data: generateGraphData(24, time), localTime: time })}
        />
      </div>

      <Popup
        isOpen={!!popupContent}
        onClose={() => setPopupContent(null)}
        title={popupContent?.title || ''}
      >
        <div className="rounded-xl md:rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-night-bg draggable-scroll">
          <table className="w-full min-w-max text-left border-collapse">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 md:py-5 px-4 md:px-6 text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Name</th>
                {popupContent?.data?.[0] && Object.keys(popupContent.data[0]).filter(k => k !== 'name' && k !== 'sparkData').map(key => (
                  <th key={key} className="py-3 md:py-5 px-4 md:px-6 text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">{key}</th>
                ))}
                <th className="py-3 md:py-5 px-4 md:px-6 text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {popupContent?.data.map((item, idx) => (
                <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300">
                  <td className="py-2.5 md:py-4 px-4 md:px-6 text-[11px] md:text-sm font-bold text-zinc-900 dark:text-white whitespace-nowrap">{item.name}</td>
                  {Object.entries(item).filter(([k]) => k !== 'name' && k !== 'sparkData').map(([k, v]) => (
                    <td key={k} className="py-2.5 md:py-4 px-4 md:px-6 text-[11px] md:text-sm text-zinc-600 dark:text-zinc-400 font-mono font-medium whitespace-nowrap">{v as any}</td>
                  ))}
                  <td className="py-2.5 md:py-4 px-4 md:px-6 whitespace-nowrap">
                    <div className="flex items-center gap-3 md:gap-6">
                      <div className="w-16 md:w-24 h-6 md:h-8">
                        <Sparkline data={item.sparkData} color="#3b82f6" />
                      </div>
                      <button 
                        onClick={() => setGraphPopup({ title: `${item.name} Trend`, data: item.sparkData, localTime: time })}
                        className="p-1.5 md:p-2 bg-brand-500/10 text-brand-500 rounded-lg md:rounded-xl hover:bg-brand-500/20 transition-all border border-brand-500/10 active:scale-90"
                      >
                        <TrendingUp className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Popup>

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
                  {['Live', '1 Min', '5 Min', '10 Min', '15 Min', '1 Hour', '1 Day'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="flex bg-zinc-100 dark:bg-night-bg rounded-lg p-0.5 md:p-1 border border-zinc-200 dark:border-zinc-700">
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
                {chartType === 'Area' ? (
                  <AreaChart data={graphPopup?.data || []}>
                    <defs>
                      <linearGradient id="colorBind" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: '16px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorBind)" animationDuration={time === 'Live' ? 0 : 2000} />
                  </AreaChart>
                ) : chartType === 'Bar' ? (
                  <BarChart data={graphPopup?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: '16px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={time === 'Live' ? 0 : 2000} />
                  </BarChart>
                ) : (
                  <LineChart data={graphPopup?.data || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
                    <XAxis dataKey="time" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: 'none', borderRadius: '16px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} animationDuration={time === 'Live' ? 0 : 2000} />
                  </LineChart>
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
