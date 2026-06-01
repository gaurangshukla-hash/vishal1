import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Settings, 
  ShieldCheck, 
  Search, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  ArrowUpDown, 
  Edit2, 
  FileText, 
  Play, 
  Layers, 
  Clock,
  RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FirewallFormProps {
  onClose?: () => void;
  theme: 'light' | 'dark';
}

interface Condition {
  id: string;
  type: string;
  condition: string;
  value: string;
}

interface FirewallTemplate {
  id: string;
  name: string;
  description: string;
  requestType: 'HTTP' | 'SMPP' | 'Select Type';
  status: boolean;
  storeIt: boolean;
  deductCredit: boolean;
  startDate: string;
  endDate: string;
  remarks: string;
  conditions: Condition[];
}

interface FirewallRule {
  id: string;
  name: string;
  sourceIpSubnet: string;
  actionPolicy: 'ALLOW' | 'BLOCK' | 'DROP';
  status: boolean;
  associatedTemplate: string; // references Template Name
  hitCount: number;
  createdAt: string;
  description: string;
}

const TEMPLATE_STORAGE_KEY = 'teleoss_firewall_templates';
const RULE_STORAGE_KEY = 'teleoss_firewall_rules';

// Initial defaults to populate if empty
const DEFAULT_TEMPLATES: FirewallTemplate[] = [
  {
    id: 'T-101',
    name: 'US Spam Block',
    description: 'Block messages containing typical spam phrases in US format',
    requestType: 'SMPP',
    status: true,
    storeIt: true,
    deductCredit: false,
    startDate: '04-05-2026 15:54',
    endDate: '31-12-2026 23:59',
    remarks: 'Heuristic content validation',
    conditions: [
      { id: 'c1', type: 'Message Content', condition: 'Contains', value: 'SPAM' },
      { id: 'c2', type: 'Country', condition: 'Equals', value: 'US' },
      { id: 'c3', type: 'Fail Attempts', condition: 'Equals', value: '3' }
    ]
  },
  {
    id: 'T-102',
    name: 'Global OTP Rate Limit',
    description: 'Rate limiting rules to allow high-frequency OTP only',
    requestType: 'HTTP',
    status: true,
    storeIt: true,
    deductCredit: true,
    startDate: '04-05-2026 15:54',
    endDate: '05-05-2027 15:54',
    remarks: 'Prevent OTP flood attacks',
    conditions: [
      { id: 'c4', type: 'Interval', condition: 'Equals', value: '5' },
      { id: 'c5', type: 'Interval Type', condition: 'Equals', value: 'Minute' }
    ]
  }
];

const DEFAULT_RULES: FirewallRule[] = [
  {
    id: 'FR-201',
    name: 'Block Spam Carrier IP',
    sourceIpSubnet: '192.168.1.15',
    actionPolicy: 'BLOCK',
    status: true,
    associatedTemplate: 'US Spam Block',
    hitCount: 1542,
    createdAt: '2026-05-01 10:20',
    description: 'Reject SMPP floods originating from high spam risk IP lease'
  },
  {
    id: 'FR-202',
    name: 'Throttle HTTP Subnet',
    sourceIpSubnet: '10.0.0.0/24',
    actionPolicy: 'BLOCK',
    status: true,
    associatedTemplate: 'Global OTP Rate Limit',
    hitCount: 4321,
    createdAt: '2026-05-02 14:15',
    description: 'Apply OTP template constraints globally on subnet 10'
  },
  {
    id: 'FR-203',
    name: 'Corporate Bypass Gate',
    sourceIpSubnet: '203.0.113.40',
    actionPolicy: 'ALLOW',
    status: true,
    associatedTemplate: 'US Spam Block',
    hitCount: 18921,
    createdAt: '2026-05-03 09:10',
    description: 'Allow trusted partner traffic without filtering constraints'
  }
];

export function FirewallForm({ onClose, theme }: FirewallFormProps) {
  // Navigation: 'Dashboard' lists the items, 'AddTemplate' and 'AddRule' show forms
  const [viewMode, setViewMode] = useState<'Dashboard' | 'AddTemplate' | 'AddRule'>('Dashboard');
  const [activeTab, setActiveTab] = useState<'Templates' | 'Rules'>('Templates');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Core States
  const [templates, setTemplates] = useState<FirewallTemplate[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_TEMPLATES;
  });

  const [rules, setRules] = useState<FirewallRule[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RULE_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEFAULT_RULES;
  });

  // Ensure default storage is synced on initial load if not set
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(TEMPLATE_STORAGE_KEY)) {
        localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(DEFAULT_TEMPLATES));
      }
      if (!localStorage.getItem(RULE_STORAGE_KEY)) {
        localStorage.setItem(RULE_STORAGE_KEY, JSON.stringify(DEFAULT_RULES));
      }
    }
  }, []);

  // Form States - Templates
  const [templateForm, setTemplateForm] = useState<Omit<FirewallTemplate, 'id' | 'conditions'>>({
    name: '',
    description: '',
    requestType: 'Select Type',
    status: true,
    storeIt: true,
    deductCredit: false,
    startDate: '04-05-2026 15:54',
    endDate: '05-05-2026 15:54',
    remarks: ''
  });
  const [tempConditions, setTempConditions] = useState<Condition[]>([]);
  
  // Rule list inputs inside Add Template exactly from screenshots
  const [newCondType, setNewCondType] = useState('Mobile');
  const [newCondOp, setNewCondOp] = useState('Equals');
  const [newCondValue, setNewCondValue] = useState('');

  // Form States - Rules
  const [ruleForm, setRuleForm] = useState<Omit<FirewallRule, 'id' | 'hitCount' | 'createdAt'>>({
    name: '',
    sourceIpSubnet: '',
    actionPolicy: 'BLOCK',
    status: true,
    associatedTemplate: 'None',
    description: ''
  });

  // Expandable accordions from screenshots
  const [expandedSections, setExpandedSections] = useState({
    templateDetails: true,
    conditionDetails: true,
    ruleDetails: true,
    ruleOverrides: true
  });

  const saveTemplatesToStorage = (newList: FirewallTemplate[]) => {
    setTemplates(newList);
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(newList));
  };

  const saveRulesToStorage = (newList: FirewallRule[]) => {
    setRules(newList);
    localStorage.setItem(RULE_STORAGE_KEY, JSON.stringify(newList));
  };

  // Toggle Accordions
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Reset forms
  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      requestType: 'Select Type',
      status: true,
      storeIt: true,
      deductCredit: false,
      startDate: '04-05-2026 15:54',
      endDate: '05-05-2026 15:54',
      remarks: ''
    });
    setTempConditions([]);
    setNewCondType('Mobile');
    setNewCondOp('Equals');
    setNewCondValue('');
    setEditingId(null);
  };

  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      sourceIpSubnet: '',
      actionPolicy: 'BLOCK',
      status: true,
      associatedTemplate: templates.length > 0 ? templates[0].name : 'None',
      description: ''
    });
    setEditingId(null);
  };

  // Dynamic Add conditions inline exactly from screenshots
  const handleAddCondition = () => {
    if (!newCondValue.trim()) {
      alert('Please enter a value for the condition rule');
      return;
    }
    const newCond: Condition = {
      id: `c_${Math.random().toString(36).substring(2, 9)}`,
      type: newCondType,
      condition: newCondOp,
      value: newCondValue
    };
    setTempConditions(prev => [...prev, newCond]);
    setNewCondValue('');
  };

  const handleDeleteCondition = (id: string) => {
    setTempConditions(prev => prev.filter(c => c.id !== id));
  };

  // Save actions
  const handleSaveTemplate = () => {
    if (!templateForm.name.trim()) {
      alert('Template Name is required');
      return;
    }
    if (templateForm.requestType === 'Select Type') {
      alert('Please pick a Request Type');
      return;
    }

    if (editingId) {
      // Modify
      const updated = templates.map(t => {
        if (t.id === editingId) {
          return {
            ...t,
            ...templateForm,
            conditions: tempConditions
          };
        }
        return t;
      });
      saveTemplatesToStorage(updated);
      alert('Firewall Template updated successfully!');
    } else {
      // Create new
      const newTmpl: FirewallTemplate = {
        id: `T-${100 + templates.length + 1}`,
        ...templateForm,
        conditions: tempConditions
      };
      saveTemplatesToStorage([newTmpl, ...templates]);
      alert('Firewall Template added successfully!');
    }
    resetTemplateForm();
    setViewMode('Dashboard');
  };

  const handleSaveRule = () => {
    if (!ruleForm.name.trim()) {
      alert('Rule Name is required');
      return;
    }
    if (!ruleForm.sourceIpSubnet.trim()) {
      alert('Source IP / Subnet filter is required');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];

    if (editingId) {
      // Modify
      const updated = rules.map(r => {
        if (r.id === editingId) {
          return {
            ...r,
            ...ruleForm
          };
        }
        return r;
      });
      saveRulesToStorage(updated);
      alert('Firewall Rule updated successfully!');
    } else {
      // Create new
      const newRule: FirewallRule = {
        id: `FR-${200 + rules.length + 1}`,
        ...ruleForm,
        hitCount: 0,
        createdAt: todayStr
      };
      saveRulesToStorage([newRule, ...rules]);
      alert('New Firewall Rule provisioned successfully!');
    }
    resetRuleForm();
    setViewMode('Dashboard');
  };

  // Delete handlers
  const handleDeleteTemplate = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the firewall template "${name}"?`)) {
      const filtered = templates.filter(t => t.id !== id);
      saveTemplatesToStorage(filtered);
      // also remove template reference from rules or set to None
      const updatedRules = rules.map(r => {
        if (r.associatedTemplate === name) {
          return { ...r, associatedTemplate: 'None' };
        }
        return r;
      });
      saveRulesToStorage(updatedRules);
    }
  };

  const handleDeleteRule = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the firewall rule "${name}"?`)) {
      const filtered = rules.filter(r => r.id !== id);
      saveRulesToStorage(filtered);
    }
  };

  // Load Edit states
  const handleStartEditTemplate = (tmpl: FirewallTemplate) => {
    setEditingId(tmpl.id);
    setTemplateForm({
      name: tmpl.name,
      description: tmpl.description,
      requestType: tmpl.requestType,
      status: tmpl.status,
      storeIt: tmpl.storeIt,
      deductCredit: tmpl.deductCredit,
      startDate: tmpl.startDate,
      endDate: tmpl.endDate,
      remarks: tmpl.remarks
    });
    setTempConditions([...tmpl.conditions]);
    setViewMode('AddTemplate');
  };

  const handleStartEditRule = (rule: FirewallRule) => {
    setEditingId(rule.id);
    setRuleForm({
      name: rule.name,
      sourceIpSubnet: rule.sourceIpSubnet,
      actionPolicy: rule.actionPolicy,
      status: rule.status,
      associatedTemplate: rule.associatedTemplate,
      description: rule.description
    });
    setViewMode('AddRule');
  };

  // Filter lists based on search
  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.requestType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRules = rules.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.sourceIpSubnet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.associatedTemplate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-zinc-50/50 dark:bg-night-bg transition-colors duration-500 font-sans">
      
      {/* Upper Statistics Overview */}
      {viewMode === 'Dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Templates Created</p>
              <h4 className="text-2xl font-black text-[#0073aa] dark:text-blue-400 mt-1">{templates.length}</h4>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-[#0073aa] dark:text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Templates Active</p>
              <h4 className="text-2xl font-black text-rose-650 dark:text-rose-400 mt-1">{templates.filter(t => t.status).length} <span className="text-zinc-400 text-sm font-medium">/ {templates.length}</span></h4>
            </div>
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Blocks Blocked</p>
              <h4 className="text-2xl font-black text-[#5cb85b] dark:text-green-400 mt-1">
                42,854
              </h4>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 text-[#5cb85c] dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">Shield Status</p>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-500/10 text-green-500 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                Protected
              </span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/10 text-emerald-500">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD MODE LISTINGS */}
      {viewMode === 'Dashboard' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md p-6 space-y-6 transition-colors duration-500 animate-in fade-in duration-400">
          
          {/* Section Breadcrumb & Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SMS Services / Firewall Threat Protection</p>
              <h2 className="text-xl font-bold flex items-center gap-3 text-zinc-800 dark:text-white mt-1">
                <Filter className="w-6 h-6 text-[#0073aa] dark:text-blue-400" />
                Firewall Templates
              </h2>
            </div>
          </div>

          {/* Search, Actions Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 rounded-xl">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search firewall templates..."
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 outline-none rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-[#0073aa] dark:focus:border-blue-500 transition-all text-zinc-700 dark:text-white"
              />
            </div>

            {/* BUTTON BAR - streamlined to include ONLY Add Firewall Template */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  resetTemplateForm();
                  setViewMode('AddTemplate');
                }}
                className="px-4 py-2 bg-[#0073aa] hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Firewall Template
              </button>
              <button 
                onClick={() => alert('Firewall Templates database exported to CSV / Excel')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" /> Export DB
              </button>
            </div>
          </div>

          {/* LISTINGS - TAB 1: TEMPLATES TABLE */}
          {activeTab === 'Templates' && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-16">ID</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Template Name</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Description</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-24">Type</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-28">Status</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-24">Store It</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-24">Deduct</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Start / End Date</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-xs">
                  {filteredTemplates.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-zinc-400 italic">No firewall templates matching query found.</td>
                    </tr>
                  ) : (
                    filteredTemplates.map((tmpl) => (
                      <tr 
                        key={tmpl.id} 
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 cursor-pointer transition-colors"
                        onClick={() => handleStartEditTemplate(tmpl)}
                        title="Click to edit"
                      >
                        <td className="px-4 py-4 font-mono font-bold text-zinc-400">{tmpl.id}</td>
                        <td className="px-4 py-4 font-bold text-[#0073aa] dark:text-blue-400">{tmpl.name}</td>
                        <td className="px-4 py-4 text-zinc-500 max-w-xs truncate">{tmpl.description}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider",
                            tmpl.requestType === 'SMPP' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" : "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400"
                          )}>
                            {tmpl.requestType}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              const updated = templates.map(t => t.id === tmpl.id ? { ...t, status: !t.status } : t);
                              saveTemplatesToStorage(updated);
                            }}
                          >
                            {tmpl.status ? (
                              <span className="px-2.5 py-0.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-zinc-500/10 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Inactive</span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center text-zinc-500">{tmpl.storeIt ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-4 text-center text-zinc-500">{tmpl.deductCredit ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-4 text-zinc-400 font-medium">
                          <div className="flex flex-col">
                            <span className="text-[10px]">{tmpl.startDate}</span>
                            <span className="text-[9px] opacity-70">to {tmpl.endDate}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => handleStartEditTemplate(tmpl)}
                              className="p-1 text-[#0073aa] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Edit Template"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTemplate(tmpl.id, tmpl.name)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* LISTINGS - TAB 2: RULES TABLE (The extra control dashboard!) */}
          {activeTab === 'Rules' && (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/80 text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest w-16">ID</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Rule Name</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Source IP / Subnet</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-32">Action Policy</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-28">Status</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-40">Associated Template</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center">Hit Count</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest">Created At</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-center w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900 text-xs">
                  {filteredRules.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-zinc-400 italic">No custom firewall rules defined yet. Click "Add Firewall Rule" above to create one.</td>
                    </tr>
                  ) : (
                    filteredRules.map((rule) => (
                      <tr 
                        key={rule.id} 
                        className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 cursor-pointer transition-colors"
                        onClick={() => handleStartEditRule(rule)}
                        title="Click to edit"
                      >
                        <td className="px-4 py-4 font-mono font-bold text-zinc-400">{rule.id}</td>
                        <td className="px-4 py-4 font-bold text-[#0073aa] dark:text-blue-400">{rule.name}</td>
                        <td className="px-4 py-4 font-mono font-medium text-zinc-500">{rule.sourceIpSubnet}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                            rule.actionPolicy === 'ALLOW' ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          )}>
                            {rule.actionPolicy}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              const updated = rules.map(r => r.id === rule.id ? { ...r, status: !r.status } : r);
                              saveRulesToStorage(updated);
                            }}
                          >
                            {rule.status ? (
                              <span className="px-2.5 py-0.5 bg-green-500/10 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-zinc-500/10 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-wider">Inactive</span>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-zinc-650 dark:text-zinc-300">
                          {rule.associatedTemplate === 'None' ? (
                            <span className="text-zinc-400 italic">None</span>
                          ) : (
                            <span className="underline decoration-slate-400 hover:text-[#0073aa] transition-colors">{rule.associatedTemplate}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center font-mono font-black text-rose-600 dark:text-rose-400">
                          {rule.hitCount.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-zinc-400 font-medium">{rule.createdAt}</td>
                        <td className="px-4 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => handleStartEditRule(rule)}
                              className="p-1 text-[#0073aa] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="Edit Rule"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRule(rule.id, rule.name)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete Rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Rights */}
          <div className="flex justify-between items-center text-[11px] text-zinc-400 font-medium">
            <span>Showing active configured firewall policies safely compiled on Cloud Gateway.</span>
            <span className="font-bold uppercase tracking-widest text-[#0073aa] dark:text-blue-400">Security Shield v3.1</span>
          </div>
        </div>
      )}


      {/* FORM MODE: ADD/EDIT FIREWALL TEMPLATE (Matches first & second screenshot exactly) */}
      {viewMode === 'AddTemplate' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-2xl overflow-hidden max-w-5xl mx-auto w-full flex flex-col font-sans transition-colors duration-500 animate-in zoom-in-95 duration-200">
          
          {/* Header Title inside card */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#0073aa] dark:text-blue-400 uppercase tracking-wider">
              {editingId ? 'Edit Firewall Template' : 'Add Firewall Template'}
            </h3>
            <button 
              onClick={() => setViewMode('Dashboard')} 
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Thick Solid Red Underline exactly as in the screenshots */}
          <div className="h-0.5 bg-red-500 mx-5 mt-3 shadow-sm rounded-full"></div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
            
            {/* 1. Accordion Card: Template Details */}
            <div className="border border-zinc-300 dark:border-zinc-800 rounded overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('templateDetails')}
                className="w-full px-4 py-2.5 bg-[#fbfbfb] dark:bg-zinc-800/60 hover:bg-zinc-100/50 dark:hover:bg-zinc-800 text-[11px] uppercase tracking-widest font-black text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0073aa]" />
                  Template Details
                </span>
                {expandedSections.templateDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {expandedSections.templateDetails && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-white dark:bg-zinc-900 transition-colors">
                  
                  {/* Underline only line style fields matching screenshots */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={templateForm.name}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Template Name code"
                      className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs focus:border-[#0073aa] dark:focus:border-blue-400 transition-colors text-zinc-800 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Description <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={templateForm.description}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Policy description text"
                      className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs focus:border-[#0073aa] dark:focus:border-blue-400 transition-colors text-zinc-800 dark:text-white" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Select Request Type <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={templateForm.requestType}
                        onChange={(e) => setTemplateForm(prev => ({ ...prev, requestType: e.target.value as any }))}
                        className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs appearance-none text-zinc-800 dark:text-white"
                      >
                        <option value="Select Type" className="dark:bg-zinc-900">Select Type</option>
                        <option value="HTTP" className="dark:bg-zinc-900">HTTP</option>
                        <option value="SMPP" className="dark:bg-zinc-900">SMPP</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Toggle settings */}
                  <div className="flex items-center gap-8 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Status</span>
                      <button 
                        type="button"
                        onClick={() => setTemplateForm(prev => ({ ...prev, status: !prev.status }))}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        {templateForm.status ? (
                          <ToggleRight className="w-8 h-8 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Store It</span>
                      <button 
                        type="button"
                        onClick={() => setTemplateForm(prev => ({ ...prev, storeIt: !prev.storeIt }))}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        {templateForm.storeIt ? (
                          <ToggleRight className="w-8 h-8 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Deduct Credit</span>
                      <button 
                        type="button"
                        onClick={() => setTemplateForm(prev => ({ ...prev, deductCredit: !prev.deductCredit }))}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        {templateForm.deductCredit ? (
                          <ToggleRight className="w-8 h-8 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Start Date</label>
                    <input 
                      type="text" 
                      value={templateForm.startDate}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 bg-zinc-50 dark:bg-zinc-800 outline-none text-xs text-zinc-800 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">End Date</label>
                    <input 
                      type="text" 
                      value={templateForm.endDate}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 rounded px-3 py-2 bg-zinc-50 dark:bg-zinc-800 outline-none text-xs text-zinc-800 dark:text-white" 
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Remarks</label>
                    <textarea 
                      rows={2} 
                      value={templateForm.remarks}
                      onChange={(e) => setTemplateForm(prev => ({ ...prev, remarks: e.target.value }))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 rounded p-3 bg-zinc-50 dark:bg-zinc-800 outline-none text-xs resize-none text-zinc-800 dark:text-white focus:ring-1 focus:ring-blue-500" 
                      placeholder="Enter remarks..." 
                    />
                  </div>

                </div>
              )}
            </div>

            {/* 2. Accordion Card: Condition Details exactly matching Screenshot 1 & 2 */}
            <div className="border border-zinc-300 dark:border-zinc-800 rounded overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('conditionDetails')}
                className="w-full px-4 py-2.5 bg-[#fbfbfb] dark:bg-zinc-800/60 hover:bg-zinc-100/50 dark:hover:bg-zinc-800 text-[11px] uppercase tracking-widest font-black text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-500" />
                  Condition Details
                </span>
                {expandedSections.conditionDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {expandedSections.conditionDetails && (
                <div className="p-6 space-y-6">
                  
                  {/* Selector Inputs exactly matching the screenshots */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    
                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Select Type <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={newCondType}
                          onChange={(e) => setNewCondType(e.target.value)}
                          className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs appearance-none text-zinc-800 dark:text-white"
                        >
                          {['Mobile', 'Senderid', 'Message Content', 'Country', 'Operator', 'Fail Attempts', 'Interval', 'Interval Type'].map(t => (
                            <option key={t} value={t} className="dark:bg-zinc-900">{t}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Select Condition <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={newCondOp}
                          onChange={(e) => setNewCondOp(e.target.value)}
                          className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs appearance-none text-zinc-800 dark:text-white"
                        >
                          {['Equals', 'Does Not Equals', 'Begins With', 'End With', 'Contains', 'Does Not Contains'].map(cond => (
                            <option key={cond} value={cond} className="dark:bg-zinc-900">{cond}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-zinc-400 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Value <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={newCondValue}
                        onChange={(e) => setNewCondValue(e.target.value)}
                        placeholder="Condition criteria"
                        className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs text-zinc-800 dark:text-white focus:border-[#0073aa] transition-colors" 
                      />
                    </div>

                    {/* RED ADD BUTTON FROM SCREENSHOTS */}
                    <button 
                      type="button"
                      onClick={handleAddCondition}
                      className="bg-[#d9534f] text-white hover:bg-red-600 px-6 py-2 rounded-sm text-xs font-bold tracking-wider uppercase transition-colors shrink-0 shadow-sm border border-black/20 w-full md:w-auto"
                    >
                      Add
                    </button>
                  </div>

                  {/* Dynamic Rule items subtable exactly matching screenshots */}
                  <div className="border border-zinc-200 dark:border-zinc-800 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse bg-white dark:bg-zinc-900">
                      <thead>
                        <tr className="bg-[#f5f5f5] dark:bg-zinc-800 text-[#0073aa] dark:text-blue-400 font-bold text-[11px] border-b border-zinc-200 dark:border-zinc-700">
                          <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700 w-20 text-center">Sr.No.</th>
                          <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700">Type</th>
                          <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700">Condition</th>
                          <th className="px-4 py-2 border-r border-[#e0e0e0] dark:border-zinc-700">Value</th>
                          <th className="px-4 py-2 text-center w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y divide-zinc-200 dark:divide-zinc-800 select-none">
                        {tempConditions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-zinc-400 italic">No records found</td>
                          </tr>
                        ) : (
                          tempConditions.map((cond, index) => (
                            <tr key={cond.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20">
                              <td className="px-4 py-2.5 border-r border-[#e0e0e0] dark:border-zinc-700 font-bold font-mono text-center text-zinc-400">{index + 1}</td>
                              <td className="px-4 py-2.5 border-r border-[#e0e0e0] dark:border-zinc-700 text-zinc-650 dark:text-zinc-300">{cond.type}</td>
                              <td className="px-4 py-2.5 border-r border-[#e0e0e0] dark:border-zinc-700 font-medium text-purple-600 dark:text-purple-400">{cond.condition}</td>
                              <td className="px-4 py-2.5 border-r border-[#e0e0e0] dark:border-zinc-700 font-mono font-bold text-zinc-700 dark:text-zinc-250">{cond.value}</td>
                              <td className="px-4 py-2.5 text-center">
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteCondition(cond.id)}
                                  className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                                  title="Remove Condition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                      
                      {/* Footer tracking row exactly like screenshot */}
                      <tfoot className="bg-[#f5f5f5] dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-750">
                        <tr>
                          <td colSpan={5} className="px-5 py-2 font-bold text-zinc-500 dark:text-zinc-400 italic text-[11px]">
                            Total {tempConditions.length} {tempConditions.length === 1 ? 'record' : 'records'} found
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                </div>
              )}
            </div>

            {/* Bottom Form Actions - Styled exactly like the red buttons shown with black outlines */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
              <button 
                type="button"
                onClick={() => {
                  resetTemplateForm();
                  setViewMode('Dashboard');
                }} 
                className="bg-[#d9534f] hover:bg-red-600 text-white border border-black/25 px-10 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors active:transform active:scale-95 shadow-sm"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={handleSaveTemplate}
                className="bg-[#d9534f] hover:bg-red-600 text-white border border-black/25 px-10 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors active:transform active:scale-95 shadow-sm"
              >
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>

          </div>
        </div>
      )}


      {/* EXTRA FEATURE FORM MODE: ADD/EDIT FIREWALL RULE (Same beautiful design requested) */}
      {viewMode === 'AddRule' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded shadow-2xl overflow-hidden max-w-5xl mx-auto w-full flex flex-col font-sans transition-colors duration-500 animate-in zoom-in-95 duration-200">
          
          {/* Header Title inside card */}
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50 flex items-center justify-between">
            <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              {editingId ? 'Edit Firewall Rule Policy' : 'Add Custom Firewall Rule'}
            </h3>
            <button 
              onClick={() => setViewMode('Dashboard')} 
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Solid Red Underline to match the template page style perfectly */}
          <div className="h-0.5 bg-red-500 mx-5 mt-3 shadow-sm rounded-full"></div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
            
            {/* 1. Accordion Card: Rule Details */}
            <div className="border border-zinc-300 dark:border-zinc-800 rounded overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('ruleDetails')}
                className="w-full px-4 py-2.5 bg-[#fbfbfb] dark:bg-zinc-800/60 hover:bg-zinc-100/50 dark:hover:bg-zinc-800 text-[11px] uppercase tracking-widest font-black text-rose-600 dark:text-rose-400 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-rose-600" />
                  Rule Configuration
                </span>
                {expandedSections.ruleDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {expandedSections.ruleDetails && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 bg-white dark:bg-zinc-900 transition-colors">
                  
                  {/* Underline only line style fields matching templates */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Rule Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={ruleForm.name}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Reject-Spam-NOC-Route"
                      className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs focus:border-rose-500 transition-colors text-zinc-800 dark:text-white" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Source IP or CIDR Subnet <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={ruleForm.sourceIpSubnet}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, sourceIpSubnet: e.target.value }))}
                      placeholder="e.g. 192.168.1.150 or 10.0.0.0/24"
                      className="w-full font-mono border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs focus:border-rose-500 transition-colors text-zinc-800 dark:text-white" 
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Associated Firewall Template <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={ruleForm.associatedTemplate}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, associatedTemplate: e.target.value }))}
                        className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs appearance-none text-zinc-800 dark:text-white"
                      >
                        <option value="None" className="dark:bg-zinc-900">None (Pure IP Block Bypass)</option>
                        {templates.map(t => (
                          <option key={t.id} value={t.name} className="dark:bg-zinc-900">{t.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Action Policy <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select 
                        value={ruleForm.actionPolicy}
                        onChange={(e) => setRuleForm(prev => ({ ...prev, actionPolicy: e.target.value as any }))}
                        className="w-full border-b border-zinc-300 dark:border-zinc-700 bg-transparent py-1.5 px-1 outline-none text-xs appearance-none text-zinc-800 dark:text-white"
                      >
                        <option value="BLOCK" className="dark:bg-zinc-900">BLOCK (Reject & Log Traffic)</option>
                        <option value="ALLOW" className="dark:bg-zinc-900">ALLOW (Bypass Content Filter)</option>
                        <option value="DROP" className="dark:bg-zinc-900">DROP (Silently Discard packets)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Status toggle fields matching template */}
                  <div className="flex items-center gap-8 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Rule Status</span>
                      <button 
                        type="button"
                        onClick={() => setRuleForm(prev => ({ ...prev, status: !prev.status }))}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        {ruleForm.status ? (
                          <ToggleRight className="w-8 h-8 text-rose-600" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Rule Deployment Scope / Description</label>
                    <textarea 
                      rows={2} 
                      value={ruleForm.description}
                      onChange={(e) => setRuleForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-zinc-200 dark:border-zinc-800 rounded p-3 bg-zinc-50 dark:bg-zinc-800 outline-none text-xs resize-none text-zinc-800 dark:text-white focus:ring-1 focus:ring-rose-500" 
                      placeholder="e.g. Provisioned for safety compliance blocks on client routes..." 
                    />
                  </div>

                </div>
              )}
            </div>

            {/* 2. Accordion Card: Operational Threat Intelligence overrides */}
            <div className="border border-zinc-300 dark:border-zinc-800 rounded overflow-hidden">
              <button 
                type="button"
                onClick={() => toggleSection('ruleOverrides')}
                className="w-full px-4 py-2.5 bg-[#fbfbfb] dark:bg-zinc-800/60 hover:bg-zinc-100/50 dark:hover:bg-zinc-800 text-[11px] uppercase tracking-widest font-black text-zinc-700 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  Advanced Threat Routing Overrides
                </span>
                {expandedSections.ruleOverrides ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {expandedSections.ruleOverrides && (
                <div className="p-6 space-y-4 bg-white dark:bg-zinc-900 transition-colors">
                  <div className="flex items-start gap-3 p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 text-amber-600 dark:text-amber-400 text-xs">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-bold">Important Notice</p>
                      <p className="opacity-80">This rule binds with high-performance kernel filters. Make sure the Source IP Subnet matches the IP whitelist ranges provided by the carrier client gateway to avoid false positives.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <div>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Fast Mitigation Path</p>
                        <p className="text-[10px] text-zinc-400">Route through secondary failover if rule triggers blocks</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-zinc-300" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      <div>
                        <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Trace Logs</p>
                        <p className="text-[10px] text-zinc-400">Save full trace of blocked packets headers matching this rule</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-zinc-300" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Form Actions for Rule - Matches the same red background buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2">
              <button 
                type="button"
                onClick={() => {
                  resetRuleForm();
                  setViewMode('Dashboard');
                }} 
                className="bg-[#d9534f] hover:bg-red-600 text-white border border-black/25 px-10 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors active:transform active:scale-95 shadow-sm"
              >
                Back
              </button>
              <button 
                type="button"
                onClick={handleSaveRule}
                className="bg-[#d9534f] hover:bg-red-600 text-white border border-black/25 px-10 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors active:transform active:scale-95 shadow-sm"
              >
                {editingId ? 'Update Rule' : 'Add Rule'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
