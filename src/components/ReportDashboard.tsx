import React from 'react';
import { cn } from '../lib/utils';
import { ChevronRight } from 'lucide-react';

interface ReportGroup {
  title: string;
  reports: string[];
}

const REPORT_GROUPS: ReportGroup[] = [
  {
    title: 'Detail Reports',
    reports: ['Client Message Log', 'Supplier Message Log', 'Inbox Detail', 'User Wise Report']
  },
  {
    title: 'Summary Reports',
    reports: ['Client Summary', 'Supplier Summary', 'Inbox Summary', 'CDR Summary', 'Client Success Summary', 'Supplier Success Summary']
  },
  {
    title: 'Inbound Reports',
    reports: ['Inbound Audit Log', 'Inbound TPS Detail', 'Inbound DLR Resend', 'Customized DLR Inbound', 'Schedule DLR Inbound']
  },
  {
    title: 'Supplier Rate Reports',
    reports: ['Country-Supplier Rate Analysis', 'Rate Analysis Report', 'Supplier Rate Sheet', 'Supplier Auto Rate Sheet Report']
  },
  {
    title: 'LCR Reports',
    reports: ['Routing Wise Fail Summary']
  },
  {
    title: 'Summary Reports',
    reports: ['Bilateral Report']
  },
  {
    title: 'Outbound Reports',
    reports: ['Outbound Audit Log', 'Outbound TPS Detail', 'DLR Status Report', 'DLR Advance Search Report Client', 'DLR Advance Search Report Supplier', 'DLR Analysis Report']
  },
  {
    title: 'Miscellaneous Reports',
    reports: ['Report Source Download', 'Send Report As Email', 'Email Notification Report', 'Missing Error Code', 'Top Users']
  },
  {
    title: 'Traffic Insights',
    reports: ['Route Simulator', 'TCP Dump', 'Network Diagnosis']
  }
];

export function ReportDashboard({ theme, onSelectReport }: { theme: 'light' | 'dark', onSelectReport: (report: string) => void }) {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500 overflow-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {REPORT_GROUPS.map((group, idx) => (
          <div 
            key={`${group.title}-${idx}`}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm shadow-sm overflow-hidden flex flex-col"
          >
            <div className="px-5 py-3 bg-white dark:bg-zinc-900">
              <h3 className="text-[13px] font-medium text-[#0073aa] dark:text-blue-400">{group.title}</h3>
            </div>
            <div className="mx-5 border-t border-red-500"></div>
            <div className="p-3 space-y-px flex-1">
              {group.reports.map((report) => (
                <button 
                  key={report}
                  onClick={() => onSelectReport(report)}
                  className="w-full text-left px-4 py-2 text-[12px] text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all border border-zinc-100 dark:border-zinc-800 mb-2 rounded-sm"
                >
                  {report}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
