import React, { useState } from 'react';
import { 
  Search, ChevronLeft, ChevronRight, Filter, Download, Zap, BarChart3, Globe, Plus, 
  Trash2, ShieldAlert, X, Check, ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Play, Sparkles,
  Coins, Percent, SlidersHorizontal, Calculator, HelpCircle, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SupplierRateLookupPopup } from './ProductForms';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area 
} from 'recharts';

interface LookupTableProps {
  title: string;
  data: string[];
  active?: boolean;
}

function LookupTable({ title, data, active }: LookupTableProps) {
  return (
    <div className="flex items-start gap-4 mb-4">
      <div className="w-[180px] pt-2 flex justify-end">
        <label className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
          {title} <span className="text-red-500">*</span> :
        </label>
      </div>
      <div className={cn(
        "bg-white dark:bg-zinc-900 border rounded flex flex-col w-[350px] h-[180px] shadow-sm",
        "border-zinc-200 dark:border-zinc-700"
      )}>
        <div className="flex-1 overflow-auto custom-scrollbar p-1 border-b border-zinc-100 dark:border-zinc-800">
          {data.map((item, i) => (
            <label key={i} className="flex items-center gap-2 px-2 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-zinc-300" />
              <span className="text-[11px] text-zinc-700 dark:text-zinc-300">{item}</span>
            </label>
          ))}
        </div>
        <div className="p-2 flex flex-col gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full px-2 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>Selected 0 of {data.length}</span>
            <div className="flex gap-1">
              <button className="px-2 py-0.5 bg-[#428bca] text-white rounded flex items-center gap-1 hover:bg-blue-600 transition-colors">
                <Plus className="w-2.5 h-2.5" /> Check All
              </button>
              <button className="px-2 py-0.5 bg-[#428bca] text-white rounded flex items-center gap-1 hover:bg-blue-600 transition-colors">
                <Trash2 className="w-2.5 h-2.5" /> Uncheck All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RateLookupView({ theme }: { theme: 'light' | 'dark' }) {
  const [activeTab, setActiveTab] = useState<'Rate Analytics' | 'Customer' | 'Vendor' | 'Margin Analysis' | 'Customer Routing Control' | 'Routing Simulator'>('Rate Analytics');
  const [selectedCustomer, setSelectedCustomer] = useState('Aakash_DIR_IN');
  const [showResults, setShowResults] = useState(false);
  const [supplierPopup, setSupplierPopup] = useState<string | null>(null);
  const [conflictNotification, setConflictNotification] = useState<string | null>(null);

  // Advanced search filters for the Rate Analytics Active Matrix
  const [countryFilter, setCountryFilter] = useState('');
  const [prefixFilter, setPrefixFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Dynamic Wholesale Revenue & Margin Simulator States
  const [simPrefix, setSimPrefix] = useState('+91');
  const [simBuyCost, setSimBuyCost] = useState('0.0012');
  const [simMarkupPct, setSimMarkupPct] = useState('18');
  const [simEstVol, setSimEstVol] = useState('2500000'); // 2.5 Million SMS default

  const [analyticsRates, setAnalyticsRates] = useState([
    { id: '1', country: 'United Arab Emirates', code: '+971', mccmnc: '42402', customer: 'Aakash_DIR_IN', sell: 0.0090, vendor: 'V_RESERVE', buy: 0.0085, margin: 0.0005, pct: 5.5, status: 'Squeezed', dlr: '97.2%' },
    { id: '2', country: 'India', code: '+91', mccmnc: '40445', customer: 'ABC_Trunk', sell: 0.0015, vendor: 'V_ABC', buy: 0.0011, margin: 0.0004, pct: 26.6, status: 'Healthy', dlr: '92.4%' },
    { id: '3', country: 'Greece', code: '+30', mccmnc: '20201', customer: 'Aakash_DIR_IN', sell: 0.0050, vendor: 'Asia_Provider', buy: 0.0040, margin: 0.0010, pct: 20.0, status: 'Healthy', dlr: '98.5%' },
    { id: '4', country: 'Vietnam', code: '+84', mccmnc: '45201', customer: 'Global_Trunk', sell: 0.0042, vendor: 'V_XYZ', buy: 0.0035, margin: 0.0007, pct: 16.6, status: 'Attention', dlr: '89.1%' },
    { id: '5', country: 'Germany', code: '+49', mccmnc: '26201', customer: 'Notify_HQ_IN', sell: 0.0072, vendor: 'V_XYZ', buy: 0.0055, margin: 0.0017, pct: 23.6, status: 'Healthy', dlr: '96.8%' }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 'n1', type: 'increase', text: 'Supplier V_RESERVE increased buy rate for prefix +971 (UAE Vodafone)', impact: 'Margin squeezed to 5.5%', date: '10 mins ago', routeId: '1' },
    { id: 'n2', type: 'decrease', text: 'Supplier Asia_Provider decreased buy rate for prefix +30 (Greece Cosmote)', impact: 'Margin boosted to 20%', date: '1 hour ago', routeId: '3' },
    { id: 'n3', type: 'alert', text: 'Critical Margin Alert for prefix +91 (Airtel India): below target 10%', impact: 'Action: Route to low-cost V_XYZ recommended', date: '2 hours ago', routeId: '2' }
  ]);

  const handleOptimizeGateway = (routeId: string) => {
    setAnalyticsRates(prev => prev.map(item => {
      if (item.id === routeId) {
        const newBuy = Math.max(0.0010, item.buy - 0.0020);
        const newMargin = item.sell - newBuy;
        const newPct = parseFloat(((newMargin / item.sell) * 100).toFixed(1));
        return {
          ...item,
          buy: newBuy,
          margin: newMargin,
          pct: newPct,
          status: 'Healthy',
          vendor: 'V_ABC_LCR'
        };
      }
      return item;
    }));
    setConflictNotification("Least Cost Routing (LCR) engine successfully updated routing gateway for prefix. Margin restored to 24.4%!");
    setTimeout(() => setConflictNotification(null), 4500);
  };

  const handleAdjustSellPrice = (routeId: string) => {
    setAnalyticsRates(prev => prev.map(item => {
      if (item.id === routeId) {
        const newSell = item.sell + 0.0015;
        const newMargin = newSell - item.buy;
        const newPct = parseFloat(((newMargin / newSell) * 100).toFixed(1));
        return {
          ...item,
          sell: newSell,
          margin: newMargin,
          pct: newPct,
          status: 'Healthy'
        };
      }
      return item;
    }));
    setConflictNotification("Customer Sell Price adjusted successfully. Premium route profitability restored with standard target thresholds.");
    setTimeout(() => setConflictNotification(null), 4500);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const mockCustomers = ['Aakash_DIR_IN', 'Notify_HQ_IN', 'Global_Trunk', 'Enterprise_UK_01'];
  const customerProducts = ['Standard Wholesale', 'Premium Direct'];
  const productVendors = [
    { name: 'V_ABC', rate: '0.0040', customerRate: '0.0050', status: 'Active', margin: '0.0010' },
    { name: 'Asia_Provider', rate: '0.0042', customerRate: '0.0050', status: 'Backup', margin: '0.0008' },
  ];

  const mockLists = {
    'Product Category': ['DIRECT (0)', 'HQ (15)', 'SIM (2)', 'WHS (8)', 'ASGM (0)'],
    'Country': ['Abkhazia (7)', 'Afghanistan (93)', 'Albania (355)', 'Algeria (213)'],
    'Customer Trunk': ['Aakash_DIR_IN (2)', 'Aakash_DIR_out (60)', 'abcd_test2C_ANI_TR (63)', 'abcd_testC (62)'],
    'Vendor Trunk': ['V_ABC (10)', 'V_XYZ (5)'],
    'MCCMNC': ['Search result will be shown here']
  };

  const results = [
    { trunkId: '2', trunkName: 'Aakash_DIR_IN', mccmnc: '20201', dialCode: '3021', country: 'Greece', network: 'Cosmote', rate: '0.005000', status: 'Active', change: 'No Change', effective: '2024-01-01' },
    { trunkId: '38', trunkName: 'ABC_Trunk', mccmnc: '40445', dialCode: '91', country: 'India', network: 'Airtel', rate: '0.001200', status: 'Active', change: 'Decreased', effective: '2024-05-15' },
  ];

  const marginResults = [
    { country: 'Greece', network: 'Cosmote', customer: 'Aakash_DIR_IN', customerRate: '0.005000', vendor: 'V_ABC', vendorRate: '0.004000', margin: '0.001000', marginPct: '25%' },
    { country: 'India', network: 'Airtel', customer: 'ABC_Trunk', customerRate: '0.001200', vendor: 'V_XYZ', vendorRate: '0.001000', margin: '0.000200', marginPct: '20%' },
  ];

  const renderRateAnalytics = () => {
    // Recharts data is dynamically calculated from live analyticsRates state to show real-time changes when optimized!
    const chartData = analyticsRates.map(row => ({
      name: `${row.country} (${row.code})`,
      Buy: row.buy,
      Sell: row.sell,
      Margin: row.pct
    }));

    // Calculate dynamic wholesale simulation outputs
    const simVolume = parseFloat(simEstVol) || 1000000;
    const simCost = parseFloat(simBuyCost) || 0.0010;
    const simMarkup = parseFloat(simMarkupPct) || 15;
    
    // Recommended Selling Rate = Buy Cost * (1 + (Markup / 100))
    const simRecSell = simCost + (simCost * (simMarkup / 100));
    const simNetProfitSingleSMS = simRecSell - simCost;
    const simEstTotalRevenue = simVolume * simRecSell;
    const simEstTotalProfit = simVolume * simNetProfitSingleSMS;

    // Filter rates matrix dynamically
    const filteredRates = analyticsRates.filter(row => {
      const countryMatch = row.country.toLowerCase().includes(countryFilter.toLowerCase());
      const codeMatch = row.code.includes(prefixFilter) || row.mccmnc.includes(prefixFilter);
      const statusMatch = statusFilter === 'All' || row.status === statusFilter;
      return countryMatch && codeMatch && statusMatch;
    });

    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 text-left w-full">
        
        {/* SPECIALIZED OPERATIONAL INTRO GUIDE (ENGLISH & GUJARATI OVERVIEW) */}
        <div className="p-6 bg-[#428bca]/5 dark:bg-zinc-800/40 border-l-4 border-[#428bca] rounded-r-2xl space-y-3">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#428bca]" />
            <h4 className="text-sm font-black uppercase text-zinc-800 dark:text-zinc-150 tracking-wider">
              SMS Wholesale Operational Intelligence • System Guidelines
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            <div className="space-y-1 bg-white/40 dark:bg-black/10 p-3 rounded-lg">
              <p className="font-extrabold text-zinc-800 dark:text-zinc-200">📊 SMS Wholesale Business Feasibility Fact:</p>
              <p>
                In high-volume SMS transit, carrier operators buy and sell routing bandwidth in millions. Profit margins are incredibly thin, measured in fractions of a cent (down to <span className="font-mono font-bold text-[#428bca]">$0.0001</span> per SMS). A price fluctuation of even $0.0002 has severe cumulative impacts on profitability. Keep buy rates low and proactively markup client selling tiers to protect yield.
              </p>
            </div>
            <div className="space-y-1 bg-white/40 dark:bg-black/10 p-3 rounded-lg">
              <p className="font-extrabold text-[#428bca]">💡 Route Margins & LCR Description (System Study Guide):</p>
              <p>
                Whenever upstream suppliers increase their wholesale rates, client margins are <span className="text-rose-500 font-bold">Squeezed</span>. Use this tool to execute one-click **LCR Optimize** to divert traffic to lower-cost carriers, or **Adjust Price** to raise customer rates and secure profitability.
              </p>
            </div>
          </div>
        </div>

        {/* TOP LEVEL KPIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50/50 to-white dark:from-zinc-900 dark:to-zinc-805/30 p-4 rounded-xl border border-blue-100 dark:border-zinc-850 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">Monitored Routes</span>
              <p className="text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-50">{analyticsRates.length}</p>
              <span className="text-[10px] text-zinc-400 font-bold block">Active MCC-MNC Bundles</span>
            </div>
            <div className="p-3 bg-blue-100/65 dark:bg-blue-950/20 text-[#428bca] rounded-lg">
              <Globe className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/50 to-white dark:from-zinc-900 dark:to-zinc-805/30 p-4 rounded-xl border border-emerald-100 dark:border-zinc-850 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-450 uppercase tracking-widest block">Average Yield</span>
              <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-450">
                {(analyticsRates.reduce((acc, current) => acc + current.pct, 0) / analyticsRates.length).toFixed(2)}%
              </p>
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Protected Wholesale Cap
              </span>
            </div>
            <div className="p-3 bg-emerald-100/65 dark:bg-emerald-950/20 text-emerald-600 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50/50 to-white dark:from-zinc-900 dark:to-zinc-850/30 p-4 rounded-xl border border-amber-100 dark:border-zinc-850 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest block">Current Squeezed</span>
              <p className="text-2xl font-extrabold font-mono text-amber-550 dark:text-amber-400">
                {analyticsRates.filter(r => r.status === 'Squeezed').length} Routes
              </p>
              <span className="text-[10px] text-zinc-400 font-bold block">Action Code: Markup Mandate</span>
            </div>
            <div className="p-3 bg-amber-100/65 dark:bg-amber-950/20 text-amber-500 rounded-lg">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-50/50 to-white dark:from-zinc-900 dark:to-zinc-805/30 p-4 rounded-xl border border-rose-100 dark:border-zinc-850 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-rose-600 dark:text-rose-455 uppercase tracking-widest block">Defensive Guard</span>
              <p className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-455">LCR Active</p>
              <span className="text-[10px] text-zinc-400 font-bold block">Automatic Profit Protection</span>
            </div>
            <div className="p-3 bg-rose-100/65 dark:bg-rose-950/20 text-rose-500 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* DYNAMIC WHOLESALE FEASIBILITY SIMULATOR & CALCULATOR */}
        <div className="bg-[#f8f9fa] dark:bg-zinc-900/60 p-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm text-left">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-5">
            <div>
              <h4 className="text-sm font-black uppercase text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#428bca]" /> Prefix-Wise Wholesale Profit Feasibility Simulator
              </h4>
              <p className="text-[11px] text-zinc-400 font-medium">Pre-simulate profit margins and rates for any multi-million volume order or carrier dispatch</p>
            </div>
            <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[9px] rounded-lg font-black uppercase tracking-wider">
              Interactive sandbox
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Input sliders & text controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Target Dial / Prefix:</label>
                  <input 
                    type="text" 
                    value={simPrefix}
                    onChange={(e) => setSimPrefix(e.target.value)}
                    placeholder="e.g. +91" 
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-bold outline-none ring-1 ring-zinc-100 focus:ring-[#428bca]"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">Carrier Buy Cost (USD / SMS):</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={simBuyCost}
                    onChange={(e) => setSimBuyCost(e.target.value)}
                    placeholder="e.g. 0.0012" 
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-mono font-bold outline-none ring-1 ring-zinc-100 focus:ring-[#428bca]"
                  />
                </div>
              </div>

              {/* Slider for volume */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-450 font-mono">
                  <span>Anticipated Traffic Volume (SMS/Month):</span>
                  <span className="text-[#428bca] bg-[#428bca]/10 px-2.5 py-0.5 rounded-full text-xs font-black">
                    {simVolume.toLocaleString()} SMS
                  </span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="20000000" 
                  step="100000"
                  value={simEstVol}
                  onChange={(e) => setSimEstVol(e.target.value)}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#428bca]"
                />
                <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                  <span>100K SMS</span>
                  <span>10 Million</span>
                  <span>20 Million</span>
                </div>
              </div>

              {/* Slider for target wholesale markup percentage */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-zinc-450 font-mono">
                  <span>Desired Markup Profit Ratio (%):</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-black font-mono">
                    {simMarkup}% Markup
                  </span>
                </div>
                <input 
                  type="range" 
                  min="3" 
                  max="45" 
                  step="1"
                  value={simMarkupPct}
                  onChange={(e) => setSimMarkupPct(e.target.value)}
                  className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[#428bca]"
                />
                <div className="flex justify-between text-[9px] text-zinc-400 font-bold uppercase">
                  <span>3% (Thin Profit)</span>
                  <span>20% (Medium Yield)</span>
                  <span>45% (Premium direct/Direct connection)</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Output Card */}
            <div className="lg:col-span-5 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
              <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider font-mono">SIMULATED ECONOMIC OUTPUTS</span>
                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                  simMarkup >= 18 ? "bg-emerald-50 text-emerald-600" : simMarkup >= 10 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                )}>
                  {simMarkup >= 18 ? "Optimal Feasibility" : simMarkup >= 10 ? "Acceptable Yield" : "Low Margin Risk"}
                </span>
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-zinc-500">Rec. Client Rate per SMS:</span>
                  <span className="font-mono font-black text-zinc-850 dark:text-zinc-200 text-sm">
                    ${simRecSell.toFixed(5)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-zinc-500">Predicted Monthly Revenue:</span>
                  <span className="font-mono font-black text-[#428bca] text-lg">
                    ${simEstTotalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-zinc-500">Predicted Profit Margin:</span>
                  <span className="font-mono font-black text-emerald-600 text-lg">
                    +${simEstTotalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                <p className="text-[10px] text-zinc-400 font-bold leading-normal text-left">
                  💡 Wholesale Math: Billed {simVolume.toLocaleString()} SMS per month at sell rate <span className="text-zinc-800 dark:text-zinc-200 font-mono font-semibold">${simRecSell.toFixed(5)}</span> per SMS. This provides a clean profit pocket of <span className="text-emerald-600 font-mono font-semibold">${simNetProfitSingleSMS.toFixed(5)}</span> on every SMS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PRIMARY BI-PANEL: RE-ANIMATED LIVE GRAPH VS FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: GRAPH OF SELL PRICE VS BUY COST */}
          <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[380px]">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-0.5">
                <h4 className="text-[12px] font-black uppercase text-zinc-700 dark:text-zinc-300 tracking-wider">Sell Price vs Buy Cost (GAP Analysis)</h4>
                <p className="text-[10px] text-zinc-400 font-bold">Dynamic comparison representing active carrier parameters. Optimizing a route drops buy cost immediately!</p>
              </div>
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[9px] rounded font-bold uppercase">USD BASE</span>
            </div>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3 animate-pulse" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                  <YAxis yAxisId="left" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 9, fontWeight: 700 }} stroke="#10b981" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 10, fontWeight: 700 }} verticalAlign="top" height={36} />
                  <Bar yAxisId="left" dataKey="Buy" name="Buy Cost ($)" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar yAxisId="left" dataKey="Sell" name="Sell Price ($)" fill="#428bca" radius={[4, 4, 0, 0]} barSize={24} />
                  <Line yAxisId="right" type="monotone" dataKey="Margin" name="Margin %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT: LIVE EVENT FEED & ADJUSTMENT ENGINE */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[380px]">
             <div className="flex justify-between items-center mb-4 pb-2 border-b border-zinc-100 dark:border-zinc-800">
                <h4 className="text-[11px] font-black uppercase text-zinc-700 dark:text-zinc-300 tracking-widest flex items-center gap-1.5 flex-1">
                   <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" /> Carrier Price Event Stream
                </h4>
                <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-[#428bca] text-[8px] font-black rounded uppercase">Live Feed</span>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center text-zinc-400 gap-2">
                     <Check className="w-8 h-8 text-emerald-500 bg-emerald-50 p-1.5 rounded-full" />
                     <p className="text-[11px] font-bold uppercase">All Carrier update alerts resolved!</p>
                  </div>
                ) : (
                  notifications.map(n => (
                     <div key={n.id} className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-lg border border-zinc-150 dark:border-zinc-800 space-y-2 relative group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <button 
                           onClick={() => handleDismissNotification(n.id)}
                           className="absolute right-2 top-2 text-zinc-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 outline-none cursor-pointer"
                        >
                           <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-start gap-2">
                           <span className={cn(
                             "w-2 h-2 mt-1.5 rounded-full ring-4 shrink-0",
                             n.type === 'increase' ? 'bg-amber-500 ring-amber-500/10' : n.type === 'decrease' ? 'bg-emerald-500 ring-emerald-500/10' : 'bg-rose-500 ring-rose-500/10'
                           )} />
                           <div className="space-y-1">
                              <p className="text-[11px] font-black text-zinc-700 dark:text-zinc-300 leading-tight">{n.text}</p>
                              <div className="flex items-center gap-2">
                                 <span className="text-[9px] font-bold text-zinc-400 uppercase">{n.date}</span>
                                 <span className="text-[9px] font-bold text-[#428bca] bg-blue-50 dark:bg-blue-900/10 px-1.5 py-0.5 rounded italic">{n.impact}</span>
                              </div>
                           </div>
                        </div>

                        {analyticsRates.find(r => r.id === n.routeId)?.status !== 'Healthy' && (
                           <div className="flex gap-2 pt-1 border-t border-zinc-200/50 dark:border-zinc-700/50">
                              <button 
                                 onClick={() => handleOptimizeGateway(n.routeId)}
                                 className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase rounded flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                 <Sparkles className="w-3 h-3" /> Optimize
                              </button>
                              <button 
                                 onClick={() => handleAdjustSellPrice(n.routeId)}
                                 className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-black uppercase rounded flex items-center justify-center gap-1 transition-all cursor-pointer"
                              >
                                 Adjust Price
                              </button>
                           </div>
                        )}
                     </div>
                  ))
                )}
             </div>
          </div>
        </div>

        {/* ACTIVE WHOLESALE ROUTE ANALYTICS MATRIX with Advanced Interactive Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden text-left">
           <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                 <div className="space-y-0.5">
                    <h4 className="text-[12px] font-black uppercase text-zinc-700 dark:text-zinc-200 tracking-widest flex items-center gap-2">
                       <BarChart3 className="w-4 h-4 text-[#428bca]" /> Active Wholesale Route Analytics Matrix
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-bold">Lease cost comparison, selling yield optimization, and destination prefix profitability status</p>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <span className="text-[9.5px] font-bold text-zinc-400 uppercase">Interactive simulation matrix :</span>
                    <button 
                       onClick={() => {
                         setAnalyticsRates([
                           { id: '1', country: 'United Arab Emirates', code: '+971', mccmnc: '42402', customer: 'Aakash_DIR_IN', sell: 0.0090, vendor: 'V_RESERVE', buy: 0.0085, margin: 0.0005, pct: 5.5, status: 'Squeezed', dlr: '97.2%' },
                           { id: '2', country: 'India', code: '+91', mccmnc: '40445', customer: 'ABC_Trunk', sell: 0.0015, vendor: 'V_ABC', buy: 0.0011, margin: 0.0004, pct: 26.6, status: 'Healthy', dlr: '92.4%' },
                           { id: '3', country: 'Greece', code: '+30', mccmnc: '20201', customer: 'Aakash_DIR_IN', sell: 0.0050, vendor: 'Asia_Provider', buy: 0.0040, margin: 0.0010, pct: 20.0, status: 'Healthy', dlr: '98.5%' },
                           { id: '4', country: 'Vietnam', code: '+84', mccmnc: '45201', customer: 'Global_Trunk', sell: 0.0042, vendor: 'V_XYZ', buy: 0.0035, margin: 0.0007, pct: 16.6, status: 'Attention', dlr: '89.1%' },
                           { id: '5', country: 'Germany', code: '+49', mccmnc: '26201', customer: 'Notify_HQ_IN', sell: 0.0072, vendor: 'V_XYZ', buy: 0.0055, margin: 0.0017, pct: 23.6, status: 'Healthy', dlr: '96.8%' }
                         ]);
                         setNotifications([
                           { id: 'n1', type: 'increase', text: 'Supplier V_RESERVE increased buy rate for prefix +971 (UAE Vodafone)', impact: 'Margin squeezed to 5.5%', date: '10 mins ago', routeId: '1' },
                           { id: 'n2', type: 'decrease', text: 'Supplier Asia_Provider decreased buy rate for prefix +30 (Greece Cosmote)', impact: 'Margin boosted to 20%', date: '1 hour ago', routeId: '3' },
                           { id: 'n3', type: 'alert', text: 'Critical Margin Alert for prefix +91 (Airtel India): below target 10%', impact: 'Action: Route to low-cost V_XYZ recommended', date: '2 hours ago', routeId: '2' }
                         ]);
                       }}
                       className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                    >
                       Reset Simulation Data
                    </button>
                 </div>
              </div>

              {/* SEARCH FILTERS CONTROLS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl border border-zinc-150 dark:border-zinc-805/60 mt-2">
                 <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest font-mono">Filter Country:</span>
                    <div className="relative">
                       <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                       <input 
                         type="text" 
                         value={countryFilter}
                         onChange={(e) => setCountryFilter(e.target.value)}
                         placeholder="Search countries..." 
                         className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest font-mono">Filter Prefix / MCCMNC:</span>
                    <div className="relative">
                       <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                       <input 
                         type="text" 
                         value={prefixFilter}
                         onChange={(e) => setPrefixFilter(e.target.value)}
                         placeholder="Prefix (e.g. +30) / Code..." 
                         className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs outline-none"
                       />
                    </div>
                 </div>

                 <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-zinc-400 block tracking-widest font-mono">Filter Margin Status:</span>
                    <div className="flex bg-white dark:bg-zinc-800 p-1 border border-zinc-200 dark:border-zinc-700 rounded-xl">
                       {['All', 'Healthy', 'Attention', 'Squeezed'].map(status => (
                          <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                              "flex-1 py-1 text-[9.5px] font-black uppercase rounded-lg transition-all whitespace-nowrap cursor-pointer",
                              statusFilter === status 
                                ? "bg-[#428bca] text-white shadow-sm" 
                                : "text-zinc-500 hover:text-zinc-800"
                            )}
                          >
                             {status}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#f8f9fa] dark:bg-zinc-800 text-[9px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                       <th className="px-6 py-4">Country & Prefix</th>
                       <th className="px-6 py-4">MCCMNC</th>
                       <th className="px-6 py-4">Trunk Account</th>
                       <th className="px-6 py-4">Buy Cost ($)</th>
                       <th className="px-6 py-4">Sell Price ($)</th>
                       <th className="px-6 py-4">Net Margin ($)</th>
                       <th className="px-6 py-4">Margin %</th>
                       <th className="px-6 py-4">DLR Ratio</th>
                       <th className="px-6 py-4">Status Badging</th>
                       <th className="px-6 py-4 text-center">Interactive Tool Controls</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {filteredRates.length === 0 ? (
                       <tr>
                          <td colSpan={10} className="px-6 py-12 text-center text-xs font-black text-zinc-400 uppercase tracking-wider bg-zinc-50/50">
                             No matching rates found. Try resetting custom matrix filters!
                          </td>
                       </tr>
                    ) : (
                       filteredRates.map(row => (
                          <tr key={row.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-all">
                             <td className="px-6 py-4">
                                <span className="text-[11px] font-black text-[#428bca] uppercase block">{row.country}</span>
                                <span className="text-[9px] text-zinc-400 font-mono font-bold uppercase">{row.code} Prefix Code</span>
                             </td>
                             <td className="px-6 py-4 text-[10.5px] font-mono text-zinc-500 font-bold">{row.mccmnc}</td>
                             <td className="px-6 py-4 text-[11px] font-bold text-zinc-650 dark:text-zinc-350">{row.customer}</td>
                             <td className="px-6 py-4">
                                <span className="text-[11px] font-mono text-zinc-500 font-bold">${row.buy.toFixed(4)}</span>
                                <span className="text-[8px] text-zinc-400 font-sans block uppercase font-black tracking-widest mt-0.5">{row.vendor}</span>
                             </td>
                             <td className="px-6 py-4 font-mono font-black text-[11px] text-zinc-850 dark:text-zinc-150">${row.sell.toFixed(4)}</td>
                             <td className="px-6 py-4 font-mono font-extrabold text-[11px] text-emerald-600">${row.margin.toFixed(4)}</td>
                             <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2.1 py-0.5 rounded font-mono font-black text-[10.5px]",
                                  row.pct > 18 ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : row.pct > 10 ? "text-amber-650 bg-amber-50 dark:bg-amber-950/20" : "text-rose-600 bg-rose-50 dark:bg-rose-950/20"
                                )}>
                                  {row.pct}%
                                </span>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-[11px] font-black font-mono text-teal-600">{row.dlr}</span>
                                <span className="text-[8.5px] text-zinc-400 block uppercase font-bold">Delivery Rate</span>
                             </td>
                             <td className="px-6 py-4">
                                <span className={cn(
                                  "px-2 py-0.5 text-[8.5px] font-black rounded uppercase tracking-wider inline-block",
                                  row.status === 'Healthy' ? "bg-emerald-50 text-emerald-650 border border-emerald-100" : row.status === 'Attention' ? "bg-amber-50 text-amber-650 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-105"
                                )}>
                                  {row.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-center whitespace-nowrap">
                                {row.status !== 'Healthy' ? (
                                   <div className="inline-flex gap-1.5 justify-center">
                                      <button 
                                         onClick={() => handleOptimizeGateway(row.id)}
                                         title="Switch customer destination route to lowest cost provider (LCR optimization)"
                                         className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black uppercase rounded-lg shadow-md hover:-translate-y-0.5 transition-all outline-none cursor-pointer"
                                      >
                                         LCR Optimize
                                      </button>
                                      <button 
                                         onClick={() => handleAdjustSellPrice(row.id)}
                                         title="Increase customer selling price to safeguard profit margins"
                                         className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-black uppercase rounded-lg shadow-md hover:-translate-y-0.5 transition-all outline-none cursor-pointer"
                                      >
                                         Mark Up
                                      </button>
                                   </div>
                                ) : (
                                   <div className="flex items-center justify-center gap-1.5 text-emerald-600 text-[10.5px] font-extrabold italic">
                                      <Check className="w-3.5 h-3.5" /> Route Optimized
                                   </div>
                                )}
                             </td>
                          </tr>
                       ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>

      </div>
    );
  };

  const renderRoutingControl = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex flex-wrap items-end gap-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="space-y-1.5 min-w-[250px]">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Select Customer Profile</label>
             <select 
               value={selectedCustomer}
               onChange={(e) => setSelectedCustomer(e.target.value)}
               className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold focus:border-[#428bca] outline-none transition-all"
             >
                {mockCustomers.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
          </div>
          <div className="space-y-1.5 min-w-[200px]">
             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Product</label>
             <select className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-bold focus:border-[#428bca] outline-none">
                {customerProducts.map(p => <option key={p}>{p}</option>)}
             </select>
          </div>
          <button className="h-10 px-8 bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">Load Profile Data</button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                   <h4 className="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#428bca]" /> Supplier & Rate Insights
                   </h4>
                   <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded uppercase font-sans">Healthy Margins</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-[#f8f9fa] dark:bg-zinc-800/50 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                         <tr className="border-b border-zinc-200 dark:border-zinc-700">
                            <th className="px-6 py-3">Supplier (Click to View Profile)</th>
                            <th className="px-6 py-3">Cost ($)</th>
                            <th className="px-6 py-3">Selling ($)</th>
                            <th className="px-6 py-3">Profit ($)</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                         {productVendors.map((v, i) => (
                            <tr key={i} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all">
                               <td className="px-6 py-4">
                                  <button onClick={() => setSupplierPopup(v.name)} className="text-[11px] font-black text-[#428bca] hover:underline underline-offset-4 decoration-2 uppercase">{v.name}</button>
                                  <div className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5 italic">Auto-Sync Enabled</div>
                               </td>
                               <td className="px-6 py-4 font-mono text-[11px] font-bold text-zinc-500">${v.rate}</td>
                               <td className="px-6 py-4 font-mono text-[11px] font-bold text-zinc-800 dark:text-zinc-200">${v.customerRate}</td>
                               <td className="px-6 py-4 font-mono text-[11px] font-black text-emerald-600">+${v.margin}</td>
                               <td className="px-6 py-4">
                                  <span className={cn("px-2 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter", 
                                    v.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500")}>
                                     {v.status}
                                  </span>
                               </td>
                               <td className="px-6 py-4 text-right">
                                  <button onClick={() => setActiveTab('Margin Analysis')} className="text-[10px] font-black text-[#428bca] uppercase underline decoration-dotted">Adjust Routing</button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>

             <div className="p-6 bg-zinc-900 text-white rounded-xl shadow-2xl border border-zinc-800 space-y-4">
                <div className="flex justify-between items-center text-zinc-400">
                   <h5 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Active Dynamic Routing
                   </h5>
                   <button className="text-[9px] font-black bg-blue-600 text-white px-4 py-1.5 rounded uppercase shadow-lg shadow-blue-500/20 active:scale-95">Update Primary Gateway</button>
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">Routing Mechanism</label>
                      <div className="grid grid-cols-2 gap-2">
                         <button className="px-3 py-2 border border-[#428bca] rounded text-[10px] font-black uppercase bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(66,139,202,0.1)]">Smart LCR</button>
                         <button className="px-3 py-2 border border-zinc-700 rounded text-[10px] font-black uppercase bg-zinc-800 text-zinc-500">Weight WRR</button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
                <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-50 dark:border-zinc-800 pb-3 italic">Customer P&L Insight</h5>
                <div className="space-y-5">
                   <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-zinc-400 uppercase">Revenue (MTD)</span>
                         <span className="text-xl font-black font-mono text-zinc-800 dark:text-zinc-100">$8,940.00</span>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded shadow-sm font-sans">+8.4% ↑</div>
                   </div>
                   <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Gross Margin %</span>
                         <span className="text-xl font-black font-mono text-emerald-600">22.4%</span>
                      </div>
                      <div className="text-[10px] font-bold text-zinc-400 uppercase italic">On Target</div>
                   </div>
                </div>
             </div>
             
             <div className="p-6 bg-amber-50/50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-900/30 space-y-3">
                <h5 className="text-[11px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4" /> Routing Conflict Detected
                </h5>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">
                   Vendor <strong>V_ABC</strong> has increased rates for prefix <strong>+91</strong>. Current margin will drop below threshold (10%).
                </p>
                <div className="flex gap-2">
                   <button 
                     onClick={() => {
                       setConflictNotification("Dynamic cost margin threshold restored. Pricing for prefix +91 has been marked up to $0.0055 in standard customer rate table Vt_001.");
                       setTimeout(() => setConflictNotification(null), 4500);
                     }}
                     className="flex-1 py-2 bg-amber-600 text-white text-[9px] font-black uppercase rounded shadow-md hover:bg-amber-700 font-sans"
                   >
                     Auto-Apply Rate
                   </button>
                   <button 
                     onClick={() => {
                       setConflictNotification("Product has been successfully relinked to alternative low-cost supplier 'Asia_Provider' to preserve 25% margin.");
                       setTimeout(() => setConflictNotification(null), 4500);
                     }}
                     className="flex-1 py-2 bg-zinc-800 text-white text-[9px] font-black uppercase rounded shadow-md font-sans"
                   >
                     Relink Product
                   </button>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderRoutingSimulator = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <div className="md:col-span-1 space-y-1.5">
             <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Test Customer</label>
             <select className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-bold">
                {mockCustomers.map(c => <option key={c}>{c}</option>)}
             </select>
          </div>
          <div className="md:col-span-1 space-y-1.5">
             <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Target MCCMNC</label>
             <input type="text" defaultValue="40401" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-black" />
          </div>
          <div className="md:col-span-1 space-y-1.5">
             <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Product Class</label>
             <select className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none font-bold">
                <option>Premium Direct</option>
                <option>Standard LCR</option>
             </select>
          </div>
          <div className="flex items-end">
             <button className="h-9 w-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">Simulate Route</button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
             <h4 className="text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" /> Resolved Routing Chain
             </h4>
             <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-100 dark:before:bg-zinc-800">
                {[
                  { rank: 'PRIMARY', vendor: 'V_ASIA_DIRECT', cost: '0.0050', status: 'Healthy', quality: '99.2%' },
                  { rank: 'FAILOVER 1', vendor: 'V_GLOBAL_HUB', cost: '0.0052', status: 'Warning', quality: '91.0%' },
                  { rank: 'FAILOVER 2', vendor: 'V_RESERVE', cost: '0.0065', status: 'Offline', quality: '0%' },
                ].map((step, idx) => (
                  <div key={idx} className="relative pl-12">
                     <div className={cn(
                       "absolute left-4 top-1 w-4 h-4 rounded-full border-2 bg-white dark:bg-zinc-900 border-zinc-200",
                       idx === 0 ? "border-emerald-500 bg-emerald-500" : "border-zinc-300"
                     )}></div>
                     <div className="bg-white dark:bg-zinc-900 p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{step.rank}</span>
                           <span className={cn(
                             "text-[9px] font-black uppercase px-2 py-0.5 rounded",
                             step.status === 'Healthy' ? "bg-emerald-50 text-emerald-600" : "bg-zinc-50 text-zinc-400"
                           )}>{step.status}</span>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="flex flex-col">
                              <span className="text-[11px] font-black text-[#428bca] uppercase">{step.vendor}</span>
                              <span className="text-[9px] text-zinc-400 font-bold uppercase">Success Rate: {step.quality}</span>
                           </div>
                           <span className="text-sm font-black font-mono text-zinc-700 dark:text-zinc-200">${step.cost}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="space-y-6">
             <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-2xl space-y-6">
                <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center border-b border-zinc-800 pb-4 italic">Economic Projection</h5>
                <div className="grid grid-cols-2 gap-8 text-center">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Estimated Margin</span>
                      <div className="text-2xl font-black font-mono text-emerald-500">24.2%</div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-zinc-500 uppercase">Traffic Distribution</span>
                      <div className="text-2xl font-black font-mono text-blue-500">80/20</div>
                   </div>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                   <p className="text-[9px] text-blue-400 font-bold uppercase leading-relaxed text-center">
                     Routing strategy correctly avoids Vendor <strong>V_RESERVE</strong> due to negative margin detection for prefix <strong>404</strong>.
                   </p>
                </div>
             </div>

             <div className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
                <h5 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Routing Rules Applied</h5>
                <div className="space-y-2">
                   {[
                     'Rule #104: Preferred Asia Vendor Priority',
                     'Rule #88: Quality Failover (DLR < 85%)',
                     'Rule #12: Global Margin Protect (Min 10%)'
                   ].map(rule => (
                     <div key={rule} className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#428bca]"></div>
                        {rule}
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-[#f0f2f5] dark:bg-black/40">
      {conflictNotification && (
        <div className="fixed top-4 right-4 z-[200] max-w-sm animate-in fade-in slide-in-from-top-4 duration-350">
          <div className="bg-emerald-650 text-white font-sans text-[11px] font-bold px-4 py-3 rounded-xl shadow-xl border border-emerald-500/30 flex items-start gap-2.5">
            <Check className="w-4 h-4 shrink-0 mt-0.5 bg-white/20 p-0.5 rounded-full" />
            <div>
              <p className="uppercase tracking-widest text-[8px] font-black opacity-85">Automation Notice</p>
              <p className="mt-0.5 leading-normal text-[10px] sm:text-[11px]">{conflictNotification}</p>
            </div>
          </div>
        </div>
      )}
      {supplierPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <SupplierRateLookupPopup supplierName={supplierPopup} onClose={() => setSupplierPopup(null)} />
        </div>
      )}
      {/* Breadcrumb Header */}
      <div className="px-4 py-2 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 text-[12px]">
          <span className="font-bold text-[#428bca]">Product / Rate Analytics</span>
          <span className="text-zinc-400">/ {activeTab}</span>
        </div>
        <div className="flex gap-2">
           {activeTab === 'Margin Analysis' && (
             <button className="px-4 py-1 bg-[#5cb85c] text-white text-[11px] font-bold rounded shadow hover:bg-green-600 flex items-center gap-2 uppercase tracking-widest transition-all">
                <BarChart3 className="w-3.5 h-3.5" /> Analyze Margins
             </button>
           )}
           <button 
             onClick={() => setShowResults(!showResults)}
             className="px-6 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded shadow hover:bg-blue-600 flex items-center gap-2 uppercase tracking-widest transition-all"
           >
             {showResults ? 'Back to Request' : 'Search Rates'}
           </button>
        </div>
      </div>

      {!showResults ? (
        <>
          {/* Tabs */}
          <div className="px-4 mt-4">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {(['Rate Analytics', 'Customer', 'Vendor', 'Margin Analysis', 'Customer Routing Control', 'Routing Simulator'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-2.5 text-[11px] font-black uppercase tracking-widest border transition-all rounded-t-lg whitespace-nowrap",
                    activeTab === tab 
                      ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 border-b-white dark:border-b-zinc-900 text-[#428bca] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]" 
                      : "bg-[#e9ecef] dark:bg-zinc-800 border-transparent text-zinc-500 hover:bg-[#dee2e6]"
                  )}
                >
                  {tab === 'Customer Routing Control' ? 'Customer Profile Dashboard' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Main Workspace */}
          <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 mx-4 mb-4 border border-zinc-200 dark:border-zinc-700 rounded-b-lg rounded-tr-lg p-8 shadow-md">
            {activeTab === 'Rate Analytics' ? renderRateAnalytics() : activeTab === 'Routing Simulator' ? renderRoutingSimulator() : activeTab === 'Customer Routing Control' ? renderRoutingControl() : activeTab === 'Margin Analysis' ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-blue-50/50 dark:bg-blue-500/5 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h4 className="text-[11px] font-black uppercase text-[#428bca] tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Wholesale Margin Simulation
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase italic">Compare Customer(s)</label>
                      <select multiple className="w-full h-32 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                        <option>Aakash_DIR_IN</option>
                        <option>Notify_HQ_IN</option>
                        <option>Global_Trunk</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase italic">Against Vendor(s)</label>
                      <select multiple className="w-full h-32 px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none">
                        <option>V_ABC</option>
                        <option>V_XYZ</option>
                        <option>Asia_Provider</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase italic">Min Margin Threshold (%)</label>
                        <input type="number" defaultValue="15" className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none" />
                      </div>
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-100 dark:border-amber-800/30">
                        <p className="text-[9px] text-amber-700 dark:text-amber-400 font-bold uppercase leading-relaxed">
                          This tool will cross-reference all dial codes and flag destinations with negative or below-threshold margins.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" /> Quick Comparison Results
                  </h4>
                  <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-800 rounded-lg">
                    <table className="w-full text-left">
                      <thead className="bg-[#f8f9fa] dark:bg-zinc-800 font-sans">
                        <tr className="border-b border-zinc-200 dark:border-zinc-700">
                          {['Country', 'Network', 'Customer', 'Cust Rate', 'Vendor', 'Vend Rate', 'Margin', '%'].map(h => (
                            <th key={h} className="px-3 py-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {marginResults.map((row, i) => (
                          <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 text-[10px] hover:bg-zinc-50">
                            <td className="px-3 py-2 font-bold">{row.country}</td>
                            <td className="px-3 py-2 text-zinc-500">{row.network}</td>
                            <td className="px-3 py-2 font-bold text-[#428bca]">{row.customer}</td>
                            <td className="px-3 py-2 font-mono">{row.customerRate}</td>
                            <td className="px-3 py-2 font-bold text-[#428bca]">{row.vendor}</td>
                            <td className="px-3 py-2 font-mono">{row.vendorRate}</td>
                            <td className="px-3 py-2 font-black text-emerald-600">{row.margin}</td>
                            <td className="px-3 py-2">
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-bold">{row.marginPct}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex flex-col">
                  <LookupTable title="Product Category" data={mockLists['Product Category']} />
                  <LookupTable title="Country" data={mockLists['Country']} />
                </div>
                <div className="flex flex-col">
                  <LookupTable 
                    title={activeTab === 'Customer' ? "Customer Trunk" : "Vendor Trunk"} 
                    data={activeTab === 'Customer' ? mockLists['Customer Trunk'] : mockLists['Vendor Trunk']} 
                  />
                  <LookupTable title="MCCMNC" data={mockLists['MCCMNC']} />
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-auto p-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-lg overflow-hidden">
             <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-[#f8f9fa] dark:bg-zinc-800/50 flex justify-between items-center">
                <h3 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest">Search Result</h3>
                <div className="flex gap-2">
                   <button className="px-3 py-1 bg-[#5cb85c] text-white text-[10px] font-bold rounded flex items-center gap-1.5 hover:bg-green-600 shadow-sm"><Download className="w-3 h-3" /> Excel</button>
                   <button className="px-3 py-1 bg-[#428bca] text-white text-[10px] font-bold rounded flex items-center gap-1.5 hover:bg-blue-600 shadow-sm"><Globe className="w-3 h-3" /> Send Tech info</button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                         {['Trunk ID', 'Trunk Name', 'MCCMNC', 'Dial Code', 'Country', 'Network', 'Rate (EUR)', 'Status', 'Change Type', 'Effective Date'].map(h => (
                           <th key={h} className="px-4 py-3 text-[10px] font-black uppercase text-zinc-500 tracking-wider border-r border-zinc-200 dark:border-zinc-800 last:border-r-0 whitespace-nowrap">
                              {h}
                           </th>
                         ))}
                      </tr>
                   </thead>
                   <tbody>
                      {results.map((row, i) => (
                        <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 transition-colors">
                           <td className="px-4 py-3 text-[11px] font-bold text-[#428bca]">{row.trunkId}</td>
                           <td className="px-4 py-3 text-[11px] font-medium">{row.trunkName}</td>
                           <td className="px-4 py-3 text-[11px] font-medium">{row.mccmnc}</td>
                           <td className="px-4 py-3 text-[11px] font-medium">{row.dialCode}</td>
                           <td className="px-4 py-3 text-[11px] font-medium">{row.country}</td>
                           <td className="px-4 py-3 text-[11px] font-medium">{row.network}</td>
                           <td className="px-4 py-3 text-[11px] font-black text-brand-500">{row.rate}</td>
                           <td className="px-4 py-3 text-[11px] font-bold text-emerald-600 uppercase">{row.status}</td>
                           <td className={cn(
                             "px-4 py-3 text-[11px] font-bold uppercase",
                             row.change === 'Decreased' ? "text-emerald-600" : "text-zinc-500"
                           )}>{row.change}</td>
                           <td className="px-4 py-3 text-[11px] font-medium whitespace-nowrap">{row.effective}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             <div className="px-4 py-3 bg-[#f8f9fa] border-t border-zinc-100 flex justify-between items-center text-[10px] font-bold text-zinc-400">
                <span>SHOWING 1 TO 2 OF 2 RECORDS</span>
                <div className="flex gap-1">
                   <button className="px-3 py-1 bg-white border border-zinc-200 rounded text-zinc-400">Previous</button>
                   <button className="px-3 py-1 bg-[#428bca] text-white rounded">1</button>
                   <button className="px-3 py-1 bg-white border border-zinc-200 rounded text-zinc-400">Next</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
