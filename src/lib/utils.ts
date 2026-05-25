import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TimeOption = '1 Min' | '5 Min' | '10 Min' | '15 Min' | '30 Min' | '45 Min' | '1 Hour' | '12 Hours' | '1 Day' | '1 Week' | '1 Month' | 'Live' | 'Today' | 'Yesterday' | 'Monthly';

export interface GraphDataPoint {
  time: string;
  [key: string]: number | string;
}

export const getTimeMultiplier = (t: TimeOption) => {
  switch (t) {
    case '1 Min': return 0.016;
    case '5 Min': return 0.083;
    case '10 Min': return 0.166;
    case '15 Min': return 0.25;
    case '30 Min': return 0.5;
    case '45 Min': return 0.75;
    case '1 Hour': return 1;
    case '12 Hours': return 12;
    case '1 Day': return 24;
    case '1 Week': return 168;
    case '1 Month': return 720;
    case 'Live': return 0.016;
    case 'Today': return 24;
    case 'Yesterday': return 24;
    case 'Monthly': return 720;
    default: return 1;
  }
};

export const getTimeRangeDisplay = (t: TimeOption) => {
  const now = new Date();
  const start = new Date(now.getTime());
  
  switch (t) {
    case '1 Min': start.setMinutes(now.getMinutes() - 1); break;
    case '5 Min': start.setMinutes(now.getMinutes() - 5); break;
    case '10 Min': start.setMinutes(now.getMinutes() - 10); break;
    case '15 Min': start.setMinutes(now.getMinutes() - 15); break;
    case '30 Min': start.setMinutes(now.getMinutes() - 30); break;
    case '45 Min': start.setMinutes(now.getMinutes() - 45); break;
    case '1 Hour': start.setHours(now.getHours() - 1); break;
    case '12 Hours': start.setHours(now.getHours() - 12); break;
    case '1 Day': start.setDate(now.getDate() - 1); break;
    case '1 Week': start.setDate(now.getDate() - 7); break;
    case '1 Month': start.setMonth(now.getMonth() - 1); break;
    case 'Live': start.setMinutes(now.getMinutes() - 1); break;
    case 'Today': start.setHours(0, 0, 0, 0); break;
    case 'Yesterday': 
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() - 1);
      now.setHours(23, 59, 59, 999);
      break;
    case 'Monthly': start.setMonth(now.getMonth() - 1); break;
  }

  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return `${start.toLocaleString([], options)} - ${now.toLocaleString([], options)}`;
};

export const generateGraphData = (count: number, timeRange: TimeOption = '1 Hour', dataKey: string = 'tps'): GraphDataPoint[] => {
  const data: GraphDataPoint[] = [];
  const now = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getTime());
    if (timeRange === '1 Min' || timeRange === 'Live') d.setSeconds(now.getSeconds() - i * 5);
    else if (timeRange === '5 Min') d.setSeconds(now.getSeconds() - i * 25);
    else if (timeRange === '10 Min') d.setMinutes(now.getMinutes() - i * 0.83);
    else if (timeRange === '15 Min') d.setMinutes(now.getMinutes() - i * 1.25);
    else if (timeRange === '30 Min') d.setMinutes(now.getMinutes() - i * 2.5);
    else if (timeRange === '45 Min') d.setMinutes(now.getMinutes() - i * 3.75);
    else if (timeRange === '1 Hour') d.setMinutes(now.getMinutes() - i * 5);
    else if (timeRange === '12 Hours') d.setHours(now.getHours() - i);
    else if (timeRange === '1 Day' || timeRange === 'Today' || timeRange === 'Yesterday') d.setHours(now.getHours() - i * 2);
    else if (timeRange === '1 Week') d.setHours(now.getHours() - i * 14);
    else if (timeRange === '1 Month' || timeRange === 'Monthly') d.setDate(now.getDate() - i);
    
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let baseValue = 0;
    if (dataKey === 'tps') baseValue = Math.floor(Math.random() * 100) + 20;
    else if (dataKey === 'volume') baseValue = Math.floor(Math.random() * 5000) + 1000;
    else if (dataKey === 'cost' || dataKey === 'sales') baseValue = Math.floor(Math.random() * 1000) + 200;
    else if (dataKey === 'sockets') baseValue = Math.floor(Math.random() * 50) + 10;
    else baseValue = Math.floor(Math.random() * 100) + 10;

    data.push({
      time: timeStr,
      [dataKey]: baseValue,
      tps: Math.floor(Math.random() * 100) + 20,
      volume: Math.floor(Math.random() * 5000) + 1000,
      success: Math.floor(Math.random() * 4000) + 500,
      received: Math.floor(Math.random() * 5000) + 2000,
      sent: Math.floor(Math.random() * 4500) + 1500,
      delivered: Math.floor(Math.random() * 4000) + 1000,
      attempts: Math.floor(Math.random() * 5000) + 2000,
      successful: Math.floor(Math.random() * 4500) + 1500,
      billable: Math.floor(Math.random() * 4000) + 1000,
      latency: Math.floor(Math.random() * 400) + 50,
      successRate: (Math.random() * 15 + 80).toFixed(2),
    });
  }
  return data;
};
