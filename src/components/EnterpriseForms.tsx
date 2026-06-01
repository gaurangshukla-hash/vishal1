import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Save, X, Info, MapPin, Phone, Mail, Globe, Server, Shield, Zap, List, 
  CreditCard, Users, Settings, Eye, Search, Download, Edit2, FileText, 
  CheckSquare, Lock, ChevronDown, Clock, MousePointer2, AlertCircle, Trash2, Upload, Plus,
  RotateCcw, ArrowLeft, Database, Landmark, Check, CheckCircle2, ChevronRight, TrendingDown, ChevronLeft, Bell,
  Cpu, Play, ChevronUp, ShieldAlert, ShieldCheck, AlertTriangle
} from 'lucide-react';

interface EnterpriseFormProps {
  title?: string;
  theme: 'light' | 'dark';
  onClose?: () => void;
  type?: 'Enterprise' | 'Customer' | 'Vendor/Supplier';
  data?: any;
  isViewOnly?: boolean;
  subTab?: string;
  hideTabs?: boolean;
}

export const PRODUCT_RULES_AND_PRICING: Record<string, {
  country: string;
  rate: string;
  currency: string;
  status: string;
  features: string[];
  rules: string[];
  pricingDetails: { destination: string; mccmnc: string; price: string }[];
}> = {
  'US_Direct_HighVolume': { 
    country: 'United States', 
    rate: '0.0050', 
    currency: 'USD', 
    status: 'Active',
    features: ['Direct Tier 1 Connection', '100% DLR Accuracy', 'Support for High Volume', 'Dedicated Account Manager'],
    rules: [
      'Minimum 1M messages/month',
      'Direct connection via Tier 1 carrier',
      'Whitelist required for non-US origins',
      '24/7 dedicated support included'
    ],
    pricingDetails: [
      { destination: 'USA - Verizon', mccmnc: '310-010', price: '0.0050' },
      { destination: 'USA - AT&T', mccmnc: '310-410', price: '0.0048' },
      { destination: 'USA - T-Mobile', mccmnc: '310-260', price: '0.0052' },
      { destination: 'Canada - Bell', mccmnc: '302-610', price: '0.0060' },
    ]
  },
  'UK_Premium_Direct': { 
    country: 'United Kingdom', 
    rate: '0.0120', 
    currency: 'GBP', 
    status: 'Active',
    features: ['Local UK Routes', 'Premium Priority', 'OTP Specialized', 'GDPR Compliant'],
    rules: [
      'Local UK sender ID registration required',
      'Premium high-priority routing',
      'DLR reporting accuracy > 99%',
      'No promotional traffic after 9 PM UK time'
    ],
    pricingDetails: [
      { destination: 'UK - Vodafone', mccmnc: '234-15', price: '0.0120' },
      { destination: 'UK - O2', mccmnc: '234-10', price: '0.0115' },
      { destination: 'UK - EE', mccmnc: '234-30', price: '0.0125' },
    ]
  },
  'Wholesale_EU_LowCost': { 
    country: 'Europe', 
    rate: '0.0075', 
    currency: 'EUR', 
    status: 'Active',
    features: ['LCR Optimization', 'Bulk Messaging', 'Standard Delivery', 'Wholesale Pricing'],
    rules: [
      'Best effort delivery',
      'Wholesale aggregator routing',
      'Standard DLR support',
      'Global coverage with regional focus'
    ],
    pricingDetails: [
      { destination: 'Germany', mccmnc: '262-01', price: '0.0075' },
      { destination: 'France', mccmnc: '208-01', price: '0.0080' },
      { destination: 'Italy', mccmnc: '222-01', price: '0.0078' },
    ]
  },
  'Premium_Direct_Asia_Plan': {
    country: 'Asia',
    rate: '0.0150',
    currency: 'USD',
    status: 'Active',
    features: ['Regional Expertise', 'High Throughput', 'Multi-Language Support', 'Direct Carrier Links'],
    rules: [
      'Regional compliance docs required',
      'Direct Tier 1 Asia routes',
      'Support for Unicode & long messages',
      'Premium quality guarantee'
    ],
    pricingDetails: [
      { destination: 'India', mccmnc: '40401', price: '0.0150' },
      { destination: 'Singapore', mccmnc: '525-01', price: '0.0180' },
      { destination: 'Indonesia', mccmnc: '510-01', price: '0.0095' },
    ]
  },
  'India_Transactional_Direct': {
    country: 'India',
    rate: '0.0120',
    currency: 'INR',
    status: 'Active',
    features: ['DLT Registration Mandatory', 'Premium Priority OTP', 'High Delivery Rate', 'Operator Direct Connectivity'],
    rules: [
      'Entity & Header registration pre-requisite',
      'Transactional template approval required',
      'Promo traffic strictly barred on OTP pipe',
      'Real-time status callback'
    ],
    pricingDetails: [
      { destination: 'Airtel India', mccmnc: '404-10', price: '0.0120' },
      { destination: 'Jio India', mccmnc: '404-45', price: '0.0118' },
      { destination: 'Vodafone Idea', mccmnc: '404-20', price: '0.0122' }
    ]
  },
  'Global_Wholesale_Standard': {
    country: 'Global',
    rate: '0.0100',
    currency: 'USD',
    status: 'Active',
    features: ['International Reach', 'LCR Dynamic Routing', 'Multi-Carrier Failover', 'Standard Throughput'],
    rules: [
      'Wholesale bulk SMS traffic support',
      'No SPAM / Phishing filtering active by default but monitored',
      'Simultaneous standard binds active',
      'Standard volume sliding scale'
    ],
    pricingDetails: [
      { destination: 'Global standard', mccmnc: 'Global', price: '0.0100' }
    ]
  },
  'Wholesale_Aggregator_Asia': {
    country: 'Asia Region',
    rate: '0.0090',
    currency: 'USD',
    status: 'Active',
    features: ['Aggregated Rates', 'Asia Pacific Coverage', 'Bulk SMS optimized', 'API Integration'],
    rules: [
      'Aggregator pricing structure',
      'Best effort routes with failover options',
      'DLR delivery subject to carrier support'
    ],
    pricingDetails: [
      { destination: 'Southeast Asia Bulk', mccmnc: 'Asia-SE', price: '0.0090' }
    ]
  }
};

export function getFallbackProductInfo(name: string) {
  const cleanName = name || 'Direct_Router';
  const parts = cleanName.split('_');
  const country = parts[0] || 'Global';
  const prettyName = cleanName.replace(/_/g, ' ');
  return {
    country: country.replace(/([A-Z])/g, ' $1').trim(),
    rate: '0.0100',
    currency: 'USD',
    status: 'Active',
    features: ['Direct Operator Routing', '99.9% Up-time SLA', 'Dedicated SMPP Bind', 'Secure API Endpoints'],
    rules: [
      'DLT/Registration is depending on country rules',
      'No promotional/SPAM traffic allowed',
      'Delivery receipt callbacks within 5 seconds',
      'Supports UCS-2 16-bit encoding'
    ],
    pricingDetails: [
      { destination: `${prettyName} Primary Route`, mccmnc: 'Auto-Selected', price: '0.0100' },
      { destination: `${prettyName} Failover Route`, mccmnc: 'Dynamic', price: '0.0095' }
    ]
  };
}

export function EnterpriseForm({ title = 'Form', theme, onClose, type = 'Enterprise', data, isViewOnly = false, subTab, hideTabs = false }: EnterpriseFormProps) {
  const [activeSubTab, setActiveSubTab] = React.useState(subTab || 'General Info');
  
  // Supplier Setup Tab States for Vendor Trunk/Supplier forms
  const [activeVendorTab, setActiveVendorTab] = React.useState<'MAIN' | 'SENDING' | 'SMPP' | 'ADVANCED_SMPP' | 'COMMITMENT'>('MAIN');

  // Tab 2 (Sending Settings) state
  const [vendorUsername, setVendorUsername] = React.useState(data?.username || 'breelink_smpp_usr');
  const [vendorPassword, setVendorPassword] = React.useState('••••••••••••');
  const [vendorServicePurpose, setVendorServicePurpose] = React.useState('Both');
  const [vendorProtocolState, setVendorProtocolState] = React.useState('SMPP');
  const [vendorVisibleStatus, setVendorVisibleStatus] = React.useState(true);
  const [vendorOperatorWiseTPS, setVendorOperatorWiseTPS] = React.useState(true);

  // Tab 3 (SMPP Settings) state
  const [vendorHostUrl, setVendorHostUrl] = React.useState(data?.host || 'smpp.breelink-global.com');
  const [vendorNoOfSockets, setVendorNoOfSockets] = React.useState('2');
  const [vendorBindMode, setVendorBindMode] = React.useState('TRANSCEIVER');
  const [vendorDataCoding, setVendorDataCoding] = React.useState('Default');
  const [vendorSystemType, setVendorSystemType] = React.useState('smsc');
  const [vendorDlrReceiver, setVendorDlrReceiver] = React.useState(true);
  const [vendorSendingPort, setVendorSendingPort] = React.useState('0');
  const [vendorReceiverPort, setVendorReceiverPort] = React.useState('0');

  // Tab 4 (Advanced SMPP Settings) state
  const [vendorNumberPlan, setVendorNumberPlan] = React.useState('Default[0]');
  const [vendorTypeOfNumber, setVendorTypeOfNumber] = React.useState('Default[0]');
  const [vendorDelayInDelivery, setVendorDelayInDelivery] = React.useState('0');
  const [vendorDelayInSMPP, setVendorDelayInSMPP] = React.useState('0');
  const [vendorReconnectionDelay, setVendorReconnectionDelay] = React.useState('5000');
  const [vendorPrefixSenderId, setVendorPrefixSenderId] = React.useState('ton=0;npi=0;');
  const [vendorAddressRange, setVendorAddressRange] = React.useState('ton=0;npi=0;');
  const [vendorReconnectWaitTime, setVendorReconnectWaitTime] = React.useState('86400');
  const [vendorWindowSize, setVendorWindowSize] = React.useState('10');
  const [vendorMessagePriority, setVendorMessagePriority] = React.useState('Default[null]');
  const [vendorDeliveryTime, setVendorDeliveryTime] = React.useState('');
  const [vendorFinalDate, setVendorFinalDate] = React.useState('null');
  const [vendorServiceType, setVendorServiceType] = React.useState('Default[null]');
  const [vendorReplaceIfPresent, setVendorReplaceIfPresent] = React.useState('Default[null]');
  const [vendorRegisteredDelivery, setVendorRegisteredDelivery] = React.useState('delivery success or failure');
  const [vendorEsmClass, setVendorEsmClass] = React.useState('0');
  const [vendorErrorCode, setVendorErrorCode] = React.useState('0');
  const [vendorVersion, setVendorVersion] = React.useState('3.4');
  const [vendorProtocolId, setVendorProtocolId] = React.useState('0');

  const [vendorAutoStartSettingsOpen, setVendorAutoStartSettingsOpen] = React.useState(false);
  const [vendorTimeZoneSettingsOpen, setVendorTimeZoneSettingsOpen] = React.useState(false);
  const [vendorAutoStart, setVendorAutoStart] = React.useState(true);
  const [vendorTimeZone, setVendorTimeZone] = React.useState('UTC');

  // Tab 5 state
  const [vendorCommitmentRule, setVendorCommitmentRule] = React.useState('None');
  const [vendorTargetCount, setVendorTargetCount] = React.useState('1000000');
  const [vendorPenaltyRate, setVendorPenaltyRate] = React.useState('0.0015');
  const [vendorStartDate, setVendorStartDate] = React.useState('2026-05-01');
  const [vendorEndDate, setVendorEndDate] = React.useState('2026-12-31');

  // Switch Instance settings for Tab 1
  const [vendorInstanceWiseOpen, setVendorInstanceWiseOpen] = React.useState(true);
  const [vendorSelectedInstances, setVendorSelectedInstances] = React.useState<string[]>(['Instance_01', 'Instance_02']);
  const [creditLimit, setCreditLimit] = React.useState(10000.00);
  const [creditLimitInput, setCreditLimitInput] = React.useState('10000.00');
  const [addCreditInput, setAddCreditInput] = React.useState('0');
  const [activeTrunkTab, setActiveTrunkTab] = React.useState('connection');
  const [showRateDetails, setShowRateDetails] = React.useState(false);
  const [rateViewType, setRateViewType] = React.useState<'customer' | 'product' | 'vendor-account' | null>(null);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [accountCategory, setAccountCategory] = React.useState(data?.planCategory || 'WHS');
  const [assignedProduct, setAssignedProduct] = React.useState(data?.productAssign || '');
  const [assignedRateTable, setAssignedRateTable] = React.useState('');
  const [localSelection, setLocalSelection] = React.useState('');
  const [showAssignmentModal, setShowAssignmentModal] = React.useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);
  // ... existing code ...

  const [showCatalog, setShowCatalog] = React.useState(false);
  const [selectedProductForDetails, setSelectedProductForDetails] = React.useState<any>(null);
  const [showAccountDetailModal, setShowAccountDetailModal] = React.useState(false);
  const [selectedAccountForDetails, setSelectedAccountForDetails] = React.useState<any>(null);

  const CatalogPopup = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800">
          <h3 className="font-black uppercase text-xs">Catalog for {accountCategory}</h3>
          <button onClick={() => setShowCatalog(false)}><X className="w-5 h-5"/></button>
        </div>
        <div className="overflow-auto p-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>{['ID', 'Country', 'Product', 'Sell', 'Buy', 'Supplier'].map(h => <th key={h} className="p-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {Object.entries(MOCK_PRODUCT_DETAILS).flatMap(([key, items]) => items.filter(item => item.category === accountCategory).map(item => (
                <tr key={item.id} className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800" onClick={() => setSelectedProductForDetails(item)}>
                  <td className="p-2">{item.id}</td>
                  <td className="p-2">{item.country}</td>
                  <td className="p-2 font-bold text-[#428bca]">{key}</td>
                  <td className="p-2">{item.sell}</td>
                  <td className="p-2">{item.buy}</td>
                  <td className="p-2">{item.supplierName}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ProductRulesPopup = () => (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl w-full max-w-lg shadow-2xl">
        <div className="p-4 border-b dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800">
          <h3 className="font-black uppercase text-xs">Rules & Pricing: {selectedProductForDetails?.id}</h3>
          <button onClick={() => setSelectedProductForDetails(null)}><X className="w-5 h-5"/></button>
        </div>
        <div className="p-4 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="font-bold text-zinc-500">Sell Price:</span> {selectedProductForDetails?.sell}</div>
            <div><span className="font-bold text-zinc-500">Buy Price:</span> {selectedProductForDetails?.buy}</div>
            <div><span className="font-bold text-zinc-500">Last Price:</span> {selectedProductForDetails?.lastPrice}</div>
            <div><span className="font-bold text-zinc-500">Supplier:</span> {selectedProductForDetails?.supplierName}</div>
          </div>
          <div><span className="font-bold text-zinc-500">Update Time:</span> {selectedProductForDetails?.updateTime}</div>
          <div><span className="font-bold text-zinc-500">Rate Table:</span> {selectedProductForDetails?.rateTableName}</div>
        </div>
      </div>
    </div>
  );

  // ... rest of the existing code ...
  const [assignmentType, setAssignmentType] = React.useState<'product' | 'rate-table'>('product');
  const [assignmentStep, setAssignmentStep] = React.useState<'list' | 'details'>('list');
  const [selectedProductName, setSelectedProductName] = React.useState<string | null>(null);
  const [isEditingRate, setIsEditingRate] = React.useState(false);
  const [modalRows, setModalRows] = React.useState([
    { id: 1, country: 'United States', mccmnc: '310-410', sell: 0.0050, buy: 0.0042, supplierName: 'GlobalConnect', supplier: 'GLB_DIR_US', product: 'US_Direct_Premium', category: 'DIRECT', rateTableName: 'US_Direct_Rates_2024' },
    { id: 2, country: 'United Kingdom', mccmnc: '234-010', sell: 0.0065, buy: 0.0055, supplierName: 'QuickRoute', supplier: 'QR_WHS_UK', product: 'UK_WHS_Standard', category: 'WHS', rateTableName: 'Standard_WHS_Table' },
    { id: 3, country: 'India', mccmnc: '40401', sell: 0.0120, buy: 0.0105, supplierName: 'Airtel', supplier: 'AIRTEL_DIR_IN', product: 'India_Transactional', category: 'DIRECT', rateTableName: 'India_Direct_Pricing' },
  ]);

  const [productLevelData, setProductLevelData] = React.useState<any>(null);
  const [showComparison, setShowComparison] = React.useState(false);

  const MOCK_PRODUCT_DETAILS: Record<string, any[]> = {
    'US_Direct_HighVolume': [
      { id: 101, country: 'United States', mccmnc: '310-410', sell: 0.0048, buy: 0.0040, lastPrice: 0.0050, updateTime: '2026-05-18 14:30', supplierName: 'GlobalConnect', supplier: 'GLB_DIR_US', category: 'DIRECT', rateTableName: 'US_Direct_Rates_2024' },
      { id: 102, country: 'Canada', mccmnc: '302-720', sell: 0.0052, buy: 0.0045, lastPrice: 0.0051, updateTime: '2026-05-17 09:12', supplierName: 'GlobalConnect', supplier: 'GLB_DIR_US', category: 'DIRECT', rateTableName: 'Canada_Standard' },
    ],
    'Wholesale_EU_LowCost': [
      { id: 201, country: 'Germany', mccmnc: '262-01', sell: 0.0075, buy: 0.0068, lastPrice: 0.0080, updateTime: '2026-05-16 11:45', supplierName: 'QuickRoute', supplier: 'QR_WHS_UK', category: 'WHS', rateTableName: 'Standard_WHS_Table' },
      { id: 202, country: 'France', mccmnc: '208-01', sell: 0.0080, buy: 0.0072, lastPrice: 0.0082, updateTime: '2026-05-18 16:20', supplierName: 'Teleoss Partner', supplier: 'TELE_WHS_GLOBAL', category: 'WHS', rateTableName: 'Standard_WHS_Table' },
    ],
    'Premium_Direct_Asia_Plan': [
      { id: 301, country: 'India', mccmnc: '404-01', sell: 0.0150, buy: 0.0125, lastPrice: 0.0155, updateTime: '2026-05-19 08:05', supplierName: 'Airtel', supplier: 'AIRTEL_DIR_IN', category: 'DIRECT', rateTableName: 'Premium_Direct_Asia_Plan' },
      { id: 302, country: 'Indonesia', mccmnc: '510-01', sell: 0.0095, buy: 0.0080, lastPrice: 0.0098, updateTime: '2026-05-18 13:40', supplierName: 'Teleoss Partner', supplier: 'TELE_DIR_ASIA', category: 'DIRECT', rateTableName: 'Premium_Direct_Asia_Plan' },
    ],
    'Global_Wholesale_Standard': [
      { id: 401, country: 'Global', mccmnc: 'EXT', sell: 0.0100, buy: 0.0085, lastPrice: 0.0105, updateTime: '2026-05-19 11:00', supplierName: 'GlobalConnect', supplier: 'GLB_WHS_US', category: 'WHS', rateTableName: 'Standard_WHS_Table' }
    ]
  };

  const MOCK_SUPPLIERS_LIST = [
    { name: 'GlobalConnect', accounts: ['GLB_DIR_US', 'GLB_WHS_US', 'GLB_HQ_US'], category: 'DIRECT' },
    { name: 'QuickRoute', accounts: ['QR_WHS_UK', 'QR_DIR_UK'], category: 'WHS' },
    { name: 'Airtel', accounts: ['AIRTEL_DIR_IN', 'AIRTEL_WHS_IN'], category: 'DIRECT' },
    { name: 'Teleoss Partner', accounts: ['TELE_WHS_GLOBAL', 'TELE_DIR_ASIA'], category: 'WHS' }
  ];

  const categories = ['DIRECT', 'HQ', 'SIM', 'WHS', 'International', 'Local Premium', 'Retail', 'Global', 'Restricted'];

  const productOptions: Record<string, string[]> = {
    'DIRECT': ['US_Direct_HighVolume', 'UK_Premium_Direct', 'India_Transactional_Direct'],
    'WHS': ['Global_Wholesale_Standard', 'Wholesale_Aggregator_Asia', 'Wholesale_EU_LowCost'],
    'International': ['Global_Carrier_Routing', 'Intl_Premium_Routes'],
    'SIM': ['Sim_Direct_Farm_Node', 'Local_Sim_Gateway'],
    'HQ': ['HQ_Ultra_Premium', 'HQ_Direct_Priority'],
    'Retail': ['Retail_Standard_Bundle', 'Retail_Promo_Plan'],
    'Global': ['Global_Roaming_SMS', 'Universal_Gateway'],
    'Local Premium': ['Local_Direct_Priority'],
    'Restricted': ['Verified_Sender_Only']
  };

  const rateTableOptions: Record<string, string[]> = {
    'DIRECT': ['US_Direct_Rates_2024', 'UK_Retail_Rates', 'India_Direct_Pricing'],
    'WHS': ['Standard_WHS_Table', 'Aggregator_Pricing_v2', 'Asia_Bulk_Rates'],
    'International': ['Carrier_Tier1_Rates', 'Intl_Standard_RatePlan'],
    'SIM': ['SimBased_Pricing_Table'],
    'HQ': ['HighQuality_Premium_Rates'],
    'Retail': ['Retail_Standard_Pricing'],
    'Global': ['Global_Universal_Rates'],
    'Local Premium': ['Local_Priority_Pricing'],
    'Restricted': ['Restricted_Route_Table']
  };

  const recipientGroups = [
    { id: 'RG001', name: 'NOC Alert Team', contactPerson: 'John Support', mobile: '+1 888 234 5678', emails: 'noc@teleoss.com; support@teleoss.com' },
    { id: 'RG002', name: 'Sales Finance Group', contactPerson: 'Jane Billing', mobile: '+1 888 987 6543', emails: 'billing@teleoss.com' },
    { id: 'RG003', name: 'Compliance Team', contactPerson: 'Mike Compliance', mobile: '+1 888 555 4444', emails: 'compliance@teleoss.com' }
  ];
  
  const tabs = type === 'Enterprise' 
    ? ['Vendor Trunk', 'Customer Trunk']
    : ['General Info'];

  React.useEffect(() => {
    if (subTab) {
      setActiveSubTab(subTab);
    }
  }, [subTab]);

  const inputClass = cn(
    "w-full h-9 px-3 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[12px] outline-none transition-colors",
    isViewOnly ? "bg-zinc-50 dark:bg-zinc-900 border-dashed" : "focus:border-brand-500"
  );

  const labelClass = "text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter mb-1.5 block";

  const renderEnterpriseGeneral = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
      {!isViewOnly && (
        <div className="flex justify-end gap-2 mb-2">
          <button className="px-3 py-1 bg-[#428bca] text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-sm hover:bg-blue-600">
            <Plus className="w-3 h-3" /> Add
          </button>
          <button className="px-3 py-1 bg-[#5cb85c] text-white text-[10px] font-bold rounded flex items-center gap-1 shadow-sm hover:bg-green-600">
            <Edit2 className="w-3 h-3" /> Edit
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GENERAL INFORMATION */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 border-l-4 border-[#428bca]">GENERAL INFORMATION</h4>
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {[
                  { label: 'Name', value: 'ABC' },
                  { label: 'Alias', value: 'ABC' },
                  { label: 'Type', value: 'Reciprocal' },
                  { label: 'Category', value: 'Tier 1' },
                  { label: 'Product Assignment', value: data?.productAssign || 'Not Assigned' },
                  { label: 'Balance / Credit', value: '$100.00' },
                  { label: 'Timezone', value: 'UTC' },
                  { label: 'Notification', value: 'Enabled' },
                  { label: 'User', value: 'a.yehya gabs (109)' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                    <td className="px-4 py-2 font-black text-zinc-400 uppercase w-1/3 border-r border-zinc-50 dark:border-zinc-800/50">{row.label}</td>
                    <td className="px-4 py-2 font-bold text-zinc-700 dark:text-zinc-200">
                      {row.isStatus ? <span className="text-emerald-500">{row.value}</span> : row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADDRESS INFORMATION */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 border-l-4 border-[#428bca]">ADDRESS INFORMATION</h4>
          <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-[11px]">
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {[
                  { label: 'Address Line 1', value: 'ABC Address' },
                  { label: 'Address Line 2', value: '' },
                  { label: 'City', value: '' },
                  { label: 'State', value: '' },
                  { label: 'Country', value: '' },
                  { label: 'ZIP/PIN Code', value: '' },
                  { label: 'Website', value: '' },
                  { label: 'Fax', value: '' },
                  { label: 'Registration Number', value: '' },
                  { label: 'Business Company', value: 'Breelink LLC' },
                  { label: 'Status', value: 'Active', isStatus: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                    <td className="px-4 py-2 font-black text-zinc-400 uppercase w-1/3 border-r border-zinc-50 dark:border-zinc-800/50">{row.label}</td>
                    <td className="px-4 py-2 font-bold text-zinc-700 dark:text-zinc-200">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CONTACT INFORMATION */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-2 border-l-4 border-[#428bca]">CONTACT INFORMATION</h4>
        <div className="space-y-6">
          {[
            { title: 'Commercial Contact', email: 'a.yehya@gabsgroup.com' },
            { title: 'Technical Contact', email: 'support@breelink.com,sachin594516@gmail.com' },
            { title: 'Rates Contact', email: 'a.yehya@gabsgroup.com' },
            { title: 'Finance Contact', email: 'a.yehya@gabsgroup.com' },
          ].map((contact, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{contact.title}</span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-center">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase w-32">Name</span>
                  <div className="flex-1 border-b border-zinc-50 dark:border-zinc-800 pb-1" />
                </div>
                <div className="flex items-center">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase w-32">Phone</span>
                  <div className="flex-1 border-b border-zinc-50 dark:border-zinc-800 pb-1" />
                </div>
                <div className="md:col-span-2 flex items-start mt-2">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase w-32 pt-2">Email</span>
                  <div className="flex-1 p-3 min-h-[60px] border border-zinc-100 dark:border-zinc-800 rounded text-[11px] text-zinc-700 dark:text-zinc-300 font-medium">
                    {contact.email}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEnterpriseBilling = () => {
    if (!isViewOnly) {
      return (
        <div className="space-y-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm text-left animate-in fade-in duration-300">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-6">
            <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Edit Customer Credit Limit & Shared Billing
            </h4>
            <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">Configure credit limits and add balance at the main customer level. sub-accounts / trunks will consume from this shared pool.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Master Shared Credit Limit ($)</label>
                <input 
                  type="number" 
                  value={creditLimitInput} 
                  onChange={(e) => {
                    setCreditLimitInput(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) setCreditLimit(val);
                  }} 
                  className={inputClass} 
                  placeholder="10000.00"
                />
                <p className="text-[9px] text-zinc-400 font-bold italic">All sub-accounts in this customer will share and draw from this single Credit Limit.</p>
              </div>

              <div className="space-y-1.5 p-4 border border-emerald-500/10 bg-emerald-500/5 rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">Add More Credit Balance / Top Up</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-mono text-xs font-black">$</span>
                    <input 
                      type="number" 
                      value={addCreditInput}
                      onChange={(e) => setAddCreditInput(e.target.value)}
                      className={cn(inputClass, "pl-7 border-emerald-500 focus:border-emerald-600 font-mono font-bold text-emerald-600 bg-white dark:bg-zinc-900")} 
                      placeholder="e.g. 500"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const extra = parseFloat(addCreditInput);
                      if (!isNaN(extra) && extra > 0) {
                        const newLimit = creditLimit + extra;
                        setCreditLimit(newLimit);
                        setCreditLimitInput(newLimit.toFixed(2));
                        setAddCreditInput('0');
                        alert(`Successfully added $${extra.toFixed(2)} credit master balance!\nNew Master Credit Limit: $${newLimit.toFixed(2)}.`);
                      } else {
                        alert("Please enter a valid positive numeric amount to top up credit balance.");
                      }
                    }}
                    className="px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] rounded-lg uppercase tracking-widest transition-all active:scale-95"
                  >
                    Top up Credit
                  </button>
                </div>
                <p className="text-[9px] text-emerald-600/70 font-bold italic">Conveniently add credit bounds. Changes are updated immediately to Statement of Account (SOA).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Billing Cycle</label>
                <select className={inputClass} defaultValue="Monthly - Net 15">
                  <option>Daily</option>
                  <option>Weekly - Net 7</option>
                  <option>Monthly - Net 15</option>
                  <option>Weekly (Mon-Sun)</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Account Currency</label>
                <select className={inputClass} defaultValue="USD">
                  <option value="USD">USD - US Dollar ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                  <option value="GBP">GBP - British Pound (£)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Payment Mode / Type</label>
                <select className={inputClass} defaultValue="Postpaid">
                  <option value="Prepaid">Prepaid (Credit Threshold Enforcement)</option>
                  <option value="Postpaid">Postpaid (Agreement terms)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Auto Invoicing Engine</label>
                <select className={inputClass} defaultValue="Enabled">
                  <option value="Enabled">Enabled (Automated Billing Run)</option>
                  <option value="Disabled">Disabled (Manual Invoicing request only)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={() => alert(`Saved Credit and Billing details! New Limit set to $${creditLimit.toLocaleString(undefined, {minimumFractionDigits: 2})}`)}
              className="px-6 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" /> Save Financial Parameters
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Billing Information */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm flex flex-col">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 text-left">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Customer Billing Information</span>
            </div>
            <div className="p-4 flex-1">
              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {[
                    { label: 'Customer Balance', value: `USD ${(creditLimit * 0.45).toFixed(6)}` },
                    { label: 'Currency', value: 'USD' },
                    { label: 'Billing Cycle', value: 'Monthly - Net 15' },
                    { label: 'Timezone', value: '(GMT +5:30) Bombay' },
                    { label: 'Billing Type', value: 'Postpaid' },
                    { label: 'Credit Limit', value: `${creditLimit.toFixed(6)}` },
                    { label: 'Opening Balance', value: '0.000000' },
                    { label: 'Auto Invoicing', value: 'Enabled' },
                    { label: 'Description', value: 'Shared Customer Account' },
                    { label: 'Updated By', value: 'teleoss support admin' },
                    { label: 'Updated Time', value: new Date().toISOString().replace('T', ' ').substring(0, 19) },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="py-2.5 font-black text-zinc-400 uppercase w-1/2 border-r border-zinc-50 dark:border-zinc-800/50 px-2">{row.label}</td>
                      <td className="py-2.5 font-bold text-zinc-700 dark:text-zinc-200 px-2 font-mono">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vendor Billing Information */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm flex flex-col">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 text-left">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Vendor Billing Information</span>
            </div>
            <div className="p-4 flex-1">
              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {[
                    { label: 'Vendor Balance', value: 'USD -2379.810000' },
                    { label: 'Currency', value: 'USD' },
                    { label: 'Billing Cycle', value: 'Monthly - Net 15' },
                    { label: 'Timezone', value: '(GMT +5:30) Bombay' },
                    { label: 'Opening Balance', value: '0.000000' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="py-2.5 font-black text-zinc-400 uppercase w-1/2 border-r border-zinc-50 dark:border-zinc-800/50 px-2">{row.label}</td>
                      <td className="py-2.5 font-bold text-zinc-700 dark:text-zinc-200 px-2 font-mono">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Beneficiary Information */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg shadow-sm flex flex-col">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-left">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Beneficiary Information</span>
              <button className="text-[#5cb85c] hover:text-green-600 transition-colors">
                <Edit2 className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4 flex-1 text-left">
              <table className="w-full text-left text-[11px]">
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                  {[
                    { label: 'Beneficiary Name', value: 'Teleoss Wholesale Partners' },
                    { label: 'Beneficiary Address', value: 'District Towers, Suite 101' },
                    { label: 'Beneficiary Bank', value: 'HDFC Wholesale' },
                    { label: 'Beneficiary Bank Address', value: 'Corporate HQ, Mumbai' },
                    { label: 'Currency', value: 'USD' },
                    { label: 'Beneficiary Account Number', value: 'ACT88274991200' },
                    { label: 'IBAN', value: 'HDFC 9638 5555 6666 66666' },
                    { label: 'Swift Code', value: 'HDFC0000123' },
                    { label: 'Wallet Address', value: '-' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10 transition-colors">
                      <td className="py-2.5 font-black text-zinc-400 uppercase w-1/2 border-r border-zinc-50 dark:border-zinc-800/50 px-2">{row.label}</td>
                      <td className="py-2.5 font-bold text-zinc-700 dark:text-zinc-200 px-2">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ACCOUNT-WISE CONSUMPTION TABLE (Shared Credit Limit Visualization) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm p-6 text-left space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 flex justify-between items-center">
            <div>
              <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest">Account-wise Credit Utilization Breakdown</h4>
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-0.5">All sub-accounts utilize credit limits from the main Customer profile</p>
            </div>
            <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/20 text-[#428bca] border border-blue-100 dark:border-blue-900/30 px-3 py-1 rounded font-mono">
              Master Limit: ${creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-850 text-[10px] font-black uppercase text-zinc-450 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="px-4 py-2.5 text-zinc-400">Account / Trunk Name</th>
                  <th className="px-4 py-2.5 text-zinc-400">Type / Category</th>
                  <th className="px-4 py-2.5 text-zinc-400 text-right">Individual Credit Limit</th>
                  <th className="px-4 py-2.5 text-zinc-400 text-right">Credit Utilized</th>
                  <th className="px-4 py-2.5 text-zinc-400 text-right">Remaining Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10">
                  <td className="px-4 py-3 font-bold text-zinc-800 dark:text-zinc-250">DIR_IN_01 (Retail SMS Account)</td>
                  <td className="px-4 py-3 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">SMPP Client</td>
                  <td className="px-4 py-3 text-right text-zinc-500 font-mono">Shared Master</td>
                  <td className="px-4 py-3 text-right font-black text-rose-500 font-mono">${(creditLimit * 0.32).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right font-bold text-zinc-400 font-mono">Dynamic Pool</td>
                </tr>
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/10">
                  <td className="px-4 py-3 font-bold text-zinc-800 dark:text-zinc-250">DIR_IN_02 (OTP Alert Gateway)</td>
                  <td className="px-4 py-3 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">HTTP Rest API</td>
                  <td className="px-4 py-3 text-right text-zinc-500 font-mono">Shared Master</td>
                  <td className="px-4 py-3 text-right font-black text-rose-500 font-mono">${(creditLimit * 0.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3 text-right font-bold text-zinc-400 font-mono">Dynamic Pool</td>
                </tr>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/10 font-bold text-xs">
                  <td className="px-4 py-3 text-[#428bca] uppercase font-black">Total Shared Consumption</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right text-zinc-400">Total Utilized:</td>
                  <td className="px-4 py-3 text-right text-rose-600 font-black font-mono">${(creditLimit * 0.50).toLocaleString(undefined, { minimumFractionDigits: 2 })} (50.00%)</td>
                  <td className="px-4 py-3 text-right text-emerald-500 font-black font-mono">${(creditLimit * 0.50).toLocaleString(undefined, { minimumFractionDigits: 2 })} Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderEnterpriseContacts = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipientGroups.map((group) => (
          <div key={group.id} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm hover:border-[#428bca]/30 transition-all group">
            <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{group.name}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" disabled={isViewOnly} className="w-3 h-3 rounded" />
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">SOA</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" disabled={isViewOnly} className="w-3 h-3 rounded" />
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Invoice</span>
                </label>
                <span className="text-[8px] font-black text-zinc-400 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 ml-1">{group.id}</span>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Contact Person Name</label>
                  <input type="text" disabled={isViewOnly} className={cn(inputClass, "h-8")} defaultValue={group.contactPerson} placeholder="Full Name" />
                </div>
                <div>
                  <label className={labelClass}>Mobile Number</label>
                  <input type="tel" disabled={isViewOnly} className={cn(inputClass, "h-8")} defaultValue={group.mobile} placeholder="+123..." />
                </div>
              </div>
              <div>
                <label className={labelClass}>Email Addresses (Separate with semi-colon ; for multiple)</label>
                <textarea 
                  rows={2} 
                  disabled={isViewOnly} 
                  className={cn(inputClass, "h-auto py-2 text-[10px]")} 
                  defaultValue={group.emails}
                  placeholder="email1@example.com; email2@example.com"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnterpriseOptions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
            <Zap className="w-3 h-3" /> Platform Configuration
          </h4>
        </div>
        <div className="space-y-4">
           <div className="space-y-3 p-4 bg-emerald-50/50 dark:bg-emerald-500/5 rounded border border-emerald-100 dark:border-emerald-900/30">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-zinc-400 uppercase">Pricing Plan</label>
                   <select disabled={isViewOnly} className={inputClass} defaultValue="Wholesale Standard">
                     <option>Wholesale Standard</option>
                     <option>Premium Direct</option>
                     <option>Enterprise Volume</option>
                   </select>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-zinc-400 uppercase">Rate Notification</label>
                   <select disabled={isViewOnly} className={inputClass} defaultValue="Email Only">
                     <option>Email Only</option>
                     <option>Email & Portal</option>
                     <option>None</option>
                   </select>
                 </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                 <input type="checkbox" disabled={isViewOnly} defaultChecked className="w-4 h-4 rounded border-emerald-300" />
                 <span className="text-[10px] font-bold text-emerald-600 uppercase">Auto-Send Rate on Supplier Change</span>
              </label>
           </div>
        </div>

        {/* NEW: NEGATIVE MARGIN GLOBAL CONTROL */}
        <div className="space-y-4">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-2">
              <TrendingDown className="w-3 h-3" /> Negative Margin Policy
            </h4>
          </div>
          <div className="space-y-4 p-4 bg-red-50/20 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
             <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                   <span className="text-[10px] font-black text-red-600 uppercase tracking-tight">Active Anti-Loss Monitor</span>
                   <p className="text-[8px] text-zinc-400 font-bold uppercase">Applies to all customer trunks</p>
                </div>
                <div className="relative inline-block w-8 h-4 transition duration-200 ease-in-out">
                  <input type="checkbox" defaultChecked disabled={isViewOnly} className="opacity-0 w-0 h-0 peer" id="global-loss-guard" />
                  <label htmlFor="global-loss-guard" className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-200 dark:bg-zinc-800 rounded-full cursor-pointer before:content-[''] before:absolute before:h-3 before:w-3 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition before:duration-200 peer-checked:bg-red-600 peer-checked:before:translate-x-4"></label>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Global Action</label>
                   <select disabled={isViewOnly} className={cn(inputClass, "h-8 border-red-100 dark:border-red-900/20")}>
                      <option>Block Wholesale Only</option>
                      <option>Block All Traffic</option>
                      <option>Alert NOC Team</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Tolerance ($)</label>
                   <input type="number" defaultValue="0.00000" disabled={isViewOnly} className={cn(inputClass, "h-8 border-red-100 dark:border-red-900/20 font-mono")} />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
            <List className="w-3 h-3" /> Automatic Statements (SOA)
          </h4>
        </div>
        <div className="space-y-3 p-4 bg-blue-50/50 dark:bg-blue-500/5 rounded border border-blue-100 dark:border-blue-900/30">
           <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" disabled={isViewOnly} defaultChecked className="w-4 h-4 rounded border-blue-300" />
                <span className="text-[10px] font-bold text-blue-600 uppercase">Enable Auto Send</span>
              </label>
           </div>
           <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Frequency</label>
                <select disabled={isViewOnly} className={inputClass} defaultValue="Weekly">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Send On</label>
                <select disabled={isViewOnly} className={inputClass} defaultValue="Monday">
                  <option>Monday</option>
                  <option>1st of Month</option>
                </select>
              </div>
           </div>
           <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                 <input type="checkbox" disabled={isViewOnly} defaultChecked /> Include Detail File
              </label>
              <label className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                 <input type="checkbox" disabled={isViewOnly} /> Only if Bal &gt; 0
              </label>
           </div>
        </div>

        {/* RECIPIENT GROUPS ASSIGNMENT */}
        <div className="space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Report Recipient Groups
            </h4>
          </div>
          <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">Select groups to receive automated system reports & alerts</p>
             <div className="space-y-2">
                {recipientGroups.map(group => (
                  <label key={group.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:border-blue-500/50 cursor-pointer group">
                     <div className="flex items-center gap-3">
                        <input type="checkbox" disabled={isViewOnly} className="w-4 h-4 rounded text-blue-500" />
                        <div>
                           <div className="text-[10px] font-black text-zinc-700 dark:text-zinc-200">{group.name}</div>
                           <div className="text-[9px] font-bold text-zinc-400 truncate max-w-[200px]">{group.emails}</div>
                        </div>
                     </div>
                     <button type="button" className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-3 h-3 text-zinc-400" />
                     </button>
                  </label>
                ))}
             </div>
             <button type="button" className="w-full py-2 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase text-[#428bca] hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2 mt-2">
                <Plus className="w-3 h-3" /> Add More Recipients
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnterpriseAddress = () => (
    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
        <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
          <MapPin className="w-3 h-3" /> Registered Office Address
        </h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Street Address</label>
          <input type="text" disabled={isViewOnly} className={inputClass} placeholder="Building, Street, Area" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Reference / Flat No</label>
          <input type="text" disabled={isViewOnly} className={inputClass} placeholder="Optional" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">City</label>
          <input type="text" disabled={isViewOnly} className={inputClass} placeholder="Enter City" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">State / Province</label>
          <input type="text" disabled={isViewOnly} className={inputClass} placeholder="Enter State" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Country</label>
          <select disabled={isViewOnly} className={inputClass}>
            <option>Select Country</option>
            <option>USA</option>
            <option>UK</option>
            <option>India</option>
            <option>UAE</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">ZIP / Postal Code</label>
          <input type="text" disabled={isViewOnly} className={inputClass} placeholder="ZIP Code" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Website</label>
          <input type="text" disabled={isViewOnly} className={inputClass} placeholder="https://" />
        </div>
      </div>
    </div>
  );

  const renderEnterpriseProductAssign = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
       <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-[0.2em] flex items-center gap-2">
             <Zap className="w-3.5 h-3.5" /> Product & Service Mapping
          </h4>
          <div className="flex gap-2">
            <button onClick={() => setShowCatalog(true)} className="px-3 py-1 bg-zinc-600 text-white text-[10px] font-bold rounded shadow hover:bg-zinc-700 transition-all">Browse Catalog</button>
            <button className="px-3 py-1 bg-[#428bca] text-white text-[10px] font-bold rounded shadow hover:bg-blue-600 transition-all">+ Assign New Product</button>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-3 border-b border-zinc-200 dark:border-zinc-800">
                   <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Available Products</span>
                </div>
                <div className="p-2 space-y-2">
                   {['Standard Wholesale', 'Premium Direct', 'Asia Route', 'Global Special'].map(prod => (
                      <div key={prod} className="flex items-center justify-between p-3 border border-zinc-100 dark:border-zinc-800 rounded hover:border-[#428bca] cursor-pointer group">
                         <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4 rounded" />
                            <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">{prod}</span>
                         </div>
                         <button className="text-[9px] font-black text-[#428bca] underline decoration-dotted opacity-0 group-hover:opacity-100 transition-all">Show Suppliers</button>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="space-y-6">
             <div className="p-6 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-4">
                <h5 className="text-[10px] font-black text-[#428bca] uppercase tracking-[0.2em]">Strategy Settings</h5>
                <div className="space-y-3">
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase">Routing Type</label>
                      <select className={inputClass} defaultValue="LCR">
                         <option>Least Cost (LCR)</option>
                         <option>Quality Balanced</option>
                         <option>Profit Maximizer</option>
                      </select>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase">Min Profit Margin</label>
                      <input type="number" step="0.0001" defaultValue="0.0015" className={inputClass} />
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderEnterpriseDocs = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="flex justify-end p-4 border-b border-zinc-100 dark:border-zinc-800">
          <button className="px-4 py-1.5 bg-[#428bca] text-white text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-600 transition-all flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8f9fa] dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                {['INFO ID', 'NAME', 'DOWNLOAD FILE', 'CREATED BY', 'CREATED TIME'].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800 last:border-r-0">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-400 font-bold uppercase tracking-widest text-[11px]">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/30 text-[10px] text-zinc-400 font-bold">
           Showing 0 to 0 of 0 entries
        </div>
      </div>
    </div>
  );

  const renderEnterpriseForm = () => {
    const generalSection = (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300", isViewOnly && "mt-10")}>
        <div className="space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
              <Info className="w-3 h-3" /> Basic Information
            </h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Company Name <span className="text-red-500">*</span></label>
              <input type="text" defaultValue="ABC Telecom" disabled={isViewOnly} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Account Alias <span className="text-red-500">*</span></label>
              <input type="text" defaultValue="ABC" disabled={isViewOnly} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Account Type</label>
                <select disabled={isViewOnly} className={inputClass} defaultValue="Reciprocal">
                  <option>Customer</option>
                  <option>Vendor</option>
                  <option>Reciprocal</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Account Group</label>
                <select disabled={isViewOnly} className={inputClass} defaultValue="Wholesale">
                  <option>Wholesale</option>
                  <option>Direct Retail</option>
                  <option>Internal</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Status</label>
              <div className="flex gap-4 pt-1">
                <label className={cn("flex items-center gap-2 cursor-pointer font-bold", isViewOnly ? "text-emerald-500/50" : "text-emerald-600")}>
                  <input type="radio" name="status" defaultChecked disabled={isViewOnly} className="w-4 h-4" /> Active
                </label>
                <label className={cn("flex items-center gap-2 cursor-pointer text-zinc-400 font-medium", isViewOnly && "opacity-50")}>
                  <input type="radio" name="status" disabled={isViewOnly} className="w-4 h-4" /> Inactive
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
              <Users className="w-3 h-3" /> Management
            </h4>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Business Company</label>
              <select disabled={isViewOnly} className={inputClass} defaultValue="Breelink LLC">
                <option>Breelink LLC</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Assigned Account Manager</label>
              <select disabled={isViewOnly} className={inputClass} defaultValue="109">
                <option value="109">a.yehya gabs (109)</option>
                <option value="110">support team (110)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Sales Representative</label>
              <input type="text" disabled={isViewOnly} className={inputClass} placeholder="Enter sales rep name" />
            </div>
            <div className="space-y-1.5 pt-4">
               <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Internal Notes</label>
               <textarea rows={3} disabled={isViewOnly} className={cn(inputClass, "h-auto py-2 resize-none")} placeholder="Add any management notes here..."></textarea>
            </div>
          </div>
        </div>
      </div>
    );

    const billingSection = (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300", isViewOnly && "mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800/50")}>
        <div className="space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Billing Parameters
            </h4>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Payment Mode</label>
                <select disabled={isViewOnly} className={inputClass} defaultValue="Prepaid">
                  <option>Prepaid</option>
                  <option>Postpaid</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Currency</label>
                <select disabled={isViewOnly} className={inputClass} defaultValue="USD">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Credit Limit</label>
                <input type="number" defaultValue="1000.00" disabled={isViewOnly} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Credit Buffer</label>
                <input type="number" defaultValue="100.00" disabled={isViewOnly} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Billing Cycle</label>
              <select disabled={isViewOnly} className={inputClass} defaultValue="Weekly">
                <option>Daily</option>
                <option>Weekly (Mon-Sun)</option>
                <option>Bi-Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Commission (%)</label>
                <input type="number" defaultValue="0.00" disabled={isViewOnly} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Tax ID / VAT No</label>
                <input type="text" placeholder="Optional" disabled={isViewOnly} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
            <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
              <Shield className="w-3 h-3" /> Notifications
            </h4>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400">Notification</span>
                <p className="text-[9px] text-zinc-400 font-bold uppercase">Enable or disable all automated alerts for this account</p>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="notification-toggle" defaultChecked disabled={isViewOnly} className="w-4 h-4 text-[#428bca]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#428bca]">Enable</span>
                 </label>
                 <div className="w-px h-4 bg-zinc-200 dark:border-zinc-800" />
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="notification-toggle" disabled={isViewOnly} className="w-4 h-4 text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Disable</span>
                 </label>
              </div>
            </div>
            
            <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
               <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-tighter">Usage Thresholds (%)</label>
                  <span className="text-[9px] font-black text-[#428bca] uppercase tracking-widest">Global Policy Applied</span>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-blue-500 uppercase">Notice</span>
                    <input type="number" defaultValue="75" disabled={isViewOnly} className={cn("w-full h-8 px-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[11px]", isViewOnly && "bg-zinc-100 dark:bg-zinc-900 border-dashed")} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-amber-500 uppercase">Warning</span>
                    <input type="number" defaultValue="90" disabled={isViewOnly} className={cn("w-full h-8 px-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[11px]", isViewOnly && "bg-zinc-100 dark:border-zinc-900 border-dashed")} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-red-500 uppercase">Block</span>
                    <input type="number" defaultValue="100" disabled={isViewOnly} className={cn("w-full h-8 px-2 border border-zinc-200 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-[11px]", isViewOnly && "bg-zinc-100 dark:bg-zinc-900 border-dashed")} />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );

    const contactsSection = isViewOnly ? (
      <div className="space-y-16 mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <h4 className="text-[10px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
            <Users className="w-3 h-3" /> Contact Information
          </h4>
        </div>
        {renderEnterpriseContacts()}
      </div>
    ) : renderEnterpriseContacts();

    const productSection = (
      <div className={cn(isViewOnly && "mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800/50")}>
        {renderEnterpriseProductAssign()}
      </div>
    );

    const optionsSection = (
      <div className={cn(isViewOnly && "mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800/50")}>
        {renderEnterpriseOptions()}
      </div>
    );

    const addressSection = (
      <div className={cn(isViewOnly && "mt-16 pt-16 border-t border-zinc-100 dark:border-zinc-800/50")}>
        {renderEnterpriseAddress()}
      </div>
    );

    return (
      <div className="space-y-6">
        {!hideTabs && (
          <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-6 overflow-x-auto no-scrollbar">
            {tabs.map(tabId => (
              <button
                key={tabId}
                onClick={() => setActiveSubTab(tabId)}
                className={cn(
                  "px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 whitespace-nowrap",
                  activeSubTab === tabId ? "border-[#428bca] text-[#428bca] bg-blue-50/30 dark:bg-blue-500/5" : "border-transparent text-zinc-400 hover:text-zinc-600"
                )}
              >
                {tabId === 'General Info' && <Info className="w-3.5 h-3.5" />}
                {tabId === 'Docs' && <FileText className="w-3.5 h-3.5" />}
                {tabId === 'Billing' && <CreditCard className="w-3.5 h-3.5" />}
                {tabId === 'Vendor Trunk' && <Server className="w-3.5 h-3.5" />}
                {tabId === 'Customer Trunk' && <Users className="w-3.5 h-3.5" />}
                {tabId}
              </button>
            ))}
          </div>
        )}

        <div className={cn("min-h-[400px]", hideTabs && "pt-0")}>
          {activeSubTab === 'General Info' && (type === 'Enterprise' ? renderEnterpriseGeneral() : (
            <div className="space-y-12">
              {renderTrunkForm(type === 'Customer' ? 'Customer' : 'Vendor')}
              <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 delay-200">
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest mb-6 flex items-center gap-2">
                     <CreditCard className="w-4 h-4" /> BILLING & FINANCIAL DETAILS
                  </h4>
                  {renderEnterpriseBilling()}
                </div>
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest mb-6 flex items-center gap-2">
                     <Users className="w-4 h-4" /> CONTACT PERSONS
                  </h4>
                  {renderEnterpriseContacts()}
                </div>
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800">
                  <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest mb-6 flex items-center gap-2">
                     <MapPin className="w-4 h-4" /> ADDRESS & LOCATION DETAILS
                  </h4>
                  {renderEnterpriseAddress()}
                </div>
              </div>
            </div>
          ))}
          {activeSubTab === 'Docs' && renderEnterpriseDocs()}
          {activeSubTab === 'Billing' && renderEnterpriseBilling()}
          {activeSubTab === 'Vendor Trunk' && <div className="text-zinc-400 text-center py-20 font-bold uppercase tracking-widest">Vendor Trunk List View</div>}
          {activeSubTab === 'Customer Trunk' && <div className="text-zinc-400 text-center py-20 font-bold uppercase tracking-widest">Customer Trunk List View</div>}
        </div>



        {showAccountDetailModal && selectedAccountForDetails && (
          <AccountDetailModal 
            account={selectedAccountForDetails} 
            onClose={() => setShowAccountDetailModal(false)} 
          />
        )}
      </div>
    );
  };

interface AssignmentSelectorModalProps {
  type: 'product' | 'rate-table';
  category: string;
  options: any;
  onAssign: (name: string) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
}

function AssignmentSelectorModal({ type, category, options, onAssign, onClose, theme }: AssignmentSelectorModalProps) {
  const [selected, setSelected] = React.useState('');
  const [viewStep, setViewStep] = React.useState<'list' | 'details'>('list');
  const currentOptions = options[category] || [];

  const info = PRODUCT_RULES_AND_PRICING[selected] || getFallbackProductInfo(selected);

  const handleProductClick = (name: string) => {
    setSelected(name);
    setViewStep('details');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            {viewStep === 'details' && (
              <button 
                onClick={() => setViewStep('list')}
                className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-[12px] font-black uppercase text-[#428bca] tracking-[0.2em] flex items-center gap-2">
              {type === 'product' ? <Zap className="w-4 h-4" /> : <List className="w-4 h-4" />}
              {viewStep === 'list' 
                ? (type === 'product' ? 'Select Product' : 'Select Rate Plan')
                : `Product Details: ${selected.replace(/_/g, ' ')}`
              }
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-all text-zinc-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {viewStep === 'list' ? (
            <div className="p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-black uppercase text-zinc-400">Match for Category: <span className="text-[#428bca]">{category}</span></div>
                  <div className="text-[10px] font-bold text-zinc-400">{currentOptions.length} Products Available</div>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                  {currentOptions.map((opt: string, index: number) => {
                    const productInfo = PRODUCT_RULES_AND_PRICING[opt] || getFallbackProductInfo(opt);
                    return (
                      <div 
                        key={opt}
                        onClick={() => handleProductClick(opt)}
                        className="flex items-center justify-between p-5 bg-white dark:bg-zinc-900 hover:ring-2 hover:ring-[#428bca]/30 border border-zinc-100 dark:border-zinc-800 rounded-2xl transition-all group text-left shadow-sm hover:shadow-md animate-in fade-in slide-in-from-right-4 duration-300"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 group-hover:text-[#428bca] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                               {type === 'product' ? <Zap className="w-7 h-7" /> : <Database className="w-7 h-7" />}
                            </div>
                            <div>
                               <div className="text-sm font-black text-zinc-700 dark:text-zinc-200 group-hover:text-[#428bca] transition-colors">{opt.replace(/_/g, ' ')}</div>
                               <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                                 <div className="flex items-center gap-1">
                                   <MapPin className="w-2.5 h-2.5 text-zinc-400" />
                                   <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">{productInfo?.country || 'Global'}</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <TrendingDown className="w-2.5 h-2.5 text-emerald-500" />
                                   <span className="text-[9px] font-black text-emerald-600 font-mono">${productInfo?.rate || '0.0100'}</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                   <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                   <span className="text-[9px] font-bold text-zinc-400 uppercase">Active</span>
                                 </div>
                               </div>
                               <div className="mt-2 flex gap-1 items-center">
                                  {(productInfo?.features || ['Premium Routing', 'Quality Link']).slice(0, 2).map((f: string, i: number) => (
                                    <span key={i} className="text-[8px] font-bold text-zinc-400 border border-zinc-100 dark:border-zinc-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">{f}</span>
                                  ))}
                                  {(productInfo?.features?.length || 0) > 2 && <span className="text-[8px] font-bold text-zinc-300">+{productInfo.features.length - 2} more</span>}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                           <div className="text-right hidden sm:flex flex-col gap-1 items-end">
                              <div className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Pricing From</div>
                              <div className="text-sm font-black text-emerald-600 font-mono leading-none">${productInfo?.rate || '0.0100'}</div>
                              <div className="text-[7px] font-bold text-zinc-300 uppercase">{productInfo?.currency || 'USD'} / SMS</div>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAssign(opt);
                                }}
                                className="mt-2 px-3 py-1 bg-[#428bca] text-white text-[9px] font-black uppercase rounded-lg hover:bg-blue-600 transition-all shadow-sm active:scale-95"
                              >
                                Select & Assign
                              </button>
                           </div>
                           <div className="w-8 h-8 rounded-full border border-zinc-100 dark:border-zinc-800 flex items-center justify-center group-hover:bg-[#428bca] group-hover:border-[#428bca] transition-all">
                             <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                           </div>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          ) : (
            <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#428bca]/5 dark:bg-blue-900/10 rounded-2xl p-5 border border-[#428bca]/10">
                  <h4 className="text-[10px] font-black uppercase text-[#428bca] mb-3 tracking-widest flex items-center gap-2">
                    <TrendingDown className="w-3.5 h-3.5" /> Pricing Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-[#428bca]/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Base Rate</span>
                      <span className="text-sm font-black text-emerald-600 font-mono">${info?.rate || '0.0100'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-[#428bca]/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Currency</span>
                      <span className="text-[10px] font-black text-zinc-700 dark:text-zinc-200">{info?.currency || 'USD'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Region</span>
                      <span className="text-[10px] font-black text-zinc-700 dark:text-zinc-200">{info?.country || 'Global'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800">
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-3 tracking-widest flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5" /> Features
                  </h4>
                  <ul className="space-y-2">
                    {(info?.features || ['Priority Routing', 'Global Reach', '24/7 Support']).map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                        <Check className="w-3 h-3 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-zinc-950 p-6 rounded-2xl border border-white/5">
                <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Compliance & Routing Rules
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(info?.rules || ['No specific rules defined']).map((rule: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-[10px] font-bold text-zinc-400 leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Pricing Breakdown by Country & Operators</h4>
                  <span className="text-[8px] font-black px-2 py-0.5 bg-blue-500/10 text-[#428bca] rounded uppercase tracking-widest">MCC-MNC Mapping Active</span>
                </div>
                <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80">
                      <tr className="border-b border-zinc-100 dark:border-zinc-800">
                        <th className="px-4 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Destination / Country</th>
                        <th className="px-4 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">MCC-MNC Code</th>
                        <th className="px-4 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">Operator Status</th>
                        <th className="px-4 py-2.5 text-[9px] font-black text-zinc-400 uppercase tracking-widest text-right">Selling Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                      {(info?.pricingDetails || [
                        { destination: 'Global Sample Route', mccmnc: '901-01', price: '0.0100' }
                      ]).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                          <td className="px-4 py-3 text-[11px] font-black text-zinc-700 dark:text-zinc-200 uppercase tracking-tight">{row.destination}</td>
                          <td className="px-4 py-3 text-[11px] font-mono text-[#428bca] font-bold">{row.mccmnc || 'Global'}</td>
                          <td className="px-4 py-3">
                            <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[8px] font-black uppercase tracking-wider">
                              Direct LCR Open
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[11.5px] font-black text-emerald-600 text-right font-mono">${row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
          <button onClick={onClose} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors">Discard</button>
          
          {viewStep === 'details' ? (
            <button
               onClick={() => onAssign(selected)}
               className="px-8 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
            >
               <CheckCircle2 className="w-4 h-4" /> Assign Product
            </button>
          ) : (
            <div className="text-[9px] font-bold text-zinc-400 uppercase italic">Select a product to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountDetailModal({ account, onClose }: { account: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
          <h3 className="text-sm font-black uppercase text-[#428bca] flex items-center gap-2">
            <Users className="w-4 h-4" /> Account Details
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50/30 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-900/20">
             <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-lg">
                {account.name?.charAt(0)}
             </div>
             <div>
                <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-100">{account.name}</h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{account.id}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {[
               { label: 'Customer Name', value: account.customer },
               { label: 'Account Category', value: account.category },
               { label: 'Assigned Product', value: account.assignedProduct || 'Not Assigned', isProduct: true },
               { label: 'Username', value: account.username, isMono: true },
               { label: 'Account Type', value: account.type },
               { label: 'Status', value: 'Active', isStatus: true },
             ].map((row, i) => (
               <div key={i} className="flex items-center justify-between py-3 border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">{row.label}</span>
                  <span className={cn(
                    "text-[11px] font-bold",
                    row.isProduct ? "text-[#428bca]" : "text-zinc-700 dark:text-zinc-200",
                    row.isMono && "font-mono",
                    row.isStatus && "text-emerald-500"
                  )}>
                    {row.value}
                  </span>
               </div>
             ))}
          </div>

          <div className="pt-4">
             <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700 space-y-2">
                <p className="text-[9px] font-black text-zinc-400 uppercase">Description</p>
                <p className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 italic">This is a primary transactional account for high-priority traffic.</p>
             </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end bg-zinc-50/50 dark:bg-zinc-800/30">
          <button onClick={onClose} className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-blue-600 transition-all">Close Details</button>
        </div>
      </div>
    </div>
  );
}


  const renderTrunkForm = (trunkType: 'Customer' | 'Vendor') => {
    const sectionTitleClass = "text-[12px] font-black uppercase text-[#428bca] tracking-widest border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-6 flex items-center gap-2";
    
    return (
      <div className="space-y-8 pb-10 animate-in fade-in duration-500 max-w-7xl mx-auto text-left">
        {/* Dynamic Buttons Header - REMOVED redundant buttons as they are in main layout */}
        <div className="flex justify-between items-center -mt-4 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-4">
           {hideTabs ? (
             <button 
               onClick={onClose}
               className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-black uppercase text-[10px] tracking-widest"
             >
               <ArrowLeft className="w-4 h-4" /> Back to Dashboard
             </button>
           ) : <div />}
        </div>

        {/* VENDOR SUPPLIER SETUP TABS HEADER */}
        {trunkType === 'Vendor' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-xs space-y-1.5 shrink-0 flex flex-wrap gap-2 items-center justify-between mb-4">
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'MAIN', label: 'MAIN SETTING', description: 'Core connection details' },
                { id: 'SENDING', label: 'SENDING SETTINGS', description: 'Bind identity & purpose' },
                { id: 'SMPP', label: 'SMPP SETTINGS', description: 'Host urls & socket modes' },
                { id: 'ADVANCED_SMPP', label: 'ADVANCE SMPP SETTINGS', description: 'Delays, TON/NPI & protocols' },
                { id: 'COMMITMENT', label: 'COMMITMENT', description: 'Volume targets & penalty terms' }
              ].map((tab) => {
                const isActive = activeVendorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveVendorTab(tab.id as any)}
                    className={cn(
                      "px-4 py-2.5 rounded-lg transition-all flex flex-col items-start gap-px text-left border",
                      isActive 
                        ? "bg-[#428bca] text-white border-[#428bca] shadow-md shadow-blue-500/10" 
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 group"
                    )}
                  >
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-wider",
                      isActive ? "text-white" : "text-zinc-750 dark:text-zinc-300 group-hover:text-[#428bca]"
                    )}>
                      {tab.label}
                    </span>
                    <span className={cn(
                      "text-[8px] font-medium leading-none mt-0.5",
                      isActive ? "text-blue-100" : "text-zinc-400 dark:text-zinc-500"
                    )}>
                      {tab.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* COMPREHENSIVE VIEW HEADER */}
        {isViewOnly && (
          <div className="bg-[#428bca] rounded-xl p-6 text-white shadow-lg mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-6 text-left">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                   <Server className="w-8 h-8 text-white fill-white" />
                </div>
                <div>
                   <h2 className="text-xl font-black uppercase tracking-wider">{trunkType === 'Vendor' ? 'Digiwhiff_WHS_OUT' : 'Digiwhilff_DIR_IN'}</h2>
                   <div className="flex gap-4 mt-1">
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase">{trunkType} Trunk</span>
                      <span className="text-[10px] font-bold bg-emerald-400 text-white px-2 py-0.5 rounded uppercase">Active & Connected</span>
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded uppercase tracking-tighter">ID: {trunkType === 'Vendor' ? 'V102' : 'TX-129420'}</span>
                   </div>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="text-right">
                   <div className="text-[10px] font-black uppercase opacity-60">TPS Limit</div>
                   <div className="text-lg font-black tracking-tighter">100 <span className="text-[10px] opacity-60">TPS</span></div>
                </div>
                <div className="w-px h-10 bg-white/20 mx-2" />
                <div className="text-right">
                   <div className="text-[10px] font-black uppercase opacity-60">Vendor Account</div>
                   <div className="text-lg font-black tracking-tighter text-blue-100">{trunkType === 'Vendor' ? 'BREELINK_EUR' : 'ABC_DIR_IN'}</div>
                </div>
             </div>
          </div>
        )}

        {/* TAB 1: MAIN SETTINGS */}
        {(trunkType !== 'Vendor' || activeVendorTab === 'MAIN') && (
          <>
            {/* GENERAL INFORMATION */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
          <div className={sectionTitleClass}>
            <span>GENERAL INFORMATION</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              {trunkType === 'Customer' && (
                <div>
                  <label className={labelClass}>Main Customer Name <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Select or Enter Customer" 
                      defaultValue={data?.customerName || data?.name || ""}
                      disabled={isViewOnly || title.includes('Account')} 
                      className={cn(inputClass, "flex-1 font-black text-blue-600 dark:text-blue-400")} 
                      list="customer-list"
                    />
                    <datalist id="customer-list">
                      <option value="ABC Telecom" />
                      <option value="Global SMS" />
                      <option value="Teleoss Tech" />
                    </datalist>
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-1 font-bold italic">This represents the master entity for billing</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <label className={labelClass}>{trunkType === 'Vendor' ? 'Vendor Name' : 'Specific Account Name'} <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    defaultValue={title.includes('New Account') && trunkType === 'Customer' ? "" : (data?.name || (trunkType === 'Vendor' ? "Digiwhiff_WHS_OUT" : ""))} 
                    disabled={isViewOnly || (trunkType === 'Vendor' && title.includes('Account'))} 
                    className={inputClass} 
                    placeholder={trunkType === 'Vendor' ? "Enter Vendor Name" : "Enter Account Name (e.g. DIR_IN_02)"} 
                  />
                </div>
                <div>
                  <label className={labelClass}>Account Alias</label>
                  <input type="text" defaultValue={data?.alias || ""} disabled={isViewOnly} className={inputClass} />
                </div>
              </div>
                {trunkType === 'Customer' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Account Category <span className="text-red-500">*</span></label>
                        <select 
                          disabled={isViewOnly} 
                          className={inputClass} 
                          value={accountCategory}
                          onChange={(e) => setAccountCategory(e.target.value)}
                        >
                          {categories.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Account Status</label>
                        <div className="flex gap-3 pt-1.5">
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 cursor-pointer">
                            <input type="radio" name="acc-status" defaultChecked className="w-3.5 h-3.5" /> ACTIVE
                          </label>
                          <label className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 cursor-pointer">
                            <input type="radio" name="acc-status" className="w-3.5 h-3.5" /> BLOCKED
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>TPS Limitation <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          defaultValue="50" 
                          disabled={isViewOnly} 
                          className={cn(inputClass, "font-mono font-bold text-amber-600 dark:text-amber-400")} 
                          placeholder="e.g. 50" 
                        />
                        <p className="text-[9px] text-zinc-400 font-bold italic mt-0.5">Transactions per second threshold for this customer account</p>
                      </div>
                      <div>
                        <label className={labelClass}>SMPP Bind Limit</label>
                        <input 
                          type="number" 
                          defaultValue="2" 
                          disabled={isViewOnly} 
                          className={cn(inputClass, "font-mono")} 
                          placeholder="e.g. 2" 
                        />
                        <p className="text-[9px] text-zinc-400 font-bold italic mt-0.5">Simultaneous active transmitter/receiver connections</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className={labelClass}>Product Assignment</label>
                          <button 
                            type="button"
                            onClick={() => !isViewOnly && (setAssignmentType('product'), setShowAssignmentModal(true), setAssignmentStep('list'))}
                            className="text-[9px] font-black uppercase text-[#428bca] hover:underline cursor-pointer"
                          >
                            Browse Catalog
                          </button>
                        </div>
                        <div className="relative group/field">
                          <input 
                            type="text" 
                            readOnly
                            placeholder="Assign Product..." 
                            value={assignedProduct}
                            onClick={() => !isViewOnly && (setAssignmentType('product'), setShowAssignmentModal(true), setAssignmentStep('list'))}
                            className={cn(inputClass, "pr-10 cursor-pointer group-hover/field:border-[#428bca]/50 transition-colors")} 
                          />
                          <button 
                            type="button"
                            disabled={isViewOnly}
                            onClick={() => (setAssignmentType('product'), setShowAssignmentModal(true), setAssignmentStep('list'))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#428bca]" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className={labelClass}>Time Zone</label>
                      <select disabled={isViewOnly} className={inputClass} defaultValue="UTC">
                        <option>(GMT +0:00) UTC</option>
                        <option>(GMT +5:30) Bombay</option>
                        <option>(GMT -5:00) Eastern Time</option>
                      </select>
                    </div>
                  </>
                )}
              {trunkType === 'Vendor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Vendor Account</label>
                    <input type="text" defaultValue={data?.account || "BREELINK_EUR"} disabled={isViewOnly} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Product <span className="text-red-500">*</span></label>
                    <select disabled={isViewOnly} className={inputClass} defaultValue="SMS">
                      <option value="SMS">SMS</option>
                      <option value="VOICE">VOICE</option>
                    </select>
                  </div>
                </div>
              )}
              {trunkType === 'Vendor' && (
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter block">Supplier Category <span className="text-red-500">*</span></label>
                  </div>
                  <select disabled={isViewOnly} className={inputClass} defaultValue={data?.category || "WHS"}>
                    {categories.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Moved Business Company and Status from here to Address Information as per request */}
            </div>

            <div className="space-y-6">
              <div>
                <label className={labelClass}>Notification</label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-200">
                    <input type="radio" name="notification" defaultChecked disabled={isViewOnly} className="w-4 h-4 text-brand-500" /> Enable
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                    <input type="radio" name="notification" disabled={isViewOnly} className="w-4 h-4" /> Disable
                  </label>
                </div>
              </div>
              <div>
                <label className={labelClass}>Protocol <span className="text-red-500">*</span></label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-200">
                    <input type="radio" name="protocol" defaultChecked disabled={isViewOnly} className="w-4 h-4" /> SMPP
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                    <input type="radio" name="protocol" disabled={isViewOnly} className="w-4 h-4" /> HTTP
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Translation Rule Group</label>
                  <select disabled={isViewOnly} className={inputClass}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>HLR Rule Group</label>
                  <select disabled={isViewOnly} className={inputClass}>
                    <option>Select</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Billing Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <select disabled={isViewOnly} className={inputClass} defaultValue="Submit">
                    <option>Submit</option>
                    <option>Delivery</option>
                  </select>
                  <select disabled={isViewOnly} className={inputClass} defaultValue="AUTO">
                    <option>AUTO</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

            {/* Switch Instance settings for Vendor */}
            {trunkType === 'Vendor' && (
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 mb-6">
                <button
                  type="button"
                  onClick={() => setVendorInstanceWiseOpen(!vendorInstanceWiseOpen)}
                  className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-between text-left border-b border-zinc-200 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#428bca]" />
                    <span className="text-[11px] font-black uppercase text-zinc-750 dark:text-zinc-300 tracking-wider">Instance Wise Distribution Settings</span>
                  </div>
                  {vendorInstanceWiseOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </button>

                {vendorInstanceWiseOpen && (
                  <div className="p-5 bg-white dark:bg-zinc-900 border-t-0 space-y-4">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Select backend engine nodes/instances allowed to route this service's traffic:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['Instance_01_Mumbai', 'Instance_02_London', 'Instance_03_Frankfurt'].map((inst) => {
                        const selected = vendorSelectedInstances.includes(inst);
                        return (
                          <button
                            type="button"
                            key={inst}
                            onClick={() => {
                              setVendorSelectedInstances(prev => 
                                selected ? prev.filter(p => p !== inst) : [...prev, inst]
                              );
                            }}
                            className={cn(
                              "p-3 rounded-lg border text-left flex items-center gap-3 transition-all",
                              selected 
                                ? "bg-blue-50/50 dark:bg-blue-950/25 border-[#428bca] text-[#428bca] dark:text-blue-400 font-bold" 
                                : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center transition-all",
                              selected ? "bg-[#428bca] border-[#428bca] text-white" : "border-zinc-300"
                            )}>
                              {selected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </div>
                            <span className="text-[10px] uppercase font-mono tracking-tighter">{inst.replaceAll('_', ' ')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        {/* ADDRESS INFORMATION */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
           <h4 className={sectionTitleClass}>ADDRESS INFORMATION</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
             <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2 lg:col-span-3">
                <div>
                   <label className={labelClass}>Business Company</label>
                   <input type="text" defaultValue="Breelink LLC" disabled={isViewOnly} className={inputClass} placeholder="Enter Business Company" />
                </div>
                <div>
                  <label className={labelClass}>Status <span className="text-red-500">*</span></label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-200">
                      <input type="radio" name="status" defaultChecked disabled={isViewOnly} className="w-4 h-4 text-brand-500" /> Active
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                      <input type="radio" name="status" disabled={isViewOnly} className="w-4 h-4" /> Inactive
                    </label>
                  </div>
                </div>
             </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 1</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.address1 || ""} placeholder="ABC Address" />
               </div>
               <div>
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.address2 || ""} />
               </div>
               <div>
                  <label className={labelClass}>City</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.city || ""} />
               </div>
               <div>
                  <label className={labelClass}>State</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.state || ""} />
               </div>
               <div>
                  <label className={labelClass}>Country</label>
                  <select disabled={isViewOnly} className={inputClass} defaultValue={data?.country || "Select Country"}>
                     <option>Select Country</option>
                     <option>USA</option>
                     <option>UK</option>
                     <option>India</option>
                  </select>
               </div>
               <div>
                  <label className={labelClass}>ZIP/PIN Code</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.zip || ""} />
               </div>
               <div>
                  <label className={labelClass}>Website</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.website || ""} />
               </div>
               <div>
                  <label className={labelClass}>Fax</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.fax || ""} />
               </div>
               <div>
                  <label className={labelClass}>Registration Number</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.regNo || ""} />
               </div>
               <div>
                  <label className={labelClass}>VAT Number</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.vatNo || ""} />
               </div>
               <div>
                  <label className={labelClass}>GST NO</label>
                  <input type="text" disabled={isViewOnly} className={inputClass} defaultValue={data?.gstNo || ""} />
               </div>
           </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
           <h4 className={sectionTitleClass}>CONTACT INFORMATION</h4>
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipientGroups.map((group) => (
                  <div key={group.id} className="border border-zinc-100 dark:border-zinc-800 rounded-lg overflow-hidden group hover:border-[#428bca]/30 transition-all">
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{group.name}</span>
                      <div className="flex items-center gap-3">
                        {trunkType !== 'Vendor' && (
                          <>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" disabled={isViewOnly} className="w-3 h-3 rounded" />
                              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">SOA</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" disabled={isViewOnly} className="w-3 h-3 rounded" />
                              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">Invoice</span>
                            </label>
                          </>
                        )}
                        <span className="text-[8px] font-black text-zinc-400 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 ml-1">{group.id}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className={labelClass}>Contact Person Name</label>
                        <input type="text" disabled={isViewOnly} className={inputClass} placeholder="Full Name" />
                      </div>
                      <div>
                        <label className={labelClass}>Mobile Number</label>
                        <input type="tel" disabled={isViewOnly} className={inputClass} placeholder="+123..." />
                      </div>
                      <div>
                        <label className={labelClass}>Email Addresses (Separate with semi-colon ; for multiple)</label>
                        <textarea 
                          rows={2} 
                          disabled={isViewOnly} 
                          className={cn(inputClass, "h-auto py-2")} 
                          defaultValue={group.emails}
                          placeholder="email1@example.com; email2@example.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* BILLING & RULES */}
        {trunkType !== 'Vendor' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
             <h4 className={sectionTitleClass}>BILLING & RULES</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-6">
                   <div>
                      <label className={labelClass}>Billing Cycle Rules</label>
                      <select disabled={isViewOnly} className={inputClass}>
                         <option>Weekly (Mon-Sun)</option>
                         <option>Monthly - Net 15</option>
                         <option>Bi-Weekly</option>
                         <option>Monthly</option>
                      </select>
                   </div>
                   <div>
                      <label className={labelClass}>Payment Terms (Net Days)</label>
                      <input type="number" defaultValue="7" disabled={isViewOnly} className={inputClass} />
                   </div>
                </div>
                <div className="space-y-6">
                   <div>
                      <label className={labelClass}>Currency</label>
                      <select disabled={isViewOnly} className={inputClass} defaultValue="USD">
                         <option>USD</option>
                         <option>EUR</option>
                      </select>
                   </div>
                   <div>
                      <label className={labelClass}>Credit Limit ($) <span className="text-red-500">*</span></label>
                      <input 
                         type="number" 
                         value={creditLimitInput}
                         onChange={(e) => {
                            setCreditLimitInput(e.target.value);
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) setCreditLimit(val);
                         }}
                         disabled={isViewOnly} 
                         className={cn(inputClass, "font-mono font-bold text-[#428bca]")} 
                         placeholder="10000.00" 
                      />
                      <p className="text-[9px] text-zinc-400 font-bold italic mt-1">Configure credit limitation parameters directly assigned for this customer account.</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* COMBINED CONNECTION, PROTOCOL & ADVANCED SETTINGS */}
        {trunkType === 'Customer' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
          <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
                <Server className="w-4 h-4 text-[#428bca]" /> CONNECTION, SMPP PROTOCOL & ADVANCED SETTINGS
              </h4>
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Unified configuration center managing connection variables, SMPP settings and protocol triggers</p>
            </div>
            <div className="flex bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-700/50">
              {['connection', 'smpp', 'advanced'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTrunkTab(tab)}
                  className={cn(
                    "px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md transition-all",
                    activeTrunkTab === tab
                      ? "bg-white dark:bg-zinc-900 text-[#428bca] shadow-xs"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
                  )}
                >
                  {tab === 'connection' ? '1. Link Credentials' : tab === 'smpp' ? '2. SMPP Protocol' : '3. Advanced Flows'}
                </button>
              ))}
            </div>
          </div>

          <div>
            {activeTrunkTab === 'connection' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Host <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue="15.234.1.33" disabled={isViewOnly} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Port <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue="2775" disabled={isViewOnly} className={inputClass} />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Username <span className="text-red-500">*</span></label>
                    <input type="text" defaultValue={data?.user || data?.username || "Digiwhilff_DIR_IN"} disabled={isViewOnly} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                    <input type="password" defaultValue="********" disabled={isViewOnly} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {activeTrunkTab === 'smpp' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Dest TON</label>
                      <select disabled={isViewOnly} className={inputClass} defaultValue="1">
                        <option value="1">International (1)</option>
                        <option value="2">National (2)</option>
                        <option value="5">Alphanumeric (5)</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Dest NPI</label>
                      <select disabled={isViewOnly} className={inputClass} defaultValue="1">
                        <option value="1">ISDN (1)</option>
                        <option value="0">Unknown (0)</option>
                      </select>
                    </div>
                  </div>
                  {isViewOnly && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Data Coding</label>
                        <input type="text" defaultValue="0" disabled className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>ESM Class</label>
                        <input type="text" defaultValue="0" disabled className={inputClass} />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Source TON / NPI</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select disabled={isViewOnly} className={inputClass} defaultValue="5">
                        <option value="5">Alpha (5)</option>
                        <option value="1">Intl (1)</option>
                      </select>
                      <select disabled={isViewOnly} className={inputClass} defaultValue="0">
                        <option value="0">Unknown (0)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>System Type</label>
                    <input type="text" placeholder="e.g. smpp" disabled={isViewOnly} className={inputClass} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Enquire Link (sec)</label>
                      <input type="number" defaultValue="30" disabled={isViewOnly} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Timeout (ms)</label>
                      <input type="number" defaultValue="3000" disabled={isViewOnly} className={inputClass} />
                    </div>
                  </div>
                  {isViewOnly && (
                    <div>
                      <label className={labelClass}>Bind Status</label>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200/50 inline-block mt-1">
                        Connected & Bound
                      </span>
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>DLR Notification URL (HTTP)</label>
                    <input type="text" placeholder="https://..." disabled={isViewOnly} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Sender ID (Overwrite)</label>
                    <input type="text" placeholder="Force Sender ID" disabled={isViewOnly} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {activeTrunkTab === 'advanced' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left animate-in fade-in duration-300">
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Default Coding</label>
                    <select disabled={isViewOnly} className={inputClass} defaultValue="GSM 7bit">
                      <option>GSM 7bit (0)</option>
                      <option>Unicode UCS2 (8)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>DLR Receipt Format</label>
                    <select disabled={isViewOnly} className={inputClass} defaultValue="Format 1">
                      <option>Standard Header (Format 1)</option>
                      <option>Brief Format (Format 2)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  {[
                    'Enable Loop Detection',
                    'Auto-Whitelisting of Numbers',
                    'Convert International to National',
                    'Support Multiple Binds'
                  ].map(item => (
                    <label key={item} className="flex items-center justify-between p-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-tighter">{item}</span>
                      <input type="checkbox" disabled={isViewOnly} className="w-4 h-4 rounded" />
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {/* NEGATIVE MARGIN CONTROL */}
        {trunkType === 'Customer' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm overflow-hidden text-left">
            <h4 className={sectionTitleClass}>
              <TrendingDown className="w-4 h-4 text-red-500" /> NEGATIVE MARGIN CONTROL
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-50/10 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-red-600 uppercase tracking-widest">Enable Anti-Loss Guard</span>
                    <p className="text-[9px] text-zinc-400 font-bold leading-tight">Automatically block routes if buying price &gt; selling price</p>
                  </div>
                  <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out">
                    <input type="checkbox" defaultChecked disabled={isViewOnly} className="opacity-0 w-0 h-0 peer" id="loss-guard" />
                    <label htmlFor="loss-guard" className="absolute top-0 left-0 right-0 bottom-0 bg-zinc-200 dark:bg-zinc-800 rounded-full cursor-pointer before:content-[''] before:absolute before:h-4 before:w-4 before:left-0.5 before:bottom-0.5 before:bg-white before:rounded-full before:transition before:duration-200 peer-checked:bg-red-600 peer-checked:before:translate-x-5"></label>
                  </div>
                </div>

                <div>
                   <label className={labelClass}>Tolerance Margin ($)</label>
                   <input type="number" step="0.00001" defaultValue="0.00000" disabled={isViewOnly} className={inputClass} placeholder="Allow minimal loss up to..." />
                   <p className="text-[9px] text-zinc-400 mt-1 font-bold italic">Example: 0.00001 allows loss within this range before blocking.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                   <label className={labelClass}>Negative Margin Action</label>
                   <select disabled={isViewOnly} className={inputClass}>
                      <option value="BLOCK">Block Traffic Immediately</option>
                      <option value="ALERT">Alert Only (NOC Warning)</option>
                      <option value="REDIRECT">Redirect to Backup Route</option>
                   </select>
                </div>
                
                <div className="flex items-center gap-2 pt-4">
                  <input type="checkbox" defaultChecked disabled={isViewOnly} className="w-3.5 h-3.5 rounded border-zinc-300" />
                  <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">Auto-Disable Low Margin Routes after 3 consecutive failures</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY & IP WHITELISTING */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm">
          <h4 className={sectionTitleClass}>SECURITY & IP WHITELISTING</h4>
          <div className="space-y-4">
             <div>
                <label className={labelClass}>Whitelisted IP Addresses (one per line)</label>
                <textarea 
                  rows={3} 
                  disabled={isViewOnly} 
                  className={cn(inputClass, "h-auto py-2 font-mono")} 
                  placeholder="127.0.0.1&#10;192.168.1.1"
                  defaultValue={trunkType === 'Vendor' ? '15.234.1.33' : ''}
                />
             </div>
             <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">
                  <input type="checkbox" disabled={isViewOnly} defaultChecked className="w-4 h-4 rounded border-zinc-300" /> Use SSL/TLS for connection
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">
                  <input type="checkbox" disabled={isViewOnly} className="w-4 h-4 rounded border-zinc-300" /> Bind with IP Masking
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-[10px] font-black text-zinc-600 dark:text-zinc-400 uppercase">
                  <input type="checkbox" disabled={isViewOnly} defaultChecked className="w-4 h-4 rounded border-zinc-300" /> Validate Sender ID
                </label>
             </div>
          </div>
        </div>

        {/* EMAIL AUTOMATION & INGESTION BLOCK */}
        {trunkType === 'Vendor' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm overflow-hidden text-left animate-in fade-in duration-350">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-col">
                <h4 className="text-[12px] font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-500" /> EMAIL-TO-RATE AUTOMATED INGESTION (AI SHEET PARSER)
                </h4>
                <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Configure automatic buying rate synchronization derived from supplier emails and attachments</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[8px] font-black rounded uppercase tracking-wider">
                AUTO-ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between pb-1">
                    <label className={labelClass}>From Supplier Email Address <span className="text-red-500">*</span></label>
                    <span className="text-[8px] font-black text-[#428bca] uppercase tracking-tighter">Wildcard domains supported</span>
                  </div>
                  <input 
                    type="text" 
                    defaultValue="rates@breelink-global.com" 
                    placeholder="e.g. rates@supplier-domain.com" 
                    className={cn(inputClass, "font-mono font-bold text-blue-600 dark:text-blue-400")} 
                    disabled={isViewOnly}
                  />
                  <p className="text-[9px] text-zinc-400 font-bold italic mt-1">The secure inbox will only accept rate updates arriving from this specific address</p>
                </div>

                <div>
                  <label className={labelClass}>Email Subject Line Pattern Match <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    defaultValue="Rate Change Notification - *" 
                    placeholder="e.g. Rate Change Notification*" 
                    className={cn(inputClass, "font-regular")} 
                    disabled={isViewOnly}
                  />
                  <p className="text-[9px] text-zinc-400 font-bold italic mt-1">Uses pattern mapping. Matches subjects like 'Rate Change Notification - May 2026'</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Attachment Detection Mode</label>
                    <select className={inputClass} defaultValue="AUTO_FIRST" disabled={isViewOnly}>
                      <option value="AUTO_FIRST">Auto-Download First File</option>
                      <option value="EXCEL_ONLY">Excel sheets (.xlsx, .xls) only</option>
                      <option value="CSV_ONLY">CSV files (.csv) only</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Disaster Guard Action</label>
                    <select className={inputClass} defaultValue="BLOCK_SPIKE_50" disabled={isViewOnly}>
                      <option value="BLOCK_SPIKE_50">Block if price spike &gt; 50%</option>
                      <option value="MANUAL_REVIEW">Queue All for Manual Approval</option>
                      <option value="LOG_ONLY">Over-write and log output</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
                  <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block mb-2">Live Parser Engine Status</span>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-1.5 border-b border-zinc-200/30 dark:border-zinc-800">
                      <span className="text-zinc-500">Inbox Monitoring:</span>
                      <span className="font-extrabold text-emerald-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> SCANNING INBOX
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-zinc-200/30 dark:border-zinc-800">
                      <span className="text-zinc-500">Last Attachment Fetched:</span>
                      <span className="font-mono text-[10px] text-zinc-700 dark:text-zinc-300">rates_breelink_row_202605.xlsx</span>
                    </div>
                    <div className="flex justify-between items-center pb-1.5 border-b border-zinc-200/30 dark:border-zinc-800">
                      <span className="text-zinc-500">Auto Ingestion Rate Count:</span>
                      <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md font-black font-mono">256 Routes Ingested</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Direct Account Assign:</span>
                      <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-md font-black font-mono">Digiwhiff_WHS_OUT</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Scanning Inbox Simulation:\n\n1. Found unread email from 'rates@breelink-global.com'\n2. Subject matched: 'Rate Change Notification - May 2026'\n3. Downloaded Excel attachment 'rates_breelink_row_202605.xlsx' automatically!\n4. Scanned and parsed 256 MCCMNC rates.\n5. Rates modified successfully and assigned directly to 'Digiwhiff_WHS_OUT' of Breelink Europe.");
                    }}
                    className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest rounded-lg shadow transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Test Inbox Connection & Scan
                  </button>
                </div>

                <div className="text-[9px] text-zinc-400 bg-zinc-950 p-3 rounded-lg border border-white/5 space-y-1.5">
                  <div className="font-black text-zinc-500 uppercase flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Recent Automated modification logs</div>
                  <div className="font-mono text-zinc-400 tracking-tighter truncate">✔ [May 20, 05:14] Match: 'rates@breelink-global.com' {"->"} Sheet parsed {"->"} 256 rates modified.</div>
                  <div className="font-mono text-zinc-500 tracking-tighter truncate">✔ [May 17, 12:44] Match: 'rates@breelink-global.com' {"->"} Sheet parsed {"->"} 118 rates modified.</div>
                </div>
              </div>
            </div>
          </div>
        )}
          </>
        )}

        {/* VENDOR OPTIONS TABS PARTS (SENDING, SMPP, ADVANCED, COMMITMENT) */}
        {trunkType === 'Vendor' && activeVendorTab === 'SENDING' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
                <Play className="w-4 h-4 text-[#428bca]" /> SENDING SETTINGS
              </h4>
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Configure binding modes, identity identification registers and autonomous initialization triggers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Bind Mode <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-3 gap-2">
                  {['Transmitter', 'Receiver', 'Transceiver'].map((mode) => (
                    <button
                      type="button"
                      key={mode}
                      onClick={() => setVendorBindMode(mode)}
                      className={cn(
                        "py-2 px-3 text-[10px] font-black uppercase rounded-lg border transition-all",
                        vendorBindMode === mode
                          ? "bg-[#428bca] text-white border-[#428bca]"
                          : "bg-white dark:bg-zinc-805 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>System Type</label>
                <input
                  type="text"
                  value={vendorSystemType}
                  onChange={(e) => setVendorSystemType(e.target.value)}
                  placeholder="e.g. SMPP"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Default Source TON</label>
                <select
                  value={vendorSourceTon}
                  onChange={(e) => setVendorSourceTon(e.target.value)}
                  className={inputClass}
                >
                  <option value="0">0 - Unknown</option>
                  <option value="1">1 - International</option>
                  <option value="2">2 - National</option>
                  <option value="5">5 - Alphanumeric</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Default Source NPI</label>
                <select
                  value={vendorSourceNpi}
                  onChange={(e) => setVendorSourceNpi(e.target.value)}
                  className={inputClass}
                >
                  <option value="0">0 - Unknown</option>
                  <option value="1">1 - ISDN/E.164</option>
                  <option value="3">3 - Data</option>
                  <option value="8">8 - National</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Default Dest TON</label>
                <select
                  value={vendorDestTon}
                  onChange={(e) => setVendorDestTon(e.target.value)}
                  className={inputClass}
                >
                  <option value="0">0 - Unknown</option>
                  <option value="1">1 - International</option>
                  <option value="2">2 - National</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Default Dest NPI</label>
                <select
                  value={vendorDestNpi}
                  onChange={(e) => setVendorDestNpi(e.target.value)}
                  className={inputClass}
                >
                  <option value="0">0 - Unknown</option>
                  <option value="1">1 - ISDN/E.164</option>
                </select>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <label className={labelClass}>Auto Start Connection Bind</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-200">
                  <input
                    type="radio"
                    name="vendorAutoStartBind"
                    checked={vendorAutoStart}
                    onChange={() => setVendorAutoStart(true)}
                    className="w-4 h-4 text-[#428bca]"
                  />
                  <span>Automatically Start on instance daemon boots</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-zinc-400">
                  <input
                    type="radio"
                    name="vendorAutoStartBind"
                    checked={!vendorAutoStart}
                    onChange={() => setVendorAutoStart(false)}
                    className="w-4 h-4 text-[#428bca]"
                  />
                  <span>Manual start only via CLI/Dashboard</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {trunkType === 'Vendor' && activeVendorTab === 'SMPP' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
                <Server className="w-4 h-4 text-[#428bca]" /> SMPP SETTINGS
              </h4>
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Set raw host endpoints, firewall rules, credentials and service identifiers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className={labelClass}>Host URL/IP Address <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={vendorHostUrl}
                  onChange={(e) => setVendorHostUrl(e.target.value)}
                  placeholder="smpp.vendor-gateway.net or 192.168.10.4"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Port Number <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={vendorPort}
                  onChange={(e) => setVendorPort(e.target.value)}
                  placeholder="2775"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>SMPP Username (System ID) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={vendorUsername}
                  onChange={(e) => setVendorUsername(e.target.value)}
                  placeholder="Enter Username"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>SMPP Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={vendorPassword}
                  onChange={(e) => setVendorPassword(e.target.value)}
                  placeholder="●●●●●●●●●"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        {trunkType === 'Vendor' && activeVendorTab === 'ADVANCED_SMPP' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#428bca]" /> ADVANCED SMPP SETTINGS
              </h4>
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Configure transaction buffers, keep-alive links and speed limits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Window Size <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={vendorWindowSize}
                  onChange={(e) => setVendorWindowSize(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[8px] text-zinc-400 mt-1 uppercase leading-tight">outstanding unacknowledged links</p>
              </div>

              <div>
                <label className={labelClass}>Enquire Link (Secs)</label>
                <input
                  type="number"
                  value={vendorEnquireLink}
                  onChange={(e) => setVendorEnquireLink(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[8px] text-zinc-400 mt-1 uppercase leading-tight">Keep alive signal delay</p>
              </div>

              <div>
                <label className={labelClass}>Response Timeout (ms)</label>
                <input
                  type="number"
                  value={vendorResponseTimeout}
                  onChange={(e) => setVendorResponseTimeout(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[8px] text-zinc-400 mt-1 uppercase leading-tight">Failure socket drop timer</p>
              </div>

              <div>
                <label className={labelClass}>Reconnect Delay (Secs)</label>
                <input
                  type="number"
                  value={vendorReconnectDelay}
                  onChange={(e) => setVendorReconnectDelay(e.target.value)}
                  className={inputClass}
                />
                <p className="text-[8px] text-zinc-400 mt-1 uppercase leading-tight">Socket cool-down retry rule</p>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
              <label className={labelClass}>Transaction Throttle Limit (TPS)</label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  value={vendorThrottleLimit}
                  onChange={(e) => setVendorThrottleLimit(e.target.value)}
                  className={cn(inputClass, "w-40 font-mono font-bold text-[#428bca]")}
                />
                <span className="text-[10px] text-zinc-400 uppercase font-bold">Max Transactions Per Second permitted on this bind</span>
              </div>
            </div>
          </div>
        )}

        {trunkType === 'Vendor' && activeVendorTab === 'COMMITMENT' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
            <div>
              <h4 className="text-[12px] font-black uppercase text-[#428bca] tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#428bca]" /> COMMITMENT & VOLUME CLAUSES
              </h4>
              <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">Configure minimum volumes and shortcount fallback triggers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Commitment Rule Profile <span className="text-red-500">*</span></label>
                <select
                  value={vendorCommitmentRule}
                  onChange={(e) => setVendorCommitmentRule(e.target.value)}
                  className={inputClass}
                >
                  <option value="NONE">No Commitment Clause</option>
                  <option value="DAILY_VOLUME">Daily Committed Volume Required</option>
                  <option value="MONTLY_CLAUSE">Monthly Tiered Shortage Penalty</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Committed Volume Target (SMS)</label>
                <input
                  type="number"
                  value={vendorCommitmentTarget}
                  onChange={(e) => setVendorCommitmentTarget(e.target.value)}
                  disabled={vendorCommitmentRule === 'NONE'}
                  className={inputClass}
                  placeholder="0"
                />
              </div>

              <div>
                <label className={labelClass}>Penalty Flat-Rate per missed SMS ($)</label>
                <input
                  type="text"
                  value={vendorCommitmentPenalty}
                  onChange={(e) => setVendorCommitmentPenalty(e.target.value)}
                  disabled={vendorCommitmentRule === 'NONE'}
                  className={cn(inputClass, "font-mono")}
                  placeholder="e.g. 0.001"
                />
              </div>
            </div>
          </div>
        )}

        {/* CONTACT PERSONS for Trunk View */}
        {isViewOnly && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm overflow-hidden text-left">
            <h4 className={sectionTitleClass}>CONTACT PERSONS</h4>
            {renderEnterpriseContacts()}
          </div>
        )}

        {/* BILLING & FINANCIAL DETAILS for Trunk View */}
        {isViewOnly && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 shadow-sm overflow-hidden text-left space-y-8">
            <h4 className={sectionTitleClass}>BILLING & FINANCIAL DETAILS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b pb-1 mb-2">Usage Metrics</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{trunkType === 'Customer' ? 'Master Credit Limit:' : 'Credit Limit:'}</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                     {trunkType === 'Customer' ? `$${creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$5,000.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">{trunkType === 'Customer' ? 'Master Shared Balance:' : 'Available Balance:'}</span>
                  <span className="font-bold text-emerald-600 font-mono">
                     {trunkType === 'Customer' ? `$${(creditLimit * 0.50).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '$2,342.15'}
                  </span>
                </div>
                {trunkType === 'Customer' && (
                  <div className="flex justify-between items-center text-xs text-rose-500 font-bold border-t border-dashed border-rose-100 dark:border-rose-900/30 pt-1.5 mt-1.5">
                    <span className="text-[10px] uppercase text-rose-450">Trunk Credit Used:</span>
                    <span className="font-mono">${(creditLimit * 0.32).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Currency:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">USD</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b pb-1 mb-2">Billing Cycle</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Cycle Type:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Weekly (Mon-Sun)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Net Terms:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Net 7</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Last Invoice:</span>
                  <span className="font-bold text-blue-500 hover:underline cursor-pointer">INV-2024-05-01</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b pb-1 mb-2">Commission & Tax</div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Tax Basis:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">Exempt</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Admin Charge:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">$0.00</span>
                </div>
              </div>
            </div>

            {/* INVOICE HISTORY TABLE - LAST 1 YEAR */}
            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
               <div className="flex justify-between items-center mb-4">
                 <h5 className="text-[10px] font-black uppercase text-[#428bca] tracking-[0.2em]">{trunkType === 'Vendor' ? 'Vendor Invoice History (Last 1 Year)' : 'Customer Invoice History (Last 1 Year)'}</h5>
                 <button className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase hover:text-[#428bca] transition-colors">
                    <Download className="w-3 h-3" /> Export Statement
                 </button>
               </div>
               <div className="overflow-x-auto rounded-xl border border-zinc-100 dark:border-zinc-800">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                       <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Inv No.</th>
                       <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Inv Date</th>
                       <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Amount</th>
                       <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                       {trunkType === 'Vendor' ? (
                         <>
                           <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Currency</th>
                           <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Pending Amount (Currency)</th>
                         </>
                       ) : (
                         <>
                           <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Mode of Payment</th>
                           <th className="px-4 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Remaining Amount</th>
                         </>
                       )}
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                     {trunkType === 'Vendor' ? [
                       { invNo: 'INV-V-2024-001', date: '2024-04-15', amount: '1250.00', status: 'Paid', currency: 'USD', pending: '0.00 (USD)' },
                       { invNo: 'INV-V-2024-045', date: '2024-03-01', amount: '2100.00', status: 'Paid', currency: 'USD', pending: '0.00 (USD)' },
                       { invNo: 'INV-V-2024-089', date: '2024-02-10', amount: '1850.00', status: 'Pending', currency: 'USD', pending: '1850.00 (USD)' },
                       { invNo: 'INV-V-2024-112', date: '2024-01-05', amount: '950.00', status: 'Paid', currency: 'USD', pending: '0.00 (USD)' }
                     ].map((inv, i) => (
                       <tr key={i} className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-colors">
                         <td className="px-4 py-3 font-mono text-blue-500 cursor-pointer hover:underline" onClick={() => {
                            setSelectedInvoice({ ...inv, vendorName: 'Digiwhiff_WHS_OUT', account: 'BREELINK_EUR' });
                            setShowInvoiceDetail(true);
                         }}>{inv.invNo}</td>
                         <td className="px-4 py-3">{inv.date}</td>
                         <td className="px-4 py-3">${inv.amount}</td>
                         <td className="px-4 py-3">
                           <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", 
                             inv.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                           )}>{inv.status}</span>
                         </td>
                         <td className="px-4 py-3">{inv.currency}</td>
                         <td className="px-4 py-3 text-[#428bca] font-mono">{inv.pending}</td>
                       </tr>
                     )) : [
                       { invNo: 'INV-C-2024-101', date: '2024-04-20', amount: '3400.00', status: 'Paid', mode: 'Wire Transfer', remaining: '0.00' },
                       { invNo: 'INV-C-2024-156', date: '2024-03-15', amount: '2800.00', status: 'Paid', mode: 'Credit Card', remaining: '0.00' },
                       { invNo: 'INV-C-2024-210', date: '2024-02-25', amount: '4100.00', status: 'Pending', mode: 'N/A', remaining: '4100.00' },
                       { invNo: 'INV-C-2024-305', date: '2024-01-12', amount: '3200.00', status: 'Paid', mode: 'Wallet', remaining: '0.00' }
                     ].map((inv, i) => (
                       <tr key={i} className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 transition-colors">
                         <td className="px-4 py-3 font-mono text-blue-500 cursor-pointer hover:underline" onClick={() => {
                            setSelectedInvoice({ ...inv, customerName: 'Digiwhilff_DIR_IN', account: 'ABC_DIR_IN' });
                            setShowInvoiceDetail(true);
                         }}>{inv.invNo}</td>
                         <td className="px-4 py-3">{inv.date}</td>
                         <td className="px-4 py-3">${inv.amount}</td>
                         <td className="px-4 py-3">
                           <span className={cn("px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest", 
                             inv.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                           )}>{inv.status}</span>
                         </td>
                         <td className="px-4 py-3 font-black text-zinc-400 uppercase tracking-tighter">{inv.mode}</td>
                         <td className="px-4 py-3 text-emerald-600 font-mono">${inv.remaining}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        )}

        {/* DETAILS MODAL SECTION */}
        {showRateDetails && (
           <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
               <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRateDetails(false)} />
               <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
                  <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex items-center justify-between">
                      <div className="flex flex-col">
                        <h3 className="text-[12px] font-black uppercase tracking-widest flex items-center gap-2">
                             <List className="w-5 h-5 mr-1" /> 
                             {rateViewType === 'customer' ? 'Customer Rate Table (Selling Price)' : 'Product Routing & Pricing Detail'}
                        </h3>
                        <p className="text-[10px] font-bold opacity-80 uppercase mt-0.5 ml-7">
                          {rateViewType === 'customer' 
                            ? `Price List: ${selectedProduct?.rateTable}` 
                            : `Product Configuration: ${selectedProduct?.name}`}
                        </p>
                      </div>
                      <button onClick={() => setShowRateDetails(false)} className="hover:rotate-90 transition-all p-2 hover:bg-white/10 rounded-full">
                        <X className="w-6 h-6" />
                      </button>
                  </div>

                  <div className="flex border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                  <div className="p-4 border-r border-zinc-100 dark:border-zinc-800 w-1/2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest block mb-2">Select {rateViewType === 'customer' ? 'Rate Table' : 'Product'}</label>
                    <div className="relative">
                      <select 
                        className="w-full h-10 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold focus:border-[#428bca] outline-none"
                        value={localSelection}
                        onChange={(e) => setLocalSelection(e.target.value)}
                      >
                        <option value="">Select Option...</option>
                        {(rateViewType === 'customer' ? rateTableOptions[accountCategory as keyof typeof rateTableOptions] : productOptions[accountCategory as keyof typeof productOptions])?.map(curr => (
                           <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                      {!localSelection && (
                        <div className="absolute inset-x-0 top-12 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded text-[10px] text-amber-600 font-bold uppercase tracking-tighter">
                          Please select an option to view details & pricing
                        </div>
                      )}
                    </div>
                  </div>
                  {localSelection && (
                    <div className="p-4 flex items-center justify-between flex-1 animate-in slide-in-from-left-4 duration-300">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Active Selection</span>
                          <span className="text-sm font-black text-[#428bca] tracking-tight">{localSelection}</span>
                       </div>
                       <button 
                         onClick={() => {
                           if (rateViewType === 'customer') setAssignedRateTable(localSelection);
                           else setAssignedProduct(localSelection);
                           setShowRateDetails(false);
                         }}
                         className="px-6 py-2 bg-[#5cb85c] text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center gap-2"
                       >
                         <CheckCircle2 className="w-4 h-4" /> Assign This {rateViewType === 'customer' ? 'Table' : 'Product'}
                       </button>
                    </div>
                  )}
                </div>

                <div className="p-6 overflow-auto bg-white dark:bg-zinc-900">
                  {!localSelection ? (
                    <div className="py-20 flex flex-col items-center justify-center text-zinc-300 gap-4 opacity-50">
                       <Database className="w-16 h-16" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em]">{rateViewType === 'customer' ? 'Customer Rate Table' : 'Product Assignment'} Data Preview</span>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                           <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Pricing Plan</div>
                              <div className="text-xs font-black text-zinc-700 dark:text-zinc-200">Wholesale {accountCategory}</div>
                           </div>
                           <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                              <div className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Total Destinations</div>
                              <div className="text-xs font-black text-zinc-700 dark:text-zinc-200">242 Countries</div>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-500 hover:text-[#428bca] transition-colors"><Search className="w-4 h-4" /></button>
                           <button className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-500 hover:text-[#428bca] transition-colors"><Download className="w-4 h-4" /></button>
                        </div>
                      </div>

                      <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-[#f8f9fa] dark:bg-zinc-800/80 border-b border-zinc-100 dark:border-zinc-800 backdrop-blur-sm sticky top-0">
                            <tr>
                              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Region / Country</th>
                              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">MCCMNC</th>
                              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Prefix</th>
                              <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Selling Price</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                            {[
                              { region: 'USA', mccmnc: '310-020', prefix: '1', price: '0.00550', operator: 'T-Mobile' },
                              { region: 'USA', mccmnc: '310-410', prefix: '1', price: '0.00580', operator: 'AT&T' },
                              { region: 'UK', mccmnc: '234-10', prefix: '44', price: '0.00920', operator: 'O2' },
                              { region: 'India', mccmnc: '404-01', prefix: '91', price: '0.01250', operator: 'Airtel' },
                              { region: 'UAE', mccmnc: '424-02', prefix: '971Standard', price: '0.02400', operator: 'Etisalat' },
                            ].map((row, i) => (
                              <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="flex flex-col">
                                      <span className="text-xs font-black text-zinc-700 dark:text-zinc-200">{row.region}</span>
                                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{row.operator}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs text-zinc-500">{row.mccmnc}</td>
                                <td className="px-6 py-4 font-mono text-xs text-zinc-500">+{row.prefix}</td>
                                <td className="px-6 py-4 text-right">
                                   <span className="text-xs font-black text-emerald-600 font-mono tracking-tight tabular-nums">${row.price}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
                      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-4 rounded-lg mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                             <Search className="w-5 h-5" />
                          </div>
                          <div>
                             <h5 className="text-[11px] font-black uppercase text-blue-800 dark:text-blue-300">Quick Data Lookup</h5>
                             <p className="text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70">Search across millions of routing paths and pricing nodes</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="h-9 px-4 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
                                <RotateCcw className="w-3.5 h-3.5" /> Refresh
                            </button>
                            <button className="h-9 px-4 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm hover:bg-zinc-50 transition-all flex items-center gap-2">
                                <Download className="w-3.5 h-3.5" /> Export Data
                            </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                          <div className="relative flex-1">
                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                             <input type="text" className="h-10 w-full pl-10 pr-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 outline-none rounded-xl text-[12px] font-bold focus:border-[#428bca] focus:bg-white transition-all" placeholder="Filter by Country, MCC-MNC, Network or Supplier..." />
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 whitespace-nowrap">
                             Showing 1-10 of 1,245 Nodes
                          </div>
                      </div>

                      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden bg-white dark:bg-zinc-950">
                          <table className="w-full text-left border-collapse">
                              <thead className="bg-[#f8f9fa] dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                                  <tr>
                                      {rateViewType === 'customer' ? (
                                        <>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Country</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">MCC-MNC</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Active Node</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Account Ref</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Category</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800 text-right">Selling Price</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Admin</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Update Time</th>
                                        </>
                                      ) : rateViewType === 'vendor-account' ? (
                                        <>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Country</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">MCC-MNC</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-[#d9534f] uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800 text-right">Buying Price</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Last Updated Time</th>
                                        </>
                                      ) : (
                                        <>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Country</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">MCC-MNC</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Active Supplier</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Account</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-[#428bca] uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800">Category</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-[#d9534f] uppercase tracking-widest border-r border-zinc-100 dark:border-zinc-800 text-right">Buying Price</th>
                                          <th className="px-5 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Product Name</th>
                                        </>
                                      )}
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                   {rateViewType === 'customer' ? (
                                      [
                                        { country: 'American Samoa', mccmnc: '54411', supplier: 'Aircel_IN', account: 'Aircel_Direct', category: 'SMS_PREMIUM', price: '0.4200', user: 'admin', time: '2026-05-01 10:20' },
                                        { country: 'Andorra', mccmnc: '213', supplier: 'T-Mobile_US', account: 'TM_Premium', category: 'SMS_PREMIUM', price: '0.3800', user: 'admin', time: '2026-04-28 15:45' },
                                        { country: 'India', mccmnc: '40410', supplier: 'AIRTEL_IN', account: 'Airtel_WHS', category: 'SMS_PREMIUM', price: '0.0055', user: 'system', time: '2026-05-05 09:12' }
                                      ].map((row, i) => (
                                        <tr key={i} className="text-[12px] hover:bg-blue-50/30 dark:hover:bg-blue-900/5 transition-colors border-b border-zinc-100 dark:border-zinc-800">
                                          <td className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-50 dark:border-zinc-800/50">{row.country}</td>
                                          <td className="px-5 py-4 font-mono border-r border-zinc-50 dark:border-zinc-800/50 text-zinc-400 font-bold">{row.mccmnc}</td>
                                          <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400 border-r border-zinc-50 dark:border-zinc-800/50 font-bold">{row.supplier}</td>
                                          <td className="px-5 py-4 text-zinc-500 border-r border-zinc-50 dark:border-zinc-800/50 uppercase tracking-tighter text-[10px] font-black">{row.account}</td>
                                          <td className="px-5 py-4 font-black text-[#428bca] border-r border-zinc-50 dark:border-zinc-800/50 bg-blue-50/20 dark:bg-blue-500/5">{row.category}</td>
                                          <td className="px-5 py-4 font-mono font-black text-emerald-600 border-r border-zinc-50 dark:border-zinc-800/50 text-right">€{row.price}</td>
                                          <td className="px-5 py-4 font-bold text-zinc-500 border-r border-zinc-50 dark:border-zinc-800/50">{row.user}</td>
                                          <td className="px-5 py-4 font-bold text-zinc-400 font-mono text-[10px]">{row.time}</td>
                                        </tr>
                                      ))
                                   ) : rateViewType === 'vendor-account' ? (
                                      [
                                        { country: 'India', mccmnc: '404-10', price: '0.0035', time: '2026-05-05 14:20' },
                                        { country: 'USA', mccmnc: '310', price: '0.0088', time: '2026-05-06 11:30' },
                                        { country: 'UK', mccmnc: '234', price: '0.0125', time: '2026-05-07 09:15' }
                                      ].map((row, i) => (
                                        <tr key={i} className="text-[12px] hover:bg-red-50/30 dark:hover:bg-red-900/5 transition-colors border-b border-zinc-100 dark:border-zinc-800">
                                          <td className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-50 dark:border-zinc-800/50">{row.country}</td>
                                          <td className="px-5 py-4 font-mono border-r border-zinc-50 dark:border-zinc-800/50 text-zinc-400 font-bold">{row.mccmnc}</td>
                                          <td className="px-5 py-4 font-mono font-black text-[#d9534f] border-r border-zinc-50 dark:border-zinc-800/50 text-right">${row.price}</td>
                                          <td className="px-5 py-4 font-bold text-zinc-400 font-mono text-xs">{row.time}</td>
                                        </tr>
                                      ))
                                   ) : (
                                      [
                                        { country: 'India', mccmnc: '404-10', supplier: 'Aircel_IN', account: 'Aircel_Direct', category: 'SMS_PREMIUM', name: 'Premium_IN', price: '0.0035' },
                                        { country: 'USA', mccmnc: '310', supplier: 'T-Mobile_US', account: 'TM_Premium', category: 'SMS_PREMIUM', name: 'Wholesale_US', price: '0.0088' },
                                        { country: 'UK', mccmnc: '234', supplier: 'VODAFONE_UK', account: 'Voda_WHS', category: 'SMS_DIRECT', name: 'Direct_UK', price: '0.0125' }
                                      ].map((row, i) => (
                                        <tr key={i} className="text-[12px] hover:bg-red-50/30 dark:hover:bg-red-900/5 transition-colors border-b border-zinc-100 dark:border-zinc-800">
                                          <td className="px-5 py-4 font-bold text-zinc-900 dark:text-zinc-100 border-r border-zinc-50 dark:border-zinc-800/50">{row.country}</td>
                                          <td className="px-5 py-4 font-mono border-r border-zinc-50 dark:border-zinc-800/50 text-zinc-400 font-bold">{row.mccmnc}</td>
                                          <td className="px-5 py-4 font-bold text-zinc-600 dark:text-zinc-400 border-r border-zinc-50 dark:border-zinc-800/50">{row.supplier}</td>
                                          <td className="px-5 py-4 text-zinc-500 border-r border-zinc-50 dark:border-zinc-800/50 text-[10px] uppercase font-black">{row.account}</td>
                                          <td className="px-5 py-4 font-black text-[#428bca] border-r border-zinc-50 dark:border-zinc-800/50 bg-blue-50/20 dark:bg-blue-500/5">{row.category}</td>
                                          <td className="px-5 py-4 font-mono font-black text-[#d9534f] border-r border-zinc-50 dark:border-zinc-800/50 text-right">${row.price}</td>
                                          <td className="px-5 py-4 font-bold text-zinc-700 dark:text-zinc-300">{row.name}</td>
                                        </tr>
                                      ))
                                   )}
                              </tbody>
                          </table>
                      </div>
                  <div className="px-8 py-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
                      <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                         Teleoss Systems • Engine Version 4.2.1
                      </div>
                      <button onClick={() => setShowRateDetails(false)} className="px-10 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[12px] font-black uppercase tracking-widest rounded-xl shadow-xl hover:-translate-y-1 transition-all active:translate-y-0">Close Detail View</button>
                  </div>
               </div>
           </div>
        )}
      </div>
    );
  };


  const renderSendRateForm = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-blue-50/50 dark:bg-blue-500/5 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h4 className="text-[11px] font-black uppercase text-[#428bca] tracking-widest mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Send Rate Update
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Select Pricing Plan</label>
              <select className={inputClass} defaultValue="Wholesale Standard">
                <option>Wholesale Standard</option>
                <option>Direct Premium</option>
                <option>Custom Enterprise Plan</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Effective Date</label>
              <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Rate File Type</label>
              <div className="flex gap-4 pt-1">
                {['Excel', 'CSV', 'PDF'].map(fmt => (
                  <label key={fmt} className="flex items-center gap-2 text-[11px] font-bold text-zinc-600 cursor-pointer">
                    <input type="radio" name="fmt" defaultChecked={fmt==='Excel'} className="w-4 h-4" /> {fmt}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase">Apply Margin Override?</label>
              <div className="flex items-center gap-2">
                 <input type="checkbox" className="w-4 h-4 rounded" />
                 <input type="number" step="0.0001" placeholder="Margin (optional)" className={inputClass + " flex-1"} />
              </div>
            </div>
            <div className="space-y-3 p-4 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
               <span className="text-[10px] font-bold text-zinc-400 uppercase">Attachments included</span>
               <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-600">
                    <span>Full Rate Table.xlsx</span>
                    <span className="text-emerald-500 font-bold">Included</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium text-zinc-600">
                    <span>Difference Analysis.pdf</span>
                    <input type="checkbox" defaultChecked />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2">
            <Mail className="w-3 h-3" /> Email Notification Preview
          </h4>
          <span className="text-[9px] font-bold text-blue-500 uppercase">Format: HTML</span>
        </div>
        <div className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-800">
           <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-400 uppercase">Email Subject</label>
              <input type="text" defaultValue="Rate Update Notification - Effective [Date]" className={inputClass} />
           </div>
           <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-zinc-400 uppercase">Email Body</label>
              <textarea rows={8} className={cn(inputClass, "h-auto py-3 resize-none font-sans")} defaultValue={`Dear Valued Customer,

Please find the updated rates for your account attached to this email. Included in the file are the new pricing details which will be effective starting from [Effective Date].

If you have any questions regarding these changes, please contact your account manager.

Best Regards,
Wholesale Support Team`} />
           </div>
        </div>
      </div>
    </div>
  );

  if (hideTabs && !isViewOnly) {
    return (
      <div className="animate-in fade-in duration-300">
        {(title && title.includes('Send Rate')) ? renderSendRateForm() : type === 'Enterprise' ? renderEnterpriseForm() : renderTrunkForm(type === 'Customer' ? 'Customer' : 'Vendor')}
      </div>
    );
  }

  const renderPricingModal = () => {
    if (!showRateDetails) return null;

    const modalTitle = 'Routing & Pricing Details';
    const subTitle = `Manage ${selectedProduct?.name || 'Product'} Rules`;

    const handleUpdateRow = (idx: number, field: string, value: any) => {
      setModalRows(prev => {
        const next = [...prev];
        const row = { ...next[idx], [field]: value };
        
        if (field === 'supplierName') {
          const supplier = MOCK_SUPPLIERS_LIST.find(s => s.name === value);
          row.supplier = supplier?.accounts[0] || '';
          row.category = supplier?.category || '';
        }
        
        if (field === 'supplier') {
          // Dynamic buying price update simulation based on supplier selection
          row.buy = row.buy + (Math.random() * 0.001 - 0.0005);
        }

        next[idx] = row;
        return next;
      });
    };

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowRateDetails(false)} />
        <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300 text-left">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div>
                 <h3 className="text-sm font-black uppercase tracking-widest">{modalTitle}</h3>
                 <p className="text-[10px] opacity-80 font-bold uppercase mt-0.5">{subTitle}</p>
               </div>
               
               {/* CUSTOMER MASTER CREDIT LIMIT & USED LIMIT PRESENTATION */}
               <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-white/10 dark:bg-black/20 rounded-lg border border-white/15">
                 <span className="text-[9px] font-black uppercase tracking-widest text-zinc-100 shrink-0">Master Remaining Credit Limit:</span>
                 <span className="text-[11px] font-black font-mono text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded shadow-sm shrink-0">
                   ${(creditLimit - (creditLimit * 0.35)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </span>
                 <div className="w-px h-3.5 bg-white/20 mx-1 shrink-0" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-zinc-100 shrink-0">Account Used Credit (This Trunk):</span>
                 <span className="text-[11px] font-black font-mono text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded shadow-sm shrink-0">
                   ${(creditLimit * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </span>
               </div>
               {isViewOnly && (
                 <button 
                   onClick={() => setShowComparison(prev => !prev)}
                   className={cn(
                     "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                     showComparison ? "bg-brand-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                   )}
                 >
                   <RotateCcw className="w-3.5 h-3.5" />
                   {showComparison ? 'View Current Only' : 'Compare with Product Plan'}
                 </button>
               )}
               {!isViewOnly && (
                 <button 
                   onClick={() => setIsEditingRate(!isEditingRate)}
                   className={cn(
                     "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                     isEditingRate ? "bg-amber-500 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                   )}
                 >
                   <Edit2 className="w-3.5 h-3.5" />
                   {isEditingRate ? 'Finish Editing' : 'Edit Rate'}
                 </button>
               )}
            </div>
            <button onClick={() => setShowRateDetails(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 sticky top-0 z-10">
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Country</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">MCC-MNC</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Selling Price</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Buying Price</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Supplier Name</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Supplier Account</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Product Name</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category</th>
                  <th className="px-3 py-2 text-[10px] font-black text-rose-500 uppercase tracking-widest text-right">Last Price</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Net Margin</th>
                  <th className="px-3 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest border-l border-zinc-100 dark:border-zinc-800">Last Updated Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {modalRows.map((row, idx) => {
                  const netMargin = row.sell - row.buy;
                  const originalRow = productLevelData?.find((p: any) => p.country === row.country && p.mccmnc === row.mccmnc);
                  const isSalesPriceChanged = originalRow && originalRow.sell !== row.sell;
                  const isBuyingPriceChanged = originalRow && originalRow.buy !== row.buy;
                  const isSupplierChanged = originalRow && originalRow.supplier !== row.supplier;

                  return (
                    <tr key={row.id} className="text-[11px] font-bold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="px-3 py-2 uppercase">{row.country}</td>
                      <td className="px-3 py-2 font-mono text-zinc-400">{row.mccmnc}</td>
                      <td className="px-3 py-2">
                        {isEditingRate ? (
                          <div className="relative group">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400">$</span>
                            <input 
                              type="number" 
                              step="0.0001"
                              value={row.sell}
                              onChange={(e) => handleUpdateRow(idx, 'sell', parseFloat(e.target.value) || 0)}
                              className="w-20 pl-5 pr-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#428bca]/40 rounded text-[11px] font-black text-emerald-600 outline-none"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <span className={cn("font-mono text-emerald-600", isSalesPriceChanged && "text-amber-500 font-black underline decoration-dotted")}>
                              ${row.sell?.toFixed(4)}
                            </span>
                            {showComparison && originalRow && isSalesPriceChanged && (
                              <span className="text-[8px] text-zinc-400 font-normal italic">Product Plan: ${originalRow.sell.toFixed(4)}</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col">
                          <span className={cn("font-mono text-zinc-500", isBuyingPriceChanged && "text-rose-500 font-black")}>
                            ${row.buy?.toFixed(4)}
                          </span>
                          {showComparison && originalRow && isBuyingPriceChanged && (
                            <span className="text-[8px] text-zinc-400 font-normal italic">Product Plan: ${originalRow.buy.toFixed(4)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                         {isEditingRate ? (
                           <select 
                             value={row.supplierName}
                             onChange={(e) => handleUpdateRow(idx, 'supplierName', e.target.value)}
                             className="w-full px-2 py-0.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] outline-none"
                           >
                             {MOCK_SUPPLIERS_LIST.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                           </select>
                         ) : (
                           <div className="flex flex-col">
                              <span className={cn(isSupplierChanged && "text-amber-500")}>{row.supplierName}</span>
                              {showComparison && originalRow && isSupplierChanged && (
                                <span className="text-[8px] text-zinc-400 line-through">{originalRow.supplierName}</span>
                              )}
                           </div>
                         )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditingRate ? (
                          <select 
                            value={row.supplier}
                            onChange={(e) => handleUpdateRow(idx, 'supplier', e.target.value)}
                            className="w-full px-2 py-0.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] outline-none"
                          >
                            {(MOCK_SUPPLIERS_LIST.find(s => s.name === row.supplierName)?.accounts || []).map(acc => (
                              <option key={acc} value={acc}>{acc}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex flex-col">
                            <span className={cn("bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono text-[10px]", isSupplierChanged && "border-amber-500 border")}>
                              {row.supplier}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-zinc-400">{row.product}</td>
                      <td className="px-3 py-2">
                         <span className="text-[9px] font-black uppercase tracking-tighter bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">{row.category}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                         <span className="text-rose-500 font-black font-mono tracking-tight tabular-nums">${row.lastPrice?.toFixed(4) || '0.0000'}</span>
                      </td>
                      <td className={cn("px-3 py-2 text-right font-black", netMargin > 0 ? "text-blue-500" : "text-rose-500")}>
                        <div className="flex flex-col items-end">
                           <span>${netMargin.toFixed(4)}</span>
                           {showComparison && originalRow && originalRow.sell - originalRow.buy !== netMargin && (
                             <span className="text-[8px] text-zinc-400">Plan: ${(originalRow.sell - originalRow.buy).toFixed(4)}</span>
                           )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right border-l border-zinc-50 dark:border-zinc-800/50">
                        <span className="text-[10px] font-bold text-zinc-400 font-mono italic">{row.updateTime || '2026-05-18 10:00'}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 flex justify-between items-center">
            <div className="text-[10px] font-bold text-zinc-400 uppercase italic flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5" /> Margin analysis based on real-time routing selection
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRateDetails(false)} className="px-6 py-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all">Close</button>
              {isEditingRate && (
                <button onClick={() => setIsEditingRate(false)} className="px-6 py-2 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:bg-emerald-600 transition-all">Save Changes</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInvoiceDetailModal = () => {
    if (!selectedInvoice) return null;
    const isVendor = !!selectedInvoice.vendorName;
    const details = [
      { date: '2024-04-01', country: 'India', mccmnc: '404-10', usage: '520,400', price: isVendor ? '0.0042' : '0.0055' },
      { date: '2024-04-02', country: 'USA', mccmnc: '310-150', usage: '215,800', price: isVendor ? '0.0038' : '0.0048' },
      { date: '2024-04-03', country: 'UK', mccmnc: '234-10', usage: '185,200', price: isVendor ? '0.0055' : '0.0072' },
      { date: '2024-04-04', country: 'American Samoa', mccmnc: '544-11', usage: '95,400', price: isVendor ? '0.0062' : '0.0085' },
      { date: '2024-04-05', country: 'Andorra', mccmnc: '213-03', usage: '42,100', price: isVendor ? '0.0065' : '0.0088' },
    ];

    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-2xl" onClick={() => setShowInvoiceDetail(false)} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-8 py-6 border-b border-zinc-100 dark:border-zinc-800 bg-[#428bca] text-white flex justify-between items-center shrink-0">
            <div>
              <h3 className="text-lg font-black uppercase tracking-[0.2em]">INVOICE BREAKDOWN: {selectedInvoice.invNo}</h3>
              <p className="text-[11px] opacity-80 font-bold uppercase mt-1 flex items-center gap-2">
                <Users className="w-3 h-3" /> Account: <span className="bg-white/20 px-2 py-0.5 rounded">{selectedInvoice.account}</span> 
                <span className="opacity-40">|</span> 
                <Database className="w-3 h-3" /> Entity: <span className="bg-white/20 px-2 py-0.5 rounded">{isVendor ? selectedInvoice.vendorName : selectedInvoice.customerName}</span>
              </p>
            </div>
            <button onClick={() => setShowInvoiceDetail(false)} className="p-2 hover:bg-white/10 rounded-full transition-all hover:rotate-90">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-8 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Clock className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Billing Period Date</p>
                   <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">{selectedInvoice.date}</p>
                 </div>
               </div>
               <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Landmark className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Final Invoice Amount</p>
                   <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">${selectedInvoice.amount}</p>
                 </div>
               </div>
            </div>

            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <th className="px-3 py-2.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Transaction Date</th>
                    <th className="px-3 py-2.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Country Destination</th>
                    <th className="px-3 py-2.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">MCC-MNC Code</th>
                    <th className="px-3 py-2.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">SMS Volume / Usage</th>
                    <th className="px-3 py-2.5 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">{isVendor ? 'Buying' : 'Selling'} Price (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {details.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-3 py-2 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">{item.date}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                           <Globe className="w-3 h-3 text-[#428bca]" />
                           <span className="text-[11px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-tight">{item.country}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-[10px] text-zinc-500 font-bold border border-zinc-200 dark:border-zinc-700">{item.mccmnc}</span>
                      </td>
                      <td className="px-3 py-2 font-black text-[#428bca] text-xs">
                        {item.usage} <span className="text-[9px] opacity-40 font-bold uppercase ml-1">Messages</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                         <span className="text-xs font-mono font-black text-emerald-600 group-hover:scale-110 inline-block transition-transform">${item.price}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase italic">
              <Shield className="w-4 h-4" /> Usage data is retrieved from verified carrier traffic logs
            </div>
            <button 
              onClick={() => setShowInvoiceDetail(false)}
              className="px-10 py-3 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Close Details
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {renderPricingModal()}
      {showInvoiceDetail && renderInvoiceDetailModal()}
      {showCatalog && <CatalogPopup />}
      {selectedProductForDetails && <ProductRulesPopup />}
      {showAssignmentModal && (
        <AssignmentSelectorModal
          type={assignmentType}
          category={accountCategory}
          options={assignmentType === 'product' ? productOptions : rateTableOptions}
          onAssign={(name) => {
            if (assignmentType === 'product') {
              setAssignedProduct(name);
              // Propagate product details to modalRows
              const details = MOCK_PRODUCT_DETAILS[name] || [];
              if (details.length > 0) {
                setModalRows(details.map(d => ({ ...d, product: name })));
                setProductLevelData(details.map(d => ({ ...d, product: name })));
              }
            } else {
              setAssignedRateTable(name);
              // Propagate rate table to all rows
              setModalRows(prev => prev.map(row => ({ ...row, rateTableName: name })));
            }
            setShowAssignmentModal(false);
          }}
          onClose={() => setShowAssignmentModal(false)}
          theme={theme || 'light'}
        />
      )}
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{title}</h3>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{type} / {isViewOnly ? 'View Details' : title.includes('Send') ? 'Configure & Send' : 'Edit Information'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onClose}
            className={cn(
              "px-6 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg transition-all flex items-center gap-2 active:scale-95",
              isViewOnly ? "bg-zinc-500 hover:bg-zinc-600 shadow-zinc-500/20" : "bg-[#d9534f] hover:bg-red-600 shadow-red-500/20"
            )}
          >
            <X className="w-4 h-4" /> {isViewOnly ? 'Close' : 'Cancel'}
          </button>
          {!isViewOnly && (
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95"
            >
              {title.includes('Send') ? <Mail className="w-4 h-4" /> : <Save className="w-4 h-4" />} {title.includes('Send') ? 'Process & Send now' : 'Save Information'}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-12">
          {title.includes('Send Rate') ? renderSendRateForm() : type === 'Enterprise' ? renderEnterpriseForm() : renderTrunkForm(type === 'Customer' ? 'Customer' : 'Vendor')}
          
          {isViewOnly && (
            <div className="flex flex-col items-center gap-6 py-12 border-t border-zinc-100 dark:border-zinc-800">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-100 dark:border-emerald-900/30">
                    <CheckSquare className="w-6 h-6" />
                 </div>
                 <div>
                    <h5 className="text-sm font-black uppercase text-zinc-800 dark:text-zinc-200">You've reached the end</h5>
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">All Details have been displayed</p>
                 </div>
               </div>
               <button 
                 onClick={onClose}
                 className="px-10 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[13px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
               >
                 <X className="w-5 h-5" /> Close Detailed View
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
