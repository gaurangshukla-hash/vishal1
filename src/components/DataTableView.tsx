import React from 'react';
import { Search, Plus, Download, ChevronLeft, ChevronRight, Edit2, Eye, History, RotateCcw, Upload, Copy, List, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Zap, Mail, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_DATA } from '../lib/mockData';

import { AddTransactionForm, AddCurrencyForm, GenerateInvoiceRequestForm, AddCurrencyExchangeForm, AddBillingCycleForm, AddVendorInvoiceForm, InvoiceRequestForm, ActionConfirmationModal, AutoSendSOAConfigForm, AddChargesCalculatorForm, SOAPreviewModal, InvoicePreviewModal, VendorInvoicePreviewModal, AddCustomerInvoiceForm, BilateralNettingModal } from './FinanceForms';
import { EnterpriseForm } from './EnterpriseForms';
import { AddHLRProviderForm } from './HLRForms';
import { AddTranslationRuleForm, NotificationPopup, AddNumberListForm } from './SwitchForms';
import { NotificationForm } from './NotificationForm';
import { FirewallForm } from './FirewallForm';
import { RateTableForm, RateTableRatesView, LCRRequestForm, AddReRatingForm, ViewReRating, AddIMAPAccountForm, AddFileTemplateForm, AddAutoUploadRuleForm, BulkRateUpdateForm, MarginRuleForm, ImportRateTableForm, SMSWholesaleSwitchForm } from './ProductForms';
import { 
  TestInboxesForm, 
  PollRatesNowForm, 
  TestParseFormatForm, 
  CheckRulesMatchForm, 
  ForceRunRuleIngestionForm, 
  ForceRepairProcessForm, 
  DiagnosticRecommendationsForm, 
  AuditSyncIntegrityForm, 
  DispatchInboundNoticesForm 
} from './WholesaleRateForms';
import { SMSProductMateForm } from './SMSProductMateForm';
import { DLRRequestForm, AddDLRTemplateForm } from './TrafficInsightsForms';
import { AddRouteRuleGroupForm, ViewRouteRuleGroup, AddRouteRuleForm, DynamicRoutingForm } from './RouteForms';
import { TaskForm } from './TaskForm';

interface DataTableViewProps {
  title: string;
  originalTitle?: string;
  columns: string[];
  theme: 'light' | 'dark';
  onAdd?: () => void;
}

export function DataTableView({ title, originalTitle, columns, theme, onAdd }: DataTableViewProps) {
  const [activeSubTab, setActiveSubTab] = React.useState('Customer');
  const [showModal, setShowModal] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('');
  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);
  const [expandedRows, setExpandedRows] = React.useState<number[]>([]);
  const [sortConfig, setSortConfig] = React.useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  
  const effectiveTitle = originalTitle || title;
  
  const isSOA = effectiveTitle === 'SOA';
  const isEnterprise = effectiveTitle === 'Enterprise';
  const isTrunk = effectiveTitle === 'Customer Trunk' || effectiveTitle === 'Vendor Trunk';
  const isSMSProduct = effectiveTitle === 'SMS Product';
  const isBulkSupported = isSOA || isEnterprise || isTrunk || isSMSProduct;
  const isSingleSelect = effectiveTitle === 'Invoice' || effectiveTitle === 'Invoices & Customer Invoice' || effectiveTitle === 'Vendor Invoice';
  
  const isNetworkStatus = effectiveTitle === 'Network Status';
  
  // Default columns for search views
  const effectiveColumns = columns.length > 0 ? (
    isNetworkStatus ? (
      activeSubTab === 'Customer' 
        ? ['ENTERPRISE ID', 'CUSTOMER ID', 'ENTERPRISE NAME', 'CUSTOMER NAME', 'IP ADDRESS', 'NUMBER OF CONNECTION', 'STATUS', 'ACTION']
        : ['ENTERPRISE ID', 'VENDOR ID', 'ENTERPRISE NAME', 'VENDOR NAME', 'IP ADDRESS', 'NUMBER OF CONNECTION', 'STATUS', 'QUEUE', 'ACTION']
    ) : columns
  ) : (
    effectiveTitle === 'DLR Search' ? ['Info ID', 'Sender ID', 'DNID', 'Status', 'MCCMNC', 'Rate', 'Trunk'] :
    effectiveTitle === 'Usage Enterprise' ? ['ENTERPRISE NAME', 'USAGE DATE', 'TOTAL SMS', 'DELIVERED', 'FAILED', 'REVENUE', 'COST', 'MARGIN'] :
    effectiveTitle === 'Master Report' ? ['Date', 'Enterprise', 'Trunk', 'MCCMNC', 'Total SMS', 'Revenue', 'Cost', 'Margin'] :
    effectiveTitle === 'Re-Rating' ? ['RE-RATING ID', 'Description', 'Start Date', 'End Date', 'Enterprise Type', 'Status', 'Progress', 'Requested By', 'Requested Date'] :
    effectiveTitle === 'HLR Provider' ? ['Info ID', 'Provider Name', 'UserName', 'URL', 'Caching (Days)', 'Status', 'Created Time'] :
    effectiveTitle === 'Notification' ? ['Info ID', 'Enterprise Name', 'Type', 'Subject', 'Channel', 'Sent Time', 'Status'] :
    effectiveTitle === 'Number List' ? ['Info ID', 'Name', 'Type', 'Total Numbers', 'Status', 'Updated By', 'Updated Time'] :
    effectiveTitle === 'Translation Rule' ? ['Info ID', 'TRANSLATION RULE NAME', 'Type', 'Action', 'Continue', 'Sender ID', 'MCCMNC', 'Updated By'] :
    (effectiveTitle === 'Rate Table' || effectiveTitle === 'Customer Rate Table' || effectiveTitle === 'Vendor Rate Table') ? ['RATE TABLE ID', 'NAME', 'VENDOR', 'PRODUCT CATEGORY', 'CURRENCY', 'DESCRIPTION', 'UPDATED BY', 'UPDATED AT'] :
    effectiveTitle === 'Task Manager' ? ['ID', 'Task Name', 'Type', 'Priority', 'Status', 'Assigned To', 'Created At', 'Due Date'] :
    effectiveTitle === 'Route Rule' ? ['ID', 'Priority', 'Customer', 'Product', 'MCCMNC', 'Supplier', 'Type', 'Status'] :
    effectiveTitle === 'Route Rule Group' ? ['ID', 'Name', 'Rules', 'Status', 'Created By', 'Created At'] :
    effectiveTitle === 'SMS Product' ? ['ID', 'NAME', 'CATEGORY', 'CURRENCY', 'RULES', 'ACTION'] :
    effectiveTitle.includes('Trunk') ? ['ID', 'Name', 'Protocol', 'Host', 'Port', 'Status', 'Updated By', 'Updated At'] :
    ['ID', 'Name', 'Status', 'Updated By', 'Updated At']
  );

  const handleAction = (action: string) => {
    const adminForms = [
      'Business Company', 
      'Schedule Report', 
      'Email Template', 
      'Customer Portal', 
      'IMAP Mail Account', 
      'File Template', 
      'Auto Upload Rules',
      'Auto Upload Failed Report',
      'Auto Upload Report'
    ];

    if (action === 'Add' && onAdd && adminForms.includes(effectiveTitle)) {
      onAdd();
      return;
    }

    if (action === 'Delete') {
      if (selectedRows.length === 0) {
        alert("Please select at least one row to delete.");
        return;
      }
      if (window.confirm(`Are you sure you want to delete ${selectedRows.length} selected item(s)?`)) {
        const filtered = dataList.filter((_, idx) => !selectedRows.includes(idx));
        saveDataList(filtered);
        setSelectedRows([]);
        alert("Selected records deleted successfully!");
      }
      return;
    }

    if (action === 'Clone' || action === 'Copy') {
      if (selectedRows.length !== 1) {
        alert("Please select exactly one row to clone.");
        return;
      }
      const target = dataList[selectedRows[0]];
      const cloned = { ...target };
      const idKey = effectiveColumns.find(c => c.toLowerCase().includes('id'));
      if (idKey) {
        cloned[idKey] = `${target[idKey]}_copy_${Math.floor(Math.random() * 1000)}`;
      }
      const textKey = effectiveColumns.find(c => c.toLowerCase().includes('name') || c.toLowerCase().includes('tmpl') || c.toLowerCase().includes('rule') || c.toLowerCase().includes('username'));
      if (textKey) {
        cloned[textKey] = `${target[textKey]} (Copy)`;
      }
      saveDataList([cloned, ...dataList]);
      alert("Record cloned successfully!");
      return;
    }

    if (action === 'Clear' || action === 'Refresh') {
      setSelectedRows([]);
      if (action === 'Refresh') {
         const btn = document.activeElement as HTMLElement;
         if (btn) {
           btn.classList.add('animate-spin');
           setTimeout(() => btn.classList.remove('animate-spin'), 1000);
         }
         alert("Data refreshed and synchronized successfully!");
      }
      return;
    }

    // Capture initial values if editing
    if (action === 'Edit') {
      if (selectedRows.length !== 1) {
        alert("Please select exactly one row to edit.");
        return;
      }
      setFormInputs(dataList[selectedRows[0]] || {});
    } else {
      setFormInputs({});
    }

    setModalTitle(`${action} ${effectiveTitle}`);
    setShowModal(true);
  };

  // Use state-backed persistent storage for tables to make them interactive
  const [dataList, setDataList] = React.useState<any[]>(() => {
    const customKey = `teleoss-table-${effectiveTitle}`;
    const saved = localStorage.getItem(customKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const rawData = MOCK_DATA[effectiveTitle === 'Payment' ? 'Transaction' : effectiveTitle === 'Invoices & Customer Invoice' ? 'Invoice' : effectiveTitle] || [];
    if (rawData.length > 0) {
      return [...rawData];
    }
    return Array.from({ length: 8 }).map((_, i) => {
      const row: any = { id: 100 + i };
      effectiveColumns.forEach(col => {
        if (col === 'ID' || col === 'Id' || col === 'Info ID' || col === 'RATE TABLE ID' || col === 'INFO ID' || col === 'RE-RATING ID') {
          row[col] = String(100 + i);
        } else if (col === 'Status' || col === 'STATUS') {
          row[col] = i % 3 === 0 ? 'Inactive' : 'Active';
        } else if (col === 'Updated By' || col === 'UPDATED BY') {
          row[col] = 'Admin User';
        } else {
          row[col] = `${col} Data ${i + 1}`;
        }
      });
      return row;
    });
  });

  const [formInputs, setFormInputs] = React.useState<Record<string, string>>({});

  const saveDataList = (newList: any[]) => {
    setDataList(newList);
    const customKey = `teleoss-table-${effectiveTitle}`;
    localStorage.setItem(customKey, JSON.stringify(newList));
  };

  const data = [...dataList];

  if (sortConfig !== null) {
    data.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const isTransaction = effectiveTitle === 'Transaction' || effectiveTitle === 'Payment';
  const isFirewall = effectiveTitle === 'Firewall';
  const isSignalingDeck = effectiveTitle === 'Signaling Deck';

  const renderActions = () => {
    const btnClass = "px-4 py-2 sm:px-3 sm:py-1 text-[11px] sm:text-[10px] font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm";
    
    if (effectiveTitle === 'Enterprise' || effectiveTitle === 'Customer Trunk' || effectiveTitle === 'Vendor Trunk') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button 
            onClick={() => handleAction('View Plan')} 
            disabled={selectedRows.length === 0}
            className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600", selectedRows.length === 0 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Eye className="w-3 h-3" /> View Plan {selectedRows.length > 0 && `(${selectedRows.length})`}
          </button>
          <button 
            onClick={() => handleAction('Assign Plan')} 
            disabled={selectedRows.length === 0}
            className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500", selectedRows.length === 0 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Edit2 className="w-3 h-3" /> Assign Plan {selectedRows.length > 0 && `(${selectedRows.length})`}
          </button>
          <button 
            onClick={() => handleAction('Send Rate')} 
            disabled={selectedRows.length === 0}
            className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600", selectedRows.length === 0 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Download className="w-3 h-3" /> Send Rate {selectedRows.length > 0 && `(${selectedRows.length})`}
          </button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }

    if (effectiveTitle === 'Rate Table' || effectiveTitle === 'Customer Rate Table' || effectiveTitle === 'Vendor Rate Table') {
      const isVendor = effectiveTitle === 'Vendor Rate Table';
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add {isVendor ? 'Vendor' : 'Customer'} Rate Table</button>
          <button onClick={() => handleAction('Import')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Upload className="w-3 h-3" /> Import Rate Table</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View All Pricing</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('Bulk Margin Update')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-600 shadow-orange-500/20")}><Zap className="w-3 h-3" /> Bulk Margin</button>
          <button onClick={() => handleAction('Bulk Rate Update')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-600 shadow-orange-500/20")}>Bulk Update</button>
          <button onClick={() => handleAction('Rate Download')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Download className="w-3 h-3" /> Download</button>
          {!isVendor && <button onClick={() => handleAction('LCR Request')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}>LCR Request</button>}
          <button onClick={() => handleAction('Delete')} className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><Trash2 className="w-3 h-3" /> Delete</button>
        </div>
      );
    }
    if (effectiveTitle === 'LCR') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('LCR Request')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> LCR Request</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Refresh</button>
        </div>
      );
    }
    if (effectiveTitle === 'Re-Rating') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Request')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Request</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Refresh</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Translation Rule') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('Clone')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Copy className="w-3 h-3" /> Clone</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button onClick={() => handleAction('Delete History')} className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><History className="w-3 h-3" /> Delete History</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Translation Rule Group' || effectiveTitle === 'HLR Provider' || effectiveTitle === 'HLR Rule' || effectiveTitle === 'HLR Rule Group') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button onClick={() => handleAction('Delete History')} className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><History className="w-3 h-3" /> Delete History</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Email Logs') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Number List') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Upload className="w-3 h-3" /> Import List</button>
          <button className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><List className="w-3 h-3" /> List</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Download className="w-3 h-3" /> Export</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Notification') {
      return (
        <div className="flex flex-wrap gap-2">
           <button onClick={() => handleAction('Add Notification Rule')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add Notification Rule</button>
           <button onClick={() => handleAction('Customer Send Rate Information')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Mail className="w-3 h-3" /> Send Rate Info</button>
           <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    
    if (effectiveTitle === 'Signaling Deck') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Plus className="w-3 h-3" /> Start</button>
        </div>
      );
    }
    if (effectiveTitle === 'DLR Template') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'DLR Download') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('DLR Request')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> DLR Request</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Refresh</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Lookups') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
          <button onClick={() => handleAction('Delete')} className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><Trash2 className="w-3 h-3" /> Delete</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Schedule Report') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><Trash2 className="w-3 h-3" /> Delete</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Business Company') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Copy className="w-3 h-3" /> Clone</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Email Template') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Copy className="w-3 h-3" /> Clone</button>
        </div>
      );
    }
    if (effectiveTitle === 'Customer Portal') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Eye className="w-3 h-3" /> View</button>
        </div>
      );
    }
    if (effectiveTitle === 'Report Template') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Network Status') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700")}>CSV</button>
          <button className={cn(btnClass, "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700")}>Excel</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><RotateCcw className="w-3 h-3" /> Refresh</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'TCP Dump') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    
    if (effectiveTitle === 'Transaction' || effectiveTitle === 'Payment') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('History')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><History className="w-3 h-3" /> History</button>
          <button onClick={() => handleAction('Clear')} className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Currency' || effectiveTitle === 'Currency Exchange' || effectiveTitle === 'Billing Cycle' || effectiveTitle === 'Vendor Invoice') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          {effectiveTitle === 'Vendor Invoice' && (
             <button 
                onClick={() => handleAction('Preview Vendor Invoice')} 
                disabled={selectedRows.length === 0}
                className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600", selectedRows.length === 0 && "opacity-50 grayscale cursor-not-allowed")}
             >
                <Eye className="w-3 h-3" /> Preview {selectedRows.length > 0 && `(${selectedRows.length})`}
             </button>
          )}
          <button onClick={() => handleAction('Export')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Download className="w-3 h-3" /> Export</button>
          <button onClick={() => handleAction('Clear')} className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Charges Calculator') {
       return (
         <div className="flex flex-wrap gap-2">
           <button onClick={() => handleAction('Calculate')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Zap className="w-3 h-3" /> Calculator</button>
         </div>
       );
    }
    if (effectiveTitle === 'Invoice' || effectiveTitle === 'Invoices & Customer Invoice') {
      const selectedRowObj = selectedRows.length === 1 ? data[selectedRows[0]] : null;
      const isCustomerSelected = selectedRowObj ? selectedRowObj['Enterprise Type'] === 'Customer' : false;
      const isVendorSelected = selectedRowObj ? selectedRowObj['Enterprise Type'] === 'Vendor' : false;

      return (
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleAction('Add Customer Invoice')} 
            className={cn(btnClass, "bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold")}
          >
            <Plus className="w-3.5 h-3.5" /> Add Customer Invoice
          </button>
          <button 
            onClick={() => handleAction('Preview Invoice')} 
            disabled={selectedRows.length === 0}
            className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600", selectedRows.length === 0 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Eye className="w-3 h-3" /> Preview {selectedRows.length > 0 && `(${selectedRows.length})`}
          </button>
          <button 
            onClick={() => handleAction('Send Invoice')} 
            disabled={!isCustomerSelected}
            className={cn(
              btnClass, 
              "bg-[#428bca] text-white hover:bg-blue-600 font-bold",
              !isCustomerSelected && "opacity-50 grayscale cursor-not-allowed"
            )}
            title={!isCustomerSelected ? "Only active when a Customer enterprise is selected" : "Send selected customer invoice"}
          >
            Send Invoice
          </button>
          <button 
            onClick={() => handleAction('Send SOA')} 
            disabled={!isCustomerSelected}
            className={cn(
              btnClass, 
              "bg-[#428bca] text-white hover:bg-blue-600 font-bold",
              !isCustomerSelected && "opacity-50 grayscale cursor-not-allowed"
            )}
            title={!isCustomerSelected ? "Only active when a Customer enterprise is selected" : "Send selected customer Statement of Account"}
          >
            Send SOA
          </button>
          <button 
            onClick={() => handleAction('Invoice Request')} 
            disabled={!isVendorSelected}
            className={cn(
              btnClass, 
              "bg-[#428bca] text-white hover:bg-blue-600 font-bold",
              !isVendorSelected && "opacity-50 grayscale cursor-not-allowed"
            )}
            title={!isVendorSelected ? "Only active when a Vendor enterprise is selected" : "Generate invoice requests for selected Vendor"}
          >
            Invoice Request
          </button>
          <button onClick={() => handleAction('Refresh')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><RotateCcw className="w-3 h-3" /> Refresh</button>
          <button onClick={() => handleAction('Clear')} className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }

    if (effectiveTitle === 'IMAP Mail Account') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add Account</button>
          <button 
            onClick={() => {
              setModalTitle('Test Inboxes');
              setShowModal(true);
            }} 
            className={cn(btnClass, "bg-emerald-600 text-white hover:bg-emerald-700 font-bold")}
          >
            <Mail className="w-3.5 h-3.5" /> Test Inboxes
          </button>
          <button 
            onClick={() => {
              setModalTitle('Poll Rates Now');
              setShowModal(true);
            }} 
            className={cn(btnClass, "bg-rose-650 text-white hover:bg-rose-700")}
          >
            <Zap className="w-3 h-3" /> Poll Rates Now
          </button>
        </div>
      );
    }

    if (effectiveTitle === 'File Template') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add Template</button>
          <button 
            onClick={() => {
              setModalTitle('Test Parse Format');
              setShowModal(true);
            }}
            className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}
          >
            <Upload className="w-3 h-3" /> Test Parse Format
          </button>
        </div>
      );
    }

    if (effectiveTitle === 'Auto Upload Rules') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add Rule</button>
          <button 
            onClick={() => {
              setModalTitle('Check Rules Match');
              setShowModal(true);
            }}
            className={cn(btnClass, "bg-amber-500 text-white hover:bg-amber-600")}
          >
            <Eye className="w-3 h-3" /> Check Rules Match
          </button>
          <button 
            onClick={() => {
              setModalTitle('Force Run Rule Ingestion');
              setShowModal(true);
            }}
            className={cn(btnClass, "bg-emerald-600 text-white hover:bg-emerald-700")}
          >
            <Zap className="w-3 h-3" /> Force Run Rule Ingestion
          </button>
        </div>
      );
    }

    if (effectiveTitle === 'Auto Upload Failed Report') {
      return (
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              setModalTitle('Force Repair & Re-Process');
              setShowModal(true);
            }}
            className={cn(btnClass, "bg-rose-600 text-white hover:bg-rose-700 font-bold")}
          >
            <Zap className="w-3 h-3" /> Force Repair & Re-Process
          </button>
          <button 
            onClick={() => {
              setModalTitle('View Diagnostic Recommendations');
              setShowModal(true);
            }} 
            className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-650")}
          >
            <History className="w-3 h-3" /> View Diagnostic Recommendations
          </button>
        </div>
      );
    }

    if (effectiveTitle === 'Auto Upload Report') {
      return (
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              setModalTitle('Audit Sync Integrity');
              setShowModal(true);
            }}
            className={cn(btnClass, "bg-emerald-650 text-white hover:bg-emerald-700")}
          >
            <CheckCircle2 className="w-3 h-3" /> Audit Sync Integrity
          </button>
          <button 
            onClick={() => {
              setModalTitle('Dispatch Inbound Notices');
              setShowModal(true);
            }}
            className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}
          >
            <Mail className="w-3 h-3" /> Dispatch Inbound Notices
          </button>
        </div>
      );
    }
    if (effectiveTitle === 'Enterprise Balance') {
      return (
        <div className="flex flex-wrap gap-2">
          {['CSV', 'Excel', 'Send SOA', 'Refresh', 'Clear'].map(act => (
            <button key={act} onClick={() => handleAction(act)} className={cn(btnClass, "bg-brand-500 text-white hover:bg-brand-600")}>{act}</button>
          ))}
        </div>
      );
    }
    if (effectiveTitle === 'Product Category') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><History className="w-3 h-3" /> Delete History</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Master Table') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Download className="w-3 h-3" /> Export</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Upload className="w-3 h-3" /> Import</button>
          <button className={cn(btnClass, "bg-[#d9534f] text-white hover:bg-red-600")}><History className="w-3 h-3" /> Delete History</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'MCCMNC Unique Codes') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Upload className="w-3 h-3" /> Import</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Download className="w-3 h-3" /> Export</button>
        </div>
      );
    }
    if (effectiveTitle === 'MO Reference Book') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Upload className="w-3 h-3" /> Import</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Route Rule Group') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('View')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600")}><Eye className="w-3 h-3" /> View</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Route Rule') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add Rule</button>
          <button onClick={() => handleAction('Edit')} className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500")}><Edit2 className="w-3 h-3" /> Edit</button>
          <button onClick={() => handleAction('Dynamic Routing')} className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600 shadow-cyan-500/20")}><Zap className="w-3 h-3" /> Dynamic</button>
          <button onClick={() => handleAction('Clone')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Copy className="w-3 h-3" /> Clone</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'SOA') {
      return (
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleAction('Preview SOA')} 
            disabled={selectedRows.length !== 1}
            className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600", selectedRows.length !== 1 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Eye className="w-3 h-3" /> Preview {selectedRows.length > 0 && `(${selectedRows.length})`}
          </button>
          <button 
            onClick={() => handleAction('Bilateral Netting')} 
            disabled={selectedRows.length !== 1}
            className={cn(btnClass, "bg-indigo-600 text-white hover:bg-indigo-700", selectedRows.length !== 1 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Zap className="w-3 h-3" /> Bilateral Netting
          </button>
          <button onClick={() => handleAction('Auto Send Config')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Auto Send Config</button>
          <button 
            onClick={() => handleAction('Send SOA')} 
            disabled={selectedRows.length === 0}
            className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600", selectedRows.length === 0 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Download className="w-3 h-3" /> Send SOA {selectedRows.length > 0 && `(${selectedRows.length})`}
          </button>
          <button onClick={() => handleAction('Refresh')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><RotateCcw className="w-3 h-3" /> Refresh</button>
          <button onClick={() => handleAction('Clear')} className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Notification') {
      return (
        <div className="flex flex-wrap gap-2">
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}>Send Rate</button>
          <button className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}>Send Tech Info</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Clear</button>
        </div>
      );
    }
    if (effectiveTitle === 'Firewall') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Add')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Add Firewall Template</button>
          <button className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Download className="w-3 h-3" /> Export</button>
        </div>
      );
    }
    
    if (effectiveTitle === 'SMS Product') {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleAction('Create')} className={cn(btnClass, "bg-[#428bca] text-white hover:bg-blue-600")}><Plus className="w-3 h-3" /> Create SMS Product</button>
          <button 
            onClick={() => handleAction('View')} 
            disabled={selectedRows.length !== 1}
            className={cn(btnClass, "bg-[#5bc0de] text-white hover:bg-cyan-600", selectedRows.length !== 1 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Eye className="w-3 h-3" /> View {selectedRows.length > 1 && `(${selectedRows.length})`}
          </button>
          <button 
            onClick={() => handleAction('Edit')} 
            disabled={selectedRows.length !== 1}
            className={cn(btnClass, "bg-[#f0ad4e] text-white hover:bg-orange-500", selectedRows.length !== 1 && "opacity-50 grayscale cursor-not-allowed")}
          >
            <Edit2 className="w-3 h-3" /> Edit {selectedRows.length > 1 && `(${selectedRows.length})`}
          </button>
          <button onClick={() => handleAction('Clone')} className={cn(btnClass, "bg-[#5cb85c] text-white hover:bg-green-600")}><Copy className="w-3 h-3" /> Clone</button>
          <button className={cn(btnClass, "bg-zinc-500 text-white hover:bg-zinc-600")}><RotateCcw className="w-3 h-3" /> Reset</button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => handleAction('Add')} 
          className="px-3 py-1 bg-[#428bca] text-white text-[11px] font-bold rounded flex items-center gap-1.5 hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
        <button className="px-3 py-1 bg-[#5cb85c] text-white text-[11px] font-bold rounded flex items-center gap-1.5 hover:bg-green-600 transition-colors shadow-sm">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-4 bg-zinc-50 dark:bg-black/20">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-sm font-bold uppercase tracking-tight text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            {title}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {renderActions()}
          </div>
        </div>

        {isTransaction && (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {['Customer', 'Vendor'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={cn(
                  "px-6 py-2 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                  activeSubTab === tab 
                    ? "text-brand-500 border-brand-500 bg-brand-500/5" 
                    : "text-zinc-400 border-transparent hover:text-zinc-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {isSignalingDeck && (
          <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-wrap items-end gap-6 shadow-sm transition-colors">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase text-zinc-400">FILTER</label>
              <input 
                type="text" 
                placeholder="IP Address" 
                className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase text-zinc-400">MAX DURATION</label>
              <input 
                type="text" 
                placeholder="In Seconds" 
                className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
              <label className="text-[10px] font-black uppercase text-zinc-400">MAX FILE SIZE</label>
              <input 
                type="text" 
                placeholder="In Bytes" 
                className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              />
            </div>
          </div>
        )}

        {isNetworkStatus && (
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {['Customer', 'Vendor'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={cn(
                  "px-8 py-2.5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                  activeSubTab === tab 
                    ? "text-[#428bca] border-[#428bca] bg-blue-50/50 dark:bg-blue-500/5 font-black" 
                    : "text-zinc-400 border-transparent hover:text-zinc-600 dark:hover:text-zinc-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {isFirewall && (
          <div className="space-y-4">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              {['Banned IP', 'Trusted IP', 'Filter'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={cn(
                    "px-6 py-2 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all",
                    activeSubTab === tab 
                      ? "text-brand-500 border-brand-500 bg-brand-500/5" 
                      : "text-zinc-400 border-transparent hover:text-zinc-600 dark:hover:text-zinc-200"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg flex flex-wrap items-end gap-4 shadow-sm transition-colors">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400">IP Address</label>
                <input 
                  type="text" 
                  placeholder="IP Address" 
                  className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:ring-1 focus:ring-brand-500 transition-all w-48"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400">Select filter</label>
                <select className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-xs outline-none focus:ring-1 focus:ring-brand-500 transition-all w-48">
                  <option>Select filter</option>
                </select>
              </div>
              <button className="px-6 py-1.5 bg-[#428bca] text-white text-[11px] font-black uppercase rounded hover:bg-blue-600 transition-all shadow-md active:transform active:scale-95">
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={cn(
        "bg-white dark:bg-zinc-900 rounded border transition-colors overflow-hidden flex flex-col flex-1",
        theme === 'light' ? "border-zinc-200" : "border-zinc-800"
      )}>
        <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-zinc-900 transition-colors">
          <table className="w-full text-left border-collapse table-auto min-w-max">
            <thead className="sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-800/50 backdrop-blur-sm">
                {(isBulkSupported || isSingleSelect) && (
                  <th className="px-4 py-3 border-r border-zinc-100 dark:border-zinc-800 w-12 text-center">
                    <div className="flex flex-col gap-2 items-center">
                      {isBulkSupported ? (
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-zinc-300" 
                          checked={selectedRows.length === data.length && data.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedRows(data.map((_, i) => i));
                            else setSelectedRows([]);
                          }}
                        />
                      ) : (
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Select</span>
                      )}
                    </div>
                  </th>
                )}
                {effectiveColumns.map(col => (
                  <th key={col} className="px-4 py-3 border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 min-w-[150px] align-top">
                    <div className="flex flex-col gap-2">
                      <div 
                        className="flex items-center justify-between group/header cursor-pointer"
                        onClick={() => handleSort(col)}
                      >
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-400 whitespace-normal leading-tight h-8 flex items-center">
                          {col}
                        </span>
                        <div className="text-zinc-400 opacity-0 group-hover/header:opacity-100 transition-opacity">
                          {sortConfig?.key === col ? (
                            sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-brand-500" /> : <ArrowDown className="w-3 h-3 text-brand-500" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search..." 
                          className="w-full px-2 py-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-[10px] font-semibold focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500/50 outline-none transition-all shadow-sm"
                        />
                        <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={cn(
                    "border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-brand-500/5 transition-colors group cursor-pointer",
                    idx === 0 && (effectiveTitle === 'Business Company' || effectiveTitle === 'Email Template' || effectiveTitle === 'Customer Portal' || effectiveTitle === 'Re-Rating' || effectiveTitle === 'LCR' || effectiveTitle === 'Rate Table') ? "bg-blue-50/50 dark:bg-blue-500/5" : "",
                    selectedRows.includes(idx) ? "bg-blue-100/50 dark:bg-blue-500/10" : ""
                  )}
                  onClick={() => {
                    if (isBulkSupported) {
                      if (selectedRows.includes(idx)) setSelectedRows(selectedRows.filter(r => r !== idx));
                      else setSelectedRows([...selectedRows, idx]);
                    } else if (isSingleSelect) {
                      if (selectedRows.includes(idx)) setSelectedRows([]);
                      else setSelectedRows([idx]);
                    }
                  }}
                >
                  {(isBulkSupported || isSingleSelect) && (
                    <td className="px-4 py-2.5 border-r border-zinc-50 dark:border-zinc-800/50 text-center w-12">
                       <input 
                        type={isSingleSelect ? "radio" : "checkbox"} 
                        className={cn(
                          isSingleSelect ? "w-4 h-4 text-[#428bca] focus:ring-[#428bca]" : "w-4 h-4 rounded border-zinc-300",
                          "pointer-events-none"
                        )}
                        checked={selectedRows.includes(idx)} 
                        readOnly
                      />
                    </td>
                  )}
                  {effectiveColumns.map((col, colIdx) => (
                    <td key={colIdx} className="px-4 py-2.5 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 border-r border-zinc-50 dark:border-zinc-800/50 last:border-r-0 whitespace-normal break-words max-w-[250px]">
                      { (col === 'Name' || col === 'Customer Name' || col === 'Vendor Name' || col === 'Enterprise Name' || col === 'AUTO UPLOAD RULES NAME' || col === 'Auto upload Rule name') && (isTransaction || effectiveTitle.includes('Report') || effectiveTitle === 'Auto Upload Rules') ? (
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setModalTitle(`View Details: ${row[col]}`);
                             setShowModal(true);
                           }}
                           className="text-[#428bca] hover:underline font-black text-left"
                         >
                           {row[col]}
                         </button>
                      ) : col === 'FILE' && row[col].includes('Data') ? (
                        <div className="flex items-center gap-2 text-emerald-600 cursor-pointer hover:underline">
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </div>
                      ) : col === 'ACTION' && isNetworkStatus ? (
                        <div className="flex items-center gap-1.5">
                          <button className="px-2 py-0.5 bg-[#428bca] text-white rounded text-[9px] font-bold uppercase transition-transform active:scale-95 shadow-sm">Start</button>
                          <button className="px-2 py-0.5 bg-[#d9534f] text-white rounded text-[9px] font-bold uppercase transition-transform active:scale-95 shadow-sm">Stop</button>
                        </div>
                      ) : col === 'RULES' && effectiveTitle === 'SMS Product' ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRows([idx]);
                            handleAction('View Rules');
                          }}
                          className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800 text-[10px] font-black hover:bg-emerald-100 transition-all group"
                        >
                          <Database className="w-3 h-3 group-hover:scale-110 transition-transform" />
                          <span>{row[col] || '2'} Rules</span>
                        </button>
                      ) : col === 'ACTION' && isSMSProduct ? (
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRows([idx]);
                              handleAction('View Rules');
                            }}
                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                            title="Rule Matrix"
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRows([idx]);
                              handleAction('View');
                            }}
                            className="p-1.5 text-[#5bc0de] hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-all"
                            title="View Product"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRows([idx]);
                              handleAction('Edit');
                            }}
                            className="p-1 text-[#f0ad4e] hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-[#5cb85c] hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                            title="Clone Product"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : col === 'Priority' && (row[col] === 'Urgent' || row[col] === 'High' || row[col] === 'Medium' || row[col] === 'Low') ? (
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border",
                          row[col] === 'Urgent' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                          row[col] === 'High' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          row[col] === 'Medium' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                        )}>
                          {row[col]}
                        </span>
                      ) : col === 'Amount' && isTransaction ? (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-zinc-400 font-bold">{row['Currency'] || 'USD'}</span>
                          <span className="font-black text-zinc-900 dark:text-white">{row[col]}</span>
                        </div>
                      ) : (row[col] === 'Active' || row[col] === 'Paid' || row[col] === 'Success' || row[col] === 'online' || row[col] === 'Approved' || row[col] === 'Completed' || row[col] === 'Full') ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-200/50 dark:border-emerald-500/20">
                          {row[col] === 'Full' ? 'Full Paid' : row[col]}
                        </span>
                      ) : (row[col] === 'Inactive' || row[col] === 'Pending' || row[col] === 'Failed' || row[col] === 'offline' || row[col] === 'Rejected' || row[col] === 'Inprogress' || row[col] === 'Unpaid') ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-200/50 dark:border-rose-500/20">
                          {row[col] === 'Unpaid' ? 'Unpaid' : row[col]}
                        </span>
                      ) : row[col] === 'Partial' ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200/50 dark:border-amber-500/20">
                          Partial Paid
                        </span>
                      ) : (
                        row[col]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className={cn("w-full transition-all duration-300 overflow-hidden", 
            (modalTitle.includes('Translation Rule') || modalTitle.includes('HLR Provider') || effectiveTitle === 'Re-Rating' || effectiveTitle === 'Route Rule' || effectiveTitle === 'SMS Product' || modalTitle.includes('Preview')) ? "max-w-[95vw] xl:max-w-7xl h-[90vh]" : "max-w-2xl"
          )}>
            { (effectiveTitle === 'Enterprise' || effectiveTitle === 'Customer Trunk' || effectiveTitle === 'Vendor Trunk') ? (
              <EnterpriseForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
                title={modalTitle} 
                type={effectiveTitle === 'Enterprise' ? 'Enterprise' : (effectiveTitle as any)}
                isViewOnly={modalTitle.includes('View')}
              />
            ) : (effectiveTitle === 'Transaction' || effectiveTitle === 'Payment') && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <AddTransactionForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
                isEdit={modalTitle.includes('Edit')}
                data={modalTitle.includes('Edit') ? data[selectedRows[0]] : null}
              />
            ) : effectiveTitle === 'Currency' && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <AddCurrencyForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
                isEdit={modalTitle.includes('Edit')}
                data={modalTitle.includes('Edit') ? data[selectedRows[0]] : null}
              />
            ) : effectiveTitle === 'Currency Exchange' && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <AddCurrencyExchangeForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
                isEdit={modalTitle.includes('Edit')}
                data={modalTitle.includes('Edit') ? data[selectedRows[0]] : null}
              />
            ) : effectiveTitle === 'Billing Cycle' && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <AddBillingCycleForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
                isEdit={modalTitle.includes('Edit')}
                data={modalTitle.includes('Edit') ? data[selectedRows[0]] : null}
              />
            ) : effectiveTitle === 'Vendor Invoice' && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <AddVendorInvoiceForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
                isEdit={modalTitle.includes('Edit')}
                data={modalTitle.includes('Edit') ? data[selectedRows[0]] : null}
              />
            ) : (effectiveTitle === 'Invoice' || effectiveTitle === 'Invoices & Customer Invoice') && modalTitle.includes('Invoice Request') ? (
              <InvoiceRequestForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (effectiveTitle === 'Invoice' || effectiveTitle === 'Invoices & Customer Invoice') && modalTitle.includes('Add Customer Invoice') ? (
              <AddCustomerInvoiceForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (effectiveTitle === 'Invoice' || effectiveTitle === 'Invoices & Customer Invoice') && modalTitle.includes('Generate Request') ? (
              <GenerateInvoiceRequestForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle.includes('Preview SOA') ? (
              <SOAPreviewModal onClose={() => setShowModal(false)} theme={theme} data={data[selectedRows[0]]} />
            ) : modalTitle.includes('Bilateral Netting') ? (
              <BilateralNettingModal onClose={() => setShowModal(false)} theme={theme} data={data[selectedRows[0]]} />
            ) : modalTitle.includes('Preview Invoice') ? (
              <InvoicePreviewModal onClose={() => setShowModal(false)} theme={theme} data={data[selectedRows[0]]} />
            ) : modalTitle.includes('Preview Vendor Invoice') ? (
              <VendorInvoicePreviewModal onClose={() => setShowModal(false)} theme={theme} data={data[selectedRows[0]]} />
            ) : modalTitle.includes('Calculate') ? (
              <AddChargesCalculatorForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle.includes('Auto Send Config') ? (
              <AutoSendSOAConfigForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Test Inboxes' ? (
              <TestInboxesForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Poll Rates Now' ? (
              <PollRatesNowForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Test Parse Format' ? (
              <TestParseFormatForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Check Rules Match' ? (
              <CheckRulesMatchForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Force Run Rule Ingestion' ? (
              <ForceRunRuleIngestionForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Force Repair & Re-Process' ? (
              <ForceRepairProcessForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'View Diagnostic Recommendations' ? (
              <DiagnosticRecommendationsForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Audit Sync Integrity' ? (
              <AuditSyncIntegrityForm onClose={() => setShowModal(false)} theme={theme} />
            ) : modalTitle === 'Dispatch Inbound Notices' ? (
              <DispatchInboundNoticesForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (effectiveTitle === 'IMAP Mail Account' || effectiveTitle === 'IMAP account') && modalTitle.includes('Add') ? (
              <AddIMAPAccountForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (effectiveTitle === 'File Template' || effectiveTitle === 'File template') && modalTitle.includes('Add') ? (
              <AddFileTemplateForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (effectiveTitle === 'Auto Upload Rule' || effectiveTitle === 'Auto Upload Rules' || effectiveTitle === 'Auto upload rules') && modalTitle.includes('Add') ? (
              <AddAutoUploadRuleForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (effectiveTitle === 'Auto Upload Report' || effectiveTitle === 'Auto Upload Failed Report') && modalTitle.includes('Add') ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl p-8 max-w-xl w-full mx-auto text-left flex flex-col items-center gap-6">
                 <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                    <Upload className="w-8 h-8" />
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-lg font-black uppercase text-zinc-800 dark:text-white">Manual Processing</h3>
                    <p className="text-xs text-zinc-500 max-w-xs">Upload a rate sheet manually to trigger the auto-upload logic for a specific rule.</p>
                 </div>
                 <div className="w-full space-y-4">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-[10px] font-black uppercase text-zinc-400">Select Rule</label>
                       <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none">
                          <option>Alpha Vendor Auto Update</option>
                          <option>Direct Carrier Rule</option>
                       </select>
                    </div>
                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center cursor-pointer hover:border-[#428bca] transition-colors group">
                       <Download className="w-6 h-6 text-zinc-300 group-hover:text-[#428bca] mx-auto mb-2" />
                       <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-[#428bca]">Click to upload or drag & drop file</span>
                    </div>
                 </div>
                 <div className="flex gap-3 w-full">
                    <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-50 dark:bg-zinc-800 rounded-lg">Cancel</button>
                    <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-[#428bca] text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all">Start Import</button>
                 </div>
              </div>
            ) : (modalTitle.includes('Bulk Rate Update') || modalTitle.includes('Bulk Margin Update')) ? (
              <BulkRateUpdateForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Margin Rule' && modalTitle.includes('Add') ? (
              <MarginRuleForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Route Rule' && modalTitle.includes('Dynamic') ? (
              <DynamicRoutingForm onClose={() => setShowModal(false)} theme={theme} />
            ) : (modalTitle.includes('Auto Send') || modalTitle.includes('Send Invoice') || modalTitle.includes('Send SOA') || modalTitle.includes('Export') || modalTitle.includes('CSV') || modalTitle.includes('Excel') || modalTitle.includes('Mark') || modalTitle.includes('Send Rate') || modalTitle.includes('Download')) ? (
              <ActionConfirmationModal onClose={() => setShowModal(false)} theme={theme} title={modalTitle} actionName={modalTitle} />
            ) : (effectiveTitle === 'Rate Table' || effectiveTitle === 'Customer Rate Table' || effectiveTitle === 'Vendor Rate Table') && modalTitle.includes('Import') ? (
              <ImportRateTableForm onClose={() => setShowModal(false)} theme={theme} isVendor={effectiveTitle === 'Vendor Rate Table'} />
            ) : (effectiveTitle === 'Rate Table' || effectiveTitle === 'Customer Rate Table' || effectiveTitle === 'Vendor Rate Table') && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <RateTableForm onClose={() => setShowModal(false)} theme={theme} isEdit={modalTitle.includes('Edit')} data={modalTitle.includes('Edit') ? data[0] : null} isVendor={effectiveTitle === 'Vendor Rate Table'} />
            ) : (effectiveTitle === 'Rate Table' || effectiveTitle === 'Customer Rate Table' || effectiveTitle === 'Vendor Rate Table') && modalTitle.includes('View') ? (
              <RateTableRatesView onClose={() => setShowModal(false)} rateTableName={data[0]?.['Name'] || data[0]?.['NAME'] || 'Selected Table'} />
            ) : (effectiveTitle === 'LCR' || modalTitle.includes('LCR Request')) && modalTitle.includes('Request') ? (
              <LCRRequestForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'DLR Download' && modalTitle.includes('Request') ? (
              <DLRRequestForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Task Manager' && (modalTitle.includes('Add') || modalTitle.includes('Create') || modalTitle.includes('Edit')) ? (
              <TaskForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'DLR Template' && modalTitle.includes('Add') ? (
              <AddDLRTemplateForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'HLR Provider' && modalTitle.includes('Add') ? (
              <AddHLRProviderForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Translation Rule' && modalTitle.includes('Add') ? (
              <AddTranslationRuleForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Firewall' && modalTitle.includes('Add') ? (
              <FirewallForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Notification' && modalTitle.includes('Customer Send Rate Information') ? (
              <NotificationPopup onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Notification' && (modalTitle.includes('Add') || modalTitle.includes('Add Notification Rule')) ? (
              <NotificationForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Number List' && modalTitle.includes('Add') ? (
              <AddNumberListForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Re-Rating' && modalTitle.includes('Request') ? (
              <AddReRatingForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Re-Rating' && modalTitle.includes('View') ? (
              <ViewReRating onClose={() => setShowModal(false)} data={data[0]} />
            ) : effectiveTitle === 'SMS Product' && (modalTitle.includes('Create') || modalTitle.includes('Add') || modalTitle.includes('Edit') || modalTitle.includes('View') || modalTitle.includes('View Rules')) ? (
              <SMSProductMateForm 
                onClose={() => setShowModal(false)} 
                theme={theme} 
              />
            ) : effectiveTitle === 'SMS Switch' && (modalTitle.includes('Deploy') || modalTitle.includes('Add')) ? (
              <SMSWholesaleSwitchForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Route Rule' && modalTitle.includes('Add') ? (
              <AddRouteRuleForm onClose={() => setShowModal(false)} theme={theme} />
            ) : effectiveTitle === 'Route Rule Group' && (modalTitle.includes('Add') || modalTitle.includes('Edit')) ? (
              <AddRouteRuleGroupForm onClose={() => setShowModal(false)} theme={theme} editData={modalTitle.includes('Edit') ? data[0] : null} />
            ) : effectiveTitle === 'Route Rule Group' && modalTitle.includes('View') ? (
              <ViewRouteRuleGroup onClose={() => setShowModal(false)} data={data[0]} />
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#428bca]">{modalTitle}</h3>
                  <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {effectiveColumns.filter(c => c !== 'FILE' && c !== 'ACTION' && !c.includes('TIME')).map(col => (
                    <div key={col} className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider font-mono">{col}</label>
                      <input 
                        type="text" 
                        value={formInputs[col] || ''}
                        onChange={(e) => setFormInputs(prev => ({ ...prev, [col]: e.target.value }))}
                        placeholder={`Enter ${col.toLowerCase()}`}
                        className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-zinc-850 dark:text-zinc-100"
                      />
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
                  <button onClick={() => setShowModal(false)} className="px-6 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-700 transition-colors font-sans">Cancel</button>
                  <button 
                    onClick={() => {
                      if (modalTitle.includes('Edit')) {
                        const idx = selectedRows[0];
                        if (idx !== undefined) {
                          const updatedRow = { ...dataList[idx], ...formInputs };
                          const updatedList = dataList.map((row, rIdx) => rIdx === idx ? updatedRow : row);
                          saveDataList(updatedList);
                          alert("Record updated successfully!");
                        }
                      } else {
                        const newRow = { ...formInputs };
                        effectiveColumns.forEach(col => {
                          if (!newRow[col]) {
                            if (col === 'ID' || col === 'Id' || col === 'Info ID' || col === 'INFO ID' || col === 'RATE TABLE ID' || col === 'RE-RATING ID') {
                              newRow[col] = String(100 + dataList.length + Math.floor(Math.random() * 1000));
                            } else if (col === 'Status' || col === 'STATUS') {
                              newRow[col] = 'Active';
                            } else if (col === 'Updated By' || col === 'UPDATED BY') {
                              newRow[col] = 'Admin User';
                            } else {
                              newRow[col] = `--`;
                            }
                          }
                        });
                        saveDataList([newRow, ...dataList]);
                        alert("Record added successfully!");
                      }
                      setShowModal(false);
                      setSelectedRows([]);
                    }} 
                    className="px-8 py-2 bg-[#428bca] text-white text-[11px] font-black uppercase tracking-widest rounded-lg shadow-md hover:bg-blue-600 transition-all active:scale-95 font-sans"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-black/20 flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-400 uppercase">Showing 1 to {data.length} of {data.length} records</p>
          <div className="flex items-center gap-1">
            <button className="p-1 px-2 text-[10px] font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-white dark:hover:bg-zinc-800 transition-all disabled:opacity-50">
              <ChevronLeft className="w-3 h-3 inline mr-1" /> Prev
            </button>
            <button className="px-3 py-1 text-[10px] font-bold bg-brand-500 text-white rounded shadow-sm">1</button>
            <button className="p-1 px-2 text-[10px] font-bold text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-white dark:hover:bg-zinc-800">
              Next <ChevronRight className="w-3 h-3 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
