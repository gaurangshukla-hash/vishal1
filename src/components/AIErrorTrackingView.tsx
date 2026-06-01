import React, { useState } from 'react';
import { 
  ShieldAlert, Sparkles, ShieldCheck, Check, Search, 
  Cpu, Settings, Plus, Trash2, Sliders, Activity, Calendar, AlertTriangle,
  Upload, FileText, ArrowDown, HelpCircle, RefreshCw, Info, CheckCircle, ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SupplierErrorLog {
  id: string;
  vendorName: string; // Vendor Name (e.g. V_RESERVE, V_ABC)
  code: string; // Vendor Error Code (e.g. 0x000000ff)
  hexCode: string;
  description: string; // Vendor Error Message (e.g. Invalid Destination Address)
  
  // Custom Standard Error Fields mapped with Customer
  mappedCustomerCode: string; // Standard Error Code (e.g. 104)
  mappedCustomerDescription: string; // Standard Error Description (e.g. Subscriber address inactive or invalid)
  mappedCustomerStatus: 'UNDELIV' | 'REJECTD' | 'EXPIRED' | 'BLOCKED' | 'CONGESTION' | 'SUCCESS_MAPPED';
  
  category: 'Permanent' | 'Transient' | 'Route Block'; // Category
  severity: 'Critical' | 'Warning' | 'Major' | 'Minor'; // Severity
  confidence: number; // AI Confidence (%)
  lastSeen: string; // Last Seen
  status: 'Active Mapper' | 'Pending Approval' | 'Suspended'; // Status

  occurrence: number;
  sharePct: number;
  predictedStatus: string;
  retryable: boolean;
  recommendedAction: string;
  approved: boolean;
}

interface SupplierData {
  name: string;
  id: string;
  totalSms: number;
  successRate: number;
  errorRate: number;
  status: 'Critical' | 'Warning' | 'Healthy';
  healthIndex: number;
  connectionType: 'SMPP v3.4' | 'HTTP Rest API' | 'SMPP v5.0';
  avgLatencyMs: number;
  logs: SupplierErrorLog[];
}

export function AIErrorTrackingView({ theme }: { theme: 'light' | 'dark' }) {
  // Configured rich initial database of supplier-wise tracked DLR logs,
  // mapping Supplier parameters to downstream customer facing Standard variables.
  const [suppliers, setSuppliers] = useState<SupplierData[]>([
    {
      id: 's1',
      name: 'V_RESERVE',
      totalSms: 4500000,
      successRate: 94.2,
      errorRate: 5.8,
      status: 'Warning',
      healthIndex: 82,
      connectionType: 'SMPP v3.4',
      avgLatencyMs: 142,
      logs: [
        { 
          id: 'l1', 
          vendorName: 'V_RESERVE',
          code: '0x000000ff', 
          hexCode: '0xFF', 
          description: 'Invalid Destination Address (DLR Read)', 
          occurrence: 124500, 
          sharePct: 47.7, 
          predictedStatus: 'Permanent Reject', 
          confidence: 99, 
          retryable: false, 
          recommendedAction: 'Reject immediately below HLR. Do not retry.', 
          approved: true,
          mappedCustomerCode: '104',
          mappedCustomerDescription: 'Subscriber status is inactive or invalid',
          mappedCustomerStatus: 'REJECTD',
          category: 'Permanent',
          severity: 'Warning',
          lastSeen: '2026-05-30 09:34',
          status: 'Active Mapper'
        },
        { 
          id: 'l2', 
          vendorName: 'V_RESERVE',
          code: '0x00000008', 
          hexCode: '0x08', 
          description: 'System Error (Transient Bind Drop on DLR)', 
          occurrence: 82300, 
          sharePct: 31.5, 
          predictedStatus: 'Temporary Interruption', 
          confidence: 94, 
          retryable: true, 
          recommendedAction: 'Enable exponential retry loop. Timeout fallback.', 
          approved: true,
          mappedCustomerCode: '109',
          mappedCustomerDescription: 'Transient upstream server connection failure',
          mappedCustomerStatus: 'CONGESTION',
          category: 'Transient',
          severity: 'Minor',
          lastSeen: '2026-05-30 09:38',
          status: 'Active Mapper'
        },
        { 
          id: 'l3', 
          vendorName: 'V_RESERVE',
          code: '0x00000067', 
          hexCode: '0x67', 
          description: 'Throttling / ESME Queue Limit Exceeded (DLR Read)', 
          occurrence: 34100, 
          sharePct: 13.1, 
          predictedStatus: 'Rate Shaper Conflict', 
          confidence: 88, 
          retryable: true, 
          recommendedAction: 'Reduce connection window size. Apply LCR diversion.', 
          approved: false,
          mappedCustomerCode: '103',
          mappedCustomerDescription: 'Rate threshold cap exceeded on carrier pipeline',
          mappedCustomerStatus: 'BLOCKED',
          category: 'Route Block',
          severity: 'Critical',
          lastSeen: '2026-05-30 09:39',
          status: 'Pending Approval'
        },
        { 
          id: 'l4', 
          vendorName: 'V_RESERVE',
          code: '0x00000035', 
          hexCode: '0x35', 
          description: 'Invalid Source Address (Sender ID DLR warning)', 
          occurrence: 20100, 
          sharePct: 7.7, 
          predictedStatus: 'Compliance Flag', 
          confidence: 97, 
          retryable: false, 
          recommendedAction: 'Sender ID registration missing on carrier database.', 
          approved: true,
          mappedCustomerCode: '101',
          mappedCustomerDescription: 'Sender signature refused by destination operator',
          mappedCustomerStatus: 'REJECTD',
          category: 'Permanent',
          severity: 'Major',
          lastSeen: '2026-05-30 09:31',
          status: 'Active Mapper'
        }
      ]
    },
    {
      id: 's2',
      name: 'V_ABC',
      totalSms: 9800000,
      successRate: 88.5,
      errorRate: 11.5,
      status: 'Critical',
      healthIndex: 64,
      connectionType: 'SMPP v3.4',
      avgLatencyMs: 380,
      logs: [
        { 
          id: 'l5', 
          vendorName: 'V_ABC',
          code: '0x00000058', 
          hexCode: '0x58', 
          description: 'Throttling limit exceeded (Submit rate overflow)', 
          occurrence: 685000, 
          sharePct: 60.8, 
          predictedStatus: 'Carrier Cap Overflow', 
          confidence: 98, 
          retryable: true, 
          recommendedAction: 'Apply immediate window congestion filter or divert.', 
          approved: false,
          mappedCustomerCode: '102',
          mappedCustomerDescription: 'Outbound submit volume speed limit triggered',
          mappedCustomerStatus: 'CONGESTION',
          category: 'Transient',
          severity: 'Major',
          lastSeen: '2026-05-30 09:25',
          status: 'Pending Approval'
        },
        { 
          id: 'l6', 
          vendorName: 'V_ABC',
          code: '0x0000000c', 
          hexCode: '0x0C', 
          description: 'Bind Failed Network Timeout', 
          occurrence: 290000, 
          sharePct: 25.7, 
          predictedStatus: 'Port Congestion', 
          confidence: 92, 
          retryable: true, 
          recommendedAction: 'Auto re-verify IP whitelist. Route keep-alives.', 
          approved: false,
          mappedCustomerCode: '108',
          mappedCustomerDescription: 'Message validity period has expired inside server queue',
          mappedCustomerStatus: 'EXPIRED',
          category: 'Transient',
          severity: 'Critical',
          lastSeen: '2026-05-30 09:37',
          status: 'Suspended'
        },
        { 
          id: 'l7', 
          vendorName: 'V_ABC',
          code: '0x00000045', 
          hexCode: '0x45', 
          description: 'Submit Sm Failed (DLR Permanent route breakdown)', 
          occurrence: 152000, 
          sharePct: 13.5, 
          predictedStatus: 'Downlink Block', 
          confidence: 96, 
          retryable: false, 
          recommendedAction: 'Terminate trunk bind and re-route traffic to LCR.', 
          approved: true,
          mappedCustomerCode: '115',
          mappedCustomerDescription: 'Destination network port totally unreachable',
          mappedCustomerStatus: 'UNDELIV',
          category: 'Permanent',
          severity: 'Critical',
          lastSeen: '2026-05-30 09:36',
          status: 'Active Mapper'
        }
      ]
    },
    {
      id: 's3',
      name: 'Asia_Provider',
      totalSms: 12500000,
      successRate: 98.9,
      errorRate: 1.1,
      status: 'Healthy',
      healthIndex: 98,
      connectionType: 'HTTP Rest API',
      avgLatencyMs: 95,
      logs: [
        { 
          id: 'l8', 
          vendorName: 'Asia_Provider',
          code: '401', 
          hexCode: 'HTTP-401', 
          description: 'Unauthorized Token IP Validation', 
          occurrence: 82000, 
          sharePct: 59.5, 
          predictedStatus: 'Security Reject', 
          confidence: 99, 
          retryable: false, 
          recommendedAction: 'Refresh Bearer Token or update outbound proxy IP settings.', 
          approved: true,
          mappedCustomerCode: '401',
          mappedCustomerDescription: 'Dynamic security handshake failure at carrier port',
          mappedCustomerStatus: 'BLOCKED',
          category: 'Permanent',
          severity: 'Major',
          lastSeen: '2026-05-30 09:12',
          status: 'Active Mapper'
        },
        { 
          id: 'l9', 
          vendorName: 'Asia_Provider',
          code: '429', 
          hexCode: 'HTTP-429', 
          description: 'Too Many Requests (Rate limit overflow)', 
          occurrence: 55800, 
          sharePct: 40.5, 
          predictedStatus: 'Rate Limiter Burst', 
          confidence: 95, 
          retryable: true, 
          recommendedAction: 'Introduce token bucket shaper in local outbound router.', 
          approved: true,
          mappedCustomerCode: '429',
          mappedCustomerDescription: 'Global request pace exceeds allotted plan SLA limits',
          mappedCustomerStatus: 'CONGESTION',
          category: 'Transient',
          severity: 'Minor',
          lastSeen: '2026-05-30 09:15',
          status: 'Active Mapper'
        }
      ]
    },
    {
      id: 's4',
      name: 'V_XYZ',
      totalSms: 2200000,
      successRate: 96.7,
      errorRate: 3.3,
      status: 'Healthy',
      healthIndex: 93,
      connectionType: 'SMPP v5.0',
      avgLatencyMs: 120,
      logs: [
        { 
          id: 'l10', 
          vendorName: 'V_XYZ',
          code: '0x000000ff', 
          hexCode: '0xFF', 
          description: 'Invalid Destination Address', 
          occurrence: 42100, 
          sharePct: 58.0, 
          predictedStatus: 'Permanent Reject', 
          confidence: 99, 
          retryable: false, 
          recommendedAction: 'Filter invalid MCCMNC through core HLR registry.', 
          approved: true,
          mappedCustomerCode: '104',
          mappedCustomerDescription: 'Invalid destination cellular address route',
          mappedCustomerStatus: 'REJECTD',
          category: 'Permanent',
          severity: 'Warning',
          lastSeen: '2026-05-30 09:11',
          status: 'Active Mapper'
        },
        { 
          id: 'l11', 
          vendorName: 'V_XYZ',
          code: '0x0000000c', 
          hexCode: '0x0C', 
          description: 'Bind Loss Recovery', 
          occurrence: 30500, 
          sharePct: 42.0, 
          predictedStatus: 'Transient Bind Drop', 
          confidence: 91, 
          retryable: true, 
          recommendedAction: 'Initiate standard connection heart-beat interval check.', 
          approved: true,
          mappedCustomerCode: '108',
          mappedCustomerDescription: 'Upstream dispatcher connection has drop-retry enabled',
          mappedCustomerStatus: 'EXPIRED',
          category: 'Transient',
          severity: 'Minor',
          lastSeen: '2026-05-30 09:22',
          status: 'Active Mapper'
        }
      ]
    }
  ]);

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('s1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Individual Supplier Manual Entry State Parameters 
  const [newVendorCode, setNewVendorCode] = useState('');
  const [newVendorMessage, setNewVendorMessage] = useState('');
  const [newStdCode, setNewStdCode] = useState('');
  const [newStdDescription, setNewStdDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'Permanent' | 'Transient' | 'Route Block'>('Transient');
  const [newSeverity, setNewSeverity] = useState<'Critical' | 'Warning' | 'Major' | 'Minor'>('Warning');
  const [newStatus, setNewStatus] = useState<'Active Mapper' | 'Pending Approval' | 'Suspended'>('Active Mapper');
  const [newConfidence, setNewConfidence] = useState<number>(95);
  const [newCustomerStatus, setNewCustomerStatus] = useState<'UNDELIV' | 'REJECTD' | 'EXPIRED' | 'BLOCKED' | 'CONGESTION' | 'SUCCESS_MAPPED'>('REJECTD');

  // Input Type selection State (Manual vs CSV Import)
  const [activeInputTab, setActiveInputTab] = useState<'manual' | 'import'>('manual');
  
  // CSV Import related State
  const [csvRawText, setCsvRawText] = useState('');
  const [csvHeadersHint, setCsvHeadersHint] = useState('vendor_code,vendor_description,standard_customer_code,standard_customer_description');
  const [importStatusMessage, setImportStatusMessage] = useState('');

  const [expandedCustomerCode, setExpandedCustomerCode] = useState<string | null>(null);

  // Master Error Category Templates Base for Dynamic AI Mapping and Standardization
  const [masterCategories, setMasterCategories] = useState<Array<{
    id: string;
    customerCode: string;
    customerDescription: string;
    status: 'UNDELIV' | 'REJECTD' | 'EXPIRED' | 'BLOCKED' | 'CONGESTION' | 'SUCCESS_MAPPED';
    category: 'Permanent' | 'Transient' | 'Route Block';
    severity: 'Critical' | 'Warning' | 'Major' | 'Minor';
    keywords: string; // Comma separated terms for AI overlap analysis
  }>>([
    {
      id: 'mc1',
      customerCode: '101',
      customerDescription: 'Sender signature refused by destination operator',
      status: 'REJECTD',
      category: 'Permanent',
      severity: 'Major',
      keywords: 'sender, source, unregistered, signature, compliance, spoof, identifier, sender_id'
    },
    {
      id: 'mc2',
      customerCode: '103',
      customerDescription: 'Rate threshold cap exceeded on carrier pipeline',
      status: 'BLOCKED',
      category: 'Route Block',
      severity: 'Critical',
      keywords: 'rate, shaper, throttle, queue, threshold, speed, limit, cap, congestion, esme'
    },
    {
      id: 'mc3',
      customerCode: '104',
      customerDescription: 'Subscriber status is inactive or invalid',
      status: 'REJECTD',
      category: 'Permanent',
      severity: 'Warning',
      keywords: 'address, destination, inactive, invalid, subscriber, number, absent, unknown, hlr'
    },
    {
      id: 'mc4',
      customerCode: '108',
      customerDescription: 'Message validity period has expired inside server queue',
      status: 'EXPIRED',
      category: 'Transient',
      severity: 'Minor',
      keywords: 'expire, validity, period, timeout, time out, ttl, latency'
    },
    {
      id: 'mc5',
      customerCode: '109',
      customerDescription: 'Transient upstream server connection failure',
      status: 'CONGESTION',
      category: 'Transient',
      severity: 'Minor',
      keywords: 'upstream, server, connection, failure, bind, connect, network, tcp, drop'
    },
    {
      id: 'mc6',
      customerCode: '115',
      customerDescription: 'Destination network port totally unreachable',
      status: 'UNDELIV',
      category: 'Permanent',
      severity: 'Critical',
      keywords: 'unreachable, delivery, failed, downlink, broken, port, gateway'
    },
    {
      id: 'mc7',
      customerCode: '401',
      customerDescription: 'Dynamic security handshake failure at carrier port',
      status: 'BLOCKED',
      category: 'Permanent',
      severity: 'Major',
      keywords: 'unauthorized, token, security, handshake, auth, credentials, verification, access'
    },
    {
      id: 'mc8',
      customerCode: '429',
      customerDescription: 'Global request pace exceeds allotted plan SLA limits',
      status: 'CONGESTION',
      category: 'Transient',
      severity: 'Minor',
      keywords: '429, requests, sla, plan, fast, overlimit'
    }
  ]);

  // Master Category Form states
  const [mcCode, setMcCode] = useState('');
  const [mcDescription, setMcDescription] = useState('');
  const [mcStatus, setMcStatus] = useState<'UNDELIV' | 'REJECTD' | 'EXPIRED' | 'BLOCKED' | 'CONGESTION' | 'SUCCESS_MAPPED'>('REJECTD');
  const [mcCategory, setMcCategory] = useState<'Permanent' | 'Transient' | 'Route Block'>('Transient');
  const [mcSeverity, setMcSeverity] = useState<'Critical' | 'Warning' | 'Major' | 'Minor'>('Warning');
  const [mcKeywords, setMcKeywords] = useState('');

  // AI best match algorithm based on keyword token overlap
  const findAIBestMatch = (vendorDesc: string) => {
    const descLower = vendorDesc.toLowerCase();
    let bestMatch: typeof masterCategories[0] | null = null;
    let maxMatchCount = 0;

    masterCategories.forEach(mc => {
      const keywordList = mc.keywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
      let matches = 0;
      keywordList.forEach(kw => {
        if (descLower.includes(kw)) {
          matches += 2; // Exact keyword matches weigh draft
        }
      });

      // Partial check for description
      const descParts = mc.customerDescription.toLowerCase().split(' ');
      descParts.forEach(part => {
        if (part.length > 3 && descLower.includes(part)) {
          matches += 1;
        }
      });

      if (matches > maxMatchCount) {
        maxMatchCount = matches;
        bestMatch = mc;
      }
    });

    return bestMatch;
  };

  const handleAIMapRow = (logId: string, vendorDesc: string) => {
    const bestMatch = findAIBestMatch(vendorDesc);
    if (bestMatch) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === selectedSupplierId) {
          return {
            ...s,
            logs: s.logs.map(l => l.id === logId ? {
              ...l,
              mappedCustomerCode: bestMatch.customerCode,
              mappedCustomerDescription: bestMatch.customerDescription,
              mappedCustomerStatus: bestMatch.status,
              category: bestMatch.category,
              severity: bestMatch.severity,
              confidence: 99
            } : l)
          };
        }
        return s;
      }));
      setToastMessage(`✨ AI Auto-Mapped! standard Category [${bestMatch.customerCode}] matched based on description keyword.`);
      setIsToastOpen(true);
      setTimeout(() => setIsToastOpen(false), 3000);
    } else {
      setToastMessage(`⚠️ No reliable template match found. Mapped to default fallback 199.`);
      setIsToastOpen(true);
      setTimeout(() => setIsToastOpen(false), 3000);
      setSuppliers(prev => prev.map(s => {
        if (s.id === selectedSupplierId) {
          return {
            ...s,
            logs: s.logs.map(l => l.id === logId ? {
              ...l,
              mappedCustomerCode: '199',
              mappedCustomerDescription: 'Standard Unmapped carrier returned exception',
              confidence: 60
            } : l)
          };
        }
        return s;
      }));
    }
  };

  const handleAIFillForm = () => {
    if (!newVendorMessage.trim()) {
      alert("Please enter the 'Vendor Error Message' first. We will use it to match with templates.");
      return;
    }
    const bestMatch = findAIBestMatch(newVendorMessage);
    if (bestMatch) {
      setNewStdCode(bestMatch.customerCode);
      setNewStdDescription(bestMatch.customerDescription);
      setNewCustomerStatus(bestMatch.status);
      setNewCategory(bestMatch.category);
      setNewSeverity(bestMatch.severity);
      setNewConfidence(98);
      setToastMessage(`✨ AI Suggested standard Category: ${bestMatch.customerCode} (${bestMatch.customerDescription})`);
      setIsToastOpen(true);
      setTimeout(() => setIsToastOpen(false), 3000);
    } else {
      setNewStdCode('199');
      setNewStdDescription('Standard unclassified operator returned code');
      setNewConfidence(55);
      setToastMessage(`⚠️ No keyword correlation found in templates base. Using default.`);
      setIsToastOpen(true);
      setTimeout(() => setIsToastOpen(false), 3000);
    }
  };

  const handleAddMasterCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mcCode.trim() || !mcDescription.trim()) {
      alert("Please provide Code and Template Description.");
      return;
    }

    const nCode = mcCode.trim();
    if (masterCategories.some(mc => mc.customerCode === nCode)) {
      alert(`Standard Code [${nCode}] already exists in Master table.`);
      return;
    }

    const newMC = {
      id: `mc_${Date.now()}`,
      customerCode: nCode,
      customerDescription: mcDescription.trim(),
      status: mcStatus,
      category: mcCategory,
      severity: mcSeverity,
      keywords: mcKeywords.trim() || nCode
    };

    setMasterCategories(prev => [...prev, newMC]);
    setToastMessage(`✨ Standard Category [${nCode}] registered successfully in master table.`);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 3000);

    // reset
    setMcCode('');
    setMcDescription('');
    setMcKeywords('');
  };

  const handleDeleteMasterCategory = (id: string, code: string) => {
    setMasterCategories(prev => prev.filter(mc => mc.id !== id));
    setToastMessage(`SUCCESS: Removed Standard Code [${code}] from template registry.`);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 3000);
  };

  // Derive customer mapping report dynamically from state
  const customerMappingReportList = React.useMemo(() => {
    const reportMap: Record<string, {
      customerCode: string;
      description: string;
      status: 'UNDELIV' | 'REJECTD' | 'EXPIRED' | 'BLOCKED' | 'CONGESTION' | 'SUCCESS_MAPPED';
      severity: 'Critical' | 'Warning' | 'Major' | 'Minor';
      category: 'Permanent' | 'Transient' | 'Route Block';
      totalOccurrence: number;
      associations: Array<{
        supplierName: string;
        vendorCode: string;
        vendorDescription: string;
        severity: string;
        category: string;
        occurrence: number;
      }>;
    }> = {};

    suppliers.forEach(supplier => {
      supplier.logs.forEach(log => {
        const code = log.mappedCustomerCode || 'Unmapped';
        if (!reportMap[code]) {
          reportMap[code] = {
            customerCode: code,
            description: log.mappedCustomerDescription || 'No active customer facing translation',
            status: log.mappedCustomerStatus || 'REJECTD',
            severity: log.severity || 'Warning',
            category: log.category || 'Transient',
            totalOccurrence: 0,
            associations: []
          };
        }
        
        reportMap[code].totalOccurrence += log.occurrence || 0;
        reportMap[code].associations.push({
          supplierName: supplier.name,
          vendorCode: log.code,
          vendorDescription: log.description,
          severity: log.severity,
          category: log.category,
          occurrence: log.occurrence || 0
        });
        
        if (log.mappedCustomerDescription && reportMap[code].description === 'No active customer facing translation') {
          reportMap[code].description = log.mappedCustomerDescription;
        }
      });
    });

    return Object.values(reportMap).sort((a, b) => a.customerCode.localeCompare(b.customerCode));
  }, [suppliers]);

  const activeSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  // Inline Handlers for editing
  const handleUpdateCustomerCode = (logId: string, newCode: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: s.logs.map(l => l.id === logId ? { ...l, mappedCustomerCode: newCode } : l)
        };
      }
      return s;
    }));
  };

  const handleUpdateCustomerDescription = (logId: string, newDesc: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: s.logs.map(l => l.id === logId ? { ...l, mappedCustomerDescription: newDesc } : l)
        };
      }
      return s;
    }));
  };

  const handleUpdateCategory = (logId: string, newCat: 'Permanent' | 'Transient' | 'Route Block') => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: s.logs.map(l => l.id === logId ? { ...l, category: newCat } : l)
        };
      }
      return s;
    }));
  };

  const handleUpdateSeverity = (logId: string, newSev: 'Critical' | 'Warning' | 'Major' | 'Minor') => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: s.logs.map(l => l.id === logId ? { ...l, severity: newSev } : l)
        };
      }
      return s;
    }));
  };

  const handleUpdateStatus = (logId: string, newStat: 'Active Mapper' | 'Pending Approval' | 'Suspended') => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: s.logs.map(l => l.id === logId ? { ...l, status: newStat } : l)
        };
      }
      return s;
    }));
  };

  const handleDeleteLog = (logId: string) => {
    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: s.logs.filter(l => l.id !== logId)
        };
      }
      return s;
    }));
    setToastMessage(`SUCCESS: Removed error mapping entry from cellular gateway registry.`);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 3000);
  };

  const handleSaveMappingTrigger = (log: SupplierErrorLog) => {
    setToastMessage(`SUCCESS: Configured client map for ${log.vendorName}: Code [${log.code}] mapped to customer code [${log.mappedCustomerCode}].`);
    setIsToastOpen(true);
    setTimeout(() => {
      setIsToastOpen(false);
    }, 4500);
  };

  // HANDLER FOR MANUALLY REGISTERING A NEW SUPPLIER ERROR CODE
  const handleAddNewErrorRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorCode.trim() || !newVendorMessage.trim()) {
      alert("Please configure both Supplier Error Code and Error Message.");
      return;
    }

    const newLogItem: SupplierErrorLog = {
      id: `l_${Date.now()}`,
      vendorName: activeSupplier.name,
      code: newVendorCode.trim(),
      hexCode: newVendorCode.startsWith('0x') ? newVendorCode : `0x${newVendorCode}`,
      description: newVendorMessage.trim(),
      mappedCustomerCode: newStdCode.trim() || '199',
      mappedCustomerDescription: newStdDescription.trim() || 'Unspecified carrier returned failure path',
      mappedCustomerStatus: newCustomerStatus,
      category: newCategory,
      severity: newSeverity,
      confidence: newConfidence,
      lastSeen: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: newStatus,
      occurrence: Math.floor(Math.random() * 5000) + 100,
      sharePct: 4.5,
      predictedStatus: newCategory === 'Permanent' ? 'Permanent Reject' : 'Temporary Error',
      retryable: newCategory !== 'Permanent',
      recommendedAction: 'Bypass parameters via local LCR configuration.',
      approved: true
    };

    setSuppliers(prev => prev.map(s => {
      if (s.id === selectedSupplierId) {
        return {
          ...s,
          logs: [newLogItem, ...s.logs]
        };
      }
      return s;
    }));

    // Toast configuration
    setToastMessage(`SUCCESS: Manually registered custom signal standard [${newVendorCode}] on supplier [${activeSupplier.name}].`);
    setIsToastOpen(true);
    setTimeout(() => setIsToastOpen(false), 4500);

    // Reset inputs
    setNewVendorCode('');
    setNewVendorMessage('');
    setNewStdCode('');
    setNewStdDescription('');
    setNewConfidence(95);
  };

  // CSV/Bulk Text Batch Import Handler
  const handleProcessBulkImport = (text: string) => {
    if (!text.trim()) {
      alert("Please paste some comma-separated values before importing.");
      return;
    }

    const lines = text.split('\n');
    let importedCount = 0;
    const newLogs: SupplierErrorLog[] = [];

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      // Skip empty lines or header rows
      if (!trimmed || trimmed.toLowerCase().includes('vendor_code') || trimmed.toLowerCase().includes('error_code')) {
        return;
      }

      // Handle common delimiters such as comma, tab, semicolon or pipe
      let delimiter = ',';
      if (trimmed.includes('\t')) delimiter = '\t';
      else if (trimmed.includes(';')) delimiter = ';';
      else if (trimmed.includes('|')) delimiter = '|';

      const columns = trimmed.split(delimiter).map(col => col.replace(/^["']|["']$/g, '').trim());
      
      if (columns.length > 0 && columns[0]) {
        const vCode = columns[0];
        const vMsg = columns[1] || `Carrier error logic returned [${vCode}]`;
        const mappedCode = columns[2] || '199';
        const mappedDesc = columns[3] || 'Bulk imported upstream failure mapping';

        newLogs.push({
          id: `l_bulk_${Date.now()}_${index}`,
          vendorName: activeSupplier.name,
          code: vCode,
          hexCode: vCode.startsWith('0x') ? vCode : `0x${vCode}`,
          description: vMsg,
          mappedCustomerCode: mappedCode,
          mappedCustomerDescription: mappedDesc,
          mappedCustomerStatus: 'REJECTD',
          category: 'Transient',
          severity: 'Warning',
          confidence: 90,
          lastSeen: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Active Mapper',
          occurrence: Math.floor(Math.random() * 1200) + 40,
          sharePct: 1.2,
          predictedStatus: 'Temporary Interruption',
          retryable: true,
          recommendedAction: 'Verify trace routing constraints.',
          approved: true
        });
        importedCount++;
      }
    });

    if (newLogs.length > 0) {
      setSuppliers(prev => prev.map(s => {
        if (s.id === selectedSupplierId) {
          return {
            ...s,
            logs: [...newLogs, ...s.logs]
          };
        }
        return s;
      }));

      setToastMessage(`SUCCESS: Bulk imported ${importedCount} custom mappings into ${activeSupplier.name}.`);
      setIsToastOpen(true);
      setCsvRawText('');
      setImportStatusMessage(`✨ Successfully parsed and imported ${importedCount} records into ${activeSupplier.name} table.`);
      setTimeout(() => {
        setIsToastOpen(false);
        setImportStatusMessage('');
      }, 5000);
    } else {
      alert("No valid data rows could be parsed. Check your format (Code, Description, CustomerCode, CustomerDescription).");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result;
      if (typeof content === 'string') {
        handleProcessBulkImport(content);
      }
    };
    reader.readAsText(file);
    // Clear input
    e.target.value = '';
  };

  // Helper template paste function
  const handleLoadDemoTemplate = () => {
    const sampleCSV = `0x000000ef,Inactive Destination Route,104,Subscriber number is temporarily de-activated
0x000000de,Upstream pipeline congested,103,Carrier capacity limit warning threshold
4001,Unregistered sender identifier format,101,Refused compliance criteria
5053,Internal route lookup expired,108,Vesting period expired in queue`;
    setCsvRawText(sampleCSV);
  };

  const filteredLogs = activeSupplier.logs.filter(log => 
    log.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.mappedCustomerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.mappedCustomerDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar-dlr p-3 sm:p-4 space-y-4 animate-in fade-in duration-500 text-left w-full">
      
      {/* CUSTOM STYLE INJECTION FOR SMOOTH SCROLLBAR VISIBILITY ON BOTH HORIZONTAL AND VERTICAL SCROLLING */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar-dlr::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar-dlr::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .dark .custom-scrollbar-dlr::-webkit-scrollbar-track {
          background: #18181b;
        }
        .custom-scrollbar-dlr::-webkit-scrollbar-thumb {
          background: #428bca;
          border-radius: 4px;
          border: 2px solid #f1f5f9;
        }
        .dark .custom-scrollbar-dlr::-webkit-scrollbar-thumb {
          background: #428bca;
          border: 2px solid #18181b;
        }
        .custom-scrollbar-dlr::-webkit-scrollbar-thumb:hover {
          background: #3071a9;
        }
      `}} />

      {/* HEADER SECTION - TIGHT COMPACT VERSION TO MAXIMIZE SPACE */}
      <div className="p-3 bg-[#428bca]/5 dark:bg-[#428bca]/10 border-l-4 border-[#428bca] rounded-r-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-5 h-5 text-[#428bca] shrink-0" />
          <div>
            <h4 className="text-sm font-black uppercase text-zinc-900 dark:text-zinc-100 tracking-wider">
              Supplier-wise Error Code Mapping Tools
            </h4>
            <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 font-medium">
              Standardize carrier return codes to customer definitions in one consolidated interface.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-black bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 px-2 py-1 rounded text-[#428bca]">
            ACTIVE MAPPING PORT: 3000
          </span>
        </div>
      </div>

      {/* SUCCESS TOAST BANNER */}
      {isToastOpen && (
        <div className="p-2.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-xl flex items-center justify-between border border-emerald-500/30 shadow-md tracking-wide transition-all">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="w-4 h-4 text-emerald-500 font-bold" />
            <span className="font-semibold text-[11px]">{toastMessage}</span>
          </div>
          <button onClick={() => setIsToastOpen(false)} className="text-[9px] uppercase tracking-wider font-bold text-zinc-400">
            Dismiss
          </button>
        </div>
      )}

      {/* CORE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* SUPPLIER SWITCH LIST (LEFT col-span-3) */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Trunk Supplier</span>
              <span className="px-1.5 py-0.5 bg-[#428bca]/15 text-[#428bca] font-mono text-[8.5px] rounded font-black uppercase">
                {suppliers.length} Active
              </span>
            </div>

            <div className="space-y-1.5">
              {suppliers.map(s => {
                const matchesSelected = selectedSupplierId === s.id;
                const statusDot = s.status === 'Critical' ? 'bg-rose-500' : s.status === 'Warning' ? 'bg-amber-500' : 'bg-emerald-500';

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSupplierId(s.id)}
                    className={cn(
                      "w-full p-2.5 rounded-lg border text-left transition-all relative flex flex-col gap-1 cursor-pointer outline-none focus:ring-1 focus:ring-[#428bca]",
                      matchesSelected 
                        ? "bg-zinc-900 dark:bg-zinc-150 border-zinc-900 dark:border-zinc-150 text-white dark:text-zinc-900 shadow-sm"
                        : "bg-zinc-50/50 dark:bg-zinc-950/40 border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-xs tracking-wide">{s.name}</span>
                      <span className="flex h-1.5 w-1.5 relative">
                        {s.status === 'Critical' && (
                          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
                        )}
                        <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", statusDot)} />
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[9px] w-full pt-0.5">
                      <span className={matchesSelected ? "text-zinc-400 dark:text-zinc-600 font-bold" : "text-zinc-400 font-bold"}>
                        Success: <b className="font-mono">{s.successRate}%</b>
                      </span>
                      <span className={cn(
                        "font-mono font-black",
                        s.errorRate > 5 ? "text-rose-500" : "text-emerald-500"
                      )}>
                        Errors: {s.errorRate}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-500 space-y-0.5 bg-zinc-50 dark:bg-zinc-950 p-2 rounded-lg">
              <p className="font-mono font-bold text-zinc-400 uppercase tracking-widest text-[8px]">Selected Carrier Hub</p>
              <p className="font-extrabold text-zinc-805 dark:text-zinc-200">{activeSupplier.name}</p>
              <p className="text-[9.5px]">Avg Latency: <b className="text-[#428bca] font-mono">{activeSupplier.avgLatencyMs} ms</b></p>
              <p className="text-[9.5px]">Type: <b className="text-[#428bca] font-mono">{activeSupplier.connectionType}</b></p>
            </div>
          </div>
        </div>

        {/* COMPREHENSIVE SUPPLIER-WISE LOG LIST & MASTER CLIENT MAPPER (RIGHT col-span-9) */}
        <div className="lg:col-span-9 space-y-4">

          {/* METRIC SUMMARY CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-sm">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Carrier Name</span>
              <p className="text-xs font-black text-zinc-800 dark:text-zinc-100 mt-0.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#428bca]" /> {activeSupplier.name}
              </p>
            </div>
            
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-sm">
              <span className="text-[9px] font-bold text-[#428bca] uppercase tracking-wider block font-mono font-black">Success Rate</span>
              <p className="text-xs font-black text-emerald-600 mt-0.5 font-mono">
                {activeSupplier.successRate}% Success
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-sm">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Total Traced Codes</span>
              <p className="text-xs font-black text-[#428bca] mt-0.5 font-mono">
                {activeSupplier.logs.length} Errors Traced
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2.5 rounded-lg shadow-sm">
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Failure Ratio</span>
              <p className="text-xs font-black text-rose-500 mt-0.5 uppercase font-mono">
                {activeSupplier.errorRate}% Failures
              </p>
            </div>
          </div>

          {/* 1. DATA TABLE FEATURING ALL 10 REQUESTED TRACKED PROPERTIES with FULL Up-Down & Left-Right Scroll */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
            
            <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-2.5">
              <div>
                <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#428bca]" /> Dynamic Carrier mappings List
                </h4>
                <p className="text-[9px] text-zinc-400 font-bold">
                  10 active properties with dynamic controls & inline modification.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3 h-3 text-zinc-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Seach by code or description..." 
                  className="pl-8 pr-3 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md text-[11px] outline-none text-zinc-700 dark:text-white min-w-[200px] focus:ring-1 focus:ring-[#428bca]"
                />
              </div>
            </div>

            {/* UP-DOWN SCROLL & LEFT-RIGHT SCROLL ENABLING WRAPPER */}
            <div className="overflow-x-auto overflow-y-auto max-h-[460px] custom-scrollbar-dlr w-full border-b border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[1300px] table-auto border-collapse">
                <thead className="sticky top-0 z-20 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
                  <tr className="text-zinc-400 font-black uppercase text-[9px] tracking-wider">
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800 sticky left-0 bg-zinc-50 dark:bg-zinc-950 z-30">Vendor</th>
                    <th className="px-3 py-2 text-rose-500 font-bold border-r border-zinc-200 dark:border-zinc-800">Vendor Error Code (Red)</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Vendor Error Message</th>
                    <th className="px-3 py-2 bg-blue-500/5 text-[#428bca] font-black text-center border-r border-zinc-200 dark:border-zinc-800">Standard Error Code</th>
                    <th className="px-3 py-2 bg-blue-500/5 text-[#428bca] font-black border-r border-zinc-200 dark:border-zinc-800">Standard Error Description</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Category</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Severity</th>
                    <th className="px-3 py-2 text-center border-r border-zinc-200 dark:border-zinc-800">AI Confidence</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Last Seen</th>
                    <th className="px-3 py-2 text-center border-r border-zinc-200 dark:border-zinc-800">Status</th>
                    <th className="px-3 py-2 text-center sticky right-0 bg-zinc-50 dark:bg-zinc-950 z-30">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 font-sans">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-3 py-10 text-center text-zinc-400 italic">
                        No tracked error mappings found matching current query.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-800/35 transition-all">
                        
                        {/* 1. VENDOR (STAYS FIXED LEFT ON HORIZONTAL SCROLL) */}
                        <td className="px-3 py-1.5 font-extrabold text-zinc-800 dark:text-zinc-200 border-r border-zinc-200 dark:border-zinc-800 sticky left-0 bg-white dark:bg-zinc-900 z-10">
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-850 rounded-md font-mono text-[10px] font-black">
                            {log.vendorName}
                          </span>
                        </td>

                        {/* 2. VENDOR ERROR CODE */}
                        <td className="px-3 py-1.5 border-r border-zinc-200 dark:border-zinc-800">
                          <span className="font-mono font-black text-rose-600 block text-xs tracking-wider">
                            {log.code}
                          </span>
                        </td>

                        {/* 3. VENDOR ERROR MESSAGE */}
                        <td className="px-3 py-1.5 max-w-[220px] truncate text-zinc-650 dark:text-zinc-300 font-bold border-r border-zinc-200 dark:border-zinc-800">
                          {log.description}
                        </td>

                        {/* 4. STANDARD ERROR CODE */}
                        <td className="px-3 py-1.5 bg-blue-500/5 text-center border-r border-zinc-200 dark:border-zinc-800">
                          <input 
                            type="text" 
                            value={log.mappedCustomerCode}
                            onChange={(e) => handleUpdateCustomerCode(log.id, e.target.value)}
                            placeholder="Client code..."
                            className="w-18 px-1.5 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded text-center text-xs font-mono font-black text-[#428bca] outline-none focus:ring-1 focus:ring-[#428bca]"
                            title="Edit standard customer faced code mapping"
                          />
                        </td>

                        {/* 5. STANDARD ERROR DESCRIPTION */}
                        <td className="px-3 py-1.5 bg-blue-500/5 border-r border-zinc-200 dark:border-zinc-800">
                          <input 
                            type="text" 
                            value={log.mappedCustomerDescription}
                            onChange={(e) => handleUpdateCustomerDescription(log.id, e.target.value)}
                            placeholder="Define customer description..."
                            className="w-80 px-2 py-0.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 rounded text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-[#428bca]"
                            title="Edit standard customer faced description mapping"
                          />
                        </td>

                        {/* 6. CATEGORY */}
                        <td className="px-3 py-1.5 border-r border-zinc-200 dark:border-zinc-800">
                          <select
                            value={log.category}
                            onChange={(e) => handleUpdateCategory(log.id, e.target.value as any)}
                            className="px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[11px] font-bold uppercase text-zinc-700 dark:text-zinc-200 rounded outline-none"
                          >
                            <option value="Permanent">Permanent</option>
                            <option value="Transient">Transient</option>
                            <option value="Route Block">Route Block</option>
                          </select>
                        </td>

                        {/* 7. SEVERITY */}
                        <td className="px-3 py-1.5 border-r border-zinc-200 dark:border-zinc-800">
                          <select
                            value={log.severity}
                            onChange={(e) => handleUpdateSeverity(log.id, e.target.value as any)}
                            className={cn(
                              "px-2 py-0.5 text-[10.5px] font-black rounded border cursor-pointer outline-none",
                              log.severity === 'Critical' ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20" :
                              log.severity === 'Major' ? "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/20" :
                              log.severity === 'Warning' ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20" :
                              "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20"
                            )}
                          >
                            <option value="Critical">Critical</option>
                            <option value="Major">Major</option>
                            <option value="Warning">Warning</option>
                            <option value="Minor">Minor</option>
                          </select>
                        </td>

                        {/* 8. AI CONFIDENCE */}
                        <td className="px-3 py-1.5 text-center border-r border-zinc-200 dark:border-zinc-800">
                          <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/20 text-teal-600 text-[10.5px] font-mono font-black border border-teal-200/40">
                            {log.confidence}%
                          </span>
                        </td>

                        {/* 9. LAST SEEN */}
                        <td className="px-3 py-1.5 text-zinc-500 dark:text-zinc-400 font-mono text-[11px] font-bold border-r border-zinc-200 dark:border-zinc-800">
                          {log.lastSeen}
                        </td>

                        {/* 10. STATUS */}
                        <td className="px-3 py-1.5 text-center border-r border-zinc-200 dark:border-zinc-800">
                          <select
                            value={log.status}
                            onChange={(e) => handleUpdateStatus(log.id, e.target.value as any)}
                            className={cn(
                              "px-2 py-0.5 text-[10.5px] font-black rounded border cursor-pointer outline-none font-sans",
                              log.status === 'Active Mapper' ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20" :
                              log.status === 'Pending Approval' ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20" :
                              "bg-zinc-100 border-zinc-200 text-zinc-650 dark:bg-zinc-805"
                            )}
                          >
                            <option value="Active Mapper">Active Mapper</option>
                            <option value="Pending Approval">Pending Approval</option>
                            <option value="Suspended">Suspended</option>
                          </select>
                        </td>

                        {/* ACTIONS SAVE & DELETE (STAYS FIXED RIGHT ON HORIZONTAL SCROLL) */}
                        <td className="px-3 py-1.5 text-center sticky right-0 bg-white dark:bg-zinc-900 z-10">
                          <div className="flex items-center gap-1.5 justify-center">
                            <button
                              onClick={() => handleAIMapRow(log.id, log.description)}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-black text-[10.5px] px-2 py-1 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1"
                              title="AI Auto-Map using Master Categories Base"
                            >
                              <Sparkles className="w-3 h-3 text-white" />
                              <span>AI Match</span>
                            </button>
                            <button
                              onClick={() => handleSaveMappingTrigger(log)}
                              className="bg-[#428bca] hover:bg-sky-600 text-white font-black text-[10.5px] px-3 py-1 rounded-lg transition-all uppercase cursor-pointer shadow-sm"
                              title="Update live parameters"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-all"
                              title="Remove mapping rule"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row justify-between items-center text-[11px] gap-2">
              <span className="text-zinc-500 font-semibold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#428bca]" />
                Modify any fields directly inside the cells, and press the <b className="text-[#428bca]">"Save"</b> button. Use the bottom options to insert new codes.
              </span>
              <span className="text-[#428bca] font-black flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#428bca] animate-pulse"></span>
                Horizontal & Vertical Scroll Active
              </span>
            </div>
          </div>

          {/* DUAL OPTIONS CONTROLLER CONTAINER: MANUAL SINGLE REGISTER vs CSV BATCH IMPORT */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden text-left">
            
            {/* TABS HEADER */}
            <div className="bg-zinc-50 dark:bg-zinc-950/60 p-1  border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveInputTab('manual')}
                  className={cn(
                    "px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                    activeInputTab === 'manual' 
                      ? "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[#428bca] shadow-sm"
                      : "text-zinc-500 hover:text-zinc-850"
                  )}
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  1. Manually Add Custom Error Code
                </button>
                <button
                  onClick={() => setActiveInputTab('import')}
                  className={cn(
                    "px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5",
                    activeInputTab === 'import' 
                      ? "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-emerald-600 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-850"
                  )}
                >
                  <Upload className="w-3.5 h-3.5" />
                  2. Bulk Import Code Mappings (Excel/CSV)
                </button>
              </div>

              <div className="hidden sm:block pr-4">
                <span className="text-[10px] font-bold text-zinc-400">Target Supplier: <b className="text-zinc-700 dark:text-zinc-350">{activeSupplier.name}</b></span>
              </div>
            </div>

            {/* TAB CONTENT: 1. MANUAL SINGLE REGISTER */}
            {activeInputTab === 'manual' && (
              <div className="p-6 space-y-4">
                <div className="pb-2 border-b border-zinc-100 dark:border-zinc-850">
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 italic">
                    Add Individual Custom Map Entry for {activeSupplier.name}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Configure custom parameters for a raw vendor delivery code below to dynamically feed the customer-facing pipeline.
                  </p>
                </div>

                <form onSubmit={handleAddNewErrorRule} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
                  
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Target Trunk Supplier
                    </label>
                    <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-extrabold rounded-xl text-center">
                      {activeSupplier.name}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Vendor Error Code <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. 0x000000ff"
                      value={newVendorCode}
                      onChange={(e) => setNewVendorCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none font-mono focus:border-[#428bca]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Vendor Error Message <span className="text-rose-500 font-bold">*</span>
                    </label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Subscriber address inactive or invalid"
                      value={newVendorMessage}
                      onChange={(e) => setNewVendorMessage(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none focus:border-[#428bca]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider flex justify-between items-center">
                      <span>standard customer code</span>
                      <button
                        type="button"
                        onClick={handleAIFillForm}
                        className="text-[9px] font-bold text-amber-600 bg-amber-500/10 hover:bg-amber-500/20 active:bg-amber-500/30 border border-amber-500/20 rounded px-1.5 py-0.5 transition cursor-pointer"
                        title="Auto-match keyword logs and pull matching base categories"
                      >
                        ✨ AI Suggest
                      </button>
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. 104"
                      value={newStdCode}
                      onChange={(e) => setNewStdCode(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none font-mono focus:border-[#428bca]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Customer Status Category
                    </label>
                    <select 
                      value={newCustomerStatus}
                      onChange={(e) => setNewCustomerStatus(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none focus:border-[#428bca]"
                    >
                      <option value="REJECTD">REJECTD</option>
                      <option value="UNDELIV">UNDELIV</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="BLOCKED">BLOCKED</option>
                      <option value="CONGESTION">CONGESTION</option>
                      <option value="SUCCESS_MAPPED">SUCCESS MAPPED</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Standard customer description
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Subscriber status is inactive or invalid"
                      value={newStdDescription}
                      onChange={(e) => setNewStdDescription(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-semibold outline-none focus:border-[#428bca]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Stability Category
                    </label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-220 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none focus:border-[#428bca]"
                    >
                      <option value="Transient">Transient</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Route Block">Route Block</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Severity Class
                    </label>
                    <select 
                      value={newSeverity} 
                      onChange={(e) => setNewSeverity(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-220 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none focus:border-[#428bca]"
                    >
                      <option value="Warning">Warning</option>
                      <option value="Critical">Critical</option>
                      <option value="Major">Major</option>
                      <option value="Minor">Minor</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      AI Trace Confidence (%)
                    </label>
                    <input 
                      type="number"
                      min="50"
                      max="100"
                      value={newConfidence}
                      onChange={(e) => setNewConfidence(parseInt(e.target.value) || 95)}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-750 rounded-xl text-xs font-mono font-black outline-none focus:border-[#428bca]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 font-mono tracking-wider">
                      Mapping Status
                    </label>
                    <select 
                      value={newStatus} 
                      onChange={(e) => setNewStatus(e.target.value as any)}
                      className="w-full px-2 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-220 dark:border-zinc-750 rounded-xl text-xs font-bold outline-none focus:border-[#428bca]"
                    >
                      <option value="Active Mapper">Active Mapper</option>
                      <option value="Pending Approval">Pending Approval</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  <div className="md:col-span-4 pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#428bca] hover:bg-sky-600 text-white font-black uppercase text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" /> Create Live Mapping Rule
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB CONTENT: 2. BULK IMPORT CSV MAPPINGS */}
            {activeInputTab === 'import' && (
              <div className="p-6 space-y-4">
                <div className="pb-2 border-b border-zinc-100 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 text-emerald-600">
                      Bulk Batch Import Supplier Error Code Definitions
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      Paste multiple raw carrier delivery logs or load text files directly to automate downstream customer code association.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <button
                      onClick={handleLoadDemoTemplate}
                      className="px-2.5 py-1 text-[10.5px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 dark:bg-zinc-950 border border-amber-200 dark:border-zinc-800 rounded-lg hover:bg-amber-100/60 cursor-pointer"
                      title="Load sample CSV into raw input"
                    >
                      📋 demo Template
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-7 space-y-2.5">
                    <label className="text-[10.5px] font-black uppercase text-zinc-400 font-mono tracking-wider flex items-center justify-between">
                      <span>Copy-Paste CSV Raw Lines (Comma or Semicolon Separated):</span>
                      <span className="text-[9.5px] text-zinc-400">Order: Code, Description, CustomerCode, CustomerDescription</span>
                    </label>
                    <textarea
                      rows={6}
                      value={csvRawText}
                      onChange={(e) => setCsvRawText(e.target.value)}
                      placeholder={`0x000000a2,Destination route blocked,103,Route capacity limit exceeded\n0x000000ff,Invalid Destination Address,104,Invalid Cellular Subscriber`}
                      className="w-full p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-mono outline-none focus:ring-1 focus:ring-emerald-500 custom-scrollbar-dlr h-36"
                    />
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-[10px] text-zinc-500">
                        * Skips headers matching words <code className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono text-[9px]">"vendor_code"</code>.
                      </div>
                      <button
                        onClick={() => handleProcessBulkImport(csvRawText)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" /> Parse & BULK Append to List
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-5 bg-gradient-to-br from-zinc-50/50 block dark:from-zinc-950/20 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
                    <span className="text-[9.5px] font-black uppercase text-zinc-400 font-mono tracking-widest block">
                      📁 Select and upload CSV File
                    </span>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Drag and drop your standard cellular routing CSV logs here, or use the picker below. The parser handles comma, semicolon, tab or pipe delimiters dynamically.
                    </p>

                    <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:bg-zinc-100/30 dark:hover:bg-zinc-900/30 transition-all text-center relative cursor-pointer group">
                      <input 
                        type="file" 
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                        title="Upload formatted code trace"
                      />
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto group-hover:text-emerald-500 transition-all" />
                      <span className="text-[10px] font-bold text-zinc-500 block mt-2">
                        Browse .csv / .txt trace files
                      </span>
                    </div>

                    {importStatusMessage && (
                      <div className="p-2.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-[10.5px] font-bold">
                        {importStatusMessage}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* INTERACTIVE ERROR CODE MAPPING WITH CUSTOMER REPORT SECTION */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden text-left">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-sans">
                  <ShieldAlert className="w-5 h-5 text-emerald-600 shrink-0" />
                  Supplier-to-Customer Error Mapping & Statistics Report
                </h4>
                <p className="text-[10px] text-zinc-400 font-bold">
                  Derived real-time report aggregating all active mappings, occurrence volumes, and supplier-wise associations.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 font-mono text-[9.5px] rounded-lg font-black uppercase tracking-wider">
                Active Analysis
              </span>
            </div>

            {/* QUICK STATS ROW */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-150 dark:divide-zinc-800 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/20">
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Unique Customer Codes</span>
                <p className="text-lg font-black text-zinc-800 dark:text-zinc-150 font-mono mt-0.5">
                  {customerMappingReportList.length}
                </p>
              </div>
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Mapped Supplier Rules</span>
                <p className="text-lg font-black text-[#428bca] font-mono mt-0.5">
                  {customerMappingReportList.reduce((acc, curr) => acc + curr.associations.length, 0)}
                </p>
              </div>
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Standardized Event Vol</span>
                <p className="text-lg font-black text-rose-500 font-mono mt-0.5">
                  {customerMappingReportList.reduce((acc, curr) => acc + curr.totalOccurrence, 0).toLocaleString()} DLRs
                </p>
              </div>
              <div className="p-4 text-center">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">Mapping Success Index</span>
                <p className="text-lg font-black text-emerald-600 font-mono mt-0.5">
                  {(customerMappingReportList.length > 0) ? "100.0%" : "0%"}
                </p>
              </div>
            </div>

            {/* MAPPED CODES ACCORDION PANEL */}
            <div className="divide-y divide-zinc-150 dark:divide-zinc-800 font-sans">
              {customerMappingReportList.length === 0 ? (
                <div className="p-10 text-center text-zinc-400 italic text-xs">
                  No mappings available yet to generate a report. Use the form above to add a mapping rule.
                </div>
              ) : (
                customerMappingReportList.map(item => {
                  const isExpanded = expandedCustomerCode === item.customerCode;
                  const statusColors: Record<string, string> = {
                    REJECTD: 'bg-rose-50 border-rose-200/50 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40',
                    UNDELIV: 'bg-orange-50 border-orange-200/50 text-orange-700 dark:bg-orange-950/20 dark:border-orange-900/40',
                    EXPIRED: 'bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-750 dark:text-zinc-305',
                    BLOCKED: 'bg-amber-50 border-amber-200/50 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/40',
                    CONGESTION: 'bg-blue-50 border-blue-200/50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/40',
                    SUCCESS_MAPPED: 'bg-emerald-50 border-emerald-200/50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/40',
                  };

                  return (
                    <div key={item.customerCode} className="transition-all hover:bg-zinc-50/20 dark:hover:bg-zinc-950/10">
                      {/* HEADER SUMMARY LINE */}
                      <div 
                        onClick={() => setExpandedCustomerCode(isExpanded ? null : item.customerCode)}
                        className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none group"
                      >
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Code Badge */}
                          <div className="px-3 py-2 bg-[#428bca]/15 text-[#428bca] border border-[#428bca]/30 rounded-xl font-mono text-center min-w-[58px] shrink-0 font-black text-xs md:text-sm shadow-sm transition-all group-hover:scale-105">
                            {item.customerCode}
                          </div>
                          <div className="space-y-1 my-auto min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-extrabold text-xs text-zinc-800 dark:text-zinc-100 tracking-wide font-sans truncate">
                                {item.description}
                              </span>
                              <span className={cn(
                                "text-[9.5px] font-black border uppercase tracking-wider px-2 py-0.5 rounded font-mono shrink-0",
                                statusColors[item.status] || 'bg-zinc-50 border-zinc-200 text-zinc-700'
                              )}>
                                {item.status}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px]">
                              <span className="text-zinc-400 font-medium whitespace-nowrap">Mapped Supplier Sources:</span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {item.associations.map((assoc, idx) => (
                                  <span key={idx} className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono text-[9px] px-2 py-0.5 rounded font-bold text-zinc-650 dark:text-zinc-300">
                                    {assoc.supplierName}: <b className="text-rose-500 font-black">{assoc.vendorCode}</b>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right metrics and toggle arrow */}
                        <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-none border-zinc-100 dark:border-zinc-800/80">
                          <div className="text-left md:text-right">
                            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block font-bold">Accumulated Events</span>
                            <span className="text-xs font-black text-zinc-700 dark:text-zinc-200 font-mono">
                              {item.totalOccurrence.toLocaleString()} incidents
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-zinc-400 font-mono bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
                              {item.associations.length} {item.associations.length === 1 ? 'Rule' : 'Rules'}
                            </span>
                            <div className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700">
                              <ChevronDown className={cn(
                                "w-4 h-4 text-zinc-500 transition-all duration-300",
                                isExpanded ? "transform rotate-180 text-[#428bca]" : ""
                              )} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DRILL DOWN EXPANDED CONTENT PANEL */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-150 dark:border-zinc-800/60 animate-in fade-in duration-300">
                          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805/80 rounded-xl overflow-hidden mt-2 shadow-inner">
                            <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-extrabold uppercase text-zinc-400 font-mono tracking-wider">
                              Mapped Carrier Signal Details
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px] font-sans">
                                <thead>
                                  <tr className="bg-zinc-50/80 dark:bg-zinc-950/40 border-b border-zinc-150 dark:border-zinc-800 text-zinc-400 font-black uppercase text-[9px] tracking-widest">
                                    <th className="px-4 py-3">Carrier / Trunk</th>
                                    <th className="px-4 py-3">Traced Error Code</th>
                                    <th className="px-4 py-3">Raw Message Details</th>
                                    <th className="px-4 py-3 text-center">Stability Category</th>
                                    <th className="px-4 py-3 text-center">Severity Type</th>
                                    <th className="px-4 py-3 text-right">Occurrence Share</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800">
                                  {item.associations.map((assoc, idx) => {
                                    const categoryColors = {
                                      Permanent: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400',
                                      Transient: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400',
                                      'Route Block': 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400',
                                    };
                                    return (
                                      <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors">
                                        <td className="px-4 py-3 font-extrabold text-[#428bca] font-mono">
                                          {assoc.supplierName}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-black text-rose-500">
                                          {assoc.vendorCode}
                                        </td>
                                        <td className="px-4 py-3 text-zinc-650 dark:text-zinc-300 font-bold max-w-[250px] truncate">
                                          {assoc.vendorDescription}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className={cn("px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider", categoryColors[assoc.category as any] || categoryColors.Transient)}>
                                            {assoc.category}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                          <span className={cn(
                                            "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wide border",
                                            assoc.severity === 'Critical' ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900" :
                                            assoc.severity === 'Major' ? "bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-950/20" :
                                            assoc.severity === 'Warning' ? "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/20" :
                                            "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/20"
                                          )}>
                                            {assoc.severity}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-bold text-zinc-550 dark:text-zinc-300">
                                          {assoc.occurrence.toLocaleString()} events
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* MASTER STANDARD ERROR CATEGORIES BASE (AI MAPPING DICTIONARY) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden text-left">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 font-sans">
                    📚 Master Error Categories template base (AI Mapping Source)
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-bold">
                    Add or modify standard customer error definitions. The AI Match engine scans these keywords to normalize raw supplier returns.
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 font-mono text-[9px] rounded-md font-black uppercase tracking-wider shrink-0">
                ✨ AI match dictionary
              </span>
            </div>

            {/* MASTER CODES ADD FORM */}
            <div className="p-4 bg-zinc-50/30 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800 text-xs">
              <form onSubmit={handleAddMasterCategory} className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block">Std Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 110"
                    value={mcCode}
                    onChange={(e) => setMcCode(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white dark:bg-zinc-950 border border-zinc-250 dark:border-zinc-750 rounded-md text-xs outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block">Status category</label>
                  <select
                    value={mcStatus}
                    onChange={(e) => setMcStatus(e.target.value as any)}
                    className="w-full px-2 py-1 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 rounded-md text-xs outline-none focus:ring-1 focus:ring-amber-500 font-bold text-zinc-700 dark:text-zinc-250"
                  >
                    <option value="REJECTD">REJECTD</option>
                    <option value="UNDELIV">UNDELIV</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="BLOCKED">BLOCKED</option>
                    <option value="CONGESTION">CONGESTION</option>
                    <option value="SUCCESS_MAPPED">SUCCESS_MAPPED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block">Stability</label>
                  <select
                    value={mcCategory}
                    onChange={(e) => setMcCategory(e.target.value as any)}
                    className="w-full px-2 py-1 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 rounded-md text-xs outline-none focus:ring-1 focus:ring-amber-500 font-bold text-zinc-700 dark:text-zinc-250"
                  >
                    <option value="Transient">Transient</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Route Block">Route Block</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block">Severity</label>
                  <select
                    value={mcSeverity}
                    onChange={(e) => setMcSeverity(e.target.value as any)}
                    className="w-full px-2 py-1 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 rounded-md text-xs outline-none focus:ring-1 focus:ring-amber-500 font-bold text-zinc-700 dark:text-zinc-250"
                  >
                    <option value="Warning">Warning</option>
                    <option value="Critical">Critical</option>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="Standard description text"
                    value={mcDescription}
                    onChange={(e) => setMcDescription(e.target.value)}
                    className="w-full px-2.5 py-1 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 rounded-md text-xs outline-none focus:ring-1 focus:ring-amber-500 text-zinc-800 dark:text-zinc-200 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-400 uppercase block">Keywords (comma split)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. absent, busy, timeout"
                    value={mcKeywords}
                    onChange={(e) => setMcKeywords(e.target.value)}
                    className="w-full px-2.5 py-1 border border-zinc-250 dark:border-zinc-750 bg-white dark:bg-zinc-950 rounded-md text-xs outline-none focus:ring-1 focus:ring-amber-500 text-zinc-800 dark:text-zinc-200"
                  />
                </div>
                <div className="col-span-2 md:col-span-6 flex justify-end pt-1 bg-zinc-50 dark:bg-zinc-950/30 p-2 rounded-lg">
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-[10.5px] rounded-lg transition-all shadow-sm cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" /> Register Master Category Template
                  </button>
                </div>
              </form>
            </div>

            {/* MASTER CODES SCROLLABLE GRID */}
            <div className="overflow-x-auto overflow-y-auto max-h-[300px] custom-scrollbar-dlr">
              <table className="w-full text-left text-xs whitespace-nowrap table-auto border-collapse">
                <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 z-10">
                  <tr className="text-zinc-400 font-extrabold uppercase text-[9px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Std Code</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Mapped Customer Face Description</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Status</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Stability Type</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">Severity</th>
                    <th className="px-3 py-2 border-r border-zinc-200 dark:border-zinc-800">AI Matching Tokens</th>
                    <th className="px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800 text-zinc-750 dark:text-zinc-300">
                  {masterCategories.map((mc) => {
                    const statusColorsMap: Record<string, string> = {
                      REJECTD: 'bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-950/20 dark:border-rose-900/40',
                      UNDELIV: 'bg-orange-50 text-orange-700 border border-orange-200/50 dark:bg-orange-950/20 dark:border-orange-900/40',
                      EXPIRED: 'bg-zinc-100 text-zinc-700 border border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700/50',
                      BLOCKED: 'bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/40',
                      CONGESTION: 'bg-blue-50 text-blue-700 border border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-900/40',
                      SUCCESS_MAPPED: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-900/40',
                    };

                    return (
                      <tr key={mc.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="px-3 py-1.5 font-mono font-black text-[#428bca] border-r border-zinc-200 dark:border-zinc-800">
                          {mc.customerCode}
                        </td>
                        <td className="px-3 py-1.5 font-bold border-r border-zinc-200 dark:border-zinc-800 md:max-w-xs truncate" title={mc.customerDescription}>
                          {mc.customerDescription}
                        </td>
                        <td className="px-3 py-1.5 border-r border-zinc-200 dark:border-zinc-800">
                          <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider", statusColorsMap[mc.status] || 'bg-zinc-100 text-zinc-700')}>
                            {mc.status}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-zinc-500 font-bold font-mono text-[9.5px] border-r border-zinc-200 dark:border-zinc-800">
                          {mc.category}
                        </td>
                        <td className="px-3 py-1.5 border-r border-zinc-200 dark:border-zinc-800">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[9px] font-black uppercase border",
                            mc.severity === 'Critical' ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-950/15" :
                            mc.severity === 'Major' ? "bg-orange-50 border-orange-100 text-orange-600 dark:bg-orange-950/15" :
                            mc.severity === 'Warning' ? "bg-amber-50 border-amber-100 text-amber-600 dark:bg-amber-950/15" :
                            "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/15"
                          )}>
                            {mc.severity}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 max-w-[200px] truncate border-r border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 font-mono italic" title={mc.keywords}>
                          {mc.keywords}
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteMasterCategory(mc.id, mc.customerCode)}
                            className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition cursor-pointer"
                            title="Remove Category template"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 text-[10.5px] text-zinc-400 font-bold border-t border-zinc-200 dark:border-zinc-800">
              💡 Any rule registered here will automatically update the keyword dictionary. Use the <b className="text-amber-500">"AI Match"</b> or <b className="text-amber-500">"AI Suggest"</b> buttons above to standardized mapped routes instantly.
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
