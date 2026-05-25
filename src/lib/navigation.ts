import { MenuOption } from '../types';

export interface NavSubItem {
  id: string;
  label: string;
  items?: NavSubItem[];
}

export interface NavItem {
  id: MenuOption;
  label: string;
  items?: NavSubItem[];
}

export const NAVIGATION: NavItem[] = [
  { id: 'Dashboard', label: 'Dashboard' },
  { id: 'Enterprise', label: 'Enterprise' },
  {
    id: 'Finance',
    label: 'Finance',
    items: [
      { id: 'transaction', label: 'Payment' },
      { id: 'invoice', label: 'Invoices & Customer Invoice' },
      { id: 'vendor-invoice', label: 'Vendor Invoice' },
      { id: 'soa', label: 'SOA' },
      { id: 'currency', label: 'Currency' },
      { id: 'currency-exchange', label: 'Currency Exchange' },
      { id: 'enterprise-balance', label: 'Enterprise Balance' },
      { id: 'billing-cycle', label: 'Billing Cycle' },
    ],
  },
  {
    id: 'Rate',
    label: 'Rate',
    items: [
      { id: 'imap-mail-account', label: 'IMAP Mail Account' },
      { id: 'file-template', label: 'File Template' },
      { id: 'auto-upload-rules', label: 'Auto Upload Rules' },
      { id: 'auto-upload-failed-report', label: 'Auto Upload Failed Report' },
      { id: 'auto-upload-report', label: 'Auto Upload Report' },
      { id: 'rate-table', label: 'Customer Rate Table' },
      { id: 'vendor-rate-table', label: 'Vendor Rate Table' },
      { id: 're-rating', label: 'Re-Rating' },
      { id: 'rate-lookup', label: 'Rate Analytics' },
    ],
  },
  {
    id: 'Product',
    label: 'Product',
    items: [
      { id: 'product-category', label: 'Product Category' },
      { id: 'sms-wholesale-business', label: 'SMS Product' },
    ],
  },
  {
    id: 'SMS Services',
    label: 'SMS Services',
    items: [
      { id: 'translation-rule', label: 'Translation Rule' },
      { id: 'translation-rule-group', label: 'Translation Rule Group' },
      { id: 'hlr',
        label: 'HLR',
        items: [
          { id: 'hlr-provider', label: 'HLR Provider' },
          { id: 'hlr-rule', label: 'HLR Rule' },
          { id: 'hlr-rule-group', label: 'HLR Rule Group' },
        ],
      },
      { id: 'recipient-groups', label: 'Recipient Groups' },
      { id: 'notification', label: 'Notification' },
      { id: 'email-logs', label: 'Email Logs' },
      { id: 'firewall', label: 'Firewall' },
      { id: 'mccmnc-unique-codes', label: 'MCCMNC Unique Codes' },
    ],
  },
  {
    id: 'Report',
    label: 'Report',
    items: [
      { id: 'master-report', label: 'All Reports' },
      { id: 'bilateral-report', label: 'Bilateral Report' },
      { id: 'negative-margin-report', label: 'Negative Margin Report' },
      { id: 'route-simulator', label: 'Route Simulator' },
      { id: 'tcp-dump', label: 'TCP Dump' },
      { id: 'network-diagnosis', label: 'Network Diagnosis' },
    ],
  },
  {
    id: 'Admin',
    label: 'Admin',
    items: [
      { id: 'business-company', label: 'Business Company' },
      { id: 'email-template', label: 'Email Template' },
      { id: 'customer-portal', label: 'Customer Portal' },
      { id: 'report-template', label: 'Report Template' },
      { id: 'task-manager', label: 'Task Manager' },
    ],
  },
];
