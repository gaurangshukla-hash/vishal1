import React, { useState, useEffect } from 'react';
import { DataCard } from './DataCard';
import { Popup } from './Popup';
import { ExpandableTable } from './ExpandableTable';
import { MOCK_SUPPLIERS, MOCK_CLIENTS, TIME_OPTIONS } from '../constants';
import { TimeOption } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, Legend } from 'recharts';
import { TrendingUp, Activity, Gauge, LineChart as LineChartIcon, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Speedometer } from './Speedometer';
import { cn, getTimeMultiplier, generateGraphData } from '../lib/utils';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface TechnicalViewProps {
  subTab: 'Supplier' | 'Customer' | 'Business';
  time: TimeOption;
}

export const TechnicalView: React.FC<TechnicalViewProps> = ({ subTab, time }) => {
  const globalTime = time;
  const popupScrollRef = useDraggableScroll();
  const graph1Ref = useDraggableScroll();
  const graph2Ref = useDraggableScroll();
  const tpsGraphRef = useDraggableScroll();
  const nestedGraphRef = useDraggableScroll();
  const [popupContent, setPopupContent] = useState<{ title: string; data: any[]; type?: string; graphData?: any[]; dataKey?: string } | null>(null);
  const [nestedPopup, setNestedPopup] = useState<{ title: string; graphData: any[]; isSpeedometer?: boolean; dataKey?: string; localTime: TimeOption } | null>(null);
  const [chartType, setChartType] = useState<'Line' | 'Bar' | 'Area'>('Area');
  const [tick, setTick] = useState(0);

  // Individual graph times
  const [graph1Time, setGraph1Time] = useState<TimeOption>(globalTime);
  const [graph2Time, setGraph2Time] = useState<TimeOption>(globalTime);
  const [mainTpsTime, setMainTpsTime] = useState<TimeOption>(globalTime);

  // Individual graph data
  const [graph1Data, setGraph1Data] = useState<any[]>([]);
  const [graph2Data, setGraph2Data] = useState<any[]>([]);
  const [mainTpsData, setMainTpsData] = useState<any[]>([]);
  const [supplierPerfData, setSupplierPerfData] = useState<any[]>([]);
  const [supplierPerfTime, setSupplierPerfTime] = useState<TimeOption>(globalTime);

  useEffect(() => {
    setGraph1Time(globalTime);
    setGraph2Time(globalTime);
    setMainTpsTime(globalTime);
    setSupplierPerfTime(globalTime);
    
    // Initialize data when global time changes
    setGraph1Data(generateGraphData(8, globalTime));
    setGraph2Data(generateGraphData(12, globalTime));
    setMainTpsData(generateGraphData(20, globalTime));
    setSupplierPerfData(generateGraphData(24, globalTime));
  }, [globalTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      
      setPopupContent(prev => {
        if (prev?.type === 'graph-only' && prev.dataKey && globalTime === 'Live') {
          return { ...prev, graphData: generateGraphData(20, 'Live', prev.dataKey) };
        }
        return prev;
      });

      setNestedPopup(prev => {
        if (prev && !prev.isSpeedometer && prev.dataKey && prev.localTime === 'Live') {
          return { ...prev, graphData: generateGraphData(24, 'Live', prev.dataKey) };
        }
        return prev;
      });

      // Update main graphs if their local time is Live
      if (graph1Time === 'Live') setGraph1Data(generateGraphData(8, 'Live'));
      if (graph2Time === 'Live') setGraph2Data(generateGraphData(12, 'Live'));
      if (mainTpsTime === 'Live') setMainTpsData(generateGraphData(20, 'Live'));
      if (supplierPerfTime === 'Live') setSupplierPerfData(generateGraphData(24, 'Live'));

    }, 3000);
    return () => clearInterval(interval);
  }, [globalTime, graph1Time, graph2Time, mainTpsTime, supplierPerfTime]);

  const renderTPSGraph = (title: string, data: any[], dataKey: string = 'tps', scrollRef?: React.RefObject<HTMLDivElement>, localTime?: TimeOption, onTimeChange?: (t: TimeOption) => void) => (
    <div className="h-[280px] md:h-[350px] w-full mt-2 md:mt-4 bg-white dark:bg-black rounded-2xl p-2 md:p-6 border border-zinc-200 dark:border-zinc-900 shadow-2xl shadow-brand-500/5 relative group overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-brand-500/10 transition-colors duration-700" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-2 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-500/10 rounded-lg md:rounded-xl flex items-center justify-center border border-brand-500/20">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-brand-500" />
            </div>
              <div>
                <span className="text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.2em] block mb-0.5">{title} ({localTime || globalTime})</span>
                <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-brand-500 animate-pulse" />
                <span className="text-[7px] md:text-[8px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">{localTime || globalTime} window</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onTimeChange && (
              <select 
                value={localTime}
                onChange={(e) => onTimeChange(e.target.value as TimeOption)}
                className="bg-zinc-100 dark:bg-black text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none transition-colors"
              >
                {TIME_OPTIONS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            )}
            <div className="flex bg-zinc-100 dark:bg-black rounded-lg p-0.5 md:p-1 border border-zinc-200 dark:border-zinc-800 transition-colors">
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
        
        <div className="flex-1 min-h-0 overflow-x-auto draggable-scroll no-scrollbar" ref={scrollRef}>
          <div className="min-w-[500px] lg:min-w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
            {chartType === 'Area' ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.05} />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    fontSize: '12px', 
                    color: '#fff',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area 
                  name={title.split('Trend')[0].trim() || dataKey.toUpperCase()}
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorTps)" 
                  animationDuration={(localTime || globalTime) === 'Live' ? 0 : 2000}
                />
              </AreaChart>
            ) : chartType === 'Bar' ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.05} />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    fontSize: '12px', 
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Bar 
                  name={title.split('Trend')[0].trim() || dataKey.toUpperCase()}
                  dataKey={dataKey} 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  animationDuration={(localTime || globalTime) === 'Live' ? 0 : 2000}
                />
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.05} />
                <XAxis dataKey="time" stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666', fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px', 
                    fontSize: '12px', 
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Line 
                  name={title.split('Trend')[0].trim() || dataKey.toUpperCase()}
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#10b981' }} 
                  activeDot={{ r: 6 }} 
                  animationDuration={(localTime || globalTime) === 'Live' ? 0 : 2000}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

  const renderGraphsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-white dark:bg-black rounded-xl md:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-sm group p-4 md:p-8 transition-colors duration-500">
        <div className="flex items-center justify-between mb-3 md:mb-8">
          <div className="flex flex-col">
            <h3 className="text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.25em]">Volume vs Success Trend</h3>
            <span className="text-[7px] font-bold text-brand-500 uppercase">{graph1Time} window</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={graph1Time}
              onChange={(e) => {
                const newTime = e.target.value as TimeOption;
                setGraph1Time(newTime);
                setGraph1Data(generateGraphData(8, newTime));
              }}
              className="bg-zinc-100 dark:bg-black text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none transition-colors"
            >
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Activity className="w-3 md:w-4 h-3 md:h-4 text-brand-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="h-[250px] md:h-[300px] overflow-x-auto draggable-scroll no-scrollbar" ref={graph1Ref}>
          <div className="min-w-[500px] lg:min-w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={graph1Data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
              <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="volume" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="success" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
      <div className="bg-white dark:bg-black rounded-xl md:rounded-[2.5rem] border border-zinc-200 dark:border-zinc-900 shadow-sm group p-4 md:p-8 transition-colors duration-500">
        <div className="flex items-center justify-between mb-3 md:mb-8">
          <div className="flex flex-col">
            <h3 className="text-[8px] md:text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] md:tracking-[0.25em]">TPS Activity</h3>
            <span className="text-[7px] font-bold text-brand-500 uppercase">{graph2Time} window</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={graph2Time}
              onChange={(e) => {
                const newTime = e.target.value as TimeOption;
                setGraph2Time(newTime);
                setGraph2Data(generateGraphData(12, newTime));
              }}
              className="bg-zinc-100 dark:bg-black text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 focus:outline-none transition-colors"
            >
              {TIME_OPTIONS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <TrendingUp className="w-3 md:w-4 h-3 md:h-4 text-brand-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="h-[250px] md:h-[300px] overflow-x-auto draggable-scroll no-scrollbar" ref={graph2Ref}>
          <div className="min-w-[500px] lg:min-w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graph2Data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.05} />
              <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
              <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Line type="stepAfter" dataKey="tps" stroke="#f43f5e" strokeWidth={4} dot={false} animationDuration={1500} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
      <div className="lg:col-span-2">
        {renderTPSGraph("Real-time Network Throughput", mainTpsData, 'tps', tpsGraphRef, mainTpsTime, (newTime) => {
          setMainTpsTime(newTime);
          setMainTpsData(generateGraphData(20, newTime));
        })}
      </div>
    </div>
  );

  const m = getTimeMultiplier(globalTime);
  const liveFactor = globalTime === 'Live' ? (1 + (Math.sin(tick * 0.5) * 0.02)) : 1;

  const renderSupplierView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        <DataCard title="Today's Active Supplier" value={MOCK_SUPPLIERS.length.toLocaleString()} />
        <DataCard 
          title="Connected Sockets" 
          value={Math.floor(124 * (m * 0.1 + 0.9) * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Connected Sockets Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'sockets'),
            dataKey: 'sockets',
            localTime: globalTime
          })}
        onClick={() => setPopupContent({ 
          title: 'Supplier-wise Connected Sockets', 
          type: 'business-supplier',
          data: MOCK_SUPPLIERS.map(s => ({
            id: s.id,                
            data: { name: s.name, value: 'Socket Count' },
            children: () => ['Account 1', 'Account 2'].map((a, i) => ({
              id: `${s.id}-a-${i}`,
              data: { name: a, value: 'Account Data' },
              children: () => ['USA', 'UK', 'India'].map((c, j) => ({
                id: `${s.id}-a-${i}-c-${j}`,
                data: { name: c, value: 'Country Data' }
              }))
            }))
          }))
        })} 
        />
        <DataCard 
          title="Disconnected Sockets" 
          value={Math.floor(12 * (m * 0.05 + 0.95) * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Disconnected Sockets Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'sockets'),
            dataKey: 'sockets',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise Disconnected Sockets', 
            type: 'business-supplier',
            data: MOCK_SUPPLIERS.map(s => ({
              id: s.id,
              data: { name: s.name, value: 'Socket Count' },
              children: () => ['Account 1', 'Account 2'].map((a, i) => ({
                id: `${s.id}-a-${i}`,
                data: { name: a, value: 'Account Data' },
                children: () => ['USA', 'UK', 'India'].map((c, j) => ({
                  id: `${s.id}-a-${i}-c-${j}`,
                  data: { name: c, value: 'Country Data' }
                }))
              }))
            }))
          })} 
        />
        <DataCard 
          title="Total Queue SMS" 
          value={Math.floor(4521 * m * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Queue SMS Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'queue'),
            dataKey: 'queue',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise Live Queue', 
            type: 'business-supplier',
            data: MOCK_SUPPLIERS.map(s => ({
              id: s.id,
              data: { name: s.name, value: 'Queue Data' },
              children: () => ['Account 1', 'Account 2'].map((a, i) => ({
                id: `${s.id}-a-${i}`,
                data: { name: a, value: 'Account Data' },
                children: () => ['USA', 'UK', 'India'].map((c, j) => ({
                  id: `${s.id}-a-${i}-c-${j}`,
                  data: { name: c, value: 'Country Data' }
                }))
              }))
            }))
          })} 
        />
        <DataCard 
          title="Total Queue SMS Unit" 
          value={Math.floor(5102 * m * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Queue SMS Unit Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'queue'),
            dataKey: 'queue',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise SMS Units', 
            type: 'business-supplier',
            data: MOCK_SUPPLIERS.map(s => ({
              id: s.id,
              data: { name: s.name, value: 'Units' },
              children: () => ['Account 1', 'Account 2'].map((a, i) => ({
                id: `${s.id}-a-${i}`,
                data: { name: a, value: 'Account Data' },
                children: () => ['USA', 'UK', 'India'].map((c, j) => ({
                  id: `${s.id}-a-${i}-c-${j}`,
                  data: { name: c, value: 'Country Data' }
                }))
              }))
            }))
          })} 
        />
        <DataCard 
          title="Total Sent SMS Count" 
          value={Math.floor(1245602 * m * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Sent SMS Count Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'volume'),
            dataKey: 'volume',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise Sent SMS Count', 
            type: 'business-supplier',
            data: MOCK_SUPPLIERS.map(s => ({
              id: s.id,
              data: { name: s.name, value: 'SMS Count' },
              children: () => ['Account 1', 'Account 2'].map((a, i) => ({
                id: `${s.id}-a-${i}`,
                data: { name: a, value: 'Account Data' },
                children: () => ['USA', 'UK', 'India'].map((c, j) => ({
                  id: `${s.id}-a-${i}-c-${j}`,
                  data: { name: c, value: 'Country Data' }
                }))
              }))
            }))
          })} 
        />
        <DataCard 
          title="Total Sent SMS Unit" 
          value={Math.floor(1302110 * m * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Sent SMS Unit Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'volume'),
            dataKey: 'volume',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise Sent SMS Units', 
            data: MOCK_SUPPLIERS.map(s => ({ name: s.name, 'SMS Unit': Math.floor(Math.random() * 55000).toLocaleString(), 'Current Time': new Date().toLocaleTimeString() })) 
          })} 
        />
        <DataCard 
          title="Today's Pending DLR" 
          value={Math.floor(854 * m * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Pending DLR Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'dlr'),
            dataKey: 'dlr',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise Pending DLR', 
            data: MOCK_SUPPLIERS.map(s => ({ name: s.name, 'DLR': Math.floor(Math.random() * 100).toLocaleString(), 'Current Time': new Date().toLocaleTimeString() })) 
          })} 
        />
        <DataCard 
          title="Previous Pending DLR" 
          value={Math.floor(1204 * m * liveFactor).toLocaleString()} 
          onGraphClick={() => setNestedPopup({
            title: `Previous Pending DLR Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'dlr'),
            dataKey: 'dlr',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: 'Supplier-wise Previous Pending DLR', 
            data: MOCK_SUPPLIERS.map(s => ({ name: s.name, 'DLR': Math.floor(Math.random() * 200).toLocaleString(), 'Current Time': new Date().toLocaleTimeString() })) 
          })} 
        />
        <DataCard 
          title={`TPS (${globalTime})`} 
          value={Math.floor(452 * (m * 0.02 + 0.98) * liveFactor).toLocaleString()} 
          onSpeedometerClick={() => setNestedPopup({
            title: `Live Outbound TPS Speedometer`,
            isSpeedometer: true,
            graphData: [],
            localTime: 'Live'
          })}
          onGraphClick={() => setNestedPopup({
            title: `Outbound TPS Trend`,
            isSpeedometer: false,
            graphData: generateGraphData(24, globalTime, 'tps'),
            dataKey: 'tps',
            localTime: globalTime
          })}
          onClick={() => setPopupContent({ 
            title: `Supplier-wise TPS (${globalTime})`, 
            type: 'tps-list',
            data: MOCK_SUPPLIERS.map(s => {
              const tps = Math.floor(Math.random() * 50);
              const limit = 50;
              const ratio = tps / limit;
              return { 
                name: s.name, 
                'TPS': tps.toLocaleString(),
                'Limit': limit.toLocaleString(),
                'Utilization': (ratio * 100).toFixed(1) + '%',
                status: ratio > 0.9 ? 'critical' : ratio > 0.7 ? 'warning' : 'optimal'
              };
            }) 
          })} 
        />
        <DataCard 
          title="Rate Limit Status" 
          value={MOCK_SUPPLIERS.filter(() => Math.random() > 0.7).length.toString() + " Alarms"} 
          status={MOCK_SUPPLIERS.some(() => Math.random() > 0.9) ? 'warning' : 'optimal'}
          onClick={() => setPopupContent({ 
            title: 'Supplier Rate Limit Analysis', 
            type: 'rate-limit',
            data: MOCK_SUPPLIERS.map(s => {
              const usage = Math.floor(Math.random() * 100);
              return {
                name: s.name,
                'Utilization': usage + '%',
                'TPS/Limit': `${Math.floor(usage * 0.5)}/50`,
                'Status': usage > 90 ? 'Critical' : usage > 70 ? 'Warning' : 'Healthy',
                status: usage > 90 ? 'critical' : usage > 70 ? 'warning' : 'optimal'
              };
            })
          })} 
        />
      </div>

      <div className="bg-white dark:bg-black rounded-3xl border border-zinc-200 dark:border-zinc-900 shadow-sm p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Removed charts section as requested */}
      </div>
    </div>
  );

  const renderCustomerView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      <DataCard title="Today's Active Client" value={MOCK_CLIENTS.length.toLocaleString()} />
      <DataCard 
        title="Total connected-SMPP sockets" 
        value={Math.floor(85 * (m * 0.1 + 0.9) * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Connected SMPP Sockets Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'sockets'),
          dataKey: 'sockets',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-based Connected Sockets', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'Connected Sockets': (Math.floor(Math.random() * 5) + 1).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total disconnected SMPP Sockets" 
        value={Math.floor(5 * (m * 0.05 + 0.95) * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Disconnected SMPP Sockets Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'sockets'),
          dataKey: 'sockets',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-based Disconnected Sockets', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'Disconnected Sockets': (Math.floor(Math.random() * 2)).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total Failed Attempts" 
        value={Math.floor(12402 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Failed Attempts Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'errors'),
          dataKey: 'errors',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Failed Attempts', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'Failed Attempts': Math.floor(Math.random() * 500).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total Blocked SMS" 
        value={Math.floor(452 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Blocked SMS Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'errors'),
          dataKey: 'errors',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Blocked SMS', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'SMS': Math.floor(Math.random() * 50).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total Failed SMS" 
        value={Math.floor(1204 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Failed SMS Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'errors'),
          dataKey: 'errors',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Failed SMS', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'SMS': Math.floor(Math.random() * 100).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total SMS via GUI" 
        value={Math.floor(8541 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `SMS via GUI Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'volume'),
          dataKey: 'volume',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise SMS via GUI', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'SMS': Math.floor(Math.random() * 1000).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total Sent SMS Count" 
        value={Math.floor(452102 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Sent SMS Count Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'volume'),
          dataKey: 'volume',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Sent SMS Count', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'SMS': Math.floor(Math.random() * 20000).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total Sent SMS Unit" 
        value={Math.floor(480551 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Sent SMS Unit Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'volume'),
          dataKey: 'volume',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Sent SMS Unit', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'SMS': Math.floor(Math.random() * 22000).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title={`TPS (${globalTime})`} 
        value={Math.floor(385 * (m * 0.02 + 0.98) * liveFactor).toLocaleString()} 
        onSpeedometerClick={() => setNestedPopup({
          title: `Live Inbound TPS Speedometer`,
          isSpeedometer: true,
          graphData: [],
          localTime: 'Live'
        })}
        onGraphClick={() => setNestedPopup({
          title: `Inbound TPS Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'tps'),
          dataKey: 'tps',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: `Client-wise TPS (${globalTime})`, 
          type: 'tps-list',
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'TPS': (Math.floor(Math.random() * 40)).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Total SMS via SMPP" 
        value={Math.floor(854102 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `SMS via SMPP Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'volume'),
          dataKey: 'volume',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise SMS via SMPP', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'SMS': Math.floor(Math.random() * 40000).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Pending DLR of SMPP" 
        value={Math.floor(854 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Pending DLR (SMPP) Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'dlr'),
          dataKey: 'dlr',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Pending DLR (SMPP)', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'DLR': Math.floor(Math.random() * 100).toLocaleString() })) 
        })} 
      />
      <DataCard 
        title="Old Pending DLR of SMPP" 
        value={Math.floor(1204 * m * liveFactor).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Old Pending DLR (SMPP) Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'dlr'),
          dataKey: 'dlr',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Customer-wise Old Pending DLR (SMPP)', 
          data: MOCK_CLIENTS.map(c => ({ name: c.name, 'DLR': Math.floor(Math.random() * 200).toLocaleString() })) 
        })} 
      />
    </div>
  );

  const renderBusiness = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
      <DataCard 
        title="Total Buying cost (Suppliers)" 
        value={'$' + Math.floor(12450 * m).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Total Buying Cost Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'cost'),
          dataKey: 'cost',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Total Buying Cost Hierarchy (Supplier > Product > Country)', 
          type: 'business-cost',
          data: MOCK_SUPPLIERS.slice(0, 5).map(s => ({
            id: s.id,
            data: { name: s.name, value: '$' + Math.floor(Math.random() * 2000).toLocaleString() },
            children: () => ['Premium', 'Direct'].map((p, i) => ({
              id: `${s.id}-p-${i}`,
              data: { name: p, value: '$' + Math.floor(Math.random() * 1000).toLocaleString() },
              children: () => ['USA', 'UK', 'India'].map((c, j) => ({
                id: `${s.id}-p-${i}-c-${j}`,
                data: { name: c, value: '$' + Math.floor(Math.random() * 500).toLocaleString() }
              }))
            }))
          }))
        })} 
      />
      <DataCard 
        title="Total Sales cost (Customers)" 
        value={'$' + Math.floor(18900 * m).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Total Sales Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'sales'),
          dataKey: 'sales',
          localTime: globalTime
        })}
        onClick={() => setPopupContent({ 
          title: 'Total Sales Hierarchy (Supplier > Supplier Account > Country)', 
          type: 'business-sales',
          data: [
            {
              name: 'GlobalConnect',
              accounts: [
                { name: 'GLB_DIR_US', countries: ['USA', 'Canada', 'Mexico'] },
                { name: 'GLB_WHS_US', countries: ['USA', 'Colombia', 'Brazil'] },
                { name: 'GLB_HQ_US', countries: ['Germany', 'France', 'USA'] }
              ]
            },
            {
              name: 'QuickRoute',
              accounts: [
                { name: 'QR_WHS_UK', countries: ['UK', 'France', 'Netherlands'] },
                { name: 'QR_DIR_UK', countries: ['UK', 'Ireland', 'Spain'] }
              ]
            },
            {
              name: 'Airtel',
              accounts: [
                { name: 'AIRTEL_DIR_IN', countries: ['India', 'Bangladesh', 'Nepal'] },
                { name: 'AIRTEL_WHS_IN', countries: ['India', 'Sri Lanka', 'Maldives'] }
              ]
            },
            {
              name: 'Teleoss Partner',
              accounts: [
                { name: 'TELE_WHS_GLOBAL', countries: ['Singapore', 'Malaysia', 'Thailand'] },
                { name: 'TELE_DIR_ASIA', countries: ['Vietnam', 'Philippines', 'Indonesia'] }
              ]
            }
          ].map((s, sIdx) => ({
            id: `s-${sIdx}`,
            data: { name: s.name, value: '$' + Math.floor(Math.random() * 4000 + 4000).toLocaleString() },
            children: () => s.accounts.map((acc, aIdx) => ({
              id: `s-${sIdx}-acc-${aIdx}`,
              data: { name: acc.name, value: '$' + Math.floor(Math.random() * 2000 + 1000).toLocaleString() },
              children: () => acc.countries.map((c, cIdx) => ({
                id: `s-${sIdx}-acc-${aIdx}-c-${cIdx}`,
                data: { name: c, value: '$' + Math.floor(Math.random() * 500 + 100).toLocaleString() }
              }))
            }))
          }))
        })} 
      />
      <DataCard 
        title={`Profit / Loss (${globalTime})`} 
        value={'+$' + Math.floor(6450 * m).toLocaleString()} 
        onGraphClick={() => setNestedPopup({
          title: `Profit / Loss Trend`,
          isSpeedometer: false,
          graphData: generateGraphData(24, globalTime, 'cost'),
          dataKey: 'cost',
          localTime: globalTime
        })}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {subTab === 'Supplier' && renderSupplierView()}
      {subTab === 'Customer' && renderCustomerView()}
      {subTab === 'Business' && renderBusiness()}

      <Popup
        isOpen={!!popupContent}
        onClose={() => setPopupContent(null)}
        title={popupContent?.title || ''}
      >
        {popupContent?.type === 'graph-only' ? (
          renderTPSGraph(popupContent.title, popupContent.graphData || [], popupContent.dataKey, nestedGraphRef)
        ) : popupContent?.type?.startsWith('business') ? (
          <ExpandableTable 
            columns={[
              { header: 'Entity', key: 'name' },
              { header: 'Value', key: 'value' }
            ]} 
            data={popupContent.data} 
          />
        ) : (
          <div ref={popupScrollRef} className="draggable-scroll custom-scrollbar">
            <table className="w-full min-w-max text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Supplier Name</th>
                  {popupContent?.data?.[0] && Object.keys(popupContent.data[0]).filter(k => k !== 'id' && k !== 'name' && k !== 'status').map(key => (
                    <th key={key} className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">{key}</th>
                  ))}
                  <th className="p-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase text-right">Health</th>
                </tr>
              </thead>
              <tbody>
                {popupContent?.data.map((item: any, idx: number) => (
                  <tr key={idx} className="border-bottom border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          item.status === 'critical' ? 'bg-rose-500 animate-pulse' :
                          item.status === 'warning' ? 'bg-amber-500' :
                          'bg-emerald-500'
                        )} />
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</span>
                      </div>
                    </td>
                    {Object.entries(item).filter(([k]) => k !== 'id' && k !== 'name' && k !== 'status').map(([k, v]) => (
                      <td key={k} className="p-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">
                        {k === 'Utilization' || k === 'Usage %' ? (
                          <div className="flex items-center gap-2">
                             <div className="flex-1 h-1.5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    parseFloat(v as string) > 90 ? 'bg-rose-500' :
                                    parseFloat(v as string) > 70 ? 'bg-amber-500' :
                                    'bg-emerald-500'
                                  )}
                                  style={{ width: `${Math.min(100, parseFloat(v as string))}%` }}
                                />
                             </div>
                             <span className="text-xs font-bold">{v as any}</span>
                          </div>
                        ) : v as any}
                      </td>
                    ))}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'critical' ? (
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                        ) : item.status === 'warning' ? (
                          <Zap className="w-4 h-4 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                        {popupContent?.type === 'tps-list' && (
                          <button 
                            onClick={() => setNestedPopup({ title: `${item.name} TPS Gauge`, isSpeedometer: true, graphData: [], localTime: 'Live' })}
                            className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-colors"
                            title="View Speedometer"
                          >
                            <Gauge className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => setNestedPopup({ 
                            title: `${item.name} Trend`, 
                            isSpeedometer: false, 
                            graphData: generateGraphData(24, globalTime),
                            dataKey: 'tps',
                            localTime: globalTime
                          })}
                          className="p-2 bg-brand-500/10 text-brand-500 rounded-lg hover:bg-brand-500/20 transition-colors"
                          title="View Trend Chart"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Popup>

      <Popup
        isOpen={!!nestedPopup}
        onClose={() => setNestedPopup(null)}
        title={nestedPopup?.title || ''}
      >
        {nestedPopup?.isSpeedometer ? (
          <Speedometer value={Math.floor(Math.random() * 80) + 10} title={nestedPopup.title} />
        ) : (
          nestedPopup && renderTPSGraph(
            nestedPopup.title, 
            nestedPopup.graphData, 
            nestedPopup.dataKey, 
            nestedGraphRef, 
            nestedPopup.localTime,
            (newTime) => {
              setNestedPopup(prev => prev ? { 
                ...prev, 
                localTime: newTime, 
                graphData: generateGraphData(24, newTime, prev.dataKey) 
              } : null);
            }
          )
        )}
      </Popup>
    </div>
  );
};

