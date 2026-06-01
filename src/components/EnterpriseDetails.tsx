import React from 'react';
import { cn } from '../lib/utils';
import { 
  Plus, Edit2, Copy, Eye, Send, Trash2, History, RotateCcw, 
  Search, Save, X, Calendar, Download, Upload, Info, MapPin, Phone, Mail, 
  CreditCard, Landmark, Wallet, Globe, FileText, Server, Users, Zap, DollarSign,
  Check, Settings
} from 'lucide-react';
import { EnterpriseForm } from './EnterpriseForms';
import { DynamicRoutingForm } from './RouteForms';
import { SMSWholesaleSwitchForm, SMSWholesaleProductForm } from './ProductForms';

interface EnterpriseDetailsViewProps {
  theme: 'light' | 'dark';
}

export function EnterpriseDetailsView({ theme }: EnterpriseDetailsViewProps) {
  const [activeTab, setActiveTab] = React.useState('Customer Trunk');
  const [selectedTrunk, setSelectedTrunk] = React.useState<any>(null);
  const [viewMode, setViewMode] = React.useState<
    'list' | 'add_enterprise' | 'edit_enterprise' | 'view_enterprise' |
    'add_customer' | 'add_customer_account' | 'edit_customer' | 'view_customer' |
    'dynamic_routing' | 'add_vendor' | 'add_vendor_account' | 'edit_vendor' | 'view_vendor' |
    'deploy_switch' | 'send_rate'
  >('list');
  const tabs = ['Vendor Trunk', 'Customer Trunk'];

  const [showRoutingRules, setShowRoutingRules] = React.useState(false);
  const [showVendorRates, setShowVendorRates] = React.useState(false);
  const [showCustomerRateModal, setShowCustomerRateModal] = React.useState(false);
  const [showSupplierModal, setShowSupplierModal] = React.useState(false);
  const [showPlanDetail, setShowPlanDetail] = React.useState(false);
  const [selectedTrunkForRules, setSelectedTrunkForRules] = React.useState<any>(null);

  if (viewMode === 'deploy_switch') {
    return <SMSWholesaleSwitchForm theme={theme} onClose={() => setViewMode('list')} />;
  }

  if (viewMode === 'dynamic_routing') {
     return (
      <div className="flex justify-center items-start pt-4 px-4 overflow-auto max-h-[calc(100vh-100px)]">
        <DynamicRoutingForm theme={theme} onClose={() => setViewMode('list')} trunk={selectedTrunk} />
      </div>
    );
  }

  if (viewMode !== 'list') {
    const config: Record<string, { title: string, type: 'Enterprise' | 'Customer' | 'Vendor/Supplier', isViewOnly: boolean }> = {
      add_enterprise: { title: 'ABC Enterprise', type: 'Enterprise', isViewOnly: false },
      edit_enterprise: { title: 'ABC Enterprise', type: 'Enterprise', isViewOnly: false },
      view_enterprise: { title: 'ABC Enterprise', type: 'Enterprise', isViewOnly: true },
      add_vendor: { title: 'Add Vendor/Supplier', type: 'Vendor/Supplier', isViewOnly: false },
      add_vendor_account: { title: `New Supplier Account for ${selectedTrunk?.name || 'Vendor'}`, type: 'Vendor/Supplier', isViewOnly: false },
      edit_vendor: { title: selectedTrunk?.name || 'Edit Vendor/Supplier', type: 'Vendor/Supplier', isViewOnly: false },
      view_vendor: { title: selectedTrunk?.name || 'View Vendor/Supplier', type: 'Vendor/Supplier', isViewOnly: true },
      add_customer: { title: 'Add Customer', type: 'Customer', isViewOnly: false },
      add_customer_account: { title: `New Account for ${selectedTrunk?.customerName || 'Customer'}`, type: 'Customer', isViewOnly: false },
      edit_customer: { title: selectedTrunk?.name || 'Edit Customer', type: 'Customer', isViewOnly: false },
      view_customer: { title: selectedTrunk?.name || 'View Customer', type: 'Customer', isViewOnly: true },
      send_rate: { title: `Send Rate: ${selectedTrunk?.name || 'Customer'}`, type: 'Customer', isViewOnly: false },
    };

    const currentConfig = config[viewMode];

    return (
      <EnterpriseForm 
        title={currentConfig.title}
        type={currentConfig.type}
        theme={theme}
        data={selectedTrunk}
        isViewOnly={currentConfig.isViewOnly}
        onClose={() => setViewMode('list')}
        hideTabs={currentConfig.isViewOnly}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Vendor Trunk':
        return (
          <TrunkTab 
            type="Vendor" 
            theme={theme} 
            selectedTrunk={selectedTrunk}
            onSelect={setSelectedTrunk}
            onAdd={() => { setSelectedTrunk(null); setViewMode('add_vendor'); }}
            onAddAccount={() => setViewMode('add_vendor_account')}
            onView={() => setViewMode('view_vendor')}
            onEdit={() => setViewMode('edit_vendor')}
            onSupplierSetup={() => setViewMode('supplier_setup')}
            onShowRates={(trunk) => {
              setSelectedTrunkForRules(trunk);
              setShowVendorRates(true);
            }}
          />
        );
      case 'Customer Trunk':
        return (
          <TrunkTab 
            type="Customer" 
            theme={theme} 
            selectedTrunk={selectedTrunk}
            onSelect={setSelectedTrunk}
            onAdd={() => { setSelectedTrunk(null); setViewMode('add_customer'); }}
            onAddAccount={() => { setViewMode('add_customer_account'); }}
            onView={() => setViewMode('view_customer')}
            onEdit={() => setViewMode('edit_customer')}
            onClone={() => {
              if (selectedTrunk) {
                // Mock clone logic: just open add view with selected name
                setViewMode('add_customer');
              }
            }}
            onSendProductRate={() => {
              if (selectedTrunk) {
                setViewMode('send_rate');
              }
            }}
            onShowRules={(trunk) => {
              setSelectedTrunkForRules(trunk);
              setShowRoutingRules(true);
            }}
            onShowPlanDetail={(trunk) => {
              setSelectedTrunkForRules(trunk);
              setShowPlanDetail(true);
            }}
            onShowCustomerRate={(trunk) => {
              setSelectedTrunkForRules(trunk);
              setShowCustomerRateModal(true);
            }}
            onShowSupplierDetails={(trunk) => {
              setSelectedTrunkForRules(trunk);
              setShowSupplierModal(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 mx-4 mt-4 shrink-0">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-[11px] font-bold transition-all rounded",
                activeTab === tab 
                  ? "bg-[#428bca] text-white shadow-sm" 
                  : "text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            <option>ABC - ABC (38)</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {renderContent()}
          </div>
        </div>

      </div>

      {showVendorRates && selectedTrunkForRules && (
        <VendorRatesModal 
          trunk={selectedTrunkForRules} 
          theme={theme} 
          onClose={() => setShowVendorRates(false)} 
        />
      )}
      
      {showRoutingRules && selectedTrunkForRules && (
        <RoutingRulesModal 
          trunk={selectedTrunkForRules} 
          theme={theme} 
          onClose={() => setShowRoutingRules(false)} 
        />
      )}

      {showCustomerRateModal && selectedTrunkForRules && (
        <CustomerRateDetailModal 
          trunk={selectedTrunkForRules} 
          theme={theme} 
          onClose={() => setShowCustomerRateModal(false)} 
        />
      )}

      {showSupplierModal && selectedTrunkForRules && (
        <SupplierDetailModal 
          trunk={selectedTrunkForRules} 
          theme={theme} 
          onClose={() => setShowSupplierModal(false)} 
        />
      )}

      {showPlanDetail && selectedTrunkForRules && (
        <PlanDetailModal 
          trunk={selectedTrunkForRules} 
          theme={theme} 
          onClose={() => setShowPlanDetail(false)} 
        />
      )}
    </div>
  );
}

function VendorRatesModal({ trunk, theme, onClose }: { trunk: any, theme: 'light' | 'dark', onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-200 text-left">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-brand-500 text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Vendor Rate Rules: {trunk.name}</h3>
            <p className="text-[10px] opacity-80 font-bold uppercase mt-0.5">Full MCC, MNC, and Country Price Breakdown</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[11px] font-black uppercase text-brand-500 tracking-widest flex items-center gap-2">
              <Globe className="w-4 h-4" /> Comprehensive Rate List
            </h4>
            <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-400 uppercase">
              <span>Last Updated: 2026-04-30 09:38:59 UTC</span>
            </div>
          </div>
          
          <div className="bg-zinc-50/50 dark:bg-zinc-800/30 rounded-lg p-1 border border-zinc-100 dark:border-zinc-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-[#f8f9fa] dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500">Country</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500">MCC</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500">MNC</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500">Network</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500 text-right">Buying Price ($)</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500 text-right">Last Price</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500 text-right">Last Updated</th>
                    <th className="px-3 py-2 font-black uppercase tracking-widest text-zinc-500 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { country: 'India', mcc: '404', mnc: '10', network: 'Airtel', buy: '0.0042', lastPrice: '0.0045', updated: '2026-04-30 14:22:10' },
                    { country: 'India', mcc: '404', mnc: '20', network: 'Jio', buy: '0.0041', lastPrice: '0.0040', updated: '2026-04-30 11:05:22' },
                    { country: 'USA', mcc: '310', mnc: '150', network: 'AT&T', buy: '0.0038', lastPrice: '0.0038', updated: '2026-04-28 09:15:00' },
                    { country: 'UK', mcc: '234', mnc: '10', network: 'O2', buy: '0.0055', lastPrice: '0.0052', updated: '2026-04-30 16:40:45' },
                    { country: 'Germany', mcc: '262', mnc: '01', network: 'T-Mobile', buy: '0.0062', lastPrice: '0.0065', updated: '2026-04-29 10:20:11' },
                  ].map((p, i) => (
                    <tr key={i} className="hover:bg-white dark:hover:bg-zinc-800/70 transition-colors">
                      <td className="px-3 py-2 font-bold text-zinc-700 dark:text-zinc-200 uppercase">{p.country}</td>
                      <td className="px-3 py-2 font-mono text-zinc-500">{p.mcc}</td>
                      <td className="px-3 py-2 font-mono text-zinc-500">{p.mnc}</td>
                      <td className="px-3 py-2 text-zinc-500 font-bold">{p.network}</td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-blue-500">${p.buy}</td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-red-500">${p.lastPrice}</td>
                      <td className="px-3 py-2 text-right text-zinc-400 font-mono tracking-tighter">{p.updated}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded uppercase">Standard</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg">Close</button>
          <button className="px-6 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow hover:bg-blue-600 transition-all">Download CSV</button>
        </div>
      </div>
    </div>
  );
}

function RoutingRulesModal({ trunk, theme, onClose }: { trunk: any, theme: 'light' | 'dark', onClose: () => void }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSimulation, setShowSimulation] = React.useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = React.useState(false);
  
  // Mock Suppliers for dynamic edit
  const MOCK_SUPPLIERS_LIST = [
    { name: 'Airtel Direct', accounts: ['ASIA_TRANS_01', 'AIRTEL_HUB_DIR', 'AIRTEL_WHS'] },
    { name: 'Jio Reliance', accounts: ['ASIA_TRANS_01', 'JIO_INDIA_DIR', 'JIO_WHS'] },
    { name: 'AT&T USA', accounts: ['GLOBAL_HUB_DIR', 'ATT_USA_DIRECT', 'ATT_WHS'] },
    { name: 'O2 Global', accounts: ['GLOBAL_HUB_DIR', 'O2_UK_DIRECT', 'O2_WHS'] },
    { name: 'T-Mobile DE', accounts: ['EU_DIRECT_SMPP', 'TMOBILE_DE_DIR', 'TMOBILE_WHS'] },
    { name: 'Global Hub', accounts: ['GLOBAL_HUB_DIR', 'GH_DIRECT', 'GH_WHS'] },
    { name: 'Tata Communications', accounts: ['TATA_INDIA_DIR', 'TATA_WHS'] }
  ];

  const getBuyingPrice = (account: string, country: string) => {
    // Mock logic: price based on account name features and country
    const seed = account.length + country.length;
    return parseFloat((0.0030 + (seed % 50) * 0.0001).toFixed(4));
  };

  const getCategory = (account: string) => {
    if (account.includes('DIR') || account.includes('DIRECT')) return 'DIRECT';
    if (account.includes('WHS') || account.includes('TRANS')) return 'WHS';
    return 'RETAIL';
  };

  // Mock data for the rates
  const [rates, setRates] = React.useState([
    { id: 1, country: 'India', mcc: '404', mnc: '10', network: 'Airtel', supplier: 'ASIA_TRANS_01', supplierName: 'Airtel Direct', buy: 0.0042, sell: 0.0055, plan: 'Wholesale Standard', planCategory: 'WHS' },
    { id: 2, country: 'India', mcc: '404', mnc: '20', network: 'Jio', supplier: 'ASIA_TRANS_01', supplierName: 'Jio Reliance', buy: 0.0041, sell: 0.0055, plan: 'Wholesale Standard', planCategory: 'WHS' },
    { id: 3, country: 'USA', mcc: '310', mnc: '150', network: 'AT&T', supplier: 'GLOBAL_HUB_DIR', supplierName: 'AT&T USA', buy: 0.0038, sell: 0.0048, plan: 'Premium Direct', planCategory: 'DIRECT' },
    { id: 4, country: 'UK', mcc: '234', mnc: '10', network: 'O2', supplier: 'GLOBAL_HUB_DIR', supplierName: 'O2 Global', buy: 0.0055, sell: 0.0072, plan: 'Premium Direct', planCategory: 'DIRECT' },
    { id: 5, country: 'Germany', mcc: '262', mnc: '01', network: 'T-Mobile', supplier: 'EU_DIRECT_SMPP', supplierName: 'T-Mobile DE', buy: 0.0062, sell: 0.0125, plan: 'Wholesale Standard', planCategory: 'WHS' },
  ]);

  const handleRateUpdate = (id: number, field: string, value: any) => {
    setRates(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: value };
        
        // Dynamic logic for Supplier Name change
        if (field === 'supplierName') {
           const sup = MOCK_SUPPLIERS_LIST.find(s => s.name === value);
           if (sup) {
              const firstAccount = sup.accounts[0];
              updated.supplier = firstAccount;
              updated.buy = getBuyingPrice(firstAccount, r.country);
              updated.planCategory = getCategory(firstAccount);
           }
        }
        
        // Dynamic logic for Supplier Account change
        if (field === 'supplier') {
           updated.buy = getBuyingPrice(value, r.country);
           updated.planCategory = getCategory(value);
        }
        
        return updated;
      }
      return r;
    }));
  };

  const handleSync = () => {
    setShowSyncSuccess(true);
    setTimeout(() => setShowSyncSuccess(false), 3000);
  };

  const filteredRates = rates.filter(r => 
    r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.mcc.includes(searchQuery) ||
    r.mnc.includes(searchQuery) ||
    r.network.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-200 text-left">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Rate & Routing Management: {trunk.name}</h3>
            <p className="text-[10px] opacity-80 font-bold uppercase mt-0.5">Assigned Product: {trunk.productAssign || 'WHS Global'} | Manage Selling Prices & Supplier Routing</p>
          </div>
          <div className="flex items-center gap-4">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Rates
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* MASTER REMAINING CREDIT LIMIT & SPECIFIC ACCOUNT USED LIMIT PRESENTATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-black/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-405 dark:text-zinc-500 tracking-wider block">Master Remaining Credit Limit</span>
                <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-450">
                  ${((trunk.customerName?.includes('ABC') || trunk.name?.includes('ABC') || trunk.id === 'C94' ? 30000 : trunk.customerName?.includes('Global') || trunk.name?.includes('itelvox') || trunk.id === 'C93' ? 50000 : trunk.customerName?.includes('Teleoss') || trunk.name?.includes('TEST') || trunk.id === 'C91' ? 25000 : 40000) * 0.75 - (trunk.customerName?.includes('ABC') || trunk.name?.includes('ABC') || trunk.id === 'C94' ? 4250 : trunk.customerName?.includes('Global') || trunk.name?.includes('itelvox') || trunk.id === 'C93' ? 12400 : trunk.customerName?.includes('Teleoss') || trunk.name?.includes('TEST') || trunk.id === 'C91' ? 3900 : 9180)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase ml-2 block sm:inline">Shared Across Customer Group</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-6">
              <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500 dark:text-rose-450 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-405 dark:text-zinc-500 tracking-wider block">Account Used Credit (This Trunk)</span>
                <span className="text-sm font-extrabold font-mono text-rose-600 dark:text-rose-450">
                  ${(trunk.customerName?.includes('ABC') || trunk.name?.includes('ABC') || trunk.id === 'C94' ? 4250 : trunk.customerName?.includes('Global') || trunk.name?.includes('itelvox') || trunk.id === 'C93' ? 12400 : trunk.customerName?.includes('Teleoss') || trunk.name?.includes('TEST') || trunk.id === 'C91' ? 3900 : 9180).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase ml-2 block sm:inline">Active Customer Billing Connection</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Total Routes</div>
              <div className="font-black text-zinc-800 dark:text-zinc-100">1,248 Active</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
              <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">Product Assigned</div>
              <div className="font-black text-zinc-800 dark:text-zinc-100 uppercase">{trunk.productAssign || 'Wholesale Standard'}</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800">
              <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Category</div>
              <div className="font-black text-zinc-800 dark:text-zinc-100 uppercase">{trunk.planCategory || 'WHS'}</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800">
               <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">Avg. Margin</div>
               <div className="font-black text-zinc-800 dark:text-zinc-100">14.2%</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="Filter by Country, MCC, MNC..." 
                  className="pl-9 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[11px] w-64 focus:ring-2 focus:ring-[#428bca]/20 outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => {}}
                  className="p-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg text-zinc-600 transition-colors"
                  title="Refresh Rates"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setShowSimulation(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all"
                >
                  <Zap className="w-4 h-4 fill-white" /> SMS Simulation
                </button>
                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-2" />
                <button className="text-[10px] font-black text-[#428bca] uppercase tracking-widest hover:underline">Download Current RateSheet</button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] min-w-[1200px]">
                <thead className="bg-[#f8f9fa] dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Country</th>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">MCC-MNC</th>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 text-right whitespace-nowrap">Selling Price ($)</th>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 text-right whitespace-nowrap">Buying Price ($)</th>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Supplier Name</th>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Supplier Account</th>
                    <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 text-right whitespace-nowrap">Net Margin (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredRates.map((p) => {
                    const margin = (((p.sell - p.buy) / p.buy) * 100).toFixed(1);
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-black text-zinc-700 dark:text-zinc-200 uppercase">{p.country}</div>
                          <div className="text-[9px] text-zinc-400 font-bold">{p.network}</div>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-zinc-500">{p.mcc}-{p.mnc}</td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-zinc-400 font-mono">$</span>
                              <input 
                                type="number" 
                                step="0.0001"
                                value={p.sell}
                                onChange={(e) => handleRateUpdate(p.id, 'sell', parseFloat(e.target.value) || 0)}
                                className="w-20 bg-white dark:bg-zinc-800 border border-[#428bca] rounded px-2 py-1 text-[11px] font-mono font-bold text-[#428bca] text-right" 
                              />
                            </div>
                          ) : (
                            <span className="font-mono font-black text-emerald-600">${p.sell.toFixed(4)}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-zinc-400 font-bold">${p.buy.toFixed(4)}</td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                             <select 
                               value={p.supplierName}
                               onChange={(e) => handleRateUpdate(p.id, 'supplierName', e.target.value)}
                               className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-[10px] font-bold text-zinc-700 dark:text-zinc-300"
                             >
                               {MOCK_SUPPLIERS_LIST.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                             </select>
                          ) : (
                            <span className="font-bold text-zinc-500 uppercase tracking-tighter text-[10px] whitespace-nowrap">{p.supplierName}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select 
                              value={p.supplier}
                              onChange={(e) => handleRateUpdate(p.id, 'supplier', e.target.value)}
                              className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-[10px] font-bold text-[#428bca]"
                            >
                              {MOCK_SUPPLIERS_LIST.find(s => s.name === p.supplierName)?.accounts.map(acc => (
                                 <option key={acc} value={acc}>{acc}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="font-bold text-[#428bca] uppercase tracking-tighter">{p.supplier}</span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <span className={cn(
                            "font-mono font-bold",
                            parseFloat(margin) > 10 ? "text-blue-500" : "text-amber-500"
                          )}>{margin}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
             <div className="flex items-center gap-2">
               <Globe className="w-3.5 h-3.5" />
               <span>Product: {trunk.product || 'Standard'}</span>
             </div>
             <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-700" />
             <div className="flex items-center gap-2 text-emerald-600">
               <Save className="w-3.5 h-3.5" />
               <span>Auto-Sync Notification Enabled</span>
             </div>
          </div>
          <div className="flex gap-3">
            {showSyncSuccess && (
              <div className="animate-in fade-in slide-in-from-right-4 bg-emerald-500 text-white px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <Check className="w-4 h-4" /> Changes sent to customer
              </div>
            )}
            <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-lg">Dismiss</button>
            <button 
              onClick={handleSync}
              className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow hover:bg-blue-600 transition-all"
            >
              Confirm & Sync Routes
            </button>
          </div>
        </div>

        {/* SMS Simulation Modal */}
        {showSimulation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSimulation(false)} />
            <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-amber-500 text-white flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-white" /> SMS Simulation
                </h3>
                <button onClick={() => setShowSimulation(false)} className="hover:rotate-90 transition-transform">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Customer Name</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={trunk.name}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-bold outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Country</label>
                    <select className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-bold outline-none border-b-2 border-amber-500/50">
                      <option>Select Country</option>
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>Germany</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Mobile Number</label>
                    <input 
                      type="text" 
                      placeholder="+91..."
                      className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs font-bold outline-none border-b-2 border-amber-500/50"
                    />
                  </div>
                </div>
                
                <button className="w-full py-3 bg-amber-500 text-white text-[11px] font-black uppercase tracking-widest rounded shadow-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 mt-2">
                  Run Simulation
                </button>

                <div className="mt-8 pt-6 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                  <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-100 dark:border-zinc-800 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-700">
                      <span className="text-[10px] font-black uppercase text-zinc-400">Simulation Result</span>
                      <span className="text-[9px] font-bold text-amber-500 px-2 py-0.5 bg-amber-50 dark:bg-amber-500/10 rounded uppercase">Ready</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Route Assignment:</span>
                        <span className="font-bold text-[#428bca]">ASIA_TRANS_01</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Supplier:</span>
                        <span className="font-bold text-zinc-700 dark:text-zinc-200">Alpha Direct IN</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-500">Price (EUR):</span>
                        <span className="font-bold text-emerald-600">€0.0038</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanDetailModal({ trunk, theme, onClose }: { trunk: any, theme: 'light' | 'dark', onClose: () => void }) {
  // Mock supplier assignments for this plan
  const supplierAssignments = [
    { country: 'India', mccmnc: '404-10', supplier: 'Airtel Direct', priority: '1', status: 'Active' },
    { country: 'India', mccmnc: '404-20', supplier: 'Jio Hub', priority: '2', status: 'Active' },
    { country: 'USA', mccmnc: '310-150', supplier: 'AT&T Enterprise', priority: '1', status: 'Active' },
    { country: 'UK', mccmnc: '234-10', supplier: 'O2 UK Direct', priority: '1', status: 'Active' },
    { country: 'Germany', mccmnc: '262-01', supplier: 'T-Mobile WHS', priority: '1', status: 'Active' }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col text-left text-zinc-900 dark:text-zinc-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex items-center justify-between shrink-0">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-5 h-5 mr-1" /> Product Assign & Routing Details
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-all p-2 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-left">Assignment Name</h4>
              <div className="text-sm font-black text-zinc-800 dark:text-zinc-100">{trunk.productAssign}</div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-left">Plan ID</h4>
              <div className="text-sm font-mono font-bold text-[#428bca]">{trunk.plan}</div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-left">Category</h4>
              <div className="inline-block px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest mt-1">{trunk.planCategory}</div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 text-left">Assigned Date</h4>
              <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400">2026-04-15</div>
            </div>
          </div>

          {/* Supplier Assignment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
              <h4 className="text-[11px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
                <Landmark className="w-4 h-4" /> Supplier Assignment by Country
              </h4>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">Routing logic: Least Cost + Quality Filter</span>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#f8f9fa] dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-black uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Country</th>
                      <th className="px-6 py-4 text-center">MCC-MNC</th>
                      <th className="px-6 py-4">Assigned Supplier</th>
                      <th className="px-6 py-4 text-center">Priority</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {supplierAssignments.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-zinc-800 dark:text-zinc-100 uppercase">{item.country}</div>
                        </td>
                        <td className="px-6 py-4 text-center font-mono font-bold text-zinc-500">{item.mccmnc}</td>
                        <td className="px-6 py-4 font-black text-[#428bca] uppercase tracking-tighter">{item.supplier}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 rounded text-[10px] font-bold">{item.priority}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded uppercase">{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Other Rules & Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase text-[#428bca] tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Technical Rules</h4>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-4">
                {[
                  { label: 'Long SMS Support', value: 'Enabled', icon: Check },
                  { label: 'DLR Receipt', value: 'Enabled', icon: Check },
                  { label: 'Unicode / Emoji', value: 'Full Support', icon: Check },
                  { label: 'TPS Limit', value: '100 TPS', icon: Zap },
                  { label: 'Binding Type', value: 'Multiple', icon: Server },
                  { label: 'Validity Period', value: 'Indefinite', icon: Calendar }
                ].map(feat => (
                  <div key={feat.label} className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2">
                      <feat.icon className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-zinc-500 font-bold uppercase tracking-tighter">{feat.label}:</span>
                    </div>
                    <span className="font-black text-zinc-700 dark:text-zinc-300">{feat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[11px] font-black uppercase text-[#428bca] tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2">Customer Specific Rules</h4>
              <div className="p-6 bg-[#428bca]/5 rounded-xl border border-[#428bca]/20 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#428bca] p-1.5 rounded-lg shrink-0 mt-0.5">
                    <Info className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-100">Dynamic Routing Policy</div>
                    <div className="text-[10px] text-zinc-500 leading-relaxed">System will automatically switch suppliers based on real-time DLR success rates if the primary supplier fails more than 5% of attempts.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#428bca] p-1.5 rounded-lg shrink-0 mt-0.5">
                     <FileText className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-100">Sender ID Whitelisting</div>
                    <div className="text-[10px] text-zinc-500 leading-relaxed">Customer must provide explicit proof or registration for Brand-Specific Sender IDs (A2P traffic). Generic headers are permitted for transactional alerts.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-[#428bca] p-1.5 rounded-lg shrink-0 mt-0.5">
                     <Info className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-black uppercase text-zinc-800 dark:text-zinc-100">Fraud Protection</div>
                    <div className="text-[10px] text-zinc-500 leading-relaxed">High-volume spikes (300% over baseline) will trigger an automatic temporary lock for review.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:bg-blue-600 transition-all active:scale-95">Acknowledge</button>
        </div>
      </div>
    </div>
  );
}

function CustomerRateDetailModal({ trunk, theme, onClose }: { trunk: any, theme: 'light' | 'dark', onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in duration-200 text-left">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Customer Rate Table: {trunk.rateTable}</h3>
            <p className="text-[10px] opacity-80 font-bold uppercase mt-0.5">Assigned to: {trunk.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* MASTER REMAINING CREDIT LIMIT & SPECIFIC ACCOUNT USED LIMIT PRESENTATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-black/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-emerald-600 dark:text-emerald-400 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-405 dark:text-zinc-500 tracking-wider block">Master Remaining Credit Limit</span>
                <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-450">
                  ${((trunk.customerName?.includes('ABC') || trunk.name?.includes('ABC') || trunk.id === 'C94' ? 30000 : trunk.customerName?.includes('Global') || trunk.name?.includes('itelvox') || trunk.id === 'C93' ? 50000 : trunk.customerName?.includes('Teleoss') || trunk.name?.includes('TEST') || trunk.id === 'C91' ? 25000 : 40000) * 0.75 - (trunk.customerName?.includes('ABC') || trunk.name?.includes('ABC') || trunk.id === 'C94' ? 4250 : trunk.customerName?.includes('Global') || trunk.name?.includes('itelvox') || trunk.id === 'C93' ? 12400 : trunk.customerName?.includes('Teleoss') || trunk.name?.includes('TEST') || trunk.id === 'C91' ? 3900 : 9180)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase ml-2 block sm:inline">Shared Across Customer Group</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-6">
              <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500 dark:text-rose-450 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-405 dark:text-zinc-500 tracking-wider block">Account Used Credit (This Trunk)</span>
                <span className="text-sm font-extrabold font-mono text-rose-600 dark:text-rose-450">
                  ${(trunk.customerName?.includes('ABC') || trunk.name?.includes('ABC') || trunk.id === 'C94' ? 4250 : trunk.customerName?.includes('Global') || trunk.name?.includes('itelvox') || trunk.id === 'C93' ? 12400 : trunk.customerName?.includes('Teleoss') || trunk.name?.includes('TEST') || trunk.id === 'C91' ? 3900 : 9180).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase ml-2 block sm:inline">Active Customer Billing Connection</span>
              </div>
            </div>
          </div>

          <table className="w-full text-left text-[11px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Country</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">MCC</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">MNC</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 text-right">Selling Price ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[
                { country: trunk.country, mcc: trunk.mccmnc.split('-')[0], mnc: trunk.mccmnc.split('-')[1], price: trunk.sellingPrice },
                { country: 'United States', mcc: '310', mnc: '410', price: '0.0050' },
                { country: 'United Kingdom', mcc: '234', mnc: '010', price: '0.0065' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-bold text-zinc-700 dark:text-zinc-200 uppercase">{row.country}</td>
                  <td className="px-4 py-3 font-mono text-zinc-500 font-bold">{row.mcc}</td>
                  <td className="px-4 py-3 font-mono text-zinc-500 font-bold">{row.mnc}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">${row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

function SupplierDetailModal({ trunk, theme, onClose }: { trunk: any, theme: 'light' | 'dark', onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in duration-200 text-left">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Supplier Account Details: {trunk.supplierAccount}</h3>
            <p className="text-[10px] opacity-80 font-bold uppercase mt-0.5">Supplier: {trunk.supplierName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Supplier Name</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Account Name</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Vendor Account Category</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">Country</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">MCC</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500">MNC</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 text-right">Buying Price ($)</th>
                <th className="px-4 py-3 font-black uppercase tracking-widest text-zinc-500 text-right">Last Updated Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {[
                { 
                  supplier: trunk.supplierName, 
                  account: trunk.supplierAccount, 
                  category: 'WHS', 
                  country: trunk.country, 
                  mcc: trunk.mccmnc.split('-')[0], 
                  mnc: trunk.mccmnc.split('-')[1], 
                  price: trunk.buyingPrice, 
                  lastUpdated: '2026-05-01 10:30' 
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-bold text-zinc-700 dark:text-zinc-200">{row.supplier}</td>
                  <td className="px-4 py-3 text-zinc-500 font-bold font-mono">{row.account}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-black">{row.category}</span></td>
                  <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200 uppercase font-bold">{row.country}</td>
                  <td className="px-4 py-3 font-mono text-zinc-500">{row.mcc}</td>
                  <td className="px-4 py-3 font-mono text-zinc-500">{row.mnc}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-blue-500">${row.price}</td>
                  <td className="px-4 py-3 text-right text-zinc-400 font-bold">{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-sm">Close</button>
        </div>
      </div>
    </div>
  );
}

function TrunkTab({ 
  type, 
  theme, 
  selectedTrunk,
  onSelect,
  onAdd, 
  onAddAccount,
  onView, 
  onEdit, 
  onClone,
  onSendProductRate,
  onImportRate,
  onRateHistory,
  onDynamicRouting, 
  onShowRules,
  onShowPlanDetail,
  onShowCustomerRate,
  onShowSupplierDetails,
  onShowRates,
  onDeploySwitch,
  onSupplierSetup
}: { 
  type: 'Vendor' | 'Customer', 
  theme: 'light' | 'dark', 
  selectedTrunk: any,
  onSelect: (trunk: any) => void,
  onAdd: () => void, 
  onAddAccount?: () => void,
  onView: () => void, 
  onEdit: () => void, 
  onClone?: () => void,
  onSendProductRate?: () => void,
  onImportRate?: () => void,
  onRateHistory?: () => void,
  onDynamicRouting?: () => void, 
  onShowRules?: (trunk: any) => void,
  onShowPlanDetail?: (trunk: any) => void,
  onShowCustomerRate?: (trunk: any) => void,
  onShowSupplierDetails?: (trunk: any) => void,
  onShowRates?: (trunk: any) => void,
  onDeploySwitch?: () => void,
  onSupplierSetup?: () => void
}) {
  const columns = type === 'Customer' 
    ? ['CUSTOMER ID', 'CUSTOMER NAME', 'CUSTOMER ACCOUNT NAME', 'PRODUCT ASSIGN', 'STATUS', 'RATE']
    : ['VENDOR ID', 'VENDOR NAME', 'VENDOR ACCOUNT', 'USERNAME', 'SUPPLIER CATEGORY', 'RATES'];

  const data = type === 'Customer' ? [
    { id: 'C94', customerName: 'ABC Telecom', name: 'Digiwhilff_DIR_IN', productAssign: 'Wholesale Standard', plan: 'WHS_PLAN_01', planCategory: 'WHS', status: 'Active', country: 'India', mccmnc: '404-10', sellingPrice: '0.0055', buyingPrice: '0.0042', supplierAccount: 'ASIA_TRANS_01', supplierName: 'Airtel Direct', margin: '23.6' },
    { id: 'C93', customerName: 'Global SMS', name: 'Trunk_cliente_itelvox', productAssign: 'Premium Direct', plan: 'PREM_DIR_05', planCategory: 'DIRECT', status: 'Active', country: 'USA', mccmnc: '310-150', sellingPrice: '0.0048', buyingPrice: '0.0038', supplierAccount: 'GLOBAL_HUB_DIR', supplierName: 'AT&T Direct', margin: '20.8' },
    { id: 'C91', customerName: 'Teleoss Tech', name: 'CLIENTE_TEST', productAssign: 'Global Carrier', plan: 'GLOB_CARR_02', planCategory: 'WHS', status: 'Active', country: 'UK', mccmnc: '234-10', sellingPrice: '0.0072', buyingPrice: '0.0055', supplierAccount: 'EU_TRANS_SMPP', supplierName: 'O2 UK', margin: '23.6' },
    { id: 'C45', customerName: 'Breelink LLC', name: 'ABD Client Direct', productAssign: 'Retail Priority', plan: 'RET_PRIO_01', planCategory: 'RETAIL', status: 'Active', country: 'Germany', mccmnc: '262-01', sellingPrice: '0.0085', buyingPrice: '0.0062', supplierAccount: 'GER_WHS_TERM', supplierName: 'T-Mobile', margin: '27.1' }
  ] : [
    { id: 'V102', name: 'Digiwhiff_WHS_OUT', account: 'BREELINK_EUR', user: 'BreliWHS', category: 'WHS' },
    { id: 'V105', name: 'Alpha_VD_Global', account: 'ALPHA_PAY_USD', user: 'AlphaAdmin', category: 'DIRECT' },
    { id: 'V201', name: 'Global_Bulk_SMS', account: 'BULK_CREDIT', user: 'GlobalUser', category: 'WHS' },
    { id: 'V88', name: 'Direct_India_HUB', account: 'INDIA_TRANS', user: 'IndHub', category: 'DIRECT' }
  ];

  const btnClass = "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded flex items-center gap-1.5 transition-colors shadow-sm text-white";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-end">
        {type === 'Customer' && (
          <>
            <button 
              onClick={() => onAddAccount?.()}
              disabled={!selectedTrunk}
              className={cn(btnClass, "bg-[#5cb85c] hover:bg-green-600 disabled:opacity-50 disabled:grayscale")}
            >
              <Plus className="w-3.5 h-3.5" /> Add Customer Account
            </button>
          </>
        )}

        {type === 'Vendor' && (
          <>
            <button 
              onClick={() => onAddAccount?.()}
              disabled={!selectedTrunk}
              className={cn(btnClass, "bg-[#5cb85c] hover:bg-green-600 disabled:opacity-50 disabled:grayscale")}
            >
              <Plus className="w-3.5 h-3.5" /> Add Supplier Account
            </button>
          </>
        )}

        <button 
          onClick={onAdd}
          disabled={!!selectedTrunk}
          className={cn(btnClass, "bg-[#428bca] hover:bg-blue-600 disabled:opacity-50 disabled:grayscale")}
        >
          <Plus className="w-3.5 h-3.5" /> {type === 'Vendor' ? 'Add Supplier' : 'Add Customer'}
        </button>

        <button 
          onClick={onView} 
          disabled={!selectedTrunk}
          className={cn(btnClass, "bg-[#5bc0de] hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed")}
        >
          <Eye className="w-3.5 h-3.5" /> View
        </button>
        <button 
          onClick={onEdit} 
          disabled={!selectedTrunk}
          className={cn(btnClass, "bg-[#f0ad4e] hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed")}
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button 
          onClick={() => onClone?.()}
          disabled={!selectedTrunk}
          className={cn(btnClass, "bg-[#428bca] hover:bg-blue-600 disabled:opacity-50")}
        >
          <Copy className="w-3.5 h-3.5" /> Clone
        </button>
        
        {type === 'Customer' && (
          <button 
            onClick={() => onSendProductRate?.()}
            disabled={!selectedTrunk}
            className={cn(btnClass, "bg-[#428bca] hover:bg-blue-600 disabled:opacity-50")}
          >
            <Send className="w-3.5 h-3.5" /> Send Rate
          </button>
        )}

        {type === 'Vendor' && (
          <>
            <button 
              onClick={() => onImportRate?.()}
              disabled={!selectedTrunk}
              className={cn(btnClass, "bg-[#428bca] hover:bg-blue-600 disabled:opacity-50")}
            >
              <Upload className="w-3.5 h-3.5" /> Import Rate
            </button>
            <button 
              onClick={() => onRateHistory?.()}
              disabled={!selectedTrunk}
              className={cn(btnClass, "bg-[#5bc0de] hover:bg-cyan-600 disabled:opacity-50")}
            >
              <History className="w-3.5 h-3.5" /> Rate History
            </button>
          </>
        )}

      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-zinc-500">Show</span>
            <select className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 font-bold">
              <option>10</option>
            </select>
            <span className="text-zinc-500">entries</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-zinc-500 font-bold">Search:</span>
            <input type="text" className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-0.5 outline-none focus:border-[#428bca]" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-[#f9f9f9] dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-4 py-3 w-10 text-center">
                  <div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-600 rounded-full mx-auto" />
                </th>
                {columns.map(col => (
                  <th key={col} className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-r last:border-r-0 border-zinc-100 dark:border-zinc-800">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-2">
                        {col}
                        <Search className="w-2.5 h-2.5 opacity-30" />
                      </div>
                      <input type="text" placeholder="Search" className="w-full text-[9px] font-normal px-2 py-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded outline-none" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {data.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onSelect(selectedTrunk?.id === row.id ? null : row)}
                  className={cn(
                    "hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-all cursor-pointer",
                    selectedTrunk?.id === row.id ? "bg-blue-50 dark:bg-blue-900/20 shadow-inner" : ""
                  )}
                >
                  <td className="px-4 py-3 text-center border-r border-zinc-100 dark:border-zinc-800">
                    <div className={cn(
                      "w-4 h-4 border-2 rounded-full mx-auto transition-all flex items-center justify-center",
                      selectedTrunk?.id === row.id 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-zinc-300 dark:border-zinc-600"
                    )}>
                      {selectedTrunk?.id === row.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </td>
                  {type === 'Customer' ? (
                    <>
                      <td className="px-4 py-3 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border-r border-zinc-100 dark:border-zinc-800">{row.id}</td>
                      <td className="px-4 py-3 text-[11px] font-bold text-[#428bca] border-r border-zinc-100 dark:border-zinc-800">{row.customerName}</td>
                      <td className="px-4 py-3 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border-r border-zinc-100 dark:border-zinc-800">{row.name}</td>
                      <td className="px-4 py-3 text-[11px] font-bold border-r border-zinc-100 dark:border-zinc-800">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onShowPlanDetail?.(row); }}
                          className="text-[#428bca] hover:underline text-left uppercase"
                        >
                          {row.productAssign}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center border-r border-zinc-100 dark:border-zinc-800">
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 text-[8px] font-black rounded uppercase tracking-widest">{row.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onShowRules?.(row); }}
                          className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[#428bca] rounded transition-all shadow-sm group"
                        >
                          <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 border-r border-zinc-100 dark:border-zinc-800">{row.id}</td>
                      <td className="px-4 py-3 text-[11px] font-bold text-[#428bca] border-r border-zinc-100 dark:border-zinc-800">{row.name}</td>
                      <td className="px-4 py-3 text-[11px] text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 font-mono italic">{row.account}</td>
                      <td className="px-4 py-3 text-[11px] text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800">{row.user}</td>
                      <td className="px-4 py-3 text-[11px] text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800">{row.category}</td>
                      <td className="px-4 py-3 text-[11px] text-zinc-600 dark:text-zinc-400 border-r border-zinc-100 dark:border-zinc-800 uppercase font-bold text-[9px] text-center">
                        <button onClick={() => onShowRates?.(row)} className="text-[#428bca] hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-all flex items-center gap-1 mx-auto border border-zinc-200 dark:border-zinc-700 shadow-sm bg-white dark:bg-zinc-800">
                          <DollarSign className="w-3.5 h-3.5" /> Rates
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/30 px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[10px] text-zinc-500">Showing 1 to {data.length} of {data.length} entries</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded cursor-not-allowed">Previous</button>
            <button className="px-3 py-1.5 bg-[#428bca] text-white text-[10px] rounded">1</button>
            <button className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-600 text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-500 rounded cursor-not-allowed">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
