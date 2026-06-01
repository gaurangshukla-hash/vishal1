export const MOCK_DATA: Record<string, any[]> = {
  'Transaction': [
    { 'Info ID': '101', 'Name': 'ABC Corp', 'Payment Date': '2024-01-20', 'Transaction Time': '10:30:15', 'Mode of Payment': 'Bank Transfer', 'Payment Type': 'Credit', 'Transaction Type': 'Bill Payment', 'Amount': '5000.00', 'Currency': 'USD', 'Invoice Number': 'INV-001', 'Payment Status': 'Full', 'Description': 'Monthly Settlement', 'Updated By': 'Admin User' },
    { 'Info ID': '102', 'Name': 'XYZ Telecom', 'Payment Date': '2024-01-21', 'Transaction Time': '11:45:20', 'Mode of Payment': 'Credit Card', 'Payment Type': 'Debit', 'Transaction Type': 'Receipt', 'Amount': '1250.50', 'Currency': 'USD', 'Invoice Number': 'INV-002', 'Payment Status': 'Partial', 'Description': 'Usage Charges', 'Updated By': 'System' },
    { 'Info ID': '103', 'Name': 'Global SMS', 'Payment Date': '2024-01-22', 'Transaction Time': '09:15:00', 'Mode of Payment': 'Cash', 'Payment Type': 'Credit', 'Transaction Type': 'Adjustment', 'Amount': '100.00', 'Currency': 'USD', 'Invoice Number': 'N/A', 'Payment Status': 'Full', 'Description': 'Refund', 'Updated By': 'Finance Head' },
  ],
  'Invoice': [
    { 'Invoice No': 'INV-2024-001', 'Status': 'Paid', 'Enterprise Name': 'ABC Corp', 'Enterprise Type': 'Customer', 'Invoice Type': 'Manual', 'Billing Type': 'Postpaid', 'Invoice Date': '2024-01-01', 'Usage Start': '2023-12-01', 'Usage End': '2023-12-31', 'Due Date': '2024-01-15', 'Amount': '2500.00' },
    { 'Invoice No': 'INV-2024-002', 'Status': 'Pending', 'Enterprise Name': 'XYZ Telecom', 'Enterprise Type': 'Vendor', 'Invoice Type': 'Auto', 'Billing Type': 'Prepaid', 'Invoice Date': '2024-01-05', 'Usage Start': '2023-12-01', 'Usage End': '2023-12-31', 'Due Date': '2024-01-20', 'Amount': '1800.75' },
  ],
  'Enterprise Balance': [
    { 'Enterprise Name': 'ABC Corp', 'Customer Balance': '4500.00', 'Vendor Balance': '2000.00', 'Net Balance': '2500.00', 'Account Manager': 'John Doe', 'Customer Credit': '10000.00', 'Billing Cycle': 'Monthly', 'Currency': 'USD' },
    { 'Enterprise Name': 'XYZ Telecom', 'Customer Balance': '0.00', 'Vendor Balance': '3500.00', 'Net Balance': '-3500.00', 'Account Manager': 'Jane Smith', 'Customer Credit': '5000.00', 'Billing Cycle': 'Weekly', 'Currency': 'EUR' },
  ],
  'Billing Cycle': [
    { 'Info ID': '1', 'Name': 'Monthly Net 30', 'Usage Days': '30', 'Due Days': '30', 'Billing Type': 'Postpaid', 'Updated By': 'Admin', 'Updated Time': '2023-12-15' },
    { 'Info ID': '2', 'Name': 'Weekly', 'Usage Days': '7', 'Due Days': '2', 'Billing Type': 'Prepaid', 'Updated By': 'System', 'Updated Time': '2024-01-01' },
  ],
  'Vendor Invoice': [
    { 'ID': 'VI-5001', 'Enterprise Name': 'TeleOSS Carrier', 'Vendor Trunk': 'VT_001_PREMIUM', 'Invoice Number': 'VEN-2026-90112', 'Charge Volume': '4,800,000', 'Charge Amount': '37,440.00', 'Invoice Date': '2026-05-01', 'Invoice Due Date': '2026-05-08', 'Invoice From Date': '2026-04-01', 'Invoice To Date': '2026-04-30', 'Dispute Amount': '0.00', 'Created By': 'Finance Head', 'Created Time': '2026-05-01 10:15:00' },
    { 'ID': 'VI-5002', 'Enterprise Name': 'Airtel Carrier', 'Vendor Trunk': 'VT_ART_DIRECT', 'Invoice Number': 'INV-AIR-78553', 'Charge Volume': '9,200,000', 'Charge Amount': '38,640.00', 'Invoice Date': '2026-05-03', 'Invoice Due Date': '2026-05-10', 'Invoice From Date': '2026-04-01', 'Invoice To Date': '2026-04-30', 'Dispute Amount': '150.00', 'Created By': 'System', 'Created Time': '2026-05-03 04:00:12' }
  ],
  'Product Category': [
    { 'Info ID': '10', 'Category Name': 'International', 'Updated By': 'Admin' },
    { 'Info ID': '20', 'Category Name': 'Local Premium', 'Updated By': 'Admin' },
    { 'Info ID': '30', 'Category Name': 'OTP Special', 'Updated By': 'System' },
  ],
  'Country': [
    { 'Name': 'United States', 'ISO Code': 'US', 'Dial Code': '1', 'Updated By': 'Admin' },
    { 'Name': 'United Kingdom', 'ISO Code': 'GB', 'Dial Code': '44', 'Updated By': 'Admin' },
    { 'Name': 'India', 'ISO Code': 'IN', 'Dial Code': '91', 'Updated By': 'Admin' },
  ],
  'MCCMNC Unique Codes': [
    { 'Info ID': '1', 'MCC': '310', 'MNC': '410', 'Original MNC': '310', 'MCCMNC': '310410', 'ISO': 'US', 'Country': 'USA', 'Country Code': '1', 'Code Network': 'AT&T' },
    { 'Info ID': '2', 'MCC': '234', 'MNC': '15', 'Original MNC': '234', 'MCCMNC': '23415', 'ISO': 'GB', 'Country': 'UK', 'Country Code': '44', 'Code Network': 'Vodafone' },
  ],
  'MO Reference Book': [
    { 'Info ID': '1', 'Customer Trunk': 'TRUNK_001', 'Number': '1712284', 'Keyword': 'SALE', 'Rate': '0.015', 'Vendor Rate': '0.012', 'MCCMNC': '310410', 'Destination': 'USA', 'Created Time': '2024-01-20', 'Updated By': 'Admin' },
    { 'Info ID': '2', 'Customer Trunk': 'TRUNK_002', 'Number': '4223344', 'Keyword': 'PROMO', 'Rate': '0.008', 'Vendor Rate': '0.006', 'MCCMNC': '23415', 'Destination': 'UK', 'Created Time': '2024-01-21', 'Updated By': 'System' },
  ],
  'Translation Rule': [
    { 'Info ID': '501', 'TRANSLATION RULE NAME': 'Strip Prefix', 'Type': 'Ingress', 'Action': 'Modify', 'Continue': 'Yes', 'Sender ID': '12345', 'DWD': '880', 'MCCMNC': '310410', 'Message Text': '...', 'Updated By': 'Admin' },
    { 'Info ID': '502', 'TRANSLATION RULE NAME': 'Add Suffix', 'Type': 'Egress', 'Action': 'Append', 'Continue': 'No', 'Sender ID': 'ABC_SMS', 'DWD': 'N/A', 'MCCMNC': 'All', 'Message Text': '...', 'Updated By': 'NOC' },
  ],
  'Business Company': [
    { 'ID': '1', 'Name': 'TeleOSS Messaging', 'Description': 'Global Messaging Layer', 'Currency': 'USD', 'TPS Limit': '500', 'Base Currency': 'USD', 'Updated Time': '2024-01-28' },
  ],
  'Customer Portal': [
    { 'Info ID': '1', 'Email': 'user1@example.com', 'Username': 'john_doe', 'Enterprise': 'ABC Corp', 'Firstname': 'John', 'Lastname': 'Doe', 'Status': 'Active' },
    { 'Info ID': '2', 'Email': 'user2@example.com', 'Username': 'jane_smith', 'Enterprise': 'XYZ Telecom', 'Firstname': 'Jane', 'Lastname': 'Smith', 'Status': 'Inactive' },
  ],
  'Auto Upload Rules': [
    { 'Info ID': '1', 'AUTO UPLOAD RULES NAME': 'Daily Rates', 'ENTERPRISE NAME': 'ABC Corp', 'VENDOR TRUNK': 'VT_001', 'IMAP MAIL ACCOUNT NAME': 'rates@abc.com', 'FILE TEMPLATE NAME': 'Standard', 'FILE PREFIX': 'rates_', 'STATUS': 'Active', 'UPDATED BY': 'Admin', 'UPDATED TIME': '2024-01-20' },
  ],
  'Signaling Deck': [
    { 'Sr No.': '1', 'File Name': 'signal_log_001.pcap', 'File Size': '1.2 MB', 'Download': '↓', 'Update Time': '2024-01-28 10:00' },
  ],
  'DLR Download': [
    { 'DLR NO': '1001', 'Status': 'Success', 'File': 'dlr_jan_20.csv', 'Progress': '100%', 'Request Start Time': '2024-01-20 10:00', 'Request End Time': '2024-01-20 10:05', 'Requested By': 'Admin' },
  ],
  'Network Status': [
    { 'Enterprise ID': '64', 'Customer ID': '55', 'Enterprise Name': 'TeleOSS', 'Customer Name': 'Global Hub', 'IP ADDRESS': '192.168.1.100', 'Member of Connection': '1', 'Status': 'Active', 'Action': 'View' },
  ],
  'Customer Rate Table': [
    { 'RATE TABLE ID': 'CRT-501', 'NAME': 'Premium Direct US Routes', 'PRODUCT CATEGORY': 'DIRECT', 'CURRENCY': 'USD', 'CUSTOMER TRUNK': 'TRUNK_US_01', 'DESCRIPTION': 'Direct premium routes for USA', 'UPDATED BY': 'NOC-Admin', 'UPDATED AT': '2026-05-20 09:00' },
    { 'RATE TABLE ID': 'CRT-502', 'NAME': 'Aggregator Bulk Routes', 'PRODUCT CATEGORY': 'WHS', 'CURRENCY': 'USD', 'CUSTOMER TRUNK': 'TRUNK_EU_02', 'DESCRIPTION': 'Bulk routes for aggregators', 'UPDATED BY': 'Admin', 'UPDATED AT': '2026-05-19 14:30' },
  ],
  'Vendor Rate Table': [
    { 'RATE TABLE ID': 'VRT-701', 'NAME': 'Alpha Vendor Premium', 'PRODUCT CATEGORY': 'DIRECT', 'CURRENCY': 'USD', 'VENDOR TRUNK': 'VT_001_PREMIUM', 'DESCRIPTION': 'Alpha premium coverage', 'UPDATED BY': 'Admin', 'UPDATED AT': '2026-05-20 10:15' },
    { 'RATE TABLE ID': 'VRT-702', 'NAME': 'Global Hub Bulk', 'PRODUCT CATEGORY': 'WHS', 'CURRENCY': 'USD', 'VENDOR TRUNK': 'VT_002_BULK', 'DESCRIPTION': 'Global hub fallback routes', 'UPDATED BY': 'Admin', 'UPDATED AT': '2026-05-19 17:00' },
  ],
  'LCR': [
    { 'LCR NO': 'LCR-001', 'FILE': 'lcr_report_001.pdf', 'STATUS': 'Completed', 'REQUEST START TIME': '2024-01-20 10:00', 'REQUEST END TIME': '2024-01-20 10:05', 'ERROR': 'None', 'REQUESTED BY': 'Admin' },
  ],
  'Lookups': [
    { 'Info ID': '1', 'Lookup Name': 'SMS_STATUS', 'Type': 'System', 'Value': 'DELIVRD,EXPIRED,DELETED', 'Status': 'Active', 'Updated By': 'System', 'Updated Time': '2024-01-01' },
    { 'Info ID': '2', 'Lookup Name': 'TRUNK_TYPE', 'Type': 'Config', 'Value': 'SMPP,HTTP,SIP', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2024-01-15' },
  ],
  'Usage Enterprise': [
    { 'ENTERPRISE NAME': 'ABC Corp', 'USAGE DATE': '2024-01-28', 'TOTAL SMS': '15000', 'DELIVERED': '14500', 'FAILED': '500', 'REVENUE': '75.00', 'COST': '45.00', 'MARGIN': '30.00' },
    { 'ENTERPRISE NAME': 'TeleOSS', 'USAGE DATE': '2024-01-28', 'TOTAL SMS': '25000', 'DELIVERED': '24800', 'FAILED': '200', 'REVENUE': '125.00', 'COST': '70.00', 'MARGIN': '55.00' },
  ],
  'Re-Rating': [
    { 'RE-RATING ID': '101', 'Description': 'Correction for Jan 15-20', 'Start Date': '2024-01-15', 'End Date': '2024-01-20', 'Enterprise Type': 'Customer', 'Status': 'Completed', 'Progress': '100%', 'Requested By': 'Admin', 'Requested Date': '2024-01-25' },
    { 'RE-RATING ID': '102', 'Description': 'Vendor Rate Update Feb', 'Start Date': '2024-02-01', 'End Date': '2024-02-05', 'Enterprise Type': 'Vendor', 'Status': 'Pending', 'Progress': '0%', 'Requested By': 'System', 'Requested Date': '2024-02-10' },
  ],
  'HLR Provider': [
    { 'Info ID': '1', 'Provider Name': 'Global HLR', 'UserName': 'ghlr_user', 'URL': 'https://api.hlr.com', 'Caching (Days)': '7', 'Status': 'Active', 'Created Time': '2024-01-01' },
    { 'Info ID': '2', 'Provider Name': 'SmsGlobal', 'UserName': 'sms_hlr', 'URL': 'https://hlr.smsglobal.com', 'Caching (Days)': '0', 'Status': 'Active', 'Created Time': '2024-01-15' },
  ],
  'Notification': [
    { 'Info ID': '1', 'Enterprise Name': 'ABC Corp', 'Type': 'Rate Change', 'Subject': 'Rate Update Notification', 'Channel': 'Email', 'Sent Time': '2024-01-30 09:00', 'Status': 'Success' },
    { 'Info ID': '2', 'Enterprise Name': 'TeleOSS', 'Type': 'Balance Alert', 'Subject': 'Low Balance Warning', 'Channel': 'Email', 'Sent Time': '2024-01-30 10:30', 'Status': 'Success' },
    { 'Info ID': '3', 'Enterprise Name': 'Global Hub', 'Type': 'Traffic Anomaly', 'Subject': 'High Traffic Drop Observed', 'Channel': 'SMS', 'Sent Time': '2024-02-01 14:20', 'Status': 'Success' },
    { 'Info ID': '4', 'Enterprise Name': 'Admin', 'Type': 'System Health', 'Subject': 'CPU Usage > 90% Alert', 'Channel': 'Webhook', 'Sent Time': '2024-02-02 03:00', 'Status': 'Success' },
    { 'Info ID': '5', 'Enterprise Name': 'XYZ Telecom', 'Type': 'DLR Delay', 'Subject': 'Delayed DLRs (latency > 60s)', 'Channel': 'Email', 'Sent Time': '2024-02-02 11:45', 'Status': 'Failed' },
    { 'Info ID': '6', 'Enterprise Name': 'TeleOSS', 'Type': 'Daily Stats', 'Subject': 'Daily Business Summary - 2024-02-01', 'Channel': 'Email', 'Sent Time': '2024-02-02 00:05', 'Status': 'Success' },
  ],
  'Number List': [
    { 'Info ID': '1', 'Name': 'Blacklist_Global', 'Type': 'Random', 'Total Numbers': '1500', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2024-01-25' },
    { 'Info ID': '2', 'Name': 'VIP_Customers', 'Type': 'Tag', 'Total Numbers': '250', 'Status': 'Active', 'Updated By': 'System', 'Updated Time': '2024-01-28' },
  ],
  'Translation Rule Group': [
    { 'Info ID': '1', 'Group Name': 'US_ROUTING', 'Rules Count': '5', 'Status': 'Active', 'Updated By': 'Admin' },
    { 'Info ID': '2', 'Group Name': 'EUROPE_DEFAULT', 'Rules Count': '12', 'Status': 'Active', 'Updated By': 'Admin' },
  ],
  'HLR Rule': [
    { 'Info ID': '1', 'Rule Name': 'Strip 00', 'Provider': 'Global HLR', 'MCCMNC': 'All', 'Status': 'Active' },
    { 'Info ID': '2', 'Rule Name': 'Special India', 'Provider': 'SmsGlobal', 'MCCMNC': '404', 'Status': 'Active' },
  ],
  'HLR Rule Group': [
    { 'Info ID': '1', 'Group Name': 'HLR_DEFAULT', 'Rules': '2', 'Status': 'Active' },
  ],
  'Customer Trunk': [
    { 'ID': 'CT-101', 'Name': 'UK_DIRECT_01', 'Protocol': 'SMPP v3.4', 'Host': '1.2.3.4', 'Port': '2775', 'Status': 'Active', 'Updated By': 'Admin', 'Updated At': '2024-01-20' },
    { 'ID': 'CT-102', 'Name': 'USA_HUB_01', 'Protocol': 'SMPP v3.4', 'Host': '5.6.7.8', 'Port': '2775', 'Status': 'Active', 'Updated By': 'Admin', 'Updated At': '2024-01-21' },
    { 'ID': 'CT-103', 'Name': 'SG_RETAIL', 'Protocol': 'HTTP', 'Host': 'api.sg-sms.com', 'Port': '443', 'Status': 'Inactive', 'Updated By': 'Admin', 'Updated At': '2024-01-22' },
  ],
  'Vendor Trunk': [
    { 'ID': 'VT-201', 'Name': 'V_ASIA_PREMIUM', 'Protocol': 'SMPP v3.4', 'Host': '10.20.30.40', 'Port': '2775', 'Status': 'Active', 'Updated By': 'System', 'Updated At': '2024-01-20' },
    { 'ID': 'VT-202', 'Name': 'V_GLOBAL_LCR', 'Protocol': 'SMPP v3.4', 'Host': '11.22.33.44', 'Port': '2776', 'Status': 'Active', 'Updated By': 'Admin', 'Updated At': '2024-01-21' },
    { 'ID': 'VT-203', 'Name': 'V_EU_DIRECT', 'Protocol': 'SMPP v3.4', 'Host': '88.88.88.88', 'Port': '2775', 'Status': 'Maintenance', 'Updated By': 'Admin', 'Updated At': '2024-01-22' },
  ],
  'SMS Product': [
    { 
      'ID': 'P-1001', 'NAME': 'USA Premium Direct', 'CATEGORY': 'DIRECT', 'COUNTRY': 'United States', 'MCCMNC': '310410', 'RATE': '0.0050', 'CURRENCY': 'USD', 'TYPE': 'OTP', 'STATUS': 'Active', 'RULES': '3',
      children: [
        { 'Detail': 'Routing', 'Value': 'Least Cost Routing (LCR)', 'Status': 'Enabled' },
        { 'Detail': 'DLR Type', 'Value': 'Real-time', 'Status': 'Active' },
        { 'Detail': 'Capacity', 'Value': '500 TPS', 'Status': 'Optimal' },
        { 'Detail': 'Vendor', 'Value': 'Alpha SMS Hub', 'Status': 'Primary' }
      ]
    },
    { 
      'ID': 'P-1002', 'NAME': 'UK Wholesale Hub', 'CATEGORY': 'WHS', 'COUNTRY': 'United Kingdom', 'MCCMNC': '23415', 'RATE': '0.0035', 'CURRENCY': 'GBP', 'TYPE': 'Marketing', 'STATUS': 'Active', 'RULES': '5',
      children: [
        { 'Detail': 'Routing', 'Value': 'Fixed Vendor (Global Hub)', 'Status': 'Locked' },
        { 'Detail': 'DLR Type', 'Value': 'Standard', 'Status': 'Active' },
        { 'Detail': 'Vendor', 'Value': 'Global Hub UK', 'Status': 'Secondary' }
      ]
    },
    { 'ID': 'P-1003', 'NAME': 'India Quality Route', 'CATEGORY': 'HQ', 'COUNTRY': 'India', 'MCCMNC': '40401', 'RATE': '0.0012', 'CURRENCY': 'INR', 'TYPE': 'OTP', 'STATUS': 'Active', 'RULES': '0' },
  ],
  'SMS Switch': [
    { 
      'Switch ID': 'SW-01', 'Switch Name': 'Primary Node US', 'Host': '10.0.0.5', 'Port': '2775', 'Protocol': 'SMPP v3.4', 'TPS Limit': '1000', 'Status': 'Active', 'Updated By': 'Admin',
      children: [
        { 'Parameter': 'Conn Timeout', 'Value': '3000ms', 'Setting': 'System' },
        { 'Parameter': 'Max Binds', 'Value': '50', 'Setting': 'Strict' },
        { 'Parameter': 'Heartbeat', 'Value': '60s', 'Setting': 'Default' }
      ]
    },
    { 'Switch ID': 'SW-02', 'Switch Name': 'Backup Hub EU', 'Host': '10.0.0.22', 'Port': '2775', 'Protocol': 'SMPP v3.4', 'TPS Limit': '500', 'Status': 'Active', 'Updated By': 'Admin' },
  ],
  'Route Rule Group': [
    { 'ID': 'RG-1', 'Name': 'PREMIUM_ASIA_ROUTING', 'Rules': '5', 'Status': 'Active', 'Created By': 'Admin', 'Created At': '2024-02-01' },
    { 'ID': 'RG-2', 'Name': 'LCR_GLOBAL_FALLBACK', 'Rules': '12', 'Status': 'Active', 'Created By': 'Admin', 'Created At': '2024-02-05' },
  ],
  'Route Rule': [
    { 'ID': 'R-1001', 'Priority': '1', 'Customer': 'Aakash_DIR_IN', 'Product': 'Premium Direct', 'MCCMNC': '40401', 'Supplier': 'V_ASIA_PREMIUM', 'Type': 'Preference', 'Status': 'Active' },
    { 'ID': 'R-1002', 'Priority': '2', 'Customer': 'Aakash_DIR_IN', 'Product': 'Premium Direct', 'MCCMNC': '40401', 'Supplier': 'V_GLOBAL_LCR', 'Type': 'Failover', 'Status': 'Active' },
    { 'ID': 'R-1003', 'Priority': '1', 'Customer': 'Notify_HQ_IN', 'Product': 'Standard LCR', 'MCCMNC': '310410', 'Supplier': 'V_GLOBAL_LCR', 'Type': 'LCR', 'Status': 'Active' },
  ],
  'Task Manager': [
    { 'ID': 'TK-5001', 'Task Name': 'Global Rate Sync', 'Type': 'System', 'Priority': 'Urgent', 'Status': 'Running', 'Assigned To': 'Engine_01', 'Created At': '2024-03-01 10:15', 'Due Date': '2024-03-02' },
    { 'ID': 'TK-5002', 'Task Name': 'Auto-Billing Cycle', 'Type': 'Finance', 'Priority': 'High', 'Status': 'Pending', 'Assigned To': 'Finance_Bot', 'Created At': '2024-03-01 09:00', 'Due Date': '2024-03-05' },
    { 'ID': 'TK-5003', 'Task Name': 'DLR Cleanup', 'Type': 'Database', 'Priority': 'Medium', 'Status': 'Completed', 'Assigned To': 'DB_Admin', 'Created At': '2024-02-28 23:30', 'Due Date': '2024-03-01' },
    { 'ID': 'TK-5004', 'Task Name': 'Log Rotation', 'Type': 'Maintenance', 'Priority': 'Low', 'Status': 'Completed', 'Assigned To': 'Sys_Monitor', 'Created At': '2024-02-28 12:00', 'Due Date': '2024-02-28' },
  ],
  'Currency': [
    { 'ID': '1', 'Currency Name': 'US Dollar', 'ISO Code': 'USD', 'Symbol': '$', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2024-01-01' },
    { 'ID': '2', 'Currency Name': 'Euro', 'ISO Code': 'EUR', 'Symbol': '€', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2024-01-01' },
    { 'ID': '3', 'Currency Name': 'UAE Dirham', 'ISO Code': 'AED', 'Symbol': 'د.إ', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2024-01-05' },
    { 'ID': '4', 'Currency Name': 'Indian Rupee', 'ISO Code': 'INR', 'Symbol': '₹', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2024-01-10' },
  ],
  'Currency Exchange': [
    { 'ID': '1', 'SOURCE CURRENCY': 'USD', 'TARGET CURRENCY': 'INR', 'BANK RATE': '82.4501', 'SPREAD (%)': '1.50', 'SELL RATE': '83.6868', 'AUTO UPDATE': 'Active', 'STATUS': 'Active', 'EFFECTIVE FROM': '2024-05-01 00:00' },
    { 'ID': '2', 'SOURCE CURRENCY': 'EUR', 'TARGET CURRENCY': 'USD', 'BANK RATE': '1.0850', 'SPREAD (%)': '0.75', 'SELL RATE': '1.0931', 'AUTO UPDATE': 'Paused', 'STATUS': 'Active', 'EFFECTIVE FROM': '2024-05-01 00:00' },
    { 'ID': '3', 'SOURCE CURRENCY': 'USD', 'TARGET CURRENCY': 'AED', 'BANK RATE': '3.6725', 'SPREAD (%)': '0.00', 'SELL RATE': '3.6725', 'AUTO UPDATE': 'Active', 'STATUS': 'Active', 'EFFECTIVE FROM': '2024-05-01 00:00' },
  ],
  'Firewall': [
    { 'ID': '1', 'NAME': 'US Spam Block', 'TYPE': 'SMPP', 'STATUS': 'Active', 'STORE IT': 'Yes', 'DEDUCT': 'No', 'START DATE': '2024-05-01 10:00', 'END DATE': '2024-12-31 23:59' },
    { 'ID': '2', 'NAME': 'Global OTP Only', 'TYPE': 'HTTP', 'STATUS': 'Active', 'STORE IT': 'Yes', 'DEDUCT': 'Yes', 'START DATE': '2024-05-02 08:00', 'END DATE': '2025-05-02 08:00' },
  ],
  'IMAP Mail Account': [
    { 'ID': 'IMA-1', 'Mail account name': 'Sales IMAP (Gmail)', 'IMAP Mail Account Email': 'sales.rates@gmail.com', 'IMAP Server': 'imap.gmail.com', 'IMAP Port': '993', 'AUTH Type': 'App Password', 'Account User ID': 'sales.rates', 'Status': 'Active', 'Updated By': 'Admin', 'Updated Time': '2026-05-18 10:20' },
    { 'ID': 'IMA-2', 'Mail account name': 'Support IMAP (Outlook)', 'IMAP Mail Account Email': 'rates-support@outlook.com', 'IMAP Server': 'imap-mail.outlook.com', 'IMAP Port': '993', 'AUTH Type': 'OAuth2', 'Account User ID': 'rates-support@outlook.com', 'Status': 'Active', 'Updated By': 'System', 'Updated Time': '2026-05-19 14:00' },
    { 'ID': 'IMA-3', 'Mail account name': 'Custom Rates Inbox', 'IMAP Mail Account Email': 'inbox@breelink-global.com', 'IMAP Server': 'imap.secureserver.net', 'IMAP Port': '143', 'AUTH Type': 'Plain', 'Account User ID': 'rates-ingestion', 'Status': 'Inactive', 'Updated By': 'Admin', 'Updated Time': '2026-05-15 08:30' }
  ],
  'File Template': [
    { 'Id': 'FT-201', 'File template name': 'XLSX General Template', 'Skip Row': '1', 'Updated By': 'Admin', 'Updated Time': '2026-05-10 11:15' },
    { 'Id': 'FT-202', 'File template name': 'CSV Standard Format', 'Skip Row': '0', 'Updated By': 'NOC Team', 'Updated Time': '2026-05-12 16:45' },
    { 'Id': 'FT-203', 'File template name': 'BreeLink Custom Excel', 'Skip Row': '2', 'Updated By': 'Admin', 'Updated Time': '2026-05-14 09:00' }
  ],
  'Auto Upload Failed Report': [
    { 'Id': 'FL-401', 'IMAP mail Account': 'Sales IMAP (Gmail)', 'Auto Upload Rules': 'BreeLink Rates Rule', 'From Email': 'rates@breelink-global.com', 'To Email': 'sales.rates@gmail.com', 'Subject': 'URGENT: Tariff Sheet updates', 'File name': 'rate_sheet_corrupt.xlsx', 'Email Id': 'msg-9921', 'Error': 'Invalid Format: Missing Column MCCMNC', 'Email Receive Time': '2026-05-20 03:14', 'Email Read Time': '2026-05-20 03:15', 'Update Time': '2026-05-20 03:15' },
    { 'Id': 'FL-402', 'IMAP mail Account': 'Support IMAP (Outlook)', 'Auto Upload Rules': 'Standard Rule', 'From Email': 'updates@cheapcarrier.net', 'To Email': 'rates-support@outlook.com', 'Subject': 'Carrier Pricing May 2026', 'File name': 'wholesale_sms_rates.csv', 'Email Id': 'msg-8742', 'Error': 'Account Match Failure: Negative rate detected at row 42', 'Email Receive Time': '2026-05-19 22:11', 'Email Read Time': '2026-05-19 22:12', 'Update Time': '2026-05-19 22:12' }
  ],
  'Auto Upload Report': [
    { 'ID': 'AL-301', 'Auto upload Rule name': 'Daily Rates', 'From Email': 'rates@breelink-global.com', 'To Email': 'sales.rates@gmail.com', 'Subject': 'Auto Rates May 20', 'Trunk Type': 'Vendor', 'Vendor Trunk': 'VT_001', 'Status': 'Active', 'Email Receive Time': '2026-05-20 05:14', 'Email Read Time': '2026-05-20 05:14', 'Comments': 'Successfully parsed sheet -> 256 rates modified.', 'File Status': 'Processed', 'Rejected by': 'None', 'Rejected Time': 'N/A' },
    { 'ID': 'AL-302', 'Auto upload Rule name': 'Daily Rates', 'From Email': 'rates@breelink-global.com', 'To Email': 'sales.rates@gmail.com', 'Subject': 'Auto Rates May 17', 'Trunk Type': 'Vendor', 'Vendor Trunk': 'VT_001', 'Status': 'Active', 'Email Receive Time': '2026-05-17 12:44', 'Email Read Time': '2026-05-17 12:44', 'Comments': 'Successfully parsed sheet -> 118 rates modified.', 'File Status': 'Processed', 'Rejected by': 'None', 'Rejected Time': 'N/A' }
  ],
  'SOA': [
    { 'INFO ID': 'SOA-2026-001', 'ENTERPRISE NAME': 'ABC Corp', 'OPENING BALANCE': '$15,400.00', 'TOTAL CREDIT': '$45,800.00', 'TOTAL DEBIT': '$31,200.00', 'CLOSING BALANCE': '$30,000.00' },
    { 'INFO ID': 'SOA-2026-002', 'ENTERPRISE NAME': 'XYZ Telecom', 'OPENING BALANCE': '$45,210.50', 'TOTAL CREDIT': '$12,500.00', 'TOTAL DEBIT': '$24,800.00', 'CLOSING BALANCE': '$32,910.50' },
    { 'INFO ID': 'SOA-2026-003', 'ENTERPRISE NAME': 'Global SMS', 'OPENING BALANCE': '-$5,000.00', 'TOTAL CREDIT': '$18,900.00', 'TOTAL DEBIT': '$15,400.00', 'CLOSING BALANCE': '-$1,500.00' },
    { 'INFO ID': 'SOA-2026-004', 'ENTERPRISE NAME': 'Digital SMS Solutions', 'OPENING BALANCE': '$1,200.00', 'TOTAL CREDIT': '$8,450.00', 'TOTAL DEBIT': '$6,200.00', 'CLOSING BALANCE': '$3,450.00' }
  ],
};
