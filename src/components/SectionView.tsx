import React from 'react';
import { DataTableView } from './DataTableView';
import { DetailsView } from './DetailsView';
import { SearchView } from './SearchView';
import { RateLookupView } from './RateLookupView';
import { AdminFormView } from './AdminForms';
import { 
  TrafficInsightsFormView,
  ReportFormView 
} from './TrafficInsightsForms';
import { EnterpriseDetailsView } from './EnterpriseDetails';
import { SMSProductMateForm } from './SMSProductMateForm';
import { ReportDashboard } from './ReportDashboard';
import { FirewallForm } from './FirewallForm';
import { RecipientGroupsView } from './RecipientGroupsView';
import { NAVIGATION } from '../lib/navigation';

interface SectionViewProps {
  menu: string;
  theme: 'light' | 'dark';
}

export function SectionView({ menu, theme }: SectionViewProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [activeReport, setActiveReport] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsAdding(false);
    setActiveReport(null);
  }, [menu]);

  if (menu === 'Recipient Groups') {
    return <RecipientGroupsView theme={theme} />;
  }

  // Find parent menu for breadcrumbs
  const getBreadcrumbs = () => {
    if (activeReport) return `Reports / ${activeReport}`;
    for (const mainItem of NAVIGATION) {
      if (mainItem.label === menu) return mainItem.label;
      if (mainItem.items) {
        for (const subItem of mainItem.items) {
          if (subItem.label === menu) return `${mainItem.label} / ${subItem.label}`;
          if (subItem.items) {
            for (const deepItem of subItem.items) {
              if (deepItem.label === menu) return `${mainItem.label} / ${subItem.label} / ${deepItem.label}`;
            }
          }
        }
      }
    }
    return menu;
  };

  const breadcrumbs = getBreadcrumbs();

  // ... existing tableConfig ...
  const tableConfig: Record<string, string[]> = {
    'Transaction': ['ID', 'Name', 'Payment Date', 'Transaction Time', 'Mode of Payment', 'Currency', 'Invoice Number', 'Amount', 'Payment Status'],
    'Payment': ['ID', 'Name', 'Payment Date', 'Transaction Time', 'Mode of Payment', 'Currency', 'Invoice Number', 'Amount', 'Payment Status'],
    'Invoice': ['Invoice No', 'PDF', 'Charge Details', 'Enterprise Name', 'Enterprise Type', 'Invoice Type', 'Billing Type', 'Invoice Date', 'Usage Start', 'Usage End', 'Due Date', 'Amount', 'Opening Balance', 'Usage Charges', 'Closing Balance', 'Email Status', 'Status', 'Action'],
    'Invoices & Customer Invoice': ['Invoice No', 'PDF', 'Charge Details', 'Enterprise Name', 'Enterprise Type', 'Invoice Type', 'Billing Type', 'Invoice Date', 'Usage Start', 'Usage End', 'Due Date', 'Amount', 'Opening Balance', 'Usage Charges', 'Closing Balance', 'Email Status', 'Status', 'Action'],
    'Currency Exchange': ['ID', 'SOURCE CURRENCY', 'TARGET CURRENCY', 'BANK RATE', 'SPREAD (%)', 'SELL RATE', 'AUTO UPDATE', 'STATUS', 'EFFECTIVE FROM'],
    'Currency': ['ID', 'Currency Name', 'ISO Code', 'Symbol', 'Status', 'Updated By', 'Updated Time'],
    'Enterprise Balance': ['Enterprise Name', 'Customer Balance', 'Vendor Balance', 'Net Balance (Customer - Vendor)', 'Account Manager', 'Customer Credit', 'Billing Cycle', 'Currency'],
    'Billing Cycle': ['Info ID', 'Name', 'Usage Days', 'Due Days', 'Billing Type', 'Week Day', 'Updated By', 'Updated Time'],
    'Vendor Invoice': ['ID', 'Enterprise Name', 'Vendor Trunk', 'Invoice Number', 'Charge Volume', 'Charge Amount', 'Invoice Date', 'Invoice Due Date', 'Invoice From Date', 'Invoice To Date', 'Dispute Amount', 'Created By', 'Created Time'],
    'Product Category': ['Info ID', 'Category Name', 'Updated By'],
    'SMS Product': ['Product ID', 'Product Name', 'Category', 'Currency', 'Type', 'Status'],
    'IMAP Mail Account': ['ID', 'Mail account name', 'IMAP Mail Account Email', 'IMAP Server', 'IMAP Port', 'AUTH Type', 'Account User ID', 'Status', 'Updated By', 'Updated Time'],
    'File Template': ['Id', 'File template name', 'Skip Row', 'Updated By', 'Updated Time'],
    'Auto Upload Rules': ['Info ID', 'AUTO UPLOAD RULES NAME', 'ENTERPRISE NAME', 'VENDOR TRUNK', 'IMAP MAIL ACCOUNT NAME', 'FILE TEMPLATE NAME', 'STATUS', 'UPDATED BY', 'UPDATED TIME'],
    'Auto Upload Failed Report': ['Id', 'IMAP mail Account', 'Auto Upload Rules', 'From Email', 'To Email', 'Subject', 'File name', 'Email Id', 'Error', 'Email Receive Time', 'Email Read Time', 'Update Time'],
    'Auto Upload Report': ['ID', 'Auto upload Rule name', 'From Email', 'To Email', 'Subject', 'Trunk Type', 'Vendor Trunk', 'Status', 'Email Receive Time', 'Email Read Time', 'Comments', 'File Status', 'Rejected by', 'Rejected Time'],
    'Rate Table': ['RATE TABLE ID', 'NAME', 'PRODUCT CATEGORY', 'CURRENCY', 'CUSTOMER TRUNK', 'DESCRIPTION', 'UPDATED BY'],
    'Customer Rate Table': ['RATE TABLE ID', 'NAME', 'PRODUCT CATEGORY', 'CURRENCY', 'CUSTOMER TRUNK', 'DESCRIPTION', 'UPDATED BY'],
    'Vendor Rate Table': ['RATE TABLE ID', 'NAME', 'PRODUCT CATEGORY', 'CURRENCY', 'VENDOR TRUNK', 'DESCRIPTION', 'UPDATED BY'],
    'Translation Rule': ['ID', 'TRANSLATION RULE NAME', 'TYPE', 'ACTION', 'CONTINUES', 'SENDER ID', 'DNID', 'MCCMNC', 'MESSAGE TEXT'],
    'Translation Rule Group': ['ID', 'TRANSLATION RULE GROUP NAME', 'TYPE', 'UPDATED BY'],
    'HLR Provider': ['ID', 'NAME', 'URL', 'STATUS', 'UPDATED BY'],
    'HLR Rule': ['ID', 'NAME', 'PROVIDER', 'TYPE', 'STATUS', 'UPDATED BY'],
    'HLR Rule Group': ['ID', 'NAME', 'UPDATED BY'],
    'Notification': ['ENTERPRISE NAME', 'CUSTOMER TRUNK NAME', 'CATEGORY', 'PROTOCOL', 'CAPACITY', 'STATUS', 'UPDATED BY'],
    'Email Logs': ['INFO ID', 'ENTERPRISE NAME', 'CUSTOMER TRUNK NAME', 'VENDOR TRUNK', 'EMAIL TYPE', 'STATUS', 'RATE DATE', 'FILE', 'ERROR', 'TO ADDRESS', 'CC ADDRESS'],
    'Firewall': ['IP ADDRESS', 'FILTER'],
    'MCCMNC Unique Codes': ['Info ID', 'MCC', 'MNC', 'Original MNC', 'MCCMNC', 'ISO', 'Country', 'Country Code', 'Code Network'],
    'SOA': ['INFO ID', 'ENTERPRISE NAME', 'OPENING BALANCE', 'TOTAL CREDIT', 'TOTAL DEBIT', 'CLOSING BALANCE', 'ACTION'],
    'TCP Dump': ['FILE NAME', 'FILE SIZE', 'DOWNLOAD', 'UPDATE TIME (UTC)'],
    'Signaling Deck': ['SR.NO.', 'FILE NAME', 'FILE SIZE', 'DOWNLOAD', 'UPDATE TIME'],
    'DLR Template': ['INFO ID', 'NAME', 'UPDATED BY', 'UPDATED TIME'],
    'DLR Download': ['DLR NO', 'STATUS', 'FILE', 'FILE TYPE', 'PROGRESS', 'REQUEST START TIME', 'REQUEST END TIME', 'ERROR', 'REQUESTED BY'],
    'LCR': ['LCR NO', 'FILE', 'STATUS', 'REQUEST START TIME', 'REQUEST END TIME', 'ERROR', 'REQUESTED BY'],
    'Re-Rating': ['RE-RATING ID', 'Description', 'Start Date', 'End Date', 'Enterprise Type', 'Status', 'Progress', 'Requested By', 'Requested Date'],
    'Network Status': ['ENTERPRISE ID', 'CUSTOMER ID', 'ENTERPRISE NAME', 'CUSTOMER NAME', 'IP ADDRESS', 'NUMBER OF CONNECTION', 'STATUS', 'ACTION'],
    'Route Rule Group': ['ID', 'Route Rule Group', 'Updated By', 'Updated Time'],
    'Route Rule': ['ID', 'Name', 'Product category', 'Customers', 'MCC MNC', 'Priority', 'Route Type', 'Vendor Category', 'Vendor', 'Route Rule Group', 'Next Route Rule Group', 'Route Table', 'Start Time', 'Stop Time', 'Status', 'Updated By', 'Updated Time'],
    'Business Company': ['INFO ID', 'BUSINESS COMPANY NAME', 'DESCRIPTION', 'BASE CURRENCY', 'TPS LIMIT', 'UPDATED BY', 'UPDATED TIME'],
    'Customer Portal': ['INFO ID', 'EMAIL', 'USERNAME', 'ENTERPRISE', 'FIRSTNAME', 'LASTNAME', 'STATUS', 'UPDATED BY', 'UPDATED TIME'],
    'Schedule Report': ['INFO ID', 'SCHEDULE REPORT NAME', 'STATUS', 'UPDATED BY', 'UPDATED TIME'],
    'Email Template': ['INFO ID', 'EMAIL TEMPLATE NAME', 'EMAIL TYPE', 'UPDATED BY', 'UPDATED TIME'],
    'Report Template': ['INFO ID', 'REPORT TEMPLATE NAME', 'STATUS', 'UPDATED BY', 'UPDATED TIME'],
    'Network Diagnosis': ['ID', 'HOST', 'TYPE', 'RESULT', 'UPDATED BY', 'UPDATED TIME'],
    'Master Grouping': ['ID', 'GROUP NAME', 'DESCRIPTION', 'UPDATED BY', 'UPDATED TIME'],
    'Usage Enterprise': ['ENTERPRISE NAME', 'USAGE DATE', 'TOTAL SMS', 'DELIVERED', 'FAILED', 'REVENUE', 'COST', 'MARGIN'],
    'Failed DLR Search': ['ID', 'Enterprise', 'Trunk', 'MCCMNC', 'Reason', 'Count', 'Percentage'],
  };

  const detailedViews = ['Enterprise'];
  const searchViews = ['SOA', 'DLR Search'];
  const complexFormViews = [
    'Route Simulator', 
    'Network Diagnosis', 
    'Failed DLR Search', 
    'TCP Dump',
    'All Reports',
    'Bilateral Report',
    'Negative Margin Report'
  ];

  const adminForms = ['Business Company', 'Email Template', 'Customer Portal', 'IMAP Mail Account', 'File Template', 'Auto Upload Rules'];

  if (menu === 'Rate Analytics') {
    return <RateLookupView theme={theme} />;
  }

  if (activeReport) {
    return <ReportFormView title={activeReport} theme={theme} onBack={() => setActiveReport(null)} />;
  }

  if (complexFormViews.includes(menu)) {
    if ((menu === 'Schedule Report' || menu === 'Business Company') && isAdding) {
      if (menu === 'Business Company') {
        return <AdminFormView title={breadcrumbs} theme={theme} onClose={() => setIsAdding(false)} />;
      }
      return <ReportFormView title={breadcrumbs} theme={theme} onBack={() => setIsAdding(false)} />;
    }

    if (['Route Simulator', 'Network Diagnosis', 'Failed DLR Search', 'TCP Dump'].includes(menu)) {
      return <TrafficInsightsFormView title={breadcrumbs} theme={theme} />;
    }
    if (menu === 'All Reports') {
      return <ReportDashboard theme={theme} onSelectReport={setActiveReport} />;
    }
    return <ReportFormView title={breadcrumbs} theme={theme} onBack={() => setIsAdding(false)} />;
  }

  if (menu === 'Analytics') {
    return <ReportFormView title="Report / Analytics Report" theme={theme} />;
  }

  if (detailedViews.includes(menu)) {
    if (menu === 'Enterprise') {
      return <EnterpriseDetailsView theme={theme} />;
    }
    return <DetailsView title={menu} theme={theme} />;
  }

  if (menu === 'SMS Product' || menu === 'sms-wholesale-business') {
    if (isAdding) {
      return <SMSProductMateForm theme={theme} onClose={() => setIsAdding(false)} />;
    }
    return (
      <DataTableView 
        title="SMS Product" 
        originalTitle="SMS Product"
        columns={tableConfig['SMS Product']} 
        theme={theme} 
        onAdd={() => setIsAdding(true)}
      />
    );
  }

  if (menu === 'Product Category' || menu === 'product-category') {
    return (
      <DataTableView 
        title="Product Category" 
        originalTitle="Product Category"
        columns={tableConfig['Product Category']} 
        theme={theme} 
        onAdd={() => setIsAdding(true)}
      />
    );
  }

  if (searchViews.includes(menu)) {
    return <SearchView title={menu} theme={theme} />;
  }

  if (adminForms.includes(menu) && isAdding) {
    return <AdminFormView title={breadcrumbs} theme={theme} onClose={() => setIsAdding(false)} />;
  }

  if (menu === 'Firewall' && isAdding) {
    return <FirewallForm theme={theme} onClose={() => setIsAdding(false)} />;
  }

  return (
    <DataTableView 
      title={breadcrumbs} 
      originalTitle={menu}
      columns={tableConfig[menu] || ['ID', 'Name', 'Status', 'Updated By', 'Updated At']} 
      theme={theme} 
      onAdd={() => setIsAdding(true)}
    />
  );
}

